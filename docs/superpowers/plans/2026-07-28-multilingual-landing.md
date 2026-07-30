# Multilingual Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver complete, crawlable Spanish, Brazilian Portuguese, and English landing pages at stable locale paths while preserving the existing catalog identity, interactions, and visual system.

**Architecture:** Keep one React component tree and split only stable catalog structure from typed locale content. Pure locale/path utilities choose a typed dictionary, the shared selector maps locales to three safe local SVG flags, Vite builds the client and an SSR entry, and a dependency-free Node post-build step writes localized static HTML plus a root locale entry page.

**Tech Stack:** React 19, TypeScript 5.9, Vite 8, Vitest 4, React DOM server rendering, CSS, and Node.js 20 built-ins; no i18n or prerender dependency.

---

## Task Tracking

At the start, use `TaskCreate` to create one task for each implementation task below, including the final `/finalize` task. Mark a task complete only after its stated GREEN checks pass.

## Skills Before Editing

After plan approval and before making edits, run `/superpowers:test-driven-development`, `/impeccable`, `/context-mode:context-mode`, and `/codebase-memory-exploring`. Run `/browse` for browser QA and `/finalize` only at the final gate.

## Existing Patterns

- `src/CodeDreamersLanding.tsx` owns the shared page tree and already renders `LocaleSelector` in both the desktop header and mobile menu; keep its persistence, hash-preserving native links, `hrefLang`, `aria-current`, and screen-reader active copy while replacing only the visible abbreviation/separator markup.
- `src/CodeDreamersLanding.test.ts` uses Vitest, `renderToStaticMarkup`, source/CSS contract assertions, and exact 54-product identity checks. Extend the existing two-selector loop and focused CSS assertions rather than creating a parallel test harness.
- `src/i18n/dictionaries/{es,ptBR,en}.ts` already satisfy `Dictionary.selector.labels: Record<Locale, string>`; preserve that type and make each value a localized full language name. Keep `src/i18n/content.test.ts` as the completeness and accidental-equality authority.
- `src/styles.css:252-301` contains the current 44px selector, focus, active, and obsolete separator rules; `src/styles.css:2497-2512` contains the existing narrow hero typography/wrapping rules. Make the smallest changes in those blocks.
- `scripts/verify-static.mjs` already verifies built locale files and assets with Node built-ins. Extend it to bind the three public SVG sources to their copied `dist/flags/` assets and reject unsafe SVG constructs.
- `vite.config.ts` builds with root-relative assets and the prerender pipeline produces `dist/200.html` after locale output.
- `../../CodeDreamers_360_Surge_Ready/` is a generated publication artifact copied from verified `dist/`; never edit it by hand.

## Repository Constraint

The project root has a local Git repository, but the user did not request commits, staging, pushes, or review-lifecycle operations. This plan intentionally contains no Git commands; preserve each GREEN checkpoint through test output and file diffs instead.

### Task 1: Define and Prove Pure Locale Resolution

**Files:**
- Create: `src/i18n/locale.ts`
- Create: `src/i18n/locale.test.ts`

- [ ] **Step 1: Write the failing locale contract tests**

Create tests for canonical paths, saved-preference precedence, browser-language mapping, unsupported paths, storage failures, and hash preservation:

```ts
import { describe, expect, it, vi } from "vitest";
import {
  LOCALE_STORAGE_KEY,
  buildLocaleHref,
  getStorage,
  readLocalePreference,
  resolveLocaleRoute,
  writeLocalePreference,
} from "./locale";

describe("locale routing", () => {
  it.each([
    ["/es/", "es"],
    ["/pt-br/", "pt-BR"],
    ["/en/", "en"],
  ] as const)("maps %s to %s", (pathname, locale) => {
    expect(resolveLocaleRoute({ pathname, savedLocale: null, browserLanguages: [] }))
      .toEqual({ kind: "locale", locale });
  });

  it("resolves root by saved locale, browser language, then Spanish", () => {
    expect(resolveLocaleRoute({ pathname: "/", savedLocale: "en", browserLanguages: ["pt-BR"] }))
      .toEqual({ kind: "entry", locale: "en" });
    expect(resolveLocaleRoute({ pathname: "/", savedLocale: "invalid", browserLanguages: ["pt-PT"] }))
      .toEqual({ kind: "entry", locale: "pt-BR" });
    expect(resolveLocaleRoute({ pathname: "/", savedLocale: null, browserLanguages: ["fr-FR"] }))
      .toEqual({ kind: "entry", locale: "es" });
  });

  it("routes malformed and unsupported paths to Spanish", () => {
    expect(resolveLocaleRoute({ pathname: "/fr/", savedLocale: "en", browserLanguages: ["en"] }))
      .toEqual({ kind: "unsupported", locale: "es" });
  });

  it("builds canonical locale links without losing deep hashes", () => {
    expect(buildLocaleHref("pt-BR", "#producto-P32")).toBe("/pt-br/#producto-P32");
    expect(buildLocaleHref("en", "ecosistema")).toBe("/en/#ecosistema");
    expect(buildLocaleHref("es", "")).toBe("/es/");
  });

  it("contains storage failures and ignores invalid values", () => {
    const throwingStorage = {
      getItem: vi.fn(() => { throw new Error("blocked"); }),
      setItem: vi.fn(() => { throw new Error("blocked"); }),
    };
    expect(getStorage(() => { throw new Error("blocked getter"); })).toBeNull();
    expect(readLocalePreference(throwingStorage)).toBeNull();
    expect(writeLocalePreference(throwingStorage, "en")).toBe(false);
    expect(LOCALE_STORAGE_KEY).toBe("codedreamers.locale");
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/i18n/locale.test.ts`

Expected: FAIL because `src/i18n/locale.ts` does not exist.

- [ ] **Step 3: Implement the minimal typed locale API**

Implement this public contract; `resolveLocaleRoute` and `buildLocaleHref` remain pure, while the two storage adapters contain browser exceptions:

```ts
export const LOCALES = ["es", "pt-BR", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export type LocaleRoute =
  | { kind: "locale"; locale: Locale }
  | { kind: "entry"; locale: Locale }
  | { kind: "unsupported"; locale: "es" };
export type StoragePort = Pick<Storage, "getItem" | "setItem">;
export interface LocaleResolutionInput {
  pathname: string;
  savedLocale: unknown;
  browserLanguages: readonly string[];
}

export const LOCALE_STORAGE_KEY = "codedreamers.locale";
export const LOCALE_PATHS: Record<Locale, `/${string}/`> = {
  es: "/es/",
  "pt-BR": "/pt-br/",
  en: "/en/",
};

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (LOCALES as readonly string[]).includes(value);

export const localeFromLanguageTag = (tag: string): Locale | null => {
  const language = tag.trim().toLowerCase();
  if (language === "pt" || language.startsWith("pt-")) return "pt-BR";
  if (language === "en" || language.startsWith("en-")) return "en";
  if (language === "es" || language.startsWith("es-")) return "es";
  return null;
};

export function resolveLocaleRoute(input: LocaleResolutionInput): LocaleRoute {
  const canonical = Object.entries(LOCALE_PATHS).find(([, path]) => path === input.pathname)?.[0];
  if (isLocale(canonical)) return { kind: "locale", locale: canonical };
  if (input.pathname !== "/") return { kind: "unsupported", locale: "es" };
  if (isLocale(input.savedLocale)) return { kind: "entry", locale: input.savedLocale };
  const browserLocale = input.browserLanguages.map(localeFromLanguageTag).find(isLocale);
  return { kind: "entry", locale: browserLocale ?? "es" };
}

export function buildLocaleHref(locale: Locale, hash: string): string {
  const normalizedHash = hash === "" ? "" : hash.startsWith("#") ? hash : `#${hash}`;
  return `${LOCALE_PATHS[locale]}${normalizedHash}`;
}

export function getStorage(open: () => StoragePort): StoragePort | null {
  try {
    return open();
  } catch {
    return null;
  }
}

