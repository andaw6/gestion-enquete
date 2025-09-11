import { Injectable } from '@angular/core';
import { UtilisateurModel } from '@core/model/utilisateur.model';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UtilisateurState {
  user: UtilisateurModel | null;
  loading: boolean;
  error: any;
}

@Injectable({ providedIn: 'root' })
export class UtilisateurStateService {
  private initialState: UtilisateurState = {
    user: null,
    loading: false,
    error: null,
  };

  private _state$ = new BehaviorSubject<UtilisateurState>(this.initialState);

  readonly state$ = this._state$.asObservable();

  // --- SELECTORS ---
  readonly user$ = this.state$.pipe(map(state => state.user));
  readonly isAuthenticated$ = this.user$.pipe(map(user => !!user));
  readonly userRole$ = this.user$.pipe(map(user => user?.role ?? "demandeur"));
  readonly loading$ = this.state$.pipe(map(state => state.loading));
  readonly error$ = this.state$.pipe(map(state => state.error));

  // --- ACTIONS ---
  loadUser() {
    this._setState({ loading: true, error: null });
  }

  loadUserSuccess(user: UtilisateurModel) {
    this._setState({ user, loading: false, error: null });
  }

  loadUserFailure(error: any) {
    this._setState({ loading: false, error });
  }

  logout() {
    this._state$.next(this.initialState);
  }

  // --- HELPER ---
  private _setState(partial: Partial<UtilisateurState>) {
    this._state$.next({
      ...this._state$.value,
      ...partial,
    });
  }
}
