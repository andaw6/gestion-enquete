import {Route} from "@angular/router";
import {SourceInfoComponent} from "@modules/enqueteur/traitement/source-info/source-info/source-info.component";
import {SourceTestComponent} from "@modules/enqueteur/traitement/source-info/source-test/source-test.component";
import {
  FormSourceInfoComponent
} from "@modules/enqueteur/traitement/source-info/form-source-info/form-source-info.component";


export const SOURCE_INFO_ROUTE: Route[] = [
  {
    path: '',
    component: SourceInfoComponent,
  },
  {
    path: 'test',
    component: SourceTestComponent,
  },
  {
    path: 'nouveau',
    component: FormSourceInfoComponent
  }
];
