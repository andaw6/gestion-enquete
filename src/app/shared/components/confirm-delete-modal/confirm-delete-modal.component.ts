// confirm-delete-modal.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { trigger, state, style, transition, animate, query, stagger, keyframes } from '@angular/animations';

@Component({
  selector: 'app-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  standalone: true,
  animations: [
    // Animation pour le fade in de l'overlay
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),

    // Animation pour la modal qui apparaît avec un effet de scale et slide
    trigger('slideInScale', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateY(-50px) scale(0.8)' 
        }),
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', 
          style({ 
            opacity: 1, 
            transform: 'translateY(0) scale(1)' 
          })
        )
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ 
            opacity: 0, 
            transform: 'translateY(50px) scale(0.8)' 
          })
        )
      ])
    ]),

    // Animation pour les éléments qui apparaissent de bas en haut
    trigger('fadeInUp', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateY(20px)' 
        }),
        animate('{{ delay }} cubic-bezier(0.25, 0.8, 0.25, 1)', 
          style({ 
            opacity: 1, 
            transform: 'translateY(0)' 
          })
        )
      ])
    ]),

    // Animation pour l'icône avec un effet de pulsation
    trigger('iconPulse', [
      transition(':enter', [
        animate('600ms ease-in-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.1)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ]),

    // Animation hover pour les boutons
    trigger('buttonHover', [
      state('default', style({ transform: 'scale(1)' })),
      state('hover', style({ transform: 'scale(1.05)' })),
      transition('default <=> hover', animate('150ms ease-in-out'))
    ])
  ]
})
export class ConfirmDeleteModalComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string }
  ) { 
    // Ajout d'une classe CSS personnalisée pour l'overlay
    this.dialogRef.addPanelClass('custom-modal-overlay');
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}