import {Component, OnInit} from '@angular/core';
import {SourceInfo} from "@modules/enqueteur/traitement/source-info/source-info"
import {Observable, of} from "rxjs";
import {SourceInfoService} from "@modules/enqueteur/traitement/source-info/source-info.service";
import {Pagination} from "@core/interfaces/pagination.interface";
import {NotificationAlertService} from "@core/services/notification-alert.service";
import {ResponseError} from "@core/interfaces/response-error.interface";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-source-info',
  templateUrl: './source-info.component.html',
  styleUrls: ['./source-info.component.css']
})
export class SourceInfoComponent implements OnInit {

  sourceInfo$: Observable<SourceInfo[]> = of([]);
  loading: boolean = false;
  pagination: Pagination = {
    totalItem: 1,
    totalPage: 1,
    limit: 10,
    page: 1
  };
  showSourceId: number | null = null;
  private highlightedId: number | null = null;

  constructor(
    private sourceInfoService: SourceInfoService,
    private notificationService: NotificationAlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  loadData() {
    this.loading = true;
    this.sourceInfoService.getAll({...this.pagination, sort: 'updatedAt,desc'}).subscribe({
      next: response => {
        this.loading = false;
        this.pagination = response.pagination;
        this.sourceInfo$ = of(response.data);
        this.showSource(response.data);
      },
      error: (error: ResponseError) => {
        console.log(error);
        this.notificationService.showNotification(error.message || "Erreur lors de la récupération des sources d'information", "error");
        this.loading = false;
      }
    })
  }

  showSource(data: SourceInfo[]) {
    // On déclenche le clignotement après réception des données
    if (this.highlightedId !== null) {
      const found = data.some(s => s.id === this.highlightedId);
      if (found) {
        // active le clignotement pendant 1s
        this.showSourceId = this.highlightedId;
        setTimeout(() => {
          this.showSourceId = null;
        }, 2000);
      } else {
        this.showSourceId = null;
      }
    }
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const show = params.get("show");
      if (show !== null) {
        this.highlightedId = Number(show);
      }
    });

    this.loadData();
  }

  onFiltersChange(filters: any) {

  }

  setPagination(pag: Pagination) {
    this.pagination = pag;
    this.loadData();
  }

  actionClick($event: SourceInfo) {
    this.router.navigate(["/enqueteur/traitement/source-info", $event.id]).then(console.info);
  }

  updatedClick($event: SourceInfo): void {
    const {documents, utilisateur, ...rest} = $event;
    const data = {
      ...rest,
      type: $event.type.code,
      etat: $event.etat.code,
      documentIds: documents.map(d => d.id),
    };
    const previousDraft = localStorage.getItem("sourceInfo.draft");
    if (previousDraft) {
      localStorage.setItem("sourceInfo", previousDraft);
    }
    localStorage.setItem("sourceInfo.draft", JSON.stringify(data));
    this.router.navigate(['/enqueteur/traitement/source-info/nouveau'],
      // {queryParams: {edit: true}}
    ).then(console.info);
  }

}
