import { Component, computed, signal } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { EnqueteListComponent } from './components/enquete-list/enquete-list.component';
import { FilterOptions } from './components/enquete-filters/enquete-filters.component';
import { StatCard, StatsCardsComponent } from './components/stats-cards/stats-cards.component';
import { EnqueteDetailsComponent, EnqueteDisplay } from './components/enquete-details/enquete-details.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { Injectable } from "@angular/core"
import { BehaviorSubject, catchError, finalize, forkJoin, map, Observable, of, tap, timeout } from "rxjs"
import { EnqueteEtatEnquete, EnqueteModel, EnqueteStatEtat } from '@core/model/enquete.model';
import { EnqueteService } from '../enquete.service';
import { Logger } from '@core/services/logger.service';
import { UtilisateurModel } from '@core/model/utilisateur.model';
import { UtilisateurStateService } from '@store/utilisateur/utilisateur-state.service';
import { ToastService } from '@core/services/toast.service';
import { Pagination } from '@core/interfaces/pagination.interface';
import { IParams } from '@core/interfaces/http-options.interface';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { FilterConfig } from '@core/interfaces/filter-config.interface';
import { PRIORITE_LEVELS } from '@config/constant';
import { SearchFilterComponent } from "@shared/components/search-filter/search-filter.component";
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root",
})
export class EnqueteService1 {
  private enquetesSubject = new BehaviorSubject<EnqueteDisplay[]>(this.getMockData())
  private filteredEnquetesSubject = new BehaviorSubject<EnqueteDisplay[]>(this.getMockData())

  enquetes$ = this.enquetesSubject.asObservable()
  filteredEnquetes$ = this.filteredEnquetesSubject.asObservable()

  private getMockData(): EnqueteDisplay[] {
    return [
      {
        id: "ENQ-2023-0892",
        titre: "Fraude financière - Détournement de fonds",
        type: "Fraude",
        priorite: "Urgent",
        statut: "En cours",
        progression: 25,
        assignee: "Jean Dupont",
        organisation: "Ministère des Finances",
        dateCreation: "2023-12-01",
        dateEcheance: "2023-12-15",
        description:
          "Enquête sur un détournement de fonds présumé dans le service comptabilité. Montant estimé: 150 000€",
        documents: 8,
        notes: 12,
        tempsEcoule: "18h 30min",
        derniereActivite: "2023-12-10 14:30",
        tags: ["Urgent", "Financier", "Interne"],
      },
      {
        id: "ENQ-2023-0885",
        titre: "Harcèlement moral - Direction RH",
        type: "Harcèlement",
        priorite: "Urgent",
        statut: "Investigation",
        progression: 60,
        assignee: "Jean Dupont",
        organisation: "Direction RH",
        dateCreation: "2023-11-28",
        dateEcheance: "2023-12-12",
        description: "Plainte pour harcèlement moral déposée par un employé contre son supérieur hiérarchique",
        documents: 15,
        notes: 8,
        tempsEcoule: "32h 15min",
        derniereActivite: "2023-12-10 11:45",
        tags: ["Urgent", "RH", "Témoins"],
      },
      {
        id: "ENQ-2023-0878",
        titre: "Non-conformité RGPD - Service IT",
        type: "Conformité",
        priorite: "Importante",
        statut: "Analyse",
        progression: 40,
        assignee: "Jean Dupont",
        organisation: "Service IT",
        dateCreation: "2023-11-25",
        dateEcheance: "2023-12-20",
        description:
          "Audit de conformité RGPD suite à un signalement de traitement non autorisé de données personnelles",
        documents: 22,
        notes: 6,
        tempsEcoule: "28h 45min",
        derniereActivite: "2023-12-09 16:20",
        tags: ["RGPD", "IT", "Données"],
      },
      {
        id: "ENQ-2023-0871",
        titre: "Audit interne - Procédures comptables",
        type: "Audit",
        priorite: "Normale",
        statut: "Finalisation",
        progression: 85,
        assignee: "Jean Dupont",
        organisation: "Comptabilité",
        dateCreation: "2023-11-20",
        dateEcheance: "2023-12-25",
        description: "Audit des procédures comptables et vérification de la conformité aux normes internes",
        documents: 35,
        notes: 18,
        tempsEcoule: "45h 20min",
        derniereActivite: "2023-12-10 09:15",
        tags: ["Audit", "Comptabilité", "Procédures"],
      },
      {
        id: "ENQ-2023-0864",
        titre: "Violation de sécurité - Accès non autorisé",
        type: "Sécurité",
        priorite: "Importante",
        statut: "En cours",
        progression: 30,
        assignee: "Jean Dupont",
        organisation: "Sécurité IT",
        dateCreation: "2023-11-22",
        dateEcheance: "2023-12-18",
        description:
          "Investigation sur un accès non autorisé aux systèmes informatiques détecté par les logs de sécurité",
        documents: 12,
        notes: 9,
        tempsEcoule: "22h 10min",
        derniereActivite: "2023-12-09 13:30",
        tags: ["Sécurité", "IT", "Logs"],
      },
    ]
  }

