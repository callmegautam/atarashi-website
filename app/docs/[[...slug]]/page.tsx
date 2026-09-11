import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { DocsNav } from "@/components/docs-nav";
import { DocsToc } from "@/components/docs-toc";
import { JsonLd } from "@/components/json-ld";
import { allDocSlugs, getDoc } from "@/lib/docs";
import { articleSchema, breadcrumbSchema, graph } from "@/lib/seo";
import { author, site } from "@/lib/site";

export function generateStaticParams() {
  return allDocSlugs().map((slug) => ({ slug: slug.length ? slug : undefined }));
}

function titleCase(segment: string) {
  return segment.replace(/-/g, " ").replace(/^./, (character) => character.toUpperCase());
}

function trailFor(slug: string[], title: string) {
  const trail = [
    { name: site.name, href: "/" },
    { name: "Documentation", href: "/docs" },
  ];

  slug.forEach((segment, index) => {
    const isLast = index === slug.length - 1;
    trail.push({
      name: isLast ? title : titleCase(segment),
      href: `/docs/${slug.slice(0, index + 1).join("/")}`,
    });
  });

  return trail;
}

export async function generateMetadata({ params }: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug ?? []);
  if (!doc) return {};

  const description = doc.description || site.description;
  const image = `/api/og?${new URLSearchParams({
    eyebrow: "Documentation",
    title: doc.title,
    lede: description,
  })}`;

  return {
    title: doc.title,
    description,
    keywords: [doc.title, `atarashi ${doc.title.toLowerCase()}`, "atarashi docs"],
    alternates: { canonical: doc.href },
    openGraph: {
      type: "article",
      title: `${doc.title} · ${site.name}`,
      description,
      url: doc.href,
      siteName: site.name,
      authors: [author.name],
      images: [{ url: image, width: 1200, height: 630, alt: `${doc.title} · ${site.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${doc.title} · ${site.name}`,
      description,
      images: [image],
    },
  };
}

export default async function DocPage({ params }: PageProps<"/docs/[[...slug]]">) {
  const { slug } = await params;
  const doc = getDoc(slug ?? []);
  if (!doc) notFound();

  const trail = trailFor(doc.slug, doc.title);

  return (
    <Container className="py-12 md:py-16">
      <JsonLd
        data={graph(
          articleSchema({
            title: doc.title,
            href: doc.href,
            description: doc.description || site.description,
          }),
          breadcrumbSchema(trail),
        )}
      />

      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="mono-sm flex flex-wrap items-center gap-x-2 text-text-3">
          {trail.map((item, index) => (
            <li key={item.href} className="flex items-center gap-x-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {index === trail.length - 1 ? (
                <span aria-current="page" className="text-text-2">
                  {item.name}
                </span>
              ) : (
                <a href={item.href} className="hover:text-text">
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-x-12 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_13rem]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <DocsNav />
          </div>
        </aside>

        <details className="mb-10 bg-ground-2 lg:hidden">
          <summary className="label cursor-pointer list-none px-5 py-4 text-text">
            Documentation menu
          </summary>
          <div className="px-5 pb-6">
            <DocsNav />
          </div>
        </details>

        <article className="min-w-0">
          <h1 className="display-m mb-10 border-b-2 border-accent pb-6">{doc.title}</h1>
          <div className="doc-prose" dangerouslySetInnerHTML={{ __html: doc.html }} />
          <p className="mono-sm mt-16 border-t border-ground-3 pt-6 text-text-3">
            Part of the {site.name} documentation, written and maintained by{" "}
            <a
              href={author.url}
              rel="author noreferrer"
              target="_blank"
              className="text-text-2 underline decoration-accent underline-offset-4 hover:text-text"
            >
              {author.name}
            </a>
            .
          </p>
        </article>

        <aside className="hidden xl:block">
          <DocsToc headings={doc.headings} />
        </aside>
      </div>
    </Container>
  );
}
