import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  type OnInit,
  type OnChanges,
  type SimpleChanges,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormControl, ReactiveFormsModule } from "@angular/forms"
import type { DocumentModel } from "@core/model/document.model"
import type { Pagination } from "@core/interfaces/pagination.interface"
import { DocumentService } from "@modules/enqueteur/traitement/document/document.service"
import { EnqueteService } from "@modules/enqueteur/enquetes/enquete.service"
import { UtilService } from "@core/services/util.service"
import { Pagination1Component } from "@shared/components/pagination1/pagination1.component"
import { Logger } from "@core/services/logger.service"
import { LoaderComponent } from "@shared/components/loader/loader.component"

@Component({
  selector: 'app-existing-documents-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Pagination1Component, LoaderComponent],
  templateUrl: './existing-documents-modal.component.html',
  styleUrls: ['./existing-documents-modal.component.css']
})
export class ExistingDocumentsModalComponent implements OnInit, OnChanges {
  @Input() show = false
  @Input() enqueteId?: number
  @Input() userId?: number
  @Input() associatedDocuments: DocumentModel[] = []
  @Output() close = new EventEmitter<void>()
  @Output() documentsAssociated = new EventEmitter<DocumentModel[]>()

  private allDocuments: DocumentModel[] = [];
  existingDocuments: DocumentModel[] = []
  selectedExistingDocuments: DocumentModel[] = []
  searchControl = new FormControl("")
  searchTerm = ""
  isLoadingExistingDocuments = false

  pagination: Pagination = {
    totalItem: 1,
    totalPage: 1,
    limit: 10,
    page: 1,
  }

  private readonly documentService = inject(DocumentService)
  private readonly enqueteService = inject(EnqueteService)
  protected readonly utilService = inject(UtilService)

  ngOnInit(): void {
    this.setupSearchListener()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["show"] && this.show && this.enqueteId && this.userId) {
      this.loadExistingDocuments()
      this.selectedExistingDocuments = []
    }
  }

  private setupSearchListener(): void {
    this.utilService.setupSearchListener(this.searchControl, (query: string) => {
      this.searchTerm = query
      this.onSearchChange()
    })
  }

  private loadExistingDocuments(search = ""): void {
    if (!this.userId || !this.enqueteId) return

    this.isLoadingExistingDocuments = true
    this.documentService
      .getAll({
        utilisateurId: this.userId,
        enqueteId: this.enqueteId,
        excludeEnquete: true,
        ...this.pagination,
        search,
      })
      .subscribe({
        next: (response) => {
          this.existingDocuments = response.data
          this.allDocuments = [...response.data];
          this.pagination = response.pagination
          this.isLoadingExistingDocuments = false
        },
        error: (err) => {
          this.isLoadingExistingDocuments = false
          this.utilService.showNotification("Erreur lors du chargement des documents", "error")
        },
      })
  }

  setPagination(pg: Pagination): void {
    this.pagination = pg
    this.loadExistingDocuments(this.searchTerm)
  }

  onSearchChange(): void {
    // Si on n'a qu'une seule page -> recherche interne
    if (this.pagination.totalPage === 1) {
      const term = this.searchTerm.toLowerCase().trim();
      if (term) {
        this.existingDocuments = this.allDocuments.filter(doc =>
          doc.nom.toLowerCase().includes(term) ||
          doc.type.libelle.toLowerCase().includes(term) ||
          (doc.description?.toLowerCase().includes(term) ?? false)
        );
      } else {
        // Réinitialisation de la recherche interne
        this.existingDocuments = [...this.allDocuments];
      }
    } else {
      // Sinon, on continue à interroger le backend
      this.loadExistingDocuments(this.searchTerm);
    }
  }

  toggleDocumentSelection(document: DocumentModel): void {
    const index = this.selectedExistingDocuments.findIndex((d) => d.id === document.id)
    if (index > -1) {
      this.selectedExistingDocuments.splice(index, 1)
    } else {
      const isAlreadyAssociated = this.associatedDocuments.some((d) => d.id === document.id)
      if (!isAlreadyAssociated) {
        this.selectedExistingDocuments.push(document)
      }
    }
  }

  isDocumentSelected(document: DocumentModel): boolean {
    return this.selectedExistingDocuments.some((d) => d.id === document.id)
  }

  isDocumentAlreadyAssociated(document: DocumentModel): boolean {
    return this.associatedDocuments.some((d) => d.id === document.id)
  }

  associateSelectedDocuments(): void {
    if (this.selectedExistingDocuments.length === 0 || !this.enqueteId) return

    this.enqueteService
      .associeDocuments(
        this.enqueteId,
        this.selectedExistingDocuments.map((d) => d.id),
      )
      .subscribe({
        next: (enquete) => {
          Logger.info(
            { message: "Enquete avec les nouveaux documents associés", data: enquete },
            "ExistingDocumentsModalComponent:associateSelectedDocuments",
          )
          this.documentsAssociated.emit(this.selectedExistingDocuments)
          this.close.emit()
        },
        error: (_) => {
          this.utilService.showNotification("Erreur lors de l'association des documents", "error")
          this.close.emit()
        },
      })
  }

  canAssociateDocuments(): boolean {
    return this.selectedExistingDocuments.length > 0
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
}