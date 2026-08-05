# CodeDreamers 360

Multilingual static landing site for CodeDreamers — software, data, automation, and AI solutions. Built with React, TypeScript, and Vite; prerendered to plain HTML with zero runtime backend.

**Live:** https://codedreamers.surge.sh

## Features

- Prerendered Spanish (`/es/`), Brazilian Portuguese (`/pt-br/`), and English (`/en/`) routes.
- Searchable, filterable 54-product portfolio with localized catalog downloads (ES / PT-BR / EN).
- Responsive design with accessible navigation, skip links, and reduced-motion support.
- Static SEO: per-locale metadata, `sitemap.xml`, `robots.txt`, and Open Graph assets.
- 112 automated tests plus a static-output verification script that gates every deploy.

## Tech stack

| Layer | Tooling |
|-------|---------|
| UI | React + TypeScript |
| Build | Vite (client + SSR bundle) |
| Prerender | Custom Node script (`scripts/prerender.mjs`) |
| Tests | Vitest |
| Hosting | Surge (static, no server) |

## Quick start

Requires Node.js 20+.

```bash
npm ci        # install
npm run dev   # local dev server
npm test      # run test suite
```

## Build and verify

```bash
npm run build          # client + SSR + prerender → dist/
npm run verify:static  # asserts routes, metadata, and catalog integrity
npm run preview        # serve dist/ locally
```

## Architecture

Vite builds the React client and an SSR bundle. The prerender step emits localized static documents for each locale; production needs no backend or runtime API.

- `src/CodeDreamersLanding.tsx` — landing UI and interactions.
- `src/i18n/` — typed locale dictionaries and catalog localization.
- `scripts/` — prerendering and static-output verification.
- `public/` — branding, catalog files, flags, social assets, robots, and sitemap.

## Catalog PDF transport (Surge workaround)

Surge blocks direct `.pdf` paths. The catalog `.bin` files are byte-identical transport copies of their corresponding PDFs: links request the `.bin` paths while their `download` attributes preserve the localized `.pdf` filenames users see.

`npm run verify:static` asserts that each source PDF, source `.bin`, and built `.bin` are byte-for-byte equal, and validates the rendered download paths and filenames.

## Deploy to Surge

```bash
npm run build
npm run verify:static
npx surge ./dist codedreamers.surge.sh
```

## License

See [LICENSE](LICENSE).
