# Final Landing Polish Design

## Decision

Complete the landing page with three complementary refinements: a native back-to-top anchor, a fully articulated inline architecture SVG in `Contact`, and localized icon-only WhatsApp links in both existing phone-link positions. This design is additive to the approved [Project Modality Details Design](./2026-07-29-project-modality-details-design.md). A later single TDD implementation plan must implement both specifications together without changing either approved contract.

## Goals

- Give keyboard, touch, and pointer users a predictable native return to `#inicio` after the hero leaves the viewport.
- Replace the incomplete six-node CSS ornament with a complete, self-contained architecture diagram whose motion starts through the existing section-reveal mechanism.
- Remove visible phone digits from the rendered interface while preserving a direct, localized WhatsApp project-contact path.
- Preserve shared rendering, locale prerendering, search metadata, reduced-motion behavior, and the current dependency footprint.

## Scope

### In scope

- `CodeDreamersLanding`, `Contact`, the hero visibility boundary, and one new shared `BackToTop` component.
- The `Dictionary` contract and the `es`, `pt-BR`, and `en` dictionaries.
- Contact-visual, back-to-top, focus, motion, safe-area, and responsive styles.
- Static render assertions, component/content tests, and browser QA for the three refinements.

### Non-goals

- No change to the approved project-modality design, copy, native disclosure behavior, or modality email subjects.
- No router, scroll library, icon library, animation library, analytics event, contact form, scheduling flow, or WhatsApp SDK.
- No replacement of the existing email links or contact-section copy.
- No phone-number change, JSON-LD schema redesign, locale addition, new route, or metadata rewrite.
- No scroll-progress indicator, floating action menu, tooltip, toast, modal, or custom scrolling handler.
- No redesign of the hero, contact layout, footer, typography, palette, or global reveal system beyond the rules explicitly defined here.

## Typed Content Contract

Extend the existing `Dictionary` interface with these exact fields:

```ts
export interface Dictionary {
  // Existing fields remain unchanged except for the contact replacement below.
  backToTop: {
    ariaLabel: string;
  };
  contact: {
    eyebrow: string;
    title: readonly string[];
    action: string;
    mailSubject: string;
    whatsappAriaLabel: string;
    whatsappMessage: string;
    footerSummary: string;
  };
}
```

`contact.phoneLabel` is removed because neither replacement WhatsApp link has visible text. `whatsappAriaLabel` and `whatsappMessage` are required, non-empty locale content. One dictionary object remains the only localized input to the shared component tree; there is no locale branch in JSX and no runtime fallback between dictionaries.

The existing hero DOM contract becomes `<section id="inicio" tabIndex={-1}>` so script can move focus to the native hash destination without adding it to sequential keyboard navigation. This is a shared component contract, not localized content: it adds no `Dictionary` field, locale prop, fallback, or locale-specific JSX branch.

## Approved Localized Content

| Locale | `backToTop.ariaLabel` | `contact.whatsappAriaLabel` | `contact.whatsappMessage` |
| --- | --- | --- | --- |
| `es` | `Volver al inicio` | `Conversar con CodeDreamers por WhatsApp sobre un proyecto` | `Hola, CodeDreamers. Me gustaría conversar sobre un proyecto.` |
| `pt-BR` | `Voltar ao início` | `Conversar com a CodeDreamers pelo WhatsApp sobre um projeto` | `Olá, CodeDreamers. Gostaria de conversar sobre um projeto.` |
| `en` | `Back to top` | `Discuss a project with CodeDreamers on WhatsApp` | `Hello, CodeDreamers. I would like to discuss a project.` |

The messages are exact authored copy. Tests must reject trimming, fallback, substitution, or punctuation changes unless this specification is revised.

## URL Construction and Encoding

Both WhatsApp anchors use the same destination builder:

```ts
const href = `https://wa.me/5352015051?text=${encodeURIComponent(
  copy.whatsappMessage,
)}`;
```

