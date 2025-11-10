import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, NgIf, NgForOf, TitleCasePipe, DatePipe, NgClass } from '@angular/common';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';
import { UtilService } from "@core/services/util.service";
import { DocumentModel } from '@core/model/document.model';
import { EnqueteEtatEnquete } from '@core/model/enquete.model';

@Component({
  selector: 'app-modal-detail-demande',
  standalone: true,
  imports: [CommonModule, NgIf, TitleCasePipe, NgForOf, DatePipe, NgClass],
  templateUrl: './modal-detail-demande.component.html',
  styleUrls: ['./modal-detail-demande.component.css']
})
export class ModalDetailDemandeComponent implements OnInit {
  @Input() open: boolean = false;
  @Input() demande!: DemandeEnqueteModel;
  @Input() autoClose: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() download = new EventEmitter<DocumentModel>();

  max = 5;
  stars = Array(this.max).fill(0);


  constructor(
    protected readonly utilService: UtilService
  ) { }



  ngOnInit(): void {
    this.demande.commentaireValidation = "This is a test";
    this.demande.validateur = {
      id: 1,
      username: "Elhadji Ciss",
      fonction: "Administrateur Système"
    }
  }

  closeModal() {
    if (this.autoClose) {
      this.open = false;
    }
    this.close.emit();
  }

  onDownload(doc: DocumentModel) {
    this.download.emit(doc);
  }

  getEnqueteEtatClass(etat: string | null |undefined): string {
    switch (etat) {
      case EnqueteEtatEnquete.EnCours: // "01"
        return "bg-blue-100 text-blue-800";
      case EnqueteEtatEnquete.Terminee: // "02"
        return "bg-green-100 text-green-800";
      case EnqueteEtatEnquete.EnAttente: // "00"
        return "bg-yellow-100 text-yellow-800";
      case EnqueteEtatEnquete.Annulee: // "06"
        return "bg-red-100 text-red-800";
      case EnqueteEtatEnquete.EnValidation: // "03"
        return "bg-purple-100 text-purple-800";
      case EnqueteEtatEnquete.Validee: // "04"
        return "bg-emerald-100 text-emerald-800";
      case EnqueteEtatEnquete.EnRevision: // "05"
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }

  }
}
