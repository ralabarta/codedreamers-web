import { existsSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import * as landingModule from "./CodeDreamersLanding";
import CodeDreamersLanding, {
  BackToTopControl,
  buildWhatsAppUrl,
  ContactArchitecture,
  families,
  filterFamilies,
  formatCount,
  getSearchText,
  observeBackToTopTargets,
  Portfolio,
} from "./CodeDreamersLanding";
import { localizeCatalog } from "./i18n/catalog";
import { getDictionary } from "./i18n/dictionaries";
import type { Locale } from "./i18n/locale";
import { PROJECT_MODE_IDS } from "./i18n/types";
import type { FamilyId, OutcomeId } from "./i18n/types";

type ProductUnderContract = {
  code: string;
  name: string;
  description?: unknown;
  includes?: unknown;
};

const canonicalLocaleHrefs = {
  es: "/es/",
  "pt-BR": "/pt-br/",
  en: "/en/",
} as const;

const expectedLocaleFlagSources: Record<Locale, string> = {
  es: "/flags/es.svg",
  "pt-BR": "/flags/pt-br.svg",
  en: "/flags/en.svg",
};

const expectedCatalogFiles = {
  es: "/catalog/codedreamers-catalog-es.pdf",
  "pt-BR": "/catalog/codedreamers-catalog-pt.pdf",
  en: "/catalog/codedreamers-catalog-en.pdf",
} as const;

const expectedFlagElements: Record<Locale, string[]> = {
  es: ["rect", "rect", "rect"],
  "pt-BR": ["rect", "path", "circle"],
  en: ["rect", "path", "rect"],
};

function escapeHtmlText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function stripSelectorVisibleText(selector: string) {
  return selector
    .replace(/<span class="sr-only">[\s\S]*?<\/span>/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

it("keeps closed mobile navigation locale links hidden and inert", () => {
  const styles = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
  const mobileStyles = styles.slice(styles.indexOf("@media (max-width: 900px)"));

  expect(mobileStyles).toMatch(
    /\.site-header nav(?:,\s*\.site-header nav\.is-open)?\s*\{[^}]*pointer-events:\s*none;[^}]*visibility:\s*hidden;/,
  );
  expect(mobileStyles).toMatch(
    /\.site-header nav\.is-open\s*\{[^}]*pointer-events:\s*auto;[^}]*visibility:\s*visible;/,
  );
  expect(mobileStyles).toMatch(
    /\.site-header > nav:not\(\.is-open\) \.locale-selector\s*\{[^}]*pointer-events:\s*none;[^}]*visibility:\s*hidden;/,
  );
});

