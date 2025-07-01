import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RecentSource} from "@modules/enqueteur/traitement/source-info/source-info";

@Component({
  selector: 'app-recent-sources',
  templateUrl: './recent-sources.component.html',
  styleUrls: ['./recent-sources.component.css']
})
export class RecentSourcesComponent {
  @Input() recentSources: RecentSource[] = []
  @Output() recentSourceAction = new EventEmitter<{ sourceId: number; action: string }>()

  onRecentSourceAction(sourceId: number, action: string) {
    this.recentSourceAction.emit({ sourceId, action })
  }

  getActionButtonClass(actionType: string): string {
    const classes = {
      access: "bg-blue-500 hover:bg-blue-600",
      contact: "bg-green-500 hover:bg-green-600",
      consult: "bg-purple-500 hover:bg-purple-600",
    }
    return "bg-blue-500 hover:bg-blue-600"
  }

  getActionText(actionType: string): string {
    const texts = {
      access: "Réutiliser",
      contact: "Contacter",
      consult: "Accéder",
    }
    return "Réutiliser"
  }
}
