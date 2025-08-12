import {Route, RouterModule} from "@angular/router";
import {EnqueteComponent} from "@modules/enqueteur/parametrage/enquete/enquete/enquete.component";

export const ENQUETE_ROUTES: Route[] = [
  {
    path: '',
    component: EnqueteComponent,
  }
];
