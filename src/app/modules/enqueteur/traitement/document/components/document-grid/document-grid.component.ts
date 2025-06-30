import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Document} from "@modules/enqueteur/traitement/document/document";
import {Observable} from "rxjs";
import {FILE_BG_CLASS_MAP, FILE_ICON_CLASS_MAP} from "@config/constant";
import {Pagination} from "@core/interfaces/pagination.interface";
import {formatDate} from "date-fns";

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

  showMenu: null | number = null;

  getIcon(extension: string): string {
    return FILE_ICON_CLASS_MAP[extension] || FILE_ICON_CLASS_MAP["default"];
  }

  getBgIcon(extension:string):string{
    return  FILE_BG_CLASS_MAP[extension] || FILE_ICON_CLASS_MAP["default"];
  }


  getActionLabel(document: Document): string {
    return document.extension === "mp3" ? "Écouter" : "Voir"
  }

  getActionIcon(document:Document): string {
    return document.extension === "mp3" ? "fas fa-play" : "fas fa-eye"
  }

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

  formatFileSize(taille: number) {
    if (taille === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(taille) / Math.log(k))
    return Number.parseFloat((taille / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }
}
