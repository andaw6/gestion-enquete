import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {forkJoin} from "rxjs";
import {EtatSourceService} from "@modules/enqueteur/traitement/source-info/etat-source.service";
import {TypeSourceService} from "@modules/admin/parametrage/type-source/type-source.service";
import {EtatSourceInfo, SourceFiltersOption} from "@modules/enqueteur/traitement/source-info/source-info";
import {TypeSource} from "@modules/admin/parametrage/type-source/type-source";
import {NotificationAlertService} from "@core/services/notification-alert.service";
import {Option} from "@core/interfaces/option.interface";
import {RELIABILITY_LEVELS, SOURCE_INFO_TRI} from "@config/constant";
import {FormControl} from "@angular/forms";
import {UtilService} from "@core/services/util.service";

@Component({
  selector: 'app-source-filters',
  templateUrl: './source-filters.component.html',
  styleUrls: ['./source-filters.component.css']
})
export class SourceFiltersComponent implements OnInit {
  @Output() filtersChange = new EventEmitter<SourceFiltersOption>()
  readonly reliabilityLevels: Option[] = RELIABILITY_LEVELS.map(d => d as Option);
  readonly sourceInfoTrie: Option[] = SOURCE_INFO_TRI.map(d => d as Option);

  @Input() filter: SourceFiltersOption = {
    searchTerm: "",
    etatCode: "",
    typeCode: "",
    niveauFiabilite: "",
    sortBy: "date"
  }

  etatSources: EtatSourceInfo[] = [];
  typeSources: TypeSource[] = [];

  constructor(
    private etatSourceService: EtatSourceService,
    private typeSourceService: TypeSourceService,
    private notificationService: NotificationAlertService,
    private utilService: UtilService,
  ) {
  }

  searchControl = new FormControl('');

  private setupSearchListener(): void {
    this.utilService.setupSearchListener(this.searchControl, query => {
      this.filter.searchTerm = query;
      this.onFilterChange();
    });
  }

  onSearchChange() {
    this.emitFilters()
  }

  onFilterChange() {
    this.emitFilters()
  }

  private emitFilters() {
    this.filtersChange.emit(this.filter);
  }


  loadData(): void {
    forkJoin({
      etat: this.etatSourceService.getAll(),
      type: this.typeSourceService.getAll(),
    }).subscribe({
      next: ({etat, type}) => {
        this.etatSources = etat.data;
        this.typeSources = type.data;
      },
      error: (err) => {
        console.error(err);
        this.notificationService.showNotification("Erreur lors du chargement des donnés", "error");
      }
    })
  }

  ngOnInit(): void {
    this.loadData();
    this.setupSearchListener();
  }
}
