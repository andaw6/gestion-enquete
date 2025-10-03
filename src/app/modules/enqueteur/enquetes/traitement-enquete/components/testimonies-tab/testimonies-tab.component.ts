import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnqueteModel } from '@core/model/enquete.model';
import { AutreInfoModel } from '@core/model/autre-info.model';
import { EnqueteStateService } from '@store/enquete/enquete-state.service';

@Component({
  selector: 'app-testimonies-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonies-tab.component.html',
  styleUrls: ['./testimonies-tab.component.css']
})
export class TestimoniesTabComponent implements OnInit {
  enquete!: EnqueteModel;
  temoignages: AutreInfoModel[] = [];
  @Output() openModel = new EventEmitter();
  @Output() edit = new EventEmitter<AutreInfoModel>();
  @Output() delete = new EventEmitter<AutreInfoModel>();

  private readonly enqueteState = inject(EnqueteStateService);

  ngOnInit(): void {
    this.enqueteState.enquete$.subscribe(enquete => {
      if (enquete) {
        this.enquete = enquete;
        this.temoignages = this.getTemoignages();
      }
    })
  }

  private getTemoignages() {
    return this.enquete.autresInfos?.filter(aut => aut.categorie == "temoignage") ?? [];
  }

  openTestimonyModal() {
    this.openModel.emit();
  }

  editTemoignage(temoignage: AutreInfoModel) {
    this.edit.emit(temoignage);
  }

  deleteTemoignage(temoignage: AutreInfoModel) {
    this.delete.emit(temoignage);
  }

  getLibelle(code: string): string {
    switch (code) {
      case "00":
        return "Témoignage en attente de validation";
      case "01":
        return "Témoignage signé et validé";
      case "02":
        return "Témoignage rejeté";
      default:
        return "Témoignage N/A";
    }
  }

  getEtatIconClass(code: string): string {
    switch (code) {
      case '01':
        return 'fas fa-check-circle text-green-500';
      case '00':
        return 'fas fa-hourglass-half text-yellow-500';
      case '02':
        return 'fas fa-times-circle text-red-500';
      default:
        return 'fas fa-question-circle text-gray-400';
    }
  }

  getEtatLibelleClass(code: string): string {
    switch (code) {
      case '01':
        return 'bg-green-100 text-green-800';
      case '00':
        return 'bg-yellow-100 text-yellow-800';
      case '02':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
