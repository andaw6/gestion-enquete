import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {User} from "@core/interfaces/utilisateur.interface";
import { UtilisateurStateService } from 'src/app/store/utilisateur/utilisateur-state.service';
import { formatInitial } from '@core/util/function/initial-formatter.util';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [FontAwesomeModule],
  standalone: true,
})
export class HeaderComponent implements OnInit{

  @Output() toggleSidebar = new EventEmitter<void>()

  user$ = this.utilisateurState.user$;

  constructor(private utilisateurState: UtilisateurStateService) { }

  user: User = {
    name: "El Hadji",
    role: "Administrateur",
    initials: "EH",
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.user.name = user.username;
        this.user.role = user.role ?? "Aministrateur"
        this.user.initials = formatInitial(this.user.name);
      }
    })
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
