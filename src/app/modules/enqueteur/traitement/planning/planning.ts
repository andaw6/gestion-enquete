import {EntityType} from "@core/interfaces/entity-type.interface";
import {Utilisateur} from "@core/interfaces/utilisateur.interface";

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


export interface TypeEvenement extends EntityType {
}

export interface EvenementCalendrier {
  id: number;
  titre: string;
  date: string;
  heure: string;
  duree: number;
  priorite: string;
  description?: string;
  type: TypeEvenement;
  utilisateur: Utilisateur;
}

export interface EvenementCalendrierData {
  titre: string;
  date: string;
  heure: string;
  duree: number;
  priorite: "normale" | "haute" | "urgente";
  description?: string;
  typeCode: string;
  utilisateurId: number;
}

export interface StatistiqueCalendrier {
  totalEvenements: number;
  totalEnquetes: number;
  totalEcheances: number;
  totalUrgents: number;
}
