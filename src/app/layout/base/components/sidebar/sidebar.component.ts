import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavigationSection } from '@core/interfaces/navigation.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarItemComponent } from "@layout/base/components/sidebar-item/sidebar-item.component";
import { User } from "@core/interfaces/utilisateur.interface";
import { UtilisateurStateService } from 'src/app/store/utilisateur/utilisateur-state.service';
import { formatInitial } from '@core/util/function/initial-formatter.util';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, SidebarItemComponent],
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = false
  @Output() closeSidebar = new EventEmitter<void>()
  @Input() navigationSections: NavigationSection[] = [];
  @Input() isOpenDesktopMode: boolean = true;

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
        this.user.role = user.role ?? "Demandeur"
        this.user.initials = formatInitial(this.user.name);
      }
    })
  }

  onCloseSidebar(): void {
    this.closeSidebar.emit()
  }


  onLogout(): void {
    console.log("Logout")
  }
}