it("exports safe local flag assets for every locale", () => {
  const localeFlagSources = (
    landingModule as typeof landingModule & {
      LOCALE_FLAG_SOURCES?: Record<Locale, string>;
    }
  ).LOCALE_FLAG_SOURCES;

  expect(localeFlagSources).toEqual(expectedLocaleFlagSources);

  for (const locale of ["es", "pt-BR", "en"] as const) {
    const fileName = expectedLocaleFlagSources[locale].split("/").slice(-1)[0];
    const flagUrl = new URL(`../public/flags/${fileName}`, import.meta.url);

    expect(existsSync(flagUrl), locale).toBe(true);
    if (!existsSync(flagUrl)) continue;

    const source = readFileSync(flagUrl, "utf8");
    const root = source.match(
      /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 3 2">([\s\S]*)<\/svg>\s*$/,
    );

    expect(root, locale).not.toBeNull();
    expect(source.match(/<svg\b/g), locale).toHaveLength(1);
    expect(source.match(/<\/svg>/g), locale).toHaveLength(1);

    const body = root?.[1] ?? "";
    expect(body, locale).not.toMatch(
      /<(?:script|foreignObject|text|image|use|style)\b/i,
    );
    expect(body, locale).not.toMatch(/\b(?:href|xlink:href)\s*=/i);
    expect(body, locale).not.toMatch(/url\s*\(|data:|(?:https?:)?\/\//i);
    expect(
      [...body.matchAll(/<([a-z][\w:-]*)\b/gi)].map((match) => match[1]),
      locale,
    ).toEqual(expectedFlagElements[locale]);
  }
});

it("binds source and built flag copies in the static verifier", () => {
  const verifier = readFileSync(
    new URL("../scripts/verify-static.mjs", import.meta.url),
    "utf8",
  );

  for (const fileName of ["es.svg", "pt-br.svg", "en.svg"]) {
    expect(verifier).toContain(`"${fileName}"`);
  }
  expect(verifier).toContain("sourceFlag.equals(builtFlag)");
  expect(verifier).toContain("assertSafeFlag(sourceFlag.toString(\"utf8\"), flagFile)");
  expect(verifier).toContain("assertSafeFlag(builtFlag.toString(\"utf8\"), flagFile)");
});

it("uses a versioned, high-contrast, self-contained favicon", () => {
  const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const favicon = readFileSync(
    new URL("../public/favicon.svg", import.meta.url),
    "utf8",
  );

  expect(index).toContain(
    '<link rel="icon" href="/favicon.svg?v=3" type="image/svg+xml" />',
  );
  expect(favicon).toMatch(
    /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 64 64">/,
  );
  expect(favicon).toContain('fill="#071b2a"');
  expect(favicon).toContain('fill="#ffffff"');
  expect(favicon).toContain('fill="#20cfd4"');
  expect(favicon).toMatch(/<rect[^>]+rx="[1-9][0-9]*"/);
  const body = favicon.slice(favicon.indexOf(">") + 1, favicon.lastIndexOf("</svg>"));
  expect(body).not.toMatch(
    /<(?:script|style|animate(?:Motion|Transform)?|set|foreignObject|iframe|object|embed|audio|video|image|use)\b|\bon[a-z]+\s*=|\b(?:href|xlink:href)\s*=|url\s*\(|data:|(?:https?:)?\/\//i,
  );
});

it("uses self-contained local SVG branding and binds exact built copies", () => {
  const verifier = readFileSync(
    new URL("../scripts/verify-static.mjs", import.meta.url),
    "utf8",
  );

  for (const fileName of ["favicon.svg", "brand-mark.svg", "brand-wordmark.svg", "og-image.svg"]) {
    const assetUrl = new URL(`../public/${fileName}`, import.meta.url);
    expect(existsSync(assetUrl), fileName).toBe(true);
    if (!existsSync(assetUrl)) continue;

    const source = readFileSync(assetUrl, "utf8");
    expect(source, fileName).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="[^"]+">/);
    const body = source.slice(source.indexOf(">") + 1, source.lastIndexOf("</svg>"));
    expect(body, fileName).not.toMatch(
      /<(?:script|animate(?:Motion|Transform)?|set|foreignObject|iframe|object|embed|audio|video|image|use)\b|\bon[a-z]+\s*=|\b(?:href|xlink:href)\s*=|url\s*\(|data:|(?:https?:)?\/\//i,
    );
  }

  expect(verifier).toContain(
    'const brandFiles = ["favicon.svg", "brand-mark.svg", "brand-wordmark.svg", "og-image.svg"]',
  );
  expect(verifier).toContain("sourceBrand.equals(builtBrand)");
  expect(verifier).toContain("assertSafeBrandSvg(sourceBrand.toString(\"utf8\"), brandFile)");
  expect(verifier).toContain("assertSafeBrandSvg(builtBrand.toString(\"utf8\"), brandFile)");
});

it.each(["es", "pt-BR", "en"] as const)(
  "renders the complete localized landing during SSR for %s",
  (locale) => {
    const dictionary = getDictionary(locale);
    const localizedFamilies = localizeCatalog(locale);
    const markup = renderToStaticMarkup(
      createElement(CodeDreamersLanding, { locale }),
    );
    const selectors = markup.match(
      new RegExp(
        `<nav class="locale-selector" aria-label="${dictionary.selector.ariaLabel}">[\\s\\S]*?</nav>`,
        "g",
      ),
    );

    expect(markup).toContain(`>${dictionary.header.links.solutions}</a>`);
    expect(markup.match(/<a class="brand" href="#inicio" aria-label="[^"]+">/g)).toHaveLength(2);
    expect(markup.match(/<img class="brand-mark" src="\/brand-mark\.svg" alt="" aria-hidden="true"/g)).toHaveLength(2);
    expect(markup.match(/<span class="brand-name">CodeDreamers<\/span>/g)).toHaveLength(2);
    expect(markup).not.toContain('class="brand-wordmark"');
    expect(markup).toContain(localizedFamilies[0].products[0].name);
    expect(markup).toContain(dictionary.catalog.includesLabel);
    expect(markup).toContain(`aria-label="${dictionary.catalog.downloadsAriaLabel}"`);
    for (const [catalogLocale, href] of Object.entries(expectedCatalogFiles)) {
      expect(markup).toContain(`href="${href}" download=""`);
      expect(markup).toContain(
        `aria-label="${dictionary.catalog.downloadAriaLabels[catalogLocale as Locale]}"`,
      );
      expect(existsSync(new URL(`../public${href}`, import.meta.url)), href).toBe(true);
    }
    expect(markup).toContain("<details");
    expect(markup).toContain("<summary>");
    expect(selectors).toHaveLength(2);
    for (const selector of selectors ?? []) {
      expect(selector.match(/<a\b/g)).toHaveLength(3);
      expect(stripSelectorVisibleText(selector)).toBe("");
      expect(stripSelectorVisibleText(selector)).not.toMatch(
        /ES|PT|EN|·|[🇪🇸🇵🇹🇧🇷🇬🇧🇺🇸]/u,
      );

      for (const [target, href] of Object.entries(canonicalLocaleHrefs)) {
        const link = selector.match(
          new RegExp(`<a href="${href}"[\\s\\S]*?</a>`),
        )?.[0];
        const targetLocale = target as Locale;

        expect(link, `${locale} selector link for ${target}`).toBeDefined();
        expect(link).toContain(`hrefLang="${target}"`);
        expect(link).toContain(
          `aria-label="${dictionary.selector.labels[targetLocale]}"`,
        );
        expect(link).not.toContain(` lang="${target}"`);
        expect(link).toContain(
          `<img class="locale-selector__flag" src="${expectedLocaleFlagSources[targetLocale]}" alt="" aria-hidden="true" width="24" height="16"/>`,
        );
        if (target === locale) {
          expect(link).toContain('aria-current="page"');
          expect(link).toContain(
            `<span class="sr-only"> (${dictionary.selector.activeLabel})</span>`,
          );
        } else {
          expect(link).not.toContain("aria-current");
          expect(link).not.toContain(dictionary.selector.activeLabel);
        }
      }
    }
    expect(markup).toContain(
      `href="mailto:codedreamers.dev@gmail.com?subject=${encodeURIComponent(dictionary.contact.mailSubject)}"`,
    );
    expect(markup).not.toMatch(/[🇪🇸🇵🇹🇧🇷🇬🇧🇺🇸]/u);
  },
);

describe("WhatsApp contact contract", () => {
  it("builds the destination once in Contact and passes the trusted href to both links", () => {
    const source = readFileSync(
      new URL("./CodeDreamersLanding.tsx", import.meta.url),
      "utf8",
    );
    const whatsappLink = source.slice(
      source.indexOf("function WhatsAppLink"),
      source.indexOf("function Contact"),
    );
    const contact = source.slice(
      source.indexOf("function Contact"),
      source.indexOf("export type CodeDreamersLandingProps"),
    );

    expect(source).toContain(
      "export function buildWhatsAppUrl(message: string): string",
    );
    expect(whatsappLink).toContain(
      "function WhatsAppLink({ href, ariaLabel }: { href: string; ariaLabel: string })",
    );
    expect(whatsappLink).toContain("href={href}");
    expect(whatsappLink).not.toMatch(/buildWhatsAppUrl|whatsappMessage|\bcopy\b/);
    expect(contact.match(/buildWhatsAppUrl\(/g)).toHaveLength(1);
    expect(contact).toContain(
      "const whatsappHref = buildWhatsAppUrl(copy.whatsappMessage);",
    );
    expect(
      contact.match(
        /<WhatsAppLink href=\{whatsappHref\} ariaLabel=\{copy\.whatsappAriaLabel\} \/>/g,
      ),
    ).toHaveLength(2);
  });

  const expectedUrls = {
    es: "https://wa.me/5352015051?text=Hola%2C%20CodeDreamers.%20Me%20gustar%C3%ADa%20conversar%20sobre%20un%20proyecto.",
    "pt-BR": "https://wa.me/5352015051?text=Ol%C3%A1%2C%20CodeDreamers.%20Gostaria%20de%20conversar%20sobre%20um%20projeto.",
    en: "https://wa.me/5352015051?text=Hello%2C%20CodeDreamers.%20I%20would%20like%20to%20discuss%20a%20project.",
  } as const;

  it.each(["es", "pt-BR", "en"] as const)(
    "builds and renders the exact safe WhatsApp destination for %s",
    (locale) => {
      const contact = getDictionary(locale).contact;
      const expectedUrl = expectedUrls[locale];
      const markup = renderToStaticMarkup(
        createElement(CodeDreamersLanding, { locale }),
      );
      const links = markup.match(/<a class="whatsapp-link"[\s\S]*?<\/a>/g) ?? [];

      expect(buildWhatsAppUrl(contact.whatsappMessage)).toBe(expectedUrl);
      expect(expectedUrl).toBe(
        `https://wa.me/5352015051?text=${encodeURIComponent(contact.whatsappMessage)}`,
      );
      expect(expectedUrl).toContain("%20");
      expect(expectedUrl).not.toContain("+");
      expect(links).toHaveLength(2);
      for (const link of links) {
        expect(link).toContain(`href="${expectedUrl}"`);
        expect(link).toContain(`aria-label="${contact.whatsappAriaLabel}"`);
        expect(link).toContain('target="_blank"');
        expect(link).toContain('rel="noreferrer"');
        expect(link.match(/<svg\b/g)).toHaveLength(1);
        expect(link).toContain('aria-hidden="true"');
        expect(link).toContain('focusable="false"');
        const svg = link.match(/<svg\b[\s\S]*?<\/svg>/)?.[0] ?? "";
        expect(svg).not.toMatch(/<(?:script|use|image)\b|\bon[a-z]+\s*=|\b(?:href|xlink:href)\s*=/i);
        expect(link.replace(/<[^>]+>/g, "").trim()).toBe("");
      }

      const visibleBody = markup
        .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "")
        .replace(/<[^>]+>/g, "");
      expect(markup.match(/href="https:\/\/wa\.me\/5352015051\?text=/g)).toHaveLength(2);
      expect(markup).not.toContain('href="tel:');
      expect(visibleBody).not.toMatch(/\+53|5352015051|52015051/);
    },
  );

  it("styles both icon-only links as 44px focusable targets without number text", () => {
    const styles = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
    const link = styles.match(/\.whatsapp-link\s*\{([^}]*)\}/)?.[1];

    expect(link).toMatch(/width:\s*44px;/);
    expect(link).toMatch(/height:\s*44px;/);
    expect(styles).toMatch(/\.whatsapp-link:focus-visible\s*\{[^}]*outline:/);
    expect(styles).not.toContain("5352015051");
  });
});

describe("Contact architecture contract", () => {
  it("renders one complete, stateless, self-contained decorative SVG", () => {
    const markup = renderToStaticMarkup(createElement(ContactArchitecture));

    expect(markup).toMatch(
      /^<svg class="contact-architecture" viewBox="0 0 520 520" aria-hidden="true" focusable="false" data-reveal="true">/,
    );
    expect(markup.match(/<svg\b/g)).toHaveLength(1);
    expect(markup.match(/class="contact-architecture__core"/g)).toHaveLength(1);
    expect(markup.match(/class="contact-architecture__core-fill"/g)).toHaveLength(1);
    expect(markup.match(/class="contact-architecture__core-ring"/g)).toHaveLength(1);
    expect(markup).toContain('cx="260" cy="260"');
    expect(markup.match(/class="contact-architecture__branch"/g)).toHaveLength(6);
    expect(markup.match(/contact-architecture__path contact-architecture__path--primary/g)).toHaveLength(6);
    expect(markup.match(/contact-architecture__path contact-architecture__path--secondary/g)).toHaveLength(6);
    expect(markup.match(/pathLength="1"/g)).toHaveLength(12);
    expect(markup.match(/class="contact-architecture__endpoint"/g)).toHaveLength(6);
    expect(markup.match(/class="contact-architecture__pulse"/g)).toHaveLength(1);
    expect(markup.match(/class="contact-architecture__signal"/g)).toHaveLength(1);
    expect(markup).not.toMatch(
      /<(?:title|desc|text|a|script|foreignObject|iframe|object|embed|use|image)\b|\bon[a-z]+\s*=|\b(?:href|xlink:href)\s*=/i,
    );
  });

  it("targets the intended second endpoint from the endpoint group", () => {
    const styles = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

    expect(styles).toMatch(
      /\.contact-architecture__endpoints\s+\.contact-architecture__endpoint:nth-child\(2\)\s*,[\s\S]*?stroke:\s*var\(--pink\);/,
    );
    expect(styles).not.toMatch(
      /\.contact-architecture__branch[^,{]*\.contact-architecture__endpoint/,
    );
  });

  it("uses no animation state, timers, callbacks, copy, or obsolete contact-route spans", () => {
    const source = readFileSync(
      new URL("./CodeDreamersLanding.tsx", import.meta.url),
      "utf8",
    );
    const component = source.slice(
      source.indexOf("export function ContactArchitecture"),
      source.indexOf("function Contact"),
    );
    const contact = source.slice(
      source.indexOf("function Contact"),
      source.indexOf("export type CodeDreamersLandingProps"),
    );

    expect(component).not.toMatch(/useState|useEffect|setTimeout|setInterval|requestAnimationFrame|on[A-Z]|Dictionary|copy|locale/);
    expect(contact).toContain("<ContactArchitecture />");
    expect(contact).not.toContain("contact-route");
    expect(contact).not.toMatch(/<span\s*\/>/);
  });

  it("binds reveal-only CSS motion and exact final reduced-motion states", () => {
    const styles = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
    const reduced = styles.slice(styles.indexOf("@media (prefers-reduced-motion: reduce)"));

    expect(styles).not.toContain(".contact-route");
    expect(styles).toMatch(/\.contact-architecture__path\s*\{[^}]*stroke-dasharray:\s*1;[^}]*stroke-dashoffset:\s*1;/);
    expect(styles).toMatch(/\.contact-architecture__endpoint\s*\{[^}]*transform-box:\s*fill-box;[^}]*transform-origin:\s*center;[^}]*opacity:\s*0;[^}]*transform:\s*scale\(0\.52\);/);
    expect(styles).toMatch(/\.contact-architecture\.is-visible \.contact-architecture__path/);
    expect(styles).toMatch(/\.contact-architecture\.is-visible \.contact-architecture__endpoint/);
    expect(styles).toMatch(/\.contact-architecture\.is-visible \.contact-architecture__pulse/);
    expect(styles).toMatch(/\.contact-architecture\.is-visible \.contact-architecture__signal/);
    expect(styles).toMatch(/@keyframes contact-architecture-path-draw/);
    expect(styles).toMatch(/@keyframes contact-architecture-node-reveal/);
    expect(styles).toMatch(/@keyframes contact-architecture-pulse/);
    expect(styles).toMatch(/@keyframes contact-architecture-signal/);
    expect(reduced).toMatch(/\.contact-architecture__path\s*\{[^}]*stroke-dashoffset:\s*0 !important;[^}]*animation:\s*none !important;/);
    expect(reduced).toMatch(/\.contact-architecture__core,[\s\S]*?\.contact-architecture__endpoint\s*\{[^}]*opacity:\s*1 !important;[^}]*transform:\s*none !important;[^}]*animation:\s*none !important;/);
    expect(reduced).toMatch(/\.contact-architecture__pulse,[\s\S]*?\.contact-architecture__signal\s*\{[^}]*opacity:\s*1 !important;[^}]*transform:\s*none !important;[^}]*animation:\s*none !important;/);
  });

  it("contains the architecture at both responsive breakpoints", () => {
    const styles = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
    const responsive900 = styles.slice(
      styles.indexOf("@media (max-width: 900px)"),
      styles.indexOf("@media (max-width: 620px)"),
    );
    const responsive620 = styles.slice(styles.indexOf("@media (max-width: 620px)"));
    const architecture900 = responsive900.match(/\.contact-architecture\s*\{([^}]*)\}/)?.[1] ?? "";
    const architecture620 = responsive620.match(/\.contact-architecture\s*\{([^}]*)\}/)?.[1] ?? "";

    for (const declarations of [architecture900, architecture620]) {
      expect(declarations).toMatch(/width:\s*min\(480px,\s*100%\);/);
      expect(declarations).toMatch(/right:\s*0;/);
      expect(declarations).toMatch(/max-width:\s*100%;/);
      expect(declarations).not.toMatch(/right:\s*-/);
      expect(declarations).not.toMatch(/translate(?:X)?\(\s*-/);
    }
  });

  it("orders the reveal so the first restrained effect completes by 1.8 seconds", () => {
    const styles = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

    expect(styles).toMatch(/\.contact-architecture\.is-visible \.contact-architecture__path\s*\{[^}]*animation:\s*contact-architecture-path-draw 680ms var\(--ease-route\) 300ms forwards;/);
    expect(styles).toMatch(/\.contact-architecture\.is-visible \.contact-architecture__path--secondary\s*\{[^}]*animation-delay:\s*620ms;/);
    expect(styles).toMatch(/\.contact-architecture\.is-visible \.contact-architecture__endpoint\s*\{[^}]*animation:\s*contact-architecture-node-reveal 230ms var\(--ease-out\) 1\.31s forwards;/);
    expect(styles).toMatch(/\.contact-architecture\.is-visible \.contact-architecture__pulse\s*\{[^}]*animation:\s*contact-architecture-pulse 250ms var\(--ease-out\) 1\.55s forwards;/);
    expect(styles).toMatch(/\.contact-architecture\.is-visible \.contact-architecture__signal\s*\{[^}]*animation:\s*contact-architecture-signal 250ms var\(--ease-route\) 1\.55s forwards;/);

    const secondaryFinish = 620 + 680;
    const endpointStart = 1310;
    const endpointFinish = endpointStart + 230;
    const effectStart = 1550;
    const effectFinish = effectStart + 250;

    expect(secondaryFinish).toBeLessThan(endpointStart);
    expect(endpointFinish).toBeLessThan(effectStart);
    expect(effectFinish).toBeLessThanOrEqual(1800);
  });
});

