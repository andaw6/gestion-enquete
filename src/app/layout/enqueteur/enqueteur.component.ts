import { Component } from '@angular/core';
import {BaseComponent} from "@layout/base/base.component";
import {HeaderComponent} from "@layout/enqueteur/components/header/header.component";
import {NavigationSection} from "@core/interfaces/navigation.interface";
import {ENQUETEUR_NAVIGATION} from "@config/navigation/enqueteur";

@Component({
  selector: 'app-enqueteur',
  templateUrl: './enqueteur.component.html',
  styleUrls: ['./enqueteur.component.css'],
  standalone: true,
  imports: [BaseComponent, HeaderComponent],
})
export class EnqueteurComponent {
  isSidebarOpen = false;
  navigation: NavigationSection[] = ENQUETEUR_NAVIGATION;
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen
  }
}
