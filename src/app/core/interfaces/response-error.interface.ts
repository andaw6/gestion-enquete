import { HttpErrorResponse } from "@angular/common/http";

/**
 * Format commun pour véhiculer les erreurs HTTP dans l'application.
 */
export interface ResponseError {
  /** Message exploitable pour un toast ou une boîte de dialogue. */
  message: string;
  /** Erreur originale retournée par Angular. */
  original: HttpErrorResponse;
  /** Code d'état HTTP (200‑599). */
  status: number;
}