describe("back-to-top contract", () => {
  const expectedLabels = {
    es: "Volver al inicio",
    "pt-BR": "Voltar ao início",
    en: "Back to top",
  } as const;

  it.each(["es", "pt-BR", "en"] as const)(
    "prerenders deterministic hidden native semantics for %s",
    (locale) => {
      const markup = renderToStaticMarkup(
        createElement(CodeDreamersLanding, { locale }),
      );
      const control = markup.match(
        /<a class="back-to-top"[\s\S]*?<\/a>/,
      )?.[0] ?? "";

      expect(markup).toContain(
        '<section class="hero" id="inicio" tabindex="-1">',
      );
      expect(markup.match(/class="back-to-top"/g)).toHaveLength(1);
      expect(control).toContain('href="#inicio"');
      expect(control).toContain(`aria-label="${expectedLabels[locale]}"`);
      expect(control).toContain('aria-hidden="true"');
      expect(control).toContain('tabindex="-1"');
      expect(control).toContain('<svg');
      expect(control).toContain('aria-hidden="true"');
      expect(control).toContain('focusable="false"');
    },
  );

  it("makes observer visibility inert while the mobile menu is open and restores it on close", () => {
    const copy = getDictionary("en").backToTop;
    const heroRef = { current: null };
    const renderControl = (mobileMenuOpen: boolean) =>
      renderToStaticMarkup(
        createElement(BackToTopControl, {
          copy,
          heroRef,
          observerVisible: true,
          mobileMenuOpen,
        }),
      );

    const visible = renderControl(false).match(/^<a[^>]+>/)?.[0] ?? "";
    const hidden = renderControl(true).match(/^<a[^>]+>/)?.[0] ?? "";
    const resumed = renderControl(false).match(/^<a[^>]+>/)?.[0] ?? "";

    expect(visible).toContain('class="back-to-top is-visible"');
    expect(visible).not.toContain('aria-hidden="true"');
    expect(visible).toContain('tabindex="0"');
    expect(hidden).toContain('class="back-to-top"');
    expect(hidden).not.toContain('class="back-to-top is-visible"');
    expect(hidden).toContain('aria-hidden="true"');
    expect(hidden).toContain('tabindex="-1"');
    expect(resumed).toBe(visible);

    const source = readFileSync(
      new URL("./CodeDreamersLanding.tsx", import.meta.url),
      "utf8",
    );
    const component = source.slice(
      source.indexOf("function BackToTop"),
      source.indexOf("function OutcomeNavigator"),
    );
    expect(component).toContain("mobileMenuOpen");
    expect(source).toContain("mobileMenuOpen={menuOpen}");
  });

  it("uses one observer for exactly hero, Contact, and footer until cleanup", () => {
    const hero = {} as Element;
    const contact = {} as Element;
    const footer = {} as Element;
    const observed: Element[] = [];
    const visibility: boolean[] = [];
    let callback: IntersectionObserverCallback = () => undefined;
    let options: IntersectionObserverInit | undefined;
    let disconnectCount = 0;
    let instanceCount = 0;

    class MockObserver {
      readonly root = null;
      readonly rootMargin = "0px";
      readonly thresholds = [0];

      constructor(nextCallback: IntersectionObserverCallback, nextOptions?: IntersectionObserverInit) {
        instanceCount += 1;
        callback = nextCallback;
        options = nextOptions;
      }

      observe(target: Element) { observed.push(target); }
      unobserve() {}
      disconnect() { disconnectCount += 1; }
      takeRecords() { return []; }
    }

    const cleanup = observeBackToTopTargets(
      { hero, contact, footer },
      (visible) => visibility.push(visible),
      MockObserver as unknown as typeof IntersectionObserver,
    );
    const entry = (target: Element, isIntersecting: boolean) =>
      ({ target, isIntersecting }) as IntersectionObserverEntry;

    expect(instanceCount).toBe(1);
    expect(observed).toEqual([hero, contact, footer]);
    expect(options).toEqual({ root: null, rootMargin: "0px", threshold: 0 });
    expect(visibility).toEqual([]);

    callback([entry(hero, false)], {} as IntersectionObserver);
    callback([entry(contact, false)], {} as IntersectionObserver);
    expect(visibility).toEqual([]);
    callback([entry(footer, false)], {} as IntersectionObserver);
    expect(visibility).toEqual([true]);
    callback([entry(contact, true)], {} as IntersectionObserver);
    callback([entry(contact, false), entry(footer, true)], {} as IntersectionObserver);
    callback([entry(footer, false)], {} as IntersectionObserver);
    callback([entry(hero, true)], {} as IntersectionObserver);
    expect(visibility).toEqual([true, false, false, true, false]);

    cleanup();
    expect(disconnectCount).toBe(1);
  });

  it("keeps native hash navigation and performs one frame-delayed focus handoff", () => {
    const source = readFileSync(
      new URL("./CodeDreamersLanding.tsx", import.meta.url),
      "utf8",
    );
    const component = source.slice(
      source.indexOf("function BackToTop"),
      source.indexOf("function OutcomeNavigator"),
    );

    expect(component).toContain('href="#inicio"');
    expect(component).toContain("window.requestAnimationFrame(() => {");
    expect(component).toContain("heroRef.current?.focus({ preventScroll: true });");
    expect(component).not.toMatch(/preventDefault|setTimeout|setInterval|scrollTo|scrollIntoView/);
    expect(component).toContain('typeof window.IntersectionObserver === "undefined"');
  });

  it("styles hidden and visible states, safe areas, focus, stacking, and reduced motion", () => {
    const styles = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
    const control = styles.match(/\.back-to-top\s*\{([^}]*)\}/)?.[1];
    const hidden = styles.match(/\.back-to-top\[aria-hidden="true"\]\s*\{([^}]*)\}/)?.[1];
    const mobile = styles.slice(styles.indexOf("@media (max-width: 620px)"));
    const reduced = styles.slice(styles.indexOf("@media (prefers-reduced-motion: reduce)"));

    expect(control).toMatch(/position:\s*fixed;/);
    expect(control).toMatch(/width:\s*44px;/);
    expect(control).toMatch(/height:\s*44px;/);
    expect(control).toMatch(/right:\s*max\(1rem,\s*env\(safe-area-inset-right\)\);/);
    expect(control).toMatch(/bottom:\s*max\(1rem,\s*env\(safe-area-inset-bottom\)\);/);
    expect(control).toMatch(/z-index:\s*[1-4][0-9];/);
    expect(hidden).toMatch(/visibility:\s*hidden;/);
    expect(hidden).toMatch(/pointer-events:\s*none;/);
    expect(styles).toMatch(/\.back-to-top:focus-visible\s*\{[^}]*outline:\s*(?:2|3)px/);
    expect(mobile).toMatch(/\.back-to-top\s*\{[^}]*right:\s*max\(0\.75rem,\s*env\(safe-area-inset-right\)\);/);
    expect(mobile).toMatch(/\.back-to-top\s*\{[^}]*bottom:\s*calc\(8rem \+ env\(safe-area-inset-bottom, 0px\)\);/);
    expect(reduced).toMatch(/\*,\s*\*::before,\s*\*::after\s*\{[^}]*transition-duration:\s*0\.01ms !important;/);
  });
});

