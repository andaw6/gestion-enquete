import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { EnqueteModel } from "@core/model/enquete.model";
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';
import { UtilService } from '@core/services/util.service';
import { DocumentModel } from '@core/model/document.model';
import { Logger } from '@core/services/logger.service';

@Component({
  selector: 'app-content-right',
  standalone: true,
  imports: [CommonModule, NgForOf],
  templateUrl: './content-right.component.html',
  styleUrls: ['./content-right.component.css']
})
export class ContentRightComponent implements OnInit {
  @Input() enquete!: EnqueteModel;
  demande!: DemandeEnqueteModel;
  @Output() view = new EventEmitter<DocumentModel>();
  @Output() download = new EventEmitter<DocumentModel>();

  readonly utilService = inject(UtilService);

  ngOnInit() {
    this.demande = this.enquete.demande!;
  }

  onDocumentClick(doc: DocumentModel) {
    Logger.log(`Test view document ${doc.id}`, "ContentRightComponent");
    this.view.emit(doc);
  }

  onDownload(doc: DocumentModel) {
    Logger.log(`Test download document ${doc.id}`, "ContentRightComponent");

    this.download.emit(doc);
  }
}
