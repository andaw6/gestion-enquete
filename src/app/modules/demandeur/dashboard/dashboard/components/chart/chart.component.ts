import { Component, type OnInit, type AfterViewInit, ViewChild, type ElementRef } from "@angular/core"
import { Chart, type ChartConfiguration, registerables } from "chart.js"

Chart.register(...registerables)

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent  implements OnInit, AfterViewInit{
  @ViewChild("chartCanvas", { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>

  private chart!: Chart

  periods = [
    { label: "7j", value: "7d", active: true },
    { label: "30j", value: "30d", active: false },
    { label: "90j", value: "90d", active: false },
  ]

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initChart()
  }

  private initChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext("2d")
    if (!ctx) return

    const config: ChartConfiguration = {
      type: "line",
      data: {
        labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
        datasets: [
          {
            label: "Demandes créées",
            data: [12, 19, 8, 15, 22, 13, 18],
            borderColor: "rgb(23, 171, 221)",
            backgroundColor: "rgba(23, 171, 221, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Demandes traitées",
            data: [8, 15, 12, 18, 20, 10, 16],
            borderColor: "rgb(34, 197, 94)",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              font: {
                size: 11,
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 11,
              },
            },
          },
        },
      },
    }

    this.chart = new Chart(ctx, config)
  }

  selectPeriod(selectedPeriod: any): void {
    this.periods.forEach((period) => (period.active = false))
    selectedPeriod.active = true

    // Ici vous pouvez mettre à jour les données du graphique selon la période
    console.log("Période sélectionnée:", selectedPeriod.value)
  }
}
