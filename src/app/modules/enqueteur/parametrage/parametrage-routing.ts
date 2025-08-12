import {Route} from '@angular/router';

export const PARAMETRAGE_ROUTES: Route[] = [
  {
    path: 'securite',
    loadChildren: () =>
      import("@modules/enqueteur/parametrage/securite/securite.module").then(m => m.SecuriteModule),
  },
  {
    path: 'enquete',
    loadChildren: () =>
      import("@modules/enqueteur/parametrage/enquete/enquete.module").then(m => m.EnqueteModule),
  },
  {
    path: 'preference',
    loadChildren: () =>
      import("@modules/enqueteur/parametrage/preference/preference.module").then(m => m.PreferenceModule),
  },
  {
    path: 'notification',
    loadChildren: () =>
      import("@modules/enqueteur/parametrage/notification/notification.module").then(m => m.NotificationModule),
  },
  {
    path: '**',
    redirectTo: 'securite',
    pathMatch: 'full',
  }
];
