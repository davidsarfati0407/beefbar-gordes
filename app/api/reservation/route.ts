import { NextResponse } from "next/server";
import { reservationSchema, flattenErrors } from "@/lib/reservation";
import { getSupabase } from "@/lib/supabase";
import { sendReservationEmails } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requête invalide." },
      { status: 400 },
    );
  }

  // Validation côté serveur — le client ne fait jamais foi.
  const parsed = reservationSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Formulaire invalide.", fields: flattenErrors(parsed.error) },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const supabase = getSupabase();

  // Mode démo : aucune variable d'env configurée. On log, on répond succès,
  // et rien ne casse — ni en local, ni au build Vercel.
  if (!supabase) {
    console.info("[reservation] Mode démo — enregistrement simulé.", data);
    await sendReservationEmails(data);
    return NextResponse.json({ ok: true, demo: true });
  }

  const { data: inserted, error } = await supabase
    .from("reservations")
    .insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      reserved_on: data.date,
      reserved_at: data.time,
      guests: data.guests,
      message: data.message || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[reservation] Insertion Supabase échouée", error);
    return NextResponse.json(
      { ok: false, error: "La réservation n'a pas pu être enregistrée." },
      { status: 500 },
    );
  }

  const emails = await sendReservationEmails(data);

  if (emails.sent) {
    await supabase
      .from("reservations")
      .update({ emails_sent: true })
      .eq("id", inserted.id);
  }

  return NextResponse.json({ ok: true, demo: false, emailsSent: emails.sent });
}