This is a normative contract, not a tested implementation example. The implementation phase must compile and test it. The phone number uses digits only, with no `+`, spaces, parentheses, or hyphens. `encodeURIComponent` is called exactly once on the raw localized message; the complete URL must not be encoded again, decoded before assignment, manually concatenated from encoded fragments, or converted with form encoding. Spaces therefore serialize as `%20`, never `+`.

The exact destinations are:

- `es`: `https://wa.me/5352015051?text=Hola%2C%20CodeDreamers.%20Me%20gustar%C3%ADa%20conversar%20sobre%20un%20proyecto.`
- `pt-BR`: `https://wa.me/5352015051?text=Ol%C3%A1%2C%20CodeDreamers.%20Gostaria%20de%20conversar%20sobre%20um%20projeto.`
- `en`: `https://wa.me/5352015051?text=Hello%2C%20CodeDreamers.%20I%20would%20like%20to%20discuss%20a%20project.`

Every WhatsApp anchor has `target="_blank"` and `rel="noreferrer"`. The URL is derived only from the fixed destination number and trusted dictionary copy. It accepts no query, hash, user, storage, or remote input.

## Components and Data Flow

1. Existing locale resolution selects `es`, `pt-BR`, or `en` and returns one complete `Dictionary`.
2. `CodeDreamersLanding` passes `dictionary.contact` to `Contact` and `dictionary.backToTop` to `BackToTop`.
3. `Contact` builds one WhatsApp `href` from `copy.whatsappMessage` and reuses that exact value for the action-area and footer links.
4. `Contact` renders the same icon-only WhatsApp anchor treatment in the current `contact__phone` position and the footer position. Existing email anchors remain unchanged.
5. `ContactArchitecture` is a stateless decorative child of `Contact`. It receives no localized copy, state, callback, timer, or external asset.
6. `BackToTop` renders one fixed native `<a href="#inicio">` and derives one boolean visibility state from three observed targets. On mount it resolves the existing hero element with `id="inicio"`, the Contact section, and the footer; creates exactly one new `IntersectionObserver`; and uses that same instance to observe all three. The control is visible if and only if the hero is not intersecting and neither protected collision target—the Contact section or footer—is intersecting. It disconnects that observer on unmount.
7. `BackToTop` handles anchor activation without canceling it: the click handler does not call `preventDefault`, allows normal hash navigation, and schedules exactly one `requestAnimationFrame` that focuses `#inicio` with `{ preventScroll: true }`. The hero's `tabIndex={-1}` permits this programmatic focus without adding a new sequential tab stop.
8. The existing reveal observer remains responsible for `[data-reveal]` elements. The architecture SVG joins that mechanism; it does not create another observer. No scroll or resize listener controls either feature.

If `IntersectionObserver` is unavailable or any required target (`#inicio`, Contact, or footer) is absent, `BackToTop` remains hidden and unfocusable. The native hash destination and all other page behavior remain unaffected. Observer setup and activation behavior are identical for every locale.

## Back-to-Top Interaction and Presentation

