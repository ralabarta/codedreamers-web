# Product Catalog Detail Accordions

## Goal

Replace each product email link with an inline, accessible detail panel that explains the service without leaving the catalog.

## Scope

- Update all 54 product entries.
- Add one concise description and exactly three included items to every product.
- Replace each `mailto:` product row with native `<details>` and `<summary>` markup.
- Preserve existing family filters, search, responsive layout, visual language, and reduced-motion behavior.
- Regenerate the Surge-ready build from source after verification.

## Out of Scope

- Contact links or calls to action inside product details.
- Modals, drawers, 3D card flips, routing, backend services, analytics, or forms.
- Refactoring unrelated landing-page sections.

## Content Model

Each product entry remains nested under its existing `ProductFamily`. It keeps `code` and `name` and adds:

```ts
type ProductDetails = {
  description: string
  includes: [string, string, string]
}
```

Family metadata and filtering remain unchanged on the parent `ProductFamily`.

Content requirements:

- `description` is one short, specific commercial sentence.
- `includes` contains three concrete deliverables or capabilities.
- Wording remains distinct across products and avoids unsupported guarantees, vague filler, and repeated templates.
- Existing product codes, names, families, and ordering remain unchanged.

## Interaction

Each product renders as a native `<details>` element:

- `<summary>` retains the product code, name, and decorative arrow.
- Activating the summary with pointer or keyboard toggles the inline panel.
- Multiple products may remain open simultaneously.
- The open panel contains the description, an “Includes” label, and three list items.
- Opening a product does not navigate, launch email, or change filter/search state.

## Visual Design

- Preserve current catalog typography, spacing rhythm, dark surfaces, fine borders, and family accent color.
- Expand within the existing product row instead of creating a modal or separate card.
- Rotate the decorative arrow when open.
- Reveal content with a short vertical transition consistent with existing motion.
- Keep content full-width and readable on mobile without changing toolbar, filters, or search behavior.

## Accessibility

- Use native `<details>` and `<summary>` semantics and keyboard behavior.
- Preserve visible focus styling.
- Keep the arrow decorative with `aria-hidden="true"`.
- Maintain sufficient contrast for body text, labels, bullets, borders, and family accents.
- Under `prefers-reduced-motion: reduce`, make expansion and arrow transitions effectively immediate.

## Data Flow and Error Handling

Product details are static, local, and TypeScript-typed. No loading, network, empty, or runtime error states are required. Tuple typing enforces exactly three included items per product.

## Verification

- TypeScript and production build pass.
- Catalog still contains all 54 products with unchanged codes, names, families, and order.
- Every product has one non-empty description and exactly three non-empty included items.
- Every product opens and closes with pointer and keyboard.
- Search and family filters continue to work with open and closed products.
- Focus styling, mobile layout, and reduced-motion behavior remain correct.
- Desktop and mobile browser smoke tests pass.
- `CodeDreamers_360_Surge_Ready` is regenerated only from the verified source build.
