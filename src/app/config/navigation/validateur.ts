import { NavigationSection } from "@core/interfaces/navigation.interface";

export const VALIDATEUR_NAVIGATION: NavigationSection[] = [
   {
    title: "Dashboard",
    items: [
      {
        label: "Tableau de bord",
        icon: "fas fa-chart-line",
        route: "/validateur/dashboard",
      },
      {
        label: "Statistiques",
        icon: "fas fa-chart-pie",
        route: "/validateur/statistiques",
      },
    ],
  },
  {
    title: "Demandes d’enquête",
    items: [
          {
        label: "Tous les demandes",
        icon: "fas fa-list",
        route: "/validateur/demandes/list",
      },
      {
        label: "Demandes à valider",
        icon: "fas fa-clipboard-check",
        route: "/validateur/demandes/avalidees",
      },
      {
        label: "Demandes validées",
        icon: "fas fa-check-circle",
        route: "/validateur/demandes/validees",
      },
      {
        label: "Demandes rejetées",
        icon: "fas fa-times-circle",
        route: "/validateur/demandes/rejetees",
      },
    ],
  },
  {
    title: "Enquêtes",
    items: [
      {
        label: "Enquêtes à valider",
        icon: "fas fa-search",
        route: "/validateur/enquetes",
      },
      {
        label: "Enquêtes validées",
        icon: "fas fa-folder-check",
        route: "/validateur/enquetes/validees",
      },
      {
        label: "Enquêtes rejetées",
        icon: "fas fa-folder-xmark",
        route: "/validateur/enquetes/rejetees",
      },
    ],
  },
  {
    title: "Documents & Sources",
    items: [
      {
        label: "Documents reçus",
        icon: "fas fa-file-alt",
        route: "/validateur/documents",
      },
      {
        label: "Conclusions",
        icon: "fas fa-scroll",
        route: "/validateur/conclusions",
      },
    ],
  },
  {
    title: "Suivi et Historique",
    items: [
      {
        label: "Historique des validations",
        icon: "fas fa-history",
        route: "/validateur/historique",
      },
      {
        label: "Journal des activités",
        icon: "fas fa-list",
        route: "/validateur/activites",
      },
    ],
  },
  {
    title: "Paramètres",
    items: [
      {
        label: "Mon Profil",
        icon: "fas fa-user-cog",
        route: "/validateur/profil",
      },
      {
        label: "Notifications",
        icon: "fas fa-bell",
        route: "/validateur/notifications",
      },
      {
        label: "Aide & Support",
        icon: "fas fa-question-circle",
        route: "/validateur/aide",
      },
    ],
  },
];