- The control is an `<a href="#inicio">` with one inline upward-arrow SVG. Its click handler preserves normal hash behavior: it uses no `preventDefault`, timer, history replacement, or JavaScript scrolling call, and schedules exactly one `requestAnimationFrame` after activation to call `document.getElementById('inicio')?.focus({ preventScroll: true })`.
- The existing `#inicio` hero has `tabIndex={-1}`. After the native jump, focus lands on that section before the observer-driven hide completes; the next `Tab` continues to the first sequentially focusable element after `#inicio` in document order rather than returning to the floating control.
- The anchor uses the localized `backToTop.ariaLabel`. Its SVG is decorative with `aria-hidden="true"` and `focusable="false"`.
- Initial state remains hidden until the observer has current intersection state for all three targets. Hidden state uses `aria-hidden="true"`, `tabIndex={-1}`, `visibility: hidden`, `opacity: 0`, and `pointer-events: none`. Visible state removes `aria-hidden`, restores normal sequential focus with `tabIndex={0}`, sets `visibility: visible`, and enables pointer events. A hidden control can never receive pointer or keyboard focus.
- One observer uses the viewport root, no `rootMargin`, and threshold `0` for the hero, Contact section, and footer. The control is visible if and only if the hero is not intersecting and neither Contact nor footer intersects; it hides whenever any part of the hero or either protected target intersects and can reveal again when scrolling back into an unprotected mid-page position.
- The interactive box is exactly `44px × 44px`, satisfying the minimum target without an undersized internal hit area. The arrow remains centered and does not define the hit target.
- The control has visible default, hover, active, and `:focus-visible` states with at least a 2px focus indicator and at least 3:1 non-text contrast against adjacent colors.
- Desktop placement is fixed at the viewport’s lower-right edge using `right: max(1rem, env(safe-area-inset-right))` and `bottom: max(1rem, env(safe-area-inset-bottom))`.
- At widths up to 620px, use `right: max(0.75rem, env(safe-area-inset-right))` and `bottom: max(5rem, calc(env(safe-area-inset-bottom) + 0.75rem))`. The 5rem mobile clearance reserves the bottom CTA/action zone.
- Contact and footer are the protected collision targets because they contain persistent contact actions. Ordinary document content may scroll beneath the fixed floating control. The control must never block fixed navigation or an open mobile menu, and it must hide before Contact or footer actions can occupy the same viewport.
- The control remains above page decoration and below an open mobile navigation overlay. Opening the menu cannot expose the control over the menu or add it to the menu focus order.

## Architecture Visual Contract

Replace the current `contact-route` element and its six empty spans with one self-contained inline SVG rendered by `ContactArchitecture`:

- Root: `<svg className="contact-architecture" viewBox="0 0 520 520" aria-hidden="true" focusable="false" data-reveal>`.
- Core: one visibly dominant central node at `(260, 260)`, composed of a filled core circle and one surrounding ring.
- Network: six distinct branch paths radiate from the core toward six distributed endpoints. Each branch includes at least one directional bend or secondary segment; no branch is a disconnected decorative stroke.
- Endpoints: six endpoint nodes terminate the six paths. Their positions distribute visual weight across the viewBox and preserve a clear center-to-edge hierarchy.
- Signal motif: one concentric pulse ring originates at the core and one small signal marker travels visually along a designated branch during the reveal sequence. In the static final state, both read as a signal emitted from the core rather than as an unrelated orbit.
- Completeness: every endpoint connects to the core, path endpoints visually meet their nodes, no path is clipped, and the diagram reads as a complete system at desktop and mobile sizes.
- Safety: the SVG contains no `<script>`, event attribute, external URL, `href`, `xlink:href`, remote asset, embedded HTML, or externally referenced definition. Styling comes from existing CSS and SVG presentation attributes only.

The SVG is decorative and never gains an accessible name, role, tab stop, pointer action, or selectable text. Contact content remains the semantic explanation of the section.

## Reveal and Motion Behavior

- The existing reveal observer adds `is-visible` to the SVG root once the architecture visual enters the section-reveal boundary. No timer, React animation state, animation event handler, or animation-specific observer is added.
- Before reveal, paths use normalized `pathLength="1"`, `stroke-dasharray: 1`, and `stroke-dashoffset: 1`; nodes are scaled down and transparent; the pulse and signal marker are transparent.
- `.contact-architecture.is-visible` starts CSS-only animation in this order: core appears, branches draw outward, endpoints resolve as their branches complete, then one restrained pulse/signal pass completes. The full sequence lasts no more than 1.8 seconds and ends with all structural paths and nodes visible.
- The signal/pulse may repeat at most once every 4 seconds after the initial reveal. It must not flash, change luminosity abruptly, or exceed three flashes in any one-second period.
- Back-to-top reveal/hide uses only opacity and transform, lasts 180–240ms, and never animates layout properties.
- Move `scroll-behavior: smooth` from the unconditional `html` rule into `@media (prefers-reduced-motion: no-preference)`. Native hash navigation is instant when reduced motion is requested.
- Under `@media (prefers-reduced-motion: reduce)`, the architecture SVG displays its fully rendered final state immediately: all paths have zero dash offset, all nodes are opaque at full scale, and pulse/signal animation is disabled. Back-to-top transitions and transforms are disabled. Content is never hidden pending animation.

