import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string
  url: string
  icon?: string
  active?: boolean
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

  trackByLabel(index: number, item: { label: string }) {
    return item.label;
  }

}
