import { reservation, identity, isTBD } from "@/data/beefbar";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { Button } from "@/components/ui/Button";
import { ReservationForm } from "@/components/ReservationForm";

/** Section sombre (dusk-800) — le second temps « nuit » du rythme du site. */
export function Reservation() {
  const externalUrl = identity.reservationExternalUrl;
  const hasExternal = !isTBD(externalUrl);
  const platform = isTBD(identity.reservationExternalLabel)
    ? "la plateforme officielle"
    : identity.reservationExternalLabel;

  return (
    <section id="reservation" className="bg-dusk-800 py-40 text-stone-50">
      <Container>
        <Reveal>
          <SectionTitle tone="dark" eyebrow="Réservation">
            {reservation.title}
          </SectionTitle>
        </Reveal>

        <div className="mx-auto mt-14 max-w-[760px]">
          {isTBD(reservation.intro) ? (
            <Placeholder
              as="p"
              label="Texte d'introduction de la réservation"
              className="placeholder-tbd-dark mb-16 text-center text-[1.05rem]"
            />
          ) : (
            <p className="mb-16 text-center text-[1.05rem] leading-relaxed text-stone-100/80">
              {reservation.intro}
            </p>
          )}

          <Reveal>
            <ReservationForm />
          </Reveal>

          {hasExternal ? (
            <div className="mt-14 flex justify-center border-t border-stone-100/15 pt-14">
              <Button
                as="a"
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                variant="ghost"
                tone="dark"
              >
                Réserver via {platform}
              </Button>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
