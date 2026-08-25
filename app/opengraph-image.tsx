import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { identity, hero, photos } from "@/data/beefbar";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${identity.name} — ${identity.domain}`;

/** Photo du hero encodée en data URI si elle a été fournie, sinon `null`. */
function heroDataUri(): string | null {
  try {
    const file = path.join(process.cwd(), "public", photos.hero.src.replace(/^\//, ""));
    if (!fs.existsSync(file)) return null;
    return `data:image/jpeg;base64,${fs.readFileSync(file).toString("base64")}`;
  } catch {
    return null;
  }
}

export default function OpengraphImage() {
  const photo = heroDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundColor: "#1C1A17",
          backgroundImage: photo
            ? undefined
            : "radial-gradient(120% 90% at 50% 15%, #2B2F3A 0%, #1C1A17 70%)",
        }}
      >
        {photo ? (
          <img
            src={photo}
            alt=""
            width={1200}
            height={630}
            style={{ position: "absolute", inset: 0, objectFit: "cover" }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(28, 26, 23, 0.55)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div style={{ width: 90, height: 1, backgroundColor: "#B08D57" }} />
          <div
            style={{
              fontSize: 86,
              fontStyle: "italic",
              color: "#F4EFE6",
              margin: "38px 0",
              letterSpacing: "-0.01em",
            }}
          >
            {identity.name}
          </div>
          <div style={{ width: 90, height: 1, backgroundColor: "#B08D57" }} />
          <div
            style={{
              fontSize: 24,
              color: "#C9B48E",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginTop: 38,
            }}
          >
            {hero.subtitle}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
