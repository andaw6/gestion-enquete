import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Pagination } from '@core/interfaces/pagination.interface';
import { Logger } from '@core/services/logger.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-pagination1',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, FormsModule],
  templateUrl: './pagination1.component.html',
  styleUrls: ['./pagination1.component.css']
})
export class Pagination1Component implements OnInit, OnChanges {
  @Input() pagination!: Pagination;
  @Input() maxVisiblePages: number = 5; // Nombre maximum de pages visibles
  @Input() showLimitSelector: boolean = true; // Afficher le sélecteur de limite
  @Input() limitOptions: number[] = [5, 10, 25, 50, 100]; // Options de limite
  @Input() loading: boolean = false; // État de chargement

  @Output() pageChange = new EventEmitter<Pagination>();

  ngOnInit(): void {
    Logger.log({ message: "Pagination init", data: this.pagination })
    this.validatePagination();
    this.verifedPagination(this.pagination);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagination']) {
      const paginationChange = changes['pagination']?.currentValue as Pagination | undefined;
      if (!paginationChange) return;
      this.validatePagination();
      this.verifedPagination(paginationChange)
    }
  }

  /**
   * Valide les données de pagination
   */
  private validatePagination(): void {
    if (!this.pagination) {
      console.error('Pagination data is required');
      return;
    }

    if (this.pagination.page < 1) {
      this.pagination.page = 1;
    }

    if (this.pagination.page > this.pagination.totalPage) {
      this.pagination.page = this.pagination.totalPage;
    }


  }

  verifedPagination(pag: Pagination) {
    // Seulement si une seule page
    if (!!pag && pag.totalPage === 1) {
      // Trouver la première limite >= totalItem
      const bestLimit = this.limitOptions.find(
        (limit) => pag.totalItem <= limit
      );
      if (bestLimit) {
        this.pagination = { ...pag, limit: bestLimit };
      }
    }
  }


  /**
   * Navigue vers une page spécifique
   */
  goToPage(page: number): void {
    if (page < 1 || page > this.pagination.totalPage || page === this.pagination.page || this.loading) {
      return;
    }
    this.pagination.page = page;
    this.pageChange.emit(this.pagination);

  }

  /**
   * Gère le changement de limite d'éléments par page
   */
  onLimitChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newLimit = parseInt(target.value);

    // Calculer la nouvelle page pour maintenir approximativement la même position
    const currentFirstItem = (this.pagination.page - 1) * this.pagination.limit + 1;
    const newPage = Math.ceil(currentFirstItem / newLimit);

    this.pagination.page = newPage;
    this.pagination.limit = newLimit;
    this.pageChange.emit(this.pagination);


    // this.pageChange.emit({
    //   page: newPage,
    //   limit: newLimit
    // });
  }

  /**
   * Retourne les pages visibles dans la pagination
   */
  getVisiblePages(): number[] {
    const totalPages = this.pagination.totalPage;
    const currentPage = this.pagination.page;
    const maxVisible = this.maxVisiblePages;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisible / 2);
    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(startPage + maxVisible - 1, totalPages);

    // Ajuster si on est proche de la fin
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(endPage - maxVisible + 1, 1);
    }

    // Ne pas afficher la première page si elle fait partie des pages visibles
    if (startPage <= 2) {
      startPage = 1;
    }

    // Ne pas afficher la dernière page si elle fait partie des pages visibles
    if (endPage >= totalPages - 1) {
      endPage = totalPages;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  /**
   * Détermine si la première page doit être affichée séparément
   */
  shouldShowFirstPage(): boolean {
    const visiblePages = this.getVisiblePages();
    return visiblePages[0] > 2;
  }

  /**
   * Détermine si la dernière page doit être affichée séparément
   */
  shouldShowLastPage(): boolean {
    const visiblePages = this.getVisiblePages();
    return visiblePages[visiblePages.length - 1] < this.pagination.totalPage - 1;
  }

  /**
   * Détermine si les ellipsis de début doivent être affichées
   */
  shouldShowStartEllipsis(): boolean {
    const visiblePages = this.getVisiblePages();
    return visiblePages[0] > 3;
  }

  /**
   * Détermine si les ellipsis de fin doivent être affichées
   */
  shouldShowEndEllipsis(): boolean {
    const visiblePages = this.getVisiblePages();
    return visiblePages[visiblePages.length - 1] < this.pagination.totalPage - 2;
  }

  /**
   * Retourne les classes CSS pour un bouton de page
   */
  getPageButtonClass(page: number): string {
    const baseClasses = 'border';
    const isActive = page === this.pagination.page;

    if (isActive) {
      return `${baseClasses} bg-primary-500 text-white border-primary-500 hover:bg-primary-600`;
    }

    return `${baseClasses} bg-white text-dark-500 border-gray-300 hover:bg-gray-50 hover:text-dark-700`;
  }

  /**
   * Calcule l'index du premier élément affiché
   */
  getStartItem(): number {
    return (this.pagination.page - 1) * this.pagination.limit + 1;
  }

  /**
   * Calcule l'index du dernier élément affiché
   */
  getEndItem(): number {
    return Math.min(this.pagination.page * this.pagination.limit, this.pagination.totalItem);
  }
}