it("keeps rendered localized copy out of the shared component source", () => {
  const source = readFileSync(
    new URL("./CodeDreamersLanding.tsx", import.meta.url),
    "utf8",
  );

  for (const formerLiteral of [
    "Software para",
    "54 productos digitales",
    "Una ruta, cinco resultados",
    "Una ruta cinco resultados",
    "54 formas de empezar",
    "Buscar solución",
    "No encontramos esa solución",
    "Ecosistema conectado",
    "16 formatos.",
    "Plataformas sectoriales",
    "Modalidades de proyecto",
    "Próxima coordenada",
    "Navegación principal",
    "Quiero activar un proyecto con CodeDreamers",
    "Quiero%20activar%20un%20proyecto%20con%20CodeDreamers",
  ]) {
    expect(source, formerLiteral).not.toContain(formerLiteral);
  }

  expect(source).toMatch(
    /writeLocalePreference\(\s*getStorage\(\(\) => window\.localStorage\),\s*target,?\s*\);/,
  );
  expect(source).toContain("onNavigate?.();");
  expect(source).toContain(
    "<LocaleSelector locale={locale} onNavigate={closeMenu} />",
  );
});

it("formats localized singular and plural counts", () => {
  const message = { one: "{count} product", other: "{count} products" };

  expect(formatCount(message, 1)).toBe("1 product");
  expect(formatCount(message, 54)).toBe("54 products");
});

const expectedOutcomeIdsByCode: Record<string, OutcomeId[]> = {
  P01: ["captar"], P02: ["captar"], P03: ["captar"], P04: ["captar"],
  P05: ["captar"], P06: ["captar"], P07: ["captar"], P08: ["captar"],
  P09: ["vender"], P10: ["vender"], P11: ["vender"], P12: ["vender"],
  P13: ["vender"], P14: ["vender"], P15: ["vender"], P16: ["vender"],
  P17: ["operar"], P18: ["operar"], P19: ["operar"], P20: ["operar"],
  P21: ["operar"], P22: ["operar"], P23: ["operar"], P24: ["operar"],
  P25: ["operar"], P26: ["operar"], P27: ["operar"], P28: ["operar"],
  P29: ["decidir"], P30: ["decidir"], P31: ["decidir"], P32: ["decidir"],
  P33: ["decidir"], P34: ["decidir"], P35: ["decidir"], P36: ["decidir"],
  P37: ["escalar"], P38: ["escalar"], P39: ["escalar"], P40: ["escalar"],
  P41: ["escalar"], P42: ["escalar"], P43: ["escalar"], P44: ["escalar"],
  P45: ["escalar"], P46: ["escalar"], P47: ["escalar"], P48: ["escalar"],
  P49: ["escalar"], P50: ["escalar"], P51: ["escalar"], P52: ["escalar"],
  P53: ["escalar"], P54: ["escalar"],
};

it("assigns every product to its deterministic business outcome", () => {
  const products = families.flatMap((family) => family.products);

  expect(products).toHaveLength(54);
  for (const product of products) {
    expect(product.outcomeIds, product.code).toEqual(
      expectedOutcomeIdsByCode[product.code],
    );
    expect(product.outcomeIds.length, product.code).toBeGreaterThan(0);
  }
});

type ApprovedCopy = {
  description: string;
  includes: [string, string, string];
};

