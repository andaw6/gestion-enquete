import {Component, TrackByFunction} from '@angular/core';
import {RecentSource, SourceFilters, SourceInfo} from "@modules/enqueteur/traitement/source-info/source-info";

@Component({
  selector: 'app-source-test',
  templateUrl: './source-test.component.html',
  styleUrls: ['./source-test.component.css']
})
export class SourceTestComponent {
  // Données d'exemple adaptées aux nouvelles interfaces
  sources: SourceInfo[] = [
    {
      id: 1,
      nom: "Registre du Commerce",
      description:
        "Base de données officielle du registre du commerce pour vérifier l'existence et le statut des entreprises.",
      commentaires: "Source très fiable pour les vérifications d'entreprises",
      niveauFiabilite: "TRES_ELEVEE",
      etat: { id: 1, code: "VERIFIED", libelle: "Vérifiée" },
      utilisateur: { id: 1, username: "admin" },
      documents: [
        {
          id: 1,
          nom: "Registre officiel",
          chemin: "/docs/registre.pdf",
          extension: "pdf",
          taille: 1024,
          version: 1,
          type: { id: 1, libelle: "Documents officiels", code: "OFFICIAL" },
        },
      ],
      dateObtention: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      nom: "M. Amadou Diop",
      description:
        "Expert comptable spécialisé dans l'audit des PME. Contact privilégié pour les enquêtes financières.",
      commentaires: "Très coopératif et disponible",
      niveauFiabilite: "ELEVEE",
      etat: { id: 2, code: "AVAILABLE", libelle: "Disponible" },
      utilisateur: { id: 2, username: "enqueteur1" },
      documents: [
        {
          id: 2,
          nom: "Carte de visite",
          chemin: "/docs/contact.jpg",
          extension: "jpg",
          taille: 512,
          version: 1,
          type: { id: 2, libelle: "Contact", code: "CONTACT" },
        },
      ],
      dateObtention: "2024-01-10T14:30:00Z",
      updatedAt: "2024-01-10T14:30:00Z",
    },
    // Ajoutez d'autres sources selon le même modèle...
  ]

  recentSources: RecentSource[] = [
    {
      id: 1,
      name: "This is a test",
      icon: "fas fa-file-alt",
      iconColor: "bg-blue-500",
      lastUsed: "Il y a 2 heures",
      context: "",
      actionType: "access"
    }
  ];


  filteredSources: SourceInfo[] = []
  paginatedSources: SourceInfo[] = []
  favoriteSourceIds: Set<number> = new Set()
  currentPage = 1
  itemsPerPage = 6
  isAddSourceModalOpen = false

  ngOnInit() {
    this.filteredSources = [...this.sources]
    this.updatePaginatedSources()
    this.updateStats()
  }

  onFiltersChange(filters: SourceFilters) {
    this.filteredSources = this.sources.filter((source) => {
      const matchesSearch =
        !filters.searchTerm ||
        source.nom.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        source.description.toLowerCase().includes(filters.searchTerm.toLowerCase())

      const matchesEtat = !filters.etatCode || source.etat.code === filters.etatCode
      const matchesReliability = !filters.niveauFiabilite || source.niveauFiabilite === filters.niveauFiabilite

      return matchesSearch && matchesEtat && matchesReliability
    })



    this.currentPage = 1
    this.updatePaginatedSources()
  }

  onPageChange(page: number) {
    this.currentPage = page
    this.updatePaginatedSources()
  }

  onFavoriteToggle(sourceId: number) {
    if (this.favoriteSourceIds.has(sourceId)) {
      this.favoriteSourceIds.delete(sourceId)
    } else {
      this.favoriteSourceIds.add(sourceId)
    }
    this.updateStats()
  }

  onSourceAction(event: { sourceId: number; action: string }) {
    console.log("Source action:", event)
    // Implement source action logic here
  }

  onRecentSourceAction(event: { sourceId: number; action: string }) {
    console.log("Recent source action:", event)
    // Implement recent source action logic here
  }

  openAddSourceModal() {
    this.isAddSourceModalOpen = true
  }

  closeAddSourceModal() {
    this.isAddSourceModalOpen = false
  }

  onAddSource(sourceData: any) {
    // Cette méthode devra être adaptée selon votre API
    console.log("Add source:", sourceData)
    this.closeAddSourceModal()
  }

  private updatePaginatedSources() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    this.paginatedSources = this.filteredSources.slice(startIndex, endIndex)
  }

  private updateStats() {

  }

  onActionClick($event: { sourceId: number; action: string }) {

  }
}
