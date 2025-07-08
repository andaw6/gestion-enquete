import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningComponent } from './planning/planning.component';
import {PaginationComponent} from "@shared/components/pagination/pagination.component";
import {RouterModule} from "@angular/router";
import {PLANNING_ROUTE} from "@modules/enqueteur/traitement/planning/planning-routing";
import { PlanningSidebarComponent } from './planning/components/planning-sidebar/planning-sidebar.component';
import { PlanningModalComponent } from './planning/components/planning-modal/planning-modal.component';
import { PlanningCalendarComponent } from './planning/components/planning-calendar/planning-calendar.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    PlanningComponent,
    PlanningSidebarComponent,
    PlanningModalComponent,
    PlanningCalendarComponent
  ],
  imports: [
    CommonModule,
    PaginationComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(PLANNING_ROUTE),
  ]
})
export class PlanningModule { }