export function readLocalePreference(storage: Pick<StoragePort, "getItem"> | null): Locale | null {
  try {
    const value = storage?.getItem(LOCALE_STORAGE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

export function writeLocalePreference(
  storage: Pick<StoragePort, "setItem"> | null,
  locale: Locale,
): boolean {
  try {
    storage?.setItem(LOCALE_STORAGE_KEY, locale);
    return storage !== null;
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run the locale tests and verify GREEN**

Run: `npm test -- src/i18n/locale.test.ts`

Expected: PASS with all routing, persistence, and hash cases green.

### Task 2: Separate Stable Catalog Identity from Localized Content

**Files:**
- Create: `src/i18n/types.ts`
- Create: `src/i18n/catalog.ts`
- Create: `src/i18n/dictionaries/es.ts`
- Create: `src/i18n/dictionaries/index.ts`
- Create: `src/i18n/content.test.ts`
- Modify: `src/CodeDreamersLanding.tsx:12-750`
- Modify: `src/CodeDreamersLanding.test.ts:1-293`

- [ ] **Step 1: Write failing identity and Spanish completeness tests**

The tests must snapshot current identities before extraction, then assert P01–P54 exactly once, family membership/order unchanged, and every Spanish runtime string non-empty:

```ts
import { expect, it } from "vitest";
import { catalogDefinition, localizeCatalog } from "./catalog";
import { PRODUCT_CODES } from "./types";
import { dictionaries } from "./dictionaries";

const expectedCodes = Array.from({ length: 54 }, (_, index) =>
  `P${String(index + 1).padStart(2, "0")}`,
);

const expectedFamilies = [
  { id: "experiencia", productCodes: PRODUCT_CODES.slice(0, 8) },
  { id: "ventas", productCodes: PRODUCT_CODES.slice(8, 16) },
  { id: "operaciones", productCodes: PRODUCT_CODES.slice(16, 28) },
  { id: "datos", productCodes: PRODUCT_CODES.slice(28, 36) },
  { id: "ia", productCodes: PRODUCT_CODES.slice(36, 44) },
  { id: "sectoriales", productCodes: PRODUCT_CODES.slice(44, 54) },
];

it("preserves stable catalog identity, family membership, and ordering", () => {
  const actualFamilies = catalogDefinition.map((family) => ({
    id: family.id,
    productCodes: family.products.map((product) => product.code),
  }));
  const actualCodes = actualFamilies.flatMap((family) => family.productCodes);
  expect(actualFamilies).toEqual(expectedFamilies);
  expect(actualCodes).toEqual(expectedCodes);
  expect(PRODUCT_CODES).toEqual(expectedCodes);
  expect(new Set(actualCodes).size).toBe(54);
});

it("provides complete authoritative Spanish catalog copy", () => {
  const localized = localizeCatalog("es");
  expect(localized).toHaveLength(6);
  expect(localized.flatMap((family) => family.products)).toHaveLength(54);
  for (const product of localized.flatMap((family) => family.products)) {
    expect(product.name.trim(), product.code).not.toBe("");
    expect(product.description.trim(), product.code).not.toBe("");
    expect(product.includes, product.code).toHaveLength(3);
    expect(product.includes.every((item) => item.trim() !== ""), product.code).toBe(true);
  }
  expect(dictionaries.es.locale).toBe("es");
});
```

Keep the existing `expectedOutcomeIdsByCode` and approved Spanish-copy assertions in `src/CodeDreamersLanding.test.ts`; update imports only after extraction.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npm test -- src/i18n/content.test.ts src/CodeDreamersLanding.test.ts`

Expected: FAIL because the typed catalog and dictionary modules do not exist.

- [ ] **Step 3: Define the complete shared data contract**

Use this exact shape so every visible category and metadata field is typechecked without repeating structural catalog identity:

```ts
import type { Locale } from "./locale";

export type OutcomeId = "captar" | "vender" | "operar" | "decidir" | "escalar";
export type FamilyId =
  | "experiencia"
  | "ventas"
  | "operaciones"
  | "datos"
  | "ia"
  | "sectoriales";
export const PRODUCT_CODES = [
  "P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08", "P09",
  "P10", "P11", "P12", "P13", "P14", "P15", "P16", "P17", "P18", "P19",
  "P20", "P21", "P22", "P23", "P24", "P25", "P26", "P27", "P28", "P29",
  "P30", "P31", "P32", "P33", "P34", "P35", "P36", "P37", "P38", "P39",
  "P40", "P41", "P42", "P43", "P44", "P45", "P46", "P47", "P48", "P49",
  "P50", "P51", "P52", "P53", "P54",
] as const;
export type ProductCode = (typeof PRODUCT_CODES)[number];
export type MessageCount = { one: string; other: string };
export type ProductTranslation = {
  name: string;
  description: string;
  includes: readonly [string, string, string];
};
export type FamilyTranslation = { name: string; shortName: string; promise: string };
export type OutcomeTranslation = { label: string; lead: string; body: string; range: string };

export interface Dictionary {
  locale: Locale;
  selector: { ariaLabel: string; labels: Record<Locale, string>; activeLabel: string };
  header: {
    brandSupport: string;
    navigationAriaLabel: string;
    menuOpen: string;
    menuClose: string;
    links: { solutions: string; ecosystem: string; sectors: string; contact: string };
    contact: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    intro: string;
    primaryCta: string;
    secondaryCta: string;
    atlasLabel: string;
    proof: readonly [
      { value: string; label: string },
      { value: string; label: string },
      { value: string; label: string },
      { value: string; label: string },
    ];
    orbit: {
      ariaLabel: string;
      systemRevision: string;
      routeLabel: string;
      productsLabel: string;
      initialSolution: string;
      progression: string;
      outcomeLabels: Record<OutcomeId, string>;
    };
  };
  outcomes: {
    eyebrow: string;
    title: string;
    intro: string;
    tabsAriaLabel: string;
    resultsLabel: string;
    viewSolutions: string;
    clear: string;
    selectedAnnouncement: string;
    items: Record<OutcomeId, OutcomeTranslation>;
  };
  catalog: {
    eyebrow: string;
    title: string;
    intro: string;
    familyFilterAriaLabel: string;
    allFamilies: string;
    searchLabel: string;
    searchPlaceholder: string;
    resultCount: MessageCount;
    noResults: string;
    reset: string;
    includesLabel: string;
    detailsOpen: string;
    detailsClose: string;
    families: Record<FamilyId, FamilyTranslation>;
    products: Record<ProductCode, ProductTranslation>;
  };
  ecosystem: {
    eyebrow: string;
    title: string;
    intro: string;
    firstPhase: string;
    centerValue: string;
    centerLabel: string;
    example: string;
    layersAriaLabel: string;
    layers: readonly { code: string; label: string; body: string }[];
  };
  formats: {
    eyebrow: string;
    title: string;
    items: readonly { index: string; name: string }[];
  };
  capabilities: {
    title: string;
    lead: string;
    body: string;
    items: readonly { name: string; description: string }[];
  };
  sectors: {
    eyebrow: string;
    title: string;
    intro: string;
    items: readonly { index: string; name: string; description: string }[];
  };
  projectModes: {
    eyebrow: string;
    title: string;
    items: readonly { name: string; description: string; cta: string }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    titleContinuation: string;
    intro: string;
    primaryCta: string;
    emailLabel: string;
    phoneLead: string;
    phoneLabel: string;
    mailSubject: string;
    serviceSummary: string;
    footer: string;
  };
  status: {
    filteredByOutcome: string;
    filterCleared: string;
    storageUnavailable: string;
    menuOpened: string;
    menuClosed: string;
  };
  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogLocale: "es_ES" | "pt_BR" | "en_US";
    ogImageAlt: string;
    twitterTitle: string;
    twitterDescription: string;
    organizationDescription: string;
    knowsAbout: readonly string[];
  };
}
```

- [ ] **Step 4: Extract the catalog and authoritative Spanish dictionary without changing content**

Move non-translatable structure into `catalogDefinition` and current Spanish names/descriptions/inclusions into `es` using `satisfies Dictionary`. Preserve the existing source array order and exact family/product identity. Define these APIs:

```ts
export type ProductDefinition = { code: ProductCode; outcomeIds: readonly [OutcomeId] };
export type FamilyDefinition = {
  id: FamilyId;
  index: string;
  color: string;
  products: readonly ProductDefinition[];
};
export type LocalizedProduct = ProductDefinition & ProductTranslation;
export type LocalizedFamily = Omit<FamilyDefinition, "products"> & FamilyTranslation & {
  products: LocalizedProduct[];
};

export const catalogDefinition: readonly FamilyDefinition[] = [
  {
    id: "experiencia",
    index: "01",
    color: "#20cfd4",
    products: [{ code: "P01", outcomeIds: ["captar"] }],
  },
];

export function localizeCatalog(locale: Locale): LocalizedFamily[] {
  const copy = dictionaries[locale].catalog;
  return catalogDefinition.map((family) => ({
    ...family,
    ...copy.families[family.id],
    products: family.products.map((product) => ({
      ...product,
      ...copy.products[product.code],
    })),
  }));
}
```

The shown P01 entry demonstrates the shape only. In the implementation, migrate all six current families and all 54 current products from `src/CodeDreamersLanding.tsx`; the identity test must fail unless the complete authoritative set is present.

- [ ] **Step 5: Add dictionary lookup and rewire existing tests**

```ts
import type { Dictionary } from "../types";
import type { Locale } from "../locale";
import { es } from "./es";

export const dictionaries = { es } as const satisfies Partial<Record<Locale, Dictionary>>;
export const getDictionary = (locale: keyof typeof dictionaries): Dictionary => dictionaries[locale];
```

Move exported `OutcomeId`, `ProductFamily`, and catalog imports to the new modules. Change filtering helpers to receive localized families and locale explicitly:

```ts
export function getSearchText(product: LocalizedProduct, locale: Locale): string;
export function filterFamilies(
  source: readonly LocalizedFamily[],
  outcomeId: OutcomeId | null,
  familyId: FamilyId | "all",
  query: string,
  locale: Locale,
): LocalizedFamily[];
```

Use `text.toLocaleLowerCase(locale)` after Unicode mark removal. Preserve non-mutation, outcome filtering, family filtering, empty-family removal, and all existing `<details>` behavior.

- [ ] **Step 6: Run extraction tests and verify GREEN**

Run: `npm test -- src/i18n/content.test.ts src/CodeDreamersLanding.test.ts`

Expected: PASS; 54 ordered unique codes and the existing approved Spanish copy/outcome contracts remain unchanged.

### Task 3: Populate Portuguese and English Under the Typed Contract

**Files:**
- Create: `src/i18n/dictionaries/ptBR.ts`
- Create: `src/i18n/dictionaries/en.ts`
- Modify: `src/i18n/dictionaries/index.ts`
- Modify: `src/i18n/content.test.ts`

- [ ] **Step 1: Extend completeness tests to all locales and verify RED**

Add recursive non-empty checks, exact key parity with Spanish, 54 product records, exactly three distinct inclusions, and an explicit equality allowlist:

```ts
const intentionalSharedCopy = new Set([
  "selector.labels.es:ES",
  "selector.labels.pt-BR:PT",
  "selector.labels.en:EN",
]);

function flattenStrings(value: unknown, path = ""): Map<string, string> {
  const result = new Map<string, string>();
  if (typeof value === "string") {
    result.set(path, value);
    return result;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      for (const entry of flattenStrings(item, `${path}[${index}]`)) result.set(...entry);
    });
    return result;
  }
  if (value !== null && typeof value === "object") {
    for (const [key, item] of Object.entries(value).sort(([left], [right]) => left.localeCompare(right))) {
      const childPath = path === "" ? key : `${path}.${key}`;
      for (const entry of flattenStrings(item, childPath)) result.set(...entry);
    }
  }
  return result;
}

const spanishStrings = flattenStrings(dictionaries.es);
for (const locale of ["es", "pt-BR", "en"] as const) {
  it(`${locale} is complete and preserves catalog cardinality`, () => {
    const dictionary = dictionaries[locale];
    const strings = flattenStrings(dictionary);
    const products = localizeCatalog(locale).flatMap((family) => family.products);
    expect([...strings.keys()]).toEqual([...spanishStrings.keys()]);
    for (const [path, value] of strings) expect(value.trim(), `${locale}:${path}`).not.toBe("");
    expect(dictionary.locale).toBe(locale);
    expect(products.map((product) => product.code)).toEqual(PRODUCT_CODES);
    expect(products).toHaveLength(54);
    for (const product of products) {
      expect(product.name.trim(), `${locale}:${product.code}:name`).not.toBe("");
      expect(product.description.trim(), `${locale}:${product.code}:description`).not.toBe("");
      expect(product.includes, `${locale}:${product.code}:includes`).toHaveLength(3);
      expect(new Set(product.includes).size, `${locale}:${product.code}:includes`).toBe(3);
    }
    if (locale !== "es") {
      for (const [path, value] of strings) {
        if (spanishStrings.get(path) === value) {
          expect(intentionalSharedCopy, `${locale}:${path}`).toContain(`${path}:${value}`);
        }
      }
    }
  });
}

it("does not import Spanish as a translation fallback", () => {
  const ptSource = readFileSync(new URL("./dictionaries/ptBR.ts", import.meta.url), "utf8");
  const enSource = readFileSync(new URL("./dictionaries/en.ts", import.meta.url), "utf8");
  expect(ptSource).not.toMatch(/from\s+["'].+\/es["']/);
  expect(enSource).not.toMatch(/from\s+["'].+\/es["']/);
});
```

Every exact Portuguese/English equality with Spanish must be listed in `intentionalSharedCopy` as `path:value`; the test rejects unlisted copied source text.

Run: `npm test -- src/i18n/content.test.ts`

Expected: FAIL because Portuguese and English dictionaries are absent.

- [ ] **Step 2: Populate both complete dictionaries as a bounded translation task**

Translate from the authoritative Spanish entries in `src/i18n/dictionaries/es.ts`, not from machine output or the old rendered HTML. Use `satisfies Dictionary` and these acceptance rules:

1. Preserve P01–P54 codes, family association, family/product order, intent, and exactly three distinct inclusions.
2. Translate display names, descriptions, inclusions, navigation, controls, states, accessibility text, and metadata; never import or spread Spanish as fallback.
3. Preserve established acronyms and technical terms such as CRM, SaaS, ERP, API, PWA, B2B, and B2C where linguistically appropriate.
4. Use Brazilian Portuguese, not European Portuguese; use clear professional English.
5. Add an `intentionalSharedCopy` entry only for reviewed brand names, acronyms, or genuinely identical technical copy; each unlisted equality fails tests.
6. Read each locale end-to-end for meaning, grammar, capitalization, and CTA consistency before GREEN.

Representative P01 translations, grounded in the authoritative Spanish P01 entry:

```ts
// ptBR.ts
P01: {
  name: "Landing page de conversão",
  description: "Landing page — apresenta uma proposta concreta — converte atenção em uma primeira ação.",
  includes: ["Arquitetura da mensagem", "Design responsivo", "Formulário principal"],
},

// en.ts
P01: {
  name: "Conversion landing page",
  description: "Landing page — presents a concrete proposition — turns attention into a first action.",
  includes: ["Message architecture", "Responsive design", "Primary form"],
},
```

These entries define placement, tone, and cardinality. Populate all 54 records in each locale directly from the approved Spanish source during this task; do not duplicate the 108 translated records in this plan.

- [ ] **Step 3: Complete the locale-index contract**

```ts
import { en } from "./en";
import { es } from "./es";
import { ptBR } from "./ptBR";

export const dictionaries = {
  es,
  "pt-BR": ptBR,
  en,
} as const satisfies Record<Locale, Dictionary>;

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
```

- [ ] **Step 4: Run all content tests and verify GREEN**

Run: `npm test -- src/i18n/content.test.ts src/CodeDreamersLanding.test.ts`

Expected: PASS; all three dictionaries have identical runtime key paths, 54 localized products, three non-empty inclusions per product, no fallback imports, and no unreviewed Spanish-equal copy.

### Task 4: Localize the Shared Landing Tree and Add the Locale Selector

**Files:**
- Modify: `src/CodeDreamersLanding.tsx:1-1545`
- Modify: `src/CodeDreamersLanding.test.ts:1-293`

- [ ] **Step 1: Add failing shared-render and selector tests**

Render the same component for all locales and assert locale-specific navigation, product content, accessibility labels, no flag glyphs, active state, canonical paths, and unchanged native details:

```ts
import CodeDreamersLanding from "./CodeDreamersLanding";
import { dictionaries } from "./i18n/dictionaries";

it.each(["es", "pt-BR", "en"] as const)("renders the complete shared %s tree", (locale) => {
  const html = renderToStaticMarkup(createElement(CodeDreamersLanding, { locale }));
  const dictionary = dictionaries[locale];
  expect(html).toContain(dictionary.header.links.solutions);
  expect(html).toContain(dictionary.catalog.products.P01.name);
  expect(html).toContain(dictionary.catalog.includesLabel);
  expect(html).toContain(`<details`);
  expect(html).toContain(`<summary`);
  expect(html).toContain(`aria-label="${dictionary.selector.ariaLabel}"`);
  expect(html).toContain(`href="/es/"`);
  expect(html).toContain(`href="/pt-br/"`);
  expect(html).toContain(`href="/en/"`);
  expect(html).not.toMatch(/🇪🇸|🇧🇷|🇬🇧|🇺🇸/u);
});

it("removes the current hardcoded Spanish render copy from the shared component", () => {
  const source = readFileSync(new URL("./CodeDreamersLanding.tsx", import.meta.url), "utf8");
  for (const formerLiteral of [
    "Software para",
    "54 productos digitales",
    "Una ruta, cinco resultados",
    "54 formas de empezar",
    "Buscar solución",
    "No encontramos esa solución",
    "Ecosistema conectado",
    "16 formatos. Una misma arquitectura.",
    "Plataformas sectoriales",
    "Modalidades de proyecto",
    "Próxima coordenada",
    "Navegación principal",
  ]) {
    expect(source).not.toContain(`>${formerLiteral}<`);
    expect(source).not.toContain(`\"${formerLiteral}\"`);
  }
});
```

Run: `npm test -- src/CodeDreamersLanding.test.ts`

Expected: FAIL because `CodeDreamersLanding` has no locale prop and visible copy remains hardcoded Spanish.

- [ ] **Step 2: Make locale the only page-level content input**

Define the shared component and selector APIs:

```tsx
export type CodeDreamersLandingProps = { locale: Locale };
export type LocaleSelectorProps = { locale: Locale; onNavigate?: () => void };

export function LocaleSelector({ locale, onNavigate }: LocaleSelectorProps) {
  const dictionary = getDictionary(locale);
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    const syncHash = () => setCurrentHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <nav className="locale-selector" aria-label={dictionary.selector.ariaLabel}>
      {LOCALES.map((target, index) => (
        <Fragment key={target}>
          {index > 0 ? <span aria-hidden="true">·</span> : null}
          <a
            href={buildLocaleHref(target, currentHash)}
            hrefLang={target}
            lang={target}
            aria-current={target === locale ? "page" : undefined}
            onClick={() => {
              writeLocalePreference(getStorage(() => window.localStorage), target);
              onNavigate?.();
            }}
          >
            {dictionary.selector.labels[target]}
            {target === locale ? <span className="sr-only"> {dictionary.selector.activeLabel}</span> : null}
          </a>
        </Fragment>
      ))}
    </nav>
  );
}

export default function CodeDreamersLanding({ locale }: CodeDreamersLandingProps) {
  const dictionary = getDictionary(locale);
  const localizedFamilies = localizeCatalog(locale);
  const [activeOutcome, setActiveOutcome] = useState<OutcomeId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className="site-header">
        <Brand copy={dictionary.header} />
        <LocaleSelector locale={locale} />
        <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="site-navigation">
          <span className="sr-only">{menuOpen ? dictionary.header.menuClose : dictionary.header.menuOpen}</span>
        </button>
        <nav id="site-navigation" className={menuOpen ? "is-open" : ""} aria-label={dictionary.header.navigationAriaLabel}>
          <a href="#soluciones" onClick={closeMenu}>{dictionary.header.links.solutions}</a>
          <a href="#ecosistema" onClick={closeMenu}>{dictionary.header.links.ecosystem}</a>
          <a href="#sectores" onClick={closeMenu}>{dictionary.header.links.sectors}</a>
          <a href="#contacto" onClick={closeMenu}>{dictionary.header.links.contact}</a>
          <LocaleSelector locale={locale} onNavigate={closeMenu} />
        </nav>
        <a className="header-contact" href="#contacto">
          {dictionary.header.contact} <span aria-hidden="true">↗</span>
        </a>
      </header>
      <Hero copy={dictionary.hero} />
      <OutcomeNavigator copy={dictionary.outcomes} onSelectOutcome={setActiveOutcome} />
      <Portfolio
        locale={locale}
        copy={dictionary.catalog}
        families={localizedFamilies}
        activeOutcome={activeOutcome}
        onClearOutcome={() => setActiveOutcome(null)}
      />
      <Ecosystem copy={dictionary.ecosystem} />
      <FormatsAndCapabilities formats={dictionary.formats} capabilities={dictionary.capabilities} />
      <SectorAtlas copy={dictionary.sectors} />
      <ProjectModes copy={dictionary.projectModes} />
      <Contact copy={dictionary.contact} />
    </main>
  );
}
```

Preserve the existing reveal observer, body menu class, menu-button/navigation refs, Escape/Tab focus handling, route decoration, and exact anchor IDs around this composition; do not duplicate page sections.

- [ ] **Step 3: Localize catalog behavior and all accessibility/status copy**

Use the active locale for `filterFamilies`, search normalization, family labels, result singular/plural, empty/reset state, native details labels, outcome state, `aria-label`, visually hidden labels, and menu open/close copy. Keep product codes as identity and preserve all existing anchor IDs, section order, independent details state, focus trap, reveal observer, outcome selection, query/family combination, and clear/reset behavior.

Use a deterministic count formatter:

```ts
export function formatCount(message: MessageCount, count: number): string {
  return (count === 1 ? message.one : message.other).replace("{count}", String(count));
}
```

- [ ] **Step 4: Run shared component tests and verify GREEN**

Run: `npm test -- src/CodeDreamersLanding.test.ts src/i18n/content.test.ts`

Expected: PASS for all three locale renders, existing catalog/filter/detail contracts, selector semantics, and complete localized copy.

### Task 5: Wire Root Resolution, Redirect Safety, and Hydration

**Files:**
- Modify: `src/main.tsx:1-11`
- Modify: `src/i18n/locale.test.ts`

- [ ] **Step 1: Add failing bootstrap-decision tests**

Extract and test a pure bootstrap decision so browser effects remain a thin adapter:

```ts
import { getBootstrapDecision } from "./locale";

it("renders canonical routes and redirects entry or unknown routes", () => {
  expect(getBootstrapDecision({ pathname: "/en/", savedLocale: null, browserLanguages: [] }))
    .toEqual({ action: "render", locale: "en" });
  expect(getBootstrapDecision({ pathname: "/", savedLocale: "pt-BR", browserLanguages: ["en"] }))
    .toEqual({ action: "redirect", locale: "pt-BR" });
  expect(getBootstrapDecision({ pathname: "/de/", savedLocale: "en", browserLanguages: ["en"] }))
    .toEqual({ action: "redirect", locale: "es" });
});
```

Run: `npm test -- src/i18n/locale.test.ts`

Expected: FAIL because `getBootstrapDecision` does not exist.

- [ ] **Step 2: Implement the decision and browser adapter**

```ts
export type BootstrapDecision =
  | { action: "render"; locale: Locale }
  | { action: "redirect"; locale: Locale };

export function getBootstrapDecision(input: LocaleResolutionInput): BootstrapDecision {
  const route = resolveLocaleRoute(input);
  return route.kind === "locale"
    ? { action: "render", locale: route.locale }
    : { action: "redirect", locale: route.locale };
}
```

In `src/main.tsx`, read storage safely, preserve `location.hash`, redirect with `location.replace`, and hydrate prerendered locale markup:

```tsx
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import CodeDreamersLanding from "./CodeDreamersLanding";
import { buildLocaleHref, getBootstrapDecision, getStorage, readLocalePreference } from "./i18n/locale";
import "./styles.css";

const root = document.getElementById("root")!;
const decision = getBootstrapDecision({
  pathname: window.location.pathname,
  savedLocale: readLocalePreference(getStorage(() => window.localStorage)),
  browserLanguages: navigator.languages,
});

if (decision.action === "redirect") {
  window.location.replace(buildLocaleHref(decision.locale, window.location.hash));
} else {
  const app = <StrictMode><CodeDreamersLanding locale={decision.locale} /></StrictMode>;
  if (root.hasChildNodes()) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
```

- [ ] **Step 3: Run locale and component tests and verify GREEN**

Run: `npm test -- src/i18n/locale.test.ts src/CodeDreamersLanding.test.ts`

Expected: PASS; canonical locale pages render and root/unsupported paths produce one safe hash-preserving redirect decision.

### Task 6: Produce Static Locale HTML and Localized SEO

**Files:**
- Create: `src/static-render.tsx`
- Create: `src/static-render.test.ts`
- Create: `scripts/prerender.mjs`
- Create: `scripts/verify-static.mjs`
- Modify: `index.html:1-62`
- Modify: `vite.config.ts:1-24`
- Modify: `package.json:8-13`
- Modify: `public/sitemap.xml:1-9`

- [ ] **Step 1: Write failing static-document tests**

Test complete pre-JavaScript markup and unique locale metadata:

```ts
import { expect, it } from "vitest";
import { dictionaries } from "./i18n/dictionaries";
import { escapeHtml, renderEntryDocument, renderLocaleDocument } from "./static-render";

const template = `<!doctype html><html lang="__HTML_LANG__"><head><!--locale-head--></head><body><div id="root"><!--app-html--></div><script type="module" src="/src/main.tsx"></script></body></html>`;

it.each(["es", "pt-BR", "en"] as const)("renders static %s metadata and app copy", (locale) => {
  const html = renderLocaleDocument(template, locale);
  const seo = dictionaries[locale].seo;
  const path = locale === "pt-BR" ? "pt-br" : locale;
  const canonical = `https://codedreamers.surge.sh/${path}/`;
  expect(html).toContain(`<html lang="${locale}">`);
  expect(html).toContain(`<title>${escapeHtml(seo.title)}</title>`);
  expect(html).toContain(`name="description" content="${escapeHtml(seo.description)}"`);
  expect(html).toContain(`property="og:title" content="${escapeHtml(seo.ogTitle)}"`);
  expect(html).toContain(`property="og:description" content="${escapeHtml(seo.ogDescription)}"`);
  expect(html).toContain(`property="og:locale" content="${seo.ogLocale}"`);
  expect(html).toContain(`name="twitter:title" content="${escapeHtml(seo.twitterTitle)}"`);
  expect(html).toContain(`name="twitter:description" content="${escapeHtml(seo.twitterDescription)}"`);
  expect(html).toContain(`<link rel="canonical" href="${canonical}">`);
  expect(html).toContain(`<meta property="og:url" content="${canonical}">`);
  expect(html.match(/rel="canonical"/g)).toHaveLength(1);
  expect(html).toContain(`hreflang="es" href="https://codedreamers.surge.sh/es/"`);
  expect(html).toContain(`hreflang="pt-BR" href="https://codedreamers.surge.sh/pt-br/"`);
  expect(html).toContain(`hreflang="en" href="https://codedreamers.surge.sh/en/"`);
  expect(html).toContain(`hreflang="x-default" href="https://codedreamers.surge.sh/es/"`);
  expect(html).toContain(`type="application/ld+json"`);
  expect(html).toContain(seo.organizationDescription);
  for (const topic of seo.knowsAbout) expect(html).toContain(topic);
  expect(html).toContain(dictionaries[locale].catalog.products.P01.name);
  expect(html).not.toContain("<!--app-html-->");
});

it("renders a noindex root entry with Spanish canonical", () => {
  const html = renderEntryDocument(template);
  expect(html).toContain(`content="noindex,follow"`);
  expect(html).toContain(`href="https://codedreamers.surge.sh/es/"`);
  expect(html).toContain(`<div id="root"></div>`);
});
```

Run: `npm test -- src/static-render.test.ts`

Expected: FAIL because the static renderer does not exist.

- [ ] **Step 2: Implement the static rendering API**

Define one origin and render all metadata from each typed dictionary:

```tsx
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import CodeDreamersLanding from "./CodeDreamersLanding";
import { getDictionary } from "./i18n/dictionaries";
import { LOCALE_PATHS, type Locale } from "./i18n/locale";

export const SITE_ORIGIN = "https://codedreamers.surge.sh";
export const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const absoluteUrl = (path: string) => new URL(path, SITE_ORIGIN).href;

export function organizationJsonLd(locale: Locale): string {
  const seo = getDictionary(locale).seo;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CodeDreamers",
    url: absoluteUrl(LOCALE_PATHS[locale]),
    email: "codedreamers.dev@gmail.com",
    telephone: "+53 52015051",
    logo: absoluteUrl("/favicon.svg"),
    image: absoluteUrl("/og-image.png"),
    description: seo.organizationDescription,
    knowsAbout: seo.knowsAbout,
  }).replaceAll("<", "\\u003c");
}

export function localeHead(locale: Locale): string {
  const seo = getDictionary(locale).seo;
  const canonical = absoluteUrl(LOCALE_PATHS[locale]);
  const alternates = (["es", "pt-BR", "en"] as const)
    .map((target) => `<link rel="alternate" hreflang="${target}" href="${absoluteUrl(LOCALE_PATHS[target])}">`)
    .join("");
  return [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}">`,
    `<meta property="og:title" content="${escapeHtml(seo.ogTitle)}">`,
    `<meta property="og:description" content="${escapeHtml(seo.ogDescription)}">`,
    `<meta property="og:locale" content="${seo.ogLocale}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image:alt" content="${escapeHtml(seo.ogImageAlt)}">`,
    `<meta name="twitter:title" content="${escapeHtml(seo.twitterTitle)}">`,
    `<meta name="twitter:description" content="${escapeHtml(seo.twitterDescription)}">`,
    `<link rel="canonical" href="${canonical}">`,
    alternates,
    `<link rel="alternate" hreflang="x-default" href="${absoluteUrl(LOCALE_PATHS.es)}">`,
    `<script type="application/ld+json">${organizationJsonLd(locale)}</script>`,
  ].join("");
}

export function renderLocaleDocument(template: string, locale: Locale): string {
  const appHtml = renderToString(createElement(CodeDreamersLanding, { locale }));
  return template
    .replace("__HTML_LANG__", locale)
    .replace("<!--locale-head-->", localeHead(locale))
    .replace("<!--app-html-->", appHtml);
}

export function renderEntryDocument(template: string): string {
  const entryHead = `<meta name="robots" content="noindex,follow"><link rel="canonical" href="${absoluteUrl(LOCALE_PATHS.es)}">`;
  return template
    .replace("__HTML_LANG__", "es")
    .replace("<!--locale-head-->", entryHead)
    .replace("<!--app-html-->", "");
}
```

Keep the existing theme color, favicon, fixed Open Graph image/type/site name/dimensions, and fixed Twitter card/image in the template. Generate localized Twitter title/description and Organization JSON-LD through the renderer, add reciprocal alternates exactly once, and localize JSON-LD description/`knowsAbout` from `Dictionary.seo`.

- [ ] **Step 3: Convert the HTML shell and build pipeline**

Set `index.html` to `lang="__HTML_LANG__"`, leave one `<!--locale-head-->`, one `<!--app-html-->`, root-relative `/favicon.svg`, `/og-image.png`, and `/src/main.tsx`, and remove old Spanish-only title/description/canonical/locale-specific JSON-LD fields.

Change Vite to `base: "/"`, retain React and `build.target`, and remove the old `closeBundle` copy so no pre-prerender `200.html` is published.

Set scripts without changing dependencies or `package-lock.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build:client": "vite build",
    "build:ssr": "vite build --ssr src/static-render.tsx --outDir .prerender",
    "prerender": "node scripts/prerender.mjs",
    "build": "npm run build:client && npm run build:ssr && npm run prerender",
    "verify:static": "node scripts/verify-static.mjs",
    "preview": "vite preview",
    "test": "vitest run"
  }
}
```

Implement `scripts/prerender.mjs` as the dependency-free orchestration layer:

```js
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(projectRoot, "dist");
const serverOut = resolve(projectRoot, ".prerender");

