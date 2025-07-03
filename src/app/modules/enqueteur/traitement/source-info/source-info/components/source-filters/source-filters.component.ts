import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {forkJoin} from "rxjs";
import {EtatSourceService} from "@modules/enqueteur/traitement/source-info/etat-source.service";
import {TypeSourceService} from "@modules/admin/parametrage/type-source/type-source.service";
import {EtatSourceInfo} from "@modules/enqueteur/traitement/source-info/source-info";
import {TypeSource} from "@modules/admin/parametrage/type-source/type-source";
import {NotificationAlertService} from "@core/services/notification-alert.service";
import {Option} from "@core/interfaces/option.interface";
import {RELIABILITY_LEVELS, SOURCE_INFO_TRI} from "@config/constant";

@Component({
  selector: 'app-source-filters',
  templateUrl: './source-filters.component.html',
  styleUrls: ['./source-filters.component.css']
})
export class SourceFiltersComponent implements OnInit {
  @Output() filtersChange = new EventEmitter<any>()
  readonly reliabilityLevels: Option[] = RELIABILITY_LEVELS;
  readonly sourceInfoTrie:Option[] = SOURCE_INFO_TRI;

  searchTerm = ""
  selectedEtat = ""
  selectedType = ""
  selectedReliability = ""
  sortBy = "date"

  etatSources: EtatSourceInfo[] = [];
  typeSources: TypeSource[] = [];

  constructor(
    private etatSourceService: EtatSourceService,
    private typeSourceService: TypeSourceService,
    private notificationService: NotificationAlertService,
  ) {
  }

  onSearchChange() {
    this.emitFilters()
  }

  onFilterChange() {
    this.emitFilters()
  }

  private emitFilters() {
    this.filtersChange.emit({
      searchTerm: this.searchTerm,
      type: this.selectedType,
      etat: this.selectedEtat,
      reliability: this.selectedReliability,
      sortBy: this.sortBy,
    })
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
  }
}
