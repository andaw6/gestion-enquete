import { Route } from "@angular/router";

export const DEMANDES_ROUTES: Route[] = [
  {
    path: "list",
    loadComponent: () =>
      import("@modules/demandeur/demandes/list-demandes/list-demandes.component").then(c => c.ListDemandesComponent)
  },
  {
    path: "nouveau",
    loadComponent: () =>
      import("@modules/demandeur/demandes/nouvelle-demande/nouvelle-demande.component").then(c => c.NouvelleDemandeComponent)
  },
  // {
  //   path: "detail/:id",
  //   loadComponent: () =>
  //     import("@modules/demandeur/demandes/detail-demande/detail-demande.component").then(c => c.DetailDemandeComponent)
  // },
  {
    path: "detail/:id",
    loadComponent: () =>
      import("@modules/demandeur/demandes/test/demande-enquete-details/demande-enquete-details.component").then(c => c.DemandeEnqueteDetailsComponent)
  },
  {
    path: "en-cours",
    loadComponent: () =>
      import("@modules/demandeur/demandes/demande-en-traitement/demande-en-traitement.component").then(c => c.DemandeEnTraitementComponent,
      )
  },
  {
    path: "terminee",
    loadComponent: () =>
      import("@modules/demandeur/demandes/demande-terminer/demande-terminer.component").then(c => c.DemandeTerminerComponent)
  },
  {
    path: "**",
    redirectTo: "list"
  }
];
