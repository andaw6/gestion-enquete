import {Component, EventEmitter, Output} from '@angular/core';
import {SourceFilters} from "@modules/enqueteur/traitement/source-info/source-info";

@Component({
  selector: 'app-source-filter',
  templateUrl: './source-filter.component.html',
  styleUrls: ['./source-filter.component.css']
})
export class SourceFilterComponent {
  @Output() filtersChange = new EventEmitter<SourceFilters>()

  filters: SourceFilters = {
    searchTerm: "",
    etatCode: "",
    niveauFiabilite: "",
    sortBy: "updatedAt",
  }

  onFilterChange() {
    this.filtersChange.emit({ ...this.filters })
  }
}
