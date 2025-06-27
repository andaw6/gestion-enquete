import {Component, EventEmitter, Output} from '@angular/core';
import {FilterOptions} from "@modules/enqueteur/traitement/document/document";

@Component({
  selector: 'app-document-sans-enquete-filtre',
  templateUrl: './document-sans-enquete-filtre.component.html',
  styleUrls: ['./document-sans-enquete-filtre.component.css']
})
export class DocumentSansEnqueteFiltreComponent {
  @Output() filtersChange = new EventEmitter<FilterOptions>()
  @Output() uploadClick = new EventEmitter<void>()

  filters: FilterOptions = {
    searchTerm: "",
    filterType: "all",
    sortBy: "date",
    viewMode: "grid",
  }

  onFiltersChange(): void {
    this.filtersChange.emit(this.filters)
  }

  setViewMode(mode: "grid" | "list"): void {
    this.filters.viewMode = mode
    this.onFiltersChange()
  }

  onUploadClick(): void {
    this.uploadClick.emit()
  }
}
