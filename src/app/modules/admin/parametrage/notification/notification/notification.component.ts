import {Component, HostListener, OnDestroy, OnInit, signal} from '@angular/core';
import {Notification, NotificationFilter, NotificationStats} from '../notification';
import {NotificationService} from '../notification.service';
import {ThemeService} from '@core/services/theme.service';
import {map, Observable, of, Subscription} from 'rxjs';
import {NotificationAlertService} from '@core/services/notification-alert.service';
import {Pagination} from '@core/interfaces/pagination.interface';
import {ResponseError} from '@core/interfaces/response-error.interface';
import {SessionService} from "@core/services/session.service";
import {state} from "@angular/animations";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  readonly NOTIFICATION_LIMIT_KEY: string = "notification.pagination.limit";

  // UI
  modalOpen = false;
  loading = signal(false);

  // Données
  notifications$!: Observable<Notification[]>;
  selectedNotifications = new Set<number>();
  selectedNotification: Notification | null = null;
  stats: NotificationStats = {total: 0, unread: 0, read: 0, urgent: 0};

  // Filtres et pagination
  filter: NotificationFilter = {
    search: '',
    type: '',
    status: 'all',
  };
  pagination: Pagination = {
    page: 1,
    limit: 10,
    totalItem: 0,
    totalPage: 0,
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private notificationService: NotificationService,
    private themeService: ThemeService,
    private toastService: NotificationAlertService,
    private sessionService: SessionService,
  ) {
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.pagination.limit = this.sessionService.getData<number>(this.NOTIFICATION_LIMIT_KEY) ?? 10;
    }
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && ['a', 'r'].includes(event.key)) {
      event.preventDefault();
      if (event.key === 'a') this.onMarkAllAsRead();
      if (event.key === 'r') this.onRefresh();
    }
    if (event.key === 'Escape') this.onCloseModal();
  }

  // -------------------------
  // Chargement et pagination
  // -------------------------
  loadData(): void {
    this.loading.set(true);

    this.notificationService.getStats().subscribe((stats: NotificationStats | null) => {
      if (stats) {
        this.stats = stats;
      }
    })

    let request$: Observable<{ data: Notification[]; pagination: Pagination }>;

    let filter: any = {...this.pagination, typeNotification: this.filter.type.toLowerCase()};
    if (!filter.typeNotification) {
      delete filter["typeNotification"];
    }

    switch (this.filter.status) {
      case 'read':
        request$ = this.notificationService.getRead(filter);
        break;
      case 'unread':
        request$ = this.notificationService.getNotRead(filter);
        break;
      case 'urgent':
        request$ = this.notificationService.getUrgent(filter);
        break;
      case 'all':
      default:
        request$ = this.notificationService.getAll(filter);
        break;
    }

    const sub = request$.subscribe({
      next: (dt) => {
        this.notifications$ = of(dt.data);
        this.pagination = dt.pagination;
        this.loading.set(false);
      },
      error: (err: ResponseError) => {
        this.toastService.showNotification(
          err.message || 'Erreur lors du chargement des notifications',
          'error'
        );
        this.loading.set(false);
      }
    });

    this.subscriptions.push(sub);
  }


  setPagination(p: Pagination): void {
    this.pagination = p;
    this.sessionService.saveData(this.NOTIFICATION_LIMIT_KEY, this.pagination.limit);
    this.loadData();
  }


  // -------------------------
  // Filtres
  // -------------------------

  onFilterChange(filter: NotificationFilter): void {
    this.filter = {...filter};
    this.pagination.page = 1;
    this.selectedNotifications.clear();
    this.loadData();
  }

  // -------------------------
  // Actions principales
  // -------------------------
  onMarkAsRead(id: number): void {
    const sub = this.notificationService.markRead(id).subscribe({
      next: result => {
        this.notifications$ = this.notifications$.pipe(
          map(notifs =>
            notifs.map(notif => (notif.id === result.id ? result : notif))
          )
        );

        if(this.filter.status === 'unread') {
          this.notifications$ = this.notifications$.pipe(
            map(notifs => notifs.filter(notif => notif.id !== id)),
          )
        }
        this.toastService.showNotification("Notification lu", "success");
        this.stats.read++;
        this.stats.unread--;
      },
      error: (err: ResponseError) => {
        this.toastService.showNotification(
          err.message || "Erreur lors du marquage de la notification comme lue",
          "error"
        );
      }
    });
    this.subscriptions.push(sub);
  }

  onDeleteNotification(id: number): void {
    const sub = this.notificationService.deleteOne(id).subscribe({
      next: () => {
        this.notifications$ = this.notifications$.pipe(
          map(notifs => notifs.filter(notif => notif.id !== id))
        );
        this.toastService.showNotification("Notification supprimer", "success");
      },
      error: (err: ResponseError) => {
        this.toastService.showNotification(
          err.message || "Erreur lors de la suppression",
          "error"
        );
      }
    });
    this.subscriptions.push(sub);
  }

  onMarkAllAsRead(): void {
    const ids = this.notifications$.pipe(map(notifs => notifs.map(notif => notif.id)));
    console.log(ids)
    // const sub = this.notificationService.markAllAsRead().subscribe({
    //   next: () => {
    //     this.loadData();
    //     this.toastService.showNotification("Toutes les notifications ont été marquées comme lues", "success");
    //   },
    //   error: (err: ResponseError) => {
    //     this.toastService.showNotification(err.message || "Erreur lors du marquage", "error");
    //   }
    // });
    // this.subscriptions.push(sub);
  }

  onMarkSelectedAsRead(): void {
    const ids = Array.from(this.selectedNotifications);
    if (ids.length === 0) return;

    const sub = this.notificationService.markManyRead(ids).subscribe({
      next: () => {
        this.loadData();
        this.toastService.showNotification(`${ids.length} notifications marquées comme lues`, "success");
      },
      error: (err: ResponseError) => {
        this.toastService.showNotification(err.message || "Erreur lors du marquage", "error");
      }
    });
    this.subscriptions.push(sub);
  }

  onDeleteSelected(): void {
    const ids = Array.from(this.selectedNotifications);
    if (ids.length === 0) return;

    const sub = this.notificationService.deleateMany(ids).subscribe({
      next: () => {
        this.loadData();
        this.toastService.showNotification(`${ids.length} notifications supprimées`, "success");
      },
      error: (err: ResponseError) => {
        this.toastService.showNotification(err.message || "Erreur lors de la suppression", "error");
      }
    });
    this.subscriptions.push(sub);
  }

  onToggleSelection(id: number): void {
    this.selectedNotifications.has(id)
      ? this.selectedNotifications.delete(id)
      : this.selectedNotifications.add(id);
  }

  // -------------------------
  // Modal
  // -------------------------
  onOpenModal(notification: Notification): void {
    this.selectedNotification = notification;
    this.modalOpen = true;

    if (!notification.lu) {
      this.onMarkAsRead(notification.id);
    }
  }

  onCloseModal(): void {
    this.modalOpen = false;
    this.selectedNotification = null;
  }

  // -------------------------
  // Autres actions
  // -------------------------
  onRefresh(): void {
    this.loadData();
    this.toastService.showNotification("Notifications actualisées", "info");
  }

}
