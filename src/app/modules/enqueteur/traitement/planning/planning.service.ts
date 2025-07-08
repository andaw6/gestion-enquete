import {Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CalendarEvent, Planning} from "@modules/enqueteur/traitement/planning/planning";
import {ApiCrudService} from "@core/api/api-crud.service";
import {Observable, of} from "rxjs";
import {IParams} from "@core/interfaces/http-options.interface";
import {ApiResponse} from "@core/interfaces/api-response.interface";

@Injectable({
  providedIn: 'root'
})
export class PlanningService extends ApiCrudService<Planning> {

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/planning");
  }


  private eventsSignal = signal<CalendarEvent[]>([
    {
      id: 1,
      title: "Enquête terrain - Entreprise ABC",
      type: "enquete",
      date: "2024-01-15",
      time: "09:00",
      duration: 120,
      priority: "haute",
      description: "Vérification contrat travail",
    },
    {
      id: 2,
      title: "RDV Martin Dubois",
      type: "rdv",
      date: "2024-01-15",
      time: "14:30",
      duration: 60,
      priority: "normale",
      description: "Entretien bénéficiaire",
    },
    {
      id: 3,
      title: "Échéance rapport",
      type: "echeance",
      date: "2024-01-15",
      time: "17:00",
      duration: 0,
      priority: "urgente",
      description: "Remise rapport ENQ-2024-003",
    },
    {
      id: 4,
      title: "Réunion équipe",
      type: "reunion",
      date: "2024-01-19",
      time: "10:00",
      duration: 90,
      priority: "normale",
      description: "Point hebdomadaire",
    },
    {
      id: 5,
      title: "Entretien client",
      type: "rdv",
      date: new Date().toISOString().split("T")[0], // Aujourd'hui
      time: "11:00",
      duration: 45,
      priority: "haute",
      description: "Entretien avec nouveau client",
    },
    {
      id: 6,
      title: "Formation équipe",
      type: "reunion",
      date: new Date().toISOString().split("T")[0], // Aujourd'hui
      time: "15:00",
      duration: 120,
      priority: "normale",
      description: "Formation sur les nouvelles procédures",
    },
  ])

  events = this.eventsSignal.asReadonly()

  addEvent(event: Omit<CalendarEvent, "id">): void {
    const newEvent: CalendarEvent = {
      ...event,
      id: Math.max(...this.eventsSignal().map((e) => e.id), 0) + 1,
    }
    this.eventsSignal.update((events) => [...events, newEvent])
  }

  getEventsForDate(date: string): CalendarEvent[] {
    return this.eventsSignal().filter((event) => event.date === date)
  }

  getTodayEvents(): CalendarEvent[] {
    const today = new Date().toISOString().split("T")[0]
    return this.getEventsForDate(today)
  }

  getUpcomingEvents(): CalendarEvent[] {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    return this.eventsSignal()
      .filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate > today && eventDate <= nextWeek
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  getWeekStats(): { events: number; enquetes: number; echeances: number; urgent: number } {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay() + 1)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const weekEvents = this.eventsSignal().filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate >= weekStart && eventDate <= weekEnd
    })

    return {
      events: weekEvents.length,
      enquetes: weekEvents.filter((e) => e.type === "enquete").length,
      echeances: weekEvents.filter((e) => e.type === "echeance").length,
      urgent: weekEvents.filter((e) => e.priority === "urgente").length,
    }
  }

  create(data: any): Observable<Planning> {
    return of();
  }

  deleteOne(id: number): Observable<boolean> {
    return of(true);
  }

  getAll(params: IParams | undefined): Observable<ApiResponse<Planning>> {
    return of();
  }

  getOne(id: number): Observable<Planning | null> {
    return of();
  }

  update(id: number, data: any): Observable<Planning> {
    return of();
  }
}
