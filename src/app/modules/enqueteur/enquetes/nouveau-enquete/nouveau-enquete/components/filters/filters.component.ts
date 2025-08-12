import {Component, EventEmitter, Output} from '@angular/core';
import {FilterOptions} from "@modules/enqueteur/enquetes/nouveau-enquete/model";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  @Output() filtersChanged = new EventEmitter<FilterOptions>()

  filters: FilterOptions = {
    searchTerm: "",
    priorite: "",
    typeConcerne: "",
    sortBy: "",
  }

  prioriteOptions = [
    { value: "", label: "Toutes les priorités" },
    { value: "HAUTE", label: "Priorité haute" },
    { value: "MOYENNE", label: "Priorité moyenne" },
    { value: "BASSE", label: "Priorité basse" },
  ]

  typeOptions = [
    { value: "", label: "Tous les types" },
    { value: "EMP", label: "Employeur" },
    { value: "TRV", label: "Travailleur" },
    { value: "BEN", label: "Bénéficiaire" },
  ]

  sortOptions = [
    { value: "", label: "Trier par date" },
    { value: "priorite", label: "Trier par priorité" },
    { value: "echeance", label: "Trier par échéance" },
  ]

  onFilterChange(): void {
    this.filtersChanged.emit(this.filters)
  }
}