try {
  const template = await readFile(resolve(dist, "index.html"), "utf8");
  const renderer = await import(pathToFileURL(resolve(serverOut, "static-render.js")).href);
  const outputs = [
    ["es", "es"],
    ["pt-BR", "pt-br"],
    ["en", "en"],
  ];
  for (const [locale, slug] of outputs) {
    const output = resolve(dist, slug, "index.html");
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, renderer.renderLocaleDocument(template, locale), "utf8");
  }
  await writeFile(resolve(dist, "index.html"), renderer.renderEntryDocument(template), "utf8");
  await copyFile(resolve(dist, "index.html"), resolve(dist, "200.html"));
} finally {
  await rm(serverOut, { recursive: true, force: true });
}
```

Implement `scripts/verify-static.mjs` with explicit structural assertions; unit tests remain the authority for exact dictionary values:

```js
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const dist = resolve(process.cwd(), "dist");
const origin = "https://codedreamers.surge.sh";
const routes = [
  { locale: "es", slug: "es" },
  { locale: "pt-BR", slug: "pt-br" },
  { locale: "en", slug: "en" },
];
const requireMatch = (condition, message) => {
  if (!condition) throw new Error(message);
};

for (const { locale, slug } of routes) {
  const file = `${slug}/index.html`;
  const html = await readFile(resolve(dist, file), "utf8");
  const canonical = `${origin}/${slug}/`;
  requireMatch(html.includes(`<html lang="${locale}">`), `${file}: lang`);
  requireMatch(/<div id="root">\s*<main[\s>]/.test(html), `${file}: prerendered root`);
  requireMatch(/<title>[^<]+<\/title>/.test(html), `${file}: title`);
  requireMatch(/<meta name="description" content="[^"]+">/.test(html), `${file}: description`);
  requireMatch(html.includes(`<meta property="og:url" content="${canonical}">`), `${file}: og:url`);
  requireMatch((html.match(/rel="canonical"/g) ?? []).length === 1, `${file}: canonical count`);
  requireMatch(html.includes(`<link rel="canonical" href="${canonical}">`), `${file}: canonical URL`);
  for (const hreflang of ["es", "pt-BR", "en", "x-default"]) {
    requireMatch(html.includes(`hreflang="${hreflang}"`), `${file}: ${hreflang}`);
  }
  requireMatch((html.match(/rel="alternate"/g) ?? []).length === 4, `${file}: alternate count`);
}

