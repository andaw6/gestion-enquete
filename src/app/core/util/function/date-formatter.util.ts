
export const formatDate = (date: Date | null): string => {
  if (!date) return ""
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
};