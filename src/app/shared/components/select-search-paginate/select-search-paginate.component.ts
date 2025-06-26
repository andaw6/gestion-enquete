import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { OptionSelect } from "@core/interfaces/option-select.interface";
import { Pagination } from "@core/interfaces/pagination.interface";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";


@Component({
  selector: 'app-select-search-paginate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-search-paginate.component.html',
  styleUrls: ['./select-search-paginate.component.css']
})
export class SelectSearchPaginateComponent {
  @Input() title: string = 'Sélecteur Avancé';
  @Input() options: OptionSelect[] = [];
  @Input() activePagination: boolean = false;
  @Input() pagination: Pagination = {
    totalItem: 1,
    totalPage: 1,
    limit: 10,
    page: 1
  };
  @Output() onPaginationChange: EventEmitter<Pagination> = new EventEmitter<Pagination>()
  @Output() optionSelected = new EventEmitter<OptionSelect | null>();

  isOpen: boolean = false;
  searchTerm: string = '';
  selectedOption: string | null = null;
  filteredOptions: OptionSelect[] = [];


  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.filteredOptions = [...this.options];
    if (!this.activePagination) {
      this.updatePagination();
    }
    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.filterOptions(term);
    });
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;

    // Add click outside listener when opened
    if (this.isOpen) {
      setTimeout(() => {
        document.addEventListener('click', this.onClickOutside);
      });
    } else {
      document.removeEventListener('click', this.onClickOutside);
    }
  }

  onClickOutside = (event: any) => {
    const dropdownElement = (event.target as HTMLElement).closest('.custom-dropdown');
    if (!dropdownElement && this.isOpen) {
      this.isOpen = false;
      document.removeEventListener('click', this.onClickOutside);
    }
  }

  onSearchChange(term: string) {
    this.searchSubject.next(term);
  }

  filterOptions(term: string) {
    if (!term) {
      this.filteredOptions = [...this.options];
    } else {
      this.filteredOptions = this.options.filter(option =>
        option.label.toLowerCase().includes(term.toLowerCase()) ||
        option.description.toLowerCase().includes(term.toLowerCase())
      );
    }

    this.pagination.page = 1;
    this.updatePagination();
  }

  selectOption(option: OptionSelect) {
    if (this.selectedOption == option.value) {
      this.selectedOption = null;
      this.optionSelected.emit(null);
    } else {
      this.selectedOption = option.value;
      this.optionSelected.emit(option);
      this.isOpen = false;
    }
    document.removeEventListener('click', this.onClickOutside);
  }

  getSelectedOptionLabel(): string {
    const option = this.options.find(o => o.value === this.selectedOption);
    return option ? option.label : 'Sélectionnez une option';
  }

  nextPage() {
    if (this.pagination.page < this.pagination.totalPage) {
      this.pagination.page++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.pagination.page > 1) {
      this.pagination.page--;
      this.updatePagination();
    }
  }

  updatePagination() {
    if (this.activePagination) {
      this.onPaginationChange.emit(this.pagination);
    }
  }
}

