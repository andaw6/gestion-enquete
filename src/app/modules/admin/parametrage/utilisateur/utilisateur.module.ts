import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { DetailUtilisateurComponent } from './detail-utilisateur/detail-utilisateur.component';
import { SearchFiltersComponent } from './utilisateur/components/search-filters/search-filters.component';
import { StatsCardsComponent } from './utilisateur/components/stats-cards/stats-cards.component';
import { UsersTableComponent } from './utilisateur/components/users-table/users-table.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PaginationComponent} from "@shared/components/pagination/pagination.component";
import {LoaderComponent} from "@shared/components/loader/loader.component";
import {RouterModule} from "@angular/router";
import {UTILISATEUR_ROUTES} from "@modules/admin/parametrage/utilisateur/utilisateur-routing";



@NgModule({
  declarations: [
    UtilisateurComponent,
    DetailUtilisateurComponent,
    SearchFiltersComponent,
    StatsCardsComponent,
    UsersTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent,
    LoaderComponent,
    RouterModule.forChild(UTILISATEUR_ROUTES),
  ]
})
export class UtilisateurModule { }
