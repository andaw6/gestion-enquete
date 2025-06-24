import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  TemplateRef,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GenericFormModalComponent
} from "@shared/components/generic-crud/components/generic-form-modal/generic-form-modal.component";
import {PaginationComponent} from "@shared/components/pagination/pagination.component";
import {LoaderComponent} from "@shared/components/loader/loader.component";
import {CrudItem, GenericCrudConfig} from "@core/interfaces/generic-crud-config.interface";
import {Observable} from "rxjs";
import {DialogService} from "@core/services/dialog.service";
import {Pagination} from "@core/interfaces/pagination.interface";


@Component({
  selector: 'app-generic-crud',
  standalone: true,
  imports: [CommonModule, GenericFormModalComponent, PaginationComponent, LoaderComponent],
  templateUrl: './generic-crud.component.html',
  styleUrls: ['./generic-crud.component.css']
})
export class GenericCrudComponent <T extends CrudItem> implements OnInit{
  @Input() config!: GenericCrudConfig
  @Input() data$!: Observable<T[]>
  @Input() loading: WritableSignal<boolean> = signal(false)
  @Input() pagination!: Pagination
  @Input() existingCodes: string[] = []
  @Input() isSubmitting = false

  // Événements émis vers le parent
  @Output() loadData = new EventEmitter<{ pagination: Pagination }>()
  @Output() createItem = new EventEmitter<{ code: string; libelle: string }>()
  @Output() updateItem = new EventEmitter<{ id: number; data: { code: string; libelle: string } }>()
  @Output() deleteItem = new EventEmitter<{ id: number }>()
  @Output() pageChanged = new EventEmitter<{ pagination: Pagination }>()

  // Templates projetés depuis le parent
  @ContentChild("tableHeaders") tableHeaders!: TemplateRef<any>
  @ContentChild("tableRow") tableRow!: TemplateRef<any>

  // État du modal
  openModal = false
  editingItem = signal<T | null>(null)

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    // Émettre l'événement de chargement initial
    this.loadData.emit({ pagination: this.pagination })
  }

  // Actions de la liste
  onAddClick(): void {
    this.editingItem.set(null)
    this.openModal = true
  }

  onEditClick(item: T): void {
    this.editingItem.set(item)
    this.openModal = true
  }

  onDeleteClick(item: T): void {
    const title = this.config.deleteConfirmTitle || "Confirmer la suppression"
    const message = this.config.deleteConfirmMessage || "Êtes-vous sûr de vouloir supprimer cet élément ?"

    this.dialogService.openConfirmDialog(title, message).subscribe((result) => {
      if (result) {
        this.deleteItem.emit({ id: item.id })
      }
    })
  }

  onPageChanged(pagination: Pagination): void {
    this.pageChanged.emit({ pagination })
  }

  // Actions du modal
  onModalClose(): void {
    this.openModal = false
    this.editingItem.set(null)
  }

  onItemSave(formData: { code: string; libelle: string }): void {
    const editingItem = this.editingItem()

    if (editingItem?.id != null) {
      // Mode édition
      this.updateItem.emit({ id: editingItem.id, data: formData })
    } else {
      // Mode création
      this.createItem.emit(formData)
    }
  }

  // Méthode publique pour fermer le modal (appelée par le parent après succès)
  closeModal(): void {
    this.onModalClose()
  }

  // Getters pour le template
  get modalConfig() {
    return {
      createTitle: this.config.createTitle,
      editTitle: this.config.editTitle,
      createDescription: this.config.createDescription,
      editDescription: this.config.editDescription,
      codeLabel: this.config.codeLabel,
      codePlaceholder: this.config.codePlaceholder,
      labelLabel: this.config.labelLabel,
      labelPlaceholder: this.config.labelPlaceholder,
      createButtonText: this.config.createButtonText,
      editButtonText: this.config.editButtonText,
      cancelButtonText: this.config.cancelButtonText,
      iconSvgPath: this.config.iconSvgPath,
      codeMinLength: this.config.codeMinLength,
      codeMaxLength: this.config.codeMaxLength,
      labelMinLength: this.config.labelMinLength,
      labelMaxLength: this.config.labelMaxLength,
      codePattern: this.config.codePattern,
    }
  }
}
