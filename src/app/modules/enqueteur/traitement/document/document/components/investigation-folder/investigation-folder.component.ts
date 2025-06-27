import {Component, Input} from '@angular/core';
import {Document, Investigation} from "@modules/enqueteur/traitement/document/document";
import {Observable} from "rxjs";
import {DocumentService} from "@modules/enqueteur/traitement/document/document.service";

@Component({
  selector: 'app-investigation-folder',
  templateUrl: './investigation-folder.component.html',
  styleUrls: ['./investigation-folder.component.css']
})
export class InvestigationFolderComponent {
  @Input() investigation!: Investigation
  documents$!: Observable<Document[]>

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.documents$ = this.documentService.getDocumentsByInvestigation(this.investigation.id)
  }

  toggleExpansion(): void {
    this.documentService.toggleInvestigationExpansion(this.investigation.id)
  }

  getStatusClass(): string {
    switch (this.investigation.status) {
      case "EN_COURS":
        return "bg-secondary-100 text-secondary-800"
      case "PRETE_A_FINALISER":
        return "bg-success-100 text-success-800"
      case "A_CLASSER":
        return "bg-warning-100 text-warning-800"
      case "TERMINEE":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  getStatusLabel(): string {
    switch (this.investigation.status) {
      case "EN_COURS":
        return "En cours"
      case "PRETE_A_FINALISER":
        return "Prête à finaliser"
      case "A_CLASSER":
        return "À classer"
      case "TERMINEE":
        return "Terminée"
      default:
        return "Statut inconnu"
    }
  }

  getIconBgClass(): string {
    const colorMap: { [key: string]: string } = {
      primary: "bg-gradient-to-br from-primary-500 to-primary-600",
      secondary: "bg-gradient-to-br from-secondary-500 to-secondary-600",
      success: "bg-gradient-to-br from-success-500 to-success-600",
      warning: "bg-gradient-to-br from-warning-500 to-warning-600",
      error: "bg-gradient-to-br from-error-500 to-error-600",
    }
    return colorMap[this.investigation.couleur] || "bg-gradient-to-br from-gray-500 to-gray-600"
  }

  onViewDocument(document: Document): void {
    console.log("Viewing document:", document)
  }

  onDownloadDocument(document: Document): void {
    console.log("Downloading document:", document)
  }
}
