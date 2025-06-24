import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeSourceComponent } from './type-source/type-source.component';
import {GenericCrudComponent} from "@shared/components/generic-crud/generic-crud.component";
import {RouterModule} from "@angular/router";
import {TYPE_SOURCE_ROUTES} from "@modules/admin/parametrage/type-source/type-source-routing";
import {BaseCrudComponent} from "@shared/components/base-crud/base-crud.component";



@NgModule({
  declarations: [
    TypeSourceComponent
  ],
  imports: [
    CommonModule,
    GenericCrudComponent,
    RouterModule.forChild(TYPE_SOURCE_ROUTES),
    BaseCrudComponent,
  ]
})
export class TypeSourceModule { }
