import { EtatEnquete } from "@modules/admin/parametrage/etat-enquete/etat-enquete";

export interface Enquete {
  /** L'identifiant du modele */
  id: number;

  /** L'état */
  etat: EtatEnquete;

  /** La référence */
  reference: string;

  /** La progression */
  progression: number;

  /** La date de début (format ISO 8601 date-time) */
  dateDebut: string; // ou Date si tu veux travailler avec Date en TS

  /** La date de fin (format ISO 8601 date-time) */
  dateFin: string;

  /** La date de validation (format ISO 8601 date-time) */
  dateValidation: string;

  /** La date d'annulation (format ISO 8601 date-time) */
  dateAnnulation: string;

  /** La date de création (format ISO 8601 date-time) */
  createdAt: string;
}
