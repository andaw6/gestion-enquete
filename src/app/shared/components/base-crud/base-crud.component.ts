import {Component, ViewChild, Input, EventEmitter, Output, signal} from '@angular/core';
import {Pagination} from '@core/interfaces/pagination.interface';
import {GenericCrudComponent} from '@shared/components/generic-crud/generic-crud.component';
import {EntityType} from "@core/interfaces/entity-type.interface";
import {GenericCrudConfig} from "@core/interfaces/generic-crud-config.interface";

@Component({
  selector: 'app-base-crud',
  templateUrl: './base-crud.component.html',
  standalone: true,
  imports: [
    GenericCrudComponent
  ],
  styleUrls: ['./base-crud.component.css']
})
export class BaseCrudComponent <T extends EntityType> {
  // @ViewChild('crudComponent') crudComponent!: GenericCrudComponent<T>;
  @ViewChild(GenericCrudComponent)
  crudComponent!: GenericCrudComponent<T>;
  @Input() config!: GenericCrudConfig;
  @Input() data$!: any;
  @Input() loading = signal(false);
  @Input() pagination!: Pagination;
  @Input() existingCodes: string[] = [];
  @Input() isSubmitting = false;

  @Output() loadData = new EventEmitter<any>();
  @Output() createItem = new EventEmitter<any>();
  @Output() updateItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();
  @Output() pageChanged = new EventEmitter<any>();
}
