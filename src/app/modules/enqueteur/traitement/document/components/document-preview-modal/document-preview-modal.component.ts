import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2,} from '@angular/core';

@Component({
  selector: 'app-document-preview-modal',
  templateUrl: './document-preview-modal.component.html',
  styleUrls: ['./document-preview-modal.component.css']
})
export class DocumentPreviewModalComponent  {
  @Input() pdfUrl = "./file.pdf"
  @Input() fileName = "document.pdf"
  @Input() fileSize = "2.3 MB"
  @Output() modalClosed = new EventEmitter<void>()

  @Input() isModalOpen = false
  isLoading = true
  hasError = false
  toastMessage = ""
  showToast = false

  private toastTimeout?: number

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef
  ) {
  }

  openModal(): void {
    this.isModalOpen = true
    this.isLoading = true
    this.hasError = false
    document.body.style.overflow = "hidden"

    // Simuler le chargement initial
    setTimeout(() => {
      this.updateFileInfo()
    }, 300)
  }

  closeModal(): void {
    this.isModalOpen = false
    document.body.style.overflow = "auto"
    this.modalClosed.emit()
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal()
    }
  }

  onPdfLoad(): void {
    setTimeout(() => {
      this.isLoading = false
      this.displayToast("Document chargé avec succès!")
      this.updateFileInfo()
    }, 1000)
  }

  onPdfError(): void {
    this.isLoading = false
    this.hasError = true
  }

  downloadPDF(): void {
    const link = document.createElement("a")
    link.href = this.pdfUrl
    link.download = this.fileName
    link.click()
    this.displayToast("Téléchargement démarré!")
  }

  printPDF(): void {
    const pdfFrame = this.elRef.nativeElement.querySelector('#pdfEmbed');

    if ((pdfFrame as any)?.contentWindow) {
      (pdfFrame as any).contentWindow.print();
    } else {
      window.open(this.pdfUrl, '_blank');
    }

    this.displayToast('Impression lancée!');
  }


  reloadPDF(): void {
    this.isLoading = true
    this.hasError = false

    const pdfEmbed = document.getElementById("pdfEmbed") as HTMLEmbedElement
    if (pdfEmbed) {
      const src = pdfEmbed.src
      pdfEmbed.src = ""
      setTimeout(() => {
        pdfEmbed.src = src + "?t=" + Date.now()
      }, 100)
    }
  }

  retryLoad(): void {
    this.reloadPDF()
  }

  private displayToast(message: string): void {
    this.toastMessage = message
    this.showToast = true

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout)
    }

    this.toastTimeout = window.setTimeout(() => {
      this.showToast = false
    }, 3000)
  }

  private updateFileInfo(): void {
    // Cette méthode peut être étendue pour récupérer les vraies informations du fichier
    // Pour l'instant, on utilise les valeurs par défaut
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.isModalOpen) return

    if (event.key === "Escape") {
      this.closeModal()
      return
    }

    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case "d":
          event.preventDefault()
          this.downloadPDF()
          break
        case "p":
          event.preventDefault()
          this.printPDF()
          break
        case "r":
          event.preventDefault()
          this.reloadPDF()
          break
      }
    }
  }

  ngOnDestroy(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout)
    }
    document.body.style.overflow = "auto"
  }
}
