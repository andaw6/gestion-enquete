import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-list-enquete',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './list-enquete.component.html',
  styleUrls: ['./list-enquete.component.css']
})
export class ListEnqueteComponent {

  pageTitle:string = "Tous mes enquêtes ";
  pageSubTitle:string = "";

}
