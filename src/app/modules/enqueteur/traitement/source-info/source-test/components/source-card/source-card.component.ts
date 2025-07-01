import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {SourceInfo} from "@modules/enqueteur/traitement/source-info/source-info";
import {SourceMappingService} from "@modules/enqueteur/traitement/source-info/source-test/source-mapping.service";

@Component({
  selector: 'app-source-test-card',
  templateUrl: './source-card.component.html',
  styleUrls: ['./source-card.component.css']
})
export class SourceCardTestComponent {
  @Input() sourceInfo!: SourceInfo
  @Input() isFavorite = false
  @Output() favoriteToggle = new EventEmitter<number>()
  @Output() actionClick = new EventEmitter<{ sourceId: number; action: string }>()

  private mappingService = inject(SourceMappingService)

  toggleFavorite() {
    this.favoriteToggle.emit(this.sourceInfo.id)
  }

  onAction() {
    const actionType = this.mappingService.getActionTypeForSource(this.sourceInfo)
    this.actionClick.emit({ sourceId: this.sourceInfo.id, action: actionType })
  }

  getIcon(): string {
    return this.mappingService.getIconForSourceType(this.sourceInfo)
  }

  getIconColor(): string {
    return this.mappingService.getIconColorForSourceType(this.sourceInfo)
  }

  getCategory(): string {
    return this.mappingService.getCategoryFromDocuments(this.sourceInfo)
  }

  getReliabilityNumber(): number {
    return this.mappingService.getReliabilityNumber(this.sourceInfo.niveauFiabilite)
  }

  getStars(): boolean[] {
    const reliability = this.getReliabilityNumber()
    return Array(5)
      .fill(false)
      .map((_, i) => i < reliability)
  }

  getStatusClass(): string {
    return this.mappingService.getStatusClass(this.sourceInfo.etat.code)
  }

  getFormattedDate(): string {
    return this.mappingService.formatDate(this.sourceInfo.updatedAt)
  }

  getUsageText(): string {
    const usageCount = this.mappingService.getUsageCount(this.sourceInfo)
    const actionType = this.mappingService.getActionTypeForSource(this.sourceInfo)

    const actionTexts = {
      contact: "Contacté",
      access: "Utilisée",
      consult: "Consultée",
      reserve: "Utilisée",
      search: "Consultée",
    }
    const actionText = actionTexts[actionType] || "Utilisée"
    return `${actionText} ${usageCount} fois`
  }

  getActionButtonClass(): string {
    const actionType = this.mappingService.getActionTypeForSource(this.sourceInfo)
    const classes = {
      access: "bg-blue-500 hover:bg-blue-600",
      contact: "bg-green-500 hover:bg-green-600",
      consult: "bg-orange-500 hover:bg-orange-600",
      reserve: "bg-red-500 hover:bg-red-600",
      search: "bg-indigo-500 hover:bg-indigo-600",
    }
    return classes[actionType] || "bg-blue-500 hover:bg-blue-600"
  }

  getActionIcon(): string {
    const actionType = this.mappingService.getActionTypeForSource(this.sourceInfo)
    const icons = {
      access: "fas fa-external-link-alt",
      contact: "fas fa-phone",
      consult: "fas fa-eye",
      reserve: "fas fa-calendar",
      search: "fas fa-search",
    }
    return icons[actionType] || "fas fa-external-link-alt"
  }

  getActionText(): string {
    const actionType = this.mappingService.getActionTypeForSource(this.sourceInfo)
    const texts = {
      access: "Accéder",
      contact: "Contacter",
      consult: "Consulter",
      reserve: "Réserver",
      search: "Rechercher",
    }
    return texts[actionType] || "Accéder"
  }
}
