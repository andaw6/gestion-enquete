import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { VALIDATIONS_ROUTES } from './demandes-routing';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VALIDATIONS_ROUTES)
  ]
})
export class DemandesModule { }
