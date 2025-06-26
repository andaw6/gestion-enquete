import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationFilter } from '../../../notification';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification-filters',
  templateUrl: './notification-filters.component.html',
  styleUrls: ['./notification-filters.component.css'],
})
export class NotificationFiltersComponent {

  @Input() filter: NotificationFilter = {
    search: "",
    type: "",
    status: "all",
  }
  @Input() hasSelection = false
  @Output() filterChange = new EventEmitter<NotificationFilter>()
  @Output() deleteSelected = new EventEmitter<void>()
  @Output() markSelectedRead = new EventEmitter<void>()

  setStatusFilter(status: NotificationFilter["status"]): void {
    this.filter.status = status
    this.onFilterChange()
  }

  onFilterChange(): void {
    this.filterChange.emit({ ...this.filter })
  }

  getFilterButtonClass(status: string): string {
    const isActive = this.filter.status === status
    return isActive
      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
      : "text-gray-700 bg-gray-100  hover:bg-gray-200 "
  }
}
