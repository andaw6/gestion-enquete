import { NgModule } from '@angular/core';
import {RouterModule} from "@angular/router";
import {TRAITEMENT_ROUTES} from "@modules/enqueteur/traitement/traitement-routing";



@NgModule({
  imports: [RouterModule.forChild(TRAITEMENT_ROUTES)],
  exports: [RouterModule]
})
export class TraitementModule { }
