# Product Catalog Integral Polish

## Goal

Make the 54-product CodeDreamers catalog easier to discover by making business outcomes the primary entry point to the catalog while preserving the current visual identity, product scope, and native detail disclosures.

The refinement must let a visitor start from the result they want, see the catalog filtered to that outcome, and then refine by product family or search. It introduces no new product capability; it changes discovery hierarchy, catalog content quality, and responsive/accessibility behavior.

## Non-Goals

- Do not add products, product families, sectors, services, pricing, contact CTAs, forms, routing, backend behavior, analytics, or new conversion flows.
- Do not replace native `<details>` and `<summary>` disclosures with modals, drawers, custom accordions, or card flips.
- Do not change product codes, names, family membership, ordering, family colors, sector taxonomy, or the page’s established visual language.
- Do not make sectors a primary catalog filter. They remain contextual and specialized information.
- Do not truncate mobile filter labels with ellipsis.

## Current Audit Evidence

The current implementation is concentrated in `src/CodeDreamersLanding.tsx` and has these relevant characteristics:

- `ProductDetails` already types `description` and `includes` as `[string, string, string]`; `Product` retains `code` and `name`, and products remain nested under `ProductFamily`.
- The source declares six families and a 54-product catalog. Existing tests in `src/CodeDreamersLanding.test.ts` preserve the complete P01–P54 identity and family map and verify descriptions plus three inclusions.
- `OutcomeNavigator` already presents business outcomes as a separate interactive navigator with `aria-pressed` buttons, labels, ranges, leads, and explanatory bodies. It is not yet the catalog’s filtering entry point.
- `Portfolio` currently owns `activeFamily` and `query`. Family filtering is primary, and search indexes only `product.name` and `product.code`.
- The catalog already reports the visible count with `aria-live="polite"` and renders each product with native `<details>` and `<summary>`. The detail panel has a description, an “Incluye” label, and an unordered list of the three included items.
- The existing detail design spec establishes the no-contact-CTA rule, preserved family filters, responsive layout, visual language, and reduced-motion requirement.
- `package.json` provides the verification commands `npm test`, `npm run build`, `npm run dev`, and `npm run preview`. Browser behavior is not covered by the current unit contract and therefore requires explicit desktop, tablet, and mobile verification.

This audit defines the baseline. The implementation must extend the current catalog rather than create a parallel catalog surface.

## Interaction Hierarchy

1. **Business outcomes — primary discovery.** The existing outcome cards become the catalog’s primary entry controls. Selecting an outcome sets the active outcome, anchors the visitor to the catalog, and filters the visible products to that outcome’s product range or explicit product association. The selected outcome remains visibly and programmatically selected.
2. **Product families — secondary refinement.** Family controls refine the current outcome result. An “All” family state remains available and means all products in the selected outcome, or all 54 products when no outcome is selected. Selecting a family does not clear the active outcome.
3. **Search — cross-cutting refinement.** Search applies within the active outcome and family scope. Clearing search restores the current scope without resetting the selected outcome or family.
4. **Sectors — contextual specialization.** Sector content continues to explain where the catalog applies. It may link or anchor contextually, but it does not replace outcome discovery or become a competing primary filter.

When an outcome is selected, the catalog anchor is the stable catalog section. The page must not navigate to a new route or open a new surface.

## Data and Content Model

Each product remains nested under its existing family and keeps its existing identity fields. Add or retain an explicit outcome association:

```ts
type Product = {
  code: string
  name: string
  description: string
  includes: [string, string, string]
  outcomeIds: string[]
}
```

If outcome membership is represented by ranges or a separate mapping, the resolved data exposed to filtering must be equivalent to `outcomeIds`: deterministic, explicit, and testable for every product. Existing family metadata remains on `ProductFamily`.

All 54 descriptions are rewritten using this content pattern:

- **Artifact:** name the concrete thing delivered.
- **Primary job:** state the main job it performs for the customer.
- **Differentiating outcome:** state the distinct business result it enables.

Every product must have exactly three included items. Each item must be a parallel noun phrase, not a sentence, and each product’s three items must be concrete and non-empty. Do not use unsupported guarantees, generic filler, or repeated template text.

Search must normalize case and whitespace consistently and index these fields:

- `code`
- `name`
- `description`
- every item in `includes`

Search does not index unrelated page copy, family promises, sector copy, or hidden implementation metadata.

## Responsive Behavior

