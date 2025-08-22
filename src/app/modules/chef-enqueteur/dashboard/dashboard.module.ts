import { NgModule } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DASHBOARD_ROUTES } from './dahsboard-routing';
import { RouterLink, RouterModule } from '@angular/router';
import { QuickActionsComponent } from './dashboard/components/quick-actions/quick-actions.component';
import { RecentActivitiesComponent } from './dashboard/components/recent-activities/recent-activities.component';
import { StatsCardComponent } from './dashboard/components/stats-card/stats-card.component';



@NgModule({
  declarations: [
    DashboardComponent,
    RecentActivitiesComponent,
    StatsCardComponent,
  ],
  imports: [
    CommonModule,
    NgClass,
    QuickActionsComponent,
    RouterLink,
    RouterModule.forChild(DASHBOARD_ROUTES),
  ]
})
export class DashboardModule { }
