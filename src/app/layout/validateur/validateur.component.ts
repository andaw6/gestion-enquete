import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from "@layout/base/base.component";
import { UtilisateurStateService } from 'src/app/store/utilisateur/utilisateur-state.service';
import { VALIDATEUR_NAVIGATION } from '@config/navigation/validateur';
import { NavigationSection } from '@core/interfaces/navigation.interface';
import { HeaderComponent } from "@layout/validateur/components/header/header.component";

@Component({
  selector: 'app-validateur',
  standalone: true,
  imports: [CommonModule, BaseComponent, HeaderComponent],
  templateUrl: './validateur.component.html',
  styleUrls: ['./validateur.component.css']
})
export class ValidateurComponent {

  constructor(
    private utilisateurState: UtilisateurStateService
  ) {
    this.utilisateurState.loadUserSuccess({
      id: 1,
      role: "Validateur",
      username: "Aicha Diatta"
    });
  }
  isSidebarOpen = false;
  navigation: NavigationSection[] = VALIDATEUR_NAVIGATION;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen
  }
}
