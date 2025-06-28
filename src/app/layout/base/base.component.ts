import {Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';
import {NavigationSection} from "@core/interfaces/navigation.interface";
import {NavigationEnd, Router, RouterModule} from "@angular/router";
import {UtilService} from "@core/services/util.service";
import {SidebarComponent} from "@layout/base/components/sidebar/sidebar.component";
import {OverlayComponent} from "@layout/base/components/overlay/overlay.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
  standalone: true,
  imports:[SidebarComponent, RouterModule, OverlayComponent, CommonModule]
})
export class BaseComponent implements OnInit {
  @Input() isSidebarOpen = false;
  @Input() navigation: NavigationSection[] = [];
  @ContentChild("header") header!: TemplateRef<any>


  constructor(private router: Router, private utilService: UtilService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.navigation = this.utilService.updateActiveLink(this.navigation, event.urlAfterRedirects);
      }
    });
  }
  ngOnInit() {
    this.navigation = this.utilService.updateActiveLink(this.navigation, this.router.url);
  }

  closeSidebar(): void {
    this.isSidebarOpen = false
  }
}
