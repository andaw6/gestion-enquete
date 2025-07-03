import { CommonModule } from "@angular/common";
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { OptionSelect } from "@core/interfaces/option.interface";
import { Pagination } from "@core/interfaces/pagination.interface";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";

@Component({
  selector: 'app-select-search-paginate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-search-paginate.component.html',
  styleUrls: ['./select-search-paginate.component.css']
})
export class SelectSearchPaginateComponent implements OnInit {
  @Input() title: string = 'Sélecteur Avancé';
  @Input() options: OptionSelect[] = [];
  @Input() selected:OptionSelect[] = [];
  @Input() activePagination: boolean = false;
  @Input() pagination: Pagination = {
    totalItem: 1,
    totalPage: 1,
    limit: 10,
    page: 1
  };
  @Output() onPaginationChange = new EventEmitter<Pagination>();
  @Output() optionSelected = new EventEmitter<OptionSelect[]>();

  isOpen: boolean = false;
  searchTerm: string = '';
  selectedOptions: string[] = [];
  filteredOptions: OptionSelect[] = [];

  private searchSubject = new Subject<string>();

  ngOnInit() {
    if(this.selected.length) {
      this.selected.forEach((option: OptionSelect) => this.selectOption(option));
    }
    this.filteredOptions = [...this.options];

    if (!this.activePagination) {
      this.updatePagination();
    }

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
    const index = this.selectedOptions.indexOf(option.value);

    if (index >= 0) {
      this.selectedOptions.splice(index, 1);
    } else {
      this.selectedOptions.push(option.value);
    }

    const selected = this.options.filter(opt => this.selectedOptions.includes(opt.value));
    this.optionSelected.emit(selected);
  }

  isSelected(value: string): boolean {
    return this.selectedOptions.includes(value);
  }

  getSelectedOptionLabel(): string {
    if (this.selectedOptions.length === 0) return 'Sélectionnez une option';
    if (this.selectedOptions.length === 1) {
      const opt = this.options.find(o => o.value === this.selectedOptions[0]);
      return opt ? opt.label : '1 sélectionné';
    }
    return `${this.selectedOptions.length} sélectionnés`;
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
