import { Injectable } from '@angular/core';
import {SourceInfo} from "@modules/enqueteur/traitement/source-info/source-info";

@Injectable({
  providedIn: 'root'
})
export class SourceMappingService {
  getIconForSourceType(sourceInfo: SourceInfo): string {
    // Logique pour déterminer l'icône basée sur le type de documents ou autres critères
    if (sourceInfo.documents.length > 0) {
      const firstDocType = sourceInfo.documents[0].type.code
      switch (firstDocType) {
        case "OFFICIAL":
          return "fas fa-file-alt"
        case "TESTIMONY":
          return "fas fa-microphone"
        case "DATABASE":
          return "fas fa-database"
        case "WEBSITE":
          return "fas fa-globe"
        case "CONTACT":
          return "fas fa-user-tie"
        case "ARCHIVE":
          return "fas fa-archive"
        default:
          return "fas fa-file"
      }
    }
    return "fas fa-file"
  }

  getIconColorForSourceType(sourceInfo: SourceInfo): string {
    if (sourceInfo.documents.length > 0) {
      const firstDocType = sourceInfo.documents[0].type.code
      switch (firstDocType) {
        case "OFFICIAL":
          return "bg-blue-500"
        case "TESTIMONY":
          return "bg-orange-500"
        case "DATABASE":
          return "bg-purple-500"
        case "WEBSITE":
          return "bg-green-500"
        case "CONTACT":
          return "bg-indigo-500"
        case "ARCHIVE":
          return "bg-red-500"
        default:
          return "bg-gray-500"
      }
    }
    return "bg-gray-500"
  }

  getActionTypeForSource(sourceInfo: SourceInfo): "access" | "contact" | "consult" | "reserve" | "search" {
    if (sourceInfo.documents.length > 0) {
      const firstDocType = sourceInfo.documents[0].type.code
      switch (firstDocType) {
        case "CONTACT":
          return "contact"
        case "ARCHIVE":
          return "reserve"
        case "WEBSITE":
          return "search"
        default:
          return "access"
      }
    }
    return "access"
  }

  getCategoryFromDocuments(sourceInfo: SourceInfo): string {
    if (sourceInfo.documents.length > 0) {
      return sourceInfo.documents[0].type.libelle
    }
    return "Non catégorisé"
  }

  getStatusClass(etatCode: string): string {
    const classes: { [key: string]: string } = {
      VERIFIED: "bg-green-100 text-green-800",
      AVAILABLE: "bg-blue-100 text-blue-800",
      TO_CHECK: "bg-yellow-100 text-yellow-800",
      OFFICIAL: "bg-green-100 text-green-800",
      LIMITED_ACCESS: "bg-gray-100 text-gray-800",
      TO_CROSS_CHECK: "bg-orange-100 text-orange-800",
    }
    return classes[etatCode] || "bg-gray-100 text-gray-800"
  }

  getReliabilityNumber(niveauFiabilite: string): number {
    switch (niveauFiabilite.toUpperCase()) {
      case "TRES_ELEVEE":
        return 5
      case "ELEVEE":
        return 4
      case "MOYENNE":
        return 3
      case "FAIBLE":
        return 2
      case "TRES_FAIBLE":
        return 1
      default:
        return 3
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR")
  }

  getUsageCount(sourceInfo: SourceInfo): number {
    // Cette information n'est pas dans l'interface backend
    // Vous devrez l'ajouter ou la calculer différemment
    return Math.floor(Math.random() * 100) // Valeur temporaire
  }
}
