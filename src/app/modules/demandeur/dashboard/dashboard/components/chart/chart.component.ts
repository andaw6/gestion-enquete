// import { CommonModule, NgClass, NgForOf } from "@angular/common"
// import { Component, type OnInit, type AfterViewInit, ViewChild, type ElementRef, Input, OnChanges, SimpleChanges, signal } from "@angular/core"
// import { DemandeEnqueteEvolution } from "@core/model/demande-enquete.model"
// import { Logger } from "@core/services/logger.service"
// import { Chart, type ChartConfiguration, registerables } from "chart.js"

// Chart.register(...registerables)

// @Component({
//   selector: 'app-chart',
//   templateUrl: './chart.component.html',
//   styleUrls: ['./chart.component.css'],
//   standalone: true,
//   imports: [
//     CommonModule,
//     NgForOf,
//     NgClass
//   ],
// })
// export class ChartComponent implements OnInit, AfterViewInit, OnChanges {
//   @ViewChild("chartCanvas", { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>

//   @Input() evolutions: DemandeEnqueteEvolution[] = [];

//   private chart!: Chart

//   evolutionsCreation = signal<number[]>([0, 0, 0, 0, 0, 0, 0]);
//   evolutionsTraitement = signal<number[]>([0, 0, 0, 0, 0, 0, 0]);


//   periods = [
//     { label: "7j", value: "7d", active: true },
//     { label: "30j", value: "30d", active: false },
//     { label: "90j", value: "90d", active: false },
//   ]

//   ngOnInit(): void { }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes["evolutions"] && changes["evolutions"].currentValue) {
//       this.mapData(this.evolutions);
//     }
//   }

//   ngAfterViewInit(): void {
//     this.initChart()
//   }

//   mapData(evolutions: DemandeEnqueteEvolution[]) {
//     const creees = evolutions.map(d => d.creees);
//     const traitees = evolutions.map(d => d.traitees);
//     Logger.info({ message: "Demande Créer", data: creees }, "ChartComponent");
//     Logger.info({ message: "Demande Traitée", data: traitees }, "ChartComponent");

//   }

//   private initChart(): void {
//     const ctx = this.chartCanvas.nativeElement.getContext("2d")
//     if (!ctx) return

//     const config: ChartConfiguration = {
//       type: "line",
//       data: {
//         labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
//         datasets: [
//           {
//             label: "Demandes créées",
//             // data: [12, 19, 8, 15, 22, 13, 18],
//             data: this.evolutionsCreation(),
//             borderColor: "rgb(23, 171, 221)",
//             backgroundColor: "rgba(23, 171, 221, 0.1)",
//             tension: 0.4,
//             fill: true,
//           },
//           {
//             label: "Demandes traitées",
//             // data: [8, 15, 12, 18, 20, 10, 16],
//             data: this.evolutionsTraitement(),
//             borderColor: "rgb(34, 197, 94)",
//             backgroundColor: "rgba(34, 197, 94, 0.1)",
//             tension: 0.4,
//             fill: true,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         interaction: {
//           intersect: false,
//           mode: "index",
//         },
//         plugins: {
//           legend: {
//             position: "bottom",
//             labels: {
//               usePointStyle: true,
//               padding: 20,
//               font: {
//                 size: 12,
//               },
//             },
//           },
//         },
//         scales: {
//           y: {
//             beginAtZero: true,
//             grid: {
//               color: "rgba(0, 0, 0, 0.05)",
//             },
//             ticks: {
//               font: {
//                 size: 11,
//               },
//             },
//           },
//           x: {
//             grid: {
//               display: false,
//             },
//             ticks: {
//               font: {
//                 size: 11,
//               },
//             },
//           },
//         },
//       },
//     }

//     this.chart = new Chart(ctx, config)
//   }

//   selectPeriod(selectedPeriod: any): void {
//     this.periods.forEach((period) => (period.active = false))
//     selectedPeriod.active = true

