import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {SECURITE_ROUTES} from "@modules/enqueteur/parametrage/securite/securite-routing";
import { SecuriteComponent } from './securite/securite.component';
import {ReactiveFormsModule} from "@angular/forms";
import {LucideAngularModule} from "lucide-angular";
import {PageHeaderComponent} from "@shared/components/page-header/page-header.component";



@NgModule({
  declarations: [
    SecuriteComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        LucideAngularModule,
        RouterModule.forChild(SECURITE_ROUTES),
        PageHeaderComponent,
    ]
})
export class SecuriteModule { }
