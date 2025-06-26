export interface Utilisateur {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  position: string;
  status: "Actif" | "Inactif"
  lastConnection: string;
  initials: string;
}

export interface UserStats {
  total: number;
  active: number;
  newUsers: number;
}

export interface FilterOptions {
  search: string;
  status: string;
  role: string;
}

