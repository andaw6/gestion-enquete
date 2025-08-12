import { NgModule } from '@angular/core';
import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { RouterModule } from "@angular/router";
import { DEMANDES_ROUTES } from "./demandes-routing";
import { DetailDemandeComponent } from './detail-demande/detail-demande.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouvelleDemandeComponent } from './nouvelle-demande/nouvelle-demande.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { SelectSearchPaginateComponent } from '@shared/components/select-search-paginate/select-search-paginate.component';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { ListDemandesComponent } from './list-demandes/list-demandes.component';
import { StatCardComponent } from '@shared/components/stat-card/stat-card.component';
import { SearchFilterComponent } from '@shared/components/search-filter/search-filter.component';
import { DemandeTableComponent } from '../dashboard/dashboard/components/demande-table/demande-table.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { DemandeEnTraitementComponent } from './demande-en-traitement/demande-en-traitement.component';
import { DemandesListeComponent } from './components/demandes-liste/demandes-liste.component';
import { DemandeTerminerComponent } from './demande-terminer/demande-terminer.component';


@NgModule({
  declarations: [
    DetailDemandeComponent,
    NouvelleDemandeComponent,
    ListDemandesComponent,
    DemandeEnTraitementComponent,
    DemandeTerminerComponent,
  ],
  imports: [
    CommonModule,
    NgIf,
    NgClass,
    NgForOf,
    FormsModule,
    DemandeTableComponent,
    ReactiveFormsModule,
    PageHeaderComponent,
    SelectSearchPaginateComponent,
    PaginationComponent,
    DemandesListeComponent,
    StatCardComponent,
    SearchFilterComponent,
    ConfirmationModalComponent,
    RouterModule.forChild(DEMANDES_ROUTES)
  ]
})
export class DemandesModule { }
