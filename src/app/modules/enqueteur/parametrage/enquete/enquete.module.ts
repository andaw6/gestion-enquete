import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import { EnqueteComponent } from './enquete/enquete.component';
import {ENQUETE_ROUTES} from "@modules/enqueteur/parametrage/enquete/enquete-routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    EnqueteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ENQUETE_ROUTES),
  ]
})
export class EnqueteModule { }
