import { readFileSync } from "node:fs";
import { join } from "node:path";

interface RegistryEntry {
  id: string;
  kind: "blueprint" | "preset";
  name: string;
  version: string;
  description: string;
  category: string;
}

interface RegistryIndex {
  version: string;
  entries: RegistryEntry[];
}

const CATEGORY_LABELS: Record<string, string> = {
  core: "runtime",
  http: "http",
  database: "database",
  orm: "orm",
  auth: "auth",
  validation: "validation",
  middleware: "middleware",
  observability: "logging",
  lint: "lint",
  test: "test",
  infra: "infra",
  ci: "ci",
  frontend: "frontend",
  meta: "meta",
};

function readIndex(): RegistryIndex {
  const path = join(process.cwd(), "public", "registry", "v1", "index.json");
  return JSON.parse(readFileSync(path, "utf8")) as RegistryIndex;
}

export function getRegistry() {
  const index = readIndex();
  const blueprints = index.entries.filter((entry) => entry.kind === "blueprint");
  const presets = index.entries
    .filter((entry) => entry.kind === "preset")
    .map((entry) => ({
      id: entry.id.replace(/^preset\//, ""),
      name: entry.name,
      description: entry.description,
    }));

  const counts = new Map<string, number>();
  for (const blueprint of blueprints) {
    counts.set(blueprint.category, (counts.get(blueprint.category) ?? 0) + 1);
  }

  const categories = [...counts.entries()]
    .map(([key, count]) => ({ label: CATEGORY_LABELS[key] ?? key, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  return {
    version: index.version,
    blueprintCount: blueprints.length,
    presetCount: presets.length,
    presets,
    categories,
  };
}
