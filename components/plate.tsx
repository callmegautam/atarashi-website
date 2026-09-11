import type { ReactNode } from "react";
import { Container, Grid } from "./container";

export function Plate({
  index,
  title,
  headline,
  lede,
  id,
  tone = "ground",
  children,
}: {
  index: string;
  title: string;
  headline: string;
  lede?: string;
  id?: string;
  tone?: "ground" | "ground-2" | "ink";
  children?: ReactNode;
}) {
  const inverted = tone === "ink";
  const surface =
    tone === "ink"
      ? "bg-text text-ground"
      : tone === "ground-2"
        ? "bg-ground-2 text-text"
        : "bg-ground text-text";

  return (
    <section
      id={id}
      className={`${surface} py-[var(--plate-y)]`}
      {...(inverted ? { "data-on-accent": "" } : {})}
    >
      <Container>
        <Grid>
          <div className="col-span-4 md:col-span-8 lg:col-span-9">
            <p className="label mb-6">
              <span className={inverted ? "text-ground" : "text-text"}>{index}</span>
              <span className={inverted ? "text-accent-text" : "text-accent-text"}> / </span>
              <span className={inverted ? "text-ground/70" : "text-text-3"}>{title}</span>
            </p>
            <h2 className="display-l max-w-[18ch]">{headline}</h2>
            {lede ? (
              <p
                className={`lede mt-8 max-w-[48ch] ${inverted ? "text-ground/85" : "text-text-2"}`}
              >
                {lede}
              </p>
            ) : null}
          </div>
        </Grid>
        {children ? <div className="mt-14 md:mt-20">{children}</div> : null}
      </Container>
    </section>
  );
}
