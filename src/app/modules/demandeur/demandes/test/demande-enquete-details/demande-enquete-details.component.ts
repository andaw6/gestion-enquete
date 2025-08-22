import { Component, computed, signal, WritableSignal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';
import { InformationsGeneralesComponent } from "../components/informations-generales/informations-generales.component";
import { PersonneConcerneeComponent } from "../components/personne-concernee/personne-concernee.component";
import { DocumentsComponent } from "../components/documents/documents.component";
import { DemandeSidebarComponent } from "../components/demande-sidebar/demande-sidebar.component";
import { DemandeService } from '../../demande.service';
import { firstValueFrom } from 'rxjs';
import { Logger } from '@core/services/logger.service';
import { EntityLoaderComponent, LoadingError } from '@shared/components/entity-loader/entity-loader.component';
import { PageHeader1Component, PageHeaderConfig } from '@shared/components/page-header-1/page-header-1.component';
import { formatDate } from '@core/util/function/date-formatter.util';
import { BreadcrumbComponent, BreadcrumbItem } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-demande-enquete-details',
  standalone: true,
  imports: [
    CommonModule,
    InformationsGeneralesComponent,
    PersonneConcerneeComponent,
    DocumentsComponent,
    DemandeSidebarComponent,
    EntityLoaderComponent,
    PageHeader1Component,
    NgIf,
    BreadcrumbComponent
  ],
  templateUrl: './demande-enquete-details.component.html',
  styleUrls: ['./demande-enquete-details.component.css']
})
export class DemandeEnqueteDetailsComponent {
  demande: WritableSignal<DemandeEnqueteModel | null> = signal<DemandeEnqueteModel | null>(null);
  failLoading: WritableSignal<boolean> = signal<boolean>(false);
  loading: WritableSignal<boolean> = signal<boolean>(false);

  breadcrumbItems = computed<BreadcrumbItem[]>(() => [
    {
      label: 'Accueil',
      url: "/demandeur",
      icon: 'fas fa-home'
    },
    {
      label: 'Tous mes demandes',
      url: "/demandeur/demandes",
    },
    {
      label: this.demande() ? `${this.demande()!.reference}` : 'Chargement...',
      url: '',
      active: true,
    },
  ]);

  headerConfig = computed<PageHeaderConfig>(() => {
    Logger.info("changement headerConfig", "DetailDemandeComponent");

    const demande = this.demande();
    const loading = this.loading();

    const config: PageHeaderConfig = {
      title: "Détails de la Demande d'Enquête",
      subtitle: "Aucun demande n'a été trouvé",
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


  loadDemande = (id: number): Promise<DemandeEnqueteModel | null> =>
    firstValueFrom(this.service.getOne(id));

  goBack = history.back;

  onDemandeLoaded(data: DemandeEnqueteModel | null) {
    Logger.info({ message: "Changement de donnée", data }, "DetailDemandeComponent:onDemandeLoaded");
    this.demande.set(data);
    if (!!data) {
      this.loading.set(false);
      this.failLoading.set(false);
    }
  }

  onLoadingStateChanged(isLoading: boolean) {
    Logger.info({ message: "Changement de l'état du chargement", data: isLoading }, "DemandeEnqueteDetailsComponent:onLoadingStateChanged")
    this.loading.set(isLoading)
  }

  onLoadingError(err: LoadingError | null) {
    this.failLoading.set(!!err);
  }

  onModifier(): void {

  }

  onCreerEnquete(): void {

  }
}
