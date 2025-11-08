import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  @Output() filtersChanged = new EventEmitter()

  filters = {
    status: "",
    concerneType: "",
    requester: "",
    date: "",
  }

  resetFilters(): void {
    this.filters = { status: "", concerneType: "", requester: "", date: "" }
    this.filtersChanged.emit(this.filters)
  }
}
