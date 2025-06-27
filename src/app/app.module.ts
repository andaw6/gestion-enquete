import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';

import { provideAnimations } from '@angular/platform-browser/animations';
import { EnqueteurComponent } from './layout/enqueteur/enqueteur.component';
import { BaseComponent } from './layout/base/base.component';
import {HeaderComponent} from "@layout/admin/components/header/header.component";
import {OverlayComponent} from "@layout/base/components/overlay/overlay.component";
import {SidebarComponent} from "@layout/base/components/sidebar/sidebar.component";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
  ],
  providers: [
    provideAnimations(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
