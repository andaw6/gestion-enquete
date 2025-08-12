import {Route} from "@angular/router";

export const ENQUETES_ROUTES: Route[] = [
  {
    path: "nouveau",
    loadChildren: () =>
      import("@modules/enqueteur/enquetes/nouveau-enquete/nouveau-enquete.module").then(m => m.NouveauEnqueteModule),
  }
];
