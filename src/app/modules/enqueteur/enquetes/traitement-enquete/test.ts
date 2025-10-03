export interface Person {
  name: string
  role: string
}

export interface Testimony {
  id: string
  witnessName: string
  role: string
  date: string
  time: string
  content: string
  signed: boolean
  validated: boolean
  status: "validated" | "pending" | "rejected"
}

export interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadDate: string
  status: "validated" | "pending" | "rejected"
}

export interface Source {
  id: string
  type: "surveillance" | "access" | "witness" | "document" | "expert" | "other"
  title: string
  description: string
  reliability: "high" | "medium" | "low" | "unknown"
  status: "active" | "inactive" | "alert"
  details: Record<string, string>
}

export interface Observation {
  id: string
  title: string
  category: "inspection" | "security" | "procedure" | "correction" | "follow-up" | "other"
  priority: "low" | "medium" | "high" | "critical"
  date: string
  time: string
  description: string
  author: string
  status: "completed" | "important" | "resolved"
}

export interface SurveyData {
  id: string
  title: string
  description: string
  incidentDate: string
  incidentTime: string
  location: string
  type: string
  severity: string
  status: "draft" | "in-progress" | "completed"
  createdDate: string
  dueDate: string
  priority: "low" | "medium" | "high" | "critical"
  persons: Person[]
  testimonies: Testimony[]
  documents: Document[]
  sources: Source[]
  observations: Observation[]
}


import { Injectable, signal } from "@angular/core"

export interface Notification {
  id: string
  title: string
  message: string
  type: "success" | "error" | "info" | "warning"
  duration?: number
}

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private notifications = signal<Notification[]>([])

  getNotifications() {
    return this.notifications.asReadonly()
  }

  show(title: string, message: string, type: Notification["type"] = "info", duration = 4000) {
    const notification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      duration,
    }

    this.notifications.update((current) => [...current, notification])

    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification.id)
      }, duration)
    }
  }

  remove(id: string) {
    this.notifications.update((current) => current.filter((notification) => notification.id !== id))
  }

  clear() {
    this.notifications.set([])
  }
}


