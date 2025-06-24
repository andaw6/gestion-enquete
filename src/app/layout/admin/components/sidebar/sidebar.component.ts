import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavigationItem, NavigationSection } from '@core/interfaces/navigation.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


export interface User {
  name: string
  role: string
  initials: string
}



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
})
export class SidebarComponent {
  @Input() isOpen = false
  @Output() closeSidebar = new EventEmitter<void>()

  user: User = {
    name: "El Hadji",
    role: "Administrateur",
    initials: "EH",
  }

  @Input() navigationSections: NavigationSection[] = [];


  constructor(private route:Router){}
  

  onCloseSidebar(): void {
    this.closeSidebar.emit()
  }

  // Ajouter une méthode pour gérer l'expansion des sous-menus
  toggleSubmenu(item: NavigationItem): void {
    if (item.children) {
      item.expanded = !item.expanded
    }
  }

  // Modifier la méthode onNavigationClick
  onNavigationClick(item: NavigationItem, event?: Event): void {
    if (event) {
      event.preventDefault()
    }

    if (item.children) {
      this.toggleSubmenu(item)
    } else {
      this.route.navigate([item.route])
      // Logique de navigation pour les éléments sans enfants
      console.log("Navigate to:", item.label, item.route)
    }
  }

  onLogout(): void {
    // Logique de déconnexion
    console.log("Logout")
  }
}
