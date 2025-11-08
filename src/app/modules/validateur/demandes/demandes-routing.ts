import { Route } from "@angular/router";

export const VALIDATIONS_ROUTES: Route[] = [
  {
    path: "list",
    loadComponent: () =>
      import("@modules/validateur/demandes/list-demandes/list-demandes.component").then(c => c.ListDemandesComponent)
  },
  // {
  //   path: "test",
  //   loadComponent: () =>
  //     import("@modules/validateur/demandes/tests/tests.component").then(c => c.TestsComponent)

  // },
  {
    path: "**",
    redirectTo: "list"
  }
]
