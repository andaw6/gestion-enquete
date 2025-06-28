import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, } from '@angular/forms';
import { Pagination } from '@core/interfaces/pagination.interface';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent implements OnInit {
  protected changePage: number = 0;
  @Output() pageChanged = new EventEmitter<Pagination>();
  @Input() pagination: Pagination = {
    limit: 10,
    page: 1,
    totalItem: 0,
    totalPage: 0
  };

  visiblePages: number[] = []; // Pages à afficher
  private maxVisiblePages: number = 5; // Nombre maximum de pages visibles

  @Input() resultsPerPage!: number;
  @Input() currentPage!: number;
  @Input() totalItem!: number;

  ngOnInit(): void {
    // console.log(this.pagination);
    this.calculateVisiblePages();
  }

  calculateVisiblePages(): void {
    const pages: number[] = [];
    const total = this.pagination.totalPage;
    const current = this.pagination.page;

    // Plages autour de la page courante
    const startPage = Math.max(1, current - Math.floor(this.maxVisiblePages / 2));
    const endPage = Math.min(total, startPage + this.maxVisiblePages - 1);

    // Si nécessaire, ajuster les plages pour inclure les limites
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Ajouter "..." si nécessaire
    if (startPage > 1) {
      pages.unshift(-1); // -1 représente "..."
      pages.unshift(1); // Toujours inclure la première page
    }
    if (endPage < total) {
      pages.push(-1); // -1 représente "..."
      pages.push(total); // Toujours inclure la dernière page
    }

    this.visiblePages = pages;
  }

  goToPage(page: number): void {
    this.pagination.page = Number(this.pagination.page);
    if (page === -1 || page === this.pagination.page) return; // Ignore les clics sur "..."
    setTimeout(() => {
      this.pagination.page = page;
      this.pageChanged.emit(this.pagination);
      this.calculateVisiblePages();
    }, 0);
  }

  goToNextPage(): void {
    this.pagination.page = Number(this.pagination.page);
    if (this.pagination.page < this.pagination.totalPage) {
      this.goToPage(this.pagination.page + 1);
    }
  }

  goToPreviousPage(): void {
    this.pagination.page = Number(this.pagination.page);
    if (this.pagination.page > 1) {
      this.goToPage(this.pagination.page - 1);
    }
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.pagination.totalPage }, (_, i) => i + 1);
  }

  updateResultsPerPage(): void {
    this.pagination.limit = Number(this.pagination.limit);
    if (this.pagination.page > this.pagination.totalPage) {
      this.pagination.page = this.pagination.totalPage;
    }
    const total = Math.ceil(this.pagination.totalItem / this.pagination.limit);
    if (this.pagination.page > total) {
      this.pagination.page = total;
    }

    // Émettre un événement si nécessaire pour le parent
    this.pageChanged.emit(this.pagination);

    // Recalculer les pages visibles
    this.calculateVisiblePages();
  }

  updatePage(value: number) {
    this.goToPage(Number(value));
  }
}
