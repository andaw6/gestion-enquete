import { Component, Input } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { DocumentModel } from '@core/model/document.model';

@Component({
  selector: 'app-demande-documents-section',
  standalone: true,
  imports: [CommonModule, NgForOf],
  templateUrl: './demande-documents-section.component.html',
  styleUrls: ['./demande-documents-section.component.css']
})
export class DemandeDocumentsSectionComponent {
  @Input() documents: DocumentModel[] = []

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  formatDate(date: Date | null): string {
    if (!date) return ""
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date))
  }

  downloadDocument(document: DocumentModel) {
    console.log("Téléchargement du document:", document.nom)
  }
}
