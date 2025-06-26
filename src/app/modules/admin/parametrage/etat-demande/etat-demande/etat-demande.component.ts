import {Component, OnInit} from '@angular/core';
import {NotificationAlertService} from "@core/services/notification-alert.service";
import {SessionService} from "@core/services/session.service";
import {GenericCrudConfig} from "@core/interfaces/generic-crud-config.interface";
import {BaseCrudDirective} from "@shared/directives/base-crud.directive";
import {TypeDocument} from "@modules/admin/parametrage/type-document/type-document";
import {EtatDemandeService} from "@modules/admin/parametrage/etat-demande/etat-demande.service";

@Component({
  selector: 'app-etat-demande',
  templateUrl: './etat-demande.component.html',
  styleUrls: ['./etat-demande.component.css']
})
export class EtatDemandeComponent extends BaseCrudDirective<TypeDocument> implements OnInit {

  override readonly paginationKey = 'etat-enquete.pagination.limit';
  override service = this.etatDemandService;


  constructor(
    protected override sessionService: SessionService,
    protected override notificationService: NotificationAlertService,
    private etatDemandService: EtatDemandeService,
  ) {
    super(sessionService, notificationService);
  }

  ngOnInit(): void {
    this.init();
  }

  // Configuration spécifique pour les états de demande
  crudConfig: GenericCrudConfig = {
    // Configuration de la liste
    pageTitle: "Gestion des États de Demande",
    pageDescription: "Configuration et paramétrage des états de demande",
    listTitle: "Liste des états de demande",
    listDescription: "Gérez les différents états que peut prendre une demande dans le système",
    addButtonText: "Nouvel état",
    addButtonIcon: "fas fa-plus",

    // Configuration du modal
    createTitle: "Nouvel état de demande",
    editTitle: "Modifier l'état de demande",
    createDescription: "Créez un nouvel état de demande pour le workflow",
    editDescription: "Modifiez les informations de l'état de demande",
    codeLabel: "Code de l'état",
    codePlaceholder: "Ex: NOUVEAU, EN_COURS, VALIDE, REJETE",
    labelLabel: "Libellé de l'état",
    labelPlaceholder: "Ex: Nouveau, En cours de traitement, Validé, Rejeté",
    createButtonText: "Créer",
    editButtonText: "Modifier",
    cancelButtonText: "Annuler",
    iconSvgPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",

    // Messages personnalisés
    deleteConfirmTitle: "Confirmer la suppression",
    deleteConfirmMessage:
      "Êtes-vous sûr de vouloir supprimer cet état de demande ? Cette action est irréversible et peut affecter les demandes existantes.",

    // Validation personnalisée
    codeMinLength: 2,
    codeMaxLength: 30,
    labelMinLength: 3,
    labelMaxLength: 50,
    codePattern: /^[A-Z0-9_]+$/, // Codes en majuscules avec underscores

    // Configuration de la pagination
    paginationStorageKey: this.paginationKey,
  }
}
