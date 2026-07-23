import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// ============================================================
// Dijeljeni generator za opengraph-image.tsx i twitter-image.tsx —
// ista slika za oba jer nemamo razloga za razlikovanje. Statički se
// generira JEDNOM tijekom builda (nema fetch/request-time podataka),
// pa nema rizika po deploy pipeline.
// ============================================================

export const alt =
  "Apartments Šibenik — tri obiteljska apartmana u srcu starog grada";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateOgImage() {
  const [heroData, logoData] = await Promise.all([
    readFile(join(process.cwd(), "public/images/hero.jpg")),
    readFile(join(process.cwd(), "public/images/logo.png")),
  ]);
  const heroSrc = `data:image/jpeg;base64,${heroData.toString("base64")}`;
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
        }}
      >
        {/* next/og renderira preko Satorija, ne DOM-a — next/image i alt
            tekst ovdje nemaju smisla (nema browsera, nema a11y stabla) */}
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={heroSrc}
          width={size.width}
          height={size.height}
          style={{
            position: "absolute",
            inset: 0,
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(0deg, rgba(20,14,8,0.9) 0%, rgba(20,14,8,0.45) 55%, rgba(20,14,8,0.1) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "56px 64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img
              src={logoSrc}
              width={88}
              height={88}
              style={{ borderRadius: "50%" }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 58,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.01em",
              }}
            >
              Apartments Šibenik
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 30,
              color: "rgba(255,255,255,0.92)",
              maxWidth: 880,
              lineHeight: 1.3,
            }}
          >
            Tri obiteljska apartmana u srcu starog kamenog grada Šibenika
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
