import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { DemandsTableComponent } from '../list-demandes/components/demands-table/demands-table.component';
import { DetailModalComponent } from "../list-demandes/components/detail-modal/detail-modal.component";
import { DemandeService } from '@modules/demandeur/demandes/demande.service';
import { ToastService } from '@core/services/toast.service';
import { IParams } from '@core/interfaces/http-options.interface';
import { DemandeEnqueteModel, DemandeEtatDemande } from '@core/model/demande-enquete.model';
import { Pagination } from '@core/interfaces/pagination.interface';


@Component({
  selector: 'app-demande-avalidees',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DetailModalComponent, DemandsTableComponent],
  templateUrl: './demande-avalidees.component.html',
  styleUrls: ['./demande-avalidees.component.css']
})
export class DemandeAvalideesComponent implements OnInit {

  pageTitle = "Demandes d’enquête à valider";
  pageSubTitle = "Consultez, analysez et validez les demandes d’enquête en attente de traitement.";

  demandes: DemandeEnqueteModel[] = [];
  selectedDemande: DemandeEnqueteModel | null = null;
  isModalOpen = false
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

  loadDemande() {
    this.demandeService.getAll({ etat: DemandeEtatDemande.EnAttente, ...this.pagination, sort:"updatedAt,desc" }).subscribe({
      next: (response) => {
        this.pagination = response.pagination;
        this.demandes = response.data
      },
      error: (err) => { }
    })
  }


  setPagination(pg: Pagination) {
    this.pagination = pg;
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

  selectDemande(demande: DemandeEnqueteModel): void {
    // this.demandeService.selectDemande(demande)
    this.selectedDemande = demande;
    this.isModalOpen = true

  }

  closeModal(): void {
    this.isModalOpen = false
  }
}
