import { Component, signal } from '@angular/core';
import { NotificationAlertService } from '@core/services/notification-alert.service';
import { UtilisateurStateService } from '@store/utilisateur/utilisateur-state.service';
import { DemandeService } from '../demande.service';
import { Utilisateur } from '@core/interfaces/utilisateur.interface';
import { Pagination } from '@core/interfaces/pagination.interface';
import { DemandeEnquete } from '@modules/demandeur/dashboard/dashboard';
import { ApiResponse } from '@core/interfaces/api-response.interface';
import { ResponseError } from '@core/interfaces/response-error.interface';

@Component({
  selector: 'app-demande-terminer',
  templateUrl: './demande-terminer.component.html',
  styleUrls: ['./demande-terminer.component.css']
})
export class DemandeTerminerComponent {
  pageTitle = "Enquêtes Terminées";
pageSubTitle = "Explorez la liste complète de vos demandes dont les enquêtes ont été menées à bien.";

  loading = signal<boolean>(false);
  demandes = signal<DemandeEnquete[]>([])
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
      next: (response: ApiResponse<DemandeEnquete>) => {
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
