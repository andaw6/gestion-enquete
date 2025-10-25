import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HeaderComponent } from './components/header/header.component';
import { NavigationSection } from '@core/interfaces/navigation.interface';
import { BaseComponent } from "@layout/base/base.component";
import { CHEF_ENQUETEUR_NAVIGATION } from "@config/navigation/chef-enqueteur";
import { UtilisateurStateService } from '@store/utilisateur/utilisateur-state.service';


@Component({
  selector: 'app-chef-enqueteur',
  templateUrl: './chef-enqueteur.component.html',
  styleUrls: ['./chef-enqueteur.component.css'],
  standalone: true,
  imports: [HeaderComponent, BaseComponent, CommonModule]
})
export class ChefEnqueteurComponent {

  isSidebarOpen = false;
  navigation: NavigationSection[] = CHEF_ENQUETEUR_NAVIGATION;

  constructor(
    private utilisateurState: UtilisateurStateService
  ) {
    this.utilisateurState.loadUserSuccess({
      id: 3,
      role: "Chef Enqueteur",
      username: "Mansour Ciss"
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen
  }
}
