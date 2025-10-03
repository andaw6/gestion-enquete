import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from "@angular/core"
import { CommonModule, NgForOf, NgIf } from "@angular/common"
import { SourceInfoModel } from "@core/model/source-info.model"
import { UtilService } from "@core/services/util.service"
import { UtilisateurModel } from "@core/model/utilisateur.model"
import { animate, state, style, transition, trigger } from "@angular/animations"
import { ModalWrapperComponent } from "@shared/components/modal-wrapper/modal-wrapper.component";
import { DocumentModel } from "@core/model/document.model"

@Component({
  selector: 'app-source-info-modal',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, ModalWrapperComponent],
  templateUrl: './source-info-modal.component.html',
  styleUrls: ['./source-info-modal.component.css'],
  animations: [
    trigger("modalAnimation", [
      state(
        "void",
        style({
          opacity: 0,
          transform: "scale(0.95)",
        }),
      ),
      state(
        "*",
        style({
          opacity: 1,
          transform: "scale(1)",
        }),
      ),
      transition("void => *", animate("300ms ease-out")),
      transition("* => void", animate("200ms ease-in")),
    ]),
    trigger("overlayAnimation", [
      state("void", style({ opacity: 0 })),
      state("*", style({ opacity: 1 })),
      transition("void => *", animate("300ms ease-out")),
      transition("* => void", animate("200ms ease-in")),
    ]),
  ],
})
export class SourceInfoModalComponent implements OnInit, OnChanges {
  @Input() sourceInfo: SourceInfoModel | null = null;
  @Input() utilisateur: UtilisateurModel | null = null;
  @Input() isOpen = false

  @Output() closeModal = new EventEmitter<void>()
  @Output() modifySource = new EventEmitter<SourceInfoModel>()
  @Output() downloadDocument = new EventEmitter<DocumentModel>();
  @Output() viewDocument = new EventEmitter<DocumentModel>();

  source!: SourceInfoModel;
  fiabiliteMax = 5;
  fiabiliteMin = 1;

  protected readonly utilService = inject(UtilService);

  ngOnInit(): void {
    if (this.sourceInfo) {
      this.source = this.sourceInfo;
    }
    // Écouter la touche Échap pour fermer le modal
    document.addEventListener("keydown", this.handleEscapeKey.bind(this))
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes["sourceInfo"]) return;
    const source = changes["sourceInfo"].currentValue;
    if (!!source) {
      this.source = source as SourceInfoModel;
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener("keydown", this.handleEscapeKey.bind(this))
  }

  handleEscapeKey(event: KeyboardEvent): void {
    if (event.key === "Escape" && this.isOpen) {
      this.onClose()
    }
  }

  onClose(): void {
    this.closeModal.emit()
  }

  onModify(): void {
    this.modifySource.emit(this.source)
  }

  onOverlayClick(event: MouseEvent): void {
    // Fermer uniquement si on clique sur l'overlay, pas sur le contenu
    if ((event.target as HTMLElement).id === "modalOverlay") {
      this.onClose()
    }
  }

  getEtatClass(etatCode: string): string {
    const etatClasses: Record<string, string> = {
      "00": "bg-yellow-100 text-yellow-700",
      "01": "bg-green-100 text-green-700",
      "02": "bg-gray-100 text-gray-700",
      "03": "bg-purple-100 text-purple-700",
      "04": "bg-red-100 text-red-700",
    }
    return etatClasses[etatCode] || "bg-gray-100 text-gray-700"
  }


  getEnqueteEtatClass(etatCode: string): string {
    const etatClasses: Record<string, string> = {
      "00": "bg-yellow-100 text-yellow-700", // En attente
      "01": "bg-blue-100 text-blue-700",     // En cours
      "02": "bg-green-100 text-green-700",   // Terminée
      "03": "bg-purple-100 text-purple-700", // En validation
      "04": "bg-emerald-100 text-emerald-700", // Validée
      "05": "bg-orange-100 text-orange-700", // En révision
      "06": "bg-red-100 text-red-700",       // Annulée
    }
    return etatClasses[etatCode] || "bg-gray-100 text-gray-700"
  }

  formatDate(date: Date | null): string {
    if (!date) return "N/A"
    const d = new Date(date)
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }



  getUserInitials(username: string): string {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  getFiabiliteBarWidth(): string {
    if (!this.sourceInfo?.fiabilite) {
      return "0%";
    }

    // Normalisation : (valeur - min) / (max - min) * 100
    const value = this.sourceInfo.fiabilite;
    const percentage =
      ((value - this.fiabiliteMin) / (this.fiabiliteMax - this.fiabiliteMin)) * 100;

    return `${Math.min(Math.max(percentage, 0), 100)}%`; // clamp entre 0 et 100
  }
}
