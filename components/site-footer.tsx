import Link from "next/link";
import { author, footerColumns, site } from "@/lib/site";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-accent bg-ground-2 py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.heading}>
              <h2 className="label text-text-3">{column.heading}</h2>
              <ul className="mt-5 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...("external" in link && link.external
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                      className="text-[0.9375rem] text-text-2 underline decoration-transparent underline-offset-4 hover:text-text hover:decoration-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-ground-3 pt-6 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="mono-sm text-text-3">
            {site.name} v{site.version} · {site.license} · Node {site.node}+
          </p>
          <p className="mono-sm text-text-3">
            Built and maintained by{" "}
            <a
              href={author.url}
              target="_blank"
              rel="author noreferrer"
              title={`${author.name}, ${author.jobTitle}`}
              className="text-text-2 underline decoration-accent underline-offset-4 hover:text-text"
            >
              {author.name}
            </a>{" "}
            ·{" "}
            <a
              href={author.x}
              target="_blank"
              rel="me noreferrer"
              className="text-text-2 underline decoration-accent underline-offset-4 hover:text-text"
            >
              X
            </a>{" "}
            ·{" "}
            <a
              href={author.github}
              target="_blank"
              rel="me noreferrer"
              className="text-text-2 underline decoration-accent underline-offset-4 hover:text-text"
            >
              GitHub
            </a>{" "}
            ·{" "}
            <a
              href={author.linkedin}
              target="_blank"
              rel="me noreferrer"
              className="text-text-2 underline decoration-accent underline-offset-4 hover:text-text"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
