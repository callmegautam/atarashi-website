import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { KanjiMark } from "@/components/kanji-mark";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container className="py-24 md:py-36">
      <span
        aria-hidden="true"
        className="mb-12 flex size-20 items-center justify-center bg-accent text-on-accent"
      >
        <KanjiMark className="size-14" />
      </span>

      <p className="label text-text-3">Error 404</p>
      <h1 className="display-l mt-6 max-w-[16ch]">This page was never written.</h1>
      <p className="lede mt-8 max-w-[46ch] text-text-2">
        The address does not match anything on the site. The documentation index is
        the best place to pick the thread back up.
      </p>

      <p className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
        <Link href="/docs" className="label underline decoration-accent decoration-2 underline-offset-[6px]">
          Documentation
        </Link>
        <Link href="/" className="label underline decoration-accent decoration-2 underline-offset-[6px]">
          Home
        </Link>
      </p>
    </Container>
  );
}
