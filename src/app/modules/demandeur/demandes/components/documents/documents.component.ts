import { Component, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { CommonModule, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { DocumentModel } from '@core/model/document.model';
import { UtilService } from '@core/services/util.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, DatePipe],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent {
  @Input() documents: DocumentModel[] = []
  @Output() onPreview = new EventEmitter<DocumentModel>();
  @Output() onDownload = new EventEmitter<DocumentModel>();

  constructor(
    protected utilService: UtilService,
  ){}
}
