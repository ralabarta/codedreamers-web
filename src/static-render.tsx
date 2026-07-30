import { createElement } from "react";
import { renderToString } from "react-dom/server";

import CodeDreamersLanding from "./CodeDreamersLanding";
import { LOCALE_PATHS, LOCALES } from "./i18n/locale";
import type { Locale } from "./i18n/locale";

export const SITE_ORIGIN = "https://codedreamers.surge.sh";

const metadata = {
  es: {
    title: "CodeDreamers — Software, Datos e IA",
    description:
      "54 productos digitales, plataformas empresariales, automatización, datos e IA para captar, vender, operar y escalar.",
    ogLocale: "es_ES",
    imageAlt: "CodeDreamers: 54 productos de software, datos e IA",
    organizationDescription:
      "Productos digitales, plataformas empresariales, automatización, datos e inteligencia artificial.",
    knowsAbout: [
      "Desarrollo de software",
      "Plataformas empresariales",
      "Automatización de procesos",
      "Datos y business intelligence",
      "Inteligencia artificial aplicada",
    ],
  },
  "pt-BR": {
    title: "CodeDreamers — Software, Dados e IA",
    description:
      "54 produtos digitais, plataformas empresariais, automação, dados e IA para atrair, vender, operar e escalar.",
    ogLocale: "pt_BR",
    imageAlt: "CodeDreamers: 54 produtos de software, dados e IA",
    organizationDescription:
      "Produtos digitais, plataformas empresariais, automação, dados e inteligência artificial.",
    knowsAbout: [
      "Desenvolvimento de software",
      "Plataformas empresariais",
      "Automação de processos",
      "Dados e business intelligence",
      "Inteligência artificial aplicada",
    ],
  },
  en: {
    title: "CodeDreamers — Software, Data & AI",
    description:
      "54 digital products, enterprise platforms, automation, data and AI to attract, sell, operate and scale.",
    ogLocale: "en_US",
    imageAlt: "CodeDreamers: 54 software, data and AI products",
    organizationDescription:
      "Digital products, enterprise platforms, automation, data and artificial intelligence.",
    knowsAbout: [
      "Software development",
      "Enterprise platforms",
      "Process automation",
      "Data and business intelligence",
      "Applied artificial intelligence",
    ],
  },
} as const satisfies Record<
  Locale,
  {
    title: string;
    description: string;
    ogLocale: string;
    imageAlt: string;
    organizationDescription: string;
    knowsAbout: readonly string[];
  }
>;

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]!,
  );
}

export function organizationJsonLd(locale: Locale) {
  const localized = metadata[locale];

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CodeDreamers",
    url: SITE_ORIGIN,
    email: "codedreamers.dev@gmail.com",
    telephone: "+53 52015051",
    logo: `${SITE_ORIGIN}/brand-wordmark.svg`,
    image: `${SITE_ORIGIN}/og-image.png`,
    description: localized.organizationDescription,
    knowsAbout: localized.knowsAbout,
  };
}

const alternateLinks = LOCALES.map(
  (locale) =>
    `<link rel="alternate" hreflang="${escapeHtml(locale)}" href="${SITE_ORIGIN}${LOCALE_PATHS[locale]}" />`,
)
  .concat(
    `<link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${LOCALE_PATHS.es}" />`,
  )
  .join("\n    ");

export function localeHead(locale: Locale): string {
  const localized = metadata[locale];
  const canonical = `${SITE_ORIGIN}${LOCALE_PATHS[locale]}`;
  const jsonLd = JSON.stringify(organizationJsonLd(locale)).replace(/</g, "\\u003c");

  return `<title>${escapeHtml(localized.title)}</title>
    <meta name="description" content="${escapeHtml(localized.description)}" />
    <meta property="og:title" content="${escapeHtml(localized.title)}" />
    <meta property="og:description" content="${escapeHtml(localized.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="${escapeHtml(localized.ogLocale)}" />
    <meta property="og:site_name" content="CodeDreamers" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE_ORIGIN}/og-image.png" />
    <meta property="og:image:alt" content="${escapeHtml(localized.imageAlt)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(localized.title)}" />
    <meta name="twitter:description" content="${escapeHtml(localized.description)}" />
    <meta name="twitter:image" content="${SITE_ORIGIN}/og-image.png" />
    <link rel="canonical" href="${canonical}" />
    ${alternateLinks}
    <script type="application/ld+json">${jsonLd}</script>`;
}

function assertSingleMarker(template: string, marker: string): void {
  if (template.split(marker).length !== 2) {
    throw new Error(`Expected template marker ${marker} exactly once`);
  }
}

function renderTemplate(
  template: string,
  locale: Locale,
  head: string,
  appHtml: string,
): string {
  for (const marker of ["__HTML_LANG__", "<!--locale-head-->", "<!--app-html-->"]) {
    assertSingleMarker(template, marker);
  }

  return template
    .replace("__HTML_LANG__", () => escapeHtml(locale))
    .replace("<!--locale-head-->", () => head)
    .replace("<!--app-html-->", () => appHtml);
}

export function renderLocaleDocument(template: string, locale: Locale): string {
  const appHtml = renderToString(createElement(CodeDreamersLanding, { locale }));
  return renderTemplate(template, locale, localeHead(locale), appHtml);
}

export function renderEntryDocument(template: string): string {
  const head = `${localeHead("es")}\n    <meta name="robots" content="noindex,follow" />`;
  return renderTemplate(template, "es", head, "");
}
