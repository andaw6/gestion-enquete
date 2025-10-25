import { Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { NotificationComponent } from './components/notification/notification.component';
import { ProgressStepperComponent } from './components/progress-stepper/progress-stepper.component';
import { SuivieComponent } from './components/suivie/suivie.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { NotificationService, SurveyService } from './test';
import { EnqueteModel } from '@core/model/enquete.model';
import { EntityLoaderComponent, LoadingError } from "@shared/components/entity-loader/entity-loader.component";
import { firstValueFrom } from 'rxjs';
import { EnqueteService } from '../enquete.service';
import { Logger } from '@core/services/logger.service';
import { ProgressSectionComponent } from "@modules/demandeur/demandes/enquete-detatil/components/progress-section/progress-section.component";
import { EnqueteStateService } from '@store/enquete/enquete-state.service';

@Component({
  selector: 'app-traitement-enquete',
  standalone: true,
  imports: [
    CommonModule,
    NotificationComponent,
    ProgressStepperComponent,
    HeroSectionComponent,
    SuivieComponent,
    TabsComponent,
    EntityLoaderComponent,
    NgIf,
    ProgressSectionComponent
  ],
  templateUrl: './traitement-enquete.component.html',
  styleUrls: ['./traitement-enquete.component.css']
})
export class TraitementEnqueteComponent implements OnDestroy {
  private surveyService = inject(SurveyService)
  private notificationService = inject(NotificationService)
  enquete = signal<EnqueteModel | null>(null);
  failLoading = signal<boolean>(false);
  loading = signal<boolean>(false);
  private service = inject(EnqueteService);
  private enqueteState = inject(EnqueteStateService);


  ngOnDestroy(): void {
    this.enqueteState.clearEnquete();
  }


  loadData = (id: number): Promise<EnqueteModel | null> =>
    firstValueFrom(this.service.getOne(id));

  goBack = () => history.back();

  onLoaded(data: EnqueteModel | null) {
    Logger.info({ message: "Changement de donnée", data }, "TraitementEnqueteComponent:onLoad");
    this.enquete.set(data);
    this.enqueteState.clearEnquete();
    if (!!data) {
      this.enqueteState.loadEnquete(data!);
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


  ngOnInit() {
    // Charger le brouillon s'il existe
    this.surveyService.loadDraft()

    // Raccourcis clavier
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault()
            this.saveDraft()
            break
          case "p":
            e.preventDefault()
            this.previewReport()
            break
          case "f":
            e.preventDefault()
            this.finalizeInvestigation()
            break
        }
      }
    })

    this.notificationService.show("Interface chargée", "Prêt pour la collecte de données", "success")
  }

  saveDraft() {
    this.surveyService.saveDraft()
    this.notificationService.show("Brouillon sauvegardé", "Toutes les données ont été sauvegardées", "success")
  }

  previewReport() {
    this.notificationService.show("Génération du rapport", "Préparation de l'aperçu...", "info")
    setTimeout(() => {
      this.notificationService.show("Aperçu prêt", "Le rapport est disponible en prévisualisation", "success")
    }, 2000)
  }

  finalizeInvestigation() {
    if (confirm("Êtes-vous sûr de vouloir finaliser cette enquête ? Cette action est irréversible.")) {
      this.notificationService.show("Enquête finalisée", "L'enquête a été clôturée et le rapport généré", "success")

      setTimeout(() => {
        this.notificationService.show("Redirection", "Retour au tableau de bord...", "info")
      }, 3000)
    }
  }
}
