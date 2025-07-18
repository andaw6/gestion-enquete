import {NavigationSection} from "@core/interfaces/navigation.interface";

export const  ADMIN_NAVIGATION: NavigationSection[] = [
  {
    title: "PRINCIPAL",
    items: [
      {
        label: "Tableau de bord",
        icon: "fas fa-chart-bar"
      },
      {
        label: "Gestion utilisateurs",
        icon: "fas fa-users"
      },
    ],
  },
  {
    title: "ORGANISATION",
    items: [
      {
        label: "Organigramme",
        icon: "fas fa-sitemap"
      },
      {
        label: "Départements",
        icon: "fas fa-building"
      },
    ],
  },
  {
    title: "PARAMÈTRES",
    items: [
      {
        label: "Mes Notifications",
        icon: "fas fa-bell",
        route: "/admin/parametrage/notification"
      },
      {
        label: "Paramètre Système",
        icon: "fas fa-cogs",
        active: false,
        route: "/admin/parametrage/systeme",
        children: [
          {
            label: "Types de documents",
            icon: "fas fa-file-alt",
            route: "/admin/parametrage/systeme/type-document"
          },
          // {
          //   label: "États de demande",
          //   icon: "fas fa-tasks",
          //   route: "/admin/parametrage/systeme/etat-demande"
          // },
          // {
          //   label: "États d'enquête",
          //   icon: "fas fa-poll",
          //   route: "/admin/parametrage/systeme/etat-enquete"
          // },
          {
            label: "Sources d'information",
            icon: "fas fa-stream",
            route: "/admin/parametrage/systeme/type-source",
          },
        ],
      },
      {
        label: "Sécurité",
        icon: "fas fa-lock",
        active: false,
        route: "/admin/parametrage/securite",
        children: [
          {
            label: "Rôles et permissions",
            icon: "fas fa-user-shield",
            route: "/admin/parametrage/securite/roles-permissions"
          },
          {
            label: "Journaux d'activité",
            icon: "fas fa-history",
            route: "/admin/parametrage/securite/journaux"
          },
          {
            label: "Accès système",
            icon: "fas fa-key",
            route: "/admin/parametrage/securite/acces"
          },
        ],
      },
      {
        label: "Préférences",
        icon: "fas fa-sliders-h",
        active: false,
        route: "/admin/preference",
        children: [
          {
            label: "Profil utilisateur",
            icon: "fas fa-user",
            route: "/admin/preference/profil"
          },
          {
            label: "Préférences personnelles",
            icon: "fas fa-cog",
            route: "/admin/preference/personnelles"
          },
        ],
      },
    ],
  },
]
