import { Component, computed, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { PRIORITE_LEVELS } from '@config/constant';
import { FilterConfig } from '@core/interfaces/filter-config.interface';
import { StatCard } from '@shared/components/stat-card/stat-card.component';
import { DemandeService } from '../demande.service';
import { NotificationAlertService } from '@core/services/notification-alert.service';
import { Router } from '@angular/router';
import { IParams } from '@core/interfaces/http-options.interface';
import { Pagination } from '@core/interfaces/pagination.interface';
import { UtilisateurStateService } from 'src/app/store/utilisateur/utilisateur-state.service';
import { EtatEnqueteService } from '@modules/admin/parametrage/etat-enquete/etat-enquete.service';
import { DemandeEnqueteModel, DemandeEnqueteStatEnquete } from '@core/model/demande-enquete.model';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { StatCardComponent } from '@shared/components/stat-card/stat-card.component';
import { SearchFilterComponent } from '@shared/components/search-filter/search-filter.component';
import { DemandesListeComponent } from '../components/demandes-liste/demandes-liste.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CodeLibelle } from '@core/model/code-libelle.model';
import { EnqueteEtatEnquete } from '@core/model/enquete.model';
import { UtilisateurModel } from '@core/model/utilisateur.model';

@Component({
  selector: 'app-demande-en-traitement',
  templateUrl: './demande-en-traitement.component.html',
  styleUrls: ['./demande-en-traitement.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    StatCardComponent,
    SearchFilterComponent,
    DemandesListeComponent,
    PaginationComponent,
    NgIf,
    NgForOf,
  ],
})
export class DemandeEnTraitementComponent implements OnInit {
  private readonly demandeService = inject(DemandeService);
  private readonly toast = inject(NotificationAlertService);
  private readonly etatEnqueteService = inject(EtatEnqueteService);
  private readonly utilisateurState = inject(UtilisateurStateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  pageTitle = 'Demandes En Cours';
  pageSubTitle =
    "Découvrez la liste de vos demandes pour lesquelles l'enquête a débuté.";

  // ✅ Signals
  statsEnquete = signal<DemandeEnqueteStatEnquete>({
    totalEnCours: 0,
    prioriteHaute: 0,
    enRetard: 0,
    enValidation: 0,
  });

  etatEnquete = signal<CodeLibelle[]>([]);
  demandes = signal<DemandeEnqueteModel[]>([]);
  loading = signal<boolean>(false);

  // Pagination et filtres réactifs
  pagination = signal<Pagination>({
    limit: 10,
    page: 1,
    totalItem: 0,
    totalPage: 0,
  });

  filters = signal<Partial<IParams>>({});

  user!: UtilisateurModel;

  // ✅ Computed values
  statsData = computed<StatCard[]>(() => [
    {
      title: 'Total en cours',
      value: this.statsEnquete().totalEnCours,
      change: 'Toutes les demandes actives',
      changeType: 'neutral',
      icon: 'fas fa-clock',
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Priorité haute',
      value: this.statsEnquete().prioriteHaute,
      change: 'Demandes urgentes',
      changeType: 'negative',
      icon: 'fas fa-exclamation-circle',
      gradient: 'from-red-500 to-rose-500',
    },
    {
      title: 'En validation',
      value: this.statsEnquete().enValidation,
      change: 'En attente de confirmation',
      changeType: 'neutral',
      icon: 'fas fa-hourglass-half',
      gradient: 'from-yellow-500 to-amber-500',
    },
    {
      title: 'En retard',
      value: this.statsEnquete().enRetard,
      change: 'Échéance dépassée',
      changeType: 'negative',
      icon: 'fas fa-calendar-times',
      gradient: 'from-orange-500 to-red-500',
    },
  ]);

  filterConfig = computed<FilterConfig[]>(() => [
    {
      key: 'etat',
      label: 'Statut',
      placeholder: 'Tous les statuts',
      options: this.etatEnquete().map((d) => ({
        value: d.code,
        label: d.libelle,
      })),
    },
    {
      key: 'type',
      label: 'Type de Conerné',
      placeholder: 'Tous les types',
      options: [
        { value: 'employeur', label: 'Employeur' },
        { value: 'travailleur', label: 'Travailleur' },
        { value: 'beneficiaire', label: 'Bénéficiaire' },
      ],
    },
    {
      key: 'priorite',
      label: 'Priorité',
      placeholder: 'Toutes priorités',
      options: [...PRIORITE_LEVELS, { value: 6, label: 'Urgente' }],
    },
  ]);

  ngOnInit(): void {
    this.utilisateurState.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        if (user) {
          this.user = user;
          this.loadData();
        }
      });

    this.etatEnqueteService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.etatEnquete.set(response.data);
      });
  }

  private loadData(extraFilters: Partial<IParams> = {}): void {
    this.loading.set(true);

    forkJoin({
      stats: this.demandeService.statsEnquete(this.user.id),
      demandes: this.demandeService.getAll({
        ...this.filters(),
        ...extraFilters,
        ...this.pagination(),
        sort: 'updatedAt,desc',
        utilisateurId: this.user.id,
        etat: EnqueteEtatEnquete.EnCours,
      }),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ stats, demandes }) => {
          this.statsEnquete.set(stats);
          this.pagination.set(demandes.pagination);
          this.demandes.set(demandes.data);
          this.loading.set(false);
        },
        error: () => {
          this.toast.showNotification(
            'Erreur lors du chargement des données',
            'error'
          );
          this.loading.set(false);
        },
      });
  }

  onFiltersChanged(newFilters: Partial<IParams>) {
    this.filters.set(newFilters);
    this.resetToFirstPage();
    this.applyFilter();
  }

  setPagination(pg: Pagination) {
    this.pagination.set(pg);
    this.applyFilter();
  }

  private applyFilter() {
    const { priorite, search, type, etat } = this.filters();

    const filter: Partial<IParams> = {
      ...(search ? { search } : {}),
      ...(type ? { type } : {}),
      ...(etat ? { etatEnquete: etat } : {}),
    };

    if (priorite) {
      filter[priorite === 6 ? 'urgent' : 'priorite'] =
        priorite === 6 ? true : priorite;
    }

    this.loadData(filter);
  }

  private resetToFirstPage() {
    this.pagination.update((p) => ({ ...p, page: 1 }));
  }

  onSearchChanged(value: string) {
    this.filters.update((f) => ({ ...f, search: value }));
    this.resetToFirstPage();
    this.applyFilter();
  }

  onResetFilters() {
    this.filters.set({});
    this.resetToFirstPage();
    this.applyFilter();
  }

  onVoirDemande(event: DemandeEnqueteModel) {
    const enquete = event.enquete;
    if (enquete) {
      this.router.navigate(['/demandeur/demandes/enquete', enquete.id]);
    }
  }

  onTelechargerDemande(_: DemandeEnqueteModel) {
    // TODO: Implémenter export
  }

  stopLoading() {
    if (this.loading()) {

    }
  }
}
