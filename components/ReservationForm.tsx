"use client";

import { useMemo, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  reservation,
  reservationSlots,
  reservationSlotsArePlaceholder,
  TBD,
} from "@/data/beefbar";
import {
  reservationSchema,
  flattenErrors,
  todayISO,
  type FieldErrors,
  type ReservationInput,
} from "@/lib/reservation";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "loading" | "success" | "error";

const fieldBase =
  "w-full border-b border-stone-100/25 bg-transparent px-0 py-3 text-[1.05rem] " +
  "text-stone-50 transition-colors duration-400 placeholder:text-stone-100/40 " +
  "focus:border-gold-500 focus:outline-none";

const labelBase = "label-caps mb-3 block text-[0.6rem] text-sand-300";

export function ReservationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const today = useMemo(() => todayISO(), []);
  const guestOptions = useMemo(
    () =>
      Array.from(
        { length: reservation.maxGuests - reservation.minGuests + 1 },
        (_, i) => reservation.minGuests + i,
      ),
    [],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    // `currentTarget` est nul après un await : on capture le noeud maintenant.
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const raw = Object.fromEntries(form.entries());

    const parsed = reservationSchema.safeParse(raw);
    if (!parsed.success) {
      setErrors(flattenErrors(parsed.error));
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("loading");

    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data satisfies ReservationInput),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setErrors(result.fields ?? {});
        setFormError(result.error ?? "Une erreur est survenue.");
        setStatus("error");
        return;
      }

      setStatus("success");
      formEl.reset();
    } catch {
      setFormError("Le serveur n'a pas répondu. Merci de réessayer.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        role="status"
        className="flex flex-col items-center gap-6 border border-gold-500/40 px-8 py-14 text-center md:px-14 md:py-20"
      >
        <span aria-hidden="true" className="block h-px w-16 bg-gold-500" />
        <p className="font-display italic text-3xl text-gold-500">
          Votre demande est bien enregistrée
        </p>
        <p className="max-w-[46ch] text-[1.05rem] leading-relaxed text-stone-100/80">
          Elle sera confirmée par le restaurant. Vous recevez une copie par email.
        </p>
        <Button
          type="button"
          variant="ghost"
          tone="dark"
          onClick={() => setStatus("idle")}
        >
          Nouvelle demande
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-x-14 gap-y-8 sm:grid-cols-2 md:gap-y-10">
        <Field label="Prénom" name="firstName" error={errors.firstName}>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            className={fieldBase}
          />
        </Field>

        <Field label="Nom" name="lastName" error={errors.lastName}>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            className={fieldBase}
          />
        </Field>

        <Field label="Email" name="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={fieldBase}
          />
        </Field>

        <Field label="Téléphone" name="phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            className={fieldBase}
          />
        </Field>

        <Field label="Date" name="date" error={errors.date}>
          <input
            id="date"
            name="date"
            type="date"
            /* Dates passées désactivées. */
            min={today}
            required
            className={`${fieldBase} [color-scheme:dark]`}
          />
        </Field>

        <Field
          label="Heure"
          name="time"
          error={errors.time}
          hint={
            reservationSlotsArePlaceholder
              ? `Créneaux ${TBD} — liste provisoire`
              : undefined
          }
        >
          <select id="time" name="time" required defaultValue="" className={fieldBase}>
            <option value="" disabled>
              Choisir un créneau
            </option>
            {reservationSlots.map((slot) => (
              <option key={slot} value={slot} className="bg-dusk-800">
                {slot}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Couverts" name="guests" error={errors.guests}>
          <select id="guests" name="guests" required defaultValue="2" className={fieldBase}>
            {guestOptions.map((n) => (
              <option key={n} value={n} className="bg-dusk-800">
                {n}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Message (optionnel)" name="message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={3}
          className={`${fieldBase} resize-none`}
        />
      </Field>

      <AnimatePresence>
        {formError ? (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            role="alert"
            className="text-[0.98rem] text-sand-300"
          >
            {formError}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <div className="mt-2 flex items-center gap-8">
        <Button type="submit" variant="outline" tone="dark" disabled={status === "loading"}>
          {status === "loading" ? "Envoi en cours…" : "Envoyer la demande"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className={labelBase}>
        {label}
      </label>
      {children}
      {hint ? <p className="placeholder-tbd-dark mt-2 text-[0.85rem]">{hint}</p> : null}
      <AnimatePresence>
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 text-[0.9rem] text-sand-300"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
