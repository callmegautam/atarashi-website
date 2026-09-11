import { author, authorProfiles, site } from "./site";

const ids = {
  website: `${site.url}/#website`,
  software: `${site.url}/#software`,
  author: `${site.url}/#gautam-suthar`,
};

export const authorRef = { "@id": ids.author };

export function personSchema() {
  return {
    "@type": "Person",
    "@id": ids.author,
    name: author.name,
    alternateName: author.alternateName,
    jobTitle: author.jobTitle,
    description: author.summary,
    url: author.url,
    email: `mailto:${author.email}`,
    sameAs: [...authorProfiles],
    knowsAbout: [
      "Node.js",
      "TypeScript",
      "Backend engineering",
      "Developer tooling",
      "Project scaffolding",
      "Open source software",
    ],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    url: site.url,
    name: site.name,
    alternateName: `${site.name} CLI`,
    description: site.description,
    inLanguage: "en",
    author: authorRef,
    creator: authorRef,
    publisher: authorRef,
    copyrightHolder: authorRef,
    about: { "@id": ids.software },
  };
}

export function softwareSchema(blueprintCount?: number, presetCount?: number) {
  const description = blueprintCount
    ? `${site.description} It ships ${blueprintCount} blueprints and ${presetCount} presets.`
    : site.description;

  return {
    "@type": ["SoftwareApplication", "SoftwareSourceCode"],
    "@id": ids.software,
    name: site.name,
    alternateName: "atarashi CLI",
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Command line project scaffolding",
    operatingSystem: "Linux, macOS, Windows",
    softwareVersion: site.version,
    runtimePlatform: `Node.js ${site.node}+`,
    programmingLanguage: "TypeScript",
    codeRepository: site.repo,
    downloadUrl: site.npm,
    installUrl: site.npm,
    url: site.url,
    description,
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    author: authorRef,
    creator: authorRef,
    maintainer: authorRef,
    copyrightHolder: authorRef,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Composable blueprints that declare capabilities instead of depending on each other",
      "Conflict detection that refuses invalid plans before writing any file",
      "Dry run planning that prints every file and dependency",
      "Reproducible regeneration from atarashi.json",
      "Offline generation with the registry as an optimisation",
      "Third party blueprints published on npm",
    ],
  };
}

export function breadcrumbSchema(trail: { name: string; href: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.href}`,
    })),
  };
}

export function articleSchema(doc: {
  title: string;
  href: string;
  description: string;
}) {
  return {
    "@type": "TechArticle",
    "@id": `${site.url}${doc.href}#article`,
    headline: doc.title,
    name: doc.title,
    description: doc.description,
    url: `${site.url}${doc.href}`,
    inLanguage: "en",
    isPartOf: { "@id": ids.website },
    about: { "@id": ids.software },
    author: authorRef,
    creator: authorRef,
    publisher: authorRef,
    license: "https://opensource.org/licenses/MIT",
  };
}

export function graph(...nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
