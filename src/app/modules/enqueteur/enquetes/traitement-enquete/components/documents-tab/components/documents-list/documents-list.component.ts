import { Component, Input, Output, EventEmitter, inject, OnInit, OnChanges, SimpleChanges } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { DocumentModel } from "@core/model/document.model"
import { UtilService } from "@core/services/util.service"
import { Pagination } from "@core/interfaces/pagination.interface"
import { PaginationComponent } from "@shared/components/pagination/pagination.component"

@Component({
  selector: 'app-documents-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.css']
})
export class DocumentsListComponent implements OnInit, OnChanges {
  @Input() documents: DocumentModel[] = []
  @Output() viewDocument = new EventEmitter<DocumentModel>()
  @Output() downloadDocument = new EventEmitter<DocumentModel>()
  @Output() deleteDocument = new EventEmitter<DocumentModel>()
  @Output() openUploadModal = new EventEmitter<void>()
  @Output() openExistingDocumentsModal = new EventEmitter<void>()
  pagination: Pagination = {
    totalItem: 1,
    totalPage: 1,
    limit: 5,
    page: 1
  };

  protected paginatedDocuments: DocumentModel[] = [];

  protected readonly utilService = inject(UtilService)

  ngOnInit(): void {
    this.updatePagination()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documents']) {
      this.updatePagination()
    }
  }

  /**
   * Mets à jour la pagination et la liste affichée
   */
  private updatePagination(): void {
    this.pagination.totalItem = this.documents.length
    this.pagination.totalPage = Math.ceil(this.pagination.totalItem / this.pagination.limit) || 1
    this.setPage(this.pagination)
  }

  /**
   * Change de page depuis la pagination externe
   */
  setPage(pg: Pagination): void {
    this.pagination = pg
    const start = (this.pagination.page - 1) * this.pagination.limit
    const end = start + this.pagination.limit
    this.paginatedDocuments = this.documents.slice(start, end)
  }

  canPreview(document: DocumentModel): boolean {
    return this.utilService.isPreviewable(document.extension)
  }

  formatDate(dateString: Date | null): string {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", error)
      return ""
    }
  }

  trackByDocumentId(index: number, document: DocumentModel): any {
    return document.id || index
  }
}
