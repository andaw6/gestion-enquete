import { NavigationSection } from "@core/interfaces/navigation.interface";

export const DEMANDEUR_NAVIGATION: NavigationSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        label: "Tableau de bord",
        icon: "fas fa-chart-line", // Exemple d'icône pour le tableau de bord
        route: "/demandeur/dashboard",
      },
    ],
  },
  {
    title: "Mes demandes",
    items: [
      {
        label: "Nouvelle demande",
        icon: "fas fa-plus-circle", // Ajouter une nouvelle demande
        route: "/demandeur/demandes/nouveau",
      },
      {
        label: "Toutes mes demandes",
        icon: "fas fa-list", // Liste de toutes les demandes
        route: "/demandeur/demandes/list",
      },
      {
        label: "Demandes en cours",
        icon: "fas fa-hourglass-half", // Demandes en attente/en cours
        route: "/demandeur/demandes/en-cours",
      },
      {
        label: "Demandes terminées",
        icon: "fas fa-check-circle", // Demandes terminées
        route: "/demandeur/demandes/terminee",
      },
      {
        label: "Mes documents",
        icon: "fas fa-file-alt",
        route: "/demandeur/demandes/document",
      }
    ],

  },
  {
    title: "Mon compte",
    items: [
      {
        label: "Mes notifications",
        icon: "fas fa-bell", // Icône de notifications
        // route: "/enqueteur/dashboard",
      },
      {
        label: "Mon profil",
        icon: "fas fa-user", // Icône profil utilisateur
        // route: "/enqueteur/dashboard",
      },
      {
        label: "Paramétre",
        icon: "fas fa-cog", // Icône de paramètres
        // route: "/enqueteur/dashboard",
      },
    ],
  },
];