const root = await readFile(resolve(dist, "index.html"), "utf8");
const fallback = await readFile(resolve(dist, "200.html"), "utf8");
requireMatch(root === fallback, "root and 200.html differ");
requireMatch(root.includes('content="noindex,follow"'), "entry robots policy");
requireMatch(root.includes(`href="${origin}/es/"`), "entry Spanish canonical");

const sitemap = await readFile(resolve(dist, "sitemap.xml"), "utf8");
for (const { slug } of routes) {
  requireMatch(sitemap.includes(`<loc>${origin}/${slug}/</loc>`), `sitemap: ${slug} loc`);
}
for (const [hreflang, slug] of [["es", "es"], ["pt-BR", "pt-br"], ["en", "en"], ["x-default", "es"]]) {
  const link = `hreflang="${hreflang}" href="${origin}/${slug}/"`;
  requireMatch((sitemap.split(link).length - 1) === 3, `sitemap: ${hreflang} reciprocity`);
}
```

Both scripts fail naturally with a nonzero exit if a read, import, render, write, or assertion fails.

- [ ] **Step 4: Localize the sitemap**

Replace the root-only sitemap with this exact reciprocal locale set. Keep `public/robots.txt` unchanged because it already points to the canonical sitemap.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://codedreamers.surge.sh/es/</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://codedreamers.surge.sh/es/" />
    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://codedreamers.surge.sh/pt-br/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://codedreamers.surge.sh/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://codedreamers.surge.sh/es/" />
  </url>
  <url>
    <loc>https://codedreamers.surge.sh/pt-br/</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://codedreamers.surge.sh/es/" />
    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://codedreamers.surge.sh/pt-br/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://codedreamers.surge.sh/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://codedreamers.surge.sh/es/" />
  </url>
  <url>
    <loc>https://codedreamers.surge.sh/en/</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://codedreamers.surge.sh/es/" />
    <xhtml:link rel="alternate" hreflang="pt-BR" href="https://codedreamers.surge.sh/pt-br/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://codedreamers.surge.sh/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://codedreamers.surge.sh/es/" />
  </url>
</urlset>
```

