import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { dictionaries } from "@/lib/i18n";

export const alt = "Guilherme Pureza — Desenvolvedor web & mobile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#f6f6f4";
const FG = "#1c1d20";
const MUTED = "#66686e";
const FAINT = "#a2a4a9";
const LINE = "rgba(28, 29, 32, 0.08)";
const LINE_STRONG = "rgba(28, 29, 32, 0.18)";
const SIGNAL = "#17964f";

// O Satori mede palavras sem o kerning da Geist e desenha com ele, abrindo um vão depois de cada palavra longa
function glyphs(text: string) {
  return [...text].map((char, index) =>
    char === " " ? <span key={index} style={{ width: "0.26em" }} /> : <span key={index}>{char}</span>,
  );
}

export default async function Image() {
  const [sansMedium, mono, portrait] = await Promise.all([
    readFile(join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf")),
    readFile(join(process.cwd(), "node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf")),
    readFile(join(process.cwd(), "src/assets/og-portrait.png")),
  ]);
  const portraitSrc = `data:image/png;base64,${portrait.toString("base64")}`;
  const { hero } = dictionaries.pt;

  const label = { fontFamily: "Geist Mono", fontSize: 17, letterSpacing: "0.04em", color: MUTED };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: BG,
          color: FG,
          fontFamily: "Geist",
          padding: "48px 56px 40px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: `linear-gradient(to right, ${LINE} 1px, transparent 1px), linear-gradient(to bottom, ${LINE} 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: `radial-gradient(ellipse 60% 70% at 50% 45%, rgba(246, 246, 244, 0), ${BG})`,
          }}
        />

        <img
          src={portraitSrc}
          alt=""
          width={392}
          height={490}
          style={{ position: "absolute", right: 64, bottom: 59 }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", ...label, textTransform: "uppercase" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: FAINT }}>[01]</span>
            <span>{hero.eyebrow}</span>
          </div>
          <span>{hero.based}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 64 }}>
          <div style={{ display: "flex", gap: 12, ...label, fontSize: 20 }}>
            <span style={{ color: FAINT }}>~/gp $</span>
            <span>whoami</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 18,
              fontSize: 132,
              fontWeight: 500,
              lineHeight: 0.92,
              letterSpacing: "-0.065em",
            }}
          >
            <div style={{ display: "flex" }}>
              {glyphs("Guilherme")}
            </div>
            <div style={{ display: "flex" }}>
              {glyphs("Pureza")}
              <span style={{ color: FAINT }}>.</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 30, fontSize: 32, fontWeight: 500, letterSpacing: "-0.03em" }}>
            <span style={{ fontFamily: "Geist Mono", color: FAINT, fontWeight: 400 }}>&lt;</span>
            <div style={{ display: "flex" }}>
              {glyphs(hero.role)}
            </div>
            <span style={{ fontFamily: "Geist Mono", color: FAINT, fontWeight: 400, marginLeft: 8 }}>/&gt;</span>
            <span style={{ width: 15, height: 30, marginLeft: 8, background: FG }} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: 18,
            borderTop: `1px solid ${LINE_STRONG}`,
            ...label,
          }}
        >
          <span>{hero.stack}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: FG }}>
            <span style={{ width: 9, height: 9, borderRadius: 9, background: SIGNAL }} />
            <span>purezag.vercel.app</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: sansMedium, weight: 500, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
