import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const flag = (name, fallback) => {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
};

const DEFAULT_SOURCE = join(
  root,
  "..",
  "atarashi",
  "packages",
  "registry",
  "dist-registry",
);

const source = resolve(
  process.env.ATARASHI_REGISTRY_DIST ?? flag("source", DEFAULT_SOURCE),
);
const target = join(root, "public", "registry");
const check = process.argv.includes("--check");

async function filesIn(dir, prefix = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => (a.name < b.name ? -1 : 1))) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...(await filesIn(join(dir, entry.name), rel)));
    else if (entry.isFile()) files.push(rel);
  }
  return files;
}

const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");

function fail(message, ...hints) {
  console.error(`\nsync-registry: ${message}`);
  for (const hint of hints) console.error(`  ${hint}`);
  process.exit(1);
}

if (!existsSync(source)) {
  fail(
    `no built registry at ${source}`,
    "Build it first: pnpm --filter @atarashi/registry build:index",
    "Or point at it: node scripts/sync-registry.mjs --source <path>",
  );
}

const indexPath = join(source, "v1", "index.json");
if (!existsSync(indexPath)) fail(`${source} has no v1/index.json`);

const index = JSON.parse(readFileSync(indexPath, "utf8"));

const pinnedPath = join(source, "v1", index.version, "index.json");
if (!existsSync(pinnedPath)) {
  fail(`registry ${index.version} has no immutable copy at v1/${index.version}/index.json`);
}

const missing = index.entries
  .map((entry) => entry.tarball)
  .filter((tarball) => !existsSync(join(source, tarball)));
if (missing.length > 0) {
  fail(`${missing.length} entries reference a missing tarball`, ...missing.slice(0, 5));
}

const files = await filesIn(source);

if (check) {
  const problems = [];
  for (const file of files) {
    const copy = join(target, file);
    if (!existsSync(copy)) {
      problems.push(`missing: ${file}`);
      continue;
    }
    const [a, b] = await Promise.all([readFile(join(source, file)), readFile(copy)]);
    if (sha256(a) !== sha256(b)) problems.push(`differs: ${file}`);
  }
  for (const file of existsSync(target) ? await filesIn(target) : []) {
    if (!files.includes(file)) problems.push(`extra: ${file}`);
  }

  if (problems.length > 0) {
    fail(
      `public/registry does not match ${relative(root, source)}`,
      ...problems.slice(0, 10),
      "Run: bun run sync:registry",
    );
  }
  console.log(`registry ${index.version}: ${files.length} files match the build`);
  process.exit(0);
}

await rm(target, { recursive: true, force: true });
for (const file of files) {
  const destination = join(target, file);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, await readFile(join(source, file)));
}

const entries = index.entries.filter((entry) => entry.kind === "blueprint").length;
const presets = index.entries.length - entries;

console.log(`registry ${index.version}  ${entries} blueprints, ${presets} presets`);
console.log(`root hash ${index.integrity}`);
console.log(`updated   ${index.updatedAt}`);
console.log(`→ ${files.length} files into public/registry`);
