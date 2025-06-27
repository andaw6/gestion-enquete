import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-document-filters',
  templateUrl: './document-filters.component.html',
  styleUrls: ['./document-filters.component.css']
})
export class DocumentFiltersComponent {
  @Output() searchChange = new EventEmitter<string>()
  @Output() investigationFilter = new EventEmitter<string>()
  @Output() typeFilter = new EventEmitter<string>()
  @Output() sortChange = new EventEmitter<string>()
  @Output() viewModeChange = new EventEmitter<"grid" | "list">()

  searchTerm = ""
  selectedInvestigation = ""
  selectedType = ""
  selectedSort = ""
  viewMode: "grid" | "list" = "list"

  investigations = [
    "Toutes les enquêtes",
    "SARL TechCorp",
    "Marie Diallo",
    "Association Solidarité",
    "Entreprise Bâti-Plus",
  ]

  documentTypes = ["Tous les types", "Rapports", "Photos", "Documents officiels", "Témoignages", "Preuves"]

  sortOptions = ["Trier par date", "Trier par nom", "Trier par taille", "Trier par type"]

  onSearchChange(): void {
    this.searchChange.emit(this.searchTerm)
  }

  onInvestigationChange(): void {
    this.investigationFilter.emit(this.selectedInvestigation)
  }

  onTypeChange(): void {
    this.typeFilter.emit(this.selectedType)
  }

  onSortChange(): void {
    this.sortChange.emit(this.selectedSort)
  }

  onViewModeChange(mode: "grid" | "list"): void {
    this.viewMode = mode
    this.viewModeChange.emit(mode)
  }
}
