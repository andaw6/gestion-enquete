import { Option } from '@core/interfaces/option.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-observation-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './observation-filter.component.html',
  styleUrls: ['./observation-filter.component.css']
})
export class ObservationFilterComponent {

  // Configuration des filtres
  filters = {
    searchTerm: '',
    categorie: '',
    etat: '',
    dateDebut: '',
    dateFin: '',
    sortBy: 'dateDesc'
  };

  // Données pour les filtres
  categories: string[] = [];
  priorites: Option[] = [];
  filteredObservations: any[] = [];
  @Input() result: number = 0;

  applyFilters() {
    // // let filtered = [...this.observations()];

    // // Filtre de recherche
    // if (this.filters.searchTerm) {
    //   const term = this.filters.searchTerm.toLowerCase();
    //   filtered = filtered.filter(obs =>
    //     obs.objet?.toLowerCase().includes(term) ||
    //     obs.description?.toLowerCase().includes(term)
    //   );
    // }

    // // Filtre par catégorie
    // if (this.filters.categorie) {
    //   filtered = filtered.filter(obs => obs.categorie === this.filters.categorie);
    // }

    // // Filtre par état
    // if (this.filters.etat) {
    //   // filtered = filtered.filter(obs => obs.etat.id === this.filters.etat);
    // }

    // // Filtre par date de début
    // if (this.filters.dateDebut) {
    //   const dateDebut = new Date(this.filters.dateDebut);
    //   // filtered = filtered.filter(obs => new Date(obs.dateEnregistrement) >= dateDebut);
    // }

    // // Filtre par date de fin
    // if (this.filters.dateFin) {
    //   const dateFin = new Date(this.filters.dateFin);
    //   dateFin.setHours(23, 59, 59, 999);
    //   // filtered = filtered.filter(obs => new Date(obs.dateEnregistrement) <= dateFin);
    // }

    // // Tri
    // this.sortObservations(filtered);

    // // this.filteredObservations = filtered;

    // // Réinitialiser la pagination à la première page
    // // this.setPage(1);
  }

  sortObservations(observations: any[]) {
    switch (this.filters.sortBy) {
      case 'dateDesc':
        observations.sort((a, b) =>
          new Date(b.dateEnregistrement).getTime() - new Date(a.dateEnregistrement).getTime()
        );
        break;
      case 'dateAsc':
        observations.sort((a, b) =>
          new Date(a.dateEnregistrement).getTime() - new Date(b.dateEnregistrement).getTime()
        );
        break;
      case 'objet':
        observations.sort((a, b) => a.objet.localeCompare(b.objet));
        break;
      case 'categorie':
        observations.sort((a, b) => a.categorie.localeCompare(b.categorie));
        break;
    }
  }

  resetFilters() {
    this.filters = {
      searchTerm: '',
      categorie: '',
      etat: '',
      dateDebut: '',
      dateFin: '',
      sortBy: 'dateDesc'
    };
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filters.searchTerm ||
      this.filters.categorie ||
      this.filters.etat ||
      this.filters.dateDebut ||
      this.filters.dateFin
    );
  }

  getEtatLibelle(etatId: string): string {
    // const etat = this.etats.find(e => e.id === etatId);
    // return etat ? etat.libelle : '';

    return "";
  }


}
