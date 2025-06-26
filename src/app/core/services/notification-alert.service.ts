import { Injectable, Renderer2, RendererFactory2 } from "@angular/core"

type NotificationType = "success" | "error" | "warning" | "info"

@Injectable({
  providedIn: "root",
})
export class NotificationAlertService {
  private renderer: Renderer2

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null)
  }

  showNotification(message: string, type: NotificationType = "success"): void {
    // Créer le conteneur principal de la notification
    const notification = this.renderer.createElement("div")
    this.renderer.addClass(notification, "notification")
    this.renderer.addClass(notification, `notification-${type}`)

    // Créer la structure avec Renderer2
    const flexContainer = this.renderer.createElement("div")
    this.renderer.addClass(flexContainer, "flex")

    // Créer la section icône
    const iconContainer = this.renderer.createElement("div")
    this.renderer.addClass(iconContainer, "flex-shrink-0")

    const iconSvg = this.createIcon(type)
    this.renderer.appendChild(iconContainer, iconSvg)

    // Créer la section message
    const messageContainer = this.renderer.createElement("div")
    this.renderer.addClass(messageContainer, "ml-3")

    const messageText = this.renderer.createElement("p")
    this.renderer.addClass(messageText, "text-sm")
    this.renderer.addClass(messageText, "font-medium")
    this.renderer.addClass(messageText, "text-gray-900")
    this.renderer.addClass(messageText, "dark:text-white")
    const textNode = this.renderer.createText(message)
    this.renderer.appendChild(messageText, textNode)
    this.renderer.appendChild(messageContainer, messageText)

    // Créer le bouton de fermeture
    const closeContainer = this.renderer.createElement("div")
    this.renderer.addClass(closeContainer, "ml-auto")
    this.renderer.addClass(closeContainer, "pl-3")

    const closeButtonWrapper = this.renderer.createElement("div")
    this.renderer.addClass(closeButtonWrapper, "-mx-1.5")
    this.renderer.addClass(closeButtonWrapper, "-my-1.5")

    const closeButton = this.renderer.createElement("button")
    this.renderer.setAttribute(closeButton, "type", "button")
    this.renderer.addClass(closeButton, "close-notification")
    this.renderer.addClass(closeButton, "inline-flex")
    this.renderer.addClass(closeButton, "rounded-md")
    this.renderer.addClass(closeButton, "p-1.5")
    this.renderer.addClass(closeButton, "text-gray-500")
    this.renderer.addClass(closeButton, "dark:text-gray-400")
    this.renderer.addClass(closeButton, "hover:bg-gray-100")
    this.renderer.addClass(closeButton, "dark:hover:bg-gray-700")
    this.renderer.addClass(closeButton, "focus:outline-none")

    // Créer l'icône de fermeture
    const closeSvg = this.createCloseIcon()
    this.renderer.appendChild(closeButton, closeSvg)

    // Assembler la structure
    this.renderer.appendChild(closeButtonWrapper, closeButton)
    this.renderer.appendChild(closeContainer, closeButtonWrapper)

    this.renderer.appendChild(flexContainer, iconContainer)
    this.renderer.appendChild(flexContainer, messageContainer)
    this.renderer.appendChild(flexContainer, closeContainer)

    this.renderer.appendChild(notification, flexContainer)

    // Ajouter la notification au DOM
    this.renderer.appendChild(document.body, notification)

    // Ajouter un gestionnaire d'événements pour le bouton de fermeture
    this.renderer.listen(closeButton, "click", () => {
      this.removeNotification(notification)
    })

    // Afficher la notification avec animation
    setTimeout(() => {
      this.renderer.addClass(notification, "notification-show")
    }, 10)

    // Masquer automatiquement après 5 secondes
    setTimeout(() => {
      this.removeNotification(notification)
    }, 5000)
  }

  private createIcon(type: NotificationType): SVGElement {
    const svg = this.renderer.createElement("svg", "http://www.w3.org/2000/svg")
    this.renderer.addClass(svg, "h-5")
    this.renderer.addClass(svg, "w-5")
    this.renderer.setAttribute(svg, "fill", "none")
    this.renderer.setAttribute(svg, "stroke", "currentColor")
    this.renderer.setAttribute(svg, "viewBox", "0 0 24 24")

    const path = this.renderer.createElement("path", "http://www.w3.org/2000/svg")
    this.renderer.setAttribute(path, "stroke-linecap", "round")
    this.renderer.setAttribute(path, "stroke-linejoin", "round")
    this.renderer.setAttribute(path, "stroke-width", "2")

    switch (type) {
      case "success":
        this.renderer.addClass(svg, "text-green-400")
        this.renderer.setAttribute(path, "d", "M5 13l4 4L19 7")
        break
      case "error":
        this.renderer.addClass(svg, "text-red-400")
        this.renderer.setAttribute(path, "d", "M6 18L18 6M6 6l12 12")
        break
      case "warning":
        this.renderer.addClass(svg, "text-yellow-400")
        this.renderer.setAttribute(
          path,
          "d",
          "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
        )
        break
      case "info":
        this.renderer.addClass(svg, "text-blue-400")
        this.renderer.setAttribute(path, "d", "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z")
        break
    }

    this.renderer.appendChild(svg, path)
    return svg
  }

  private createCloseIcon(): SVGElement {
    const svg = this.renderer.createElement("svg", "http://www.w3.org/2000/svg")
    this.renderer.addClass(svg, "h-5")
    this.renderer.addClass(svg, "w-5")
    this.renderer.setAttribute(svg, "fill", "none")
    this.renderer.setAttribute(svg, "stroke", "currentColor")
    this.renderer.setAttribute(svg, "viewBox", "0 0 24 24")

    const path = this.renderer.createElement("path", "http://www.w3.org/2000/svg")
    this.renderer.setAttribute(path, "stroke-linecap", "round")
    this.renderer.setAttribute(path, "stroke-linejoin", "round")
    this.renderer.setAttribute(path, "stroke-width", "2")
    this.renderer.setAttribute(path, "d", "M6 18L18 6M6 6l12 12")

    this.renderer.appendChild(svg, path)
    return svg
  }

  private removeNotification(notification: HTMLElement): void {
    this.renderer.removeClass(notification, "notification-show")
    setTimeout(() => {
      if (notification.parentNode) {
        this.renderer.removeChild(document.body, notification)
      }
    }, 300)
  }
}
