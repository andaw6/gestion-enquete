import {Component, OnInit} from '@angular/core';
import {NotificationAlertService} from "@core/services/notification-alert.service";
import {SessionService} from "@core/services/session.service";
import {TypeDocument} from "@modules/admin/parametrage/type-document/type-document";
import {GenericCrudConfig} from "@core/interfaces/generic-crud-config.interface";
import {BaseCrudDirective} from "@shared/directives/base-crud.directive";
import {EtatEnqueteService} from "@modules/admin/parametrage/etat-enquete/etat-enquete.service";

@Component({
  selector: 'app-etat-enquete',
  templateUrl: './etat-enquete.component.html',
  styleUrls: ['./etat-enquete.component.css']
})
export class EtatEnqueteComponent extends BaseCrudDirective<TypeDocument> implements OnInit {

  override readonly paginationKey = 'etat-enquete.pagination.limit';
  override service = this.etatEnqueteService;


  constructor(
    protected override sessionService: SessionService,
    protected override notificationService: NotificationAlertService,
    private etatEnqueteService: EtatEnqueteService
  ) {
    super(sessionService, notificationService);
  }

  ngOnInit(): void {
    this.init();
  }


  // Configuration pour le composant générique
  crudConfig: GenericCrudConfig = {
    // Configuration de la liste
    pageTitle: "Gestion des Etats d'enquête",
    pageDescription: "Configuration et paramétrage des états d'enquête",
    listTitle: "Liste des états d'enquête",
    listDescription: "Gérez les différents états que peut prendre une enquête dans le système",
    addButtonText: "Nouvel état",
    addButtonIcon: "fas fa-plus",

    // Configuration du modal
    createTitle: "Nouveau état d'enquête",
    editTitle: "Modifier état d'enquête",
    createDescription: "Créez un nouvel état d'enquête pour le workflow",
    editDescription: "Modifiez les informations de l'état d'enquête",
    codeLabel: "Code du état",
    codePlaceholder: "Ex: NOUVEAU, EN_COURS, VALIDE, REJETE",
    labelLabel: "Libellé du état",
    labelPlaceholder: "Ex: Nouveau, En cours de traitement, Validé, Rejeté",
    createButtonText: "Créer",
    editButtonText: "Modifier",
    cancelButtonText: "Annuler",
    iconSvgPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",

    // Messages personnalisés
    deleteConfirmTitle: "Confirmer la suppression",
    deleteConfirmMessage:
      "Êtes-vous sûr de vouloir supprimer cette état d'enquête ? Cette action est irréversible et peut affecter les enquêtes existantes.",

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
