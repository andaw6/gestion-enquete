import { Route } from "@angular/router";
import { DocumentSansEnqueteComponent } from "@modules/enqueteur/traitement/document/document-sans-enquete/document-sans-enquete.component";

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
  {
    path: "modifier/:id",
    loadComponent: () =>
      import("@modules/demandeur/demandes/nouvelle-demande/nouvelle-demande.component").then(c => c.NouvelleDemandeComponent)
  },
  {
    path: "detail/:id",
    loadComponent: () =>
      import("@modules/demandeur/demandes/demande-enquete-details/demande-enquete-details.component").then(c => c.DemandeEnqueteDetailsComponent)
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
    path: "enquete/:id",
    loadComponent: () =>
      import("@modules/demandeur/demandes/enquete-detatil/enquete-detatil.component").then(c => c.EnqueteDetatilComponent)
  },
  {
    path: "document",
    loadComponent: () =>
      import("@modules/demandeur/demandes/documents/documents.component").then(c => c.DocumentsComponent),
    // component: DocumentSansEnqueteComponent,
  },
  {
    path: "**",
    redirectTo: "list"
  }
];
