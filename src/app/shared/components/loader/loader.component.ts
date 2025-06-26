import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls:[ './loader.component.css']
})
export class LoaderComponent {
  @Input() show: boolean = false;
  @Input() class!: string;
}
