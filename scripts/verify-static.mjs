import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const SITE_ORIGIN = "https://codedreamers.surge.sh";
const projectRoot = resolve(import.meta.dirname, "..");
const distDir = resolve(projectRoot, "dist");
const flagFiles = ["es.svg", "pt-br.svg", "en.svg"];
const brandFiles = ["favicon.svg", "brand-mark.svg", "brand-wordmark.svg", "og-image.svg"];

const locales = {
  es: {
    file: "es/index.html",
    path: "/es/",
    title: "CodeDreamers — Software, Datos e IA",
    description:
      "54 productos digitales, plataformas empresariales, automatización, datos e IA para captar, vender, operar y escalar.",
    ogLocale: "es_ES",
  },
  "pt-BR": {
    file: "pt-br/index.html",
    path: "/pt-br/",
    title: "CodeDreamers — Software, Dados e IA",
    description:
      "54 produtos digitais, plataformas empresariais, automação, dados e IA para atrair, vender, operar e escalar.",
    ogLocale: "pt_BR",
  },
  en: {
    file: "en/index.html",
    path: "/en/",
    title: "CodeDreamers — Software, Data &amp; AI",
    description:
      "54 digital products, enterprise platforms, automation, data and AI to attract, sell, operate and scale.",
    ogLocale: "en_US",
  },
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertSafeFlag(source, label) {
  const root = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">';
  assert(source.startsWith(root), `${label}: unsafe or incorrect SVG root`);
  assert(/<\/svg>\s*$/.test(source), `${label}: missing SVG close tag`);
  assert(count(source, /<svg\b/g) === 1, `${label}: SVG must have one root`);
  assert(count(source, /<\/svg>/g) === 1, `${label}: SVG must close one root`);

  const body = source.slice(root.length, source.lastIndexOf("</svg>"));
  assert(
    !/<(?:script|foreignObject|text|image|use|style)\b/i.test(body),
    `${label}: forbidden SVG element`,
  );
  assert(!/\b(?:href|xlink:href)\s*=/i.test(body), `${label}: forbidden SVG reference`);
  assert(
    !/url\s*\(|data:|(?:https?:)?\/\//i.test(body),
    `${label}: forbidden external SVG content`,
  );
}

function assertSafeBrandSvg(source, label) {
  const root = source.match(
    /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="[0-9 .-]+">/,
  )?.[0];
  assert(root, `${label}: unsafe or incorrect SVG root`);
  assert(/<\/svg>\s*$/.test(source), `${label}: missing SVG close tag`);
  assert(count(source, /<svg\b/g) === 1, `${label}: SVG must have one root`);
  assert(count(source, /<\/svg>/g) === 1, `${label}: SVG must close one root`);

  const body = source.slice(root.length, source.lastIndexOf("</svg>"));
  assert(
    !/<(?:script|style|animate\w*|set|foreignObject|iframe|object|embed|audio|video|image|use)\b/i.test(
      body,
    ),
    `${label}: forbidden active SVG element`,
  );
  assert(!/\bon[a-z]+\s*=/i.test(body), `${label}: forbidden SVG event attribute`);
  assert(!/\b(?:href|xlink:href)\s*=/i.test(body), `${label}: forbidden SVG reference`);
  assert(
    !/url\s*\(|data:|(?:https?:)?\/\//i.test(body),
    `${label}: forbidden external SVG content`,
  );
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function count(html, pattern) {
  return Array.from(html.matchAll(pattern)).length;
}

function capture(html, pattern, label) {
  const match = html.match(pattern);
  assert(match, `Missing ${label}`);
  return match[1];
}

function verifyMetadata(html, locale, expected) {
  const canonical = `${SITE_ORIGIN}${expected.path}`;
  assert(capture(html, /<html lang="([^"]+)">/, "html lang") === locale, `${locale}: wrong lang`);
  assert(capture(html, /<title>([^<]+)<\/title>/, "title") === expected.title, `${locale}: wrong title`);
  assert(
    capture(html, /<meta name="description" content="([^"]+)" \/>/, "description") ===
      expected.description,
    `${locale}: wrong description`,
  );
  assert(
    capture(html, /<meta property="og:title" content="([^"]+)" \/>/, "OG title") ===
      expected.title,
    `${locale}: wrong OG title`,
  );
  assert(
    capture(html, /<meta property="og:description" content="([^"]+)" \/>/, "OG description") ===
      expected.description,
    `${locale}: wrong OG description`,
  );
  assert(
    capture(html, /<meta property="og:locale" content="([^"]+)" \/>/, "OG locale") ===
      expected.ogLocale,
    `${locale}: wrong OG locale`,
  );
  assert(
    capture(html, /<meta property="og:url" content="([^"]+)" \/>/, "OG URL") === canonical,
    `${locale}: wrong OG URL`,
  );
  assert(count(html, /<link rel="canonical"/g) === 1, `${locale}: canonical count is not one`);
  assert(
    capture(html, /<link rel="canonical" href="([^"]+)" \/>/, "canonical") === canonical,
    `${locale}: wrong canonical`,
  );
  assert(count(html, /<link rel="alternate" hreflang=/g) === 4, `${locale}: alternate count is not four`);

  for (const [hreflang, path] of [
    ["es", "/es/"],
    ["pt-BR", "/pt-br/"],
    ["en", "/en/"],
    ["x-default", "/es/"],
  ]) {
    const link = `<link rel="alternate" hreflang="${hreflang}" href="${SITE_ORIGIN}${path}" />`;
    assert(html.includes(link), `${locale}: missing reciprocal ${hreflang} alternate`);
  }

  assert(!/__HTML_LANG__|<!--locale-head-->|<!--app-html-->/.test(html), `${locale}: template marker remains`);
  assert(
    /<div id="root">(?:<link rel="preload" as="image" href="\/(?:brand-mark\.svg|flags\/(?:es|pt-br|en)\.svg)"\/>)*<main>/.test(
      html,
    ),
    `${locale}: root was not prerendered or contains an unexpected image preload`,
  );
  assert(
    count(html, /<link rel="preload" as="image" href="\/brand-mark\.svg"\/>/g) === 1,
    `${locale}: brand mark preload count is not one`,
  );
}

