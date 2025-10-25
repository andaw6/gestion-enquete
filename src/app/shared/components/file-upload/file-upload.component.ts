import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { UtilService } from '@core/services/util.service';


@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  @Input() showSelection: boolean = true
  @Input() uploadedFiles: File[] = [];
  @Input() allowMultiple = true;
  @Input() acceptedTypes = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip,.mp3,.mp4,.html';
  @Input() acceptedTypesLabel = 'PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, ZIP, MP3, MP4, HTML (max. 50MB)';
  @Output() filesAdded = new EventEmitter<File[]>();
  @Output() removeFile = new EventEmitter<number>();

  constructor(protected utilService: UtilService) { }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.filesAdded.emit(Array.from(input.files));
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.filesAdded.emit(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  getExtension(file: File): string {
    if (!file || !file.name) {
      return "";
    }
    const parts = file.name.split('.');
    if (parts.length <= 1) {
      return ""; // pas d'extension
    }
    return parts.pop()?.toLowerCase() || "";
  }

}
