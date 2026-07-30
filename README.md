# CodeDreamers 360

Static multilingual landing site built with React, TypeScript, and Vite.

Live URL: https://codedreamers.surge.sh

## Features

- Responsive CodeDreamers branding and accessible navigation.
- Prerendered Spanish, Brazilian Portuguese, and English routes.
- Searchable 54-product portfolio with localized catalog downloads.
- Static SEO metadata, sitemap, Open Graph assets, and responsive contact flow.

## Install

Requires Node.js 20 or later.

```bash
npm ci
```

## Develop and test

```bash
npm run dev
npm test
```

## Build and verify

```bash
npm run build
npm run verify:static
npm run preview
```

The production-ready static site is written to `dist/`.

## Architecture

Vite builds the React client and an SSR bundle. The prerender step emits localized static documents for `/es/`, `/pt-br/`, and `/en/`; production needs no backend or runtime API.

- `src/CodeDreamersLanding.tsx` — landing UI and interactions.
- `src/i18n/` — typed locale dictionaries and catalog localization.
- `scripts/` — prerendering and static-output verification.
- `public/` — branding, catalog files, flags, social assets, robots, and sitemap.

## Catalog PDF transport

Surge blocks direct `.pdf` paths. The catalog `.bin` files are byte-identical transport copies of their corresponding PDFs. Catalog links request the `.bin` paths, while their `download` attributes preserve the localized `.pdf` filenames presented to users.

`npm run verify:static` checks that each source PDF, source `.bin` copy, and built `.bin` copy are byte-for-byte equal. It also validates the rendered catalog download paths and filenames.

## Deploy to Surge

```bash
npm run build
npm run verify:static
npx surge ./dist codedreamers.surge.sh
```
