import { NavigationSection } from "@core/interfaces/navigation.interface";

export const ENQUETEUR_NAVIGATION: NavigationSection[] = [
  {
    title: "MES ENQUÊTES",
    items: [
      {
        label: "Tableau de bord",
        icon: "fas fa-tachometer-alt",
        route: "/enqueteur/dashboard",
        active: false,
      },
    ],
  },
  {
    title: "TRAITEMENT",
    items: [
      {
        label: "Documents",
        icon: "fas fa-file-alt",
        active: false,
        expanded: false,
        route: "/enqueteur/traitement/document",
        children: [
          {
            label: "Liés à une enquête",
            icon: "fas fa-link",
            route: "/enqueteur/traitement/document/avec-enquete",
            active: false,
          },
          {
            label: "Non liés à une enquête",
            icon: "fas fa-unlink",
            route: "/enqueteur/traitement/document/sans-enquete",
            active: false,
          },
        ],
      },
      {
        label: "Source Information",
        icon: "fas fa-database",
        route: "/enqueteur/traitement/source-info",
        active: false,
      },
    ],
  },
];
