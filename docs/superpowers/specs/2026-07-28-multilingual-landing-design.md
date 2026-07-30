# Multilingual Landing Design

## Goal

Localize the existing CodeDreamers landing page for Spanish, Brazilian Portuguese, and English without changing its product identity, visual system, or component architecture. Spanish is the source/original locale. Each locale must be independently discoverable through a stable public path and must produce complete, crawlable static HTML.

## Scope and Non-Goals

### In scope

- Locales `es`, `pt-BR`, and `en`.
- Public paths `/es/`, `/pt-br/`, and `/en/`.
- Preference-aware resolution at `/`: saved preference, then browser language, then Spanish.
- A three-flag locale selector in the desktop header and mobile menu, using local SVG assets for Spain (`es`), Brazil (`pt-BR`), and the United States (`en`).
- Typed dictionaries with one shared contract and one shared component/page tree.
- Complete localization of visible copy, product content, accessibility text, search/filter controls, CTAs, errors, and metadata.
- Static localized HTML with localized `lang`, title, description, Open Graph, canonical, and hreflang output.

### Out of scope

- Runtime machine translation or an i18n dependency.
- Duplicated locale pages or duplicated components.
- New products, product capabilities, pricing, forms, analytics, backend behavior, or conversion flows.
- Changes to product codes, family membership, family order, product order, or the visual language.
- Remote or emoji-based flag assets, visible locale abbreviations, or locale-specific feature behavior.

## Architecture

Keep the current React 19 + TypeScript + Vite static landing architecture. Extend the existing landing composition rather than creating locale-specific component trees.

- **Locale model:** define a narrow `Locale` union for `"es" | "pt-BR" | "en"` and a normalized public-path mapping for `es`, `pt-br`, and `en`.
- **Dictionary contract:** define one shared `Dictionary` type covering every user-facing string category. The Spanish dictionary is the source contract implementation; Portuguese and English must satisfy the same type.
- **Content data:** keep product codes and structural catalog data shared. Store localized display names and content fields by locale in typed dictionaries or typed locale-keyed content records. Every P01–P54 entry has a localized name, description, and exactly three localized inclusions while preserving shared code, family, and order.
- **Shared components:** existing header, navigation, outcome navigator, portfolio, product details, sector content, footer, and error/empty states receive the resolved dictionary and localized product data. Do not fork components by locale.
- **Locale assets:** store the three valid SVG files under `public/flags/` and use this exact mapping: `es` → `public/flags/es.svg` (Spain), `pt-BR` → `public/flags/pt-br.svg` (Brazil), and `en` → `public/flags/en.svg` (United States). Public URLs are `/flags/es.svg`, `/flags/pt-br.svg`, and `/flags/en.svg`. Do not use remote assets, emoji, or runtime asset substitution.
- **Static generation:** build one HTML output per locale path. The output must contain the locale’s rendered copy and metadata before JavaScript runs; client hydration may preserve interaction state but must not be responsible for translating the page.

The implementation may introduce small pure locale utilities and a build-time/static-entry layer, but it must not introduce a runtime translation library or a second page implementation.

## Locale Resolution and Data Flow

1. A request to `/es/`, `/pt-br/`, or `/en/` normalizes the path to its supported locale and renders that locale.
2. A request to `/` resolves in this order:
   1. a valid saved user preference;
   2. the browser language, matching `pt`/`pt-BR` to `pt-BR`, `en`/`en-*` to `en`, and Spanish-language values to `es`;
   3. `es` as the safe fallback.
3. An unsupported or malformed locale path resolves safely to the Spanish canonical path `/es/`. It must not render mixed-language content or loop through redirects.
4. The resolved locale selects the dictionary, localized product fields, metadata, `html lang`, and locale selector state.
5. Selecting a locale navigates to its public path while preserving the current URL hash. A hash without a valid target remains preserved rather than discarded.
6. Save the user’s explicit selector choice in `localStorage` under `codedreamers.locale`. Invalid stored values are ignored. Storage failures must not break navigation or rendering.

Locale utilities must be pure and directly testable. They must distinguish canonical locale paths from browser language tags and must never depend on translated display labels.

## Dictionary and Content Contract

The shared contract must cover, at minimum:

- header brand/supporting copy, desktop navigation, mobile menu labels, menu open/close labels, and language selector labels;
- hero, proof metrics, outcome navigator, ecosystem/system content, sectors, catalog headings and family labels;
- product descriptions and all three inclusions for P01–P54;
- search label, input hint, family filter labels, result count, empty/no-results copy, reset controls, details labels, and outcome/filter state copy;
- all CTAs, contact/conversation labels, footer copy, status/error messages, and every visible instructional string;
- every `aria-label`, `aria-labelledby`-related label text, live-region message, expanded/selected state announcement, and visually hidden control label;
- document title, description, Open Graph text, canonical/hreflang values, and any locale-specific metadata text.

