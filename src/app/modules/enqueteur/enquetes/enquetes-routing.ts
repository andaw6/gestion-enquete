import { Route } from "@angular/router";

export const ENQUETES_ROUTES: Route[] = [
  {
    path: "nouveau",
    loadChildren: () =>
      import("@modules/enqueteur/enquetes/nouveau-enquete/nouveau-enquete.module").then(m => m.NouveauEnqueteModule),
  },
  {
    path: "assignation",
    loadComponent: () =>
      import("@modules/enqueteur/enquetes/assignation/assignation.component").then(c => c.AssignationComponent),
  },
  {
    path: "liste",
    loadComponent: () =>
      import("@modules/enqueteur/enquetes/list-enquete/list-enquete.component").then(c => c.ListEnqueteComponent)
  },
  {
    path: "en-cours",
    loadComponent: () =>
      import("@modules/enqueteur/enquetes/enquete-en-cours/enquete-en-cours.component").then(c => c.EnqueteEnCoursComponent)
  },
  {
    path: "en-cours/:id",
    loadComponent: () =>
      import("@modules/enqueteur/enquetes/traitement-enquete/traitement-enquete.component").then(c => c.TraitementEnqueteComponent)
  }
];
