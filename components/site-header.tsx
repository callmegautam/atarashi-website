import Link from "next/link";
import { nav, site } from "@/lib/site";
import { KanjiMark } from "./kanji-mark";
import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="relative bg-ground after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-accent">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center bg-accent text-on-accent"
          >
            <KanjiMark className="size-[1.375rem]" />
          </span>
          <span className="text-[0.9375rem] font-bold tracking-[-0.02em]">{site.name}</span>
        </Link>

        <div className="flex items-center gap-1 md:gap-4">
          <nav aria-label="Primary" className="hidden items-center gap-5 md:flex">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                {...("external" in item && item.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                className="label flex min-h-11 items-center text-text-3 hover:text-text"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
