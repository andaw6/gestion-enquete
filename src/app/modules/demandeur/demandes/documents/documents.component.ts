import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentSansEnqueteComponent } from '@modules/enqueteur/traitement/document/document-sans-enquete/document-sans-enquete.component';
import { DocumentGridComponent } from '@modules/enqueteur/traitement/document/components/document-grid/document-grid.component';
import { DocumentUploadModalComponent } from '@modules/enqueteur/traitement/document/components/document-upload-modal/document-upload-modal.component';
import { DocumentPreviewModalComponent } from '@shared/components/document-preview-modal/document-preview-modal.component';
import { DeleteModalComponent } from '@modules/enqueteur/traitement/document/components/delete-modal/delete-modal.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DocumentSansEnqueteFiltreComponent } from '@modules/enqueteur/traitement/document/document-sans-enquete/components/document-sans-enquete-filtre/document-sans-enquete-filtre.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    DocumentGridComponent,
    DocumentUploadModalComponent,
    DocumentPreviewModalComponent,
    DeleteModalComponent,
    PageHeaderComponent,
    DocumentSansEnqueteFiltreComponent
  ],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent extends DocumentSansEnqueteComponent {

  override pageTitle = "Tous mes documents";
  override pageSubTitle = "Retrouvez et organisez facilement vos documents pour vos demandes";

}
