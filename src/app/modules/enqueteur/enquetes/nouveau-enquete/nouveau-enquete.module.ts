import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NouveauEnqueteComponent } from './nouveau-enquete/nouveau-enquete.component';
import { EnqueteCardComponent } from './nouveau-enquete/components/enquete-card/enquete-card.component';
import { EnqueteListComponent } from './nouveau-enquete/components/enquete-list/enquete-list.component';
import { FiltersComponent } from './nouveau-enquete/components/filters/filters.component';
import { StatsCardsComponent } from './nouveau-enquete/components/stats-cards/stats-cards.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NOUVEAU_ENQUTE_ROUTES} from "@modules/enqueteur/enquetes/nouveau-enquete/nouveau-enquete-routing";
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    NouveauEnqueteComponent,
    EnqueteCardComponent,
    EnqueteListComponent,
    FiltersComponent,
    StatsCardsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(NOUVEAU_ENQUTE_ROUTES)
  ]
})
export class NouveauEnqueteModule { }
