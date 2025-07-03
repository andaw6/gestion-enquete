import {Component, ComponentRef, EventEmitter, Output} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-source-header',
  templateUrl: './source-header.component.html',
  styleUrls: ['./source-header.component.css']
})
export class SourceHeaderComponent {
  @Output() onEdit = new EventEmitter<void>();

  constructor(
    private router: Router,
  ) {
  }

  goBack(){
    this.router.navigate(['/enqueteur/traitement/source-info']).then(console.info);
  }
}
