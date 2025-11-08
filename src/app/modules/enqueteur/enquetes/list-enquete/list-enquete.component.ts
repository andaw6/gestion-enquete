import { EnqueteService } from './../enquete.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { FiltersComponent, type FilterData } from "./components/filters/filters.component"
import { StatsCardsComponent } from "./components/stats-cards/stats-cards.component"
import { TableComponent } from "./components/table/table.component"
import { Pagination } from '@core/interfaces/pagination.interface';
import { IParams } from '@core/interfaces/http-options.interface';
import { ToastService } from '@core/services/toast.service';
import { EnqueteModel } from '@core/model/enquete.model';

@Component({
  selector: 'app-list-enquete',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    PaginationComponent,
    FiltersComponent,
    StatsCardsComponent,
    TableComponent,
  ],
  templateUrl: './list-enquete.component.html',
  styleUrls: ['./list-enquete.component.css']
})
export class ListEnqueteComponent {

  pageTitle: string = "Mes enquêtes";
  pageSubTitle: string = "Consultez l’ensemble des enquêtes que vous avez menées ou qui vous ont été attribuées.";

  pagination: Pagination = {
    page: 1,
    limit: 10,
    totalItem: 0,
    totalPage: 1
  }

  statCards = [
  {
    title: "Enquêtes Totales",
    value: 24,
    subtitle: "12% ce mois",
    icon: "fas fa-folder-open", // Icône de dossier ouvert
    bgColor: "text-secondary-600",
    iconColor: "gradient-secondary",
    trend: "+12% ce mois",
    trendType: "positive" as const,
  },
  {
    title: "En Cours",
    value: 8,
    subtitle: "33% du total",
    icon: "fas fa-spinner", // Icône animée pour 'en cours'
    bgColor: "text-yellow-600",
    iconColor: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    trend: undefined,
  },
  {
    title: "Terminées",
    value: 14,
    subtitle: "58% du total",
    icon: "fas fa-check-circle", // Icône de validation
    bgColor: "text-green-600",
    iconColor: "bg-gradient-to-br from-green-400 to-green-600",
    trend: undefined,
  },
  {
    title: "Taux Moyen",
    value: "68%",
    subtitle: "+5% cette semaine",
    icon: "fas fa-chart-line", // Icône de performance
    bgColor: "text-primary-600",
    iconColor: "gradient-primary",
    trend: "+5% cette semaine",
    trendType: "positive" as const,
  },
];


  enquetes: EnqueteModel[] = []

  constructor(
    private readonly enqueteService: EnqueteService,
    private readonly toastService: ToastService
  ) { }

  ngOnInit() {
    console.log("✅ Application initialisée avec succès")
    this.loadEnquete();
  }

  setPage(pg: Pagination) {
    this.pagination = pg;
    this.loadEnquete();
  }

  loadEnquete(filter: IParams = {}) {
    this.enqueteService.getAll({
      ...filter,
      ...this.pagination,
      sort: "updatedAt,desc"
    }).subscribe({
      next: (response) => {
        this.enquetes = response.data;
        this.pagination = response.pagination;
      },
      error: (err) => {
        this.toastService.show("Erreur lors du changement des enquêtes", "error");
      }
    })
  }

  onFiltersChanged(filters: FilterData) {
    console.log("Filtres appliqués:", filters)
  }

  onResetFilters() {
    console.log("Filtres réinitialisés")
  }

  onViewEnquete(row: EnqueteModel) {
    console.log("Consultation:", row.reference)
  }

  onEditEnquete(row: EnqueteModel) {
    console.log("Édition:", row.reference)
  }

  onDeleteEnquete(row: EnqueteModel) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'enquête ${row.reference} ?`)) {
      console.log("Suppression:", row.reference)
    }
  }
}
