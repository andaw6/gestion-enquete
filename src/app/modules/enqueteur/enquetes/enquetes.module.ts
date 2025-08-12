import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ENQUETES_ROUTES} from "@modules/enqueteur/enquetes/enquetes-routing";
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(ENQUETES_ROUTES),
  ]
})
export class EnquetesModule { }