- [ ] **Step 5: Run unit tests, build, and static verification for GREEN**

Run: `npm test -- src/static-render.test.ts && npm run build && npm run verify:static`

Expected: all commands exit 0; Vite emits client and SSR builds, prerender removes `.prerender`, and verification confirms `dist/index.html`, `dist/200.html`, `dist/es/index.html`, `dist/pt-br/index.html`, and `dist/en/index.html` with localized static content and SEO.

### Task 7: Style and Verify Accessible Desktop/Mobile Selection

**Files:**
- Modify: `src/styles.css:128-251,2105-2176`
- Modify: `src/CodeDreamersLanding.test.ts`

- [ ] **Step 1: Add a failing CSS/accessibility contract test**

Read `src/styles.css` in the existing test and require explicit selector layout, active state, focus, mobile placement, and overflow protection:

```ts
it("styles the locale selector for desktop, mobile, focus, and active state", () => {
  const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");
  expect(css).toContain(".locale-selector");
  expect(css).toContain('.locale-selector a[aria-current="page"]');
  expect(css).toContain(".locale-selector a:focus-visible");
  expect(css).toContain("overflow-wrap: anywhere");
  expect(css).toContain("@media (max-width: 900px)");
});
```

Run: `npm test -- src/CodeDreamersLanding.test.ts`

