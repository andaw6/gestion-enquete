import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnqueteStateService } from '@store/enquete/enquete-state.service';
import { EnqueteModel } from '@core/model/enquete.model';

@Component({
  selector: 'app-progress-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-stepper.component.html',
  styleUrls: ['./progress-stepper.component.css']
})
export class ProgressStepperComponent implements OnInit {

  private readonly enqueteState = inject(EnqueteStateService);
  enquete!: EnqueteModel;

  ngOnInit(): void {
    this.enqueteState.enquete$.subscribe(enquete => {
      if (enquete) {
        this.enquete = enquete;
      }
    })
  }
}
