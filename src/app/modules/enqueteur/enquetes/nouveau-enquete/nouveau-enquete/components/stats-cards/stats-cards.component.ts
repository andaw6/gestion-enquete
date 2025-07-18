import {Component, OnInit} from '@angular/core';
import {NouveauEnqueteService} from "@modules/enqueteur/enquetes/nouveau-enquete/nouveau-enquete.service";
import {StatsCard} from "@modules/enqueteur/enquetes/nouveau-enquete/model";

@Component({
  selector: 'app-stats-cards',
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css']
})
export class StatsCardsComponent implements OnInit {
  stats: StatsCard[] = []

  constructor(private enqueteService: NouveauEnqueteService) {
  }

  ngOnInit(): void {
    this.loadStats()
  }

  loadStats(): void {
    this.enqueteService.getStats().subscribe((stats: StatsCard[]) => {
      this.stats = stats
    })
  }

  getColorClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      orange: "bg-orange-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
      blue: "bg-blue-500",
    }
    return colorMap[color] || "bg-gray-500"
  }
}