Expected: FAIL because the locale selector CSS is absent.

- [ ] **Step 2: Add minimal selector and translated-copy resilience rules**

Add the initial `.locale-selector` beside desktop header controls with inherited high-contrast text, `white-space: nowrap`, at least 44px interactive height, and existing focus-ring tokens. Style `[aria-current="page"]` with font weight plus underline/border so color is not the only signal. Inside the 900px media query, place the mobile selector in normal menu focus order, allow translated navigation labels to wrap, and use `overflow-wrap: anywhere` only on long labels/content that can exceed narrow widths. Preserve the existing 44px menu button, focus trap, reduced-motion block, and header visual hierarchy. Task 7A replaces only this initial textual presentation with the amended local-SVG contract before final QA.

- [ ] **Step 3: Run tests and typecheck for GREEN**

Run: `npm test -- src/CodeDreamersLanding.test.ts && npx tsc --noEmit`

Expected: PASS; TypeScript reports no errors and CSS/accessibility contracts are present.

### Task 7A: Correct the Selector Assets and 320px Hero Reflow Before Final QA

This bounded correction supersedes only the textual selector markup/styles shown in Tasks 4 and 7. Preserve every other completed locale, catalog, menu, persistence, hash, static-rendering, and SEO contract.

**Files:**
- Create: `public/flags/es.svg`
- Create: `public/flags/pt-br.svg`
- Create: `public/flags/en.svg`
- Modify: `src/i18n/dictionaries/es.ts:5-14`
- Modify: `src/i18n/dictionaries/ptBR.ts:5-14`
- Modify: `src/i18n/dictionaries/en.ts:5-9`
- Modify: `src/i18n/content.test.ts:38-86,193-205`
- Modify: `src/CodeDreamersLanding.tsx:29-85`
- Modify: `src/CodeDreamersLanding.test.ts:1-77,268-291`
- Modify: `src/styles.css:252-301,2497-2512`
- Modify: `scripts/verify-static.mjs`

- [ ] **Step 1: Add exact failing selector, asset-safety, and narrow-hero contracts**

In `src/CodeDreamersLanding.test.ts`, import `LOCALE_FLAG_SOURCES` with the component, define the expected map, extend the existing two-selector loop, and strengthen the CSS contract:

```ts
const expectedFlagSources = {
  es: "/flags/es.svg",
  "pt-BR": "/flags/pt-br.svg",
  en: "/flags/en.svg",
} as const;

it("maps every locale to one safe local flag SVG", () => {
  expect(LOCALE_FLAG_SOURCES).toEqual(expectedFlagSources);
  for (const source of Object.values(expectedFlagSources)) {
    const svg = readFileSync(new URL(`../public${source}`, import.meta.url), "utf8");
    expect(svg.match(/<svg\b/g)).toHaveLength(1);
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 3 2">[\s\S]*<\/svg>\s*$/);
    expect(svg).not.toMatch(/<(?:script|foreignObject|text|image|use|style)\b|(?:href|xlink:href)\s*=|url\s*\(|data:/i);
  }
});
```

Inside each existing `for (const selector of selectors ?? [])` assertion, use the exact asset URL and localized full name, then prove no visible abbreviation, separator, or emoji remains:

```ts
for (const [target, href] of Object.entries(canonicalLocaleHrefs)) {
  const source = expectedFlagSources[target as keyof typeof expectedFlagSources];
  const link = selector.match(new RegExp(`<a href="${href}"[\\s\\S]*?</a>`))?.[0];

  expect(link, `${locale} selector link for ${target}`).toBeDefined();
  expect(link).toContain(`hrefLang="${target}"`);
  expect(link).toContain(`aria-label="${dictionary.selector.labels[target as keyof typeof expectedFlagSources]}"`);
  expect(link).toContain(`<img src="${source}" alt="" aria-hidden="true" width="24" height="16"/>`);
}
const visibleSelectorText = selector
  .replace(/<span class="sr-only">[\s\S]*?<\/span>/g, "")
  .replace(/<[^>]+>/g, "")
  .trim();
expect(visibleSelectorText).toBe("");
expect(selector).not.toMatch(/(?:>|\s)(?:ES|PT|EN)(?:<|\s)|[·🇪🇸🇵🇹🇧🇷🇬🇧🇺🇸]/u);
```

Extend the existing CSS test with exact image/target/reflow contracts while retaining its desktop/mobile and focus assertions. Replace the obsolete active-underline assertion with the structural border/box-shadow assertions below:

```ts
const narrowBreakpoint = styles.slice(styles.indexOf("@media (max-width: 620px)"));
const narrowHeroTitle = narrowBreakpoint.match(/\.hero h1\s*\{([^}]*)\}/)?.[1];
const flagImage = styles.match(/\.locale-selector__flag\s*\{([^}]*)\}/)?.[1];

expect(localeLinks).toMatch(/width:\s*44px;/);
expect(localeLinks).toMatch(/height:\s*44px;/);
expect(flagImage).toMatch(/width:\s*24px;/);
expect(flagImage).toMatch(/height:\s*16px;/);
expect(flagImage).toMatch(/object-fit:\s*cover;/);
expect(flagImage).toMatch(/border-radius:/);
expect(activeLocale).toMatch(/border-color:\s*currentColor;/);
expect(activeLocale).toMatch(/box-shadow:\s*inset 0 -3px 0 currentColor;/);
expect(styles).not.toMatch(/\.locale-selector i\s*\{/);
expect(narrowHeroTitle).toMatch(/font-size:\s*clamp\(2\.5rem,\s*13vw,\s*4\.4rem\);/);
expect(narrowHeroTitle).toMatch(/max-width:\s*100%;/);
```

In `src/i18n/content.test.ts`, assert that all selector labels are full names localized to the current dictionary and remove obsolete selector-label entries from `intentionallySharedSpanishValues`:

```ts
const expectedSelectorLabels = {
  es: { es: "Español", "pt-BR": "Portugués (Brasil)", en: "Inglés" },
  "pt-BR": { es: "Espanhol", "pt-BR": "Português (Brasil)", en: "Inglês" },
  en: { es: "Spanish", "pt-BR": "Portuguese (Brazil)", en: "English" },
} as const;

it.each(LOCALES)("uses localized full language names in %s", (locale) => {
  expect(dictionaries[locale].selector.labels).toEqual(expectedSelectorLabels[locale]);
  for (const label of Object.values(dictionaries[locale].selector.labels)) {
    expect(["ES", "PT", "EN"]).not.toContain(label);
  }
});
```

Run:

```bash
npm test -- src/CodeDreamersLanding.test.ts src/i18n/content.test.ts && npm run verify:static
```

Expected RED: tests fail because the three SVG files and `LOCALE_FLAG_SOURCES` do not exist, the selector still renders `ES · PT · EN`, the CSS lacks flag/reflow rules, and static verification does not yet bind the mapped files.

- [ ] **Step 2: Create the three constrained local SVG assets**

Create all files with the same `0 0 3 2` viewBox and no scripts, external references, text, embedded data, or executable content:

```xml
<!-- public/flags/es.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">
  <rect width="3" height="2" fill="#aa151b"/>
  <rect y="0.5" width="3" height="1" fill="#f1bf00"/>
</svg>
```

```xml
<!-- public/flags/pt-br.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">
  <rect width="3" height="2" fill="#009b3a"/>
  <path fill="#ffdf00" d="M1.5 .2 2.7 1 1.5 1.8.3 1z"/>
  <circle cx="1.5" cy="1" r="0.46" fill="#002776"/>
</svg>
```

