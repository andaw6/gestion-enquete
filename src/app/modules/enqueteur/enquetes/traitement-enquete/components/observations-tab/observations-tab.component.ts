
import { Component, inject, OnDestroy, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ObervationModalComponent } from "./components/observation-modal/observation-modal.component";
import { EnqueteStateService } from '@store/enquete/enquete-state.service';
import { AutreInfoModel, AutreInfoRequestData } from '@core/model/autre-info.model';
import { EnqueteModel } from '@core/model/enquete.model';
import { isAutreInfoModel } from '@core/util/function/autre-info.util';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { Pagination } from '@core/interfaces/pagination.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-observations-tab',
  standalone: true,
  imports: [CommonModule, ObervationModalComponent, PaginationComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './observations-tab.component.html',
  styleUrls: ['./observations-tab.component.css']
})
export class ObservationsTabComponent implements OnInit, OnDestroy {
  private readonly enqueteState = inject(EnqueteStateService);
  private subs = new Subscription();

  // état local
  enquete?: EnqueteModel;
  openModal = false;

  observations = signal<AutreInfoModel[]>([]);
  pagination = signal<Pagination>({
    page: 1,
    limit: 10,
    totalItem: 0,
    totalPage: 1
  });

  // computed — STRICTEMENT pur : retourne uniquement la slice
  paginatedObservations = computed(() => {
    const obs = this.observations();
    const { page, limit } = this.pagination();
    const start = (page - 1) * limit;
    const end = start + limit;
    return obs.slice(start, end);
  });

  private paginationEffect = effect(
    () => {
      const obs = this.observations();
      const p = this.pagination();
      const totalItem = obs.length;
      const totalPage = Math.max(1, Math.ceil(totalItem / p.limit));
      const currentPage = Math.min(p.page, totalPage);

      if (p.totalItem !== totalItem || p.totalPage !== totalPage || p.page !== currentPage) {
        this.pagination.update(s => ({
          ...s,
          totalItem,
          totalPage,
          page: currentPage
        }));
      }
    },
    { allowSignalWrites: true } // ✅ permet la mise à jour du signal dans l’effect
  );

    // Configuration des filtres
  filters = {
    searchTerm: '',
    categorie: '',
    etat: '',
    dateDebut: '',
    dateFin: '',
    sortBy: 'dateDesc'
  };

  // Données pour les filtres
  categories: string[] = [];
  etats: any[] = [];
    filteredObservations: any[] = [];




  ngOnInit(): void {
    // subscribe explicite au BehaviorSubject (garantit la première valeur)
    this.subs.add(
      this.enqueteState.enquete$.subscribe(enq => {
        if (enq) {
          this.enquete = enq;
          const obs = enq.autresInfos?.filter(a => a.categorie?.includes('observation-')) ?? [];
          this.observations.set(obs);
          // note: pas besoin d'ajuster pagination ici : l'effect s'en chargera
        } else {
          // si enquete est null, vider
          this.enquete = undefined;
          this.observations.set([]);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setPage(pg: Pagination): void {
    // on remplace uniquement les champs pertinents (préserver référence si besoin)
    this.pagination.set({
      page: pg.page,
      limit: pg.limit,
      totalItem: pg.totalItem ?? this.pagination().totalItem,
      totalPage: pg.totalPage ?? this.pagination().totalPage
    });
    // computed + effect prendront le relais
  }

  savedData(event: { data: AutreInfoModel | AutreInfoRequestData; action: "create" | "update" }) {
    if (!isAutreInfoModel(event.data)) return;

    const model = event.data as AutreInfoModel;
    if (event.action === 'create') {
      this.enqueteState.addAutreInfo(model);
    } else {
      this.enqueteState.updateAutreInfo(model);
    }
    // L'enquete$ du service émettra => subscription mettra à jour `observations`
  }

  onEdit(observation: any): void {
    // Logique de modification
    console.log('Modifier observation:', observation);
    // Exemple: ouvrir un modal ou naviguer vers un formulaire
    // this.router.navigate(['/observations/edit', observation.id]);
  }

  onDelete(observation: any): void {
    // Demander confirmation avant suppression
    if (confirm(`Voulez-vous vraiment supprimer l'observation "${observation.objet}" ?`)) {
      // Logique de suppression
      console.log('Supprimer observation:', observation);
      // Exemple: appeler un service
      // this.observationService.delete(observation.id).subscribe(() => {
      //   this.loadObservations();
      // });
    }
  }

  // Helpers UI (inchangés)
  getBgColor(obs: AutreInfoModel): string { /* ... */
    switch (obs.importance) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-red-500';
      default: return 'bg-primary-500';
    }
  }

  getBadgeClass(obs: AutreInfoModel): string { /* ... */
    switch (obs.importance) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  }

  getIcon(obs: AutreInfoModel): string { /* ... */
    switch (obs.importance) {
      case 1: return 'fas fa-check-circle';
      case 2: return 'fas fa-exclamation-triangle';
      case 3: return 'fas fa-times-circle';
      default: return 'fas fa-sticky-note';
    }
  }

  trackByObservationId(index: number, document: AutreInfoModel): any {
    return document.id ?? index;
  }
}
