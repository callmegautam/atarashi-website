export const site = {
  name: "atarashi",
  version: "1.0.0",
  license: "MIT",
  node: "20.11",
  url: "https://atarashi.gautamsuthar.in",
  repo: "https://github.com/callmegautam/atarashi",
  npm: "https://www.npmjs.com/package/atarashi",
  tagline: "Choose what it does, not which folder to copy.",
  locale: "en_US",
  description:
    "Atarashi builds a project out of small composable blueprints. It resolves what you pick, adds what you forgot, refuses what cannot work, and writes nothing until the whole plan is valid.",
} as const;

export const author = {
  name: "Gautam Suthar",
  alternateName: "callmegautam",
  jobTitle: "Software Engineer",
  email: "iamgautamsuthar@gmail.com",
  url: "https://gautamsuthar.in",
  github: "https://github.com/callmegautam",
  x: "https://x.com/iamgautamsuthar",
  xHandle: "@iamgautamsuthar",
  linkedin: "https://www.linkedin.com/in/iamgautamsuthar",
  summary:
    "Gautam Suthar is a full stack software engineer and the author of Atarashi, an open source composable project scaffolding engine for Node.js and TypeScript.",
} as const;

export const authorProfiles = [author.github, author.x, author.linkedin, author.url] as const;

export const keywords = [
  "atarashi",
  "atarashi cli",
  "project scaffolding",
  "composable blueprints",
  "node.js boilerplate generator",
  "typescript backend generator",
  "express scaffolding",
  "fastify scaffolding",
  "hono scaffolding",
  "prisma drizzle mongoose starter",
  "create backend app",
  "code generator cli",
  "Gautam Suthar",
  "callmegautam",
] as const;

export const install = "npx atarashi@latest new my-api --preset backend-ts --yes";
export const addCommand = "atarashi add obs/pino";

export const nav = [
  { label: "Docs", href: "/docs" },
  { label: "Blueprints", href: "/docs/blueprints" },
  { label: "GitHub", href: site.repo, external: true },
] as const;

export const footerColumns = [
  {
    heading: "Documentation",
    links: [
      { label: "Getting started", href: "/docs" },
      { label: "CLI reference", href: "/docs/cli" },
      { label: "Blueprint catalogue", href: "/docs/blueprints" },
      { label: "Presets", href: "/docs/presets" },
    ],
  },
  {
    heading: "Project",
    links: [
      { label: "Source", href: site.repo, external: true },
      { label: "Package", href: site.npm, external: true },
      { label: "Releases", href: `${site.repo}/releases`, external: true },
      { label: "Issues", href: `${site.repo}/issues`, external: true },
    ],
  },
  {
    heading: "Registry",
    links: [
      { label: "Index", href: "/registry/v1/index.json" },
      { label: "Authoring blueprints", href: "/docs/authoring-blueprints" },
      { label: "Plugin API", href: "/docs/plugin-api" },
    ],
  },
] as const;

export const guarantees = [
  {
    label: "Dry run",
    body: "Pass --dry-run and it prints the whole plan, every file and every dependency, then writes nothing.",
  },
  {
    label: "Reproducible",
    body: "Every project records its spec in atarashi.json. Regenerating from it produces byte identical output. Generated secrets are the deliberate exception.",
  },
  {
    label: "Offline",
    body: "The blueprints ship inside the package. The registry is an optimisation, not a requirement.",
  },
] as const;
