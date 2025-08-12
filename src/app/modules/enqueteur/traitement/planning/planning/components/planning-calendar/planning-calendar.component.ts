import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import {
  CalendarDay,
  CalendarView,
  EvenementCalendrier,
  TimeSlot,
  WeekDay
} from '@modules/enqueteur/traitement/planning/planning';
import { PlanningService } from '@modules/enqueteur/traitement/planning/planning.service';

@Component({
  selector: 'app-planning-calendar',
  templateUrl: './planning-calendar.component.html',
  styleUrls: ['./planning-calendar.component.css']
})
export class PlanningCalendarComponent {
  @Input() currentView: CalendarView = 'month';
  @Output() dateSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output() eventClick: EventEmitter<number> = new EventEmitter<number>();
  loading = false;

  constructor(
    private readonly service: PlanningService,
  ) {}


  protected currentDate = signal(new Date());

  dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  monthNames = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
  ];

  eventColors: Record<string, string> = {
    enquete: 'bg-primary-500',
    rdv: 'bg-green-500',
    echeance: 'bg-yellow-500',
    reunion: 'bg-purple-500',
    autre: 'bg-gray-500'
  };

  timeSlots: TimeSlot[] = Array.from({ length: 11 }, (_, i) => ({
    hour: i + 8,
    label: `${(i + 8).toString().padStart(2, '0')}:00`
  }));

  extendedTimeSlots: TimeSlot[] = Array.from({ length: 14 }, (_, i) => ({
    hour: i + 7,
    label: `${(i + 7).toString().padStart(2, '0')}:00`
  }));

  calendarDays = computed(() => {
    if (this.currentView !== 'month') return [];

    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(firstDay.getDate() - daysToSubtract);

    const days: CalendarDay[] = [];

    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + i);

      const dateStr = cellDate.toISOString().split('T')[0];
      const dayEvents = this.service.events().filter((event) => event.date === dateStr);

      days.push({
        date: cellDate,
        isCurrentMonth: cellDate.getMonth() === month,
        isToday: cellDate.toDateString() === new Date().toDateString(),
        events: dayEvents
      });
    }

    return days;
  });

  weekDays = computed(() => {
    if (this.currentView !== 'week') return [];

    const date = this.currentDate();
    const startOfWeek = new Date(date);
    const dayOfWeek = date.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(date.getDate() - daysToSubtract);

    const days: WeekDay[] = [];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);

      const dateStr = dayDate.toISOString().split('T')[0];
      const dayEvents = this.service.events().filter((event) => event.date === dateStr);

      days.push({
        date: dayDate,
        isToday: dayDate.toDateString() === new Date().toDateString(),
        events: dayEvents
      });
    }

    return days;
  });

  getHeaderTitle(): string {
    const date = this.currentDate();

    switch (this.currentView) {
      case 'month':
        return `${this.monthNames[date.getMonth()]} ${date.getFullYear()}`;
      case 'week':
        const weekDays = this.weekDays();
        if (weekDays.length > 0) {
          const startDate = weekDays[0].date;
          const endDate = weekDays[6].date;
          if (startDate.getMonth() === endDate.getMonth()) {
            return `${startDate.getDate()} - ${endDate.getDate()} ${this.monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`;
          } else {
            return `${startDate.getDate()} ${this.monthNames[startDate.getMonth()]} - ${endDate.getDate()} ${this.monthNames[endDate.getMonth()]} ${startDate.getFullYear()}`;
          }
        }
        return `${this.monthNames[date.getMonth()]} ${date.getFullYear()}`;
      case 'day':
        return `${date.getDate()} ${this.monthNames[date.getMonth()]} ${date.getFullYear()}`;
      default:
        return `${this.monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }
  }

  navigatePrevious(): void {
    const newDate = new Date(this.currentDate());

    switch (this.currentView) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }

    this.currentDate.set(newDate);
  }

  navigateNext(): void {
    const newDate = new Date(this.currentDate());

    switch (this.currentView) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }

    this.currentDate.set(newDate);
  }

  goToToday(): void {
    this.currentDate.set(new Date());
  }

  onDayClick(date: Date): void {
    const dateStr = date.toISOString().split('T')[0];
    this.dateSelected.emit(dateStr);
  }

  onWeekDayTimeClick(date: Date, _: number): void {
    const dateStr = date.toISOString().split('T')[0];
    this.dateSelected.emit(dateStr);
  }

  onDayTimeClick(_: number): void {
    const dateStr = this.currentDate().toISOString().split('T')[0];
    this.dateSelected.emit(dateStr);
  }

  onEventClick(event: Event, eventId: number): void {
    event.stopPropagation();
    this.eventClick.emit(eventId);
  }

  getDayName(date: Date): string {
    return this.dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1];
  }

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }

  getEventsForDayAndHour(day: WeekDay, hour: number): EvenementCalendrier[] {
    return day.events.filter((event) => {
      const eventHour = Number.parseInt(event.heure.split(':')[0]);
      return eventHour === hour;
    });
  }

  getEventsForHour(hour: number): EvenementCalendrier[] {
    const dateStr = this.currentDate().toISOString().split('T')[0];
    const dayEvents = this.service.events().filter((event) => event.date === dateStr);

    return dayEvents.filter((event) => {
      const eventHour = Number.parseInt(event.heure.split(':')[0]);
      return eventHour === hour;
    });
  }

  getEndTime(event: EvenementCalendrier): string {
    const [hours, minutes] = event.heure.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes + event.duree);
    return endDate.toTimeString().slice(0, 5);
  }

  getDayCellClass(day: CalendarDay): string {
    let classes = 'min-h-[120px] p-2 border-r border-b border-gray-200 hover:bg-gray-50 cursor-pointer';

    if (day.isCurrentMonth) {
      classes += ' bg-white';
    } else {
      classes += ' bg-gray-50';
    }

    return classes;
  }

  getDayNumberClass(day: CalendarDay): string {
    let classes = 'text-sm font-medium mb-1';

    if (day.isCurrentMonth) {
      classes += ' text-gray-900';
    } else {
      classes += ' text-gray-400';
    }

    if (day.isToday) {
      classes += ' bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center';
    }

    return classes;
  }

  getEventClass(event: EvenementCalendrier): string {
    const colorClass = this.eventColors[event.type.code.toLowerCase()] || 'bg-gray-500';
    return `text-xs p-1 mb-1 rounded text-white truncate cursor-pointer hover:opacity-80 ${colorClass}`;
  }

  getWeekEventClass(event: EvenementCalendrier): string {
    const colorClass = this.eventColors[event.type.code.toLowerCase()] || 'bg-gray-500';
    return `absolute top-1 left-1 right-1 p-1 rounded text-white cursor-pointer hover:opacity-80 ${colorClass}`;
  }

  getDayEventClass(event: EvenementCalendrier): string {
    const colorClass = this.eventColors[event.type.code] || 'bg-gray-500';
    return `absolute top-2 left-2 right-2 p-2 rounded text-white cursor-pointer hover:opacity-80 ${colorClass}`;
  }

  getEventTooltip(event: EvenementCalendrier): string {
    return `${event.titre} - ${event.heure}`;
  }
}
