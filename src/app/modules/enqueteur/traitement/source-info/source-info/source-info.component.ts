import { Component } from '@angular/core';
import {RecentSource, Source} from "@modules/enqueteur/traitement/source-info/source-info"
@Component({
  selector: 'app-source-info',
  templateUrl: './source-info.component.html',
  styleUrls: ['./source-info.component.css']
})
export class SourceInfoComponent {
  sources: Source[] = [
    {
      id: "1",
      name: "Registre du Commerce",
      category: "Documents officiels",
      description:
        "Base de données officielle du registre du commerce pour vérifier l'existence et le statut des entreprises.",
      reliability: 5,
      status: "verified",
      usageCount: 45,
      lastUpdated: "Mise à jour: 15/01/2024",
      icon: "fas fa-file-alt",
      iconColor: "bg-blue-500",
      actionType: "access",
      isFavorite: true,
    },
    {
      id: "2",
      name: "M. Amadou Diop",
      category: "Contact expert",
      description:
        "Expert comptable spécialisé dans l'audit des PME. Contact privilégié pour les enquêtes financières.",
      reliability: 4,
      status: "available",
      usageCount: 12,
      lastUpdated: "Dernière fois: 10/01/2024",
      icon: "fas fa-user-tie",
      iconColor: "bg-green-500",
      actionType: "contact",
      isFavorite: false,
    },
    {
      id: "3",
      name: "ANSD Sénégal",
      category: "Base de données",
      description:
        "Agence Nationale de la Statistique et de la Démographie. Données officielles sur l'emploi et les entreprises.",
      reliability: 5,
      status: "official",
      usageCount: 78,
      lastUpdated: "Mise à jour: 20/01/2024",
      icon: "fas fa-globe",
      iconColor: "bg-purple-500",
      actionType: "access",
      isFavorite: true,
    },
    {
      id: "4",
      name: "Témoignage Employé",
      category: "Témoignage",
      description:
        "Témoignage d'un employé de SARL TechCorp concernant les conditions de travail et les pratiques de l'entreprise.",
      reliability: 3,
      status: "to-check",
      usageCount: 1,
      lastUpdated: "Recueilli: 18/01/2024",
      icon: "fas fa-microphone",
      iconColor: "bg-orange-500",
      actionType: "consult",
      isFavorite: false,
    },
    {
      id: "5",
      name: "Archives Nationales",
      category: "Archives",
      description:
        "Archives historiques des entreprises et documents administratifs anciens pour les enquêtes approfondies.",
      reliability: 4,
      status: "limited-access",
      usageCount: 8,
      lastUpdated: "Dernière visite: 05/01/2024",
      icon: "fas fa-archive",
      iconColor: "bg-red-500",
      actionType: "reserve",
      isFavorite: false,
    },
    {
      id: "6",
      name: "Presse Locale",
      category: "Médias",
      description:
        "Articles de presse et reportages locaux pouvant contenir des informations pertinentes sur les entreprises enquêtées.",
      reliability: 2,
      status: "to-cross-check",
      usageCount: 15,
      lastUpdated: "Mise à jour: 12/01/2024",
      icon: "fas fa-newspaper",
      iconColor: "bg-indigo-500",
      actionType: "search",
      isFavorite: false,
    },
  ]

  recentSources: RecentSource[] = [
    {
      id: 1,
      name: "Registre du Commerce",
      icon: "fas fa-file-alt",
      iconColor: "bg-blue-500",
      lastUsed: "Il y a 2 heures",
      context: "Utilisée dans l'enquête SARL TechCorp",
      actionType: "access",
    },
    {
      id: 2,
      name: "M. Amadou Diop",
      icon: "fas fa-user-tie",
      iconColor: "bg-green-500",
      lastUsed: "Hier",
      context: "Contacté pour l'enquête Marie Diallo",
      actionType: "contact",
    },
    {
      id: 3,
      name: "ANSD Sénégal",
      icon: "fas fa-globe",
      iconColor: "bg-purple-500",
      lastUsed: "Il y a 3 jours",
      context: "Consultée pour statistiques sectorielles",
      actionType: "consult",
    },
  ]

  filteredSources: Source[] = []
  paginatedSources: Source[] = []
  currentPage = 1
  itemsPerPage = 6
  isAddSourceModalOpen = false

  ngOnInit() {
    this.filteredSources = [...this.sources]
    this.updatePaginatedSources()
  }

  onFiltersChange(filters: any) {
    this.filteredSources = this.sources.filter((source) => {
      return true;
    })



    this.currentPage = 1
    this.updatePaginatedSources()
  }

  onPageChange(page: number) {
    this.currentPage = page
    this.updatePaginatedSources()
  }



  onSourceAction(event: { sourceId: string; action: string }) {
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

    this.filteredSources = [...this.sources]
    this.updatePaginatedSources()
  }

  onFavoriteToggle(sourceId: string) {
  }

  onActionClick(event: { sourceId: string; action: string }) {
  }

  private updatePaginatedSources() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    this.paginatedSources = this.filteredSources.slice(startIndex, endIndex)
  }



  private getIconForCategory(category: string): string {
    const icons: { [key: string]: string } = {
      "Documents officiels": "fas fa-file-alt",
      "Temoignages": "fas fa-microphone",
      "Bases de donnees": "fas fa-database",
      "Sites web": "fas fa-globe",
      "Contacts": "fas fa-user-tie",
      "Archives": "fas fa-archive",
    }
    return icons[category] || "fas fa-file"
  }

  private getColorForCategory(category: string): string {
    const colors: { [key: string]: string } = {
      "Documents officiels": "bg-blue-500",
      "Temoignages": "bg-orange-500",
      "Bases de donnees": "bg-purple-500",
      "Sites web": "bg-green-500",
      "Contacts": "bg-indigo-500",
      "Archives": "bg-red-500",
    }
    return colors[category] || "bg-gray-500"
  }
}
