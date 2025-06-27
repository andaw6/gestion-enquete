import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Document} from "@modules/enqueteur/traitement/document/document";
import {Observable} from "rxjs";
import {FILE_BG_CLASS_MAP, FILE_ICON_CLASS_MAP} from "@config/constant/style";
import {Pagination} from "@core/interfaces/pagination.interface";
import {formatDate} from "date-fns";

@Component({
  selector: 'app-document-grid',
  templateUrl: './document-grid.component.html',
  styleUrls: ['./document-grid.component.css']
})
export class DocumentGridComponent {
  @Input() documents!: Observable<Document[]>;
  @Input() viewMode: "grid" | "list" = "grid"
  @Input() pagination!: Pagination;
  @Output() documentClick = new EventEmitter<Document>()
  @Output() previewClick = new EventEmitter<Document>()
  @Output() downloadClick = new EventEmitter<Document>()
  @Output() deleteClick = new EventEmitter<Document>()

  showMenu: null | number = null

  getIcon(extension: string): string {
    return FILE_ICON_CLASS_MAP[extension] || FILE_ICON_CLASS_MAP["default"];
  }

  getBgIcon(extension:string):string{
    return  FILE_BG_CLASS_MAP[extension] || FILE_ICON_CLASS_MAP["default"];
  }





  onView(): void {
  }

  onDownload(): void {
  }

  getActionLabel(document: Document): string {
    return document.extension === "mp3" ? "Écouter" : "Voir"
  }

  getActionIcon(document:Document): string {
    return document.extension === "mp3" ? "fas fa-play" : "fas fa-eye"
  }
  getFileIcon(fileType: string): string {
    const icons = {
      pdf: "fas fa-file-pdf text-red-500",
      excel: "fas fa-file-excel text-green-500",
      image: "fas fa-image text-blue-500",
      audio: "fas fa-file-audio text-purple-500",
      word: "fas fa-file-word text-orange-500",
      other: "fas fa-file text-gray-500",
    }
    return icons[fileType as keyof typeof icons] || icons.other
  }

  getFileIconBg(fileType: string): string {
    const backgrounds = {
      pdf: "bg-red-500 dark:bg-red-800",
      excel: "bg-green-100 dark:bg-green-900",
      jpg: "bg-blue-100 dark:bg-blue-900",
      audio: "bg-purple-100 dark:bg-purple-900",
      word: "bg-orange-100 dark:bg-orange-900",
      other: "bg-gray-100 dark:bg-gray-900",
    }
    return backgrounds[fileType as keyof typeof backgrounds] || backgrounds.other
  }

  onDocumentClick(doc: Document): void {
    this.documentClick.emit(doc)
  }

  onMenuClick(event: Event, doc: Document): void {
    event.stopPropagation()
    this.showMenu = this.showMenu === doc.id ? null : doc.id
  }

  closeMenu(): void {
    this.showMenu = null
  }

  onPreview(doc: Document): void {
    this.closeMenu()
    this.previewClick.emit(doc)
  }

  // onDownload(doc: Document): void {
  //   this.closeMenu()
  //   this.downloadClick.emit(doc)
  // }

  onClassify(doc: Document): void {
    this.closeMenu()
    console.log("Classify document:", doc)
  }

  onRename(doc: Document): void {
    this.closeMenu()
    console.log("Rename document:", doc)
  }

  onArchive(doc: Document): void {
    this.closeMenu()
    console.log("Archive document:", doc)
  }

  onDelete(doc: Document): void {
    this.closeMenu()
    this.deleteClick.emit(doc)
  }

  protected readonly formatDate = formatDate;

  formatFileSize(taille: number) {
    if (taille === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(taille) / Math.log(k))
    return Number.parseFloat((taille / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }
}
