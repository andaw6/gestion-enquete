import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterOptions {
  searchTerm: string
  status: string
  priority: string
  type: string
}

@Component({
  selector: 'app-enquete-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enquete-filters.component.html',
  styleUrls: ['./enquete-filters.component.css']
})
export class EnqueteFiltersComponent {
  @Output() filterChange = new EventEmitter<FilterOptions>()
  @Output() sortChange = new EventEmitter<string>()

  filters: FilterOptions = {
    searchTerm: "",
    status: "",
    priority: "",
    type: "",
  }

  onFilterChange(): void {
    this.filterChange.emit(this.filters)
  }

  onSort(criteria: string): void {
    this.sortChange.emit(criteria)
  }
}
