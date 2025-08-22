import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { DocumentModel } from '@core/model/document.model';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, NgClass, DatePipe],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent {
  @Input() documents: DocumentModel[] = []

  getDocumentIconClass(type: string): string {
    switch (type.toLowerCase()) {
      case "pdf":
        return "text-red-500"
      case "xlsx":
      case "xls":
        return "text-green-500"
      case "docx":
      case "doc":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  onTelecharger(document: DocumentModel): void {
    console.log("Télécharger document:", document.id)
  }
}
