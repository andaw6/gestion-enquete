import { Route } from "@angular/router";

export const VALIDATIONS_ROUTES: Route[] = [
  {
    path: "list",
    loadComponent: () =>
      import("@modules/validateur/demandes/list-demandes/list-demandes.component").then(c => c.ListDemandesComponent)
  },
    {
    path: "avalidees",
    loadComponent: () =>
      import("@modules/validateur/demandes/demande-avalidees/demande-avalidees.component").then(c => c.DemandeAvalideesComponent)
  },
  // {
  //   path: "test",
  //   loadComponent: () =>
  //     import("@modules/validateur/demandes/tests/tests.component").then(c => c.TestsComponent)

  // },
  {
    path: "**",
    redirectTo: "avalidees"
  }
]
