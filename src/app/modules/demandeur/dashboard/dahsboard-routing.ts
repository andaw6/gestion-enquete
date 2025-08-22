import { Route } from "@angular/router";

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import("@modules/demandeur/dashboard/dashboard/dashboard.component").then(c => c.DashboardComponent)
  }
]
