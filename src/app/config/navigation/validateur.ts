import { NavigationSection } from "@core/interfaces/navigation.interface";

export const VALIDATEUR_NAVIGATION: NavigationSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        label: "Tableau de bord",
        icon: "fas fa-chart-line", // Exemple d'icône pour le tableau de bord
        route: "/validateur/dashboard",
      },
    ],
  },
];