import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


export interface FilterData {
  statut: string;
  typeConcerne: string;
  demandeur: string;
  dateDebut: Date | null;
  dateFin: Date | null;
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  @Output() filterChange = new EventEmitter<FilterData>();

  filters: FilterData = {
    statut: '',
    typeConcerne: '',
    demandeur: '',
    dateDebut: null,
    dateFin: null
  };

  dateInput: string = '';

  onFilterChange(): void {
    this.filterChange.emit({ ...this.filters });
  }

  onDateChange(): void {
    if (this.dateInput) {
      this.filters.dateDebut = new Date(this.dateInput);
    } else {
      this.filters.dateDebut = null;
    }
    this.onFilterChange();
  }

  resetFilters(): void {
    this.filters = {
      statut: '',
      typeConcerne: '',
      demandeur: '',
      dateDebut: null,
      dateFin: null
    };
    this.dateInput = '';
    this.onFilterChange();
  }
}
