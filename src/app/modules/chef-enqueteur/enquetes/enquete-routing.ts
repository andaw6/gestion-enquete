import { Routes } from "@angular/router";
import { AssignationComponent } from "@modules/chef-enqueteur/enquetes/assignation/assignation.component";
import { SuiviEnqueteComponent } from "@modules/chef-enqueteur/enquetes/suivi-enquete/suivi-enquete.component";
import { ValidationComponent } from "@modules/chef-enqueteur/enquetes/validation/validation.component";

export const ENQUETES_ROUTES: Routes = [
  {
    path: "assignations",
    component: AssignationComponent
  },
  {
    path: "suivi",
    component: SuiviEnqueteComponent
  },
  {
    path: "validation",
    component: ValidationComponent
  }
];
