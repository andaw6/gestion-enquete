import {Injectable, computed, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  EvenementCalendrier,
  EvenementCalendrierData,
  StatistiqueCalendrier
} from '@modules/enqueteur/traitement/planning/planning';
import {ApiCrudService} from '@core/api/api-crud.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IParams} from '@core/interfaces/http-options.interface';
import {ApiResponse} from '@core/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class PlanningService extends ApiCrudService<EvenementCalendrier, EvenementCalendrierData> {

  readonly USER_ID: number = 1;

  private eventsSignal = signal<EvenementCalendrier[]>([]);

  readonly events = this.eventsSignal.asReadonly();

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/evenement/calendrier");
    this.loadEvents(); // Initialiser les données
  }


  setEvents(events: EvenementCalendrier[]) {
    this.eventsSignal.set(events);
  }

  private loadEvents(): void {
    this.getAll({utilisateurId: this.USER_ID}).subscribe((response) => {
      this.eventsSignal.set(response.data);
    });
  }


  getEventsForDate(date: string): EvenementCalendrier[] {
    return this.eventsSignal().filter((event) => event.date === date);
  }

  getTodayEvents(): EvenementCalendrier[] {
    const today = new Date().toISOString().split("T")[0];
    return this.getEventsForDate(today);
  }

  getUpcomingEvents(): EvenementCalendrier[] {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return this.eventsSignal()
      .filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate > today && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getWeekStats(): { events: number; enquetes: number; echeances: number; urgent: number } {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1); // Lundi
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Dimanche

    const weekEvents = this.eventsSignal().filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= weekStart && eventDate <= weekEnd;
    });

    return {
      events: weekEvents.length,
      enquetes: weekEvents.filter((e) => e.type.code.toLowerCase() === "enquete").length,
      echeances: weekEvents.filter((e) => e.type.code.toLowerCase() === "echeance").length,
      urgent: weekEvents.filter((e) => e.priorite.toLowerCase() === "urgente").length,
    };
  }


  /** CRUD API */
  override create(data: EvenementCalendrierData): Observable<EvenementCalendrier> {
    return this.responsePostOne<EvenementCalendrier>(data).pipe(
      map(created => {
        this.loadEvents(); // Rechargement après ajout
        return created;
      })
    );
  }

  override update(id: number, data: EvenementCalendrierData): Observable<EvenementCalendrier> {
    return this.responsePutOne<EvenementCalendrier>(`/${id}`, data).pipe(
      map(updated => {
        this.loadEvents(); // Rechargement après mise à jour
        return updated;
      })
    );
  }

  override deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`).pipe(
      map(success => {
        if (success) this.loadEvents(); // Rechargement après suppression
        return success;
      })
    );
  }

  override getAll(params: IParams = {}): Observable<ApiResponse<EvenementCalendrier>> {
    params["utilisateurId"] = this.USER_ID;
    return this.responseGetMany<EvenementCalendrier>(params, "/all");
  }

  override getOne(id: number): Observable<EvenementCalendrier | null> {
    return this.responseGetOne<EvenementCalendrier>(`/${id}`);
  }

}
