import {Component, OnDestroy, OnInit} from '@angular/core';
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
  private destroy$ = new Subject<void>()
  documents$: Observable<Document[]> = of([]);
  typeDocument$: Observable<TypeDocument[]> = of([]);

  pagination: Pagination = {
    page: 1,
    limit: 10,
    totalItem: 0,
    totalPage: 0,
  };

  stats: DocumentStats = {
    totalDocuments: 0,
    fileTypes: 0,
    addedThisMonth: 0,
    totalSize: "0 MB",
  }

  currentFilters: FilterOptions = {
    searchTerm: "",
    filterType: "all",
    sortBy: "date",
    viewMode: "grid",
  }

  isUploadModalOpen = false
  isPreviewModalOpen = false
  selectedDocument: Document | null = null

  showPreviewModal = false;

  onPreviewModalClose() {
    this.showPreviewModal = false
    this.selectedDocument = null
  }

  constructor(
    private documentService: DocumentService,
    private typeDocumentService: TypeDocumentService,
    private notificationService: NotificationAlertService,
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

  onDocumentClick(document: Document): void {
    this.selectedDocument = document
    this.isPreviewModalOpen = true
  }

  onPreviewClick(document: Document): void {
    this.isPreviewModalOpen = true
  }



  onDownloadClick(document: Document): void {
    console.log("Download document:", document)
    // Here you would typically trigger the download
  }

  onDeleteClick(document: Document): void {
    // if (confirm(`Êtes-vous sûr de vouloir supprimer "${document.name}" ?`)) {
    //   this.documentService.deleteDocument(document.id)
    // }
  }

  // private formatFileSize(bytes: number): string {
  //   if (bytes === 0) return "0 B"
  //   const k = 1024
  //   const sizes = ["B", "KB", "MB", "GB"]
  //   const i = Math.floor(Math.log(bytes) / Math.log(k))
  //   return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  // }
  //
  // private getFileTypeFromExtension(filename: string): Document["fileType"] {
  //   const ext = filename.split(".").pop()?.toLowerCase()
  //   switch (ext) {
  //     case "pdf":
  //       return "pdf"
  //     case "xls":
  //     case "xlsx":
  //       return "excel"
  //     case "jpg":
  //     case "jpeg":
  //     case "png":
  //     case "gif":
  //       return "image"
  //     case "mp3":
  //     case "wav":
  //       return "audio"
  //     case "doc":
  //     case "docx":
  //       return "word"
  //     default:
  //       return "other"
  //   }
  // }
}
