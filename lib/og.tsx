import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { author, site } from "./site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GROUND = "#ededea";
const INK = "#111110";
const MUTED = "#57564f";
const ACCENT = "#e8481f";

const KANJI =
  "M868.0 41.0C807.0 74.0 707.0 106.0 612.0 129.0L542.0 109.0V458.0C542.0 596.0 530.0 767.0 414.0 890.0C442.0 904.0 485.0 945.0 500.0 972.0C633.0 834.0 655.0 621.0 656.0 472.0H757.0V964.0H874.0V472.0H969.0V361.0H656.0V220.0C761.0 199.0 875.0 168.0 964.0 128.0ZM103.0 242.0C117.0 276.0 130.0 320.0 134.0 353.0H41.0V451.0H221.0V528.0H44.0V629.0H198.0C151.0 705.0 82.0 779.0 16.0 822.0C41.0 842.0 76.0 881.0 94.0 907.0C137.0 872.0 182.0 823.0 221.0 767.0V968.0H337.0V754.0C366.0 782.0 394.0 812.0 410.0 832.0L480.0 746.0C458.0 728.0 372.0 662.0 337.0 638.0V629.0H503.0V528.0H337.0V451.0H512.0V353.0H410.0C425.0 323.0 441.0 283.0 459.0 239.0L398.0 227.0H504.0V130.0H337.0V39.0H221.0V130.0H53.0V227.0H166.0ZM199.0 227.0H350.0C341.0 262.0 326.0 307.0 312.0 338.0L384.0 353.0H178.0L232.0 338.0C228.0 308.0 215.0 262.0 199.0 227.0Z";

export async function ogFonts() {
  const [archivo, plexMono] = await Promise.all([
    readFile(join(process.cwd(), "assets", "Archivo-Bold.ttf")),
    readFile(join(process.cwd(), "assets", "IBMPlexMono-Regular.ttf")),
  ]);

  return [
    { name: "Archivo", data: archivo, style: "normal" as const, weight: 700 as const },
    { name: "Plex", data: plexMono, style: "normal" as const, weight: 400 as const },
  ];
}

export function OgFrame({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: GROUND,
        color: INK,
        fontFamily: "Archivo",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 840,
          padding: "64px 56px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                background: ACCENT,
              }}
            >
              <svg width="30" height="30" viewBox="0 0 1000 1000">
                <path d={KANJI} fill={INK} />
              </svg>
            </div>
            <div
              style={{
                marginLeft: 16,
                fontSize: 26,
                letterSpacing: "-0.02em",
              }}
            >
              {site.name}
            </div>
            <div
              style={{
                marginLeft: 20,
                fontFamily: "Plex",
                fontSize: 18,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              {eyebrow}
            </div>
          </div>

          <div
            style={{
              marginTop: 48,
              fontSize: title.length > 46 ? 62 : 76,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              maxWidth: 700,
            }}
          >
            {title}
          </div>

          {lede ? (
            <div
              style={{
                marginTop: 28,
                fontSize: 26,
                lineHeight: 1.4,
                color: MUTED,
                maxWidth: 660,
                fontFamily: "Plex",
              }}
            >
              {lede}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: "Plex",
            fontSize: 20,
            color: MUTED,
          }}
        >
          <div style={{ display: "flex", color: INK }}>atarashi.gautamsuthar.in</div>
          <div style={{ display: "flex", margin: "0 12px" }}>/</div>
          <div style={{ display: "flex" }}>by {author.name}</div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          width: 360,
          height: "100%",
          background: ACCENT,
        }}
      >
        <svg width="230" height="230" viewBox="0 0 1000 1000" style={{ marginTop: 120 }}>
          <path d={KANJI} fill={INK} />
        </svg>
      </div>
    </div>
  );
}
