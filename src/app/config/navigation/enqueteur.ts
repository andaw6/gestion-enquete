import { NavigationSection } from "@core/interfaces/navigation.interface";

export const ENQUETEUR_NAVIGATION: NavigationSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        label: "Tableau de bord",
        icon: "fas fa-tachometer-alt",
        route: "/enqueteur/dashboard",
      },
    ]
  },
  {
    title: "mes enquêtes",
    items: [
      {
        label: "Mes enquêtes",
        icon: "fas fa-list",              // liste d'enquêtes
        route: "/enqueteur/enquetes/liste"
      },
      {
        label: "Enquêtes assignées",
        icon: "fas fa-user-check",        // assignation à l'utilisateur
        route: "/enqueteur/enquetes/assignation",
      },
      {
        label: "Enquêtes en cours",
        icon: "fas fa-hourglass-half",    // en cours / en attente
        route: "/enqueteur/enquetes/en-cours",
      },
      // {
      //   label: "Nouvelle enquête",
      //   icon: "fas fa-plus-circle",    // pour une future création
      //   route: "/enqueteur/enquetes/nouveau",
      // }
    ],
  },

  {
    title: "traitement",
    items: [
      {
        label: "Documents",
        icon: "fas fa-file-alt",
        route: "/enqueteur/traitement/document",
        children: [
          // {
          //   label: "Liés à une enquête",
          //   icon: "fas fa-link",
          //   route: "/enqueteur/traitement/document/avec-enquete",
          // },
          {
            label: "Non liés à une enquête",
            icon: "fas fa-unlink",
            route: "/enqueteur/traitement/document/sans-enquete",
          },
        ],
      },
      {
        label: "Source Information",
        icon: "fas fa-database",
        route: "/enqueteur/traitement/source-info",
      },
      {
        label: "Planning",
        icon: "fas fa-calendar-alt",
        route: "/enqueteur/traitement/planning",
      },
    ],
  },
  {
    title: "Paramètres",
    items: [
      {
        label: "Profil",
        icon: "fas fa-user",
        route: "/enqueteur/profil",
      },
      {
        label: "Mes Notifications",
        icon: "fas fa-bell",
        route: "",
      },
      {
        label: "Paramètres",
        icon: "fas fa-cogs",
        route: "/enqueteur/parametrage",
        children: [
          // {
          //   label: "Préférences",
          //   icon: "fas fa-sliders-h",
          //   route: "/enqueteur/parametrage/preference",
          // },
          {
            label: "Sécurité",
            icon: "fas fa-shield-alt",
            route: "/enqueteur/parametrage/securite",
          },
          {
            label: "Enquêtes",
            icon: "fas fa-poll",
            route: "/enqueteur/parametrage/enquete",
          },
          {
            label: "Notification",
            icon: "fas fa-tools",
            route: "/enqueteur/parametrage/notification",
          },


        ]
      }
    ]
  }

];
