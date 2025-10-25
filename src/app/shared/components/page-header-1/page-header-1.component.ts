import { Component, Input } from '@angular/core';
import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';

export interface PageActionButton {
  label: string;
  icon?: string;
  type?: 'primary' | 'secondary' | 'danger';
  cssClass?: string;
  action: () => void;
}

export interface BackButtonAction {
  icon?: string;
  action: () => void;
  cssClass?: string;
}

export interface PageHeaderConfig {
  title: string;
  subtitle?: string;
  backButtonLeft?: BackButtonAction;
  buttons?: PageActionButton[];
}


@Component({
  selector: 'app-page-header-1',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, NgClass],
  templateUrl: './page-header-1.component.html',
  styleUrls: ['./page-header-1.component.css']
})
export class PageHeader1Component {

  @Input() config!: PageHeaderConfig;

  getButtonClasses(button: PageActionButton): string[] {
    const base = ['inline-flex', 'items-center', 'px-4', 'py-2', 'rounded-lg', 'text-sm', 'font-medium', 'transition-colors'];

    const typeClass =
      button.type === 'primary'
        ? ['bg-primary-500', 'text-white', 'hover:bg-primary-600', 'shadow-card-hover']
        : button.type === 'danger'
          ? ['bg-red-600', 'text-white', 'hover:bg-red-700', 'shadow-card']
          : ['bg-white', 'text-secondary-700', 'border', 'border-secondary-300', 'hover:bg-secondary-50'];


    const customClass = button.cssClass ? button.cssClass.split(' ') : [];

    return [...base, ...typeClass, ...customClass];
  }


}
