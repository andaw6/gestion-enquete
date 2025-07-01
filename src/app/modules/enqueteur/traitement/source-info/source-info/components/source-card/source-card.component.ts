import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Source, SourceInfo} from "@modules/enqueteur/traitement/source-info/source-info";

@Component({
  selector: 'app-source-card',
  templateUrl: './source-card.component.html',
  styleUrls: ['./source-card.component.css']
})
export class SourceCardComponent {
  @Input() source!: Source
  @Output() favoriteToggle = new EventEmitter<string>()
  @Output() actionClick = new EventEmitter<{ sourceId: string; action: string }>()

  toggleFavorite() {
    this.favoriteToggle.emit(this.source.id)
  }

  onAction() {
    this.actionClick.emit({ sourceId: this.source.id, action: this.source.actionType })
  }

  getStars(): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < this.source.reliability)
  }

  getStatusClass(): string {
    const classes = {
      verified: "bg-green-100 text-green-800",
      available: "bg-blue-100 text-blue-800",
      "to-check": "bg-yellow-100 text-yellow-800",
      official: "bg-green-100 text-green-800",
      "limited-access": "bg-gray-100 text-gray-800",
      "to-cross-check": "bg-orange-100 text-orange-800",
    }
    return classes[this.source.status] || "bg-gray-100 text-gray-800"
  }

  getStatusText(): string {
    const texts = {
      verified: "Vérifiée",
      available: "Disponible",
      "to-check": "À vérifier",
      official: "Officielle",
      "limited-access": "Accès limité",
      "to-cross-check": "À recouper",
    }
    return texts[this.source.status] || "Statut inconnu"
  }

  getUsageText(): string {
    const actionTexts = {
      contact: "Contacté",
      access: "Utilisée",
      consult: "Consultée",
      reserve: "Utilisée",
      search: "Consultée",
    }
    const actionText = actionTexts[this.source.actionType] || "Utilisée"
    return `${actionText} ${this.source.usageCount} fois`
  }

  getActionButtonClass(): string {
    const classes = {
      access: "bg-blue-500 hover:bg-blue-600",
      contact: "bg-green-500 hover:bg-green-600",
      consult: "bg-orange-500 hover:bg-orange-600",
      reserve: "bg-red-500 hover:bg-red-600",
      search: "bg-indigo-500 hover:bg-indigo-600",
    }
    return classes[this.source.actionType] || "bg-blue-500 hover:bg-blue-600"
  }

  getActionIcon(): string {
    const icons = {
      access: "fas fa-external-link-alt",
      contact: "fas fa-phone",
      consult: "fas fa-eye",
      reserve: "fas fa-calendar",
      search: "fas fa-search",
    }
    return icons[this.source.actionType] || "fas fa-external-link-alt"
  }

  getActionText(): string {
    const texts = {
      access: "Accéder",
      contact: "Contacter",
      consult: "Consulter",
      reserve: "Réserver",
      search: "Rechercher",
    }
    return texts[this.source.actionType] || "Accéder"
  }
}
