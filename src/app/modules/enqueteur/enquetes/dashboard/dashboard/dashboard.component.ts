import { Component, signal } from '@angular/core';
import { ChartData, StatCard } from "@modules/enqueteur/enquetes/dashboard/dashboard";
import { DashbordService } from "@modules/enqueteur/enquetes/dashboard/dashbord.service";
import { EnqueteService } from '../../enquete.service';
import { Logger } from '@core/services/logger.service';
import { EnqueteModel } from '@core/model/enquete.model';
import { UtilisateurModel } from '@core/model/utilisateur.model';
import { UtilisateurStateService } from '@store/utilisateur/utilisateur-state.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  selectedPeriod = "month"
  stats: StatCard[] = []
  evolutionChartData!: ChartData
  statutsChartData!: ChartData
  typeConcerneChartData!: ChartData
  completionData: Array<{ id: string; progression: number }> = [];

  enqueteRecentes = signal<EnqueteModel[]>([]);
  user!: UtilisateurModel;

  constructor(
    private enqueteService: DashbordService,
    private service: EnqueteService,
    private readonly utilisateurState: UtilisateurStateService,
  ) { }

  ngOnInit(): void {
    this.loadDashboardData()
    this.utilisateurState.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.loadEnquete();
        // this.loadData();
      }
    });
  }

  private loadDashboardData(): void {
    this.stats = this.enqueteService.getStats()
    this.evolutionChartData = this.enqueteService.getEvolutionChartData()
    this.statutsChartData = this.enqueteService.getStatutsChartData()
    this.typeConcerneChartData = this.enqueteService.getTypeConcerneChartData()
    this.completionData = this.enqueteService.getCompletionData()
  }

  loadEnquete() {
    this.service.getAll({
      sort: "updatedAt,desc",
      limit: 3,
      page: 1,
      enqueteurId: this.user.id
    }).subscribe({
      next: response => {
        Logger.info({ message: "Tous les enquêtes", data: response.data }, "DashboardComponent:Enqueteur");
        this.enqueteRecentes.set(response.data);
      },
      error: err => {

      }
    })
  }


}