  filterEnquetes(filters: {
    searchTerm?: string
    status?: string
    priority?: string
    type?: string
  }): void {
    const enquetes = this.enquetesSubject.value
    let filtered = [...enquetes]

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (enquete) =>
          enquete.titre.toLowerCase().includes(term) ||
          enquete.id.toLowerCase().includes(term) ||
          enquete.organisation.toLowerCase().includes(term),
      )
    }

    if (filters.status) {
      filtered = filtered.filter((enquete) => enquete.statut === filters.status)
    }

    if (filters.priority) {
      filtered = filtered.filter((enquete) => enquete.priorite === filters.priority)
    }

    if (filters.type) {
      filtered = filtered.filter((enquete) => enquete.type === filters.type)
    }

    this.filteredEnquetesSubject.next(filtered)
  }

  sortEnquetes(criteria: "date" | "priority" | "progress" | "deadline"): void {
    const filtered = [...this.filteredEnquetesSubject.value]

    filtered.sort((a, b) => {
      switch (criteria) {
        case "date":
          return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
        case "priority":
          const priorityOrder = { Urgent: 3, Importante: 2, Normale: 1 }
          return priorityOrder[b.priorite] - priorityOrder[a.priorite]
        case "progress":
          return b.progression - a.progression
        case "deadline":
          return new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime()
        default:
          return 0
      }
    })

    this.filteredEnquetesSubject.next(filtered)
  }

  getEnqueteById(id: string): EnqueteDisplay | undefined {
    return this.enquetesSubject.value.find((enquete) => enquete.id === id)
  }
}





// --- FILTRES PRÉDÉFINIS ---
const FILTERS: FilterConfig[] = [
  {
    key: 'type',
    label: 'Type de Conerné',
    placeholder: 'Tous les types',
    options: [
      { value: "employeur", label: "Employeur" },
      { value: "travailleur", label: "Travailleur" },
      { value: "beneficiaire", label: "Bénéficiaire" },
    ],
  },
  {
    key: 'priorite',
    label: 'Priorité',
    placeholder: 'Toutes priorités',
    options: [
      ...PRIORITE_LEVELS,
      { value: 6, label: 'Urgente' },
    ],
  }
];



@Component({
  selector: 'app-enquete-en-cours',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    EnqueteListComponent,
    EnqueteDetailsComponent,
    StatsCardsComponent,
    NotificationsComponent,
    PaginationComponent,
    SearchFilterComponent
  ],
  templateUrl: './enquete-en-cours.component.html',
  styleUrls: ['./enquete-en-cours.component.css']
})
export class EnqueteEnCoursComponent {
  pageTitle: string = "Tous mes enquêtes en cours";
  pageSubTitle: string = "Gérez vos enquêtes assignées et suivez votre progession";

  currentView: "list" | "details" = "list"
  selectedEnquete: EnqueteDisplay | null = null
  enquetes = signal<EnqueteModel[]>([]);
  loading = signal<boolean>(false);

  filteredEnquetes$: Observable<EnqueteDisplay[]>
  stats$: Observable<StatCard[]>
  user!: UtilisateurModel;
  enqueteStats = signal<EnqueteStatEtat>({
    enAttente: 0,
    enCours: 0,
    terminees: 0,
    valides: 0,
    annulees: 0,
    echeances: 0,
    total: 0,
  });

  pagination = signal<Pagination>({
    limit: 5,
    page: 1,
    totalItem: 0,
    totalPage: 1
  });

  statCards = computed<StatCard[]>(() => (
    [
      {
        title: "Total",
        value: this.enqueteStats().total,
        icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        colorClass: "to-blue-50",
      },
      {
        title: "Urgentes",
        value: this.enqueteStats().urgent ?? 0,
        icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
        colorClass: "to-red-50",
      },
      {
        title: "En cours",
        value: this.enqueteStats().enCours,
        icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        colorClass: "to-yellow-50",
      },
      {
        title: "Progression",
        value: `${(this.enqueteStats().progression ?? 0).toFixed(2)}%`,
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        colorClass: "to-green-50",
      },
    ]
  ))

