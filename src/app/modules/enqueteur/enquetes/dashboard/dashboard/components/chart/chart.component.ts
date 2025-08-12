import {Component, Input, ViewChild, type ElementRef, type AfterViewInit, OnDestroy} from "@angular/core"

import type {ChartData} from "@modules/enqueteur/enquetes/dashboard/dashboard";
declare var Chart: any

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @Input() title!: string
  @Input() subtitle!: string
  @Input() chartType!: string
  @Input() chartData!: ChartData
  @Input() height = 250

  @ViewChild("chartCanvas", { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>

  private chart: any

  ngAfterViewInit(): void {
    this.createChart()
  }

  private createChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext("2d")
    if (!ctx) return

    const config = {
      type: this.chartType,
      data: this.chartData,
      options: this.getChartOptions(),
    }

    this.chart = new Chart(ctx, config)
  }

  private getChartOptions(): any {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: this.chartType === "doughnut" ? "bottom" : "top",
          labels: {
            color: "#111827",
            padding: 20,
            usePointStyle: this.chartType === "doughnut",
            pointStyle: this.chartType === "doughnut" ? "circle" : undefined,
          },
        },
      },
    }

    if (this.chartType === "line") {
      return {
        ...baseOptions,
        scales: {
          x: {
            grid: { color: "#e5e7eb" },
            ticks: { color: "#111827" },
          },
          y: {
            beginAtZero: true,
            grid: { color: "#e5e7eb" },
            ticks: { color: "#111827" },
          },
        },
      }
    } else if (this.chartType === "bar") {
      return {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#111827" },
          },
          y: {
            beginAtZero: true,
            grid: { color: "#e5e7eb" },
            ticks: { color: "#111827" },
          },
        },
      }
    } else if (this.chartType === "doughnut") {
      return {
        ...baseOptions,
        cutout: "70%",
      }
    }

    return baseOptions
  }

  getChartContainerStyle(): any {
    if (this.chartType === "doughnut") {
      return { height: "250px", width: "250px" }
    }
    return { height: this.height + "px" }
  }

  ngOnDestroy(): void {
    if (this.chart && typeof this.chart.destroy === "function") {
      this.chart.destroy()
    }
  }
}
