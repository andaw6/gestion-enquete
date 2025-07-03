import {Route} from "@angular/router";
import {SourceInfoComponent} from "@modules/enqueteur/traitement/source-info/source-info/source-info.component";
import {
  FormSourceInfoComponent
} from "@modules/enqueteur/traitement/source-info/form-source-info/form-source-info.component";
import {
  DetailSourceInfoComponent
} from "@modules/enqueteur/traitement/source-info/detail-source-info/detail-source-info.component";


export const SOURCE_INFO_ROUTE: Route[] = [
  {
    path: '',
    component: SourceInfoComponent,
  },
  {
    path: 'nouveau',
    component: FormSourceInfoComponent
  },
  {
    path: ':id',
    component: DetailSourceInfoComponent
  }
];
