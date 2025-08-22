import { CommonModule, DatePipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, signal, TemplateRef, ViewContainerRef, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResponseError } from '@core/interfaces/response-error.interface';

export interface LoadingError {
  code: string;
  message: string;
  details?: string;
  timestamp: Date;
  retryable: boolean;
}


@Component({
  selector: 'app-entity-loader',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgTemplateOutlet,
    DatePipe
  ],
  templateUrl: './entity-loader.component.html',
  styleUrls: ['./entity-loader.component.css']
})
export class EntityLoaderComponent<T> {
  // Fonction de chargement des données
  @Input({ required: true }) fetchDataFn!: (id: number) => Promise<T>;

  // Template personnalisé (optionnel)
  @ContentChild(TemplateRef) customTemplateRef?: TemplateRef<any>;

  // Méthodes et fonctions auxiliaires
  @Input() validateIdFn: (id: string | null) => boolean = id => !!id;
  @Input() extractIdFn: (params: any) => string | null = params => params.get('id');
  @Input() errorMessages: Record<string, string> = {
    404: 'Ressource introuvable.',
    403: 'Accès refusé.',
    500: 'Erreur interne.',
    0: 'Problème de réseau.',
    UNKNOWN: 'Erreur inconnue.'
  };
  @Output() goBack = new EventEmitter<void>();
  @Output() dataLoaded = new EventEmitter<T>();
  @Output() loadingState = new EventEmitter<boolean>();
  @Output() errorState = new EventEmitter<LoadingError | null>();


  // État
  data: WritableSignal<T | null> = signal(null);
  id: WritableSignal<string> = signal('');
  loading = signal(false);
  failLoading = signal(false);
  loadingError = signal<LoadingError | null>(null);
  isReloading = signal(false);
  retryCount = signal(0);
  showRetryNotification = signal(false);
  technicalDetailsExpanded = signal(false);

  constructor(
    private route: ActivatedRoute,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = this.extractIdFn(params);
      if (this.validateIdFn(id)) {
        this.id.set(id!);
        this.loadData();
      } else {
        this.handleInvalidId();
      }
    });
  }

  loadData(): void {
    const id = Number(this.id());
    this.setLoadingState(true);

    this.fetchDataFn(id)
      .then(data => this.setSuccessState(data))
      .catch(err => this.handleError(err))
      .finally(() => this.loading.set(false));
  }

  // Méthodes d'action utilisateur
  reloadData(): void {
    if (this.isReloading()) return;

    this.isReloading.set(true);
    this.technicalDetailsExpanded.set(false);

    setTimeout(() => {
      this.loadData();
      this.isReloading.set(false);
    }, 500); // Petit délai pour l'UX
  }

  retryUpdate(): void {
    this.showRetryNotification.set(false);
    this.reloadData();
  }

  showTechnicalDetails(): boolean {
    return this.retryCount() >= 2; // Afficher après 2 échecs
  }

  errorMessage(): string {
    const error = this.loadingError();
    return error ? error.message : 'Une erreur inattendue s\'est produite.';
  }

  errorCode(): string {
    return this.loadingError()?.code || 'UNKNOWN';
  }

  errorTimestamp(): Date {
    return this.loadingError()?.timestamp || new Date();
  }

  dismissRetryNotification(): void {
    this.showRetryNotification.set(false);
  }

  private setSuccessState(data: T): void {
    this.data.set(data);
    this.dataLoaded.emit(data);
    this.loadingError.set(null);
    this.failLoading.set(false);
    this.errorState.emit(null);
  }

  private handleError(err: ResponseError): void {
    const code = err.status?.toString() || 'UNKNOWN';
    const message = this.errorMessages[code] || "UNKNOWN";
    this.loadingError.set({
      code,
      message,
      details: err.message || 'Erreur lors du chargement',
      timestamp: new Date(),
      retryable: true
    });
    this.failLoading.set(true);
    this.errorState.emit(this.loadingError());
  }

  private handleInvalidId(): void {
    this.loadingError.set({
      code: 'INVALID_ID',
      message: 'ID invalide ou manquant.',
      details: 'Vérifiez l’URL.',
      timestamp: new Date(),
      retryable: false
    });
    this.failLoading.set(true);
  }

  private setLoadingState(value: boolean): void {
    this.loading.set(value);
    this.loadingState.emit(value);
    if (value) {
      this.failLoading.set(false);
      this.showRetryNotification.set(false);
    }
  }

  reload(): void {
    if (this.isReloading()) return;
    this.isReloading.set(true);
    setTimeout(() => {
      this.loadData();
      this.isReloading.set(false);
    }, 300);
  }

  toggleTechnicalDetails(): void {
    this.technicalDetailsExpanded.update(x => !x);
  }



}
