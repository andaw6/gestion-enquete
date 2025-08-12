import { Route } from "@angular/router";
import { NouvelleDemandeComponent } from "./nouvelle-demande/nouvelle-demande.component";
import { DetailDemandeComponent } from "./detail-demande/detail-demande.component";
import { ListDemandesComponent } from "./list-demandes/list-demandes.component";
import { DemandeEnTraitementComponent } from "./demande-en-traitement/demande-en-traitement.component";
import { DemandeTerminerComponent } from "./demande-terminer/demande-terminer.component";

export const DEMANDES_ROUTES: Route[] = [
  {
    path: "list",
    component: ListDemandesComponent
  },
  {
    path: "nouveau",
    component: NouvelleDemandeComponent
  },
  {
    path: "detail/:id",
    component: DetailDemandeComponent
  },
  {
    path: "en-cours",
    component: DemandeEnTraitementComponent
  },
  {
    path:"terminee",
    component: DemandeTerminerComponent
  },
  {
    path: "**",
    redirectTo: "list"
  }
];
