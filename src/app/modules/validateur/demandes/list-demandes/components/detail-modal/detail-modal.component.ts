import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemandeEnqueteModel, DemandeEtatDemande } from "@core/model/demande-enquete.model";
import {CodeLibelle} from "@core/model/code-libelle.model"


@Component({
  selector: 'app-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-modal.component.html',
  styleUrls: ['./detail-modal.component.css']
})
export class DetailModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() demande: DemandeEnqueteModel | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() approve = new EventEmitter<{ demande: DemandeEnqueteModel, commentaire: string }>();
  @Output() reject = new EventEmitter<{ demande: DemandeEnqueteModel, commentaire: string }>();

  commentaire = '';

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['isOpen'] && this.isOpen) {
    this.commentaire = this.demande?.commentaireValidation || '';
  }
}

close(): void {
  this.closeModal.emit();
}

onBackdropClick(event: MouseEvent): void {
  if(event.target === event.currentTarget) {
  this.close();
}
  }

onApprove(): void {
  if(this.demande) {
  this.approve.emit({ demande: this.demande, commentaire: this.commentaire });
}
  }

onReject(): void {
  if(this.demande) {
  this.reject.emit({ demande: this.demande, commentaire: this.commentaire });
}
  }

    canValidate(etat?: CodeLibelle) {
      if(!etat) return false;
      return etat.code == DemandeEtatDemande.EnAttente || etat.code == DemandeEtatDemande.EnComplement;
    }

formatDate(date: Date | null | undefined): string {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

formatTime(date: Date | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

getUserInitials(username: string | undefined): string {
  if (!username) return 'NA';
  return username
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

getStatusBadgeClass(code: string): string {
  const classes: { [key: string]: string } = {
    '00': 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300',
    '01': 'bg-green-100 text-green-700 border-2 border-green-300',
    '02': 'bg-red-100 text-red-700 border-2 border-red-300',
    '03': 'bg-blue-100 text-blue-700 border-2 border-blue-300',
    '04': 'bg-gray-100 text-gray-700 border-2 border-gray-300'
  };
  return classes[code] || 'bg-gray-100 text-gray-700 border-2 border-gray-300';
}

getStatusIcon(code: string): string {
  const icons: { [key: string]: string } = {
    '00': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    '01': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    '02': 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    '03': 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    '04': 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636'
  };
  return icons[code] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
}

getPriorityClass(priorite: number): string {
  if (priorite >= 8) return 'bg-red-100 text-red-700 border-2 border-red-300';
  if (priorite >= 5) return 'bg-orange-100 text-orange-700 border-2 border-orange-300';
  return 'bg-blue-100 text-blue-700 border-2 border-blue-300';
}

getPriorityLabel(priorite: number): string {
  if (priorite >= 8) return 'Cette demande nécessite une attention immédiate';
  if (priorite >= 5) return 'Cette demande doit être traitée dans les meilleurs délais';
  return 'Cette demande peut être traitée selon le planning normal';
}

getTypeBadgeClass(type: string): string {
  const classes: { [key: string]: string } = {
    'employeur': 'bg-blue-100 text-blue-700 border border-blue-300',
    'travailleur': 'bg-emerald-100 text-emerald-700 border border-emerald-300',
    'beneficiaire': 'bg-amber-100 text-amber-700 border border-amber-300'
  };
  return classes[type] || 'bg-gray-100 text-gray-700 border border-gray-300';
}

getTypeLabel(type: string): string {
  const labels: { [key: string]: string } = {
    'employeur': 'Employeur',
    'travailleur': 'Travailleur',
    'beneficiaire': 'Bénéficiaire'
  };
  return labels[type] || type;
}

getRemainingDays(dateEcheance: Date | null): string {
  if (!dateEcheance) return 'Aucune échéance';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const echeance = new Date(dateEcheance);
  echeance.setHours(0, 0, 0, 0);
  const diffTime = echeance.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `En retard de ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`;
  if (diffDays === 0) return "Échéance aujourd'hui";
  if (diffDays === 1) return "Échéance demain";
  return `Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
}

getRemainingDaysClass(dateEcheance: Date | null): string {
  if (!dateEcheance) return 'text-gray-600';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const echeance = new Date(dateEcheance);
  echeance.setHours(0, 0, 0, 0);
  const diffTime = echeance.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'text-red-700 font-bold';
  if (diffDays <= 3) return 'text-orange-700 font-bold';
  return 'text-green-700';
}
}