## WhatsApp Link Semantics and Presentation

- Both current visible `tel:+5352015051` anchors are replaced; no telephone anchor remains in rendered UI.
- Each replacement contains one inline WhatsApp SVG and no visible or visually hidden phone digits. The accessible name comes only from `contact.whatsappAriaLabel` on the anchor.
- Each inline icon has `aria-hidden="true"`, `focusable="false"`, no external reference, and no event attribute. It inherits color and remains recognizable at its rendered size.
- Both links meet a minimum `44px × 44px` target, have visible hover/active/focus-visible states, and keep the current action-area/footer hierarchy without introducing visible label text.
- Opening a WhatsApp link creates a new tab through native anchor behavior. `rel="noreferrer"` prevents the destination from receiving the page referrer and implies opener isolation in supported browsers.
- The visible page source, hydrated DOM text, accessible names, and link labels contain no formatted or unformatted phone digits. The fixed destination necessarily remains in each anchor’s non-visible `href`.

## Responsive Behavior

### Above 900px

- Preserve the current contact composition and footer grid.
- The architecture SVG occupies the existing right-side visual region without covering the heading, primary email CTA, WhatsApp action, or footer.
- The fixed back-to-top control stays within desktop safe-area offsets, remains below fixed navigation/menu layers, and hides while Contact or footer intersects.

### 621px–900px

- Scale the SVG fluidly within its preserved square viewBox; do not crop branches or endpoints.
- Keep both contact methods reachable with 44px targets and maintain the existing content order.
- Keep the back-to-top control at its fixed safe-area position; it hides before wrapping Contact actions or footer actions intersect.

### 320px–620px

- Preserve the current stacked contact actions and footer flow.
- Scale and reposition the SVG as a background visual without horizontal overflow, clipped endpoints, or reduced contrast behind actionable content.
- Apply the 5rem back-to-top bottom clearance and safe-area offsets. At 320×568, the control remains fully on-screen, below fixed navigation/menu layers, and hidden whenever the Contact section or footer intersects.
- Ordinary mid-page content may scroll beneath the floating control; collision protection applies specifically to fixed navigation/menu and the persistent actions in Contact and the footer.
- Icon-only WhatsApp links retain their 44px targets even when the footer wraps; neither icon may shrink.

## Static Prerender and SEO Expectations

- `/es/`, `/pt-br/`, and `/en/` prerender the localized back-to-top anchor, both localized WhatsApp anchors, and the complete inline architecture SVG before hydration.
- Initial static back-to-top markup is hidden, has `aria-hidden="true"`, and has `tabindex="-1"`; it remains a valid `href="#inicio"` anchor for progressive enhancement.
- Each locale’s two WhatsApp `href` values exactly match its approved encoded destination. Both include `target="_blank"` and `rel="noreferrer"`.
- Prerendered visible text contains no `+53 52015051`, `5352015051`, or equivalent formatted phone digits. The number may appear only in the two WhatsApp `href` values and the Organization JSON-LD.
- Preserve `organizationJsonLd(locale).telephone` unchanged. JSON-LD is non-visible structured organization metadata, remains truthful contact data, and supports search-engine entity understanding; this UI polish does not remove or redefine that metadata.
- Existing canonical URLs, alternate locale links, metadata, locale paths, root noindex behavior, and hydration output remain unchanged.
- The page remains readable and both WhatsApp links remain usable without client JavaScript. Back-to-top visibility enhancement may remain unavailable without JavaScript; native in-page links elsewhere remain functional.

## Automated Tests

The later TDD plan must add failing tests before implementation and cover both this specification and the approved project-modality specification in one delivery sequence. No test framework or dependency is added.

