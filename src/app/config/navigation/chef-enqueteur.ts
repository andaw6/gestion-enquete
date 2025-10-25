import { NavigationSection } from "@core/interfaces/navigation.interface";

export const CHEF_ENQUETEUR_NAVIGATION: NavigationSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        label: "Tableau de bord",
        icon: "fas fa-chart-line",
        route: "/chef-enqueteur/dashboard",
      },
    ],
  },
  {
    title: "Enquêtes",
    items: [
      {
        label: "Enquêtes non assignées",
        icon: "fas fa-user-plus",
        route: "/chef-enqueteur/enquetes/assignations",
        // badge: "12", // Nombre d'enquêtes en attente
        // badgeColor: "bg-red-500"
      },
      {
        label: "Suivi Enquêtes",
        icon: "fas fa-tasks",
        route: "/chef-enqueteur/enquetes/suivi",
      },
      {
        label: "Validation Conclusions",
        icon: "fas fa-check-circle",
        route: "/chef-enqueteur/enquetes/validation",
        // badge: "5", // Nombre d'enquêtes à valider
        // badgeColor: "bg-orange-500"
      },
    ],
  },
  {
    title: "Gestion",
    items: [
      {
        label: "Équipe Enquêteurs",
        icon: "fas fa-users",
        route: "/chef-enqueteur/equipe",
      },
      {
        label: "Demandes Validées",
        icon: "fas fa-clipboard-check",
        route: "/chef-enqueteur/demandes",
      },
    ],
  },
  // {
  //   title: "Analyses",
  //   items: [
  //     {
  //       label: "Rapports",
  //       icon: "fas fa-chart-bar",
  //       route: "/chef-enqueteur/rapports",
  //     },
  //     {
  //       label: "Statistiques",
  //       icon: "fas fa-pie-chart",
  //       route: "/chef-enqueteur/statistiques",
  //     },
  //   ],
  // },
  {
    title: "Paramètres",
    items: [
      {
        label: "Mon Profil",
        icon: "fas fa-user-cog",
        route: "/chef-enqueteur/profil",
      },
      {
        label: "Notifications",
        icon: "fas fa-bell",
        route: "/chef-enqueteur/notifications",
        // badge: "3", // Nouvelles notifications
        // badgeColor: "bg-blue-500"
      },
    ],
  },
];
