import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnqueteModel } from '@core/model/enquete.model';
import { AutreInfoModel } from '@core/model/autre-info.model';
import { SourceInfoModel } from '@core/model/source-info.model';
import { ConclusionModel } from '@core/model/conclusion.model';
import { DocumentModel } from '@core/model/document.model';

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
