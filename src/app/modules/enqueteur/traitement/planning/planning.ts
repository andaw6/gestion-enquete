export interface Planning {
}

export interface CalendarEvent {
  id: number
  title: string
  type: "enquete" | "rdv" | "echeance" | "reunion" | "autre"
  date: string
  time: string
  duration: number
  priority: "normale" | "haute" | "urgente"
  description: string
}

export interface EventTypeConfig {
  label: string
  color: string
  bgColor: string
}

export type CalendarView = "day" | "week" | "month"

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
}

export interface WeekDay {
  date: Date
  isToday: boolean
  events: CalendarEvent[]
}

export interface TimeSlot {
  hour: number
  label: string
}
