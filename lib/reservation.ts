import { z } from "zod";
import { reservation } from "@/data/beefbar";

/** `YYYY-MM-DD` du jour, en heure locale (pas d'UTC : on compare des dates civiles). */
export function todayISO(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Schéma partagé client (zod) et serveur — une seule source de vérité. */
export const reservationSchema = z.object({
  firstName: z.string().trim().min(1, "Prénom requis").max(80),
  lastName: z.string().trim().min(1, "Nom requis").max(80),
  email: z.email("Adresse email invalide").max(160),
  phone: z
    .string()
    .trim()
    .min(6, "Numéro de téléphone requis")
    .max(30)
    .regex(/^[0-9+\s().-]+$/, "Numéro de téléphone invalide"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date requise")
    .refine((value) => value >= todayISO(), "Les dates passées ne sont pas disponibles"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Créneau requis"),
  guests: z.coerce
    .number()
    .int()
    .min(reservation.minGuests, "Minimum 1 couvert")
    .max(reservation.maxGuests, `Maximum ${reservation.maxGuests} couverts`),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

/** Erreurs indexées par nom de champ, pour l'affichage sous chaque input. */
export type FieldErrors = Partial<Record<keyof ReservationInput, string>>;

export function flattenErrors(error: z.ZodError<ReservationInput>): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ReservationInput | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}