  filterConfig: FilterConfig[] = FILTERS;
  filter: Record<string, string | number> = {};

  constructor(
    private enqueteService: EnqueteService1,
    private service: EnqueteService,
    private readonly utilisateurState: UtilisateurStateService,
    private readonly toastService: ToastService,
    private router:Router,
  ) {
    this.filteredEnquetes$ = this.enqueteService.filteredEnquetes$
    this.stats$ = this.filteredEnquetes$.pipe(map((enquetes) => this.calculateStats(enquetes)))
  }

  ngOnInit(): void {
    this.utilisateurState.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.loadState();
        this.loadEnquete();
      }
    });
  }

  loadState() {
    this.service.statsEtat(this.user.id).subscribe({
      next: response => {
        this.enqueteStats.set(response);
      },
      error: _ => {
        this.toastService.show("Erreur lors de la récupération des statistiques", "error");
      }
    })
  }



  loadEnquete(filter: IParams = {}): void {
    this.loading.set(true);
    this.service.getAll({
      etatCode: EnqueteEtatEnquete.EnCours,
      enqueteurId: this.user.id,
      ...filter,
      ...this.pagination(),
      sort:"updatedAt,desc"
    })
      .pipe(
        // timeout(10000),
        // catchError(err => {
        //   this.toastService.show("Impossible de joindre le serveur", "error");
        //   return of(null); // on renvoie un observable "vide" pour éviter un crash
        // }),
        finalize(() => this.stopLoader())
      )
      .subscribe({
        next: response => {
          if (response?.data && response?.pagination) {
            this.enquetes.set(response.data);
            this.pagination.set(response.pagination);
          }
        },
        error: _ => {
          this.toastService.show("Erreur lors du chargement des données", "error");
        }
      });
  }

  private stopLoader(): void {
    if (this.loading()) {
      this.loading.set(false);
    }
  }


  // --- FILTRE ---
  onFiltersChanged(filter: Record<string, string | number>) {
    this.filter = filter;
    this.applyFilter();
  }

  onSearchChanged(value: string) {
    this.filter["search"] = value;
    this.applyFilter();
  }

  onResetFilters() {
    this.filter = {};
    this.applyFilter();
  }



  onFilterChange(filters: FilterOptions): void {
    this.enqueteService.filterEnquetes({
      searchTerm: filters.searchTerm,
      status: filters.status,
      priority: filters.priority,
      type: filters.type,
    })
  }


  setPagination(pg: Pagination) {
    this.pagination.set(pg);
    this.loadEnquete();
  }


  applyFilter() {
    const filter: IParams = {};
    const { priorite, search, type } = this.filter;
    if (priorite !== "") filter[priorite === 6 ? "urgent" : "priorite"] = priorite === 6 ? true : priorite;
    if (search) filter["search"] = search;
    if (type) filter["type"] = type;
    this.loadEnquete(filter);
  }

  onSortChange(criteria: string): void {
    this.enqueteService.sortEnquetes(criteria as "date" | "priority" | "progress" | "deadline")
  }

  showEnqueteDetails(enquete: EnqueteModel): void {
    this.router.navigate(["/enqueteur/enquetes/en-cours", enquete.id])
    // this.selectedEnquete = this.enqueteService.getEnqueteById(id) || null
    // this.currentView = "details"
  }

  hideEnqueteDetails(): void {
    this.currentView = "list"
    this.selectedEnquete = null
  }

  private calculateStats(enquetes: EnqueteDisplay[]): StatCard[] {
    const totalEnquetes = enquetes.length
    const urgentes = enquetes.filter((e) => e.priorite === "Urgent").length
    const enCours = enquetes.filter((e) => e.statut === "En cours").length
    const moyenneProgression =
      totalEnquetes > 0 ? Math.round(enquetes.reduce((sum, e) => sum + e.progression, 0) / totalEnquetes) : 0

    return [
      {
        title: "Total",
        value: totalEnquetes,
        icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        colorClass: "to-blue-50",
      },
      {
        title: "Urgentes",
        value: urgentes,
        icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
        colorClass: "to-red-50",
      },
      {
        title: "En cours",
        value: enCours,
        icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        colorClass: "to-yellow-50",
      },
      {
        title: "Progression",
        value: `${moyenneProgression}%`,
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        colorClass: "to-green-50",
      },
    ]
  }
}
