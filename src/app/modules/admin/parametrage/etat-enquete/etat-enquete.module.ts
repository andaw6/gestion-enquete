import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtatEnqueteComponent } from './etat-enquete/etat-enquete.component';
import {GenericCrudComponent} from "@shared/components/generic-crud/generic-crud.component";
import {RouterModule} from "@angular/router";
import {ETAT_ENQUETE_ROUTES} from "@modules/admin/parametrage/etat-enquete/etat-enquete-routing";



@NgModule({
  declarations: [
    EtatEnqueteComponent
  ],
  imports: [
    CommonModule,
    GenericCrudComponent,
    RouterModule.forChild(ETAT_ENQUETE_ROUTES)
  ]
})
export class EtatEnqueteModule { }
