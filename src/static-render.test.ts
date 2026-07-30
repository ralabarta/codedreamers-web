import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { getDictionary } from "./i18n/dictionaries";
import type { Locale } from "./i18n/locale";
import {
  escapeHtml,
  organizationJsonLd,
  renderEntryDocument,
  renderLocaleDocument,
  SITE_ORIGIN,
} from "./static-render";

const template = `<!doctype html>
<html lang="__HTML_LANG__">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#071b2a" />
    <!--locale-head-->
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

const expected = {
  es: {
    path: "/es/",
    title: "CodeDreamers — Software, Datos e IA",
    description:
      "54 productos digitales, plataformas empresariales, automatización, datos e IA para captar, vender, operar y escalar.",
    ogLocale: "es_ES",
    imageAlt: "CodeDreamers: 54 productos de software, datos e IA",
  },
  "pt-BR": {
    path: "/pt-br/",
    title: "CodeDreamers — Software, Dados e IA",
    description:
      "54 produtos digitais, plataformas empresariais, automação, dados e IA para atrair, vender, operar e escalar.",
    ogLocale: "pt_BR",
    imageAlt: "CodeDreamers: 54 produtos de software, dados e IA",
  },
  en: {
    path: "/en/",
    title: "CodeDreamers — Software, Data & AI",
    description:
      "54 digital products, enterprise platforms, automation, data and AI to attract, sell, operate and scale.",
    ogLocale: "en_US",
    imageAlt: "CodeDreamers: 54 software, data and AI products",
  },
} as const satisfies Record<
  Locale,
  {
    path: string;
    title: string;
    description: string;
    ogLocale: string;
    imageAlt: string;
  }
>;

const expectedWhatsAppUrls = {
  es: "https://wa.me/5352015051?text=Hola%2C%20CodeDreamers.%20Me%20gustar%C3%ADa%20conversar%20sobre%20un%20proyecto.",
  "pt-BR": "https://wa.me/5352015051?text=Ol%C3%A1%2C%20CodeDreamers.%20Gostaria%20de%20conversar%20sobre%20um%20projeto.",
  en: "https://wa.me/5352015051?text=Hello%2C%20CodeDreamers.%20I%20would%20like%20to%20discuss%20a%20project.",
} as const;

const attribute = (html: string, selector: RegExp): string => {
  const match = html.match(selector);
  expect(match).not.toBeNull();
  return match?.[1] ?? "";
};

const count = (html: string, pattern: RegExp): number =>
  Array.from(html.matchAll(pattern)).length;

it("derives static SEO metadata from dictionaries", () => {
  const source = readFileSync(
    new URL("./static-render.tsx", import.meta.url),
    "utf8",
  );

  expect(source).toMatch(
    /import \{ getDictionary \} from "\.\/i18n\/dictionaries";[\s\S]*?const localized = getDictionary\(locale\)\.seo;/,
  );
  expect(source).not.toContain("const metadata = {");
});

it("requires the Vite 8 Node.js support range", () => {
  const packageJson = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  ) as { engines: { node: string } };

  expect(packageJson.engines.node).toBe("^20.19.0 || >=22.12.0");
});

it("uses the Rolldown build configuration", () => {
  const config = readFileSync(new URL("../vite.config.ts", import.meta.url), "utf8");

  expect(config).toMatch(/build:\s*\{[\s\S]*?rolldownOptions:\s*\{/);
  expect(config).not.toContain("rollupOptions");
});

it("locks Vite at 8.0.16 or later", () => {
  const packageJson = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  ) as { devDependencies: { vite: string } };
  const [, major, minor, patch] = packageJson.devDependencies.vite.match(
    /^(\d+)\.(\d+)\.(\d+)$/,
  ) ?? [];

  expect(
    Number(major) > 8 ||
      (Number(major) === 8 &&
        (Number(minor) > 0 || (Number(minor) === 0 && Number(patch) >= 16))),
  ).toBe(true);
});

describe("static locale rendering", () => {
  it("uses the production site origin", () => {
    expect(SITE_ORIGIN).toBe("https://codedreamers.surge.sh");
  });

  for (const locale of ["es", "pt-BR", "en"] as const) {
    it(`renders exact localized metadata and body copy for ${locale}`, () => {
      const html = renderLocaleDocument(template, locale);
      const metadata = expected[locale];
      const canonical = `${SITE_ORIGIN}${metadata.path}`;
      const product = getDictionary(locale).catalog.products.P01;

      expect(attribute(html, /<html lang="([^"]+)">/)).toBe(locale);
      expect(attribute(html, /<title>([^<]+)<\/title>/)).toBe(
        escapeHtml(metadata.title),
      );
      expect(
        attribute(html, /<meta name="description" content="([^"]+)" \/>/),
      ).toBe(escapeHtml(metadata.description));
      expect(attribute(html, /<meta property="og:title" content="([^"]+)" \/>/)).toBe(
        escapeHtml(metadata.title),
      );
      expect(
        attribute(html, /<meta property="og:description" content="([^"]+)" \/>/),
      ).toBe(escapeHtml(metadata.description));
      expect(attribute(html, /<meta property="og:locale" content="([^"]+)" \/>/)).toBe(
        metadata.ogLocale,
      );
      expect(attribute(html, /<meta property="og:url" content="([^"]+)" \/>/)).toBe(
        canonical,
      );
      expect(
        attribute(html, /<meta property="og:image:alt" content="([^"]+)" \/>/),
      ).toBe(escapeHtml(metadata.imageAlt));
      expect(attribute(html, /<meta name="twitter:title" content="([^"]+)" \/>/)).toBe(
        escapeHtml(metadata.title),
      );
      expect(
        attribute(html, /<meta name="twitter:description" content="([^"]+)" \/>/),
      ).toBe(escapeHtml(metadata.description));
      expect(count(html, /<link rel="canonical"/g)).toBe(1);
      expect(html).toContain('<link rel="icon" href="/favicon.svg" type="image/svg+xml" />');
      expect(attribute(html, /<link rel="canonical" href="([^"]+)" \/>/)).toBe(
        canonical,
      );
      expect(count(html, /<link rel="alternate" hreflang=/g)).toBe(4);
      expect(html).toContain(
        `<link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/es/" />`,
      );
      expect(html).toContain(`>P01<`);
      expect(html).toContain(product.name);
      expect(html).toContain(product.description);

      const contact = getDictionary(locale).contact;
      const whatsappLinks = html.match(/<a class="whatsapp-link"[\s\S]*?<\/a>/g) ?? [];
      expect(whatsappLinks).toHaveLength(2);
      for (const link of whatsappLinks) {
        expect(link).toContain(`href="${expectedWhatsAppUrls[locale]}"`);
        expect(link).toContain(`aria-label="${escapeHtml(contact.whatsappAriaLabel)}"`);
        expect(link).toContain('target="_blank"');
        expect(link).toContain('rel="noreferrer"');
      }
      expect(html).not.toContain('href="tel:');
      const renderedBody = attribute(html, /<body>([^]*?)<\/body>/);
      const visibleBody = renderedBody
        .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "")
        .replace(/<[^>]+>/g, "");
      expect(visibleBody).not.toMatch(/\+53|5352015051|52015051/);
      expect(html).not.toMatch(/__HTML_LANG__|<!--locale-head-->|<!--app-html-->/);
    });
  }

  it("prerenders identical complete and safe Contact architecture markup for every locale", () => {
    const architectureByLocale = (["es", "pt-BR", "en"] as const).map((locale) => {
      const html = renderLocaleDocument(template, locale);
      const architecture = html.match(
        /<svg class="contact-architecture"[\s\S]*?<\/svg>/,
      )?.[0] ?? "";

      expect(architecture).toContain('viewBox="0 0 520 520"');
      expect(architecture).toContain('aria-hidden="true"');
      expect(architecture).toContain('focusable="false"');
      expect(architecture).toContain('data-reveal="true"');
      expect(architecture.match(/class="contact-architecture__branch"/g)).toHaveLength(6);
      expect(architecture.match(/class="contact-architecture__endpoint"/g)).toHaveLength(6);
      expect(architecture.match(/pathLength="1"/g)).toHaveLength(12);
      expect(architecture).toContain('class="contact-architecture__pulse"');
      expect(architecture).toContain('class="contact-architecture__signal"');
      expect(architecture).not.toMatch(
        /<(?:title|desc|text|a|script|foreignObject|iframe|object|embed|use|image)\b|\bon[a-z]+\s*=|\b(?:href|xlink:href)\s*=/i,
      );
      expect(html).not.toContain('class="contact-route"');

      return architecture;
    });

    expect(architectureByLocale[1]).toBe(architectureByLocale[0]);
    expect(architectureByLocale[2]).toBe(architectureByLocale[0]);
  });

  it("renders parseable localized Organization JSON-LD", () => {
    for (const locale of ["es", "pt-BR", "en"] as const) {
      const html = renderLocaleDocument(template, locale);
      const source = attribute(
        html,
        /<script type="application\/ld\+json">([^]*?)<\/script>/,
      );
      const data = JSON.parse(source) as Record<string, unknown>;

      expect(data).toEqual(organizationJsonLd(locale));
      expect(data).toMatchObject({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "CodeDreamers",
        url: SITE_ORIGIN,
        logo: `${SITE_ORIGIN}/brand-wordmark.svg`,
        telephone: "+53 52015051",
      });
      expect(data.description).toEqual(expect.any(String));
      expect(data.knowsAbout).toEqual(expect.arrayContaining([expect.any(String)]));
    }
  });

  it("renders an empty Spanish noindex root entry with the Spanish canonical", () => {
    const html = renderEntryDocument(template);

    expect(attribute(html, /<html lang="([^"]+)">/)).toBe("es");
    expect(count(html, /<link rel="canonical"/g)).toBe(1);
    expect(attribute(html, /<link rel="canonical" href="([^"]+)" \/>/)).toBe(
      `${SITE_ORIGIN}/es/`,
    );
    expect(html).toContain('<meta name="robots" content="noindex,follow" />');
    expect(html).toContain('<div id="root"></div>');
    expect(html).not.toMatch(/__HTML_LANG__|<!--locale-head-->|<!--app-html-->/);
  });
});
