import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnqueteModel } from '@core/model/enquete.model';
import { AutreInfoModel } from '@core/model/autre-info.model';
import { SourceInfoModel } from '@core/model/source-info.model';
import { ConclusionModel } from '@core/model/conclusion.model';
import { DocumentModel } from '@core/model/document.model';
import { EnqueteService } from '@modules/enqueteur/enquetes/enquete.service';
import { Logger } from '@core/services/logger.service';

export interface EnqueteState {
  enquete: EnqueteModel | null;
  loading: boolean;
  error: any;
}

@Injectable({ providedIn: 'root' })
export class EnqueteStateService {
  private initialState: EnqueteState = {
    enquete: null,
    loading: false,
    error: null,
  };

  private _state$ = new BehaviorSubject<EnqueteState>(this.initialState);

  readonly state$ = this._state$.asObservable();
  enqueteService = inject(EnqueteService)

  // --- SELECTORS ---
  readonly enquete$ = this.state$.pipe(map(state => state.enquete));
  readonly autresInfos$ = this.enquete$.pipe(map(enq => enq?.autresInfos ?? []));
  readonly sourcesInfos$ = this.enquete$.pipe(map(enq => enq?.sourcesInfos ?? []));
  readonly conclusions$ = this.enquete$.pipe(map(enq => enq?.conclusions ?? []));
  readonly documents$ = this.enquete$.pipe(map(enq => enq?.documents ?? []));
  readonly loading$ = this.state$.pipe(map(state => state.loading));
  readonly error$ = this.state$.pipe(map(state => state.error));

  // --- ACTIONS ---
  loadEnquete(enquete: EnqueteModel) {
    this._setState({ enquete, loading: false, error: null });
  }

  // updateProgession(progression: number) {
  //   const enquete = this._state$.value.enquete;
  //   if (!enquete) return;
  //   Logger.info({
  //     message: "Update progession", data: {
  //       enquete,
  //       progression
  //     }
  //   })
  //   this.enqueteService.updateProgression(enquete.id, progression).subscribe({
  //     next: (response) => {
  //       Logger.info({ message: "La progression de l'enquête à bien été mis à jour", data: { response, enquete } }, "EnqueteStateService:updateProgession");
  //       this._setState({ enquete: { ...enquete, progression } })
  //     },
  //     error: (err) => {
  //       Logger.error({ message: "Erreur lors de la mis à jour de la progression de l'enquête", data: err }, "EnqueteStateService:updateProgession")
  //     }
  //   })
  // }
  updateProgession(progression: number) {
    const enquete = this._state$.value.enquete;
    if (!enquete) return;

    Logger.info({
      message: "Mise à jour de la progression de l’enquête",
      data: { enqueteId: enquete.id, progression }
    });

    // On met l'état en "chargement"
    this._setState({ loading: true, error: null });

    this.enqueteService.updateProgression(enquete.id, progression).subscribe({
      next: (response) => {
        const updatedEnquete: EnqueteModel = {
          ...enquete,
          progression: response.progression ?? progression, // <-- priorité à la valeur renvoyée par le backend
          updatedAt: new Date()
        };

        this._setState({
          enquete: updatedEnquete,
          loading: false,
          error: null
        });

        Logger.info(
          {
            message: "Progression mise à jour avec succès",
            data: updatedEnquete
          },
          "EnqueteStateService:updateProgression"
        );
      },
      error: (err) => {
        this._setState({ loading: false, error: err });
        Logger.error(
          {
            message: "Erreur lors de la mise à jour de la progression de l’enquête",
            data: err
          },
          "EnqueteStateService:updateProgression"
        );
      }
    });
  }


  // === AUTRES INFOS ===
  addAutreInfo(autreInfo: AutreInfoModel) {
    this._updateCollection('autresInfos', autreInfo, 'add');
  }

  updateAutreInfo(autreInfo: AutreInfoModel) {
    this._updateCollection('autresInfos', autreInfo, 'update');
  }

  deleteAutreInfo(autreInfoId: number) {
    this._updateCollection('autresInfos', { id: autreInfoId }, 'delete');
  }


  // === SOURCES D’INFORMATION ===
  addSourceInfo(source: SourceInfoModel) {
    this._updateCollection('sourcesInfos', source, 'add');
  }

  updateSourceInfo(source: SourceInfoModel) {
    this._updateCollection('sourcesInfos', source, 'update');
  }

  deleteSourceInfo(sourceId: number) {
    this._updateCollection('sourcesInfos', { id: sourceId }, 'delete');
  }

  // === CONCLUSIONS ===
  addConclusion(conclusion: ConclusionModel) {
    this._updateCollection('conclusions', conclusion, 'add');
  }

  updateConclusion(conclusion: ConclusionModel) {
    this._updateCollection('conclusions', conclusion, 'update');
  }

  deleteConclusion(conclusionId: number) {
    this._updateCollection('conclusions', { id: conclusionId }, 'delete');
  }

  // === DOCUMENTS ===
  addDocument(document: DocumentModel) {
    this._updateCollection('documents', document, 'add');
  }

  updateDocument(document: DocumentModel) {
    this._updateCollection('documents', document, 'update');
  }

  deleteDocument(documentId: number) {
    this._updateCollection('documents', { id: documentId }, 'delete');
  }

  clearEnquete() {
    this._setState({ enquete: null, loading: false, error: null });
  }

  // --- HELPERS ---
  private _updateCollection<K extends keyof EnqueteModel>(
    key: K,
    item: any,
    action: 'add' | 'update' | 'delete'
  ) {
    const enquete = this._state$.value.enquete;
    if (!enquete) return;

    const current = (enquete[key] as any[]) ?? [];

    let updated: any[];
    switch (action) {
      case 'add':
        updated = [item, ...current];
        break;
      case 'update':
        updated = current.map(el => (el.id === item.id ? { ...el, ...item } : el));
        break;
      case 'delete':
        updated = current.filter(el => el.id !== item.id);
        break;
    }

    const updatedEnquete = { ...enquete, [key]: updated };
    this._setState({ enquete: updatedEnquete });
  }

  private _setState(partial: Partial<EnqueteState>) {
    this._state$.next({
      ...this._state$.value,
      ...partial,
    });
  }
}
