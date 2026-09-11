import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Marked } from "marked";

const CONTENT_DIR = join(process.cwd(), "content", "docs");

export interface DocHeading {
  id: string;
  text: string;
  depth: number;
}

export interface Doc {
  slug: string[];
  href: string;
  title: string;
  description: string;
  html: string;
  headings: DocHeading[];
}

function firstParagraph(html: string): string {
  const match = html.match(/<p>([\s\S]*?)<\/p>/);
  if (!match) return "";
  const text = match[1]
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= 160) return text;
  const cut = text.slice(0, 157);
  const stop = cut.lastIndexOf(" ");
  return `${(stop > 80 ? cut.slice(0, stop) : cut).replace(/[,.;:]$/, "")}...`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fileToSlug(relative: string): string[] {
  const withoutExtension = relative.replace(/\.md$/, "");
  const parts = withoutExtension.split("/");
  if (parts[parts.length - 1] === "README") parts.pop();
  return parts;
}

function walk(dir: string, prefix = ""): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name < b.name ? -1 : 1,
  )) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...walk(join(dir, entry.name), rel));
    else if (entry.name.endsWith(".md")) out.push(rel);
  }
  return out;
}

export function allDocFiles(): string[] {
  return existsSync(CONTENT_DIR) ? walk(CONTENT_DIR) : [];
}

export function allDocSlugs(): string[][] {
  return allDocFiles().map(fileToSlug);
}

const BLUEPRINT_README = /^(?:\.\.\/)+packages\/blueprints\/blueprints\/([^/]+)\/([^/]+)\/README\.md$/;
const GUIDE_FROM_BLUEPRINT = /^(?:\.\.\/)+docs\/guide\/([^/]+)\.md$/;

function rewriteHref(href: string, fromDir: string[]): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("#") || href.startsWith("/")) {
    return href;
  }

  const blueprint = href.match(BLUEPRINT_README);
  if (blueprint) return `/docs/blueprints/${blueprint[1]}/${blueprint[2]}`;

  const guide = href.match(GUIDE_FROM_BLUEPRINT);
  if (guide) return `/docs/${guide[1]}`;

  if (/^(?:\.\.\/)+MIGRATION\.md$/.test(href)) return "/docs/migration";

  const fromRoot = href.match(/^\.?\/?docs\/guide\/(.*)$/);
  if (fromRoot) {
    const rest = fromRoot[1].replace(/\.md$/, "").replace(/\/$/, "");
    return rest ? `/docs/${rest}` : "/docs";
  }

  const [path, hash] = href.split("#");
  const segments = [...fromDir];
  for (const part of path.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") segments.pop();
    else segments.push(part);
  }

  const last = segments[segments.length - 1] ?? "";
  if (last.endsWith(".md")) {
    segments[segments.length - 1] = last.replace(/\.md$/, "");
    if (segments[segments.length - 1] === "README") segments.pop();
  }

  const target = ["docs", ...segments].filter(Boolean).join("/");
  return `/${target}${hash ? `#${hash}` : ""}`;
}

export function getDoc(slug: string[]): Doc | null {
  const candidates = [
    join(CONTENT_DIR, `${slug.join("/")}.md`),
    join(CONTENT_DIR, ...slug, "README.md"),
  ];
  const file = candidates.find((candidate) => existsSync(candidate));
  if (!file) return null;

  const raw = readFileSync(file, "utf8").replace(/<!--[\s\S]*?-->\n?/g, "");
  const fromDir = slug.slice(0, existsSync(candidates[0]) ? -1 : slug.length);

  const headings: DocHeading[] = [];
  const used = new Map<string, number>();
  let title = "";

  const marked = new Marked({ gfm: true, breaks: false });

  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const plain = text.replace(/<[^>]+>/g, "");
        let id = slugify(plain);
        const seen = used.get(id) ?? 0;
        used.set(id, seen + 1);
        if (seen > 0) id = `${id}-${seen}`;

        if (depth === 1 && !title) {
          title = plain;
          return "";
        }
        if (depth === 2 || depth === 3) headings.push({ id, text: plain, depth });
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
      link({ href, title: linkTitle, tokens }) {
        const text = this.parser.parseInline(tokens);
        const target = rewriteHref(href, fromDir);
        const external = /^https?:/i.test(target);
        const attrs = [
          `href="${target}"`,
          linkTitle ? `title="${linkTitle}"` : "",
          external ? 'target="_blank" rel="noreferrer"' : "",
        ]
          .filter(Boolean)
          .join(" ");
        return `<a ${attrs}>${text}</a>`;
      },
      table(token) {
        const header = token.header
          .map((cell) => `<th>${this.parser.parseInline(cell.tokens)}</th>`)
          .join("");
        const body = token.rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${this.parser.parseInline(cell.tokens)}</td>`).join("")}</tr>`,
          )
          .join("");
        return `<div class="doc-table"><table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></div>`;
      },
    },
  });

  const html = marked.parse(raw) as string;

  return {
    slug,
    href: `/docs${slug.length ? `/${slug.join("/")}` : ""}`,
    title: title || slug[slug.length - 1] || "Documentation",
    description: firstParagraph(html),
    html,
    headings,
  };
}
