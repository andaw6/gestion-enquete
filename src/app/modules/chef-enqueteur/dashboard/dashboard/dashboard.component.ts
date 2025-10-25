import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { UtilisateurModel } from '@core/model/utilisateur.model';
import { UtilService } from '@core/services/util.service';
import { UtilisateurStateService } from '@store/utilisateur/utilisateur-state.service';
import { Router } from '@angular/router';


Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('progressChart') progressChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priorityChart') priorityChartRef!: ElementRef<HTMLCanvasElement>;

  user$ = this.utilisateurState.user$;
  user!: UtilisateurModel;


  constructor(
    // private readonly service: DashboardService,
    private readonly utilService: UtilService,
    private utilisateurState: UtilisateurStateService,
    private router: Router,
  ) { }


  getSalutationWithName = this.utilService.getSalutationWithName;

  statsData = [
    {
      title: 'Nouvelles Demandes',
      value: '12',
      subtitle: '+8% ce mois',
      icon: 'fas fa-file-alt',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      subtitleColor: 'text-green-600'
    },
    {
      title: 'Enquêtes Actives',
      value: '28',
      subtitle: 'En cours',
      icon: 'fas fa-search',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      subtitleColor: 'text-blue-600'
    },
    {
      title: 'À Valider',
      value: '7',
      subtitle: 'Urgent: 2',
      icon: 'fas fa-check-circle',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      subtitleColor: 'text-orange-600'
    },
    {
      title: 'Enquêteurs Actifs',
      value: '15',
      subtitle: 'Sur 18 total',
      icon: 'fas fa-users',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      subtitleColor: 'text-green-600'
    }
  ];

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.user = user;
        // this.loadDemande();
      }
    })
  }

  ngAfterViewInit(): void {
    this.initializeCharts();
  }

  private initializeCharts(): void {
    // Progress Chart
    const progressCtx = this.progressChartRef.nativeElement.getContext('2d');
    if (progressCtx) {
      new Chart(progressCtx, {
        type: 'doughnut',
        data: {
          labels: ['Terminées', 'En cours', 'En attente', 'Bloquées'],
          datasets: [{
            data: [45, 28, 15, 5],
            backgroundColor: ['#10b981', '#17ABDD', '#f59e0b', '#ef4444'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    // Priority Chart
    const priorityCtx = this.priorityChartRef.nativeElement.getContext('2d');
    if (priorityCtx) {
      new Chart(priorityCtx, {
        type: 'bar',
        data: {
          labels: ['Faible', 'Normale', 'Élevée', 'Urgente'],
          datasets: [{
            label: 'Nombre d\'enquêtes',
            data: [8, 15, 12, 7],
            backgroundColor: ['#6b7280', '#17ABDD', '#f59e0b', '#ef4444'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
}
