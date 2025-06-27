import {Route} from "@angular/router";

export const TRAITEMENT_ROUTES: Route[] = [
  {
    path: 'document',
    loadChildren: () => import("@modules/enqueteur/traitement/document/document.module").then(m => m.DocumentModule)
  },
  {
    path:'**',
    redirectTo: 'document',
    pathMatch: 'full',
  }
];
