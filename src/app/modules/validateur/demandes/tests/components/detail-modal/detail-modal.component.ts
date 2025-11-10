import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemandeEnqueteModel } from "@core/model/demande-enquete.model";


@Component({
  selector: 'app-detail-modal',
  standalone: true,
  imports: [CommonModule],
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
    if (changes['isOpen'] && this.isOpen) {
      this.commentaire = this.demande?.commentaireValidation || '';
    }
  }

  close(): void {
    this.closeModal.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onApprove(): void {
    if (this.demande) {
      this.approve.emit({ demande: this.demande, commentaire: this.commentaire });
    }
  }

  onReject(): void {
    if (this.demande) {
      this.reject.emit({ demande: this.demande, commentaire: this.commentaire });
    }
  }

  formatDate(date: Date | null | undefined): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR');
  }

  formatTime(date: Date | null | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  getPriorityClass(priorite: number): string {
    if (priorite >= 8) return 'bg-red-100 text-red-700 border-2 border-red-300';
    if (priorite >= 5) return 'bg-orange-100 text-orange-700 border-2 border-orange-300';
    return 'bg-blue-100 text-blue-700 border-2 border-blue-300';
  }

  getPriorityLabel(priorite: number): string {
    if (priorite >= 8) return 'Haute priorité';
    if (priorite >= 5) return 'Priorité moyenne';
    return 'Priorité normale';
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
    if (!dateEcheance) return '';

    const today = new Date();
    const echeance = new Date(dateEcheance);
    const diffTime = echeance.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `En retard de ${Math.abs(diffDays)} jours`;
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Demain";
    return `Dans ${diffDays} jours`;
  }
}