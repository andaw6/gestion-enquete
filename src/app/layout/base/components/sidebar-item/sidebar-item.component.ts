import {Component, Input} from '@angular/core';
import {NavigationItem} from "@core/interfaces/navigation.interface";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";
import {environment} from "@env/environment";

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SidebarItemComponent {
  @Input() item!: NavigationItem;

  constructor(private router: Router) {
  }

  handleClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const route = this.item.route;
    if (!route) return;

    const isCurrentRoute = this.router.url === route;
    const hasChildren = Array.isArray(this.item.children) && this.item.children.length > 0;

    if (hasChildren) {
      // Si on n'est pas déjà sur un sous-menu lié à la route principale
      if (!this.router.url.includes(route)) {
        this.navigateTo(route);
      }
      this.toggleExpanded();
    } else {
      // Si ce n’est pas déjà la route actuelle, on y va
      if (!isCurrentRoute) {
        this.navigateTo(route);
      }
    }
  }


  private navigateTo(route: string): void {
    this.router.navigate([route]).then(success => {
      if (!environment.production) {
        if (success) {
          console.info(`Navigated to: ${route}`);
        } else {
          console.warn(`Navigation failed to: ${route}`);
        }
      }
    });
  }

  private toggleExpanded(): void {
    this.item.expanded = !this.item.expanded;
  }
}
