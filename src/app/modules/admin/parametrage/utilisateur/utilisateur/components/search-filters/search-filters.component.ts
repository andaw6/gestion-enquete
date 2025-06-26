import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FilterOptions} from "@modules/admin/parametrage/utilisateur/utilisateur";

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.css']
})
export class SearchFiltersComponent {
  @Input() filters!: FilterOptions
  @Output() filtersChange = new EventEmitter<FilterOptions>()

  onSearchChange(search: string): void {
    this.filtersChange.emit({
      ...this.filters,
      search,
    })
  }

  onStatusChange(status: string): void {
    this.filtersChange.emit({
      ...this.filters,
      status,
    })
  }

  onRoleChange(role: string): void {
    this.filtersChange.emit({
      ...this.filters,
      role,
    })
  }

  onClearFilters(): void {
    this.filtersChange.emit({
      search: "",
      status: "",
      role: "",
    })
  }
}
