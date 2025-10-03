import { Component, EventEmitter, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { SourceMode, SourceModeSelectionComponent } from '../source-mode-selection/source-mode-selection.component';
import { SourceData, SourceInfoModel, SourceInfoRequestData } from '@core/model/source-info.model';
import { DocumentModel } from '@core/model/document.model';
import { EnqueteModel } from '@core/model/enquete.model';
import { ModalWrapperComponent } from '@shared/components/modal-wrapper/modal-wrapper.component';
import { ModalHeaderComponent } from '@shared/components/modal-header/modal-header.component';
import { ExistingSourceListComponent } from '@modules/enqueteur/traitement/source-info/components/existing-source-list/existing-source-list.component';
import { SourceFormComponent } from '@modules/enqueteur/traitement/source-info/components/source-form/source-form.component';
import { DocumentService } from '@modules/enqueteur/traitement/document/document.service';
import { SourceInfoService } from '@modules/enqueteur/traitement/source-info/source-info.service';
import { forkJoin } from 'rxjs';
import { ToastService } from '@core/services/toast.service';
import { EnqueteStateService } from '@store/enquete/enquete-state.service';


@Component({
  selector: 'app-add-source',
  standalone: true,
  imports: [
    CommonModule,
    ModalWrapperComponent,
    ModalHeaderComponent,
    SourceModeSelectionComponent,
    ExistingSourceListComponent,
    SourceFormComponent,
    NgIf
  ],
  templateUrl: './add-source.component.html',
  styleUrls: ['./add-source.component.css']
})
export class AddSourceComponent implements OnChanges, OnInit {
  @Input() open = false;
  @Input() isSubmitting: boolean = false;
  @Input() existingDocuments: DocumentModel[] = [];

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<SourceData>();

  sourceMode: SourceMode | null = null;
  selectedSourceId: number | null = null;
  existingSources: SourceInfoModel[] = [];
  loading = signal<boolean>(false);
  enquete!: EnqueteModel;

  constructor(
    private readonly documentService: DocumentService,
    private readonly sourceService: SourceInfoService,
    private readonly toastService: ToastService,
    private readonly enqueteState: EnqueteStateService,
  ) {
  }

  ngOnInit(): void {
    this.enqueteState.enquete$.subscribe(enquete => {
      if (enquete) {
        this.enquete = enquete;
        this.loadData();
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      const open = changes['open'].currentValue ?? false;
      document.body.style.overflow = open ? 'hidden' : 'auto';
    }
  }


  loadData() {
    this.loading.set(true);
    forkJoin({
      sources: this.sourceService.getAll({ excludeEnquete: true, enqueteId: this.enquete.id, utilisateurId: this.enquete.enqueteur?.id })
    }).subscribe({
      next: ({ sources }) => {
        this.existingSources = sources.data;
        this.loading.set(false);
      },
      error: _ => {
        this.toastService.show("Erreur lors de la récupération des données", "error");
        this.loading.set(false);
      }
    })

  }


  close(): void {
    this.open = false;
    document.body.style.overflow = 'auto';
    this.sourceMode = null;
    this.selectedSourceId = null;
    this.closeModal.emit();
  }

  setSourceMode(mode: SourceMode): void {
    this.sourceMode = mode;
  }

  selectExistingSource(sourceId: number): void {
    this.selectedSourceId = sourceId;
  }

  confirmSourceSelection(sourceId: number): void {
    const selectedSource = this.existingSources.find((s) => s.id === sourceId);
    if (selectedSource) {
      this.submitForm.emit({ mode: 'select', source: selectedSource });
      this.close();
    }
  }

  onSubmit(event: { files: File[], source: SourceInfoRequestData }): void {
    this.submitForm.emit({ mode: 'create', data: event });
    // this.close();
  }

  getModalTitle(): string {
    if (this.sourceMode === null) return "Source d'Information";
    if (this.sourceMode === 'select') return 'Sélectionner une Source';
    return "Nouvelle Source d'Information";
  }

  getModalSubtitle(): string {
    if (this.sourceMode === null) return 'Choisissez une option';
    if (this.sourceMode === 'select') return 'Sélectionnez une source existante';
    return 'Ajouter une source pour vos enquêtes';
  }

}