@Injectable({
  providedIn: "root",
})
export class SurveyService {
  private surveyData = signal<SurveyData>({
    id: "ENQ-2024-0042",
    title: "Enquête sur incident de sécurité - Site Alpha",
    description:
      "Une intrusion non autorisée a été détectée à l'entrée principale du bâtiment A sur le site Alpha. L'individu a contourné le système de sécurité en utilisant un badge d'accès volé.",
    incidentDate: "2024-06-10",
    incidentTime: "14:30",
    location: "Bâtiment A, Entrée principale, Site Alpha",
    type: "1",
    severity: "3",
    status: "in-progress",
    createdDate: "2024-06-12",
    dueDate: "2024-06-26",
    priority: "high",
    persons: [
      { name: "Jean Dupont", role: "Agent de sécurité" },
      { name: "Inconnu", role: "Intrus" },
    ],
    testimonies: [
      {
        id: "1",
        witnessName: "Jean Dupont",
        role: "Agent de sécurité",
        date: "2024-06-10",
        time: "16:45",
        content:
          "J'étais en poste à l'entrée principale quand j'ai remarqué un individu qui semblait nerveux près des portiques de sécurité. Il a utilisé un badge pour entrer, mais le système a émis une alerte sonore inhabituelle.",
        signed: true,
        validated: true,
        status: "validated",
      },
      {
        id: "2",
        witnessName: "Marie Lambert",
        role: "Réceptionniste",
        date: "2024-06-10",
        time: "17:30",
        content:
          "J'ai vu l'individu rôder autour du bâtiment environ 30 minutes avant l'incident. Il semblait observer les allées et venues du personnel.",
        signed: false,
        validated: false,
        status: "pending",
      },
    ],
    documents: [
      {
        id: "1",
        name: "Rapport_Police_Incident_Alpha.pdf",
        type: "pdf",
        size: 2.3,
        uploadDate: "2024-06-10",
        status: "validated",
      },
      {
        id: "2",
        name: "Capture_Camera_Surveillance_14h30.jpg",
        type: "jpg",
        size: 1.8,
        uploadDate: "2024-06-10",
        status: "pending",
      },
    ],
    sources: [
      {
        id: "1",
        type: "surveillance",
        title: "Surveillance",
        description: "Système de caméras CCTV",
        reliability: "high",
        status: "active",
        details: {
          Type: "Caméras CCTV",
          Localisation: "Entrée principale",
          Qualité: "HD 1080p",
        },
      },
      {
        id: "2",
        type: "access",
        title: "Contrôle d'accès",
        description: "Système de badges RFID",
        reliability: "high",
        status: "alert",
        details: {
          Type: "Badge RFID",
          "Badge ID": "B-4578-2023",
          Statut: "Volé/Perdu",
        },
      },
      {
        id: "3",
        type: "witness",
        title: "Témoins",
        description: "Témoignages oculaires",
        reliability: "high",
        status: "active",
        details: {
          "Témoin 1": "Jean Dupont",
          "Témoin 2": "Marie Lambert",
          Fiabilité: "Élevée",
        },
      },
    ],
    observations: [
      {
        id: "1",
        title: "Analyse initiale de la scène",
        category: "inspection",
        priority: "medium",
        date: "2024-06-10",
        time: "15:30",
        description:
          "Première inspection de la zone d'intrusion. Aucun dommage matériel visible. Le système d'alarme a fonctionné correctement.",
        author: "Thomas Martin",
        status: "completed",
      },
      {
        id: "2",
        title: "Anomalie dans le système de sécurité",
        category: "security",
        priority: "high",
        date: "2024-06-10",
        time: "16:15",
        description:
          "Découverte d'une faille dans la procédure de désactivation des badges. Le badge volé aurait dû être automatiquement désactivé.",
        author: "Thomas Martin",
        status: "important",
      },
      {
        id: "3",
        title: "Mesures correctives appliquées",
        category: "correction",
        priority: "high",
        date: "2024-06-11",
        time: "09:00",
        description:
          "Mise à jour du protocole de sécurité. Désactivation immédiate automatisée des badges signalés. Formation du personnel effectuée.",
        author: "Thomas Martin",
        status: "resolved",
      },
    ],
  })

  getSurveyData() {
    return this.surveyData.asReadonly()
  }

  updateSurveyData(data: Partial<SurveyData>) {
    this.surveyData.update((current) => ({ ...current, ...data }))
  }

  addTestimony(testimony: Omit<Testimony, "id">) {
    const newTestimony: Testimony = {
      ...testimony,
      id: Date.now().toString(),
    }

    this.surveyData.update((current) => ({
      ...current,
      testimonies: [...current.testimonies, newTestimony],
    }))
  }

  addSource(source: Omit<Source, "id">) {
    const newSource: Source = {
      ...source,
      id: Date.now().toString(),
    }

    this.surveyData.update((current) => ({
      ...current,
      sources: [...current.sources, newSource],
    }))
  }

  addObservation(observation: Omit<Observation, "id">) {
    const newObservation: Observation = {
      ...observation,
      id: Date.now().toString(),
    }

    this.surveyData.update((current) => ({
      ...current,
      observations: [...current.observations, newObservation],
    }))
  }

  addDocument(document: Omit<Document, "id">) {
    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
    }

    this.surveyData.update((current) => ({
      ...current,
      documents: [...current.documents, newDocument],
    }))
  }

  saveDraft() {
    localStorage.setItem("survey_draft", JSON.stringify(this.surveyData()))
  }

  loadDraft() {
    const draft = localStorage.getItem("survey_draft")
    if (draft) {
      this.surveyData.set(JSON.parse(draft))
    }
  }
}
