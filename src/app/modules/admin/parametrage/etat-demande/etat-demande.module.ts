import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtatDemandeComponent } from './etat-demande/etat-demande.component';
import {GenericCrudComponent} from "@shared/components/generic-crud/generic-crud.component";
import {RouterModule} from "@angular/router";
import {ETAT_DEMANDE_ROUTES} from "@modules/admin/parametrage/etat-demande/etat-demande-routing";



@NgModule({
  declarations: [
    EtatDemandeComponent
  ],
  imports: [
    CommonModule,
    GenericCrudComponent,
    RouterModule.forChild(ETAT_DEMANDE_ROUTES),
  ]
})
export class EtatDemandeModule { }
