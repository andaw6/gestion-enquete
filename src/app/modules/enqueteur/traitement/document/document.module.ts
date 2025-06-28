import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocumentComponent} from './document/document.component';
import {RouterModule} from "@angular/router";
import {DOCUMENT_ROUTE} from "@modules/enqueteur/traitement/document/document-routing";
import {PaginationComponent} from "@shared/components/pagination/pagination.component";
import {FormsModule} from "@angular/forms";
import {
  DocumentSansEnqueteComponent
} from "@modules/enqueteur/traitement/document/document-sans-enquete/document-sans-enquete.component";
import {
  DocumentGridComponent
} from "@modules/enqueteur/traitement/document/components/document-grid/document-grid.component";
import {
  DocumentPreviewModalComponent
} from "@modules/enqueteur/traitement/document/components/document-preview-modal/document-preview-modal.component";
import {
  DocumentUploadModalComponent
} from "@modules/enqueteur/traitement/document/components/document-upload-modal/document-upload-modal.component";
import { DocumentSansEnqueteFiltreComponent } from './document-sans-enquete/components/document-sans-enquete-filtre/document-sans-enquete-filtre.component';


@NgModule({
  declarations: [
    DocumentComponent,
    DocumentSansEnqueteComponent,
    DocumentGridComponent,
    DocumentPreviewModalComponent,
    DocumentUploadModalComponent,
    DocumentSansEnqueteFiltreComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    RouterModule.forChild(DOCUMENT_ROUTE)
  ]
})
export class DocumentModule {
}