- Desktop may present outcome cards and family controls in the existing wide layout without changing the established typography, spacing rhythm, dark surfaces, borders, or accent colors.
- Tablet must preserve the same hierarchy while allowing controls to wrap without overlapping the catalog, result count, search field, or detail rows.
- Mobile controls use accessible horizontal scrolling for chips when the full set cannot fit. Chips retain their complete labels, remain individually reachable, and do not use ellipsis or clipped text as a substitute for scrolling.
- The selected chip/card remains visually identifiable after scrolling. The scroll container must not trap keyboard focus or prevent standard horizontal touch scrolling.
- Product detail panels remain inline, full-width, and readable. Opening a detail does not alter filter or search state.
- Existing responsive navigation, family accent treatment, and reduced-motion behavior remain intact.

## Accessibility

- Outcome controls expose selected state with an appropriate native button interaction and `aria-pressed` or equivalent state. The selected outcome is perceivable without relying on color alone.
- Family chips expose their selected state and remain keyboard reachable. The “All” state is unambiguous.
- The catalog result count remains a polite live region and updates when outcome, family, or search scope changes.
- Search retains an associated visible label and `type="search"` semantics.
- Outcome activation moves focus only when necessary to make the filtered catalog discoverable; any focus movement must be predictable and must not strand the user.
- Product details continue to use native `<details>` and `<summary>` semantics. Pointer and keyboard activation must both toggle them, and multiple details may remain open.
- Decorative arrows and route graphics remain `aria-hidden="true"`. Visible focus styles, contrast, heading order, and list semantics remain present.
- Under `prefers-reduced-motion: reduce`, outcome transitions, chip movement, detail expansion, and arrow rotation become immediate or otherwise non-animated.

## Testing and Verification

The implementation must add or update tests for:

1. **54-product contract:** exactly P01–P54, unique codes, unchanged names/families/order, non-empty descriptions, exactly three non-empty parallel noun-phrase includes, and valid outcome association for every product.
2. **Outcome filtering:** each outcome selects the expected product set, updates the result count, anchors the catalog, exposes selected state, and preserves family/search refinement behavior.
3. **Family filtering:** family selection refines the selected outcome, “All” restores the outcome scope, and clearing the outcome restores the full catalog scope.
4. **Expanded search:** code, name, description, and each include item produce matches; unrelated fields do not produce matches; result counts and no-result behavior stay accurate.
5. **Browser behavior:** desktop, tablet, and mobile checks cover outcome selection, family chips, horizontal chip scrolling with full labels, search, result count, keyboard focus, native detail disclosures, and reduced-motion behavior.

Run the repository’s existing technical checks from the project root:

```sh
npm test
npm run build
```

For browser verification, use the project’s existing dev/preview flow and record viewport-specific evidence. Do not add a new test framework solely for this refinement.

## Exact Invariants

- The catalog contains exactly 54 products: P01 through P54.
- Product codes, names, family membership, family order, and product order are unchanged.
- Each product has one non-empty description and exactly three non-empty `includes` values.
- Each product resolves to at least one declared business outcome; outcome membership is deterministic.
- Outcome selection is the primary catalog discovery action.
- Family selection is a secondary refinement and never silently clears the active outcome.
- Search matches only code, name, description, or includes.
- Sectors remain contextual/specialized and are not the primary catalog filter.
- Mobile chips show full labels through horizontal scrolling, never ellipsis.
- Every product uses independent native details disclosure behavior.
- No product detail contains a contact CTA or contact link.
- Selected state, live result count, keyboard operation, visible focus, and reduced-motion behavior remain accessible.
- No new product capability or backend dependency is introduced.

## Rollout and Verification

Implement the refinement in the existing catalog data and components, then run the data/filter tests before browser checks. Run `npm test` and `npm run build` from the source project. Serve the verified source build through the existing Vite dev or preview command and check desktop, tablet, and mobile viewports. Confirm the outcome-to-catalog anchor, refinement persistence, full mobile chip labels, disclosure behavior, keyboard operation, live result count, and reduced-motion behavior. Only after source verification may the existing Surge-ready output be regenerated; generated output is not a substitute for source verification.

## Resolved Decisions

- Business outcomes are the primary discovery entry and drive catalog filtering and anchoring.
- Product families remain secondary refinements rather than the main navigation model.
- Sectors remain contextual and specialized.
- Mobile chips use full labels with accessible horizontal scrolling instead of ellipsis.
- Search expands to code, name, description, and includes.
- All 54 product texts follow artifact + primary job + differentiating outcome, with exactly three parallel noun-phrase includes each.
- Native independent details disclosures remain unchanged in interaction model.
- Product details contain no contact CTA.
- Existing selected-state, result-count, keyboard, and reduced-motion accessibility requirements remain mandatory.
