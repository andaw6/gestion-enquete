import {Routes} from "@angular/router";
import {UtilisateurComponent} from "@modules/admin/parametrage/utilisateur/utilisateur/utilisateur.component";
import {
  DetailUtilisateurComponent
} from "@modules/admin/parametrage/utilisateur/detail-utilisateur/detail-utilisateur.component";

export const UTILISATEUR_ROUTES: Routes = [
  {
    path: '/',
    component: UtilisateurComponent
  },
  // {
  //   path: '/detalle',
  //   component: DetailUtilisateurComponent
  // }
];
