import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {SECURITE_ROUTES} from "@modules/enqueteur/parametrage/securite/securite-routing";
import { SecuriteComponent } from './securite/securite.component';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    SecuriteComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(SECURITE_ROUTES),
  ]
})
export class SecuriteModule { }