The contract must reject missing keys at typecheck time. A completeness test must also enumerate the runtime dictionary keys so a key accidentally supplied as an empty string or omitted through an unsafe cast fails verification. Spanish is authoritative for source copy; translations must preserve meaning, product identity, ordering, and inclusion cardinality rather than use machine translation.

Product invariants:

- exactly 54 products, P01 through P54;
- unchanged shared product codes, family membership, family order, and product order;
- one non-empty localized display name and description per locale, plus exactly three non-empty localized inclusions per product per locale;
- established acronyms and technical terms such as CRM, SaaS, ERP, API, PWA, B2B, and B2C remain intact where linguistically appropriate;
- no locale may omit a product or silently inherit a different locale’s text;
- search and filters operate on the active locale’s localized searchable fields while using product codes as stable identity.

## Components and Interaction

- **Header:** render the existing desktop navigation and mobile menu from the dictionary. Add three native locale links that show only the mapped Spain, Brazil, and United States SVG flags; do not show `ES`, `PT`, `EN`, emoji, or other textual abbreviations. Each link contains `<img alt="" aria-hidden="true">`, has its localized full language name as its accessible name, provides a minimum 44×44 target, and indicates the active locale without relying on color alone. The selector appears in both the desktop header and mobile menu and uses the canonical paths.
- **Landing sections:** pass one resolved dictionary through the existing section composition. All visible copy, headings, labels, metrics, and CTAs come from the active locale.
- **Catalog:** keep the shared 54-product data shape and native independent `<details>/<summary>` behavior. Localize family names, descriptions, inclusion labels, search/filter copy, counts, empty states, and detail labels.
- **URL/hash behavior:** language switching changes only the locale path and preserves `location.hash`, including when switching from a deep catalog or outcome anchor. Existing anchor targets remain stable across locales.
- **Unknown locale:** render or redirect to `/es/` as the single canonical safe path. Never expose a partially translated route.

## Failure Handling

- Missing or invalid saved preference: ignore it and continue with browser-language resolution.
- Storage blocked, unavailable, or throwing: render normally, keep the current locale, and allow path-based switching without persistence.
- Unsupported browser language: use Spanish.
- Unsupported locale path: use `/es/`; ensure canonical metadata also points to `/es/`.
- Missing translation at build time: fail the build or completeness test with the locale and dictionary key; do not silently fall back at runtime.
- Missing product translation: fail verification with the product code, locale, and field name.
- Missing hash target: preserve the hash text during locale switching; normal browser anchor behavior handles an absent target.

## Accessibility

- Set the root document `lang` to `es`, `pt-BR`, or `en` for the active output.
- Use native links for locale navigation so keyboard, assistive technology, copy-link, and no-JavaScript behavior remain available. Each link has its localized full language name as its accessible name; its decorative flag is an `<img alt="" aria-hidden="true">`.
- Give every locale link a minimum 44×44 target, a visible focus indicator, and a semantic or visible non-color active-state indicator.
- Localize menu button open/close labels, navigation labels, locale-link accessible names, search labels, family/outcome filter labels, result live-region text, details labels, and all decorative-element exclusions.
- Preserve visible focus styles, logical heading order, contrast, keyboard operation, native details semantics, and reduced-motion behavior in every locale.
- Ensure translated strings do not cause clipped labels, horizontal overflow, or inaccessible controls at desktop, tablet, and narrow mobile widths. In particular, fix the Task 8-discovered hero H1 clipping in Spanish and Brazilian Portuguese at a 320×568 viewport; the full H1 must remain visible without horizontal overflow.

## SEO and Static Output

Each generated locale page must contain:

- the correct `<html lang>` value;
- localized `<title>` and meta description;
- localized Open Graph title, description, and URL;
- a self-referential canonical URL for `/es/`, `/pt-br/`, or `/en/`;
- a complete reciprocal hreflang set for `es`, `pt-BR`, `en`, plus `x-default` pointing to `/es/`;
- locale-correct absolute URLs and no duplicate canonical declarations.

The build must emit static localized HTML at the three public paths. `/` may resolve through a small preference/language entry behavior, but locale pages must remain directly addressable and crawlable. Metadata must not depend on client-only effects.

## Testing and Verification

Add or update tests for:

