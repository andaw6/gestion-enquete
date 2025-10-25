import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { DEMANDES_ROUTES } from "./demandes-routing";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DEMANDES_ROUTES)
  ]
})
export class DemandesModule { }