```xml
<!-- public/flags/en.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">
  <rect width="3" height="2" fill="#fff"/>
  <path fill="#b22234" d="M0 0h3v.154H0zm0 .308h3v.154H0zm0 .307h3v.154H0zm0 .308h3v.154H0zm0 .308h3v.154H0zm0 .307h3v.154H0zm0 .308h3V2H0z"/>
  <rect width="1.2" height="1.077" fill="#3c3b6e"/>
</svg>
```

- [ ] **Step 3: Apply the minimal dictionary, selector, CSS, and static-verifier changes**

Keep the existing `Dictionary.selector.labels: Record<Locale, string>` type. Replace only the three dictionaries' `labels` values with the exact `expectedSelectorLabels` copy above and delete only the now-obsolete selector-label equality entries from `intentionallySharedSpanishValues`.

Replace `localeLabels` and the separator/wrapper rendering in `src/CodeDreamersLanding.tsx` with this exact map and link body; preserve `buildLocaleHref`, `hrefLang`, `aria-current`, storage writing, `onNavigate`, both selector instances, and the existing screen-reader active copy:

```tsx
export const LOCALE_FLAG_SOURCES: Record<Locale, string> = {
  es: "/flags/es.svg",
  "pt-BR": "/flags/pt-br.svg",
  en: "/flags/en.svg",
};

<nav className="locale-selector" aria-label={copy.ariaLabel}>
  {LOCALES.map((target) => (
    <a
      key={target}
      href={buildLocaleHref(target, hash)}
      hrefLang={target}
      aria-current={target === locale ? "page" : undefined}
      aria-label={copy.labels[target]}
      onClick={() => {
        writeLocalePreference(getStorage(() => window.localStorage), target);
        onNavigate?.();
      }}
    >
      <img
        className="locale-selector__flag"
        src={LOCALE_FLAG_SOURCES[target]}
        alt=""
        aria-hidden="true"
        width={24}
        height={16}
      />
      {target === locale ? (
        <span className="sr-only"> ({copy.activeLabel})</span>
      ) : null}
    </a>
  ))}
</nav>
```

Update the existing selector block without relying on flag colors; remove `.locale-selector span` and `.locale-selector i`, retain the focus rule and desktop/mobile visibility rules, and use a structural active cue:

```css
.locale-selector {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #eaf2f8;
}

.site-header .locale-selector a {
  display: inline-flex;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 0.45rem;
  color: inherit;
}

.locale-selector__flag {
  width: 24px;
  height: 16px;
  border-radius: 2px;
  object-fit: cover;
}

.locale-selector a[aria-current="page"] {
  border-color: currentColor;
  box-shadow: inset 0 -3px 0 currentColor;
}
```

In the existing `@media (max-width: 620px)` block, change only the narrow title rule; keep the current `<br>` reflow rule and all layout/copy intact:

```css
.hero h1 {
  max-width: 100%;
  font-size: clamp(2.5rem, 13vw, 4.4rem);
  letter-spacing: -0.04em;
}
```

Extend `scripts/verify-static.mjs` after `projectRoot`/`distDir` are defined. This checks public existence, exact built copies, one constrained SVG root, shared aspect ratio, and forbidden active/external content:

```js
const flagAssets = ["flags/es.svg", "flags/pt-br.svg", "flags/en.svg"];
const safeSvgRoot = /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 3 2">[\s\S]*<\/svg>\s*$/;
const unsafeSvg = /<(?:script|foreignObject|text|image|use|style)\b|(?:href|xlink:href)\s*=|url\s*\(|data:/i;

for (const asset of flagAssets) {
  const publicSvg = await readFile(resolve(projectRoot, "public", asset), "utf8");
  const builtSvg = await readFile(resolve(distDir, asset), "utf8");
  assert(safeSvgRoot.test(publicSvg), `${asset}: invalid or inconsistent SVG root`);
  assert((publicSvg.match(/<svg\b/g) ?? []).length === 1, `${asset}: multiple SVG roots`);
  assert(!unsafeSvg.test(publicSvg), `${asset}: unsafe SVG content`);
  assert(publicSvg === builtSvg, `${asset}: built asset differs from public source`);
}
```

- [ ] **Step 4: Verify GREEN, then run the 320×568 browser regression before Task 8 completes**

Run:

```bash
npm test -- src/CodeDreamersLanding.test.ts src/i18n/content.test.ts && npx tsc --noEmit && npm run build && npm run verify:static
```

Expected GREEN: focused tests, typecheck, build, and static verification pass; `dist/flags/{es,pt-br,en}.svg` exist and exactly match their safe public sources.

With the preview running, use `/browse` at `320×568` for `/es/` and `/pt-br/` and evaluate this exact invariant after load:

```js
const regression = await page.evaluate(() => {
  const root = document.documentElement;
  const heading = document.querySelector(".hero h1");
  if (!(heading instanceof HTMLElement)) throw new Error("Missing .hero h1");
  const rect = heading.getBoundingClientRect();
  return {
    scrollWidth: root.scrollWidth,
    clientWidth: root.clientWidth,
    left: rect.left,
    right: rect.right,
  };
});
expect(regression.scrollWidth).toBeLessThanOrEqual(regression.clientWidth);
expect(regression.left).toBeGreaterThanOrEqual(0);
expect(regression.right).toBeLessThanOrEqual(320);
```

Expected: both locales satisfy all three assertions; this directly closes the observed Spanish and Brazilian Portuguese H1 right-edge regression (`324.3px > 320px`). Then rerun the complete Task 8 Steps 1–5 browser matrix for all three locales, not only these two narrow cases.

### Task 8: Run Full Technical, Static, and Browser Verification

**Files:**
- Verify: all source files and generated `dist/`
- Refresh generated graph: `graphify-out/`

- [ ] **Step 1: Run the complete source gate**

Run: `npm test && npx tsc --noEmit && npm run build && npm run verify:static`

Expected: every command exits 0; all Vitest files pass, typecheck is silent, and the fresh build contains all verified locale outputs.

- [ ] **Step 2: Run deterministic output checks**

Run: `npm run build && npm run verify:static`

Expected: exit code 0 on a second clean build, no `.prerender` directory remains, and locale/entry output checks still pass.

- [ ] **Step 3: Refresh the project knowledge graph after code changes**

Run: `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"`

Expected: exit code 0 and `graphify-out/` reflects the final source layout.

- [ ] **Step 4: Start a local preview for QA**

Run: `npm run preview -- --host 127.0.0.1`

Expected: Vite reports a local preview URL, normally `http://127.0.0.1:4173`.

- [ ] **Step 5: Use `/browse` for desktop and mobile QA**

Verify all of the following against the preview:

1. `/es/`, `/pt-br/`, and `/en/` load direct with locale-correct visible copy, `<html lang>`, title, description, Open Graph URL, one self-canonical, reciprocal hreflang, and no client translation flash.
2. `/` chooses valid `codedreamers.locale`, then `navigator.languages`, then Spanish; invalid storage and blocked storage do not break rendering.
3. An unsupported path reaches `/es/` once without a redirect loop.
4. Desktop and mobile menus both show only the mapped Spain, Brazil, and United States SVG flags—no visible `ES`, `PT`, `EN`, dot separators, or emoji—with localized full-language accessible names, decorative images, exact 44×44 targets, visible focus, and a non-color-only active state; after hydration each actual link `href` includes the current hash so copy-link, keyboard activation, new-tab, and modified-click navigation preserve it.
5. Switching locale from `#soluciones`, `#ecosistema`, `#sectores`, `#contacto`, an outcome state, and a deep catalog/product hash preserves the exact hash.
6. Search, family/outcome filters, counts, reset/no-results states, native details summaries, descriptions, and three inclusions use the active locale while codes/order stay fixed.
7. Escape closes the mobile menu and restores focus; Tab remains trapped while open; native details remain independently operable.
8. At 1440×900, 1024×768, 390×844, and 320×568 every locale satisfies `document.documentElement.scrollWidth <= document.documentElement.clientWidth` with no clipped selector or control overlap. At 320×568, additionally rerun the Task 7A `.hero h1` rectangle assertion for `es` and `pt-BR` and require `left >= 0` and `right <= 320`.
9. All three flag images load with nonzero `naturalWidth`/`naturalHeight`; console has no errors or hydration warnings; locale HTML, module, font, image, favicon, sitemap, and asset requests have no unexpected 4xx/5xx responses.

Expected: all checks pass for all three locales. If any check fails, return to the owning RED→GREEN task, add a regression assertion, apply the minimal fix, then rerun Tasks 8.1–8.5.

### Task 9: Synchronize the Publishable Surge Artifact Only After All Gates Pass

> **SUPERSEDED by the final RED→GREEN sequence below:** publication synchronization now occurs only after finalization, all automated checks, graph refresh attempt, and complete browser QA pass.

**Files:**
- Replace generated directory: `../../CodeDreamers_360_Surge_Ready/`
- Source artifact: `dist/`

- [ ] **Step 1: Confirm the publication precondition**

