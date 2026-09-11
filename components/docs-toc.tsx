import type { DocHeading } from "@/lib/docs";

export function DocsToc({ headings }: { headings: DocHeading[] }) {
  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="sticky top-24">
      <h2 className="label text-text-3">On this page</h2>
      <ul className="mt-4 space-y-1.5">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.depth === 3 ? "pl-4" : ""}>
            <a
              href={`#${heading.id}`}
              className="block text-[0.875rem] leading-snug text-text-2 hover:text-accent-text"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
