import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PreferenceComponent} from './preference/preference.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {PREFERENCE_ROUTES} from "@modules/enqueteur/parametrage/preference/preference-routing";


@NgModule({
  declarations: [
    PreferenceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(PREFERENCE_ROUTES),
  ]
})
export class PreferenceModule {
}
