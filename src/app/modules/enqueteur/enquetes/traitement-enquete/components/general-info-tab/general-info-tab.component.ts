import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { EnqueteModel } from "@core/model/enquete.model";
import { ContentLeftComponent } from './components/content-left/content-left.component';
import { ContentRightComponent } from './components/content-right/content-right.component';
import { InstructionsComponent } from '@shared/components/instructions/instructions.component';
import { DocumentModel } from '@core/model/document.model';
import { EnqueteStateService } from '@store/enquete/enquete-state.service';

@Component({
  selector: 'app-general-info-tab',
  standalone: true,
  imports: [
    CommonModule,
    InstructionsComponent,
    ContentLeftComponent,
    ContentRightComponent,
    NgIf,
  ],
  templateUrl: './general-info-tab.component.html',
  styleUrls: ['./general-info-tab.component.css']
})
export class GeneralInfoTabComponent implements OnInit {
  enquete!: EnqueteModel;
  @Output() viewDocument = new EventEmitter<DocumentModel>();
  @Output() downloadDocument = new EventEmitter<DocumentModel>();
  private readonly enqueteState = inject(EnqueteStateService);

  ngOnInit(): void {
    this.enqueteState.enquete$.subscribe(enquete => {
      if (enquete) {
        this.enquete = enquete;
      }
    })
  }
}