Run: `npm test && npx tsc --noEmit && npm run build && npm run verify:static`

Expected: all commands exit 0 immediately before synchronization, and Task 8 browser QA is recorded as passing.

- [ ] **Step 2: Replace Surge_Ready with the exact verified build**

Run: `rm -rf ../../CodeDreamers_360_Surge_Ready && cp -a dist ../../CodeDreamers_360_Surge_Ready`

Expected: the publishable directory contains only the freshly verified `dist/` tree. Do not edit generated HTML, CSS, JavaScript, assets, or hashes manually.

- [ ] **Step 3: Prove byte-for-byte synchronization**

Run: `diff -qr dist ../../CodeDreamers_360_Surge_Ready`

Expected: exit code 0 with no output.

### Task 10: Run `/finalize` Skill

> **SUPERSEDED by the final RED→GREEN sequence below:** `/finalize` remains a verification-only gate before synchronization and deployment; it must not publish an earlier artifact.

**Files:**
- Verify: complete implementation candidate

- [ ] **Step 1: Run finalization without a commit stage**

Run `/finalize` to rerun tests, simplify code, and perform quality review. Explicitly skip staging, commit creation, push, PR, and review-lifecycle operations because the user did not request Git work.

Expected: finalization reports passing tests/typecheck/build/static verification, no accepted unresolved review findings, and no Git mutation attempt.

- [ ] **Step 2: Re-run affected gates after any finalization edit**

Run: `npm test && npx tsc --noEmit && npm run build && npm run verify:static && diff -qr dist ../../CodeDreamers_360_Surge_Ready`

Expected: all commands exit 0 with no diff output. If finalization changes source after Task 9, repeat browser QA and Task 9 synchronization before reporting completion.

## Implementation Self-Review

- [ ] Scope/non-goals: exactly three locales and stable paths; no i18n dependency, runtime translation, locale-specific component tree, or product identity redesign.
- [ ] Architecture/data flow: typed locale and dictionary modules, shared catalog identity, pure resolution/hash utilities, one shared landing tree, safe root/unknown-path behavior, and contained storage failures.
- [ ] Content contract: all visible, state, accessibility, product, CTA, contact, error/status, and metadata strings are typed and complete; selector link names are localized full language names in all three dictionaries; P01–P54 retain code/family/order and three inclusions.
- [ ] Interaction/accessibility: desktop/mobile selectors use only the exact local Spain/Brazil/United States SVG mapping; images are decorative, links retain `hrefLang`, `aria-current`, localized `aria-label`, screen-reader active copy, persistence, and hash behavior; targets remain 44×44 with focus and a non-color active cue; no visible abbreviations, separators, or emoji remain.
- [ ] Asset safety/responsiveness: all three SVGs share `viewBox="0 0 3 2"`, exist in `public/` and `dist/`, contain no scripts/external references/text/embedded data, and load in browser; every locale has no horizontal overflow at 320×568, and Spanish/Brazilian Portuguese H1 rectangles remain fully within the 320px viewport.
- [ ] SEO/static output: prerendered `/es/`, `/pt-br/`, `/en/`; localized `lang`, title, description, Open Graph, JSON-LD, canonical, reciprocal hreflang plus `x-default`; safe noindex root/200 entry; localized sitemap.
- [ ] Verification/publication: Task 7A records focused RED→GREEN evidence, then Task 8 reruns full tests/typecheck/build/static checks, deterministic rebuild, the complete all-locale browser matrix, graph refresh, and Surge_Ready synchronization only after every source gate passes.
- [ ] Repository constraint: local Git exists, but no Git, commit, push, PR, or review-lifecycle command appears because none was requested; checkpoints rely on fresh verification evidence.

---

## Final RED→GREEN Sequence: Approved Branding, Verification, and Publication

This sequence is the authoritative final ordering and supersedes the publication ordering in Tasks 9–10. Preserve the required superpowers header at the top of this plan. Planning remains dependency-neutral: do not add packages, dependency-install steps, commit steps, or sync steps before the gates below.

### RED: Add the approved local branding contracts

- Use the existing `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/public/favicon.svg` unchanged as the symbol/favicon source.
- Create `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/public/brand-wordmark.svg` as a clean local outlined CodeDreamers wordmark. It must use one constrained inline SVG root, no scripts, external references, embedded data, `<text>`, `<image>`, `<use>`, or CSS `url()` content.
- Integrate the wordmark in `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/CodeDreamersLanding.tsx` and `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/styles.css`; retain the existing header navigation, mobile menu behavior, contact link, focus handling, and locale selectors.
- Add RED tests in `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/CodeDreamersLanding.test.ts` and `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/static-render.test.ts` that assert:

```ts
expect(source).toContain('src="/brand-wordmark.svg"');
expect(source).toContain('src="/favicon.svg"');
expect(html).toContain('<header class="site-header">');
expect(html).toMatch(/<link rel="icon"[^>]+href="\/favicon\.svg"/);
```

- Extend `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/scripts/verify-static.mjs` to assert exact public-to-`dist/` copies for both SVGs, reject unsafe SVG constructs, and allow `/brand-wordmark.svg` in the React 19 prerender preload verifier. Expected RED: the new wordmark, header contract, static favicon/title/route/SEO assertions, and verifier allowlist fail before implementation.

### GREEN: Implement and verify the candidate before publication

1. Implement the branding/header/static metadata changes and run the focused contracts:

```bash
cd /home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source
npm test -- src/CodeDreamersLanding.test.ts src/static-render.test.ts src/i18n/content.test.ts
```

Expected: PASS; every locale renders the local wordmark and existing favicon, header structure remains valid, and `/es/`, `/pt-br/`, and `/en/` retain localized titles, routes, canonical URLs, descriptions, Open Graph, Twitter, JSON-LD, and reciprocal hreflang metadata.

2. Run the complete automated gate and the explicit asset/static checks:

```bash
npm test && npx tsc --noEmit && npm run build && npm run verify:static
```

Expected: all commands exit 0; `dist/favicon.svg` and `dist/brand-wordmark.svg` exactly match `public/`; `dist/es/index.html`, `dist/pt-br/index.html`, and `dist/en/index.html` contain prerendered localized content; the preload verifier accepts the wordmark; no `.prerender` directory remains.

3. Run `/finalize` as verification only, then rerun the same complete gate if it reports any source change. Do not stage, commit, push, or publish in this step.

4. Refresh the graph and record the outcome without blocking the documentation sequence on the absent report:

```bash
if test -f graphify-out/GRAPH_REPORT.md; then python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"; else python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))" || true; fi
```

Expected: record `graphify-out/` refresh success when the command exits 0; otherwise record the refresh failure and the missing `graphify-out/GRAPH_REPORT.md` condition, without changing application scope.

5. Run `/browse` against the verified preview at `320×568` and desktop sizes (`1440×900` and `1024×768`) for `/es/`, `/pt-br/`, and `/en/`. Assert no horizontal overflow, clipped header, or control overlap:

```js
const root = document.documentElement;
expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
expect(document.querySelector('.site-header img[src="/brand-wordmark.svg"]')).toBeTruthy();
expect(document.querySelector('link[rel="icon"][href="/favicon.svg"]')).toBeTruthy();
expect([...document.querySelectorAll('.hero h1')].every((node) => {
  const rect = node.getBoundingClientRect();
  return rect.left >= 0 && rect.right <= innerWidth;
})).toBe(true);
```

Expected: all three locales pass at 320×568 and desktop; localized visible copy, static metadata, header wordmark, favicon, menu/selector keyboard behavior, hash-preserving links, and console/network checks are green.

6. Preserve the previous publication artifact, synchronize only the exact verified build, and prove byte identity:

```bash
rm -rf ../../CodeDreamers_360_Surge_Ready.previous
cp -a ../../CodeDreamers_360_Surge_Ready ../../CodeDreamers_360_Surge_Ready.previous
rm -rf ../../CodeDreamers_360_Surge_Ready
cp -a dist ../../CodeDreamers_360_Surge_Ready
diff -qr dist ../../CodeDreamers_360_Surge_Ready
```

Expected: `diff` exits 0 with no output, and `../../CodeDreamers_360_Surge_Ready/` is the exact verified `dist/` tree.

7. Deploy only to the existing Surge target, verify production, and retain a one-command rollback:

```bash
surge ../../CodeDreamers_360_Surge_Ready codedreamers.surge.sh
curl --fail --silent --show-error https://codedreamers.surge.sh/es/ | rg '<html lang="es"|rel="canonical"|brand-wordmark.svg'
curl --fail --silent --show-error https://codedreamers.surge.sh/pt-br/ | rg '<html lang="pt-BR"|rel="canonical"|brand-wordmark.svg'
curl --fail --silent --show-error https://codedreamers.surge.sh/en/ | rg '<html lang="en"|rel="canonical"|brand-wordmark.svg'
```

Expected: Surge deploys to `codedreamers.surge.sh` only; all three routes return successfully with the expected localized metadata and wordmark reference. Rollback command: `surge ../../CodeDreamers_360_Surge_Ready.previous codedreamers.surge.sh`.
