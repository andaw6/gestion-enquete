import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FilterOptions} from "@modules/enqueteur/traitement/document/document";
import {FILE_CATEGORIES, FILE_TRI} from "@config/constant";
import {Option} from "@core/interfaces/option.interface";
import {FormControl} from "@angular/forms";
import {debounceTime, distinctUntilChanged, filter, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-document-sans-enquete-filtre',
  templateUrl: './document-sans-enquete-filtre.component.html',
  styleUrls: ['./document-sans-enquete-filtre.component.css']
})
export class DocumentSansEnqueteFiltreComponent  implements OnInit, OnDestroy {
  @Output() filtersChange = new EventEmitter<FilterOptions>();
  @Output() uploadClick = new EventEmitter<void>();

  filterCategories: Option[] = FILE_CATEGORIES;
  filterTries: Option[] = FILE_TRI;

  filters: FilterOptions = {
    searchTerm: '',
    filterType: 'all',
    sortBy: 'date',
    viewMode: 'grid',
  };

  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.setupSearchListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchListener(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(query => query === '' || this.isValidQuery(query)),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        this.filters.searchTerm = <string>query?.trim();
        this.onFiltersChange();
      });
  }

  private isValidQuery(query: string | null): boolean {
    return query !== null && query.trim() !== '' && query.length >= 3;
  }

  onFiltersChange(): void {
    this.filtersChange.emit(this.filters);
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.filters.viewMode = mode;
    this.onFiltersChange();
  }

  onUploadClick(): void {
    this.uploadClick.emit();
  }
}
