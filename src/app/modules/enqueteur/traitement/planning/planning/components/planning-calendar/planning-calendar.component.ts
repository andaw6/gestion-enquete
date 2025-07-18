import {Component, computed, EventEmitter, inject, Input, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {
  CalendarDay,
  CalendarEvent,
  CalendarView, EvenementCalendrier,
  TimeSlot, TypeEvenement,
  WeekDay
} from "@modules/enqueteur/traitement/planning/planning";
import {PlanningService} from "@modules/enqueteur/traitement/planning/planning.service";
import {UtilService} from "@core/services/util.service";
import {ResponseError} from "@core/interfaces/response-error.interface";
import {ApiResponse} from "@core/interfaces/api-response.interface";
import {TypeEvenementService} from "@modules/enqueteur/traitement/planning/type-evenement.service";


@Component({
  selector: 'app-planning-calendar',
  templateUrl: './planning-calendar.component.html',
  styleUrls: ['./planning-calendar.component.css']
})
export class PlanningCalendarComponent implements OnInit {
  @Input() currentView: CalendarView = "month"
  @Output() dateSelected: EventEmitter<string> = new EventEmitter<string>()
  @Output() eventClick: EventEmitter<number> = new EventEmitter<number>()
  loading: boolean = false;

  eventsSignal: WritableSignal<EvenementCalendrier[]> = signal<EvenementCalendrier[]>([]);
  typeEvent: WritableSignal<TypeEvenement[]> = signal<TypeEvenement[]>([]);


  constructor(
    private readonly service: PlanningService,
    private readonly typeEvenementService: TypeEvenementService,
    private readonly utilService: UtilService,
  ) {
  }

  ngOnInit(): void {
    this.loadType();
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (response: ApiResponse<EvenementCalendrier>) => {
        this.eventsSignal.set(response.data);
        this.loading = false;
      },
      error: (err: ResponseError) => {
        this.loading = false;
        this.utilService.showNotification(err.message || "Erreur lors du chargement des événements de l'utilisateur", "error");
      }
    })
  }

  loadType() {
    this.typeEvenementService.getAll().subscribe({
      next: (response: ApiResponse<TypeEvenement>) => {
        this.typeEvent.set(response.data);
      },
      error: (err: ResponseError) => {
        this.utilService.showNotification(err.message || "Erreur lors du chargement des types d'événements", "error");
      }
    })
  }

  private calendarService = inject(PlanningService)
  protected currentDate = signal(new Date())

  dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
  // dayNamesShort = ["L", "M", "M", "J", "V", "S", "D"]
  monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]

  eventColors = {
    enquete: "bg-primary-500",
    rdv: "bg-green-500",
    echeance: "bg-yellow-500",
    reunion: "bg-purple-500",
    autre: "bg-gray-500",
  }

  // Time slots for week and day views
  timeSlots: TimeSlot[] = [
    {hour: 8, label: "08:00"},
    {hour: 9, label: "09:00"},
    {hour: 10, label: "10:00"},
    {hour: 11, label: "11:00"},
    {hour: 12, label: "12:00"},
    {hour: 13, label: "13:00"},
    {hour: 14, label: "14:00"},
    {hour: 15, label: "15:00"},
    {hour: 16, label: "16:00"},
    {hour: 17, label: "17:00"},
    {hour: 18, label: "18:00"},
  ]

  // Extended time slots for day view
  extendedTimeSlots: TimeSlot[] = [
    {hour: 7, label: "07:00"},
    {hour: 8, label: "08:00"},
    {hour: 9, label: "09:00"},
    {hour: 10, label: "10:00"},
    {hour: 11, label: "11:00"},
    {hour: 12, label: "12:00"},
    {hour: 13, label: "13:00"},
    {hour: 14, label: "14:00"},
    {hour: 15, label: "15:00"},
    {hour: 16, label: "16:00"},
    {hour: 17, label: "17:00"},
    {hour: 18, label: "18:00"},
    {hour: 19, label: "19:00"},
    {hour: 20, label: "20:00"},
  ]

  calendarDays = computed(() => {
    if (this.currentView !== "month") return []

    const date = this.currentDate()
    const year = date.getFullYear()
    const month = date.getMonth()

    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    const dayOfWeek = firstDay.getDay()
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    startDate.setDate(firstDay.getDate() - daysToSubtract)

    const days: CalendarDay[] = []

    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(startDate)
      cellDate.setDate(startDate.getDate() + i)

      const dateStr = cellDate.toISOString().split("T")[0]
      const dayEvents = this.calendarService.events().filter((event) => event.date === dateStr)

      days.push({
        date: cellDate,
        isCurrentMonth: cellDate.getMonth() === month,
        isToday: cellDate.toDateString() === new Date().toDateString(),
        events: dayEvents,
      })
    }

    return days
  })

  weekDays = computed(() => {
    if (this.currentView !== "week") return []

    const date = this.currentDate()
    const startOfWeek = new Date(date)
    const dayOfWeek = date.getDay()
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    startOfWeek.setDate(date.getDate() - daysToSubtract)

    const days: WeekDay[] = []

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek)
      dayDate.setDate(startOfWeek.getDate() + i)

      const dateStr = dayDate.toISOString().split("T")[0]
      const dayEvents = this.calendarService.events().filter((event) => event.date === dateStr)

      days.push({
        date: dayDate,
        isToday: dayDate.toDateString() === new Date().toDateString(),
        events: dayEvents,
      })
    }

    return days
  })

  getHeaderTitle(): string {
    const date = this.currentDate()

    switch (this.currentView) {
      case "month":
        return `${this.monthNames[date.getMonth()]} ${date.getFullYear()}`
      case "week":
        const weekDays = this.weekDays()
        if (weekDays.length > 0) {
          const startDate = weekDays[0].date
          const endDate = weekDays[6].date
          if (startDate.getMonth() === endDate.getMonth()) {
            return `${startDate.getDate()} - ${endDate.getDate()} ${this.monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`
          } else {
            return `${startDate.getDate()} ${this.monthNames[startDate.getMonth()]} - ${endDate.getDate()} ${this.monthNames[endDate.getMonth()]} ${startDate.getFullYear()}`
          }
        }
        return `${this.monthNames[date.getMonth()]} ${date.getFullYear()}`
      case "day":
        return `${date.getDate()} ${this.monthNames[date.getMonth()]} ${date.getFullYear()}`
      default:
        return `${this.monthNames[date.getMonth()]} ${date.getFullYear()}`
    }
  }

  navigatePrevious(): void {
    const newDate = new Date(this.currentDate())

    switch (this.currentView) {
      case "month":
        newDate.setMonth(newDate.getMonth() - 1)
        break
      case "week":
        newDate.setDate(newDate.getDate() - 7)
        break
      case "day":
        newDate.setDate(newDate.getDate() - 1)
        break
    }

    this.currentDate.set(newDate)
  }

  navigateNext(): void {
    const newDate = new Date(this.currentDate())

    switch (this.currentView) {
      case "month":
        newDate.setMonth(newDate.getMonth() + 1)
        break
      case "week":
        newDate.setDate(newDate.getDate() + 7)
        break
      case "day":
        newDate.setDate(newDate.getDate() + 1)
        break
    }

    this.currentDate.set(newDate)
  }

  goToToday(): void {
    this.currentDate.set(new Date())
  }

  onDayClick(date: Date): void {
    const dateStr = date.toISOString().split("T")[0]
    this.dateSelected.emit(dateStr)
  }

  onWeekDayTimeClick(date: Date, hour: number): void {
    const dateStr = date.toISOString().split("T")[0]
    this.dateSelected.emit(dateStr)
  }

  onDayTimeClick(hour: number): void {
    const dateStr = this.currentDate().toISOString().split("T")[0]
    this.dateSelected.emit(dateStr)
  }

  onEventClick(event: Event, eventId: number): void {
    event.stopPropagation()
    this.eventClick.emit(eventId)
  }

  getDayName(date: Date): string {
    return this.dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1]
  }

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString()
  }

  getEventsForDayAndHour(day: WeekDay, hour: number): CalendarEvent[] {
    return day.events.filter((event) => {
      const eventHour = Number.parseInt(event.time.split(":")[0])
      return eventHour === hour
    })
  }

  getEventsForHour(hour: number): CalendarEvent[] {
    const dateStr = this.currentDate().toISOString().split("T")[0]
    const dayEvents = this.calendarService.events().filter((event) => event.date === dateStr)

    return dayEvents.filter((event) => {
      const eventHour = Number.parseInt(event.time.split(":")[0])
      return eventHour === hour
    })
  }

  getEndTime(event: CalendarEvent): string {
    const [hours, minutes] = event.time.split(":").map(Number)
    const endDate = new Date()
    endDate.setHours(hours, minutes + event.duration)
    return endDate.toTimeString().slice(0, 5)
  }

  getDayCellClass(day: CalendarDay): string {
    let classes = "min-h-[120px] p-2 border-r border-b border-gray-200 hover:bg-gray-50 cursor-pointer"

    if (day.isCurrentMonth) {
      classes += " bg-white"
    } else {
      classes += " bg-gray-50"
    }

    return classes
  }

  getDayNumberClass(day: CalendarDay): string {
    let classes = "text-sm font-medium mb-1"

    if (day.isCurrentMonth) {
      classes += " text-gray-900"
    } else {
      classes += " text-gray-400"
    }

    if (day.isToday) {
      classes += " bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
    }

    return classes
  }

  getEventClass(event: CalendarEvent): string {
    const colorClass = this.eventColors[event.type] || "bg-gray-500"
    return `text-xs p-1 mb-1 rounded text-white truncate cursor-pointer hover:opacity-80 ${colorClass}`
  }

  getWeekEventClass(event: CalendarEvent): string {
    const colorClass = this.eventColors[event.type] || "bg-gray-500"
    return `absolute top-1 left-1 right-1 p-1 rounded text-white cursor-pointer hover:opacity-80 ${colorClass}`
  }

  getDayEventClass(event: CalendarEvent): string {
    const colorClass = this.eventColors[event.type] || "bg-gray-500"
    return `absolute top-2 left-2 right-2 p-2 rounded text-white cursor-pointer hover:opacity-80 ${colorClass}`
  }

  getEventTooltip(event: CalendarEvent): string {
    return `${event.title} - ${event.time}`
  }
}
