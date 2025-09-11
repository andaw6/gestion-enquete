import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DocumentFilterOptions } from "@modules/enqueteur/traitement/document/document";
import { FILE_CATEGORIES, FILE_TRI } from "@config/constant";
import { Option } from "@core/interfaces/option.interface";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Subject } from "rxjs";
import { UtilService } from "@core/services/util.service";
import { CommonModule, NgForOf } from '@angular/common';

@Component({
  selector: 'app-document-sans-enquete-filtre',
  templateUrl: './document-sans-enquete-filtre.component.html',
  styleUrls: ['./document-sans-enquete-filtre.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgForOf
  ]
})
export class DocumentSansEnqueteFiltreComponent implements OnInit, OnDestroy {
  @Output() filtersChange = new EventEmitter<DocumentFilterOptions>();
  @Output() uploadClick = new EventEmitter<void>();

  filterCategories: Option[] = FILE_CATEGORIES;
  filterTries: Option[] = FILE_TRI;

  @Input() filters: DocumentFilterOptions = {
    searchTerm: '',
    filterType: 'all',
    sortBy: 'date',
    viewMode: 'grid',
  };

  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(
    private utilService: UtilService,
  ) {
  }

  ngOnInit(): void {
    this.setupSearchListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchListener(): void {
    this.utilService.setupSearchListener(this.searchControl, query => {
      this.filters.searchTerm = query;
      this.onFiltersChange();
    })
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
