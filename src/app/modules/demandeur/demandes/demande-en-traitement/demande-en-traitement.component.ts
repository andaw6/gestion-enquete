import { Component, OnInit, signal } from '@angular/core';
import { PRIORITE_LEVELS } from '@config/constant';
import { FilterConfig } from '@core/interfaces/filter-config.interface';
import { DemandeEnquete } from '@modules/demandeur/dashboard/dashboard';
import { StatCard } from '@shared/components/stat-card/stat-card.component';
import { DemandeService } from '../demande.service';
import { NotificationAlertService } from '@core/services/notification-alert.service';
import { Router } from '@angular/router';
import { IParams } from '@core/interfaces/http-options.interface';
import { Pagination } from '@core/interfaces/pagination.interface';
import { ApiResponse } from '@core/interfaces/api-response.interface';
import { ResponseError } from '@core/interfaces/response-error.interface';
import { UtilisateurStateService } from 'src/app/store/utilisateur/utilisateur-state.service';
import { Utilisateur } from '@core/interfaces/utilisateur.interface';
import { EtatEnqueteService } from '@modules/admin/parametrage/etat-enquete/etat-enquete.service';

@Component({
  selector: 'app-demande-en-traitement',
  templateUrl: './demande-en-traitement.component.html',
  styleUrls: ['./demande-en-traitement.component.css']
})
export class DemandeEnTraitementComponent implements OnInit {
  pageTitle = "Demandes En Cours";
  pageSubTitle = "Découvrez la liste de vos demandes pour lesquelles l'enquête a débuté.";

  statsData: StatCard[] = [
    {
      title: "Total en cours",
      value: 12,
      change: "Toutes les demandes actives",
      changeType: "neutral",
      icon: "fas fa-clock",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Priorité haute",
      value: 3,
      change: "Demandes urgentes",
      changeType: "negative",
      icon: "fas fa-exclamation-circle",
      gradient: "from-red-500 to-rose-500",
    },
    {
      title: "En validation",
      value: 5,
      change: "En attente de confirmation",
      changeType: "neutral",
      icon: "fas fa-hourglass-half",
      gradient: "from-yellow-500 to-amber-500",
    },
    {
      title: "En retard",
      value: 2,
      change: "Échéance dépassée",
      changeType: "negative",
      icon: "fas fa-calendar-times",
      gradient: "from-orange-500 to-red-500",
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
    private readonly etatEnqueteService: EtatEnqueteService,
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
    this.etatEnqueteService.getAll().subscribe(response => {
      this.filterConfig[0].options = response.data.map(d => ({ value: d.code, label: d.libelle }))
    })
  }


  loadData(filter: IParams = {}) {
    this.loading.set(true);
    this.demandeService.getAll({
      ...filter,
      ...this.pagination,
      sort: 'updatedAt,desc',
      utilisateurId: this.user.id,
      etat: "01"
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

  onFiltersChanged(filter: Record<string, string | number>) {
    this.filter = filter;
    this.applyFilter();
  }


  setPagination(pg: Pagination) {
    this.pagination = pg;
    this.applyFilter();
  }

  applyFilter() {
    const filter: IParams = {};

    const { priorite, search, type, etat } = this.filter;

    if (priorite !== "") {
      console.log(priorite)
      filter[priorite == 6 ? "urgent" : "priorite"] = priorite == 6 ? true : priorite;
    }

    if (search) filter["search"] = search;
    if (type) filter["type"] = type;
    if (etat) filter["etatEnquete"] = etat;
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

  toggleView() { }

  onVoirDemande(event: any) { }
  onTelechargerDemande(event: any) { }
}


