import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { build } from "esbuild";

const root = new URL("../", import.meta.url);
const bundle = new URL(".tmp/render-docs.mjs", root);
await mkdir(new URL(".tmp/", root), { recursive: true });
await build({
  entryPoints: [new URL("apps/preview/src/server.tsx", root).pathname],
  outfile: bundle.pathname,
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
});
const { pages, renderPage } = await import(bundle.href);
const dist = new URL("apps/preview/dist/", root);
const template = await readFile(new URL("index.html", dist), "utf8");
const escape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");
for (const page of pages) {
  const html = template
    .replace(
      /<title>.*?<\/title>/,
      `<title>${escape(page.title)} · Polli</title>`,
    )
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?\s*>/,
      `<meta name="description" content="${escape(page.description)}">`,
    )
    .replace(
      '<div id="root"></div>',
      `<div id="root" data-page="${page.id}">${renderPage(page.id)}</div>`,
    );
  if (!html.includes(`data-page="${page.id}"`))
    throw new Error("Could not prerender the documentation root.");
  await writeFile(
    new URL(page.id === "overview" ? "index.html" : `${page.id}.html`, dist),
    html,
  );
}
await mkdir(new URL("font-licenses/", dist), { recursive: true });
for (const name of ["Lora-OFL.txt", "Patrick-Hand-OFL.txt", "Inter-OFL.txt"]) {
  await copyFile(
    new URL(`apps/preview/src/fonts/licenses/${name}`, root),
    new URL(`font-licenses/${name}`, dist),
  );
}
console.log(`Prerendered ${pages.length} documentation pages.`);
