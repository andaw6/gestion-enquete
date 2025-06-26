import {Component,} from '@angular/core';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {OverlayComponent} from './components/overlay/overlay.component';
import {NavigationSection} from '@core/interfaces/navigation.interface';
import {ADMIN_NAVIGATION} from 'src/app/config/constantes';
import {UtilService} from "@core/services/util.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterModule, OverlayComponent]
})
export class AdminComponent {
  isSidebarOpen = false;
  navigation: NavigationSection[] = ADMIN_NAVIGATION;


  constructor(private router: Router, private utilService: UtilService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.navigation = this.utilService.updateActiveLink(this.navigation, event.urlAfterRedirects);
        // this.updateActiveLink(event.urlAfterRedirects);
      }
    });
  }

  private updateActiveLink(url: string) {
    this.navigation.forEach(item => {
      item.items.forEach(link => {
        link.active = false;
        if (link.route && link.route.length) {
          link.active = url.includes(link.route)
        }
        if (link.children?.length) {
          link.children.forEach(lk => {
            lk.active = false;
            if (lk.route && lk.route.length) {
              lk.active = url.includes(lk.route)
            }
          })
        }
      })
    });
  }


  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen
  }

  closeSidebar(): void {
    this.isSidebarOpen = false
  }
}
