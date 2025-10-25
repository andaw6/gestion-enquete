import { CodeLibelle } from "./code-libelle.model";

export interface NotificationModel {
  readonly id: number;
  message: string;
  lu: boolean;
  urgent: boolean;
  type: CodeLibelle;
  utilisateurId: string;
  dateEnvoi: Date | null;
  dateLu: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}


export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  urgent: number;
}
