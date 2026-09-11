import { ImageResponse } from "next/og";
import { OgFrame, contentType, ogFonts, size } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
export { contentType, size };

export default async function Image() {
  return new ImageResponse(
    <OgFrame
      eyebrow={`v${site.version} / ${site.license} / Node ${site.node}+`}
      title="Choose what it does. Not which folder to copy."
      lede="Composable blueprints for Node.js and TypeScript projects."
    />,
    { ...size, fonts: await ogFonts() },
  );
}
