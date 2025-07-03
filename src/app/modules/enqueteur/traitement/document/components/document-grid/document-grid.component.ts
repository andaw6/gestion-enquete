import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Document} from "@modules/enqueteur/traitement/document/document";
import {Observable} from "rxjs";
import {FILE_BG_CLASS_MAP, FILE_ICON_CLASS_MAP} from "@config/constant";
import {Pagination} from "@core/interfaces/pagination.interface";
import {formatDate} from "date-fns";
import {UtilService} from "@core/services/util.service";

@Component({
  selector: 'app-document-grid',
  templateUrl: './document-grid.component.html',
  styleUrls: ['./document-grid.component.css']
})
export class DocumentGridComponent {
  @Input() documents!: Observable<Document[]>;
  @Input() viewMode: "grid" | "list" = "grid";
  @Input() pagination!: Pagination;
  @Output() previewClick = new EventEmitter<Document>();
  @Output() downloadClick = new EventEmitter<Document>();
  @Output() deleteClick = new EventEmitter<Document>();
  @Output() paginationChange = new EventEmitter<Pagination>();
  @Input() loading: boolean = false;

  constructor(
    protected utilService: UtilService,
  ) {
  }

  showMenu: null | number = null;

  closeMenu(): void {
    this.showMenu = null
  }

  onPreview(doc: Document): void {
    this.closeMenu()
    this.previewClick.emit(doc)
  }

  onDownload(doc: Document): void {
    this.closeMenu()
    this.downloadClick.emit(doc)
  }

  onDelete(doc: Document): void {
    this.closeMenu()
    this.deleteClick.emit(doc)
  }

}
