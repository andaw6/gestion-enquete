import { Component } from '@angular/core';
import {ChartData, StatCard} from "@modules/enqueteur/enquetes/dashboard/dashboard";
import {DashbordService} from "@modules/enqueteur/enquetes/dashboard/dashbord.service";

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
  completionData: Array<{ id: string; progression: number }> = []

  constructor(private enqueteService: DashbordService) {}

  ngOnInit(): void {
    this.loadDashboardData()
  }

  private loadDashboardData(): void {
    this.stats = this.enqueteService.getStats()
    this.evolutionChartData = this.enqueteService.getEvolutionChartData()
    this.statutsChartData = this.enqueteService.getStatutsChartData()
    this.typeConcerneChartData = this.enqueteService.getTypeConcerneChartData()
    this.completionData = this.enqueteService.getCompletionData()
  }
}
