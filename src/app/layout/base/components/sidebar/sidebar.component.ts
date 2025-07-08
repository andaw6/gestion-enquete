import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {NavigationSection} from '@core/interfaces/navigation.interface';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SidebarItemComponent} from "@layout/base/components/sidebar-item/sidebar-item.component";
import {User} from "@core/interfaces/utilisateur.interface";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, SidebarItemComponent],
})
export class SidebarComponent {
  @Input() isOpen = false
  @Output() closeSidebar = new EventEmitter<void>()

  @Input() user: User = {
    name: "El Hadji",
    role: "Administrateur",
    initials: "EH",
  }

  @Input() navigationSections: NavigationSection[] = [];

  constructor(private route: Router) {
  }

  onCloseSidebar(): void {
    this.closeSidebar.emit()
  }


  onLogout(): void {
    console.log("Logout")
  }
}
