export type TypeConcerne = "employeur" | "beneficiaire" | "travailleur";

export interface ConcerneModel {
  readonly id: number;
  type: TypeConcerne;
  telephone: string;
  regionSocial: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ConcerneData {
  type: TypeConcerne;
  numero: string;
  regionSocial: string;
}
