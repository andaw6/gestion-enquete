import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterConfig } from '@core/interfaces/filter-config.interface';
import { UtilService } from '@core/services/util.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIf, NgForOf],
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent implements OnInit, OnDestroy {
  @Input() filters: FilterConfig[] = [];
  @Input() showSearch = true;

  @Output() filtersChanged = new EventEmitter<Record<string, string | number>>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() reset = new EventEmitter<void>();

  searchTerm = '';
  selectedFilters: Record<string, string | number> = {};
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(
    private utilService: UtilService,
  ) { }



  ngOnInit(): void {
    this.setupSearchListener();
  }

  private setupSearchListener(): void {
    this.utilService.setupSearchListener(
      this.searchControl,
      (query: string) => {
        this.searchTerm = query;
        this.onSearchChange();
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFilterChange(key: string, value: string) {
    this.selectedFilters[key] = value;
    this.filtersChanged.emit(this.selectedFilters);
  }

  onSearchChange() {
    this.searchChanged.emit(this.searchTerm);
  }

  onReset() {
    this.searchTerm = '';
    this.selectedFilters = {};
    this.reset.emit();
    this.filtersChanged.emit(this.selectedFilters);
    this.searchChanged.emit(this.searchTerm);
  }
}
