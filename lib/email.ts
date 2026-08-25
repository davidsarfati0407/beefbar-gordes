import { Resend } from "resend";
import { identity } from "@/data/beefbar";
import type { ReservationInput } from "./reservation";

/** `null` si RESEND_API_KEY est absente → mode démo. */
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const shell = (title: string, rows: string, intro: string) => `
  <div style="font-family:Georgia,'Times New Roman',serif;background:#f4efe6;padding:40px 0;color:#1c1a17;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;padding:44px 40px;">
      <p style="font-family:Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;font-size:11px;color:#5a4e43;margin:0 0 24px;">
        ${identity.name}
      </p>
      <hr style="border:none;border-top:1px solid #b08d57;margin:0 0 28px;" />
      <h1 style="font-size:26px;font-style:italic;font-weight:normal;margin:0 0 20px;">${title}</h1>
      <p style="font-size:16px;line-height:1.7;color:#5a4e43;margin:0 0 28px;">${intro}</p>
      <table style="width:100%;border-collapse:collapse;font-size:15px;">${rows}</table>
      <hr style="border:none;border-top:1px solid #e9e1d3;margin:32px 0 20px;" />
      <p style="font-family:Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;font-size:10px;color:#5a4e43;margin:0;">
        ${identity.domain}
      </p>
    </div>
  </div>
`;

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:9px 0;color:#5a4e43;width:44%;">${label}</td>
    <td style="padding:9px 0;color:#1c1a17;">${value}</td>
  </tr>
`;

function rowsFor(data: ReservationInput): string {
  return [
    row("Date", formatDate(data.date)),
    row("Heure", data.time),
    row("Couverts", String(data.guests)),
    row("Nom", `${data.firstName} ${data.lastName}`),
    row("Email", data.email),
    row("Téléphone", data.phone),
    data.message ? row("Message", data.message) : "",
  ].join("");
}

export type EmailResult = { sent: boolean; reason?: string };

/**
 * Deux emails : confirmation au client + notification au restaurant.
 * Sans clé Resend (ou sans RESTAURANT_EMAIL), on log et on renvoie `sent:false`
 * — le mode démo n'échoue jamais.
 */
export async function sendReservationEmails(
  data: ReservationInput,
): Promise<EmailResult> {
  const resend = getResend();
  const restaurantEmail = process.env.RESTAURANT_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!resend || !restaurantEmail) {
    console.info(
      "[reservation] Mode démo — emails non envoyés (RESEND_API_KEY / RESTAURANT_EMAIL manquantes).",
      data,
    );
    return { sent: false, reason: "missing-env" };
  }

  const subject = `${identity.name} — réservation du ${formatDate(data.date)} à ${data.time}`;

  const [client, restaurant] = await Promise.allSettled([
    resend.emails.send({
      from: `${identity.name} <${from}>`,
      to: data.email,
      subject,
      html: shell(
        "Votre demande de réservation",
        rowsFor(data),
        `Bonjour ${data.firstName}, nous avons bien reçu votre demande. Elle vous sera confirmée par le restaurant.`,
      ),
    }),
    resend.emails.send({
      from: `${identity.name} <${from}>`,
      to: restaurantEmail,
      replyTo: data.email,
      subject: `Nouvelle demande — ${data.lastName} · ${data.guests} couverts`,
      html: shell(
        "Nouvelle demande de réservation",
        rowsFor(data),
        "Une demande vient d'être envoyée depuis le site.",
      ),
    }),
  ]);

  const failed = [client, restaurant].filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    console.error("[reservation] Envoi Resend partiellement échoué", failed);
    return { sent: false, reason: "resend-error" };
  }

  return { sent: true };
}
