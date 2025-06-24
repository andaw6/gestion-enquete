import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { takeUntil} from "rxjs";
import {GenericFormData, GenericModalConfig} from "@core/interfaces/generic-crud-config.interface";
import {DestroyService} from "@core/services/destroy.service";
import {animate, style, transition, trigger} from "@angular/animations";


@Component({
  selector: 'app-generic-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './generic-form-modal.component.html',
  styleUrls: ['./generic-form-modal.component.css'],
  animations: [
    trigger("fadeInOut", [
      transition(":enter", [style({ opacity: 0 }), animate("200ms", style({ opacity: 1 }))]),
      transition(":leave", [animate("200ms", style({ opacity: 0 }))]),
    ]),
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translateY(20px)", opacity: 0 }),
        animate("300ms ease-out", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
      transition(":leave", [animate("300ms ease-in", style({ transform: "translateY(20px)", opacity: 0 }))]),
    ]),
  ],
})
export class GenericFormModalComponent <T extends GenericFormData> implements OnInit, OnChanges {
  @Input() isVisible = false
  @Input() item: T | null = null
  @Input() existingCodes: string[] = []
  @Input() config!: GenericModalConfig
  @Input() isSubmitting = false

  @Output() close = new EventEmitter<void>()
  @Output() save = new EventEmitter<{ code: string; libelle: string }>()

  form!: FormGroup
  isEditMode = false

  // Icône par défaut pour les documents
  defaultIconPath =
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"

  constructor(
    private fb: FormBuilder,
    private destroy$: DestroyService,
  ) {}

  ngOnInit() {
    this.initializeForm()
    this.setupFormWatchers()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["item"]) {
      const newItem = changes["item"].currentValue as T | null

      if (newItem) {
        this.isEditMode = true
        if (this.form) {
          this.form.patchValue({
            code: newItem.code,
            label: newItem.libelle,
          })
        }
      } else {
        this.isEditMode = false
        if (this.form) {
          this.form.reset()
        }
      }
    }

    if (changes["isVisible"] && !changes["isVisible"].currentValue) {
      this.resetForm()
    }
  }

  private initializeForm() {
    const codeValidators = [
      Validators.required,
      Validators.minLength(this.config.codeMinLength || 3),
      Validators.maxLength(this.config.codeMaxLength || 20),
      this.codeExistsValidator.bind(this),
    ]

    if (this.config.codePattern) {
      codeValidators.push(Validators.pattern(this.config.codePattern))
    } else {
      codeValidators.push(Validators.pattern(/^[A-Za-z0-9\-_]+$/))
    }

    this.form = this.fb.group({
      code: ["", codeValidators],
      label: [
        "",
        [
          Validators.required,
          Validators.minLength(this.config.labelMinLength || 3),
          Validators.maxLength(this.config.labelMaxLength || 100),
        ],
      ],
    })

    if (this.item) {
      this.isEditMode = true
      this.form.patchValue({
        code: this.item.code,
        label: this.item.libelle,
      })
    }
  }

  private setupFormWatchers() {
    // Solution 4: Utiliser le service DestroyService
    const codeControl = this.form.get("code")
    if (codeControl) {
      codeControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: string) => {
        if (value) {
          const upperValue = value.toUpperCase()
          if (value !== upperValue) {
            codeControl.setValue(upperValue, { emitEvent: false })
          }
        }
      })
    }
  }

  private codeExistsValidator(control: AbstractControl) {
    const code = control.value?.toUpperCase()
    if (!code) return null

    if (this.isEditMode && this.item?.code.toUpperCase() === code) {
      return null
    }

    const exists = this.existingCodes.some((existingCode) => existingCode.toUpperCase() === code)

    return exists ? { codeExists: true } : null
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose()
    }
  }

  onClose() {
    this.close.emit()
    this.resetForm()
  }

  onSubmit() {
    if (this.form.valid && !this.isSubmitting) {
      const formValue = this.form.value
      const data = {
        code: formValue.code.toUpperCase() || "",
        libelle: formValue.label.trim() || "",
      }
      this.save.emit(data)
    }
  }

  private resetForm() {
    if (this.form) {
      this.form.reset()
    }
    this.isEditMode = false
  }

  get iconPath(): string {
    return this.config.iconSvgPath || this.defaultIconPath
  }


}
