import {Component,} from '@angular/core';
import {HeaderComponent} from './components/header/header.component';
import {NavigationSection} from '@core/interfaces/navigation.interface';
import {BaseComponent} from "@layout/base/base.component";
import {CommonModule} from "@angular/common";
import {ADMIN_NAVIGATION} from "@config/navigation/admin";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [HeaderComponent, BaseComponent, CommonModule]
})
export class AdminComponent {
  isSidebarOpen = false;
  navigation: NavigationSection[] = ADMIN_NAVIGATION;
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen
  }
}
