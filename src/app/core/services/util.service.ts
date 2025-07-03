import {Injectable, Renderer2} from '@angular/core';
import {NavigationItem, NavigationSection} from "@core/interfaces/navigation.interface";
import {FILE_BG_CLASS_MAP, FILE_ICON_CLASS_MAP, FILE_TYPE_CATEGORY_MAP} from "@config/constant";
import {Document} from "@modules/enqueteur/traitement/document/document";
import {NotificationAlertService} from "@core/services/notification-alert.service";

@Injectable({
  providedIn: 'root'
})
export class UtilService extends NotificationAlertService {

  updateActiveLink(navigation: NavigationSection[], url: string) {

    const updateItem = (item: NavigationItem): boolean => {


      item.active = !!(item.route && url.includes(item.route)); // Active si l'URL correspond à la route

      let childActive = false;

      if (item.children?.length) {
        childActive = item.children.map(updateItem).some(active => active);
      }

      // Déplie si lui-même ou un enfant est actif
      item.expanded = item.active || childActive;

      // Retourne true si ce lien ou un de ses enfants est actif
      return item.active || childActive;
    };

    // On applique sur toute la navigation
    navigation.forEach(section => {
      section.items.forEach(updateItem);
    });
    return navigation;

  }


  getIcon(extension: string): string {
    return (FILE_ICON_CLASS_MAP[extension] || FILE_ICON_CLASS_MAP["default"]).split(" ").splice(0, 2).join(" ");
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
            return  "Voir";
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
    return  FILE_BG_CLASS_MAP[extension] || FILE_ICON_CLASS_MAP["default"];
  }

  downloadBlob(renderer:Renderer2, blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = renderer.createElement('a');
    renderer.setAttribute(link, 'href', url);
    renderer.setAttribute(link, 'download', fileName);
    link.click();
    URL.revokeObjectURL(url);
    this.showNotification('Téléchargement du document effectué', 'success');
  }
}
