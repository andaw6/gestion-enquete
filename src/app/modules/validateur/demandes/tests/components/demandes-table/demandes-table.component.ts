import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pagination } from '@core/interfaces/pagination.interface';
import { DemandeEnqueteModel } from "@core/model/demande-enquete.model"

@Component({
  selector: 'app-demandes-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demandes-table.component.html',
  styleUrls: ['./demandes-table.component.css']
})
export class DemandesTableComponent {
  @Input() demandes: DemandeEnqueteModel[] = [];
  @Input() Pagination!: Pagination;

  @Output() viewDemande = new EventEmitter<DemandeEnqueteModel>();
  @Output() approveDemande = new EventEmitter<DemandeEnqueteModel>();
  @Output() rejectDemande = new EventEmitter<DemandeEnqueteModel>();
  @Output() exportData = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<Pagination>();


  getUserInitials(username: string): string {
    return username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getConcerneName(demande: DemandeEnqueteModel): string {
    return `${demande.concerne.type} - ${demande.concerne.id}`;
  }

  getTypeBadgeClass(type: string): string {
    const classes: { [key: string]: string } = {
      'employeur': 'bg-blue-50 text-blue-700 border border-blue-200',
      'travailleur': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'beneficiaire': 'bg-amber-50 text-amber-700 border border-amber-200'
    };
    return classes[type] || 'bg-gray-50 text-gray-700 border border-gray-200';
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'employeur': 'Employeur',
      'travailleur': 'Travailleur',
      'beneficiaire': 'Bénéficiaire'
    };
    return labels[type] || type;
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'employeur': 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      'travailleur': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      'beneficiaire': 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7'
    };
    return icons[type] || 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z';
  }

  getStatusClass(code: string): string {
    const classes: { [key: string]: string } = {
      '00': 'status-pending bg-yellow-50 text-yellow-700 border border-yellow-200',
      '01': 'status-approved bg-green-50 text-green-700 border border-green-200',
      '02': 'status-rejected bg-red-50 text-red-700 border border-red-200',
      '03': 'status-pending bg-blue-50 text-blue-700 border border-blue-200',
      '04': 'bg-gray-50 text-gray-700 border border-gray-200'
    };
    return classes[code] || 'bg-gray-50 text-gray-700 border border-gray-200';
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

  formatDate(date: Date | null): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR');
  }

  formatTime(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }


  onView(demande: DemandeEnqueteModel): void {
    this.viewDemande.emit(demande);
  }

  onApprove(demande: DemandeEnqueteModel): void {
    this.approveDemande.emit(demande);
  }

  onReject(demande: DemandeEnqueteModel): void {
    this.rejectDemande.emit(demande);
  }

  onExport(): void {
    this.exportData.emit();
  }

}
