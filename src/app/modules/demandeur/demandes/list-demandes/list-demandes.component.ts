import { Component, OnInit, signal } from '@angular/core';
import { PRIORITE_LEVELS } from '@config/constant';
import { FilterConfig } from '@core/interfaces/filter-config.interface';
import { StatCard } from '@shared/components/stat-card/stat-card.component';
import { DemandeService } from '../demande.service';
import { NotificationAlertService } from '@core/services/notification-alert.service';
import { Router } from '@angular/router';
import { IParams } from '@core/interfaces/http-options.interface';
import { Pagination } from '@core/interfaces/pagination.interface';
import { ApiResponse } from '@core/interfaces/api-response.interface';
import { DemandeEnquete } from '@modules/demandeur/dashboard/dashboard';
import { ResponseError } from '@core/interfaces/response-error.interface';
import { EtatDemandeService } from '@modules/admin/parametrage/etat-demande/etat-demande.service';
import { UtilisateurStateService } from 'src/app/store/utilisateur/utilisateur-state.service';
import { Utilisateur } from '@core/interfaces/utilisateur.interface';

@Component({
  selector: 'app-list-demandes',
  templateUrl: './list-demandes.component.html',
  styleUrls: ['./list-demandes.component.css']
})
export class ListDemandesComponent implements OnInit {
  // UI labels
  pageTitle = "Tous Mes Demande d'Enquête";
  pageSubTitle = "Visionner tous vos demandes d'enquête ici";

  statsData: StatCard[] = [
    // {
    //   title: "Total des demandes",
    //   value: 24,
    //   change: "+12% ce mois",
    //   changeType: "positive",
    //   icon: "fas fa-file-alt",
    //   gradient: "from-primary-500 to-primary-600",
    // },
    {
      title: "En cours",
      value: 8,
      change: "En traitement",
      changeType: "neutral",
      icon: "fas fa-hourglass-half",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Terminées",
      value: 16,
      change: "Complétées",
      changeType: "positive",
      icon: "fas fa-check-circle",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Demandes rejetées",
      value: 2,
      change: "À revoir",
      changeType: "negative",
      icon: "fas fa-times-circle",
      gradient: "from-red-500 to-rose-500",
    },
    {
      title: "Demandes annulées",
      value: 1,
      change: "Annulées par utilisateur",
      changeType: "neutral",
      icon: "fas fa-ban",
      gradient: "from-gray-500 to-gray-600",
    },
  ];

  filterConfig: FilterConfig[] = [
    {
      key: 'etat',
      label: 'Statut',
      placeholder: 'Tous les statuts',
      options: [
      ],
    },
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
    },
    // {
    //   key: 'center',
    //   label: 'Centre',
    //   placeholder: 'Tous les centres',
    //   options: [
    //     { value: 'CG001', label: 'Afrilins' },
    //   ],
    // },
  ];


  filter: Record<string, string | number> = {};
  loading = signal<boolean>(false);
  demandes = signal<DemandeEnquete[]>([])
  user!: Utilisateur;
  pagination: Pagination = {
    limit: 10,
    page: 1,
    totalItem: 0,
    totalPage: 0
  };

  constructor(
    private readonly demandeService: DemandeService,
    private readonly toast: NotificationAlertService,
    private readonly etatDemandeService: EtatDemandeService,
    private utilisateurState: UtilisateurStateService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.utilisateurState.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.loadData();
      }
    });
    this.etatDemandeService.getAll().subscribe(response => {
      this.filterConfig[0].options = response.data.map(d => ({ value: d.code, label: d.libelle }))
    })
  }

  onFiltersChanged(filter: Record<string, string | number>) {
    this.filter = filter;
    this.applyFilter();
  }



  loadData(filter: IParams = {}) {
    this.loading.set(true);
    this.demandeService.getAll({
      ...filter,
      ...this.pagination,
      sort: 'updatedAt,desc',
      utilisateurId: this.user.id
    }).subscribe({
      next: (response: ApiResponse<DemandeEnquete>) => {
        this.pagination = response.pagination;
        this.demandes.set(response.data);
      },
      error: (err: ResponseError) => {
        this.toast.showNotification(err.message ?? "Erreur lors du chargement des données", "error");
      },
      complete: () => this.loading.set(false)
    });
  }

  setPagination(pg: Pagination) {
    this.pagination = pg;
    this.applyFilter();
  }

  applyFilter() {
    const filter: IParams = {};

    const { priorite, search, type, etat } = this.filter;

    if (priorite !== "") {
      filter[priorite === 6 ? "urgent" : "priorite"] = priorite === 6 ? true : priorite;
    }

    if (search) filter["search"] = search;
    if (type) filter["type"] = type;
    if (etat) filter["etat"] = etat;
    if (priorite || search || type || etat) {
      this.pagination.page = 1;
    }

    console.log(filter);
    this.loadData(filter);
  }


  onSearchChanged(value: string) {
    this.filter["search"] = value;
    this.applyFilter();
  }

  onResetFilters() {
    this.filter = {};
    this.applyFilter();
  }
}
