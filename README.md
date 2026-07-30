# CodeDreamers 360

A static, multilingual landing site for CodeDreamers’ 54-product software, data, and AI portfolio.

Live site: https://codedreamers.surge.sh

## Features

- Responsive branding aligned with the CodeDreamers reference direction.
- Spanish, Brazilian Portuguese, and English routes: `/es/`, `/pt-br/`, and `/en/`.
- Localized catalog PDF downloads.
- Accessible project-mode disclosures and language navigation.
- Responsive footer and contact links.

## Local development

Use npm: `package-lock.json` is the authoritative dependency lockfile.

```bash
npm ci
npm run dev
```

## Commands

```bash
npm run build
npm test
npm run verify:static
npm run preview
```

## Architecture

The Vite + React application renders the landing page from typed locale dictionaries. The production build creates a client bundle, an SSR renderer, and prerendered locale documents. It is fully static: no backend, CDN dependency, or runtime API is required.

## Verification

Run `npm test` for regression coverage, `npm run build` to generate the static site, and `npm run verify:static` to validate rendered assets and metadata.

## Deployment

The build output in `dist/` is deployed to Surge at `codedreamers.surge.sh`.

```bash
npx surge ./dist codedreamers.surge.sh
```

## Repository structure

- `src/CodeDreamersLanding.tsx` — landing UI and interactions.
- `src/i18n/` — typed locale dictionaries, routing, and catalog localization.
- `src/static-render.tsx` — SSR document and localized metadata rendering.
- `src/styles.css` — responsive visual system and motion.
- `scripts/` — prerendering and static-output verification.
- `public/` — brand assets, catalog PDFs, social image, robots, and sitemap.
- `PRODUCT.md` — product source of truth.
- `DESIGN.md` — brand and creative-direction reference.

## Contact

- `codedreamers.dev@gmail.com`
