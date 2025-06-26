import {Component, Input} from '@angular/core';
import {NavigationItem} from "@core/interfaces/navigation.interface";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SidebarItemComponent {
  @Input() item!: NavigationItem;

  constructor(private router: Router) {}

  handleClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.item.children?.length) {
      this.item.expanded = !this.item.expanded;
    } else if (this.item.route) {
      this.router.navigate([this.item.route]);
      console.log("Navigate to:", this.item.label, this.item.route);
    }
  }
}
