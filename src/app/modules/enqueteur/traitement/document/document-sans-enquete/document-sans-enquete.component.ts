import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  signal,
  WritableSignal,
} from '@angular/core';
import {Observable, Subject, of, map} from 'rxjs';
import {DocumentService} from '@modules/enqueteur/traitement/document/document.service';
import {
  Document,
  DocumentData,
  DocumentUpload,
  FilterOptions,
} from '@modules/enqueteur/traitement/document/document';
import {TypeDocumentService} from '@modules/admin/parametrage/type-document/type-document.service';
import {NotificationAlertService} from '@core/services/notification-alert.service';
import {Pagination} from '@core/interfaces/pagination.interface';
import {ApiResponse} from '@core/interfaces/api-response.interface';
import {ResponseError} from '@core/interfaces/response-error.interface';
import {
  DocumentUploadModalComponent
} from '@modules/enqueteur/traitement/document/components/document-upload-modal/document-upload-modal.component';
import {IParams} from "@core/interfaces/http-options.interface";
import {UtilService} from "@core/services/util.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-document-sans-enquete',
  templateUrl: './document-sans-enquete.component.html',
  styleUrls: ['./document-sans-enquete.component.css'],
})
export class DocumentSansEnqueteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  documents$: Observable<Document[]> = of([]);
  loading: WritableSignal<boolean> = signal(false);

  pagination: Pagination = {
    page: 1,
    limit: 10,
    totalItem: 0,
    totalPage: 0,
  };

  currentFilters: FilterOptions = {
    searchTerm: '',
    filterType: 'all',
    sortBy: 'date',
    viewMode: 'grid',
  };

  isUploadModalOpen = false;
  isPreviewModalOpen = false;
  showDeleteModal = false;

  selectedDocument: Document | null = null;
  deletedDocument: Document | null = null;
  selectedItem = '';
  isDeleting = false;

  paramFilter: IParams = {};

  @ViewChild(DocumentUploadModalComponent)
  uploadModal!: DocumentUploadModalComponent;

  constructor(
    private documentService: DocumentService,
    private typeDocumentService: TypeDocumentService,
    private utilService: UtilService,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDocuments(): void {
    this.loading.set(true);
    this.documentService.getAll({...this.pagination, ...this.paramFilter}).subscribe({
      next: (response: ApiResponse<Document>) => {
        this.documents$ = of(response.data);
        this.pagination = response.pagination;
      },
      error: () => {
        this.utilService.showNotification(
          'Erreur lors du chargement des documents',
          'error'
        );
      },
      complete: () => this.loading.set(false),
    });
  }

  setPagination(pagination: Pagination): void {
    this.pagination = pagination;
    this.loadDocuments();
  }

  onFiltersChange(filters: FilterOptions): void {
    this.currentFilters = filters;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.paramFilter = {};
    if (this.currentFilters.filterType !== 'all') {
      this.paramFilter["categorie"] = this.currentFilters.filterType;
    }
    if (this.currentFilters.sortBy) {
      switch (this.currentFilters.sortBy) {
        case 'date':
          this.paramFilter["sort"] = 'createdAt,desc';
          break;
        case 'name':
          this.paramFilter["sort"] = 'nom,asc';
          break;
        case 'size':
          this.paramFilter["sort"] = 'taille,asc';
          break;
        case 'type':
          this.paramFilter["sort"] = 'type.libelle,asc';
          break;
      }
    }
    if (this.currentFilters.searchTerm) {
      this.paramFilter["nom"] = this.currentFilters.searchTerm.toLowerCase();
    }
    console.log(this.paramFilter);
    this.loadDocuments();
  }

  onUploadClick(): void {
    this.isUploadModalOpen = true;
  }

  onUploadModalClose(): void {
    this.isUploadModalOpen = false;
  }

  onUpload(data: DocumentUpload): void {
    if (!data?.file) {
      this.utilService.showNotification('Aucun fichier sélectionné.', 'warning');
      return;
    }

    const payload: DocumentData = {
      nom: data.documentName?.trim() ?? 'N/A',
      description: data.documentDescription?.trim() ?? 'N/A',
      typeId: Number(data.documentType) || 0,
      file: data.file,
    };

    this.documentService.create(payload).subscribe({
      next: (document: Document) => {
        this.documents$ = this.documents$.pipe(
          map((docs) => [document, ...docs])
        );
        this.utilService.showNotification(
          'Document téléchargé avec succès !',
          'success'
        );
        this.uploadModal.reset();
        this.uploadModal.close.emit();
      },
      error: (err: ResponseError) => {
        this.utilService.showNotification(
          err?.message || 'Erreur lors du téléchargement du document.',
          'error'
        );
      },
    });
  }

  onPreviewClick(document: Document): void {
    this.selectedDocument = document;
    this.isPreviewModalOpen = true;
  }

  onDownloadClick(document: Document): void {
    this.documentService.getView(document.id, {download: true}).subscribe({
      next: (blob: Blob) => this.utilService.downloadBlob(this.renderer, blob, `${document.nom}.${document.extension}`),
      error: () =>
        this.utilService.showNotification(
          'Erreur lors du téléchargement du document',
          'error'
        ),
    });
  }


  onDeleteClick(document: Document): void {
    this.showDeleteModal = true;
    this.selectedItem = `${document.nom}.${document.extension}`;
    this.deletedDocument = document;
  }

  handleDelete(): void {
    if (!this.deletedDocument) {
      this.closeDeleteModal();
      return;
    }

    this.isDeleting = true;

    this.documentService.deleteOne(this.deletedDocument.id).subscribe({
      next: () => {
        this.documents$ = this.documents$.pipe(
          map((docs) => docs.filter((doc) => doc.id !== this.deletedDocument?.id))
        );
        this.utilService.showNotification('Document supprimé avec succès !', 'success');
        this.closeDeleteModal();
      },
      error: (err) => {
        this.utilService.showNotification(
          err.message || 'Erreur lors de la suppression du document !',
          'error'
        );
        this.closeDeleteModal();
      },
    });
  }

  private closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.isDeleting = false;
    this.deletedDocument = null;
  }
}
