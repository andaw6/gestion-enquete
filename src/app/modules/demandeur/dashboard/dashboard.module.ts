import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DASHBOARD_ROUTES } from './dahsboard-routing';
import { RouterModule } from '@angular/router';



@NgModule({
  // declarations: [
  // ],
  imports: [
    CommonModule,
    RouterModule.forChild(DASHBOARD_ROUTES),
  ]
})
export class DashboardModule { }
