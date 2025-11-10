import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { CodeLibelle } from '@core/model/code-libelle.model';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { Pagination } from '@core/interfaces/pagination.interface';
import { EnqueteEtatEnquete, EnqueteModel } from '@core/model/enquete.model';

interface EnqueteRow {
  id: number;
  reference: string;
  objet: string;
  demandeRef: string;
  etat: CodeLibelle;
  progression: number;
  enqueteur: { initials: string; nom: string; role: string };
  dateDebut: string | null;
  dateFin: string | null;
  statusDot: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent, NgIf],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnChanges, OnInit {
  @Input() enquetes: EnqueteModel[] = [];
  @Input() pagination!: Pagination;
  @Output() viewAction = new EventEmitter<EnqueteModel>();
  @Output() editAction = new EventEmitter<EnqueteModel>();
  @Output() deleteAction = new EventEmitter<EnqueteModel>();
  @Output() pageChange = new EventEmitter<Pagination>();

  rows: EnqueteRow[] = [];

  // --- Cycle de vie ---
  ngOnInit(): void {
    this.updateRows();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enquetes'] && !changes['enquetes'].firstChange) {
      this.updateRows();
    }
  }

  canView(etat: CodeLibelle) {
    switch (etat.code) {
      case EnqueteEtatEnquete.EnCours: return false;
      default: return true;
    }
  }
  canEdit(etat: CodeLibelle) {
    switch (etat.code) {
      case EnqueteEtatEnquete.EnCours: return true;
      case EnqueteEtatEnquete.EnAttente: return false;
      default: return true;
    }
  }
  canDelete(etat: CodeLibelle) {
    return false;
  }

  // --- MAPPING ---
  private updateRows(): void {
    this.rows = this.enquetes.map(enq => this.mapToRow(enq));
  }

  private mapToRow(enq: EnqueteModel): EnqueteRow {
    return {
      id: enq.id,
      reference: enq.reference,
      objet: enq.demande?.objet || '—',
      demandeRef: enq.demande?.reference || '—',
      etat: enq.etat,
      progression: enq.progression ?? 0,
      enqueteur: {
        initials: this.getInitials(enq.enqueteur?.username),
        nom: enq.enqueteur?.username || 'Non assigné',
        role: 'Enquêteur',
      },
      dateDebut: this.formatDate(enq.dateDebut),
      dateFin: this.formatDate(enq.dateFin),
      statusDot: this.getStateDotColor(enq.etat?.code),
    };
  }

  // --- STYLE UTILS ---
  getStateClass(code: string): string {
    const classes: Record<string, string> = {
      "01": "bg-green-100 text-green-700 border-green-200", // validée
      "00": "bg-yellow-100 text-yellow-700 border-yellow-200", // en attente
      "02": "bg-blue-100 text-blue-700 border-blue-200", // en cours
      "06": "bg-red-100 text-red-700 border-red-200", // annulée / rejetée
    };
    return classes[code] || "bg-gray-100 text-gray-700 border-gray-200";
  }

  getStateDotColor(code: string): string {
    const colors: Record<string, string> = {
      "01": "bg-green-500",
      "00": "bg-yellow-500",
      "02": "bg-blue-500",
      "06": "bg-red-500",
    };
    return colors[code] || "bg-gray-400";
  }

  // --- UTILS ---
  private getInitials(name?: string): string {
    if (!name) return "";
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  private formatDate(date: Date | string | null): string | null {
    if (!date) return null;
    return new Date(date).toLocaleDateString('fr-FR');
  }

  // --- ACTIONS ---
  onView(row: EnqueteRow) {
    const enquete = this.enquetes.find(e => e.id == row.id);
    this.viewAction.emit(enquete);
  }

  onEdit(row: EnqueteRow) {
    const enquete = this.enquetes.find(e => e.id == row.id);
    this.editAction.emit(enquete);
  }

  onDelete(row: EnqueteRow) {
    const enquete = this.enquetes.find(e => e.id == row.id);
    this.deleteAction.emit(enquete);
  }

  onPageChange(pagination: Pagination) {
    this.pageChange.emit(pagination);
  }
}
