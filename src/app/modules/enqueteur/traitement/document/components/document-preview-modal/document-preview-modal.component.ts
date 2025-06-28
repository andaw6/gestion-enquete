import {
  Component,
  ElementRef,
  EventEmitter,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2, SimpleChanges,
  ViewChild,
} from '@angular/core';
import {DocumentService} from '@modules/enqueteur/traitement/document/document.service';
import {Subscription} from 'rxjs';
import {DocumentUrl, Document} from '@modules/enqueteur/traitement/document/document';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {NotificationAlertService} from "@core/services/notification-alert.service";
import {ResponseError} from "@core/interfaces/response-error.interface";

@Component({
  selector: 'app-document-preview-modal',
  templateUrl: './document-preview-modal.component.html',
  styleUrls: ['./document-preview-modal.component.css']
})
export class DocumentPreviewModalComponent implements OnInit, OnDestroy, OnChanges {
  @Output() modalClosed = new EventEmitter<void>();
  @Input() isModalOpen = false;
  @Input() document: Document | null = null;

  @ViewChild('documentEmbed') documentEmbedRef!: ElementRef<HTMLEmbedElement>;

  private subscriptions = new Subscription();
  documentId!: number;
  contentType: string = 'text/plain';
  embedUrl?: SafeResourceUrl;
  documentUrl!: DocumentUrl;
  isLoading = true;
  hasError = false;
  documentData?: Document;

  constructor(
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private notificationService: NotificationAlertService,
    private documentService: DocumentService,
  ) {
  }

  private loadAndEmbed() {
    this.isLoading = true;
    this.hasError = false;
    this.documentService.getUrl(this.documentId).subscribe({
      next: (url: DocumentUrl | null) => {
        if (url) {
          this.documentUrl = url;
          this.contentType = url.contentType;
          console.log(this.contentType);
          if (url.canPreview) {
            this.documentService.getBlob(this.documentId).subscribe({
              next: (blob) => {
                const objectUrl = URL.createObjectURL(blob);
                this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
                this.isLoading = false;
              },
              error: (err) => {
                console.error(err);
                this.isLoading = false;
                this.hasError = true;
                this.notificationService.showNotification("Impossible de charger le document", "error");
              }
            });
          } else {
            this.notificationService.showNotification("Le document ne peut pas être afficher", "info");
            this.isLoading = false;
          }
        }
      },
      error: (err: ResponseError) => {
        this.isLoading = false;
        this.notificationService.showNotification(err.message || "Erreur lors du chargement du document", "error");
      }
    })


  }


  ngOnInit(): void {
    if (this.document) {
      this.documentData = this.document;
      this.documentId = this.document.id;
      this.loadAndEmbed();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.renderer.setStyle((document as any).body, 'overflow', 'auto');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["document"]) {
      let doc: Document | null = changes["document"].currentValue as Document | null;
      console.log("this is a test to document change", doc)
      if (doc) {
        this.documentData = doc;
        this.documentId = doc.id;
        this.loadAndEmbed();
      }
    }
    if(changes["isModalOpen"]) {
      if(changes["isModalOpen"].currentValue) {
        this.renderer.setStyle((document as any).body, 'overflow', 'hidden');
      }
    }
  }


  closeModal(): void {
    this.isModalOpen = false;
    this.renderer.setStyle((document as any).body, 'overflow', 'auto');
    this.modalClosed.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  onPdfLoad(): void {
    this.notificationService.showNotification("Document affiché avec succès!", "success")
  }

  onPdfError(): void {
    this.notificationService.showNotification("Erreur lors de l\'affichage du document", "error");
  }

  downloadDocument(): void {
    if (this.documentUrl) {
      let downloadUrl = this.documentUrl.downloadUrl.slice(3);
      const link = this.renderer.createElement('a');
      this.renderer.setAttribute(link, 'href', downloadUrl);
      this.renderer.setAttribute(link, 'download', this.getFileName());
      link.click();
      this.notificationService.showNotification('Document Télécharger', "success");
    } else {
      this.notificationService.showNotification("Impossible de télécharger le document", "info");
    }
  }

  reloadDocument(): void {
    this.loadAndEmbed();
  }

  retryLoad(): void {
    this.reloadDocument();
  }

  getFileName(): string {
    if (this.documentData) {
      return `${this.documentData.nom}.${this.documentData.extension}`;
    }
    return 'document';
  }

  getFileSize(): string {
    if (this.documentData?.taille) {
      return this.formatFileSize(this.documentData.taille);
    }
    return 'Taille inconnue';
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }


  getDocumentType(): string {
    return this.documentData?.extension?.toUpperCase() || 'Document';
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.isModalOpen) return;

    if (event.key === 'Escape') {
      this.closeModal();
      return;
    }
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'd':
          event.preventDefault();
          this.downloadDocument();
          break;
        case 'r':
          event.preventDefault();
          this.reloadDocument();
          break;
      }
    }
  }


}
