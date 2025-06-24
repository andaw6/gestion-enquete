import {Component, OnInit} from '@angular/core';
import {TypeDocument} from "@modules/admin/parametrage/type-document/type-document";
import {GenericCrudConfig} from "@core/interfaces/generic-crud-config.interface";
import {TypeDocumentService} from "@modules/admin/parametrage/type-document/type-document.service";
import {NotificationAlertService} from "@core/services/notification-alert.service";
import {SessionService} from "@core/services/session.service";
import {BaseCrudDirective} from "@shared/directives/base-crud.directive";
import {TypeSourceService} from "@modules/admin/parametrage/type-source/type-source.service";

@Component({
  selector: 'app-type-source',
  templateUrl: './type-source.component.html',
  styleUrls: ['./type-source.component.css']
})
export class TypeSourceComponent extends BaseCrudDirective<TypeDocument> implements OnInit {
  override readonly paginationKey = 'type-source.pagination.limit';
  override service = this.typeSourceService;

  crudConfig: GenericCrudConfig = {
    // Configuration de la liste
    pageTitle: "Gestion des Types de Source d'Information",
    pageDescription: "Configurer et paramétrer les types de sources d'information utilisés dans le système.",
    listTitle: "Liste des types de sources d'information",
    listDescription: "Gérez les types de source utilisés dans le cadre des enquêtes.",
    addButtonText: "Nouveau type",
    addButtonIcon: "fas fa-plus",

    // Configuration du modal
    createTitle: "Créer un nouveau type de document",
    editTitle: "Modifier un type de document",
    createDescription: "Ajoutez un nouveau type de source pour les enquêtes.",
    editDescription: "Modifiez les informations d’un type de source existant.",
    codeLabel: "Code du type",
    codePlaceholder: "Ex : RP002, CV001, TEG002",
    labelLabel: "Libellé du type",
    labelPlaceholder: "Ex : Témoignage, Rapport, Pièce jointe",
    createButtonText: "Créer",
    editButtonText: "Enregistrer",
    cancelButtonText: "Annuler",
    iconSvgPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",

    // Messages personnalisés
    deleteConfirmTitle: "Confirmer la suppression",
    deleteConfirmMessage:
      "Êtes-vous sûr de vouloir supprimer ce type de source ? Cette action est irréversible et peut affecter les enquêtes existantes.",

    // Validation personnalisée
    codeMinLength: 2,
    codeMaxLength: 30,
    labelMinLength: 3,
    labelMaxLength: 50,
    codePattern: /^[A-Z0-9_]+$/, // Codes en majuscules avec underscores

    // Configuration de la pagination
    paginationStorageKey: this.paginationKey,
  }

  constructor(
    protected override sessionService: SessionService,
    protected override notificationService: NotificationAlertService,
    private typeSourceService: TypeSourceService
  ) {
    super(sessionService, notificationService);
  }

  ngOnInit(): void {
    this.init();
  }
}
