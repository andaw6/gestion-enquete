import { Component, OnInit, signal } from '@angular/core';
import { BaseComponent } from "@layout/base/base.component";
import { HeaderComponent } from "@layout/enqueteur/components/header/header.component";
import { NavigationSection } from "@core/interfaces/navigation.interface";
import { ENQUETEUR_NAVIGATION } from "@config/navigation/enqueteur";
import { UtilisateurStateService } from 'src/app/store/utilisateur/utilisateur-state.service';

@Component({
  selector: 'app-enqueteur',
  templateUrl: './enqueteur.component.html',
  styleUrls: ['./enqueteur.component.css'],
  standalone: true,
  imports: [BaseComponent, HeaderComponent],
})
export class EnqueteurComponent {
  test = signal<boolean>(false);
  isDesktopMode = signal<boolean>(true);



  isSidebarOpen = false;
  navigation: NavigationSection[] = ENQUETEUR_NAVIGATION;

  constructor(
    private utilisateurState: UtilisateurStateService
  ) {
    this.utilisateurState.loadUserSuccess({
      id: 27,
      role: "Enqueteur",
      username: "Elhadji Ciss"
    });
  }



  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen
  }


  toggleDesktopMode(): void {
    this.isDesktopMode.update((prev) => !prev);
  }

}
