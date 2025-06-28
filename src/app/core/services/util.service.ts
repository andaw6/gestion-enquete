import {Injectable} from '@angular/core';
import {NavigationItem, NavigationSection} from "@core/interfaces/navigation.interface";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

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

}
