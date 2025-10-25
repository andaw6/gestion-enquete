export interface EnqueteurModel {
  readonly id: number
  nom: string
  prenom: string
  specialite: string
  disponible: boolean
  enquetesEnCours: number
}
