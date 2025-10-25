import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObervationModalComponent } from "./components/observation-modal/observation-modal.component";
import { EnqueteService } from '@modules/enqueteur/enquetes/enquete.service';
import { AutreInfoModel, AutreInfoRequestData } from '@core/model/autre-info.model';
import { EnqueteModel } from '@core/model/enquete.model';
import { EnqueteStateService } from '@store/enquete/enquete-state.service';
import { AutreInfoService } from '@modules/enqueteur/enquetes/autre-info.service';
import { isAutreInfoModel } from '@core/util/function/autre-info.util';

@Component({
  selector: 'app-observations-tab',
  standalone: true,
  imports: [CommonModule, ObervationModalComponent],
  templateUrl: './observations-tab.component.html',
  styleUrls: ['./observations-tab.component.css']
})
export class ObservationsTabComponent implements OnInit {
  private readonly enqueteState = inject(EnqueteStateService);

  openModal: boolean = false;
  enquete!: EnqueteModel;
  observations: AutreInfoModel[] = [];


  ngOnInit(): void {
    this.enqueteState.enquete$.subscribe(enquete => {
      if (enquete) {
        this.enquete = enquete;
        this.observations = this.getObservations();
      }
    })
  }

  getObservations(): AutreInfoModel[] {
    return this.enquete.autresInfos?.filter(aut => aut.categorie.includes("observation-")) ?? [];
  }



  savedData(event: { data: AutreInfoModel | AutreInfoRequestData; action: "create" | "update" }) {
    if (isAutreInfoModel(event.data)) {
      if (event.action === "create") {
        this.enqueteState.addAutreInfo(event.data as AutreInfoModel);
      } else {
        this.enqueteState.updateAutreInfo(event.data as AutreInfoModel);
      }
    }
  }

  getBgColor(obs: AutreInfoModel): string {
    switch (obs.importance) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-red-500';
      default: return 'bg-primary-500';
    }
  }

  getBadgeClass(obs: AutreInfoModel): string {
    switch (obs.importance) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  }

  getIcon(obs: AutreInfoModel): string {
    switch (obs.importance) {
      case 1: return 'fas fa-check-circle';
      case 2: return 'fas fa-exclamation-triangle';
      case 3: return 'fas fa-times-circle';
      default: return 'fas fa-sticky-note';
    }
  }

}
