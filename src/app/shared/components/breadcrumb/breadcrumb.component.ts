import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

export interface BreadcrumbItem {
  label: string
  url?: string
  icon?: string
  active?: boolean
  action?: () => void
}


@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIf, NgForOf,],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = []

  constructor(
    private router: Router,
  ) { }

  trackByLabel(index: number, item: { label: string }) {
    return item.label;
  }

  onClick(item: BreadcrumbItem) {
    if (item.action) {
      item.action(); // exécute l’action si définie
    } else if (item.url) {
      this.router.navigateByUrl(item.url); // sinon, navigue
    }
  }


}
