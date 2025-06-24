import { CommonModule } from '@angular/common';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification-header',
  templateUrl: './notification-header.component.html',
  styleUrls: ['./notification-header.component.css'],
})  
export class NotificationHeaderComponent {
  @Input() isDarkMode = false
  @Input() searchTerm = ""
  @Output() openSidebar = new EventEmitter<void>()
  @Output() searchChange = new EventEmitter<string>()
  @Output() markAllRead = new EventEmitter<void>()
  @Output() refresh = new EventEmitter<void>()
  @Output() toggleTheme = new EventEmitter<void>()  
}
