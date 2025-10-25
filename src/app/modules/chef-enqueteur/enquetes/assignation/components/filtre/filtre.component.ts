import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterCriteria } from '@modules/chef-enqueteur/enquetes/model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtre.component.html',
  styleUrls: ['./filtre.component.css']
})
export class FiltreComponent {
  @Output() filterChange = new EventEmitter<FilterCriteria>()
  @Output() resetFilters = new EventEmitter<void>()

  filters: FilterCriteria = {
    searchTerm: "",
    priorite: "",
    type: "",
  }

  onFilterChange() {
    this.filterChange.emit(this.filters)
  }

  onReset() {
    this.filters = {
      searchTerm: "",
      priorite: "",
      type: "",
    }
    this.resetFilters.emit()
  }
}
