import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecentActivityComponent } from './dashboard/components/recent-activity/recent-activity.component';
import { DemandeTableComponent } from './dashboard/components/demande-table/demande-table.component';
import { StatsCardsComponent } from './dashboard/components/stats-cards/stats-cards.component';
import { ChartComponent } from './dashboard/components/chart/chart.component';
import { DASHBOARD_ROUTES } from './dahsboard-routing';
import { RouterLink, RouterModule } from '@angular/router';
import { StatCardComponent } from '@shared/components/stat-card/stat-card.component';



@NgModule({
  declarations: [
    DashboardComponent,
    RecentActivityComponent,
    StatsCardsComponent,
    ChartComponent,
  ],
  imports: [
    CommonModule,
    RouterLink,
    StatCardComponent,
    DemandeTableComponent,
    RouterModule.forChild(DASHBOARD_ROUTES),
  ]
})
export class DashboardModule { }
