import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { EnqueteModel } from '@core/model/enquete.model';
import { UtilService } from '@core/services/util.service';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';
import { formatInitial } from '@core/util/function/initial-formatter.util';

@Component({
  selector: 'app-content-left',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './content-left.component.html',
  styleUrls: ['./content-left.component.css']
})
export class ContentLeftComponent implements OnInit {
  @Input() enquete!: EnqueteModel;
  demande!: DemandeEnqueteModel;

  readonly utilService = inject(UtilService);

  initial = formatInitial;

  ngOnInit(): void {
    this.demande = this.enquete.demande!;
  }
}
