import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = resolve(import.meta.dirname, "..");
const distDir = resolve(projectRoot, "dist");
const serverDir = resolve(projectRoot, ".prerender");
const serverEntry = resolve(serverDir, "static-render.js");

function outputPath(...segments) {
  const target = resolve(distDir, ...segments);
  if (target !== distDir && !target.startsWith(`${distDir}${sep}`)) {
    throw new Error(`Refusing to write outside dist: ${target}`);
  }
  return target;
}

async function writeOutput(relativeSegments, html) {
  const target = outputPath(...relativeSegments);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html, "utf8");
}

try {
  const template = await readFile(outputPath("index.html"), "utf8");
  const { renderEntryDocument, renderLocaleDocument } = await import(
    pathToFileURL(serverEntry).href
  );

  for (const [locale, directory] of [
    ["es", "es"],
    ["pt-BR", "pt-br"],
    ["en", "en"],
  ]) {
    await writeOutput(
      [directory, "index.html"],
      renderLocaleDocument(template, locale),
    );
  }

  const entryHtml = renderEntryDocument(template);
  await writeOutput(["index.html"], entryHtml);
  await writeOutput(["200.html"], entryHtml);
} finally {
  await rm(serverDir, { recursive: true, force: true });
}
