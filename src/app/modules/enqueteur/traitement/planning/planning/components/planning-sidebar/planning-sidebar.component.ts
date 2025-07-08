import {Component, computed, inject} from '@angular/core';
import {CalendarEvent} from "@modules/enqueteur/traitement/planning/planning";
import {PlanningService} from "@modules/enqueteur/traitement/planning/planning.service";



@Component({
  selector: 'app-planning-sidebar',
  templateUrl: './planning-sidebar.component.html',
  styleUrls: ['./planning-sidebar.component.css']
})
export class PlanningSidebarComponent {
  private calendarService = inject(PlanningService)

  todayEvents = computed(() => this.calendarService.getTodayEvents())
  upcomingEvents = computed(() => this.calendarService.getUpcomingEvents())
  weekStats = computed(() => this.calendarService.getWeekStats())

  eventBgColors = {
    enquete: "bg-primary-50",
    rdv: "bg-green-50",
    echeance: "bg-yellow-50",
    reunion: "bg-purple-50",
    autre: "bg-gray-50",
  }

  eventDotColors = {
    enquete: "bg-primary-500",
    rdv: "bg-green-500",
    echeance: "bg-yellow-500",
    reunion: "bg-purple-500",
    autre: "bg-gray-500",
  }

  getEventBgClass(event: CalendarEvent): string {
    return this.eventBgColors[event.type] || "bg-gray-50"
  }

  getEventDotClass(event: CalendarEvent): string {
    return this.eventDotColors[event.type] || "bg-gray-500"
  }

  getEndTime(event: CalendarEvent): string {
    const [hours, minutes] = event.time.split(":").map(Number)
    const endDate = new Date()
    endDate.setHours(hours, minutes + event.duration)
    return endDate.toTimeString().slice(0, 5)
  }

  getRelativeDate(dateStr: string): string {
    const eventDate = new Date(dateStr)
    const today = new Date()
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Demain"
    if (diffDays === 2) return "Après-demain"
    if (diffDays <= 7) return `Dans ${diffDays} jours`
    return eventDate.toLocaleDateString("fr-FR")
  }

  getPriorityLabel(priority: string): string {
    const labels = {
      normale: "Planifié",
      haute: "Haute",
      urgente: "Urgent",
    }
    return labels[priority as keyof typeof labels] || "Planifié"
  }

  getPriorityBadgeClass(event: CalendarEvent): string {
    const classes = {
      normale: "bg-blue-100 text-blue-800",
      haute: "bg-yellow-100 text-yellow-800",
      urgente: "bg-red-100 text-red-800",
    }
    return classes[event.priority] || classes["normale"]
  }
}
