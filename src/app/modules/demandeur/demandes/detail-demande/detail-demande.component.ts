import { Component, computed, Input, Signal, signal, WritableSignal } from '@angular/core';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';
import { Logger } from '@core/services/logger.service';
import { EntityLoaderComponent, LoadingError } from '@shared/components/entity-loader/entity-loader.component';
import { PageHeader1Component, PageHeaderConfig } from '@shared/components/page-header-1/page-header-1.component';
import { DemandeService } from '../demande.service';
import { firstValueFrom } from 'rxjs';
import { formatDate } from '@core/util/function/date-formatter.util';
import { CommonModule, NgIf } from '@angular/common';
import { DemandeStatusIndicatorsComponent } from '../components/demande-status-indicators/demande-status-indicators.component';
import { DemandeConcerneInfoComponent } from '../components/demande-concerne-info/demande-concerne-info.component';
import { DemandeSummaryComponent } from '../components/demande-summary/demande-summary.component';
import { DemandeDescriptionDetailsComponent } from '../components/demande-description-details/demande-description-details.component';
import { DemandeDocumentsSectionComponent } from '../components/demande-documents-section/demande-documents-section.component';
import { DemandeTimelineComponent } from '../components/demande-timeline/demande-timeline.component';
import { DemandeQuickActionsComponent } from '../components/demande-quick-actions/demande-quick-actions.component';

@Component({
  selector: 'app-detail-demande',
  templateUrl: './detail-demande.component.html',
  styleUrls: ['./detail-demande.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    PageHeader1Component,
    EntityLoaderComponent,
    DemandeStatusIndicatorsComponent,
    DemandeConcerneInfoComponent,
    DemandeSummaryComponent,
    DemandeDescriptionDetailsComponent,
    DemandeDocumentsSectionComponent,
    DemandeTimelineComponent,
    DemandeQuickActionsComponent,
    NgIf,
  ],
})
export class DetailDemandeComponent {

  demande: WritableSignal<DemandeEnqueteModel | null> = signal<DemandeEnqueteModel | null>(null);
  failLoading: WritableSignal<boolean> = signal<boolean>(false);
  loading: WritableSignal<boolean> = signal<boolean>(false);
  headerConfig = computed<PageHeaderConfig>(() => {
    Logger.info("changement headerConfig", "DetailDemandeComponent");

    const demande = this.demande();
    const loading = this.loading();

    const config: PageHeaderConfig = {
      title: "Détails de la Demande d'Enquête",
      subtitle: "Aucun demande n'a été trouvé",
      buttons: []
    };

    if (loading) {
      config.subtitle = "Chargement des données....";
    } else if (demande) {
      config.subtitle = `Référence: ${demande.reference}  Créée le: ${formatDate(demande.createdAt)}`;
      config.buttons = [
        { label: 'Valider', icon: 'fas fa-plus', type: 'primary', action: () => { } },
        { label: 'Modifier', icon: 'fas fa-download', type: 'secondary', action: () => { } },
      ];
    }

    return config;
  });



  constructor(
    private service: DemandeService,
  ) {
  }


  onQuickAction(action: string) {
    console.log("Action rapide:", action)
  }


  loadDemande = (id: number): Promise<DemandeEnqueteModel | null> =>
    firstValueFrom(this.service.getOne(id));

  goBack = history.back;

  onDemandeLoaded(data: DemandeEnqueteModel | null) {
    Logger.info({ message: "Changement de donnée", data }, "DetailDemandeComponent:onDemandeLoaded");
    this.demande.set(data);
  }

  onLoadingStateChanged(isLoading: boolean) {
    this.loading.set(isLoading)
  }

  onLoadingError(err: LoadingError | null) {
    this.failLoading.set(!!err);
  }

}
