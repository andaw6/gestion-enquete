import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SourceInfoComponent} from './source-info/source-info.component';
import {SourceCardComponent} from './source-info/components/source-card/source-card.component';
import {SourceFiltersComponent} from './source-info/components/source-filters/source-filters.component';
import {FormSourceInfoComponent} from './form-source-info/form-source-info.component';
import {SOURCE_INFO_ROUTE} from "@modules/enqueteur/traitement/source-info/source-info-routing";
import {PaginationComponent} from "@shared/components/pagination/pagination.component";
import {ButtonBackComponent} from "@shared/components/button-back/button-back.component";
import {
  SelectSearchPaginateComponent
} from "@shared/components/select-search-paginate/select-search-paginate.component";
import {DetailSourceInfoComponent} from './detail-source-info/detail-source-info.component';
import {DocumentsSectionComponent} from './detail-source-info/components/documents-section/documents-section.component';
import {SourceDetailsComponent} from './detail-source-info/components/source-details/source-details.component';
import {SourceHeaderComponent} from './detail-source-info/components/source-header/source-header.component';
import {SourceSidebarComponent} from './detail-source-info/components/source-sidebar/source-sidebar.component';
import {
  DocumentPreviewModalComponent
} from "@shared/components/document-preview-modal/document-preview-modal.component";
import {PageHeaderComponent} from "@shared/components/page-header/page-header.component";
import { SourceListComponent } from './source-info/components/source-list/source-list.component';
import {LoaderComponent} from "@shared/components/loader/loader.component";
import { FileUploadComponent } from "@shared/components/file-upload/file-upload.component";
import { ExistingDocumentsSelectorComponent } from '../document/components/existing-documents-selector/existing-documents-selector.component';


@NgModule({
  declarations: [
    SourceInfoComponent,
    SourceCardComponent,
    SourceFiltersComponent,
    FormSourceInfoComponent,
    DetailSourceInfoComponent,
    DocumentsSectionComponent,
    SourceDetailsComponent,
    SourceHeaderComponent,
    SourceSidebarComponent,
    SourceListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent,
    RouterModule,
    SelectSearchPaginateComponent,
    ButtonBackComponent,
    DocumentPreviewModalComponent,
    PageHeaderComponent,
    RouterModule.forChild(SOURCE_INFO_ROUTE),
    LoaderComponent,
    FileUploadComponent,
    ExistingDocumentsSelectorComponent
  ]
})
export class SourceInfoModule {
}