const expectedCopyByCode: Record<string, ApprovedCopy> = {
  P01: { description: "Landing page — presenta una propuesta concreta — convierte atención en una primera acción.", includes: ["Arquitectura de mensaje", "Diseño responsive", "Formulario principal"] },
  P02: { description: "Sitio web corporativo — organiza la propuesta, la organización y sus contenidos — facilita encontrar información institucional y próximos pasos.", includes: ["Mapa de contenidos", "Plantillas de páginas", "Gestión de contenidos"] },
  P03: { description: "Micrositio de producto o campaña — comunica una oferta específica — concentra la atención del lanzamiento.", includes: ["Narrativa de campaña", "Secciones modulares", "Medición de interacciones"] },
  P04: { description: "Portal de contenidos y SEO — organiza publicaciones mediante taxonomías y plantillas orientadas a SEO — facilita encontrarlas en buscadores y dentro del portal.", includes: ["Taxonomía editorial", "Plantillas SEO", "Buscador y categorías"] },
  P05: { description: "Web de reservas y citas — gestiona disponibilidad y turnos — reduce fricción antes de la atención.", includes: ["Agenda configurable", "Flujo de reserva", "Confirmaciones y recordatorios"] },
  P06: { description: "Academia online / LMS — ordena cursos y avances — hace visible la progresión del aprendizaje.", includes: ["Catálogo de formación", "Lecciones y evaluaciones", "Seguimiento de progreso"] },
  P07: { description: "Membresía y comunidad digital — reúne miembros, recursos y conversaciones — sostiene una relación recurrente.", includes: ["Perfiles y accesos", "Contenido exclusivo", "Espacios de comunidad"] },
  P08: { description: "Configurador, calculadora o simulador — convierte variables en una respuesta — ayuda a decidir con contexto.", includes: ["Reglas de cálculo", "Interfaz paso a paso", "Resultado personalizado"] },
  P09: { description: "Funnel de ventas multicanal — ordena captación y seguimiento — convierte oportunidades en conversaciones comerciales.", includes: ["Etapas del funnel", "Captura multicanal", "Seguimiento de oportunidades"] },
  P10: { description: "CRM a medida — centraliza clientes e interacciones — mejora la continuidad comercial.", includes: ["Modelo de clientes", "Pipeline comercial", "Registro de interacciones"] },
  P11: { description: "Automatización de marketing — coordina mensajes según datos — mantiene activas las oportunidades relevantes.", includes: ["Segmentos y reglas", "Secuencias de mensajes", "Panel de resultados"] },
  P12: { description: "E-commerce B2C — presenta catálogo y cobra pedidos — acompaña la compra minorista de principio a fin.", includes: ["Catálogo y variantes", "Carrito y checkout", "Gestión de pedidos"] },
  P13: { description: "Comercio digital B2B — gestiona pedidos con condiciones empresariales — ordena la venta por volumen.", includes: ["Cuentas corporativas", "Listas de precios", "Pedidos por volumen"] },
  P14: { description: "Marketplace — conecta vendedores y compradores — amplía la oferta disponible en un mismo canal.", includes: ["Alta de vendedores", "Catálogo multioferta", "Comisiones y liquidaciones"] },
  P15: { description: "Plataforma de suscripciones — gestiona planes y cobros recurrentes — da continuidad operativa a la relación con suscriptores.", includes: ["Planes y periodicidades", "Cobros recurrentes", "Autogestión de suscriptores"] },
  P16: { description: "Fidelización y referidos — registra beneficios e invitaciones — aumenta la recurrencia de clientes.", includes: ["Reglas de puntos", "Catálogo de beneficios", "Códigos de referido"] },
  P17: { description: "Aplicación web a medida — reúne procesos y registros propios — convierte una necesidad operativa en una herramienta usable.", includes: ["Flujos de trabajo", "Roles y permisos", "Paneles operativos"] },
  P18: { description: "Aplicación móvil iOS / Android — ejecuta tareas desde el teléfono — acerca la operación al momento de trabajo.", includes: ["Interfaz móvil nativa", "Notificaciones", "Publicación en tiendas"] },
  P19: { description: "Progressive Web App (PWA) — ofrece una aplicación instalable — mantiene el acceso ágil en condiciones variables.", includes: ["Instalación desde navegador", "Caché de recursos", "Experiencia adaptable"] },
  P20: { description: "Producto SaaS — organiza acceso multiusuario, planes y administración — permite prestar y gestionar un servicio digital desde un mismo producto.", includes: ["Espacios por cliente", "Gestión de planes", "Administración del producto"] },
  P21: { description: "ERP modular — conecta procesos y registros internos — da una visión operativa compartida.", includes: ["Módulos funcionales", "Maestros compartidos", "Reportes operativos"] },
  P22: { description: "Backoffice operativo — ejecuta tareas y mantiene datos — da control al trabajo interno cotidiano.", includes: ["Bandejas de trabajo", "Edición controlada", "Historial de cambios"] },
  P23: { description: "Portal de cliente — ofrece autoservicio sobre la relación — reduce consultas operativas repetitivas.", includes: ["Acceso seguro", "Estado de solicitudes", "Gestión de datos"] },
  P24: { description: "Portal de proveedores o partners — coordina información con terceros — ordena solicitudes y entregas compartidas.", includes: ["Registro de organizaciones", "Intercambio documental", "Seguimiento de gestiones"] },
  P25: { description: "Gestión de casos o expedientes — reúne actuaciones y evidencias — mantiene cada caso trazable.", includes: ["Ficha de expediente", "Estados y asignaciones", "Cronología documental"] },
  P26: { description: "Gestión de proyectos y recursos — planifica trabajo y capacidad — hace visibles avances e hitos.", includes: ["Plan de tareas", "Asignación de recursos", "Seguimiento de hitos"] },
  P27: { description: "Field service y trabajo en campo — coordina órdenes fuera de oficina — conecta actividad con operación central.", includes: ["Agenda de visitas", "Partes de trabajo", "Seguimiento de órdenes"] },
  P28: { description: "Help desk y gestión de tickets — organiza solicitudes y estados — mejora la continuidad del soporte.", includes: ["Cola de tickets", "SLA y prioridades", "Historial de atención"] },
  P29: { description: "Integración de sistemas y APIs — intercambia información entre aplicaciones — reduce la recaptura de datos entre herramientas.", includes: ["Mapeo de datos", "Conectores y endpoints", "Registro de sincronizaciones"] },
  P30: { description: "Automatización de procesos — encadena reglas, tareas y sistemas — hace repetible el trabajo operativo.", includes: ["Modelado del flujo", "Reglas y disparadores", "Gestión de excepciones"] },
  P31: { description: "Automatización documental y aprobaciones — controla revisión y archivo — conserva trazabilidad de decisiones.", includes: ["Plantillas documentales", "Rutas de aprobación", "Versionado y auditoría"] },
  P32: { description: "Business Intelligence y dashboards — reúne indicadores del negocio — acelera la lectura para decidir.", includes: ["Modelo de métricas", "Visualizaciones interactivas", "Filtros y exportación"] },
  P33: { description: "Plataforma de datos — ingiere, transforma y sirve información — habilita usos compartidos sobre una base común.", includes: ["Pipelines de ingesta", "Capas de transformación", "Acceso a conjuntos de datos"] },
  P34: { description: "Calidad y gobierno de datos — define reglas y responsables — aumenta la confianza en la información.", includes: ["Catálogo de datos", "Reglas de calidad", "Roles y linaje"] },
  P35: { description: "Alertas y monitorización operativa — detecta eventos según umbrales — acorta el tiempo de reacción ante incidencias.", includes: ["Fuentes monitorizadas", "Umbrales y reglas", "Canales de alerta"] },
  P36: { description: "Búsqueda empresarial y base de conocimiento — indexa contenido interno — acorta el camino hacia respuestas confiables.", includes: ["Indexación de fuentes", "Buscador con filtros", "Gestión de conocimiento"] },
  P37: { description: "Chatbot inteligente — responde consultas desde fuentes definidas — agiliza la orientación y deriva los casos que lo requieren.", includes: ["Diseño de conversaciones", "Fuentes de respuesta", "Derivación de consultas"] },
  P38: { description: "Asistente transaccional — guía conversaciones y acciones autorizadas — reduce pasos en operaciones conectadas.", includes: ["Intenciones y flujos", "Integración de acciones", "Confirmaciones de usuario"] },
  P39: { description: "Copiloto de conocimiento interno — consulta procedimientos y documentos — acerca el saber organizacional al trabajo diario.", includes: ["Conexión de fuentes", "Respuestas con referencias", "Control de accesos"] },
  P40: { description: "Copiloto comercial y de servicio — prepara respuestas y contexto — ayuda a orientar la próxima acción con clientes.", includes: ["Resumen de interacciones", "Borradores asistidos", "Sugerencias de seguimiento"] },
  P41: { description: "Inteligencia documental — extrae y clasifica información — acelera la revisión de documentos.", includes: ["Clasificación documental", "Extracción de campos", "Revisión humana"] },
  P42: { description: "Agentes de IA — coordinan herramientas en límites definidos — completan tareas con trazas de ejecución.", includes: ["Objetivos y límites", "Herramientas autorizadas", "Trazas de ejecución"] },
  P43: { description: "Agentes de voz — atienden solicitudes mediante audio — operan flujos sin exigir una interfaz visual.", includes: ["Guion conversacional", "Reconocimiento y síntesis", "Integración telefónica"] },
  P44: { description: "Predicción y recomendación — estima resultados y prioriza opciones — convierte datos disponibles en orientación accionable.", includes: ["Preparación de variables", "Modelo y evaluación", "Predicciones o recomendaciones integradas"] },
  P45: { description: "Legal y compliance — organiza obligaciones y evidencias — hace comprobable el cumplimiento.", includes: ["Matriz de obligaciones", "Gestión de asuntos", "Repositorio de evidencias"] },
  P46: { description: "Salud, clínicas y bienestar — coordina atención e información — ordena la experiencia de pacientes y equipos.", includes: ["Agenda asistencial", "Registro de atención", "Portal de pacientes"] },
  P47: { description: "Inmobiliario, arquitectura y construcción — gestiona activos y proyectos — conecta obra con documentación técnica.", includes: ["Inventario de activos", "Seguimiento de obra", "Documentación técnica"] },
  P48: { description: "Retail y marcas de consumo — conecta catálogo y operación comercial — mantiene una visión coherente de la marca.", includes: ["Catálogo omnicanal", "Gestión de promociones", "Panel comercial"] },
  P49: { description: "Educación y servicios profesionales — organiza programas, participantes y entregas — da continuidad a la prestación del servicio.", includes: ["Catálogo de programas o servicios", "Gestión de participantes o clientes", "Seguimiento de entregas"] },
  P50: { description: "Logística y transporte — coordina envíos y recorridos — hace visible el estado de la operación.", includes: ["Planificación de despachos", "Seguimiento de estados", "Gestión de incidencias"] },
  P51: { description: "Finanzas y seguros — digitaliza solicitudes y aplica reglas de evaluación — centraliza el avance de cada operación.", includes: ["Flujos de solicitud", "Reglas de evaluación", "Portal de operaciones"] },
  P52: { description: "Turismo y hospitality — coordina oferta y reservas — mejora la continuidad de la experiencia huésped.", includes: ["Inventario y tarifas", "Reservas de servicios", "Gestión de huéspedes"] },
  P53: { description: "Industria y mantenimiento — planifica intervenciones sobre equipos — reduce fricción en la continuidad operativa.", includes: ["Inventario de equipos", "Órdenes de mantenimiento", "Historial de intervenciones"] },
  P54: { description: "Sector público y organizaciones — gestiona trámites, solicitudes y programas — hace visible su estado para equipos y ciudadanía.", includes: ["Catálogo de trámites", "Gestión de solicitudes", "Seguimiento de expedientes"] },
};

