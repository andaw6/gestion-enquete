import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-spinner-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner-loader.component.html',
  styleUrls: ['./spinner-loader.component.css'], // Corrige ici: "styleUrls" et non "styleUrl"
  animations: [
    // Animation pour fadeInOut (utilisée sur le conteneur principal)
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    // Animation pour successAnimation (pour le succès)
    trigger('successAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.5)' }))
      ])
    ]),
    // Animation pour errorAnimation (pour l'erreur)
    trigger('errorAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ]) 
  ]
})
export class SpinnerLoaderComponent {
  @Input() messageLoader: string = "Traitement en cours...";
  @Input() messageSucess: string = "Traitement terminer.";
  @Input() messageError: string = "Erreur lors du traitement.";
  protected isOpen: boolean = false;
  protected isSucces: boolean = true;
  protected loading: boolean = false;

  open = () => {
    this.isOpen = true;
    this.loading = true;
    console.log("open loading");
  };

  close = () => {
    this.isOpen = false;
    this.loading = false;
  };

  succes = (value: boolean = true) => {
    this.loading = false;
    this.isSucces = value;
  };

  stop(succes: boolean, time: number = 1000) {
    this.succes(succes);
    setTimeout(() => {
      this.close();
    }, time);
  }
}
