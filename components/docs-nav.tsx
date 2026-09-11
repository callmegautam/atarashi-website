"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/lib/docs-nav";

export function DocsNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className="space-y-9">
      {docsNav.map((group) => (
        <div key={group.heading}>
          <h2 className="label text-text-3">{group.heading}</h2>
          <ul className="mt-4 space-y-1">
            {group.items.map((item) => {
              const href = `/docs${item.slug.length ? `/${item.slug.join("/")}` : ""}`;
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`-ml-3 block py-1.5 pl-3 text-[0.9375rem] ${
                      active
                        ? "border-l-2 border-accent font-medium text-text"
                        : "border-l-2 border-transparent text-text-2 hover:text-text"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