const expectedCatalog = [
  { id: "experiencia", name: "Experiencia digital", products: [["P01", "Landing page de conversión"], ["P02", "Sitio web corporativo"], ["P03", "Micrositio de producto o campaña"], ["P04", "Portal de contenidos & SEO"], ["P05", "Web de reservas & citas"], ["P06", "Academia online / LMS"], ["P07", "Membresía & comunidad digital"], ["P08", "Configurador, calculadora o simulador"]] },
  { id: "ventas", name: "Ventas & comercio", products: [["P09", "Funnel de ventas multicanal"], ["P10", "CRM a medida"], ["P11", "Automatización de marketing"], ["P12", "E-commerce B2C"], ["P13", "Comercio digital B2B"], ["P14", "Marketplace"], ["P15", "Plataforma de suscripciones"], ["P16", "Fidelización & referidos"]] },
  { id: "operaciones", name: "Apps & operaciones", products: [["P17", "Aplicación web a medida"], ["P18", "Aplicación móvil iOS / Android"], ["P19", "Progressive Web App (PWA)"], ["P20", "Producto SaaS"], ["P21", "ERP modular"], ["P22", "Backoffice operativo"], ["P23", "Portal de cliente"], ["P24", "Portal de proveedores o partners"], ["P25", "Gestión de casos o expedientes"], ["P26", "Gestión de proyectos & recursos"], ["P27", "Field service & trabajo en campo"], ["P28", "Help desk & gestión de tickets"]] },
  { id: "datos", name: "Datos & automatización", products: [["P29", "Integración de sistemas & APIs"], ["P30", "Automatización de procesos"], ["P31", "Automatización documental & aprobaciones"], ["P32", "Business Intelligence & dashboards"], ["P33", "Plataforma de datos"], ["P34", "Calidad & gobierno de datos"], ["P35", "Alertas & monitorización operativa"], ["P36", "Búsqueda empresarial & base de conocimiento"]] },
  { id: "ia", name: "IA aplicada", products: [["P37", "Chatbot inteligente"], ["P38", "Asistente transaccional"], ["P39", "Copiloto de conocimiento interno"], ["P40", "Copiloto comercial & de servicio"], ["P41", "Inteligencia documental"], ["P42", "Agentes de IA"], ["P43", "Agentes de voz"], ["P44", "Predicción & recomendación"]] },
  { id: "sectoriales", name: "Plataformas sectoriales", products: [["P45", "Legal & compliance"], ["P46", "Salud, clínicas & bienestar"], ["P47", "Inmobiliario, arquitectura & construcción"], ["P48", "Retail & marcas de consumo"], ["P49", "Educación & servicios profesionales"], ["P50", "Logística & transporte"], ["P51", "Finanzas & seguros"], ["P52", "Turismo & hospitality"], ["P53", "Industria & mantenimiento"], ["P54", "Sector público & organizaciones"]] },
] as const;

describe("product catalog data contract", () => {
  it("preserves all identities and gives every product one description and three inclusions", () => {
    const products = families.flatMap((family) => family.products as readonly ProductUnderContract[]);
    expect(families.map((family) => ({ id: family.id, name: family.name, products: family.products.map((product) => [product.code, product.name]) }))).toEqual(expectedCatalog);
    expect(products).toHaveLength(54);
    const codes = products.map((product) => product.code);
    expect(codes).toEqual(Array.from({ length: 54 }, (_, index) => `P${String(index + 1).padStart(2, "0")}`));
    expect(new Set(codes).size).toBe(54);
    for (const product of products) {
      expect(typeof product.description, product.code).toBe("string");
      expect((product.description as string).trim(), product.code).not.toBe("");
      expect(Array.isArray(product.includes), product.code).toBe(true);
      expect(product.includes, product.code).toHaveLength(3);
      for (const includedItem of product.includes as unknown[]) {
        expect(typeof includedItem, product.code).toBe("string");
        expect((includedItem as string).trim(), product.code).not.toBe("");
      }
    }
  });
});

it("preserves the approved copy contract for every product", () => {
  const products = families.flatMap(
    (family) => family.products as readonly ProductUnderContract[],
  );

  expect(Object.keys(expectedCopyByCode)).toHaveLength(54);
  expect(products.map((product) => product.code)).toEqual(
    Object.keys(expectedCopyByCode),
  );

  for (const product of products) {
    expect(typeof product.description, product.code).toBe("string");
    expect(Array.isArray(product.includes), product.code).toBe(true);
    const approvedProduct = product as ProductUnderContract & ApprovedCopy;
    const expected = expectedCopyByCode[approvedProduct.code];
    expect(approvedProduct.description, approvedProduct.code).toBe(expected.description);
    expect(approvedProduct.includes, approvedProduct.code).toEqual(expected.includes);
    expect(approvedProduct.description.trim(), approvedProduct.code).not.toBe("");
    expect(approvedProduct.includes, approvedProduct.code).toHaveLength(3);
    expect(
      approvedProduct.includes.every((item) => item.trim() !== ""),
      approvedProduct.code,
    ).toBe(true);
    expect(new Set(approvedProduct.includes).size, approvedProduct.code).toBe(3);
  }
});

