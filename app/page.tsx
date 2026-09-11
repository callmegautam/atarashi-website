import Link from "next/link";
import { Container, Grid } from "@/components/container";
import { CopyCommand } from "@/components/copy-command";
import { KanjiMark } from "@/components/kanji-mark";
import { Plate } from "@/components/plate";
import { getRegistry } from "@/lib/registry";
import { addCommand, author, guarantees, install, site } from "@/lib/site";

export default function Home() {
  const { blueprintCount, presetCount, presets, categories } = getRegistry();

  return (
    <>
      <section className="relative overflow-hidden bg-ground pt-14 pb-24 md:pt-20 md:pb-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[32%] justify-center bg-accent text-on-accent lg:flex"
        >
          <KanjiMark className="mt-[12vh] h-auto w-[58%] self-start" />
        </div>

        <Container className="relative">
          <Grid>
            <div className="col-span-4 md:col-span-8 lg:col-span-7">
              <span
                aria-hidden="true"
                className="mb-10 flex size-14 items-center justify-center bg-accent text-on-accent lg:hidden"
              >
                <KanjiMark className="size-9" />
              </span>

              <p className="label text-text-3">
                v{site.version} / {site.license} / Node {site.node}+
              </p>

              <h1 className="display-xl mt-8 max-w-[13ch]">
                Choose what it does. Not which folder to copy.
              </h1>

              <p className="lede mt-10 max-w-[48ch] text-text-2">
                Atarashi builds a project out of {blueprintCount} small composable
                blueprints. You pick capabilities: an HTTP framework, a database, an
                ORM, auth, testing. It resolves them, adds what you forgot, refuses
                what cannot work, and writes nothing to disk until the whole plan is
                valid.
              </p>
            </div>
          </Grid>

          <Grid className="mt-14">
            <div className="col-span-4 md:col-span-8 lg:col-span-8">
              <CopyCommand command={install} size="lg" />
              <p className="mono-sm mt-4 text-text-3">
                No install required. Runs straight from npm.
              </p>
            </div>
          </Grid>
        </Container>
      </section>

      <Plate
        index="01"
        title="Compose"
        headline="Blueprints declare capabilities, not each other."
        lede="orm/drizzle requires a SQL database. It does not care which one, so it works with Postgres, MySQL or SQLite, and Atarashi works out the rest."
      >
        <Grid>
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <p className="text-text-2">
              Ask for an ORM on its own and it tells you a database is missing, then
              names the ones that would satisfy it. Ask for two databases and it
              refuses, naming both. When exactly one blueprint can satisfy a
              requirement, it is added for you.
            </p>
            <p className="mt-6 text-text-2">
              That indirection is the reason a project generated weeks ago can still
              grow a new capability. The choices are recorded in atarashi.json, which
              is what makes atarashi add possible later.
            </p>
          </div>

          <div className="col-span-4 mt-10 md:col-span-8 lg:col-span-4 lg:col-start-9 lg:mt-0">
            <h3 className="label text-text-3">
              {blueprintCount} blueprints by category
            </h3>
            <dl className="mt-5 bg-ground-2 p-6">
              {categories.map((category) => (
                <div
                  key={category.label}
                  className="flex items-baseline justify-between py-1.5"
                >
                  <dt className="mono-sm text-text-2">{category.label}</dt>
                  <dd className="mono-sm text-text">{category.count}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Grid>
      </Plate>

      <Plate
        index="02"
        title="Refuse"
        headline="Nothing is written until the plan is valid."
        lede="A conflict is an error with a suggested fix, never a half generated directory."
        tone="ground-2"
      >
        <Grid>
          {guarantees.map((item) => (
            <div key={item.label} className="col-span-4 md:col-span-4 lg:col-span-4">
              <h3 className="label text-accent-text">{item.label}</h3>
              <p className="mt-4 text-text-2">{item.body}</p>
            </div>
          ))}
        </Grid>
      </Plate>

      <Plate
        index="03"
        title="Grow"
        headline="Three weeks later, in the same project."
        lede="Generated files carry region markers, so a blueprint contributes into a named slot instead of owning a whole file. Adding a capability later injects into those markers rather than scattering new files."
        tone="ink"
      >
        <Grid>
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <CopyCommand command={addCommand} />
          </div>
        </Grid>
      </Plate>

      <Plate
        index="04"
        title="Sets"
        headline={`${presetCount} presets, known to work together.`}
        lede="Start from one and adjust it. Add a blueprint, remove another, keep the rest."
      >
        <Grid className="gap-y-12">
          {presets.map((preset) => (
            <article key={preset.id} className="col-span-4 md:col-span-4 lg:col-span-4">
              <h3 className="mono-sm text-accent-text">{preset.id}</h3>
              <p className="display-m mt-3">{preset.name}</p>
              <p className="mt-3 text-text-2">{preset.description}</p>
            </article>
          ))}
        </Grid>
      </Plate>

      <Plate
        index="05"
        title="Extend"
        headline="Third party blueprints are not second class."
        lede="They use the same format and the same validator as the first party ones."
        tone="ground-2"
      >
        <Grid>
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <p className="text-text-2">
              A blueprint is data, not code: a blueprint.json and a files tree.
              Scaffold one with atarashi create-blueprint, publish it on npm as
              atarashi-blueprint-something, and anyone can add it. Hooks run in a
              restricted worker with no filesystem and no child processes.
            </p>
          </div>
          <div className="col-span-4 mt-8 md:col-span-8 lg:col-span-4 lg:col-start-9 lg:mt-0">
            <p className="text-text-2">
              Nothing Atarashi generates depends on Atarashi. The output is an
              ordinary project, and atarashi eject cuts the last link whenever you
              want it gone.
            </p>
          </div>
        </Grid>
      </Plate>

      <section data-on-accent="" className="bg-accent py-[var(--plate-y)] text-on-accent">
        <Container>
          <Grid>
            <div className="col-span-4 md:col-span-8 lg:col-span-8">
              <h2 className="display-l max-w-[16ch]">Try it without installing anything.</h2>
              <div className="mt-10">
                <CopyCommand command={install} size="lg" tone="ground" />
              </div>
              <p className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                <Link
                  href={site.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="label underline decoration-2 underline-offset-[6px]"
                >
                  Source
                </Link>
                <Link
                  href={site.npm}
                  target="_blank"
                  rel="noreferrer"
                  className="label underline decoration-2 underline-offset-[6px]"
                >
                  Package
                </Link>
                <Link
                  href="/docs"
                  className="label underline decoration-2 underline-offset-[6px]"
                >
                  Documentation
                </Link>
                <Link
                  href={author.url}
                  target="_blank"
                  rel="author noreferrer"
                  className="label underline decoration-2 underline-offset-[6px]"
                >
                  By {author.name}
                </Link>
              </p>
            </div>
          </Grid>
        </Container>
      </section>
    </>
  );
}
