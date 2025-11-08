import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DemandeEnqueteModel, DemandeEtatDemande } from '@core/model/demande-enquete.model';
import { Pagination } from '@core/interfaces/pagination.interface';
import { StatsCardsComponent } from './components/stats-cards/stats-cards.component';
import { FiltersComponent } from './components/filters/filters.component';
import { DemandsTableComponent } from './components/demands-table/demands-table.component';
import { DetailModalComponent } from "./components/detail-modal/detail-modal.component";
import { DemandeService } from '@modules/demandeur/demandes/demande.service';
import { ToastService } from '@core/services/toast.service';
import { IParams } from '@core/interfaces/http-options.interface';

@Component({
  selector: 'app-list-demandes',
  standalone: true,
  imports: [
    CommonModule,
    StatsCardsComponent,
    FiltersComponent,
    DemandsTableComponent,
    DetailModalComponent
  ],
  templateUrl: './list-demandes.component.html',
  styleUrls: ['./list-demandes.component.css']
})
export class ListDemandesComponent implements OnInit {
  demandes: DemandeEnqueteModel[] = [];
  selectedDemande: DemandeEnqueteModel | null = null;
  isModalOpen = false
  stats = { pending: 0, approved: 0, rejected: 0, total: 0 }
  pagination: Pagination = {
    page: 1,
    limit: 10,
    totalItem: 0,
    totalPage: 1
  }



  constructor(
    private readonly demandeService: DemandeService,
    private readonly toastService: ToastService,
  ) { }


  ngOnInit(): void {
    this.loadDemande();
  }

  loadDemande(filter: IParams = {}) {
    this.demandeService.getAll({ ...filter, ...this.pagination, sort: "updatedAt,desc" }).subscribe({
      next: (response) => {
        this.pagination = response.pagination;
        this.demandes = response.data
      },
      error: (err) => { }
    })
  }

  private changeEtatDemande(etat: DemandeEtatDemande, successMsg: string = ""): void {
    const demande = this.selectedDemande;
    if (!demande) return;

    this.demandeService.changeEtat(demande.id, etat).subscribe({
      next: (result: DemandeEnqueteModel) => {
        if (result) {
          if (this.isModalOpen) this.closeModal();
          this.demandes = [... this.demandes.map(d => {
            if (d.id == result.id) {
              return result;
            }
            return d;
          })]
          if (successMsg) {
            this.toastService.show(successMsg);
          }
        }
      },
      error: () => this.toastService.show("Erreur lors de la mise à jour de la demande", "error")
    });
  }

  setPagination(pg: Pagination) {
    this.pagination = pg;
  }

  updateStats(): void {
    // this.stats = this.demandeService.getStats()
  }

  selectDemande(demande: DemandeEnqueteModel): void {
    // this.demandeService.selectDemande(demande)
    this.selectedDemande = demande;
    this.isModalOpen = true
  }

  closeModal(): void {
    this.isModalOpen = false
  }

  approveDemande(event: { demande: DemandeEnqueteModel, commentaire: string }): void {
    console.log("tentative d'approuver une demande", event.demande)
    this.selectedDemande = event.demande;
    this.changeEtatDemande(DemandeEtatDemande.Valider, "Demande validée avec succès");
  }

  rejectDemande(event: { demande: DemandeEnqueteModel, commentaire: string }): void {
    this.selectedDemande = event.demande;
    this.changeEtatDemande(DemandeEtatDemande.Rejeter, "Demande rejetée avec succès");
    console.log('Rejeter demande:', event.demande.reference, 'Commentaire:', event.commentaire);
  }


  confirmApprove(data: { demande: DemandeEnqueteModel; comment: string }): void {
    // this.demandeService.approveDemande(data.demande.id, data.comment)
    this.updateStats()
  }

  confirmReject(data: { demande: DemandeEnqueteModel; comment: string }): void {
    // this.demandeService.rejectDemande(data.demande.id, data.comment)
    this.updateStats()
  }

  onFiltersChanged(filters: any): void {
    // Implémentez ici la logique de filtrage
    console.log("Filtres appliqués:", filters)
  }
}