1. **Dictionary completeness:** all locales satisfy the shared contract; all runtime keys are present, non-empty where required, and have no accidental untranslated fallback.
2. **Product identity:** P01–P54 exist exactly once with unchanged codes, families, and order; each locale has a localized display name, description, and three inclusions for every product.
3. **Locale resolution:** saved preference wins over browser language; browser language maps correctly; unsupported values fall back to Spanish; `/` and unknown paths resolve safely.
4. **Persistence:** explicit selector choices save and reload when storage works; invalid values and storage exceptions do not break the page.
5. **URL and hash switching:** every selector link targets the correct public path and preserves hashes, including deep catalog/outcome hashes.
6. **Metadata/build output:** each locale emits static HTML with the expected localized `lang`, title, description, Open Graph, canonical, and hreflang values; `/es/`, `/pt-br/`, and `/en/` are present.
7. **Selector assets and semantics:** verify the exact locale-to-file mapping (`es` → `/flags/es.svg`, `pt-BR` → `/flags/pt-br.svg`, `en` → `/flags/en.svg`); each local file exists and parses as valid SVG; every flag `<img>` has `alt=""` and `aria-hidden="true"`; every native link has the localized full language name as its accessible name, a 44×44 target, visible focus, and a non-color active state. Verification must fail clearly if any mapped asset is missing. Assert that the selector renders no visible `ES`, `PT`, or `EN` text, contains no emoji, and makes no remote asset request.
8. **Technical checks:** typecheck and production build pass; the existing test suite remains green.
9. **Browser QA:** desktop-header and mobile-menu selector placement, persistence, locale switching, canonical links, hash preservation, translated search/filter/detail states, keyboard/focus behavior, and console/network errors are verified for all three locales. At 320px width, verify no horizontal overflow and no clipped content; at 320×568 specifically, the complete Spanish and Brazilian Portuguese hero H1 must remain visible.

Run `npm test`, `npx tsc --noEmit`, and `npm run build`. Do not add a test framework or dependency solely for localization.

## Acceptance Criteria

- All three locales are complete, typed, statically rendered, and reachable at `/es/`, `/pt-br/`, and `/en/`.
- `/` resolves saved preference, then browser language, then Spanish; invalid values never produce a broken or mixed-language page.
- The selector appears in the same desktop-header and mobile-menu placements and uses only three local valid SVG flags with the exact mapping `es` → `/flags/es.svg` (Spain), `pt-BR` → `/flags/pt-br.svg` (Brazil), and `en` → `/flags/en.svg` (United States). It has no remote dependency, emoji, or visible `ES`, `PT`, or `EN` text, and a missing mapped asset fails verification.
- Every selector item is a native canonical-path link that preserves hashes and persists explicit choices when possible. Its decorative image is `<img alt="" aria-hidden="true">`; its accessible name is the localized full language name; and it provides a 44×44 target, visible focus, and a non-color active state.
- One shared component/page tree renders all locales; no runtime machine translation, i18n dependency, or duplicated locale pages exists.
- Every visible string, product display name, description/inclusion, aria label, search/filter label, CTA, error, and metadata field is localized and covered by completeness checks.
- P01–P54 retain exact shared codes, count, families, and order, with localized display names and three complete localized inclusions in each locale.
- Static output includes localized `lang`, title, description, Open Graph, canonical, reciprocal hreflang, and `x-default` metadata.
- Typecheck, tests, production build, and desktop/mobile browser QA pass with no known localization, persistence, hash, accessibility, SEO, console, or network errors.
- At 320px width, no locale produces horizontal overflow or clipped content. At 320×568, the Task 8-discovered Spanish and Brazilian Portuguese hero H1 clipping is fixed and each full H1 remains visible.

## Approved Launch Branding and Closure

- Recreate the prototype at `/home/home/workspace/knowledge/codedreamers/web2/logo.png` as clean local SVG assets. Use the symbol alone for the favicon and app icon; use the symbol plus the `CodeDreamers` wordmark in the header. Do not use placeholders, remote assets, or rasterized logo output.
- Preserve the approved localized titles, SEO metadata, public routing, canonical and hreflang behavior, and shared page structure. This branding pass must not introduce a dependency or redesign.
- Before closure, verify SVG asset safety, header responsiveness and accessibility, and browser locales at 320×568 and desktop widths. Confirm the complete localized header remains usable without clipping, overflow, or loss of accessible labeling.
- After verification, sync the completed implementation to the existing `Surge_Ready` tree and deploy it to the existing target. This is a release-closure requirement; it does not authorize creating a new target or changing the deployment destination.
