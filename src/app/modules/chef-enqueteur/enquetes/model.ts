export interface AssignmentData {
  enqueteurId: number
  dateLimite: string
  instructions: string
}


export interface StatsEnqueteur {
  nonAssignees: number
  urgentes: number
  enqueteursLibres: number
  aujourdhui: number
}


export interface FilterCriteria {
  searchTerm: string
  priorite: string
  type: string
}
