import { readFile, writeFile, mkdir, readdir, cp } from "node:fs/promises";

const base = new URL("../apps/preview/dist/", import.meta.url);
const output = new URL("../polli-ui-preview/", import.meta.url);
await mkdir(output, { recursive: true });
const assetPath = (path) =>
  new URL(`assets/${path.split("/assets/")[1]}`, base);
for (const name of await readdir(base)) {
  if (!name.endsWith(".html")) continue;
  let html = await readFile(new URL(name, base), "utf8");
  const script = html.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/);
  const style = html.match(/<link[^>]*href="([^"]+\.css)"[^>]*>/);
  if (!script || !style) throw new Error("Build the documentation first.");
  const js = await readFile(assetPath(script[1]), "utf8");
  let css = await readFile(assetPath(style[1]), "utf8");
  for (const match of [...css.matchAll(/url\(([^)]+\.woff)\)/g)]) {
    const bytes = await readFile(assetPath(match[1]));
    css = css.replace(
      match[0],
      `url(data:font/woff;base64,${bytes.toString("base64")})`,
    );
  }
  html = html.replace(
    script[0],
    () =>
      `<script type="module">${js.replaceAll("</script", "<\\/script")}</script>`,
  );
  html = html.replace(style[0], () => `<style>${css}</style>`);
  html = html.replace(/(href|src)="[^"]*\/brand\//g, '$1="./brand/');
  await writeFile(new URL(name, output), html);
}
for (const name of ["brand", "font-licenses", "r", "registry.json"]) {
  await cp(new URL(name, base), new URL(name, output), { recursive: true });
}
console.log(
  "Created offline documentation in polli-ui-preview/. Open index.html.",
);
