import {Component, EventEmitter, Output} from '@angular/core';
import { formatInitial } from '@core/util/function/initial-formatter.util';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { UtilisateurStateService } from 'src/app/store/utilisateur/utilisateur-state.service';


interface User {
  name: string
  role: string
  initials: string
}

@Component({
  selector: 'app-header-validateur',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [FontAwesomeModule],
  standalone: true,
})
export class HeaderComponent {

  @Output() toggleSidebar = new EventEmitter<void>()
  @Output() toggleDesktopMode = new EventEmitter<void>();

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
        this.user.role = user.role ?? "Enqueteur"
        this.user.initials = formatInitial(this.user.name);
      }
    })
  }


  onToggleSidebar(): void {
    this.toggleSidebar.emit()
  }


  onProfileClick(): void {
    console.log("Profile clicked")
  }

  onToggleDesktopMode():void{
    this.toggleDesktopMode.emit()
  }
}
