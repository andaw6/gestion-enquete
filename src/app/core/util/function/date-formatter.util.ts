
export const formatDate = (date: Date | null): string => {
  if (!date) return ""
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
};

export const tempsEcouleDetaille = (dateDonnee: Date | string | null): string => {
  if (!dateDonnee) return "N/A";

  const date = typeof dateDonnee === "string" ? new Date(dateDonnee) : dateDonnee;

  if (isNaN(date.getTime())) {
    return "Date invalide";
  }

  const maintenant = new Date();
  let diffMs = maintenant.getTime() - date.getTime();

  const secondes = Math.floor(diffMs / 1000) % 60;
  const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
  const heures = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
  const jours = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return `${jours}j ${heures}h ${minutes}m`;
};