//     // Ici vous pouvez mettre à jour les données du graphique selon la période
//     console.log("Période sélectionnée:", selectedPeriod.value)
//   }
// }




// import { CommonModule, NgClass, NgForOf } from "@angular/common";
// import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges, signal, Output, EventEmitter } from "@angular/core";
// import { FormsModule } from "@angular/forms";
// import { DemandeEnqueteEvolution } from "@core/model/demande-enquete.model";
// import { Logger } from "@core/services/logger.service";
// import { Chart, type ChartConfiguration, registerables } from "chart.js";

// Chart.register(...registerables);

// @Component({
//   selector: "app-chart",
//   templateUrl: "./chart.component.html",
//   styleUrls: ["./chart.component.css"],
//   standalone: true,
//   imports: [CommonModule, NgForOf, NgClass, FormsModule],
// })
// export class ChartComponent implements OnInit, AfterViewInit, OnChanges {
//   @ViewChild("chartCanvas", { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

//   @Input() evolutions: DemandeEnqueteEvolution[] = [];
//   @Output() onDateChange = new EventEmitter<string>();

//   startDate:string = (new Date()).toISOString().split("T")[0];

//   applyDateRange(){

//   }


//   private chart?: Chart;

//   evolutionsCreation = signal<number[]>([0, 0, 0, 0, 0, 0, 0]);
//   evolutionsTraitement = signal<number[]>([0, 0, 0, 0, 0, 0, 0]);

//   // periods = [
//   //   { label: "7j", value: "7d", active: true },
//   //   { label: "30j", value: "30d", active: false },
//   //   { label: "90j", value: "90d", active: false },
//   // ];

//   ngOnInit(): void {
//     console.log(this.startDate);
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes["evolutions"]?.currentValue) {
//       this.mapData(this.evolutions);
//       this.updateChart();
//     }
//   }

//   ngAfterViewInit(): void {
//     this.initChart();
//   }

//   /** Transforme les données d'évolution en tableaux de valeurs */
//   private mapData(evolutions: DemandeEnqueteEvolution[]): void {
//     const creees = evolutions.map((d) => d.creees);
//     const traitees = evolutions.map((d) => d.traitees);

//     this.evolutionsCreation.set(creees);
//     this.evolutionsTraitement.set(traitees);

//     Logger.info({ message: "Demandes créées", data: creees }, "ChartComponent");
//     Logger.info({ message: "Demandes traitées", data: traitees }, "ChartComponent");
//   }

//   /** Initialise le graphique */
//   private initChart(): void {
//     const ctx = this.chartCanvas.nativeElement.getContext("2d");
//     if (!ctx) return;

//     const config: ChartConfiguration = {
//       type: "line",
//       data: {
//         labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
//         datasets: [
//           {
//             label: "Demandes créées",
//             data: this.evolutionsCreation(),
//             borderColor: "rgb(23, 171, 221)",
//             backgroundColor: "rgba(23, 171, 221, 0.1)",
//             tension: 0.4,
//             fill: true,
//           },
//           {
//             label: "Demandes traitées",
//             data: this.evolutionsTraitement(),
//             borderColor: "rgb(34, 197, 94)",
//             backgroundColor: "rgba(34, 197, 94, 0.1)",
//             tension: 0.4,
//             fill: true,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         interaction: {
//           intersect: false,
//           mode: "index",
//         },
//         plugins: {
//           legend: {
//             position: "bottom",
//             labels: {
//               usePointStyle: true,
//               padding: 20,
//               font: { size: 12 },
//             },
//           },
//         },
//         scales: {
//           y: {
//             beginAtZero: true,
//             grid: { color: "rgba(0, 0, 0, 0.05)" },
//             ticks: { font: { size: 11 } },
//           },
//           x: {
//             grid: { display: false },
//             ticks: { font: { size: 11 } },
//           },
//         },
//       },
//     };

//     this.chart = new Chart(ctx, config);
//   }

//   /** Met à jour les données du graphique sans le recréer */
//   private updateChart(): void {
//     if (!this.chart) return;
//     this.chart.data.datasets[0].data = this.evolutionsCreation();
//     this.chart.data.datasets[1].data = this.evolutionsTraitement();
//     this.chart.update();
//   }

//   /** Gestion du changement de période */
//   // selectPeriod(selectedPeriod: { label: string; value: string; active: boolean }): void {
//   //   this.periods.forEach((period) => (period.active = false));
//   //   selectedPeriod.active = true;

//   //   Logger.info({ message: "Période sélectionnée", data: selectedPeriod.value }, "ChartComponent");
//   //   // TODO: Filtrer les données selon la période choisie
//   // }
// }


import { CommonModule, NgClass, NgForOf } from "@angular/common";
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  signal,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DemandeEnqueteEvolution } from "@core/model/demande-enquete.model";
import { Logger } from "@core/services/logger.service";
import { Chart, type ChartConfiguration, registerables } from "chart.js";

