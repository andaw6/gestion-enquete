import {Component, OnInit} from '@angular/core';
import {FilterOptions, UserStats, Utilisateur} from "@modules/admin/parametrage/utilisateur/utilisateur";
import {Pagination} from "@core/interfaces/pagination.interface";

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.css']
})
export class UtilisateurComponent implements OnInit {
  users: Utilisateur[] = [
    {
      id: "1",
      name: "Fatou Sall",
      email: "fatou@gmail.com",
      role: "Employé",
      organization: "Afrilines",
      position: "Dev fullstack",
      status: "Actif",
      lastConnection: "15/02/2025 14:30",
      initials: "FS",
    },
    {
      id: "2",
      name: "Fatou Sall",
      email: "fatou@gmail.com",
      role: "Employé",
      organization: "Afrilines",
      position: "Dev front",
      status: "Actif",
      lastConnection: "15/02/2025 14:30",
      initials: "FS",
    },
    {
      id: "3",
      name: "Fatou Sall",
      email: "fatou@gmail.com",
      role: "Employé",
      organization: "Afrilines",
      position: "Dev back",
      status: "Actif",
      lastConnection: "15/02/2025 14:30",
      initials: "FS",
    },
    {
      id: "4",
      name: "Fatou Sall",
      email: "fatou@gmail.com",
      role: "Employé",
      organization: "Afrilines",
      position: "UI/UX",
      status: "Actif",
      lastConnection: "15/02/2025 14:30",
      initials: "FS",
    },
    {
      id: "5",
      name: "Fatou Sall",
      email: "fatou@gmail.com",
      role: "Enquêteur",
      organization: "Afrilines",
      position: "Enquêteur",
      status: "Actif",
      lastConnection: "15/02/2025 14:30",
      initials: "FS",
    },
  ]

  stats: UserStats = {
    total: 179,
    active: 109,
    newUsers: 3,
  }

  filters: FilterOptions = {
    search: "",
    status: "",
    role: "",
  }

  pagination: Pagination = {
    page: 1,
    limit: 10,
    totalItem: 10,
    totalPage: 1,
  }

  filteredUsers: Utilisateur[] = []

  ngOnInit(): void {
    this.filteredUsers = [...this.users]
  }

  onNewUser(): void {
    console.log("Nouveau utilisateur")
  }

  onBulkImport(): void {
    console.log("Import en masse")
  }

  onFiltersChange(filters: FilterOptions): void {
    this.filters = filters
    this.applyFilters()
  }

  onUserAction(action: string, user: Utilisateur): void {
    switch (action) {
      case "view":
        console.log("Voir utilisateur:", user)
        break
      case "edit":
        console.log("Modifier utilisateur:", user)
        break
      case "delete":
        console.log("Supprimer utilisateur:", user)
        break
    }
  }

  onPaginationChange(pagination: Pagination): void {
    this.pagination = pagination
  }

  private applyFilters(): void {
    this.filteredUsers = this.users.filter((user) => {
      const matchesSearch =
        !this.filters.search ||
        user.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(this.filters.search.toLowerCase())

      const matchesStatus = !this.filters.status || user.status === this.filters.status
      const matchesRole = !this.filters.role || user.role === this.filters.role

      return matchesSearch && matchesStatus && matchesRole
    })
  }
}
