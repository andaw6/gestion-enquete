import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EtatEnqueteService } from '@modules/admin/parametrage/etat-enquete/etat-enquete.service';
import { Option } from '@core/interfaces/option.interface';
import { UtilService } from '@core/services/util.service';

export interface FilterData {
  search: string
  etat: string
  dateDebut: string
  progression: string
}


@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, NgForOf, ReactiveFormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<FilterData>()
  @Output() resetFilters = new EventEmitter<void>();

  etatOptions: Option[] = [];

  filters: FilterData = {
    search: "",
    etat: "",
    dateDebut: "",
    progression: "",
  }
  searchControl = new FormControl('');

  readonly etatEnqueteService = inject(EtatEnqueteService);
  readonly utilService = inject(UtilService);

  ngOnInit(): void {
    this.loadEtat();
    this.setupSearchListener();
  }

  loadEtat() {
    this.etatEnqueteService.getAll().subscribe({
      next: (response) => {
        this.etatOptions = [...response.data].map(r => ({ label: r.libelle, value: r.code }));
      },
      error: (err) => {
        this.utilService.showNotification("Erreur lors du chargement des états d'enquête", "error");
      }
    });
  }

  private setupSearchListener(): void {
    this.utilService.setupSearchListener(
      this.searchControl,
      (query: string) => {
        this.filters.search = query;
        this.onFilter();
      }
    );
  }


  onFilter() {
    this.filtersChanged.emit(this.filters)
  }

  onReset() {
    this.filters = { search: "", etat: "", dateDebut: "", progression: "" }
    this.searchControl.reset('', { emitEvent: false });
    this.resetFilters.emit()
  }
}