Add or update tests that prove:

1. **Dictionary contract:** all three dictionaries contain non-empty exact `backToTop.ariaLabel`, `contact.whatsappAriaLabel`, and `contact.whatsappMessage` values; `contact.phoneLabel` no longer exists.
2. **Exact encoding:** each raw approved message produces its exact approved URL through one `encodeURIComponent` call; spaces are `%20`; values are neither double-encoded nor form-encoded.
3. **WhatsApp replacement:** every locale renders exactly two `wa.me` anchors, zero `tel:` anchors, and no visible phone digits; both anchors have icon-only content, the localized accessible name, `target="_blank"`, and `rel="noreferrer"`.
4. **Structured metadata:** Organization JSON-LD retains the current telephone while visible prerendered body text does not expose phone digits.
5. **Back-to-top markup:** every locale renders one `<a href="#inicio">` with the localized accessible name, decorative inline SVG, initial hidden state, `aria-hidden="true"`, and `tabindex="-1"`; the existing `#inicio` section renders with `tabindex="-1"` and no locale-dependent variation.
6. **Protected visibility and cleanup:** a mocked `IntersectionObserver` proves exactly one new observer instance observes `#inicio`, Contact, and footer; remains hidden until target state is known; is visible only when the hero is not intersecting and neither protected target intersects; hides for hero, Contact, and footer intersection; reveals again on return to an unprotected mid-page state; and disconnects on unmount.
7. **Fallback safety:** missing `IntersectionObserver` or any required target (`#inicio`, Contact, or footer) leaves the control hidden and causes no exception, listener registration, timer, or scrolling override.
8. **Native navigation and focus handoff:** the anchor click handler does not call `preventDefault` or an imperative scroll API, preserves `href="#inicio"` and normal hash behavior, and schedules exactly one `requestAnimationFrame`. After that frame, assert `document.activeElement === document.getElementById('inicio')`; after one `Tab`, assert focus is the first sequentially focusable element after `#inicio` in document order and is not the now-hidden floating control. Assert `focus` receives `{ preventScroll: true }` and no timer is scheduled.
9. **SVG completeness:** the Contact visual is one inline SVG with one core, six connected branches, six endpoints, and pulse/signal elements; the old six empty spans are absent.
10. **SVG safety and semantics:** the SVG is `aria-hidden`, non-focusable, and contains no script, event attribute, external reference, interactive descendant, or accessible text.
11. **Motion contract:** source/style assertions verify smooth scrolling only in `prefers-reduced-motion: no-preference` and a fully visible, animation-free architecture final state in `prefers-reduced-motion: reduce`.
12. **Prerender regression:** all locale documents contain the exact localized additions while canonical, alternate, metadata, root noindex, and existing landing content assertions continue to pass.
13. **Combined scope:** all modality completeness, native disclosure, CTA encoding, and prerender tests required by the approved modality design pass in the same suite.

## Browser QA

Run browser QA on all six locale/viewport combinations: `es`, `pt-BR`, and `en` at `320×568` and `1280×720`.

For each combination, verify:

