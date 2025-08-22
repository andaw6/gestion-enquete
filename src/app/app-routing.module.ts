import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent as AdminLayoutComponent } from '@layout/admin/admin.component';
import { EnqueteurComponent as EnqueteurLayoutComponent } from "@layout/enqueteur/enqueteur.component";
import { DemandeurComponent as DemandeurLayoutComponent } from "@layout/demandeur/demandeur.component";
import { ChefEnqueteurComponent as ChefEnqueteurLayoutComponent } from "@layout/chef-enqueteur/chef-enqueteur.component";


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
        path: 'dashboard',
        loadChildren: () =>
          import("@modules/enqueteur/enquetes/dashboard/dashboard.module").then(m => m.DashboardModule)
      },
      {
        path: 'enquetes',
        loadChildren: () =>
          import("@modules/enqueteur/enquetes/enquetes.module").then(m => m.EnquetesModule),
      },
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
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: "demandeur",
    component: DemandeurLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import("@modules/demandeur/dashboard/dashboard.module").then(m => m.DashboardModule)
      },
      {
        path: "demandes",
        loadChildren: () =>
          import("@modules/demandeur/demandes/demandes.module").then(m => m.DemandesModule)
      },
      {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: "chef-enqueteur",
    component: ChefEnqueteurLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import("@modules/chef-enqueteur/dashboard/dashboard.module").then(m => m.DashboardModule)
      },
      {
        path: "enquetes",
        loadChildren: () =>
          import("@modules/chef-enqueteur/enquetes/enquetes.module").then(m => m.EnquetesModule)
      },
      {
        path: '**',
        redirectTo: 'dashboard',
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
