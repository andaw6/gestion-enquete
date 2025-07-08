import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {PARAMETRAGE_ROUTES} from "@modules/enqueteur/parametrage/parametrage-routing";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(PARAMETRAGE_ROUTES),
  ]
})
export class ParametrageModule { }
