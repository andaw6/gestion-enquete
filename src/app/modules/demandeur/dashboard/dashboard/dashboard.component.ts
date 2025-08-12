import { Component, OnInit, signal } from '@angular/core';
import { DemandeEnquete, ActivityItem } from '@modules/demandeur/dashboard/dashboard';
import { DashboardService } from '../dashboard.service';
import { UtilService } from '@core/services/util.service';
import { Router } from '@angular/router';
import { StatCard } from '@shared/components/stat-card/stat-card.component';
import { UtilisateurStateService } from 'src/app/store/utilisateur/utilisateur-state.service';
import { Utilisateur } from '@core/interfaces/utilisateur.interface';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  statsData: StatCard[] = [
    {
      title: "Total des demandes",
      value: 24,
      change: "+12% ce mois",
      changeType: "positive",
      icon: "fas fa-file-alt",
      gradient: "from-primary-500 to-primary-600",
    },
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
      title: "Taux de réussite",
      value: "94%",
      change: "Excellent",
      changeType: "positive",
      icon: "fas fa-chart-line",
      gradient: "from-purple-500 to-pink-500",
    },
  ]

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

  recentRequests: DemandeEnquete[] = []

  loading = signal<boolean>(false);

  constructor(
    private readonly service: DashboardService,
    private readonly utilService: UtilService,
    private utilisateurState: UtilisateurStateService,
    private router: Router,
  ) { }

  user$ = this.utilisateurState.user$;
  user!: Utilisateur;

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.loadDemande();
      }
    })
  }

  onNewRequest(): void {
    this.router.navigate(['/demandeur/demandes/nouveau']).then(_ => _);
  }

  loadDemande() {
    this.loading.set(true);
    this.service.getAll({
      limit: 5,
      page: 1,
      sort: 'updatedAt,desc',
      utilisateurId: this.user.id
    }).subscribe({
      next: response => {
        this.recentRequests = response.data;
      },
      error: err => {
        this.utilService.showNotification(err.message ?? "Erreur lors du chargement des données", "error");
      },
      complete: () => {
        this.loading.set(false);
      }
    })
  }
}
