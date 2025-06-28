import {Component, OnDestroy, OnInit, Renderer2, signal, ViewChild, WritableSignal} from '@angular/core';
import {DocumentService} from "@modules/enqueteur/traitement/document/document.service";
import {Document, DocumentData, DocumentUpload, FilterOptions} from "@modules/enqueteur/traitement/document/document";
import {map, Observable, of, Subject} from "rxjs";
import {NotificationAlertService} from "@core/services/notification-alert.service";
import {Pagination} from "@core/interfaces/pagination.interface";
import {ApiResponse} from "@core/interfaces/api-response.interface";
import {ResponseError} from "@core/interfaces/response-error.interface";
import {TypeDocumentService} from "@modules/admin/parametrage/type-document/type-document.service";
import {
  DocumentUploadModalComponent
} from "@modules/enqueteur/traitement/document/components/document-upload-modal/document-upload-modal.component";

@Component({
  selector: 'app-document-sans-enquete',
  templateUrl: './document-sans-enquete.component.html',
  styleUrls: ['./document-sans-enquete.component.css'],
})
export class DocumentSansEnqueteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  documents$: Observable<Document[]> = of([]);
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
  selectedDocument: Document | null = null;
  loading: WritableSignal<boolean> = signal(false);

  @ViewChild(DocumentUploadModalComponent) uploadModal!: DocumentUploadModalComponent;

  constructor(
    private documentService: DocumentService,
    private typeDocumentService: TypeDocumentService,
    private notificationService: NotificationAlertService,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadData(): void {
    this.loading.set(true);
    this.documentService.getAll({...this.pagination}).subscribe({
      next: (response: ApiResponse<Document>) => {
        this.documents$ = of(response.data);
        this.pagination = response.pagination;
        this.loading.set(false);
      },
      error: (err: ResponseError) => {
        this.loading.set(false);
        this.notificationService.showNotification('Erreur lors du chargement des documents',
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

  onUpload(data: DocumentUpload): void {
    if (!data?.file) {
      this.notificationService.showNotification("Aucun fichier sélectionné.", "warning");
      return;
    }

    const payload: DocumentData = {
      nom: data.documentName?.trim() ?? "N/A",
      description: data.documentDescription?.trim() ?? "N/A",
      typeId: Number(data.documentType) || 0,
      file: data.file,
    };

    this.documentService.create(payload).subscribe({
      next: (document: Document) => {
        console.log("Document successfully uploaded", document);

        // Met à jour le flux documents$
        this.documents$ = this.documents$.pipe(
          map((docs) => [document, ...docs])
        );

        this.notificationService.showNotification("Document téléchargé avec succès !", "success");

        this.uploadModal.reset();
        this.uploadModal.close.emit();
      },
      error: (err: ResponseError) => {
        console.error("Erreur d'upload:", err);
        this.notificationService.showNotification(
          err?.message || "Erreur lors du téléchargement du document.",
          "error"
        );
      }
    });
  }


  onPreviewClick(document: Document): void {
    this.selectedDocument = document
    this.isPreviewModalOpen = true
  }

  onDownloadClick(document: Document): void {
    console.log("Download document:", document);
    this.documentService.getView(document.id, {download: true}).subscribe({
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
