import { allDocSlugs, getDoc } from "@/lib/docs";
import { getRegistry } from "@/lib/registry";
import { author, install, site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const { blueprintCount, presetCount } = getRegistry();

  const docs = allDocSlugs()
    .map((slug) => getDoc(slug))
    .filter((doc) => doc !== null)
    .map((doc) => `- [${doc.title}](${site.url}${doc.href}): ${doc.description}`)
    .join("\n");

  const body = `# ${site.name}

> ${site.description}

${site.name} is an open source command line project scaffolding engine for Node.js ${site.node}+ and TypeScript, written and maintained by ${author.name} (${author.url}). It ships ${blueprintCount} blueprints and ${presetCount} presets under the ${site.license} license.

Install and run without installing anything:

    ${install}

## Author

- Name: ${author.name}
- Role: ${author.jobTitle}
- Website: ${author.url}
- GitHub: ${author.github}
- X: ${author.x}
- LinkedIn: ${author.linkedin}

## Project

- Source: ${site.repo}
- Package: ${site.npm}
- Registry index: ${site.url}/registry/v1/index.json

## Documentation

${docs}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
