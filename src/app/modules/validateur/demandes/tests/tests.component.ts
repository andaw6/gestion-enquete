import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemandeService } from '@modules/demandeur/demandes/demande.service';
import { ToastService } from '@core/services/toast.service';
import { IParams } from '@core/interfaces/http-options.interface';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';
import { Pagination } from '@core/interfaces/pagination.interface';

@Component({
  selector: 'app-tests',
  standalone: true,
  imports: [
    CommonModule,
    StatsCardsComponent,
    FiltersComponent,
    DemandesTableComponent,
    DetailModalComponent
  ],
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent {
  demandes: DemandeEnqueteModel[] = [];
  filteredDemandes: DemandeEnqueteModel[] = [];
  selectedDemande: DemandeEnqueteModel | null = null;
  isModalOpen = false;

  stats: StatsData = {
    enAttente: 0,
    approuvees: 0,
    rejetees: 0,
    total: 0,
    aujourdhui: 0,
    semaine: 0,
    mois: 0
  };

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  private filters: FilterData = {
    statut: '',
    typeConcerne: '',
    demandeur: '',
    dateDebut: null,
    dateFin: null
  };

  private searchQuery = '';

  constructor(
    private readonly demandeService: DemandeService,
    private readonly toastService: ToastService,
  ) { }

  loadDemandes(filter: IParams = {}) {
    this.demandeService.getAll({})
  }
}
