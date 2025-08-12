import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {NOTIFICATION_ROUTES} from "@modules/enqueteur/parametrage/notification/notification-routing";




@NgModule({
  declarations: [
    NotificationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(NOTIFICATION_ROUTES),
  ]
})
export class NotificationModule { }
