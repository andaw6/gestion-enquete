import { Injectable, Renderer2 } from '@angular/core';
import { NavigationItem, NavigationSection } from "@core/interfaces/navigation.interface";
import { FILE_BG_CLASS_MAP, FILE_ICON_CLASS_MAP, FILE_TYPE_CATEGORY_MAP } from "@config/constant";
import { Document } from "@modules/enqueteur/traitement/document/document";
import { NotificationAlertService } from "@core/services/notification-alert.service";
import { debounceTime, distinctUntilChanged, filter, Subject, takeUntil } from "rxjs";
import { FormControl } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class UtilService extends NotificationAlertService {
  private destroy$ = new Subject<void>();

  updateActiveLink(navigation: NavigationSection[], url: string) {
    const updateItem = (item: NavigationItem): boolean => {


      item.active = !!(item.route && url.includes(item.route)); // Active si l'URL correspond à la route

      let childActive = false;

      if (item.children?.length) {
        childActive = item.children.map(updateItem).some(active => active);
      }
      item.expanded = item.active || childActive;

      return item.active || childActive;
    };

    // On applique sur toute la navigation
    navigation.forEach(section => {
      section.items.forEach(updateItem);
    });
    return navigation;

  }

  getIcon(extension: string, color: boolean = true): string {
    let result: string = FILE_ICON_CLASS_MAP[extension] || FILE_ICON_CLASS_MAP["default"];
    return color ? result.split(" ").splice(0, 2).join(" ") : result;
  }

  getDocumentActionIcon(document: Document): string {
    const ext = document.extension.toLowerCase();
    for (const [category, extensions] of Object.entries(FILE_TYPE_CATEGORY_MAP)) {
      if (extensions.includes(ext)) {
        switch (category) {
          case "image":
          case "document":
          case "code":
          case "video":
            return "fas fa-eye";
          case "audio":
            return "fas fa-play";
          case "archive":
          case "executable":
            return "fas fa-download";
          default:
            return "fas fa-eye";
        }
      }
    }
    return "fas fa-eye";
  }

  getDocumentActionLabel(document: Document): string {
    const ext = document.extension.toLowerCase();

    for (const [category, extensions] of Object.entries(FILE_TYPE_CATEGORY_MAP)) {
      if (extensions.includes(ext)) {
        switch (category) {
          case "image":
          case "document":
          case "code":
          case "video":
            return "Voir";
          case "audio":
            return "Écouter";
          case "archive":
          case "executable":
            return "Télécharger";
          default:
            return "Voir";
        }
      }
    }
    return "Voir";
  }


  formatFileSize(taille: number) {
    if (taille === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(taille) / Math.log(k))
    return Number.parseFloat((taille / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  getBgIcon(extension: string) {
    return FILE_BG_CLASS_MAP[extension] || FILE_ICON_CLASS_MAP["default"];
  }

  downloadBlob(renderer: Renderer2, blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = renderer.createElement('a');
    renderer.setAttribute(link, 'href', url);
    renderer.setAttribute(link, 'download', fileName);
    link.click();
    URL.revokeObjectURL(url);
    this.showNotification('Téléchargement du document effectué', 'success');
  }


  setupSearchListener(
    searchControl: FormControl,
    onSearch: (query: string) => void,
    isValidQuery: (query: string | null) => boolean = this.isValidQuery,
  ): void {

    searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((query: string) => query === '' || isValidQuery(query)),
        takeUntil(this.destroy$)
      )
      .subscribe((query: string) => {
        onSearch(query);
      });
  }

  getPrioriteLabel(priority: number): string {
    switch (priority) {
      case 1:
        return " Très haute"
      case 2:
        return "Haute"
      case 3:
        return "Moyenne"
      case 4:
        return "Faible"
      case 5:
        return "Très faible"
      default:
        return "Moyenne"
    }
  }

  private isValidQuery(query: string | null): boolean {
    return query !== null && query.trim() !== '' && query.length >= 3;
  }
}
