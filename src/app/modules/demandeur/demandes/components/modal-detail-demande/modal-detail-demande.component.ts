import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, NgIf, NgForOf, TitleCasePipe, DatePipe, NgClass } from '@angular/common';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';
import { UtilService } from "@core/services/util.service";
import { DocumentModel } from '@core/model/document.model';

@Component({
  selector: 'app-modal-detail-demande',
  standalone: true,
  imports: [CommonModule, NgIf, TitleCasePipe, NgForOf, DatePipe, NgClass],
  templateUrl: './modal-detail-demande.component.html',
  styleUrls: ['./modal-detail-demande.component.css']
})
export class ModalDetailDemandeComponent implements OnInit {
  @Input() open: boolean = false;
  @Input({ required: true }) demande!: DemandeEnqueteModel;
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

  onDownload(doc:DocumentModel){
    this.download.emit(doc);
  }
  
}
