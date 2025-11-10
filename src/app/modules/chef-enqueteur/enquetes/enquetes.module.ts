import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignationComponent } from './assignation/assignation.component';
import { SuiviEnqueteComponent } from './suivi-enquete/suivi-enquete.component';
import { ValidationComponent } from './validation/validation.component';
import { AssignModalComponent } from './assignation/components/assign-modal/assign-modal.component';
import { EnquetesTableComponent } from './assignation/components/enquetes-table/enquetes-table.component';
import { FiltreComponent } from './assignation/components/filtre/filtre.component';
import { StatsCardComponent } from './assignation/components/stats-card/stats-card.component';
import { RouterModule } from '@angular/router';
import { ENQUETES_ROUTES } from './enquete-routing';
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ModalDetailDemandeComponent } from "@modules/demandeur/demandes/components/modal-detail-demande/modal-detail-demande.component";



@NgModule({
  declarations: [
    AssignationComponent,
    SuiviEnqueteComponent,
    ValidationComponent
  ],
  imports: [
    CommonModule,
    AssignModalComponent,
    EnquetesTableComponent,
    FiltreComponent,
    StatsCardComponent,
    PageHeaderComponent,
    PaginationComponent,
    RouterModule.forChild(ENQUETES_ROUTES),
    ModalDetailDemandeComponent
]
})
export class EnquetesModule { }
