import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatsCardComponent } from './dashboard/components/stats-card/stats-card.component';
import { ProgressBarComponent } from './dashboard/components/progress-bar/progress-bar.component';
import { ChartComponent } from './dashboard/components/chart/chart.component';
import {RouterModule} from "@angular/router";
import {DASHBOARD_ROUTES} from "@modules/enqueteur/enquetes/dashboard/dahsboard-routing";
import {FormsModule} from "@angular/forms";
import { RecentEnquetesComponent } from './dashboard/components/recent-enquetes/recent-enquetes.component';



@NgModule({
  declarations: [
    DashboardComponent,
    StatsCardComponent,
    ProgressBarComponent,
    ChartComponent,
    RecentEnquetesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(DASHBOARD_ROUTES),
  ]
})
export class DashboardModule { }