Chart.register(...registerables);

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.css"],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ChartComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild("chartCanvas", { static: true })
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() evolutions: DemandeEnqueteEvolution[] = [];
  @Output() onDateChange = new EventEmitter<string>();

  startDate: string = this.initDate;

  private chart?: Chart;
  private labels: string[] = [];
  readonly days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  evolutionsCreation = signal<number[]>([]);
  evolutionsTraitement = signal<number[]>([]);

  get initDate() {
    return new Date().toISOString().split("T")[0];
  }

  ngOnInit(): void {
    Logger.info({ message: "Date par défaut", data: this.startDate }, "ChartComponent");
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["evolutions"]?.currentValue) {
      this.mapData(this.evolutions);
      this.updateChart();
    }
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  /** Transforme les données d'évolution en labels + datasets */
  private mapData(evolutions: DemandeEnqueteEvolution[]): void {
    // this.labels = evolutions.map((d) =>
    //   new Date(d.jour).toLocaleDateString("fr-FR", {
    //     day: "2-digit",
    //     month: "short",
    //   })
    // );
    this.labels = evolutions.map((d, i) =>
      `${this.days[i]} ${new Date(d.jour).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      })}`
    );

    const creees = evolutions.map((d) => d.creees);
    const traitees = evolutions.map((d) => d.traitees);

    this.evolutionsCreation.set(creees);
    this.evolutionsTraitement.set(traitees);

    Logger.info({ message: "Demandes créées", data: creees }, "ChartComponent");
    Logger.info({ message: "Demandes traitées", data: traitees }, "ChartComponent");
  }

  /** Initialise le graphique */
  private initChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext("2d");
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: "line",
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "Demandes créées",
            data: this.evolutionsCreation(),
            borderColor: "rgb(23, 171, 221)",
            backgroundColor: "rgba(23, 171, 221, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Demandes traitées",
            data: this.evolutionsTraitement(),
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
              font: { size: 12 },
            },
          },
          tooltip: {
            callbacks: {
              title: (items) => {
                const index = items[0].dataIndex;
                const date = new Date(this.evolutions[index].jour);
                return date.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                });
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0, 0, 0, 0.05)" },
            ticks: { font: { size: 11 } },
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } },
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }

  /** Met à jour les données du graphique sans le recréer */
  private updateChart(): void {
    if (!this.chart) return;
    this.chart.data.labels = this.labels;
    this.chart.data.datasets[0].data = this.evolutionsCreation();
    this.chart.data.datasets[1].data = this.evolutionsTraitement();
    this.chart.update();
  }

  /** Exemple pour appliquer une plage de dates */
  applyDateRange(): void {
    if (!this.startDate) {
      Logger.warn("Veuillez sélectionner une date de début", "ChartComponent");
      return;
    }
    Logger.info({ message: "Date appliquée", data: this.startDate }, "ChartComponent");
    this.onDateChange.emit(this.startDate);
  }

  resetDateRange() {
    if (this.startDate != this.initDate) {
      this.startDate = this.initDate;
      this.onDateChange.emit(this.startDate);
    }
  }

}
