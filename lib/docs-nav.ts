export const docsNav = [
  {
    heading: "Start here",
    items: [
      { label: "Overview", slug: [] },
      { label: "Getting started", slug: ["getting-started"] },
      { label: "Migrating from v0.6", slug: ["migration"] },
    ],
  },
  {
    heading: "Reference",
    items: [
      { label: "CLI reference", slug: ["cli"] },
      { label: "Blueprint catalogue", slug: ["blueprints"] },
      { label: "Presets", slug: ["presets"] },
      { label: "Configuration", slug: ["configuration"] },
    ],
  },
  {
    heading: "Guides",
    items: [
      { label: "Recipes", slug: ["recipes"] },
      { label: "Troubleshooting", slug: ["troubleshooting"] },
    ],
  },
  {
    heading: "Extending",
    items: [
      { label: "Authoring blueprints", slug: ["authoring-blueprints"] },
      { label: "Plugin API", slug: ["plugin-api"] },
    ],
  },
] as const;
