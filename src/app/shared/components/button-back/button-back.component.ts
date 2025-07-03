import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button-back',
  standalone: true,
  templateUrl: './button-back.component.html',
  styleUrls: ['./button-back.component.css']
})
export class ButtonBackComponent {
  @Input() url: string = "/";
  @Input() activeUrl: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  label: string = "Retour";

  constructor(private router:Router){}

  back(){
    this.onClick.emit();
    if(this.activeUrl){
      this.router.navigate([this.url]).then(console.info);
    }else{
      history.back();
    }
  }
}
