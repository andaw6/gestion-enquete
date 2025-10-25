import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivityItem } from '@modules/demandeur/dashboard/dashboard';
import { UtilService } from '@core/services/util.service';
import { Router, RouterLink } from '@angular/router';
import { StatCard, StatCardComponent } from '@shared/components/stat-card/stat-card.component';
import { UtilisateurStateService } from 'src/app/store/utilisateur/utilisateur-state.service';
import { Utilisateur } from '@core/interfaces/utilisateur.interface';
import { DemandeEnqueteEvolution, DemandeEnqueteModel, DemandeEnqueteStat } from '@core/model/demande-enquete.model';
import { DemandeService } from '@modules/demandeur/demandes/demande.service';
import { ChartComponent } from './components/chart/chart.component';
import { RecentActivityComponent } from './components/recent-activity/recent-activity.component';
import { DemandeTableComponent } from '@modules/demandeur/demandes/components/demande-table/demande-table.component';
import { CommonModule, NgForOf } from '@angular/common';
import { Logger } from '@core/services/logger.service';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActionMode } from '@core/types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    ChartComponent,
    RecentActivityComponent,
    DemandeTableComponent,
    RouterLink,
    NgForOf
  ],
})
export class DashboardComponent implements OnInit {

  // Injection des dépendances
  private readonly utilisateurState = inject(UtilisateurStateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly service = inject(DemandeService);
  private readonly utilService = inject(UtilService);


  statsData = computed<StatCard[]>(() => [
    {
      title: "Total des demandes",
      value: this.stats().totalDemandes,
      change: "+12% ce mois",
      changeType: "positive",
      icon: "fas fa-file-alt",
      gradient: "from-primary-500 to-primary-600",
    },
    {
      title: "En cours",
      value: this.stats().enCours,
      change: "En traitement",
      changeType: "neutral",
      icon: "fas fa-hourglass-half",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Terminées",
      value: this.stats().termines ?? 0,
      change: "Complétées",
      changeType: "positive",
      icon: "fas fa-check-circle",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Taux de réussite",
      value: `${this.stats().tauxReussite}%`,
      change: "Excellent",
      changeType: "positive",
      icon: "fas fa-chart-line",
      gradient: "from-purple-500 to-pink-500",
    },
  ]);

  recentActivities: ActivityItem[] = [
    {
      id: "1",
      title: "Demande ENQ-2023-015 approuvée",
      time: "Il y a 2 heures",
      type: "success",
      icon: "fas fa-check",
    },
    {
      id: "2",
      title: "Nouveau document ajouté",
      time: "Il y a 4 heures",
      type: "info",
      icon: "fas fa-file",
    },
    {
      id: "3",
      title: "Demande en attente de validation",
      time: "Hier",
      type: "warning",
      icon: "fas fa-clock",
    },
    {
      id: "4",
      title: "Profil mis à jour",
      time: "Il y a 2 jours",
      type: "info",
      icon: "fas fa-user",
    },
  ]

  demandeRecentes = signal<DemandeEnqueteModel[]>([]);

  stats = signal<DemandeEnqueteStat>({
    totalDemandes: 0,
    enCours: 0,
    termines: 0,
    tauxReussite: 0,
  });

  evolutions = signal<DemandeEnqueteEvolution[]>([]);

  loading = signal<boolean>(false);

  user$ = this.utilisateurState.user$;
  user!: Utilisateur;

  getSalutationWithName = this.utilService.getSalutationWithName;

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.loadDemande();
        this.loadEvolution();
      }
    })
  }

  onNewRequest(): void {
    this.router.navigate(['/demandeur/demandes/nouveau']).then(_ => _);
  }

  loadDemande() {
    this.loading.set(true);

    forkJoin({
      stats: this.service.stats(this.user.id),
      demandes: this.service.getAll({
        limit: 3,
        page: 1,
        sort: 'updatedAt,desc',
        utilisateurId: this.user.id
      })
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ stats, demandes }) => {
          this.stats.set(stats);
          this.demandeRecentes.set(demandes.data);
          this.loading.set(false);
        },
        error: _ => {
          this.utilService.showNotification("Erreur lors de la chargement des données", "error");
          this.loading.set(false);
        }
      });
  }

  loadEvolution(date?: string) {
    this.service.evolution(this.user.id, date)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.evolutions.set(response);
        },
        error: _ => {
          this.utilService.showNotification("Erreur lors de la chargement des statistiques d'évolutions", "error");
        }
      })
  }

  onDateChange(event: string) {
    this.loadEvolution(event);
  }


  onAction(event: { action: ActionMode, demande: DemandeEnqueteModel }) {
    switch (event.action) {
      case "view":
        this.router.navigate(["/demandeur/demandes/detail", event.demande.id]);
        break;
      case "delete":
        break;
      case "download":
        break;
      case "update":
        this.router.navigate(["/demandeur/demandes/modifier", event.demande.id]);
        break;
    }
  }

}
