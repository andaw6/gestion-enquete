import {Component, computed, inject} from '@angular/core';
import {CalendarEvent, EvenementCalendrier} from "@modules/enqueteur/traitement/planning/planning";
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

  eventBgColors:Record<string, string> = {
    enquete: "bg-primary-50",
    rdv: "bg-green-50",
    echeance: "bg-yellow-50",
    reunion: "bg-purple-50",
  }

  eventDotColors: Record<string, string> = {
    enquete: "bg-primary-500",
    rdv: "bg-green-500",
    echeance: "bg-yellow-500",
    reunion: "bg-purple-500",
  };

  getEventBgClass(event: EvenementCalendrier): string {
    const code = event?.type?.code?.toLowerCase?.();
    return this.eventBgColors[code] || "bg-gray-50"
  }

  getEventDotClass(event: EvenementCalendrier): string {
    const code = event?.type?.code?.toLowerCase?.();
    return this.eventDotColors[code] || "bg-gray-500";
  }


  getEndTime(event: EvenementCalendrier): string {
    const [hours, minutes] = event.heure.split(":").map(Number)
    const endDate = new Date()
    endDate.setHours(hours, minutes + event.duree)
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

  getPriorityBadgeClass(event: EvenementCalendrier): string {
    const classes = {
      normale: "bg-blue-100 text-blue-800",
      haute: "bg-yellow-100 text-yellow-800",
      urgente: "bg-red-100 text-red-800",
    }
    return classes[event.priorite] || classes["normale"]
  }
}
