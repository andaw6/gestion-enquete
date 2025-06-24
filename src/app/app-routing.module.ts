import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent as AdminLayoutComponent } from '@layout/admin/admin.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: "parametrage",
        loadChildren: () => import("@modules/admin/parametrage/parametrage.module").then(m => m.ParametrageModule)
      },
      {
        path: "utilisateur",
        loadChildren: ()=>import("@modules/admin/parametrage/utilisateur/utilisateur.module").then(m => m.UtilisateurModule),
      },
    ]
  },
  {
    path: '',
    redirectTo: 'admin/parametrage',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
