import {Route} from "@angular/router";
import {DocumentComponent} from "@modules/enqueteur/traitement/document/document/document.component";
import {
  DocumentSansEnqueteComponent
} from "@modules/enqueteur/traitement/document/document-sans-enquete/document-sans-enquete.component";


export const DOCUMENT_ROUTE:Route[] = [
  {
    path: 'avec-enquete',
    component: DocumentComponent,
  },
  {
    path: 'sans-enquete',
    component: DocumentSansEnqueteComponent,
  },
  {
    path: '**',
    redirectTo: 'sans-enquete',
    pathMatch: 'full'
  }
]
