import {Component, OnInit} from '@angular/core';
import {DemandeEnquete, FilterOptions} from "@modules/enqueteur/enquetes/nouveau-enquete/model";
import {NouveauEnqueteService} from "@modules/enqueteur/enquetes/nouveau-enquete/nouveau-enquete.service";

@Component({
  selector: 'app-enquete-list',
  templateUrl: './enquete-list.component.html',
  styleUrls: ['./enquete-list.component.css']
})
export class EnqueteListComponent implements OnInit {
  demandes: DemandeEnquete[] = []
  filteredDemandes: DemandeEnquete[] = []
  currentFilters: FilterOptions = {
    searchTerm: "",
    priorite: "",
    typeConcerne: "",
    sortBy: "",
  }

  constructor(private enqueteService: NouveauEnqueteService) {
  }

  ngOnInit(): void {
    this.loadDemandes()
  }

  loadDemandes(): void {
    this.enqueteService.getDemandesEnquete().subscribe((demandes: any) => {
      this.demandes = demandes
      this.applyFilters()
    })
  }

  onFiltersChanged(filters: FilterOptions): void {
    this.currentFilters = filters
    this.applyFilters()
  }

  applyFilters(): void {
    let filtered = [...this.demandes]

    // Filtre par terme de recherche
    if (this.currentFilters.searchTerm) {
      const term = this.currentFilters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (demande) => demande.objet.toLowerCase().includes(term) || demande.description.toLowerCase().includes(term),
      )
    }

    // Filtre par priorité
    if (this.currentFilters.priorite) {
      filtered = filtered.filter((demande) => demande.priorite === this.currentFilters.priorite)
    }

    // Filtre par type de concerné
    if (this.currentFilters.typeConcerne) {
      filtered = filtered.filter(
        (demande) => demande.concernes[0]?.typeConcerne.code === this.currentFilters.typeConcerne,
      )
    }

    // Tri
    if (this.currentFilters.sortBy) {
      filtered.sort((a, b) => {
        switch (this.currentFilters.sortBy) {
          case "priorite":
            const prioriteOrder = {HAUTE: 3, MOYENNE: 2, BASSE: 1}
            return (prioriteOrder[b.priorite] || 0) - (prioriteOrder[a.priorite] || 0)
          case "echeance":
            return new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime()
          default:
            return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
        }
      })
    }

    this.filteredDemandes = filtered
  }

  onAccepterDemande(id: number): void {
    this.enqueteService.accepterDemande(id).subscribe((success: any) => {
      if (success) {
        this.demandes = this.demandes.filter((d) => d.id !== id)
        this.applyFilters()
        console.log("Demande acceptée")
      }
    })
  }

  onRefuserDemande(id: number): void {
    this.enqueteService.refuserDemande(id).subscribe((success: any) => {
      if (success) {
        this.demandes = this.demandes.filter((d) => d.id !== id)
        this.applyFilters()
        console.log("Demande refusée")
      }
    })
  }
}
