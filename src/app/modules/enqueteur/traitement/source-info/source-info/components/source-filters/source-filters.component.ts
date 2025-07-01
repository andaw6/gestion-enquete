import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-source-filters',
  templateUrl: './source-filters.component.html',
  styleUrls: ['./source-filters.component.css']
})
export class SourceFiltersComponent {
  @Output() filtersChange = new EventEmitter<any>()

  searchTerm = ""
  selectedCategory = ""
  selectedReliability = ""
  sortBy = "date"

  onSearchChange() {
    this.emitFilters()
  }

  onFilterChange() {
    this.emitFilters()
  }

  private emitFilters() {
    this.filtersChange.emit({
      searchTerm: this.searchTerm,
      category: this.selectedCategory,
      reliability: this.selectedReliability,
      sortBy: this.sortBy,
    })
  }
}
