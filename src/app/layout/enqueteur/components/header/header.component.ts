import { Component, EventEmitter,Output } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


interface User {
  name: string
  role: string
  initials: string
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [ FontAwesomeModule],
  standalone: true,
})
export class HeaderComponent {

  @Output() toggleSidebar = new EventEmitter<void>()

  user: User = {
    name: "El Hadji",
    role: "Administrateur",
    initials: "EH",
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit()
  }

  onNotificationClick(): void {
    console.log("Notifications clicked")
  }

  onMessageClick(): void {
    console.log("Messages clicked")
  }

  onSearchClick(): void {
    console.log("Search clicked")
  }

  onProfileClick(): void {
    console.log("Profile clicked")
  }
}
