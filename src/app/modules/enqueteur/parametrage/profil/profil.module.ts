import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilComponent } from './profil/profil.component';
import {RouterModule} from "@angular/router";
import {PROFILE_ROUTE} from "@modules/enqueteur/parametrage/profil/profil-routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PageHeaderComponent} from "@shared/components/page-header/page-header.component";



@NgModule({
  declarations: [
    ProfilComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(PROFILE_ROUTE),
        PageHeaderComponent,
    ]
})
export class ProfilModule { }
