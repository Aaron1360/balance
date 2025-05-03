import { format } from "date-fns";
import { toDate } from "date-fns-tz";
import { es } from "date-fns/locale";

export const formatDate = (
  date: string | Date | null | undefined,
  formatString: string = "dd/MM/yyyy"
): string => {
  if (!date) return "Sin fecha";
  const zonedDate = toDate(date, { timeZone: "America/Mexico_City" });
  return format(zonedDate, formatString, { locale: es });
};