import {Directive, signal, ViewChild} from '@angular/core';
import {EntityType} from "@core/interfaces/entity-type.interface";
import {GenericCrudComponent} from "@shared/components/generic-crud/generic-crud.component";
import {Observable, of} from "rxjs";
import {Pagination} from "@core/interfaces/pagination.interface";
import {SessionService} from "@core/services/session.service";
import {NotificationAlertService} from "@core/services/notification-alert.service";
import {map} from "rxjs/operators";
import {ResponseError} from "@core/interfaces/response-error.interface";

@Directive({
  selector: '[appBaseCrud]'
})
export abstract class BaseCrudDirective  <T extends EntityType> {

  @ViewChild('crudComponent') crudComponent!: GenericCrudComponent<T>;

  abstract readonly paginationKey: string;
  abstract service: {
    getAll: Function;
    create: Function;
    update: Function;
    deleteOne: Function;
  };

  data$!: Observable<T[]>;
  loading = signal(false);
  isSubmitting = false;
  existingCodes: string[] = [];

  pagination: Pagination = {
    page: 1,
    limit: 10,
    totalItem: 0,
    totalPage: 0,
  };

  protected constructor(
    protected sessionService: SessionService,
    protected notificationService: NotificationAlertService
  ) {}

  init(): void {
    if (typeof window !== 'undefined') {
      this.pagination.limit = this.sessionService.getData<number>(this.paginationKey) ?? 10;
    }
    this.loadData();
  }

  onLoadData(event: { pagination: Pagination }): void {
    this.pagination = event.pagination;
    this.loadData();
  }

  onCreateItem(event: { code: string; libelle: string }): void {
    this.isSubmitting = true;
    this.service.create(event).subscribe({
      next: (newItem: T) => {
        this.data$ = this.data$.pipe(map((items) => [newItem, ...items]));
        this.existingCodes.push(newItem.code);
        this.notificationService.showNotification('Créé avec succès', 'success');
        this.crudComponent.closeModal();
        this.isSubmitting = false;
      },
      error: (err: ResponseError) => {
        this.notificationService.showNotification(err.message || 'Erreur lors de la création', 'error');
        this.isSubmitting = false;
      },
    });
  }

  onUpdateItem(event: { id: number; data: { code: string; libelle: string } }): void {
    this.isSubmitting = true;
    this.service.update(event.id, event.data).subscribe({
      next: (updatedItem: T) => {
        this.data$ = this.data$.pipe(
          map((items) => items.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
        );
        this.updateExistingCodes(updatedItem);
        this.notificationService.showNotification('Mis à jour avec succès', 'success');
        this.isSubmitting = false;
        console.log((this.crudComponent as any));
        this.crudComponent.onModalClose()
      },
      error: (err: ResponseError) => {
        this.notificationService.showNotification(err.message || 'Erreur lors de la mise à jour', 'error');
        this.isSubmitting = false;
      },
    });
  }

  onDeleteItem(event: { id: number }): void {
    this.service.deleteOne(event.id).subscribe({
      next: () => {
        this.data$ = this.data$.pipe(map((items) => items.filter((item) => item.id !== event.id)));
        this.notificationService.showNotification('Supprimé avec succès', 'success');
      },
      error: (err: ResponseError) => {
        this.notificationService.showNotification(err.message || 'Erreur lors de la suppression', 'error');
      },
    });
  }

  onPageChanged(event: { pagination: Pagination }): void {
    this.pagination = event.pagination;
    this.sessionService.saveData(this.paginationKey, this.pagination.limit);
    this.loadData();
  }

  protected loadData(): void {
    this.loading.set(true);
    this.service
      .getAll({ ...this.pagination, sort: ['libelle'] })
      .subscribe({
        next: (response: { data: T[]; pagination: Pagination }) => {
          this.data$ = of(response.data);
          this.pagination = response.pagination;
          this.existingCodes = response.data.map((item) => item.code);
          this.loading.set(false);
        },
        error: (err: ResponseError) => {
          this.notificationService.showNotification('Erreur de chargement', 'error');
          this.loading.set(false);
        },
      });
  }

  protected updateExistingCodes(updatedItem: T): void {
    this.loadData();
    console.log(updatedItem);
  }

}
