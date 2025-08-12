import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  @Input() showSpinner: boolean = true;
  @Input() color: string = '#17ABDD';
  @Input() size: number = 100;

  angles = [0, 45, 90, 135, 180, 225, 270, 315];
}
