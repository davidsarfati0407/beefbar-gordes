import { identity, agency, isTBD } from "@/data/beefbar";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";
import type { ReactNode } from "react";

const infos = [
  { label: "Adresse", value: identity.address },
  { label: "Horaires", value: identity.hours },
  { label: "Téléphone", value: identity.phone, href: (v: string) => `tel:${v}` },
  { label: "Email", value: identity.email, href: (v: string) => `mailto:${v}` },
  { label: "Instagram", value: identity.instagram, href: (v: string) => v },
];

export function Footer() {
  return (
    <footer className="bg-stone-50 pt-32 pb-16">
      <Container>
        <Reveal stagger className="grid grid-cols-5 gap-10 border-t border-stone-100 pt-20">
          {infos.map((info) => (
            <InfoBlock key={info.label} label={info.label}>
              {isTBD(info.value) ? (
                <Placeholder />
              ) : info.href ? (
                <a
                  href={info.href(info.value)}
                  className="link-underline text-taupe-700 hover:text-ink-900"
                  {...(info.label === "Instagram"
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  {info.value}
                </a>
              ) : (
                <span className="text-taupe-700">{info.value}</span>
              )}
            </InfoBlock>
          ))}
        </Reveal>

        <div className="mt-24 flex items-end justify-between border-t border-stone-100 pt-10">
          <p className="font-display italic text-xl text-ink-900">
            {identity.name} · {identity.domain}
          </p>

          <p className="label-caps text-[0.58rem] text-taupe-700">
            Site réalisé par{" "}
            <a
              href={agency.url}
              target="_blank"
              rel="noreferrer"
              className="link-underline text-ink-900"
            >
              {agency.name}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}

function InfoBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="label-caps text-[0.6rem] text-ink-900">{label}</h3>
      <div className="text-[1rem] leading-relaxed">{children}</div>
    </div>
  );
}
