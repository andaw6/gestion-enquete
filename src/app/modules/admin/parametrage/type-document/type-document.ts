import {EntityType} from "@core/interfaces/entity-type.interface";

export interface TypeDocument extends EntityType {}

export type TypeDocumentData = Pick<TypeDocument, 'code' | 'libelle'>;
