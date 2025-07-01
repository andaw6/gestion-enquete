import {Route} from "@angular/router";

export const TRAITEMENT_ROUTES: Route[] = [
  {
    path: 'document',
    loadChildren: () => import("@modules/enqueteur/traitement/document/document.module").then(m => m.DocumentModule)
  },
  {
    path:"source-info",
    loadChildren: () => import("@modules/enqueteur/traitement/source-info/source-info.module").then(m => m.SourceInfoModule),
  },
  {
    path:'**',
    redirectTo: 'document',
    pathMatch: 'full',
  }
];
