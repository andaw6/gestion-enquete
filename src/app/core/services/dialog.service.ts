// dialog.service.ts
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDeleteModalComponent } from '@shared/components/confirm-delete-modal/confirm-delete-modal.component';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    constructor(private dialog: MatDialog) { }

    /**
     * Ouvre une modal de confirmation de suppression
     * @param title Titre de la modal
     * @param message Message de confirmation
     * @param config Configuration optionnelle du dialog
     * @returns Observable<boolean> - true si confirmé, false si annulé
     * @example
     * constructor(private dialogService: DialogService) {}
     *
     * confirmDelete() {
     *   this.dialogService.openConfirmDialog(
     *     'Confirmer la suppression',
     *     'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.'
     *   ).subscribe(result => {
     *     if (result) {
     *       // Logique de suppression
     *       console.log('Suppression confirmée');
     *     } else {
     *       console.log('Suppression annulée');
     *     }
     *   });
     * }
     */
    openConfirmDialog(
        title: string,
        message: string,
        config?: Partial<MatDialogConfig>
    ): Observable<boolean> {

        const dialogConfig: MatDialogConfig = {
            width: '500px',
            maxWidth: '90vw',
            disableClose: false,
            hasBackdrop: true,
            backdropClass: 'custom-backdrop',
            panelClass: 'custom-dialog-container',
            data: { title, message },
            autoFocus: true,
            restoreFocus: true,
            // Animation personnalisée
            enterAnimationDuration: '400ms',
            exitAnimationDuration: '300ms',
            ...config
        };

        const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, dialogConfig);

        return dialogRef.afterClosed();
    }

    /**
     * Ouvre une modal de confirmation avec options avancées
     * @param options Options de configuration complètes
     * @returns Observable<boolean>
     * @example
     *
     */
    openAdvancedConfirmDialog(options: {
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        type?: 'danger' | 'warning' | 'info';
        width?: string;
        disableClose?: boolean;
    }): Observable<boolean> {

        const dialogConfig: MatDialogConfig = {
            width: options.width || '500px',
            maxWidth: '90vw',
            disableClose: options.disableClose || false,
            hasBackdrop: true,
            backdropClass: `custom-backdrop ${options.type || 'danger'}`,
            panelClass: ['custom-dialog-container', `dialog-${options.type || 'danger'}`],
            data: {
                title: options.title,
                message: options.message,
                confirmText: options.confirmText || 'Confirmer',
                cancelText: options.cancelText || 'Annuler',
                type: options.type || 'danger'
            },
            autoFocus: true,
            restoreFocus: true,
            enterAnimationDuration: '400ms',
            exitAnimationDuration: '300ms'
        };

        const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, dialogConfig);

        return dialogRef.afterClosed();
    }
}

