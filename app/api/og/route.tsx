import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { OgFrame, ogFonts, size } from "@/lib/og";
import { site } from "@/lib/site";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const title = params.get("title")?.slice(0, 110) || site.tagline;
  const eyebrow = params.get("eyebrow")?.slice(0, 60) || "Documentation";
  const lede = params.get("lede")?.slice(0, 180) || undefined;

  return new ImageResponse(<OgFrame eyebrow={eyebrow} title={title} lede={lede} />, {
    ...size,
    fonts: await ogFonts(),
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
