import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HeaderComponent } from './components/header/header.component';
import { NavigationSection } from '@core/interfaces/navigation.interface';
import { BaseComponent } from "@layout/base/base.component";
import { DEMANDEUR_NAVIGATION } from "@config/navigation/demandeur";
import { UtilisateurStateService } from 'src/app/store/utilisateur/utilisateur-state.service';


@Component({
  selector: 'app-demandeur',
  templateUrl: './demandeur.component.html',
  styleUrls: ['./demandeur.component.css'],
  standalone: true,
  imports: [HeaderComponent, BaseComponent, CommonModule]
})
export class DemandeurComponent {


  constructor(
    private utilisateurState: UtilisateurStateService
  ) {
    this.utilisateurState.loadUserSuccess({
      id: 1,
      role: "Demandeur",
      username: "Marie Ciss"
    });
  }
  isSidebarOpen = false;
  navigation: NavigationSection[] = DEMANDEUR_NAVIGATION;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen
  }
}
