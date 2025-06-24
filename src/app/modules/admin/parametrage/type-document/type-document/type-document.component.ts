import {Component, OnInit, signal, ViewChild} from '@angular/core';
import { TypeDocument } from '../type-document';
import { Observable, of } from 'rxjs';
import { Pagination } from '@core/interfaces/pagination.interface';
import { TypeDocumentService } from '../type-document.service';
import { ResponseError } from '@core/interfaces/response-error.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteModalComponent } from '@shared/components/confirm-delete-modal/confirm-delete-modal.component';
import { NotificationAlertService } from '@core/services/notification-alert.service';
import { map, single } from 'rxjs/operators';
import { DialogService } from '@core/services/dialog.service';
import {SessionService} from "@core/services/session.service";
import {GenericCrudComponent} from "@shared/components/generic-crud/generic-crud.component";
import {GenericCrudConfig} from "@core/interfaces/generic-crud-config.interface";
import {BaseCrudDirective} from "@shared/directives/base-crud.directive";

@Component({
  selector: 'app-type-document',
  templateUrl: './type-document.component.html',
  styleUrls: ['./type-document.component.css']
})
export class TypeDocumentComponent extends BaseCrudDirective<TypeDocument> implements OnInit {

  override readonly paginationKey = 'type-document.pagination.limit';
  override service = this.typeDocumentService;


  constructor(
    protected override sessionService: SessionService,
    protected override notificationService: NotificationAlertService,
    private typeDocumentService: TypeDocumentService
  ) {
    super(sessionService, notificationService);
  }

  ngOnInit(): void {
    this.init();
  }


  // Configuration pour le composant générique
  crudConfig: GenericCrudConfig = {
    // Configuration de la liste
    pageTitle: "Gestion des Types de Documents",
    pageDescription: "Configuration et paramétrage des types de documents",
    listTitle: "Liste des types de documents",
    listDescription: "Gérez les types de documents utilisés dans le système",
    addButtonText: "Nouvel type",
    addButtonIcon: "fas fa-plus",

    // Configuration du modal
    createTitle: "Nouveau type de document",
    editTitle: "Modifier type de document",
    createDescription: "Créez un nouveau type de document pour les enquêtes",
    editDescription: "Modifiez les informations du type de document",
    codeLabel: "Code du type",
    codePlaceholder: "Ex: RP002, CV001, TEG002",
    labelLabel: "Libellé du type",
    labelPlaceholder: "Ex: Rapport d'entreprise, Certificat médical, Pièce jointe",
    createButtonText: "Créer",
    editButtonText: "Modifier",
    cancelButtonText: "Annuler",
    iconSvgPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",

    // Messages personnalisés
    deleteConfirmTitle: "Confirmer la suppression",
    deleteConfirmMessage:
      "Êtes-vous sûr de vouloir supprimer cet type de document ? Cette action est irréversible et peut affecter les documents existantes.",

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
