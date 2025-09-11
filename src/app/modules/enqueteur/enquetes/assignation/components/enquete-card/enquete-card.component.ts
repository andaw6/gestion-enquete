import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { EnqueteEtatEnquete, EnqueteModel } from '@core/model/enquete.model';
import { TypeConcerne } from '@core/model/concerne.model';
import { UtilService } from '@core/services/util.service';
import { DocumentModel } from '@core/model/document.model';
import { UtilisateurModel } from '@core/model/utilisateur.model';

@Component({
  selector: 'app-enquete-card',
  standalone: true,
  imports: [CommonModule, NgIf, NgClass, NgForOf],
  templateUrl: './enquete-card.component.html',
  styleUrls: ['./enquete-card.component.css']
})
export class EnqueteCardComponent {
  @Input() enquete!: EnqueteModel;

  utilService = inject(UtilService);
  isDetailsVisible = false
  progressCircumference = 2 * Math.PI * 14 // rayon = 14
  progressOffset = 0;

  @Output() demarrer = new EventEmitter<EnqueteModel>();
  @Output() viewDoc = new EventEmitter<DocumentModel>();

  recommandations: string[] = [
    // "Contacter l'entreprise dans l'heure",
    // "Programmer visite sur site aujourd'hui",
    // "Envoyer rapport préliminaire avant 17h"
  ];

  chefEnqueteur?: UtilisateurModel
  = {
    id: 0,
    username: "Elhadji Ciss",
    role: "Chef enquêteur"
  }



  ngOnInit() {
    this.calculateProgressOffset()
  }

  toggleDetails() {
    this.isDetailsVisible = !this.isDetailsVisible
  }

  calculateProgressOffset() {
    this.progressOffset = this.progressCircumference - (this.enquete.progression / 100) * this.progressCircumference
  }

  formatDate(date: Date | null): string {
    if (!date) return ""
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date))
  }

  calculateDaysRemaining(echeance: Date | null): number {
    if (!echeance) return 0
    const now = new Date()
    const diff = new Date(echeance).getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 3600 * 24))
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  getTypeLabel(type: TypeConcerne): string {
    const typeMap = {
      employeur: "Employeur",
      beneficiaire: "Bénéficiaire",
      travailleur: "Travailleur",
    }
    return typeMap[type]
  }

  getEnqueteurName(): string {
    if (!this.enquete.enqueteur) return ""
    return this.enquete.enqueteur.username
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  }

  getAssignateurName(): string {
    if (!this.enquete.demande?.utilisateur) return ""
    return this.enquete.demande.utilisateur.username
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  }

  getFileIcon(extension: string): string {
    return this.utilService.getIcon(extension, false);
  }

  getPriorityClass(): string {
    if (!this.enquete.demande) return ""
    const priorite = this.enquete.demande.priorite
    if (priorite >= 4) return "bg-red-100 text-red-800"
    if (priorite >= 2) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  getPriorityLabel(): string {
    if (!this.enquete.demande) return ""
    const priorite = this.enquete.demande.priorite
    if (priorite >= 4) return "Priorité Haute"
    if (priorite >= 2) return "Priorité Moyenne"
    return "Priorité Basse"
  }

  onDemarrerEnquete() {
    this.demarrer.emit(this.enquete);
  }

  onViewDoc(doc: DocumentModel) {
    this.viewDoc.emit(doc);
  }

  peutDemarrer(): boolean {
    return this.enquete.etat.code === EnqueteEtatEnquete.EnAttente;
  }

  formatShortDate(e: any) { }
}
