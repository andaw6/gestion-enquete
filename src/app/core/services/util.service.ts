import { Injectable, Renderer2 } from '@angular/core';
import { NavigationItem, NavigationSection } from "@core/interfaces/navigation.interface";
import { FILE_BG_CLASS_MAP, FILE_ICON_CLASS_MAP, FILE_TYPE_CATEGORY_MAP } from "@config/constant";
import { Document } from "@modules/enqueteur/traitement/document/document";
import { NotificationAlertService } from "@core/services/notification-alert.service";
import { debounceTime, distinctUntilChanged, filter, Subject, takeUntil } from "rxjs";
import { FormControl } from "@angular/forms";
import { DocumentModel } from '@core/model/document.model';

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

  getDocumentActionIcon(document: Document | DocumentModel): string {
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

  getDocumentActionLabel(document: Document | DocumentModel): string {
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

  getSalutationWithName(name: string, date: Date = new Date()): string {
    const hour = date.getHours();

    if (hour >= 5 && hour < 12) return `Bonjour, ${name}`;
    if (hour >= 12 && hour < 18) return `Bon après-midi, ${name}`;
    if (hour >= 18 && hour < 22) return `Bonsoir, ${name}`;
    return `Bonne nuit, ${name}`;
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) {
      return "Date non disponible";
    }

    const d = typeof date === "string" ? new Date(date) : date;

    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(d);
  }


  timeAgo(date: Date | string | null): string {
    if (date == null || !date) return "N/A";
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();

    if (diffMs < 0) {
      return "Dans le futur";
    }

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "Il y a quelques secondes";
    } else if (minutes < 60) {
      return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else if (hours < 24) {
      return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
    } else if (days < 30) {
      return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
    } else {
      // fallback sur une date formatée classique
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).format(d);
    }
  }

  isPreviewable(extension: string | null): boolean {
    if (!extension) return false;

    const previewableExtensions = [
      "pdf", "txt", "html", "htm", "xml", "svg",
      "jpg", "jpeg", "png", "gif",
      "mp4", "webm", "ogg", "mp3", "wav"
    ];

    return previewableExtensions.includes(extension.toLowerCase());
  }

  private isValidQuery(query: string | null): boolean {
    return query !== null && query.trim() !== '' && query.length >= 3;
  }
}
