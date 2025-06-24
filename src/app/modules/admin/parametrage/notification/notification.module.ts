import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { RouterModule } from '@angular/router';
import { NOTIFICATION_ROUTES } from './notfication-routing';
import { NotificationFiltersComponent } from './notification/components/notification-filters/notification-filters.component';
import { FormsModule } from '@angular/forms';
import { NotificationListComponent } from './notification/components/notification-list/notification-list.component';
import { NotificationStatsComponent } from './notification/components/notification-stats/notification-stats.component';
import { NotificationHeaderComponent } from './notification/components/notification-header/notification-header.component';
import { NotificationModalComponent } from './notification/components/notification-modal/notification-modal.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ConfirmDeleteModalComponent } from '@shared/components/confirm-delete-modal/confirm-delete-modal.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';


@NgModule({
  declarations: [
    NotificationComponent,
    NotificationFiltersComponent,
    NotificationListComponent,
    NotificationStatsComponent,
    NotificationHeaderComponent,
    NotificationModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    ConfirmDeleteModalComponent,
    LoaderComponent,
    RouterModule.forChild(NOTIFICATION_ROUTES)
  ]
})
export class NotificationModule { }
