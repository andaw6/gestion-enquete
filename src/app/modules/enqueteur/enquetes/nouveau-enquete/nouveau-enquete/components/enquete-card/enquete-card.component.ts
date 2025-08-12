import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DemandeEnquete} from "@modules/enqueteur/enquetes/nouveau-enquete/model";

@Component({
  selector: 'app-enquete-card',
  templateUrl: './enquete-card.component.html',
  styleUrls: ['./enquete-card.component.css']
})
export class EnqueteCardComponent {
  @Input() demande!: DemandeEnquete
  @Output() accepter = new EventEmitter<number>()
  @Output() refuser = new EventEmitter<number>()

  isExpanded = false

  toggleDetails(): void {
    this.isExpanded = !this.isExpanded
  }

  onAccepter(): void {
    if (this.demande.id) {
      this.accepter.emit(this.demande.id)
    }
  }

  onRefuser(): void {
    if (this.demande.id) {
      this.refuser.emit(this.demande.id)
    }
  }

  getPrioriteColor(): string {
    switch (this.demande.priorite) {
      case "HAUTE":
        return "border-red-500"
      case "MOYENNE":
        return "border-yellow-500"
      case "BASSE":
        return "border-green-500"
      default:
        return "border-gray-500"
    }
  }

  getPrioriteClass(): string {
    switch (this.demande.priorite) {
      case "HAUTE":
        return "bg-red-100 text-red-800"
      case "MOYENNE":
        return "bg-yellow-100 text-yellow-800"
      case "BASSE":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  getTypeIcon(): string {
    const typeConcerne = this.demande.concernes[0]?.typeConcerne.code
    switch (typeConcerne) {
      case "EMP":
        return "building"
      case "TRV":
        return "user"
      case "BEN":
        return "users"
      default:
        return "question"
    }
  }

  getTypeIconColor(): string {
    const typeConcerne = this.demande.concernes[0]?.typeConcerne.code
    switch (typeConcerne) {
      case "EMP":
        return "bg-blue-500"
      case "TRV":
        return "bg-green-500"
      case "BEN":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  getTypeColor(): string {
    const typeConcerne = this.demande.concernes[0]?.typeConcerne.code
    switch (typeConcerne) {
      case "EMP":
        return "bg-blue-100 text-blue-800"
      case "TRV":
        return "bg-green-100 text-green-800"
      case "BEN":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  getDeadlineColor(): string {
    const daysUntil = this.getDaysUntilDeadline()
    if (daysUntil <= 10) {
      return "text-red-600"
    } else if (daysUntil <= 20) {
      return "text-yellow-600"
    } else {
      return "text-green-600"
    }
  }

  getDaysUntilDeadline(): number {
    const today = new Date()
    const deadline = new Date(this.demande.dateEcheance)
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  isNewToday(): boolean {
    const today = new Date()
    const creationDate = new Date(this.demande.dateCreation)
    return (
      today.getDate() === creationDate.getDate() &&
      today.getMonth() === creationDate.getMonth() &&
      today.getFullYear() === creationDate.getFullYear()
    )
  }

  getAttributesArray(): { key: string; value: any }[] {
    if (!this.demande.concernes[0]?.attributs) return []

    const attributs = this.demande.concernes[0].attributs
    return Object.keys(attributs).map((key) => ({
      key: this.formatKey(key),
      value: attributs[key],
    }))
  }

  formatKey(key: string): string {
    const keyMap: { [key: string]: string } = {
      nom: "Nom",
      secteur: "Secteur",
      effectif: "Effectif",
      adresse: "Adresse",
      contact: "Contact",
      age: "Âge",
      profession: "Profession",
      creation: "Création",
      domaine: "Domaine",
      siege: "Siège",
      president: "Président",
    }
    return keyMap[key] || key
  }

  getFileIcon(type: string): string {
    switch (type.toLowerCase()) {
      case "pdf":
        return "pdf"
      case "excel":
        return "excel"
      case "word":
        return "word"
      case "image":
        return "image"
      default:
        return "alt"
    }
  }}
