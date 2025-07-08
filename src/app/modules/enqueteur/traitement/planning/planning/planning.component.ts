import {Component, signal} from '@angular/core';
import {CalendarView} from "@modules/enqueteur/traitement/planning/planning";

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent {
  currentView = signal<CalendarView>("month")
  isModalOpen = signal(false)
  selectedDate = signal<string>("")

  switchView(view: CalendarView): void {
    this.currentView.set(view)
  }

  getViewButtonClass(view: CalendarView): string {
    const baseClass =
      "px-3 py-1 text-sm font-medium text-gray-700 rounded-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
    const activeClass = "bg-white text-primary-600 shadow-sm"

    return this.currentView() === view ? `${baseClass} ${activeClass}` : baseClass
  }

  openEventModal(date?: string): void {
    if (date) {
      this.selectedDate.set(date)
    } else {
      this.selectedDate.set(new Date().toISOString().split("T")[0])
    }
    this.isModalOpen.set(true)
  }

  closeEventModal(): void {
    this.isModalOpen.set(false)
    this.selectedDate.set("")
  }

  onDateSelected(date: string): void {
    this.openEventModal(date)
  }

  onEventClick(eventId: number): void {
    console.log("Event clicked:", eventId)
  }

  onEventCreated(): void {
    this.closeEventModal()
  }
}
