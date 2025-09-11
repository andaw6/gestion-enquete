import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from "rxjs";
import { Pagination } from "@core/interfaces/pagination.interface";
import { UtilService } from "@core/services/util.service";
import { AsyncPipe, CommonModule, DatePipe, NgForOf, NgIf } from "@angular/common";
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { DocumentModel } from '@core/model/document.model';

@Component({
  selector: 'app-document-grid',
  templateUrl: './document-grid.component.html',
  styleUrls: ['./document-grid.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    NgIf,
    NgForOf,
    AsyncPipe,
    DatePipe
  ]
})
export class DocumentGridComponent {
  @Input() documents!: Observable<DocumentModel[]>;
  @Input() viewMode: "grid" | "list" = "grid";
  @Input() pagination!: Pagination;
  @Output() previewClick = new EventEmitter<DocumentModel>();
  @Output() downloadClick = new EventEmitter<DocumentModel>();
  @Output() deleteClick = new EventEmitter<DocumentModel>();
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

  onPreview(doc: DocumentModel): void {
    this.closeMenu()
    this.previewClick.emit(doc)
  }

  onDownload(doc: DocumentModel): void {
    this.closeMenu()
    this.downloadClick.emit(doc)
  }

  onDelete(doc: DocumentModel): void {
    this.closeMenu()
    this.deleteClick.emit(doc)
  }

}
