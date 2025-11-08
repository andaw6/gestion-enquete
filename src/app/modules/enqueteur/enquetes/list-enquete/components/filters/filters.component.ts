import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterData {
  search: string
  etat: string
  dateDebut: string
  progression: string
}


@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
@Output() filtersChanged = new EventEmitter<FilterData>()
  @Output() resetFilters = new EventEmitter<void>()

  filters: FilterData = {
    search: "",
    etat: "",
    dateDebut: "",
    progression: "",
  }

  onFilter() {
    this.filtersChanged.emit(this.filters)
  }

  onReset() {
    this.filters = { search: "", etat: "", dateDebut: "", progression: "" }
    this.resetFilters.emit()
  }
}
