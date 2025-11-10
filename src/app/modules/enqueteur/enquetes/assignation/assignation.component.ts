import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule, NgClass, NgForOf, NgIf, } from '@angular/common';
import { EnqueteEtatEnquete, EnqueteModel, EnqueteStatEtat } from '@core/model/enquete.model';
import { EnqueteService } from '../enquete.service';
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { EnqueteCardComponent } from "./components/enquete-card/enquete-card.component";
import { DocumentModel } from '@core/model/document.model';
import { StateCard } from '../model';
import { StateCardComponent } from './components/state-card/state-card.component';
import { DocumentPreviewModalComponent } from "@shared/components/document-preview-modal/document-preview-modal.component";
import { Pagination } from '@core/interfaces/pagination.interface';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ToastService } from '@core/services/toast.service';
import { Logger } from '@core/services/logger.service';
import { forkJoin } from 'rxjs';
import { UtilisateurModel } from '@core/model/utilisateur.model';
import { UtilisateurStateService } from '@store/utilisateur/utilisateur-state.service';
import { SpinnerComponent } from "@shared/components/spinner/spinner.component";

@Component({
  selector: 'app-assignation',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    EnqueteCardComponent,
    // StateCardComponent,
    NgForOf,
    NgClass,
    NgIf,
    DocumentPreviewModalComponent,
    PaginationComponent,
    SpinnerComponent
  ],
  templateUrl: './assignation.component.html',
  styleUrls: ['./assignation.component.css']
})
export class AssignationComponent implements OnInit {
  enquetes = signal<EnqueteModel[]>([]);
  loading = signal<boolean>(false);
  pageTitle: string = " Mes enquêtes assignées";
  pageSubTitle: string = "Gérez vos enquêtes assignées et suivez votre progression";
  selectedDocument: DocumentModel | null = null;
  isPreviewModalOpen: boolean = false;

  pagination = signal<Pagination>({
    totalItem: 1,
    totalPage: 1,
    page: 1,
    limit: 10
  });

  enqueteState = signal<EnqueteStatEtat>({
    enAttente: 5,
    enCours: 7,
    terminees: 12,
    echeances: 3,
    enValidation: 0,
    enRevision: 0,
    valides: 0,
    annulees: 0,
    total: 0,
  })

  stats = computed<StateCard[]>(() => [
    {
      title: "En attente de démarrage",
      value: this.enqueteState().enAttente,
      unit: "missions",
      icon: "fas fa-inbox",
      gradient: "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600",
      borderColor: "border-orange-200/30 hover:border-orange-300/50",
      bgOverlay: "bg-gradient-to-br from-orange-400 to-orange-600",
      valueColor: "text-orange-600",
      trendBadge: "bg-orange-50 text-orange-600 border border-orange-200",
      trend: "Stable",
    },
    {
      title: "Acceptées - En cours",
      value: this.enqueteState().enCours,
      unit: "actives",
      icon: "fas fa-play-circle",
      gradient: "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600",
      borderColor: "border-blue-200/30 hover:border-blue-300/50",
      bgOverlay: "bg-gradient-to-br from-blue-400 to-blue-600",
      valueColor: "text-blue-600",
      trendBadge: "bg-green-50 text-green-600 border border-green-200",
      trend: "+12%",
    },
    {
      title: "Terminées ce mois",
      value: this.enqueteState().terminees,
      unit: "complétées",
      icon: "fas fa-check-circle",
      gradient: "bg-gradient-to-br from-green-400 via-green-500 to-green-600",
      borderColor: "border-green-200/30 hover:border-green-300/50",
      bgOverlay: "bg-gradient-to-br from-green-400 to-green-600",
      valueColor: "text-green-600",
      trendBadge: "bg-green-50 text-green-600 border border-green-200",
      trend: "+8%",
    },
    {
      title: "Échéance proche",
      value: this.enqueteState().echeances,
      unit: "urgentes",
      icon: "fas fa-exclamation-triangle",
      gradient: "bg-gradient-to-br from-red-400 via-red-500 to-red-600",
      borderColor: "border-red-200/30 hover:border-red-300/50",
      bgOverlay: "bg-gradient-to-br from-red-400 to-red-600",
      valueColor: "text-red-600",
      trendBadge: "bg-red-50 text-red-600 border border-red-200",
      trend: "Critique",
    }
  ]);

  // Fonction de tracking pour optimiser les performances
  trackByStat(index: number, stat: StateCard): string {
    return stat.title;
  }

  user!: UtilisateurModel;

  constructor(
    private service: EnqueteService,
    private toast: ToastService,
    private readonly utilisateurState: UtilisateurStateService,
  ) { }

  ngOnInit(): void {
    this.utilisateurState.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.loadData();
      }
    });
  }

  loadData() {
    this.loading.set(true);

    forkJoin({
      stats: this.service.statsEtat(this.user.id),
      enquetes: this.service.getAll({ enqueteurId: this.user.id, etatCode: EnqueteEtatEnquete.EnAttente, ...this.pagination })
    }).subscribe({
      next: ({ stats, enquetes }) => {
        this.enqueteState.set(stats);
        this.enquetes.set(enquetes.data);
        this.pagination.set(enquetes.pagination);
        this.loading.set(false);
      },
      error: err => {
        this.toast.show("Erreur lors du chargement des données", "error");
        this.loading.set(false);
      }
    })
  }

  demarrerEnquete(enquete: EnqueteModel) {
    this.service.changeEtat(enquete.id, EnqueteEtatEnquete.EnCours).subscribe({
      next: response => {
        const updatedEnquetes = this.enquetes().filter(enq => enq.id !== response.id);
        this.enquetes.set(updatedEnquetes);
        this.enqueteState.update(e => ({
          ...e,
          enAttente: e.enAttente - 1,
          enCours: e.enCours + 1
        }));
        this.pagination.update(e => ({ ...e, totalItem: e.totalItem - 1 }));
      },
      error: err => {
        let msg = err.message ?? "Erreur lors du démarrage de l'enquête";
        this.toast.show(msg, "error")
      }
    })
  }

  afficherDocument(document: DocumentModel) {
    this.selectedDocument = document;
    this.isPreviewModalOpen = true;
  }

  getEnqueteAssigner() {
    // return this.enquetes().filter(enquete => enquete.etat.code === EnqueteEtatEnquete.EnAttente)
    return this.enquetes();
  }

}
