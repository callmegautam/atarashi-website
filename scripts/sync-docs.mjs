import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const flag = (name, fallback) => {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
};

const DEFAULT_SOURCE = join(root, "..", "atarashi");
const source = resolve(process.env.ATARASHI_REPO ?? flag("source", DEFAULT_SOURCE));
const target = join(root, "content", "docs");
const check = process.argv.includes("--check");

const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");

function fail(message, ...hints) {
  console.error(`\nsync-docs: ${message}`);
  for (const hint of hints) console.error(`  ${hint}`);
  process.exit(1);
}

if (!existsSync(source)) {
  fail(
    `no CLI repo at ${source}`,
    "Point at it: node scripts/sync-docs.mjs --source <path>",
  );
}

const guideDir = join(source, "docs", "guide");
if (!existsSync(guideDir)) fail(`${source} has no docs/guide`);

async function walk(dir, prefix = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => (a.name < b.name ? -1 : 1))) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...(await walk(join(dir, entry.name), rel)));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(rel);
  }
  return files;
}

const planned = [];

for (const rel of await walk(guideDir)) {
  planned.push({ from: join(guideDir, rel), to: rel });
}

const migration = join(source, "MIGRATION.md");
if (existsSync(migration)) planned.push({ from: migration, to: "migration.md" });

const blueprintsRoot = join(source, "packages", "blueprints", "blueprints");
if (existsSync(blueprintsRoot)) {
  for (const namespace of await readdir(blueprintsRoot, { withFileTypes: true })) {
    if (!namespace.isDirectory()) continue;
    const nsDir = join(blueprintsRoot, namespace.name);
    for (const name of await readdir(nsDir, { withFileTypes: true })) {
      if (!name.isDirectory()) continue;
      const readme = join(nsDir, name.name, "README.md");
      if (existsSync(readme)) {
        planned.push({ from: readme, to: `blueprints/${namespace.name}/${name.name}.md` });
      }
    }
  }
}

planned.sort((a, b) => (a.to < b.to ? -1 : 1));

if (planned.length === 0) fail("nothing to sync");

if (check) {
  const problems = [];
  for (const item of planned) {
    const copy = join(target, item.to);
    if (!existsSync(copy)) {
      problems.push(`missing: ${item.to}`);
      continue;
    }
    const [a, b] = await Promise.all([readFile(item.from), readFile(copy)]);
    if (sha256(a) !== sha256(b)) problems.push(`differs: ${item.to}`);
  }
  const expected = new Set(planned.map((item) => item.to));
  for (const rel of existsSync(target) ? await walk(target) : []) {
    if (!expected.has(rel)) problems.push(`extra: ${rel}`);
  }
  if (problems.length > 0) {
    fail(
      `content/docs does not match ${relative(root, source)}`,
      ...problems.slice(0, 10),
      "Run: bun run sync:docs",
    );
  }
  console.log(`docs: ${planned.length} files match the CLI repo`);
  process.exit(0);
}

await rm(target, { recursive: true, force: true });
for (const item of planned) {
  const destination = join(target, item.to);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, await readFile(item.from));
}

const guides = planned.filter((i) => !i.to.startsWith("blueprints/")).length;
console.log(`docs: ${guides} guide pages, ${planned.length - guides} blueprint pages`);
console.log(`→ ${planned.length} files into content/docs`);
