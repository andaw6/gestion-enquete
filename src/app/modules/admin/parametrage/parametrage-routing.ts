import {Routes} from "@angular/router";

export const PARAMETRAGE_ROUTES: Routes = [
  {
    path: "notification",
    loadChildren: () => import("@modules/admin/parametrage/notification/notification.module").then(m => m.NotificationModule),
  },
  {
    path: "systeme",
    children: [
      {
        path: "type-document",
        loadChildren: () => import("@modules/admin/parametrage/type-document/type-document.module").then(m => m.TypeDocumentModule)
      },
      {
        path: "type-source",
        loadChildren: () => import("@modules/admin/parametrage/type-source/type-source.module").then(m => m.TypeSourceModule),
      },
      {
        path: "etat-demande",
        loadChildren: ()=>import("@modules/admin/parametrage/etat-demande/etat-demande.module").then(m => m.EtatDemandeModule),
      },
      {
        path: "etat-enquete",
        loadChildren: ()=>import("@modules/admin/parametrage/etat-enquete/etat-enquete.module").then(m => m.EtatEnqueteModule),
      },
      {
        path: "**",
        redirectTo: 'type-document',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: "securite",
    children: [

    ]
  },
  {
    path: "preference",
    children: [

    ]
  },
  {
    path: "**",
    redirectTo: 'systeme',
    pathMatch: 'full'
  }
];
