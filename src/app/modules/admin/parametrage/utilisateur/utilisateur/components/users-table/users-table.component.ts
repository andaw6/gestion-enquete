import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Pagination} from "@core/interfaces/pagination.interface";
import {Utilisateur} from "@modules/admin/parametrage/utilisateur/utilisateur";

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent {
  @Input() users: Utilisateur[] = []
  @Input() pagination!: Pagination;
  @Output() userAction = new EventEmitter<{ action: string; user: Utilisateur }>()
  @Output() paginationChange = new EventEmitter<Pagination>()

  onUserAction(action: string, user: Utilisateur): void {
    this.userAction.emit({ action, user })
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.paginationChange.emit({
      ...this.pagination,
      limit:itemsPerPage,
      page: 1,
    })
  }

  getRoleClass(role: string): string {
    return role === "Enquêteur"
      ? "px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
      : "px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
  }

  getStatusClass(status: string): string {
    return status === "Actif"
      ? "px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
      : "px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full"
  }
}
