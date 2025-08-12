import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-page-header',
    standalone: true,
    imports: [CommonModule, RouterLink, NgIf],
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent {
    @Input() title!: string;
    @Input() subtitle?: string;
    @Input() buttonText?: string;
    @Input() buttonAction?: () => void;
    @Input() buttonLink?: string | any[]; // string or routerLink array
    @Input() buttonIcon?: string; // e.g. 'fas fa-plus'
    @Input() style: string = "mb-8 p-6";
    @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
}
