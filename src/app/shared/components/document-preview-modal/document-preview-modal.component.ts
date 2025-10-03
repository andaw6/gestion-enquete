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
import { DocumentService } from '@modules/enqueteur/traitement/document/document.service';
import { of, Subscription, switchMap } from 'rxjs';
import { DocumentUrl, Document } from '@modules/enqueteur/traitement/document/document';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { CommonModule, NgIf } from "@angular/common";
import { catchError, map } from "rxjs/operators";
import { SpinnerComponent } from "@shared/components/spinner/spinner.component";
import { DocumentModel } from '@core/model/document.model';
import { Logger } from '@core/services/logger.service';
import { UtilService } from '@core/services/util.service';

@Component({
  selector: 'app-document-preview-modal',
  templateUrl: './document-preview-modal.component.html',
  styleUrls: ['./document-preview-modal.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    NgIf,
  ]
})
export class DocumentPreviewModalComponent implements OnInit, OnDestroy, OnChanges {
  @Output() modalClosed = new EventEmitter<void>();
  @Input() isModalOpen = false;
  @Input() document: Document | DocumentModel | null = null;

  @ViewChild('documentEmbed') documentEmbedRef!: ElementRef<HTMLEmbedElement>;

  private subscriptions = new Subscription();
  documentId!: number;
  contentType: string = 'text/plain';
  embedUrl?: SafeResourceUrl;
  documentUrl!: DocumentUrl;
  isLoading = true;
  hasError = false;
  documentData?: Document | DocumentModel;

  constructor(
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private documentService: DocumentService,
    private utilService:UtilService,
  ) {
  }

  private loadAndEmbed(): void {
    this.isLoading = true;
    this.hasError = false;
    this.embedUrl = "";

    this.documentService.getUrl(this.documentId).pipe(
      switchMap((url: DocumentUrl | null) => {
        if (!url) {
          throw new Error("Document introuvable");
        }

        this.documentUrl = url;
        this.contentType = url.contentType;

        if (!url.canPreview) {
          this.utilService.showNotification("Le document ne peut pas être affiché", "info");
          this.isLoading = false;
          return of(null);
        }

        return this.documentService.getBlob(this.documentId).pipe(
          map((blob) => {
            const objectUrl = URL.createObjectURL(blob);
            return this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
          })
        );
      }),
      catchError((err: any) => {
        this.isLoading = false;
        this.hasError = true;
        const message = "Erreur lors du chargement du document";
        this.utilService.showNotification(message, "error");
        return of(null);
      })
    ).subscribe((safeUrl) => {
      // setTimeout(()=>{
      if (safeUrl) {
        this.embedUrl = safeUrl;
      }
      this.isLoading = false;
      // }, 3000)
    });
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
      let doc: Document | DocumentModel | null = changes["document"].currentValue as Document | DocumentModel | null;
      if (doc) {
        this.documentData = doc;
        this.documentId = doc.id;
        this.loadAndEmbed();
      }
    }
    if (changes["isModalOpen"]) {
      if (changes["isModalOpen"].currentValue) {
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
    Logger.info("Document affiché avec succès!", "DocumentPreviewModalComponent:onPdfLoad")
  }

  onPdfError(): void {
    this.utilService.showNotification("Erreur lors de l\'affichage du document", "error");
  }

  downloadDocument(): void {
    if (this.documentUrl) {
      let downloadUrl = this.documentUrl.downloadUrl.slice(3);
      const link = this.renderer.createElement('a');
      this.renderer.setAttribute(link, 'href', downloadUrl);
      this.renderer.setAttribute(link, 'download', this.getFileName());
      link.click();
      this.utilService.showNotification('Document Télécharger', "success");
    } else {
      this.utilService.showNotification("Impossible de télécharger le document", "info");
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
      return this.utilService.formatFileSize(this.documentData.taille);
    }
    return 'Taille inconnue';
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
