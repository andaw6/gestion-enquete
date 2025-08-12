import { EnqueteModel } from "./enquete.model";

export interface AutreInfoModel {

  readonly id: number;

  categorie: string;

  description: string;

  importance: number;

  createdAt: Date | null;

  updatedAt: Date | null;

  enquete: EnqueteModel;

}