describe("project modality native disclosures", () => {
  it.each(["es", "pt-BR", "en"] as const)(
    "renders nine complete, independent disclosure rows for %s",
    (locale) => {
      const copy = getDictionary(locale).projectModes;
      const markup = renderToStaticMarkup(
        createElement(CodeDreamersLanding, { locale }),
      );
      const section = markup.match(
        /<section class="project-modes section-pad">[\s\S]*?<\/section>/,
      )?.[0] ?? "";
      const disclosures = section.match(/<details class="project-mode">[\s\S]*?<\/details>/g) ?? [];

      expect(disclosures).toHaveLength(9);
      expect(section).not.toMatch(/<(?:dialog|button)\b|\bopen=|\bname=/);

      PROJECT_MODE_IDS.forEach((id, index) => {
        const mode = copy.items[id];
        const disclosure = disclosures[index] ?? "";
        const summary = disclosure.match(/<summary>[\s\S]*?<\/summary>/)?.[0] ?? "";
        const panel = disclosure.match(/<div class="project-mode__panel">[\s\S]*?<\/div>/)?.[0] ?? "";
        const ctas = panel.match(/<a\b[\s\S]*?<\/a>/g) ?? [];

        expect(summary, id).toContain(String(index + 1).padStart(2, "0"));
        expect(summary, id).toContain(escapeHtmlText(mode.name));
        expect(summary, id).toContain('class="arrow arrow--right" aria-hidden="true"');
        expect(summary, id).not.toMatch(/<a\b|href=|mailto:|onClick|onKeyDown/);
        expect(panel, id).toContain(escapeHtmlText(mode.description));
        expect(panel, id).toContain(escapeHtmlText(copy.includesLabel));
        expect(panel.match(/<li>/g), id).toHaveLength(3);
        for (const inclusion of mode.inclusions) {
          expect(panel, `${id}: ${inclusion}`).toContain(escapeHtmlText(inclusion));
        }
        expect(ctas, id).toHaveLength(1);
        expect(ctas[0], id).toContain(`>${escapeHtmlText(mode.ctaLabel)}<`);
        expect(ctas[0], id).toContain(
          `href="mailto:codedreamers.dev@gmail.com?subject=${encodeURIComponent(
            `${copy.emailSubjectPrefix} · ${mode.name}`,
          )}"`,
        );
      });
    },
  );

  it("uses only uncontrolled native disclosure semantics", () => {
    const source = readFileSync(
      new URL("./CodeDreamersLanding.tsx", import.meta.url),
      "utf8",
    );
    const component = source.slice(
      source.indexOf("function ProjectModes"),
      source.indexOf("function Contact"),
    );

    expect(component).toContain("PROJECT_MODE_IDS.map");
    expect(component).toContain("<details");
    expect(component).toContain("<summary>");
    expect(component).not.toMatch(/useState|<dialog|role="dialog"|aria-expanded|onClick|onKeyDown|\bopen=/);
  });

  it("styles focus, open state, panel spacing, touch targets, and compact layout", () => {
    const styles = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
    const compactBreakpoint = styles.slice(styles.indexOf("@media (max-width: 620px)"));
    const summary = styles.match(/\.project-mode summary\s*\{([^}]*)\}/)?.[1];
    const cta = styles.match(/\.project-mode__cta\s*\{([^}]*)\}/)?.[1];
    const panel = styles.match(/\.project-mode__panel\s*\{([^}]*)\}/)?.[1];

    expect(summary).toMatch(/min-height:\s*44px;/);
    expect(cta).toMatch(/min-height:\s*44px;/);
    expect(panel).toMatch(/padding:/);
    expect(styles).toMatch(/\.project-mode summary:focus-visible\s*\{[^}]*outline:/);
    expect(styles).toMatch(/\.project-mode\[open\] summary \.arrow\s*\{[^}]*transform:\s*rotate\(180deg\);/);
    expect(compactBreakpoint).toMatch(/\.project-modes > ol\s*\{[^}]*grid-template-columns:\s*1fr;/);
    expect(compactBreakpoint).toMatch(/\.project-mode__panel\s*\{[^}]*overflow-wrap:\s*anywhere;/);
    expect(styles).not.toContain(".project-mode-link");
    expect(styles).not.toMatch(/\.project-modes li a\s*\{/);
  });
});

it("keeps locale selectors accessible and responsive", () => {
  const styles = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
  const mobileBreakpoint = styles.slice(styles.indexOf("@media (max-width: 900px)"));
  const compactBreakpoint = styles.slice(styles.indexOf("@media (max-width: 620px)"));
  const mobileMenu = mobileBreakpoint.match(
    /\.site-header nav,\s*\.site-header nav\.is-open\s*\{([^}]*)\}/,
  )?.[1];
  const localeLinks = styles.match(/\.site-header \.locale-selector a\s*\{([^}]*)\}/)?.[1];
  const localeFlag = styles.match(/\.locale-selector__flag\s*\{([^}]*)\}/)?.[1];
  const brand = styles.match(/\.brand\s*\{([^}]*)\}/)?.[1];
  const brandMark = styles.match(/\.brand-mark\s*\{([^}]*)\}/)?.[1];
  const brandName = styles.match(/\.brand-name\s*\{([^}]*)\}/)?.[1];
  const compactBrand = compactBreakpoint.match(/\.brand\s*\{([^}]*)\}/)?.[1];
  const activeLocale = styles.match(
    /\.locale-selector a\[aria-current="page"\]\s*\{([^}]*)\}/,
  )?.[1];
  const focusedLocale = styles.match(/\.locale-selector a:focus-visible\s*\{([^}]*)\}/)?.[1];
  const compactHeroHeading = compactBreakpoint.match(/\.hero h1\s*\{([^}]*)\}/)?.[1];

  expect(mobileMenu).toMatch(
    /justify-content:\s*flex-start;[\s\S]*justify-content:\s*safe center;/,
  );
  expect(localeLinks).toMatch(/min-height:\s*44px;/);
  expect(localeLinks).toMatch(/min-width:\s*44px;/);
  expect(styles).not.toMatch(/\.locale-selector (?:span|i)\s*\{/);
  expect(localeFlag).toMatch(/width:\s*24px;/);
  expect(localeFlag).toMatch(/height:\s*16px;/);
  expect(localeFlag).toMatch(/display:\s*block;/);
  expect(localeFlag).toMatch(/object-fit:\s*cover;/);
  expect(localeFlag).toMatch(/border-radius:\s*2px;/);
  expect(brand).toMatch(/min-height:\s*44px;/);
  expect(brand).toMatch(/max-width:\s*100%;/);
  expect(brandMark).toMatch(/width:\s*clamp\(36px,\s*3\.4vw,\s*44px\);/);
  expect(brandMark).toMatch(/height:\s*auto;/);
  expect(brandName).toMatch(/font-family:\s*var\(--font-display\);/);
  expect(brandName).toMatch(/font-variation-settings:\s*"wght" 700;/);
  expect(compactBrand).toMatch(/min-width:\s*0;/);
  expect(styles).toMatch(
    /\.site-header > nav \.locale-selector\s*\{[^}]*display:\s*none;[^}]*\}/,
  );
  expect(mobileBreakpoint).toMatch(
    /\.site-header > \.locale-selector\s*\{[^}]*display:\s*none;[^}]*\}/,
  );
  expect(mobileBreakpoint).toMatch(
    /\.site-header > nav \.locale-selector\s*\{[^}]*display:\s*flex;[^}]*visibility:\s*visible;[^}]*\}/,
  );
  expect(mobileBreakpoint).toMatch(
    /\.site-header > nav > a\s*\{[^}]*overflow-wrap:\s*anywhere;[^}]*\}/,
  );
  expect(activeLocale).toMatch(/border-color:\s*currentColor;/);
  expect(activeLocale).toMatch(/box-shadow:\s*inset 0 -3px 0 currentColor;/);
  expect(activeLocale).not.toMatch(/text-decoration:\s*underline;/);
  expect(focusedLocale).toMatch(/outline:\s*3px solid var\(--amber\);/);
  expect(compactHeroHeading).toMatch(/max-width:\s*100%;/);
  expect(compactHeroHeading).toMatch(
    /font-size:\s*clamp\(2\.5rem,\s*13vw,\s*4\.4rem\);/,
  );
  expect(compactHeroHeading).toMatch(/letter-spacing:\s*-0\.04em;/);
});

