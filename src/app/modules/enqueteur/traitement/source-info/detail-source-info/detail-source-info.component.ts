import {Component, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SourceInfoService} from "@modules/enqueteur/traitement/source-info/source-info.service";
import {SourceInfo, TimelineEvent} from "@modules/enqueteur/traitement/source-info/source-info";
import {Document} from "@modules/enqueteur/traitement/document/document";
import {DatePipe} from "@angular/common";
import {UtilService} from "@core/services/util.service";
import {DocumentService} from "@modules/enqueteur/traitement/document/document.service";

@Component({
  selector: 'app-detail-source-info',
  templateUrl: './detail-source-info.component.html',
  styleUrls: ['./detail-source-info.component.css']
})
export class DetailSourceInfoComponent implements OnInit {
  id!: number;
  source!: SourceInfo;
  isPreviewModalOpen: boolean = false;
  selectedDocument: Document | null = null;

  constructor(
    private route: ActivatedRoute,
    private sourceInfoService: SourceInfoService,
    private router: Router,
    private utilService: UtilService,
    private documentService: DocumentService,
    private renderer: Renderer2,
  ) {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id')!);
      console.log('ID article:', this.id);
    });
  }


  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    if (this.id) {
      this.sourceInfoService.getOne(this.id).subscribe({
        next: data => {
          if (data) {
            this.source = data;
          }
        },
        error: err => {
          console.error(err);
          this.utilService.showNotification(err.message || `Erreur lors de la récupération de la source avec l'id: ${this.id}`, "error");
        }
      })
    }
  }


  handleEdit() {
    const previousDraft = localStorage.getItem("sourceInfo.draft");
    const {documents, utilisateur, ...rest} = this.source;
    const data = {
      ...rest,
      etat: this.source.etat.code,
      type: this.source.type.code,
      documentIds: documents.map(doc => doc.id),
    }
    if (previousDraft) {
      localStorage.setItem("sourceInfo", previousDraft);
    }
    localStorage.setItem("sourceInfo.draft", JSON.stringify(data));
    this.router.navigate(['/enqueteur/traitement/source-info/nouveau'],).then(console.info);
  }


  handleViewDocument(document: Document) {
    this.selectedDocument = document;
    this.isPreviewModalOpen = true;
  }

  handleDownloadDocument(document: Document) {
    this.documentService.getView(document.id, {download: true}).subscribe({
      next: (blob: Blob) => this.utilService.downloadBlob(this.renderer, blob, `${document.nom}.${document.extension}`),
      error: () =>
        this.utilService.showNotification(
          'Erreur lors du téléchargement du document',
          'error'
        ),
    });
  }


  getTimelineEvent(): TimelineEvent[] {
    if (!this.source) return [];
    const datePipe = new DatePipe('fr');
    return [
      {
        titre: "Source collectée",
        date: <string>datePipe.transform(this.source.dateObtention, 'd MMMM y, HH:mm'),
        couleur: "green"
      },
      {
        titre: "Dernière modification",
        date: <string>datePipe.transform(this.source.dateMiseAJour, 'd MMMM y, HH:mm'),
        couleur: "purple"
      },
    ];
  }
  getUsers() {
    if (!this.source) return [];
    return [
      this.source.utilisateur
    ]
  }
  getProgress(): number {
    if (!this.source) return 0;
    return Number(this.source.niveauFiabilite)
  }
}
