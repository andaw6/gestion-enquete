import { Component } from '@angular/core';
import { EnqueteurModel } from '@core/model/enqueteur.model';
import { AssignmentData, FilterCriteria, StatsEnqueteur } from '../model';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';

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

  // Modal state
  isAssignModalOpen = false
  selectedEnquete: DemandeEnqueteModel | null = null

  // Pagination
  currentPage = 1
  itemsPerPage = 10
  totalPages = 1

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    // Simulation de données - remplacer par des appels API réels
    this.enquetes = this.getMockEnquetes()
    this.enqueteurs = this.getMockEnqueteurs()
    this.filteredEnquetes = [...this.enquetes]
    this.updatePagination()
  }

  onFilterChange(criteria: FilterCriteria) {
    this.filteredEnquetes = this.enquetes.filter((enquete) => {
      const matchesSearch =
        !criteria.searchTerm ||
        enquete.reference.toLowerCase().includes(criteria.searchTerm.toLowerCase()) ||
        enquete.objet.toLowerCase().includes(criteria.searchTerm.toLowerCase())

      const matchesPriorite =
        !criteria.priorite || this.getPrioriteLabel(enquete.priorite).toLowerCase() === criteria.priorite.toLowerCase()

      const matchesType = !criteria.type || enquete.etat.libelle.toLowerCase().includes(criteria.type.toLowerCase())

      return matchesSearch && matchesPriorite && matchesType
    })

    this.currentPage = 1
    this.updatePagination()
  }

  onResetFilters() {
    this.filteredEnquetes = [...this.enquetes]
    this.currentPage = 1
    this.updatePagination()
  }

  onAssignEnquete(enquete: DemandeEnqueteModel) {
    this.selectedEnquete = enquete
    this.isAssignModalOpen = true
  }

  onViewDetails(enquete: DemandeEnqueteModel) {
    console.log("Affichage des détails de l'enquête:", enquete.reference)
    // Implémenter la logique d'affichage des détails
  }

  onPageChange(page: number) {
    this.currentPage = page
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

      // Simulation de succès
      alert("Enquête assignée avec succès !")
      this.onCloseAssignModal()
      this.loadData() // Recharger les données
    }
  }

  private updatePagination() {
    this.totalPages = Math.ceil(this.filteredEnquetes.length / this.itemsPerPage)
  }

  private getPrioriteLabel(priorite: number): string {
    switch (priorite) {
      case 4:
        return "Urgente"
      case 3:
        return "Haute"
      case 2:
        return "Normale"
      case 1:
        return "Basse"
      default:
        return "Non définie"
    }
  }

  private getMockEnquetes(): DemandeEnqueteModel[] {
    return [
      {
        id: 1,
        reference: "ENQ-2024-001",
        objet: "Fraude comptable présumée",
        description: "Investigation sur des irrégularités comptables",
        urgent: true,
        commentaireValidation: "",
        priorite: 4,
        dateEcheance: new Date("2024-02-15"),
        dateValidation: null,
        dateAnnulation: null,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        etat: { code: "EN_ATTENTE", libelle: "Fraude" },
        concerne: {
          id: 1,
          type: "employeur",
          telephone: "0123456789",
          numero: "EMP001",
          regionSocial: "Direction Financière",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        documents: [],
      },
      {
        id: 2,
        reference: "ENQ-2024-002",
        objet: "Vol de matériel informatique",
        description: "Enquête sur la disparition d'équipements IT",
        urgent: false,
        commentaireValidation: "",
        priorite: 3,
        dateEcheance: new Date("2024-02-20"),
        dateValidation: null,
        dateAnnulation: null,
        createdAt: new Date("2024-01-14"),
        updatedAt: new Date("2024-01-14"),
        etat: { code: "EN_ATTENTE", libelle: "Vol" },
        concerne: {
          id: 2,
          type: "employeur",
          telephone: "0123456790",
          numero: "EMP002",
          regionSocial: "Service IT",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        documents: [],
      },
      {
        id: 3,
        reference: "ENQ-2024-003",
        objet: "Conflit d'intérêts",
        description: "Analyse d'une situation de conflit d'intérêts",
        urgent: false,
        commentaireValidation: "",
        priorite: 2,
        dateEcheance: new Date("2024-02-25"),
        dateValidation: null,
        dateAnnulation: null,
        createdAt: new Date("2024-01-13"),
        updatedAt: new Date("2024-01-13"),
        etat: { code: "EN_ATTENTE", libelle: "Corruption" },
        concerne: {
          id: 3,
          type: "employeur",
          telephone: "0123456791",
          numero: "EMP003",
          regionSocial: "RH",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        documents: [],
      },
    ]
  }

  private getMockEnqueteurs(): EnqueteurModel[] {
    return [
      {
        id: 1,
        nom: "Dupont",
        prenom: "Jean",
        specialite: "Spécialiste Fraude",
        disponible: true,
        enquetesEnCours: 0,
      },
      {
        id: 2,
        nom: "Leblanc",
        prenom: "Marie",
        specialite: "Expert Cybercriminalité",
        disponible: true,
        enquetesEnCours: 0,
      },
      {
        id: 3,
        nom: "Martin",
        prenom: "Pierre",
        specialite: "Enquêteur Senior",
        disponible: false,
        enquetesEnCours: 2,
      },
      {
        id: 4,
        nom: "Durand",
        prenom: "Sophie",
        specialite: "Spécialiste Corruption",
        disponible: true,
        enquetesEnCours: 0,
      },
      {
        id: 5,
        nom: "Rousseau",
        prenom: "Michel",
        specialite: "Expert Vol",
        disponible: false,
        enquetesEnCours: 1,
      },
    ]
  }
}