- The page loads and hydrates with no console error, uncaught exception, failed local asset, unexpected network request, or horizontal overflow.
- At representative scroll positions, verify this exact sequence: while any hero pixel intersects, the control is hidden and cannot be reached with `Tab`; at an unprotected mid-page position it is visible; while Contact intersects it is hidden; while footer intersects it remains hidden; and after scrolling upward to the unprotected mid-page position it is visible again.
- Whenever visible, the control appears at the safe-area offset, has a measured `44×44` hit target, shows a visible focus ring, and is reachable in logical tab order. It remains below fixed navigation and an open mobile menu.
- Activate the control separately by pointer and keyboard. In both cases, assert the URL hash becomes `#inicio` through native navigation; after one animation frame, assert `document.activeElement === document.getElementById('inicio')`; then press `Tab` once and assert focus advances to the first sequentially focusable element after `#inicio` in document order, not to the floating control. Confirm the activation uses no timer or canceled default event and that the control hides as the hero intersects.
- Default motion scrolls smoothly; emulated reduced motion navigates without smooth scrolling and without control or SVG animation.
- The architecture visual has one clear core, six visibly connected branches, six endpoints, and one coherent signal motif. Nothing is clipped, detached, incomplete, or mistaken for an interactive control.
- The architecture sequence begins when the existing section reveal reaches it, completes within 1.8 seconds, and ends fully rendered. Reduced motion shows that same final composition immediately.
- Both former phone positions show recognizable icon-only WhatsApp links with measured targets of at least `44×44`, localized accessible names, visible focus treatment, and no visible phone digits.
- Each WhatsApp link exposes the exact locale URL, opens a new tab, has no opener/referrer relationship observable by the page, and preserves the current tab.
- At both viewports, ordinary document content can scroll beneath the floating control. Verify the control never blocks fixed navigation or an open mobile menu and hides before Contact or footer actions intersect; at `1280×720`, also confirm its visible mid-page state does not visually compete with the architecture region.
- Existing email CTAs, locale navigation, project modalities, product disclosures, and footer layout remain operable and visually unchanged outside approved adjustments.

Also disable JavaScript for one prerender inspection per locale and confirm complete localized WhatsApp links, complete SVG markup, hidden back-to-top markup, readable content, and unchanged SEO metadata.

## Acceptance Criteria

- Exactly one fixed native back-to-top anchor targets the existing `#inicio` hero and contains one decorative inline upward-arrow SVG; `#inicio` has `tabIndex={-1}` for programmatic focus without becoming a sequential tab stop.
- Exactly one new `IntersectionObserver` observes the hero, Contact section, and footer. The anchor is visible if and only if the hero is not intersecting and neither protected target intersects; cleanup disconnects that observer, and no scroll or resize listener is introduced.
- Activation preserves `href="#inicio"` and uncanceled native hash navigation, uses no timer or imperative scrolling, and schedules exactly one `requestAnimationFrame` to focus `#inicio` with `{ preventScroll: true }`. Focus lands on `#inicio`, and the next `Tab` advances to the first sequentially focusable element after it rather than the floating control.
- The anchor is pointer- and focus-inert while hidden, becomes operable only in unprotected mid-page positions, measures exactly `44×44`, and respects safe-area positioning. Ordinary content may scroll beneath it; it never blocks fixed navigation or an open mobile menu and hides before Contact or footer actions intersect.
- Smooth scrolling applies only when motion is allowed; reduced motion uses instant native hash navigation and disables all new transitions and animation.
- The former six-span Contact ornament is removed and replaced by one self-contained decorative inline SVG with one core, six connected branches, six endpoint nodes, and one coherent pulse/signal motif.
- Existing section reveal starts the SVG’s CSS-only sequence; no timer or animation dependency is added. The sequence completes within 1.8 seconds, and reduced motion displays the complete static final state immediately.
- The SVG is aria-hidden, non-focusable, non-interactive, self-contained, unclipped at both required viewports, and free of scripts, event attributes, and external references.
- Both visible `tel:+5352015051` links are replaced by icon-only inline WhatsApp links. Rendered UI contains no visible phone digits and no `tel:` link.
- Every WhatsApp link uses the exact fixed number, exact locale message, exact percent-encoded URL, localized accessible name, `target="_blank"`, and `rel="noreferrer"`.
- `es`, `pt-BR`, and `en` satisfy the typed fields with no fallback, placeholder, empty value, or locale-specific JSX branch.
- Organization JSON-LD retains its existing telephone; all existing canonical, alternate, metadata, locale route, noindex, and hydration behavior remains unchanged.
- No dependency, route, state abstraction, page redesign, or out-of-scope feature is introduced.
- One later TDD plan implements and verifies this design together with `2026-07-29-project-modality-details-design.md`; all automated tests and all six required browser locale/viewport combinations pass.
