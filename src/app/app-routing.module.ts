import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent as AdminLayoutComponent} from '@layout/admin/admin.component';
import {EnqueteurComponent as EnqueteurLayoutComponent} from "@layout/enqueteur/enqueteur.component";

const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: "parametrage",
        loadChildren: () =>
          import("@modules/admin/parametrage/parametrage.module").then(m => m.ParametrageModule)
      },
      {
        path: '**',
        redirectTo: 'parametrage',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'enqueteur',
    component: EnqueteurLayoutComponent,
    children: [
      {
        path: "traitement",
        loadChildren: () =>
          import("@modules/enqueteur/traitement/traitement.module").then(m => m.TraitementModule)
      },
      {
        path: "parametrage",
        loadChildren: () =>
          import("@modules/enqueteur/parametrage/parametrage.module").then(m => m.ParametrageModule)
      },
      {
        path: 'profil',
        loadChildren: () =>
          import('@modules/enqueteur/parametrage/profil/profil.module').then(m => m.ProfilModule),
      },
      {
        path: '**',
        redirectTo: 'traitement',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'enqueteur',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
