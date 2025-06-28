import {Component, OnDestroy, OnInit, Renderer2, signal, WritableSignal} from '@angular/core';
import {DocumentService} from "@modules/enqueteur/traitement/document/document.service";
import {Document, DocumentStats, FilterOptions} from "@modules/enqueteur/traitement/document/document";
import {Observable, of, Subject} from "rxjs";
import {NotificationAlertService} from "@core/services/notification-alert.service";
import {Pagination} from "@core/interfaces/pagination.interface";
import {ApiResponse} from "@core/interfaces/api-response.interface";
import {ResponseError} from "@core/interfaces/response-error.interface";
import {TypeDocument} from "@modules/admin/parametrage/type-document/type-document";
import {TypeDocumentService} from "@modules/admin/parametrage/type-document/type-document.service";

@Component({
  selector: 'app-document-sans-enquete',
  templateUrl: './document-sans-enquete.component.html',
  styleUrls: ['./document-sans-enquete.component.css'],
})
export class DocumentSansEnqueteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  documents$: Observable<Document[]> = of([]);
  typeDocument$: Observable<TypeDocument[]> = of([]);
  pagination: Pagination = {
    page: 1,
    limit: 10,
    totalItem: 0,
    totalPage: 0,
  };
  currentFilters: FilterOptions = {
    searchTerm: "",
    filterType: "all",
    sortBy: "date",
    viewMode: "grid",
  }
  isUploadModalOpen = false
  isPreviewModalOpen = false
  selectedDocument: Document | null = null


  constructor(
    private documentService: DocumentService,
    private typeDocumentService: TypeDocumentService,
    private notificationService: NotificationAlertService,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit(): void {
    this.loadTypeDocument();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadData(): void {
    this.documentService.getAll({...this.pagination}).subscribe({
      next: (response: ApiResponse<Document>) => {
        this.documents$ = of(response.data);
        this.pagination = response.pagination;
      },
      error: (err: ResponseError) => {
        this.notificationService.showNotification(
          err.message || 'Erreur lors du chargement des documents',
          'error'
        );
      }
    })
  }

  loadTypeDocument(): void {
    this.typeDocumentService.getAll().subscribe({
      next: (response: ApiResponse<TypeDocument>) => {
        this.typeDocument$ = of(response.data);
      },
      error: (err: ResponseError) => {
        this.notificationService.showNotification(
          err.message || 'Erreur lors du chargement des types de documents',
          'error'
        );
      }
    })
  }


  onFiltersChange(filters: FilterOptions): void {
    this.currentFilters = filters
    this.applyFilters()
  }

  private applyFilters(): void {
    // let filtered = [...this.allDocuments]
    //
    // // Apply search filter
    // if (this.currentFilters.searchTerm) {
    //   filtered = filtered.filter((doc) => doc.name.toLowerCase().includes(this.currentFilters.searchTerm.toLowerCase()))
    // }
    //
    // // Apply type filter
    // if (this.currentFilters.filterType !== "all") {
    //   filtered = filtered.filter((doc) => doc.type.toLowerCase().includes(this.currentFilters.filterType.toLowerCase()))
    // }
    //
    // // Apply sorting
    // filtered.sort((a, b) => {
    //   switch (this.currentFilters.sortBy) {
    //     case "name":
    //       return a.name.localeCompare(b.name)
    //     case "type":
    //       return a.type.localeCompare(b.type)
    //     case "size":
    //       return a.size.localeCompare(b.size)
    //     case "date":
    //     default:
    //       return (
    //         new Date(b.dateAdded.split("/").reverse().join("-")).getTime() -
    //         new Date(a.dateAdded.split("/").reverse().join("-")).getTime()
    //       )
    //   }
    // })
    //
    // this.filteredDocuments = filtered
  }

  onUploadClick(): void {
    this.isUploadModalOpen = true
  }

  onUploadModalClose(): void {
    this.isUploadModalOpen = false
  }

  onUpload(data: { files: File[]; investigation: string; documentType: string }): void {
    // console.log("Upload files:", data)
    // // Here you would typically upload the files to your backend
    // // For now, we'll just add mock documents
    // data.files.forEach((file, index) => {
    //   const newDoc: Document = {
    //     id: Date.now().toString() + index,
    //     name: file.name,
    //     type: file.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
    //     size: this.formatFileSize(file.size),
    //     dateAdded: new Date().toLocaleDateString("fr-FR"),
    //     fileType: this.getFileTypeFromExtension(file.name),
    //   }
    //   this.documentService.addDocument(newDoc)
    // })
  }

  onPreviewClick(document: Document): void {
    this.selectedDocument = document
    this.isPreviewModalOpen = true
  }
  onDownloadClick(document: Document): void {
    console.log("Download document:", document);
    this.documentService.getView(document.id, { download: true }).subscribe({
      next: (blob: Blob) => {
        const fileName = `${document.nom}.${document.extension}`;
        const url = URL.createObjectURL(blob);
        const link = this.renderer.createElement('a');
        this.renderer.setAttribute(link, 'href', url);
        this.renderer.setAttribute(link, 'download', fileName);
        link.click();
        URL.revokeObjectURL(url);
        this.notificationService.showNotification("Téléchargement du document effectué", "success");
      },
      error: (err) => {
        console.error(err);
        this.notificationService.showNotification("Erreur lors du téléchargement du document", "error");
      }
    });
  }


  onDeleteClick(document: Document): void {
    console.log("Delete document:", document)
  }
}
