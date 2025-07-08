import {EntityType} from "@core/interfaces/entity-type.interface";

export interface EtatDemande extends EntityType{}

export type EtatDemandeData = Pick<EtatDemande, 'code' | 'libelle'>;
