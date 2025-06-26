import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PARAMETRAGE_ROUTES } from "./parametrage-routing";

@NgModule({
    imports: [RouterModule.forChild(PARAMETRAGE_ROUTES)],
    exports: [RouterModule]
})
export class ParametrageModule { }