async function verifyAssets(html, pagePath) {
  const references = Array.from(
    html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"[^>]*>/g),
    (match) => match[1],
  ).filter((reference) => !reference.startsWith("http") && !reference.startsWith("#"));

  assert(references.length > 0, `${pagePath}: no client asset references found`);

  for (const reference of references) {
    const pathname = new URL(reference, `${SITE_ORIGIN}${pagePath}`).pathname;
    const target = resolve(distDir, `.${pathname}`);
    assert(target.startsWith(distDir), `${pagePath}: asset escaped dist: ${reference}`);
    await access(target);
  }
}

const serverDir = resolve(projectRoot, ".prerender");
let serverBundlePresent = true;
try {
  await access(serverDir);
} catch {
  serverBundlePresent = false;
}
assert(!serverBundlePresent, ".prerender was not removed");

const htmlFiles = ["index.html", "200.html", ...Object.values(locales).map(({ file }) => file)];
const documents = new Map();
for (const file of htmlFiles) {
  documents.set(file, await readFile(resolve(distDir, file), "utf8"));
}

for (const [locale, expected] of Object.entries(locales)) {
  const html = documents.get(expected.file);
  verifyMetadata(html, locale, expected);
  await verifyAssets(html, expected.path);
}

const rootHtml = documents.get("index.html");
const fallbackHtml = documents.get("200.html");
assert(rootHtml === fallbackHtml, "Root index and 200.html differ");
assert(capture(rootHtml, /<html lang="([^"]+)">/, "root lang") === "es", "Root lang is not Spanish");
assert(rootHtml.includes('<meta name="robots" content="noindex,follow" />'), "Root is not noindex,follow");
assert(
  count(rootHtml, /<link rel="canonical"/g) === 1 &&
    rootHtml.includes(`<link rel="canonical" href="${SITE_ORIGIN}/es/" />`),
  "Root Spanish canonical is invalid",
);
assert(/<div id="root"><\/div>/.test(rootHtml), "Root entry is not empty");
assert(!/<div id="root">\s*<main>/.test(rootHtml), "Root entry was prerendered");
await verifyAssets(rootHtml, "/");

const sitemap = await readFile(resolve(distDir, "sitemap.xml"), "utf8");
assert(count(sitemap, /<url>/g) === 3, "Sitemap must contain exactly three locale URLs");
for (const expected of Object.values(locales)) {
  const block = capture(
    sitemap,
    new RegExp(`<url>[^]*?<loc>${escapeRegExp(SITE_ORIGIN + expected.path)}<\\/loc>([^]*?)<\\/url>`),
    `sitemap block for ${expected.path}`,
  );
  assert(count(block, /<xhtml:link /g) === 4, `${expected.path}: sitemap alternate count is not four`);
  for (const [hreflang, path] of [
    ["es", "/es/"],
    ["pt-BR", "/pt-br/"],
    ["en", "/en/"],
    ["x-default", "/es/"],
  ]) {
    assert(
      block.includes(`hreflang="${hreflang}" href="${SITE_ORIGIN}${path}"`),
      `${expected.path}: sitemap missing ${hreflang}`,
    );
  }
}

for (const flagFile of flagFiles) {
  const sourceFlag = await readFile(resolve(projectRoot, "public", "flags", flagFile));
  const builtFlag = await readFile(resolve(distDir, "flags", flagFile));

  assertSafeFlag(sourceFlag.toString("utf8"), flagFile);
  assertSafeFlag(builtFlag.toString("utf8"), flagFile);
  assert(sourceFlag.equals(builtFlag), `${flagFile}: built flag differs from source`);
}

for (const brandFile of brandFiles) {
  const sourceBrand = await readFile(resolve(projectRoot, "public", brandFile));
  const builtBrand = await readFile(resolve(distDir, brandFile));

  assertSafeBrandSvg(sourceBrand.toString("utf8"), brandFile);
  assertSafeBrandSvg(builtBrand.toString("utf8"), brandFile);
  assert(sourceBrand.equals(builtBrand), `${brandFile}: built brand differs from source`);
}

console.log(
  "Static verification passed for 5 HTML files, sitemap reciprocity, 3 safe flags, and 4 safe brand assets.",
);
