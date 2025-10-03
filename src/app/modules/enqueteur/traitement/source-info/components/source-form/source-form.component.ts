import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { EnqueteModel } from '@core/model/enquete.model';
import { DocumentModel } from '@core/model/document.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { EnqueteSelectorComponent } from '@modules/enqueteur/enquetes/traitement-enquete/components/enquete-selector/enquete-selector.component';
import { ExistingDocumentsSelectorComponent } from '@modules/enqueteur/traitement/document/components/existing-documents-selector/existing-documents-selector.component';
import { UtilService } from '@core/services/util.service';
import { Option } from '@core/interfaces/option.interface';
import { EtatSourceService } from '../../etat-source.service';
import { TypeSourceService } from '@modules/admin/parametrage/type-source/type-source.service';
import { forkJoin } from 'rxjs';
import { SourceInfoRequestData } from '@core/model/source-info.model';

@Component({
  selector: 'app-source-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadComponent,
    ExistingDocumentsSelectorComponent,
    EnqueteSelectorComponent,
    NgIf, NgForOf
  ],
  templateUrl: './source-form.component.html',
  styleUrls: ['./source-form.component.css']
})
export class SourceFormComponent implements OnInit, OnChanges {
  @Input() enquetes: EnqueteModel[] = [];
  @Input() addEnquetes: boolean = true;
  @Input() existingDocuments: DocumentModel[] = [];
  @Input() isSubmitting: boolean = false;
  @Output() back = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ files: File[], source: SourceInfoRequestData }>();

  etatOptions: Option[] = [];
  typeOptions: Option[] = [];


  sourceForm!: FormGroup;
  fiabiliteValue = 3;
  fiabiliteMax = 5;
  fiabiliteMin = 1;
  documentMode: 'upload' | 'existing' = 'upload';
  uploadedFiles: File[] = [];
  selectedExistingDocs: number[] = [];
  selectedEnquetes: number[] = [];

  constructor(
    private fb: FormBuilder,
    // protected documentUtil: DocumentUtilService
    protected readonly utilService: UtilService,
    private readonly etatService: EtatSourceService,
    private readonly typeService: TypeSourceService,
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes["isSubmitting"]) return;
    this.isSubmitting = changes["isSubmitting"].currentValue ?? false;
  }

  loadData() {
    forkJoin({
      etats: this.etatService.getAll(),
      types: this.typeService.getAll()
    }).subscribe({
      next: ({ etats, types }) => {
        this.etatOptions = etats.data.map(e => ({ value: e.code, label: e.libelle }))
        this.typeOptions = types.data.map(t => ({ value: t.code, label: t.libelle }))
      },
      error: err => {
        this.utilService.showNotification("Erreur lors du chargement des états et types de source", "error");
      }
    })
  }

  private initForm(): void {
    this.sourceForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      codeType: ['', Validators.required],
      codeEtat: ['', Validators.required],
      dateObtention: [''],
      fiabilite: [3, [Validators.required, Validators.min(this.fiabiliteMin), Validators.max(this.fiabiliteMax)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      commentaires: ['', Validators.maxLength(500)],
    });
  }

  setDocumentMode(mode: 'upload' | 'existing'): void {
    this.documentMode = mode;
  }

  onFiabiliteChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.fiabiliteValue = Number.parseInt(value);
    this.sourceForm.patchValue({ fiabilite: this.fiabiliteValue });
  }

  onFilesAdded(files: File[]): void {
    files.forEach((file) => {
      this.uploadedFiles.push(file);
    });
  }

  onRemoveFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  onDocumentToggle(event: { docId: number; checked: boolean }): void {
    if (event.checked) {
      this.selectedExistingDocs.push(event.docId);
    } else {
      this.selectedExistingDocs = this.selectedExistingDocs.filter((id) => id !== event.docId);
    }
  }

  onEnqueteToggle(event: { enqueteId: number; checked: boolean }): void {
    if (event.checked) {
      this.selectedEnquetes.push(event.enqueteId);
    } else {
      this.selectedEnquetes = this.selectedEnquetes.filter((id) => id !== event.enqueteId);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.sourceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.sourceForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Ce champ est obligatoire';
    if (field.errors['minlength']) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Minimum ${minLength} caractères requis`;
    }
    if (field.errors['maxlength']) {
      const maxLength = field.errors['maxlength'].requiredLength;
      return `Maximum ${maxLength} caractères autorisés`;
    }
    if (field.errors['min']) return `La valeur minimale est ${field.errors['min'].min}`;
    if (field.errors['max']) return `La valeur maximale est ${field.errors['max'].max}`;

    return 'Valeur invalide';
  }

  onSubmit(): void {
    this.isSubmitting = false;
    Object.keys(this.sourceForm.controls).forEach((key) => {
      this.sourceForm.get(key)?.markAsTouched();
    });

    if (this.sourceForm.valid) {
      const formData: SourceInfoRequestData = {
        ...this.sourceForm.value,
        enqueteIds: this.selectedEnquetes,
        documentsId: this.selectedExistingDocs,
      } as SourceInfoRequestData;
      this.isSubmitting = true;
      this.submit.emit({ source: formData, files: this.uploadedFiles });
    }
  }
}
