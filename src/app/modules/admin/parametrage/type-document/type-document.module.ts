import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TYPE_DOCUMENT_ROUTES } from './type-document-routing';
import { TypeDocumentComponent } from './type-document/type-document.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ConfirmDeleteModalComponent } from '@shared/components/confirm-delete-modal/confirm-delete-modal.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {GenericCrudComponent} from "@shared/components/generic-crud/generic-crud.component";
import {BaseCrudComponent} from "@shared/components/base-crud/base-crud.component";



@NgModule({
  declarations: [ TypeDocumentComponent],
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    ConfirmDeleteModalComponent,
    ReactiveFormsModule,
    LoaderComponent,
    ModalComponent,
    RouterModule.forChild(TYPE_DOCUMENT_ROUTES),
    GenericCrudComponent,
    BaseCrudComponent
  ]
})
export class TypeDocumentModule { }