it("keeps the compact hero title break scoped and preserves localized word separators", () => {
  const styles = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
  const compactBreakpoint = styles.slice(styles.indexOf("@media (max-width: 620px)"));

  expect(compactBreakpoint).toMatch(
    /\.hero h1 > span:first-child > br\s*\{[^}]*display:\s*none;[^}]*\}/,
  );
  expect(compactBreakpoint).not.toContain(".hero h1 br:nth-of-type(1)");

  for (const locale of ["es", "pt-BR", "en"] as const) {
    const markup = renderToStaticMarkup(
      createElement(CodeDreamersLanding, { locale }),
    );
    const heading = markup.match(/<h1>([\s\S]*?)<\/h1>/)?.[1] ?? "";
    const textWithHiddenBreaks = heading
      .replace(/<br\/>/g, "")
      .replace(/<[^>]+>/g, "");

    expect(textWithHiddenBreaks, locale).toBe(
      getDictionary(locale).hero.title.join(" "),
    );
  }
});

it("keeps catalog downloads touch-friendly and the footer fluid with visible mobile summary", () => {
  const styles = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
  const mobileBreakpoint = styles.slice(styles.indexOf("@media (max-width: 900px)"));
  const downloadLink = styles.match(/\.catalog-downloads__link\s*\{([^}]*)\}/)?.[1];
  const footer = styles.match(/\.contact footer\s*\{([^}]*)\}/)?.[1];
  const footerContactAnchors = styles.match(
    /\.contact footer > div > a\s*\{([^}]*)\}/,
  )?.[1];

  expect(downloadLink).toMatch(/min-height:\s*44px;/);
  expect(downloadLink).toMatch(/overflow-wrap:\s*anywhere;/);
  expect(footer).not.toMatch(/position:\s*absolute;/);
  expect(footer).toMatch(/position:\s*relative;/);
  expect(mobileBreakpoint).toMatch(
    /\.contact footer\s*\{[^}]*grid-template-columns:\s*1fr;[^}]*\}/,
  );
  expect(mobileBreakpoint).not.toMatch(
    /\.contact footer p\s*\{[^}]*display:\s*none;/,
  );
  expect(footerContactAnchors).toMatch(/display:\s*(?:inline-)?flex;/);
  expect(footerContactAnchors).toMatch(/min-height:\s*44px;/);
  expect(footerContactAnchors).toMatch(/overflow-wrap:\s*anywhere;/);
  expect(styles).toMatch(/--cyan-dark:\s*#[0-9a-fA-F]{6};/);
});

it("keeps source wiring for outcome selection, native portfolio navigation, and focused button reveal", () => {
  const source = readFileSync(
    new URL("./CodeDreamersLanding.tsx", import.meta.url),
    "utf8",
  );
  const styles = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

  expect(source).toContain("onClick={() => onSelectOutcome(activeOutcome.id)}");
  expect(source).toContain('href="#cartera"');
  expect(source).not.toContain('behavior: "smooth"');
  expect(source).toContain(
    "const revealFocusedButton = (event: FocusEvent<HTMLDivElement>) => {",
  );
  expect(source).toContain(
    'target.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });',
  );
  expect(source).toContain('className="outcome-tabs" role="group" aria-label={copy.ariaLabel} onFocus={revealFocusedButton}');
  expect(source).toMatch(
    /<div\s+className="family-filter"\s+role="group"\s+aria-label=\{copy\.familyFilterAriaLabel\}\s+onFocus=\{revealFocusedButton\}\s*>/,
  );
  expect(source.match(/onFocus=\{revealFocusedButton\}/g)).toHaveLength(2);
  expect(styles).toMatch(
    /@media \(max-width: 900px\)[\s\S]*?\.outcome-tabs button:focus-visible\s*\{\s*outline-offset: -5px;\s*\}/,
  );
  expect(styles).toMatch(
    /@media \(max-width: 900px\)[\s\S]*?\.family-filter button:focus-visible\s*\{\s*outline-offset: -5px;\s*\}/,
  );
  expect(source).toContain('useEffect(() => {\n    setActiveFamily("all");\n  }, [activeOutcome]);');
  expect(source).toContain("onClearOutcome: () => void;");
  expect(source).toContain("onClearOutcome();");
  expect(source).toContain('<Portfolio');
  expect(source).toContain("onClearOutcome={() => setActiveOutcome(null)}");
});

it("renders the portfolio toolbar and product details accessibly", () => {
  const markup = renderToStaticMarkup(
    createElement(Portfolio, {
      activeOutcome: "captar",
      copy: getDictionary("es").catalog,
      families,
      locale: "es",
      onClearOutcome: () => undefined,
    }),
  );

  expect(markup).toContain('role="group" aria-label="Filtrar por familia"');
  expect(markup).toContain('type="button" aria-pressed="true"');
  expect(markup).toContain(
    '<p class="portfolio-result" aria-live="polite" aria-atomic="true">',
  );
  expect(markup).toContain("Mostrando 8 productos");
  expect(markup.match(/aria-live="polite"/g)).toHaveLength(1);
  expect(markup.indexOf('class="portfolio-toolbar"')).toBeLessThan(
    markup.indexOf('class="portfolio-result"'),
  );
  expect(markup.indexOf('class="portfolio-result"')).toBeLessThan(
    markup.indexOf('class="product-ledger"'),
  );
  expect(markup).toContain('type="search" aria-label="Buscar solución"');
  expect(markup).toContain("<details");
  expect(markup).toContain("<summary>");
});

describe("catalog filtering helpers", () => {
  const codes = (familyId: FamilyId | null, outcomeId: "all" | OutcomeId, query: string) =>
    filterFamilies(families, outcomeId, familyId, query, "es").flatMap((family) =>
      family.products.map((product) => product.code),
    );

  it("returns all 54 products for null, all, and an empty query", () => {
    expect(codes(null, "all", "")).toHaveLength(54);
  });

  it("filters operar products and keeps equivalent operations family filtering", () => {
    const operatingCodes = Array.from({ length: 12 }, (_, index) => `P${String(index + 17).padStart(2, "0")}`);

    expect(codes(null, "operar", "")).toEqual(operatingCodes);
    expect(codes("operaciones", "operar", "")).toEqual(operatingCodes);
  });

  it("combines outcomes with product searches and removes empty families", () => {
    expect(codes(null, "operar", "tickets")).toEqual(["P28"]);
    expect(codes("operaciones", "operar", "tickets")).toEqual(["P28"]);
    expect(codes("operaciones", "vender", "checkout")).toEqual([]);
    expect(filterFamilies(families, "captar", null, "P54", "es")).toEqual([]);
    expect(codes(null, "decidir", "dashboard")).toEqual(["P32"]);
  });

  it("matches Spanish queries regardless of accents, casing, or normalization form", () => {
    expect(codes(null, "vender", "  AuToMaTiZaCiOn  ")).toEqual(["P11"]);
    expect(codes(null, "vender", "Automatización")).toEqual(["P11"]);
    expect(codes(null, "vender", "Automatización")).toEqual(["P11"]);
  });

  it("does not mutate the source catalog while filtering", () => {
    const originalFamilies = structuredClone(families);

    filterFamilies(families, "operar", "operaciones", "tickets", "es");
    filterFamilies(families, "vender", null, "Automatización", "es");
    filterFamilies(families, "all", "experiencia", "landing", "es");

    expect(families).toEqual(originalFamilies);
  });

  it("restores the eight-product experience family after clearing filters", () => {
    expect(codes("experiencia", "all", "")).toHaveLength(8);
  });

  it("indexes only searchable product copy, never outcome IDs", () => {
    const product = families[2].products[11];
    const searchText = getSearchText(product, "es");

    expect(searchText).toContain(product.code.toLowerCase());
    expect(searchText).toContain(product.name.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es"));
    expect(searchText).toContain(product.description.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es"));
    for (const includedItem of product.includes) {
      expect(searchText).toContain(includedItem.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es"));
    }
    expect(searchText).not.toContain(product.outcomeIds[0]);
  });

  it("keeps every approved product copy free of contact language", () => {
    for (const product of families.flatMap((family) => family.products)) {
      expect(`${product.description} ${product.includes.join(" ")}`).not.toMatch(/contact(?:o|a|ar|e|os|as)?/i);
    }
  });
});
