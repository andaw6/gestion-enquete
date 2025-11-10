import { Component } from '@angular/core';
import { EnqueteurModel } from '@core/model/enqueteur.model';
import { AssignmentData, FilterCriteria, StatsEnqueteur } from '../model';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';
import { EnqueteService } from '@modules/enqueteur/enquetes/enquete.service';
import { ToastService } from '@core/services/toast.service';
import { Logger } from '@core/services/logger.service';
import { IParams } from '@core/interfaces/http-options.interface';
import { Pagination } from '@core/interfaces/pagination.interface';
import { EnqueteModel } from '@core/model/enquete.model';

@Component({
  selector: 'app-assignation',
  templateUrl: './assignation.component.html',
  styleUrls: ['./assignation.component.css']
})
export class AssignationComponent {

  pageTitle: string = "Assignation des Enquêtes";
  pageSubTitle: string = "Organisez et attribuez efficacement les enquêtes à vos enquêteurs";
  stats: StatsEnqueteur = {
    nonAssignees: 12,
    urgentes: 4,
    enqueteursLibres: 8,
    aujourdhui: 3,
  }
  enquetes: DemandeEnqueteModel[] = []
  filteredEnquetes: DemandeEnqueteModel[] = []
  enqueteurs: EnqueteurModel[] = []
  pagination: Pagination = {
    page: 1,
    limit: 10,
    totalItem: 0,
    totalPage: 1,
  }
  // Modal state
  isAssignModalOpen = false
  selectedEnquete: DemandeEnqueteModel | null = null;
  openDetailModal = false;

  constructor(
    private readonly enqueteService: EnqueteService,
    private readonly toastService: ToastService,
  ) { }

  ngOnInit() {
    // this.loadData()
    this.loadEnquete();
  }

  loadEnquete(filter: IParams = {}) {
    this.enqueteService.getAll({
      assignee: false,
      ...filter,
      ...this.pagination
    }).subscribe({
      next: (response) => {
        // Logger.info({ message: "Les enquetes", data: response.data });
        this.pagination = response.pagination;
        this.enquetes = [...response.data.map(d => this.map(d))];
      },
      error: (err) => {
        this.toastService.show('Erreur lors de la récupération des données', "error");
      }
    })
    this.enqueteurs = this.getMockEnqueteurs()

  }


  map(enquete: EnqueteModel): DemandeEnqueteModel {
    return {
      ...enquete.demande!,
      enquete: {
        ...enquete,
        demande: undefined,
        enqueteur: undefined,
        autresInfos: undefined,
        documents: undefined,
        conclusions: undefined,
        sourcesInfos: undefined
      }
    }
  }

  onFilterChange(criteria: FilterCriteria) {
    console.log(criteria);
  }

  onResetFilters() {

  }

  onAssignEnquete(enquete: DemandeEnqueteModel) {
    this.selectedEnquete = enquete
    this.isAssignModalOpen = true
  }

  onViewDetails(enquete: DemandeEnqueteModel) {
    console.log("Affichage des détails de l'enquête:", enquete.reference)
    // Implémenter la logique d'affichage des détails
    this.selectedEnquete = enquete;
    this.openDetailModal = true;
  }

  onPageChange(event: Pagination) {
    this.pagination = { ...event };
    this.loadEnquete();
  }



  onCloseAssignModal() {
    this.isAssignModalOpen = false
    this.selectedEnquete = null
  }

  onAssign(assignmentData: AssignmentData) {
    if (this.selectedEnquete) {
      console.log(
        "Assignation de l'enquête:",
        this.selectedEnquete.reference,
        "à l'enquêteur:",
        assignmentData.enqueteurId,
      )

      // Implémenter la logique d'assignation
      this.enqueteService.assigneEnqueteur(this.selectedEnquete.enquete?.id!, assignmentData).subscribe({
        next: (response) => {
          this.toastService.show("Enquête assignée avec succès !");
          this.enquetes = [...this.enquetes.filter(e => e.id != this.selectedEnquete?.id)]
          this.onCloseAssignModal()
        },
        error: (err) => {
          this.toastService.show("Erreur lors de l'assignation", "error");
        }
      });

    }
  }





  private getMockEnqueteurs(): EnqueteurModel[] {
    return [
      {
        id: 27,
        nom: "Ciss",
        prenom: "Elhadji",
        specialite: "Expert Vol",
        disponible: false,
        enquetesEnCours: 1,
      },
    ]
  }
}
