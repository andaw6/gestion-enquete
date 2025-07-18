import { Directive, signal, ViewChild } from '@angular/core';
import { EntityType } from "@core/interfaces/entity-type.interface";
import { GenericCrudComponent } from "@shared/components/generic-crud/generic-crud.component";
import { Observable, of } from "rxjs";
import { Pagination } from "@core/interfaces/pagination.interface";
import { SessionService } from "@core/services/session.service";
import { NotificationAlertService } from "@core/services/notification-alert.service";
import { map } from "rxjs/operators";
import { ResponseError } from "@core/interfaces/response-error.interface";
import { ApiResponse } from "@core/interfaces/api-response.interface";
import {ApiCrudService} from "@core/api/api-crud.service";

/**
 * Interface représentant les données du formulaire de création / mise à jour
 */
interface FormEventData {
  code: string;
  libelle: string;
}

/**
 * Directive de base générique pour les composants CRUD.
 * À étendre par une directive spécifique à chaque entité.
 */
@Directive({
  // Pas de selector : directive abstraite non utilisée directement dans un template
})
export abstract class BaseCrudDirective<T extends EntityType> {

  @ViewChild('crudComponent') crudComponent!: GenericCrudComponent<T>;

  abstract readonly paginationKey: string;
  abstract service: ApiCrudService<T>;

  data$: Observable<T[]> = of([]);
  loading = signal(false);
  isSubmitting = false;
  existingCodes: string[] = [];

  pagination: Pagination = {
    page: 1,
    limit: 10,
    totalItem: 0,
    totalPage: 0,
  };

  protected constructor(
    protected sessionService: SessionService,
    protected notificationService: NotificationAlertService
  ) {}

  /**
   * Méthode d'initialisation à appeler depuis le composant parent
   */
  init(): void {
    if (typeof window !== 'undefined') {
      this.pagination.limit = this.sessionService.getData<number>(this.paginationKey) ?? 10;
    }
    this.loadData();
  }

  /**
   * Chargement des données avec la pagination actuelle
   */
  protected loadData(): void {
    this.loading.set(true);
    this.service
      .getAll({ ...this.pagination, sort: ['libelle'] })
      .subscribe({
        next: (response: ApiResponse<T>) => {
          this.data$ = of(response.data);
          this.pagination = response.pagination;
          this.existingCodes = response.data.map((item) => item.code);
          this.loading.set(false);
        },
        error: (err: ResponseError) => {
          console.error(err);
          this.notificationService.showNotification('Erreur de chargement', 'error');
          this.loading.set(false);
        },
      });
  }

  /**
   * Lors du changement de page (ou de limite)
   */
  onPageChanged(event: { pagination: Pagination }): void {
    this.pagination = event.pagination;
    this.sessionService.saveData(this.paginationKey, this.pagination.limit);
    this.loadData();
  }

  /**
   * Lorsqu'on charge les données depuis le composant CRUD
   */
  onLoadData(event: { pagination: Pagination }): void {
    this.pagination = event.pagination;
    this.loadData();
  }

  /**
   * Création d’un nouvel élément
   */
  onCreateItem(event: FormEventData): void {
    this.isSubmitting = true;
    this.service.create(event).subscribe({
      next: (newItem: T) => {
        this.data$ = this.data$.pipe(map((items) => [newItem, ...items]));
        this.existingCodes.push(newItem.code);
        this.notificationService.showNotification('Créé avec succès', 'success');
        this.crudComponent.closeModal();
        this.isSubmitting = false;
      },
      error: (err: ResponseError) => {
        this.notificationService.showNotification(err.message || 'Erreur lors de la création', 'error');
        this.isSubmitting = false;
      },
    });
  }

  /**
   * Mise à jour d’un élément existant
   */
  onUpdateItem(event: { id: number; data: FormEventData }): void {
    this.isSubmitting = true;
    this.service.update(event.id, event.data).subscribe({
      next: (updatedItem: T) => {
        this.data$ = this.data$.pipe(
          map((items) => items.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
        );
        this.updateExistingCodes(updatedItem);
        this.notificationService.showNotification('Mis à jour avec succès', 'success');
        this.crudComponent.closeModal();
        this.isSubmitting = false;
      },
      error: (err: ResponseError) => {
        this.notificationService.showNotification(err.message || 'Erreur lors de la mise à jour', 'error');
        this.isSubmitting = false;
      },
    });
  }

  /**
   * Suppression d’un élément
   */
  onDeleteItem(event: { id: number }): void {
    this.service.deleteOne(event.id).subscribe({
      next: () => {
        this.data$ = this.data$.pipe(map((items) => items.filter((item) => item.id !== event.id)));
        this.notificationService.showNotification('Supprimé avec succès', 'success');
      },
      error: (err: ResponseError) => {
        this.notificationService.showNotification(err.message || 'Erreur lors de la suppression', 'error');
      },
    });
  }

  /**
   * Met à jour les codes existants (si nécessaire)
   * Tu peux personnaliser cette méthode si tu veux filtrer/mettre à jour localement
   */
  protected updateExistingCodes(updatedItem: T): void {
    const index = this.existingCodes.findIndex(code => code === updatedItem.code);
    if (index === -1) {
      this.existingCodes.push(updatedItem.code);
    }
  }
}
