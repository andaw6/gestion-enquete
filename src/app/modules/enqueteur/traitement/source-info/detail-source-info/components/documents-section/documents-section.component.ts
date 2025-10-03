import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Document} from "@modules/enqueteur/traitement/document/document";
import {FILE_BG_CLASS_MAP, FILE_ICON_CLASS_MAP, FILE_TYPE_CATEGORY_MAP} from "@config/constant";
import {UtilService} from "@core/services/util.service";
import { DocumentModel } from '@core/model/document.model';

@Component({
  selector: 'app-documents-section',
  templateUrl: './documents-section.component.html',
  styleUrls: ['./documents-section.component.css']
})
export class DocumentsSectionComponent {
  @Input() documents: DocumentModel[] = [];
  @Output() onViewDocument = new EventEmitter<DocumentModel>();
  @Output() onDownloadDocument = new EventEmitter<DocumentModel>();

  constructor(
    protected utilService:UtilService,
  ) {
  }

  getColor(extension: string) {
    let color = FILE_BG_CLASS_MAP[extension] ?? FILE_BG_CLASS_MAP["default"];
    return color.split("-")[1] ?? "gray";
  }

}
