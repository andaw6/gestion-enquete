import { Component, signal } from '@angular/core';
import { NotificationAlertService } from '@core/services/notification-alert.service';
import { UtilisateurStateService } from '@store/utilisateur/utilisateur-state.service';
import { DemandeService } from '../demande.service';
import { Utilisateur } from '@core/interfaces/utilisateur.interface';
import { Pagination } from '@core/interfaces/pagination.interface';
import { ApiResponse } from '@core/interfaces/api-response.interface';
import { ResponseError } from '@core/interfaces/response-error.interface';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';
import { CommonModule, NgIf } from '@angular/common';
import { DemandesListeComponent } from '../components/demandes-liste/demandes-liste.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-demande-terminer',
  templateUrl: './demande-terminer.component.html',
  styleUrls: ['./demande-terminer.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    DemandesListeComponent,
    PageHeaderComponent,
    PaginationComponent,
    NgIf
  ],
})
export class DemandeTerminerComponent {
  pageTitle = "Enquêtes Terminées";
  pageSubTitle = "Explorez la liste complète de vos demandes dont les enquêtes ont été menées à bien.";

  loading = signal<boolean>(false);
  demandes = signal<DemandeEnqueteModel[]>([])
  user!: Utilisateur;
  pagination: Pagination = {
    limit: 10,
    page: 1,
    totalItem: 0,
    totalPage: 0
  };

  constructor(
    private readonly demandeService: DemandeService,
    private readonly toast: NotificationAlertService,
    private utilisateurState: UtilisateurStateService
  ) { }

  ngOnInit(): void {
    this.utilisateurState.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.loadData();
      }
    });

  }

  setPagination(pg: Pagination) {
    this.pagination = pg;
    this.loadData();
  }


  loadData() {
    this.loading.set(true);
    this.demandeService.getAll({
      ...this.pagination,
      sort: 'updatedAt,desc',
      utilisateurId: this.user.id,
      etatEnquete: "02"
    }).subscribe({
      next: (response: ApiResponse<DemandeEnqueteModel>) => {
        this.pagination = response.pagination;
        this.demandes.set(response.data);
      },
      error: (err: ResponseError) => {
        this.toast.showNotification("Erreur lors du chargement des données", "error");
      },
      complete: () => this.loading.set(false)
    });

    setTimeout(() => {
      console.log("stop loader");
      this.loading.set(false);
    }, 2000);
  }

  onVoirDemande(event: any) { }
  onTelechargerDemande(event: any) { }
}
