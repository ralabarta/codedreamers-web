# Project Modality Details Design

## Decision

Replace the nine `ProjectModes` row-level email links with nine independent native `<details>` disclosures. Each closed row keeps its stable `01`–`09` index, localized modality name, and decorative arrow. Each expanded panel adds one concise localized description, a localized “What it includes” label, exactly three concrete localized inclusions, and one contextual `mailto:` CTA.

The summary is the disclosure control, not a link. Opening or closing it must never navigate, change the URL, or invoke an email client. Only the CTA inside the expanded panel may invoke the email client.

## Goals

- Let visitors understand a project modality before deciding to contact CodeDreamers.
- Preserve the current visual hierarchy, modality order, localized names, and modality-specific email subjects.
- Use the same native disclosure pattern already established by product details.
- Keep one shared React component tree and typed dictionaries for `es`, `pt-BR`, and `en`.
- Produce complete localized disclosure content in statically prerendered HTML.

## Scope

### In scope

- The `ProjectModes` rows and their localized dictionary contract.
- Native disclosure markup, interaction semantics, responsive layout, and focus treatment.
- Localized descriptions, inclusion labels, three-item inclusion lists, and contextual CTA labels.
- Existing `mailto:codedreamers.dev@gmail.com` behavior with the current localized subject formula.
- Automated tests and browser QA for modality completeness, disclosure behavior, accessibility, prerendering, and responsive presentation.

### Non-goals

- No modal, drawer, accordion library, or custom disclosure primitive.
- No controlled React open state, shared open-state store, persistence, deep link, analytics event, or one-open-at-a-time behavior.
- No new dependency, i18n library, state abstraction, routing change, or data-fetching layer.
- No redesign of the section, page composition, product disclosures, contact section, typography, color system, or global motion system.
- No change to the recipient address or the existing localized modality-specific subject formula.
- No contact form, scheduling flow, CRM integration, or replacement for `mailto:`.

## Stable Modality Identity and Order

The following identities and order are immutable across all locales. The visible index is derived from this order with `String(index + 1).padStart(2, "0")`.

| Index | Stable ID | English identity |
|---|---|---|
| 01 | `product-from-scratch` | Product from scratch |
| 02 | `mvp-prototype` | MVP / prototype |
| 03 | `redesign-modernization` | Redesign and modernization |
| 04 | `new-module` | New module |
| 05 | `systems-integration` | Systems integration |
| 06 | `platform-migration` | Platform migration |
| 07 | `dedicated-team` | Dedicated team |
| 08 | `maintenance-evolution` | Maintenance and evolution |
| 09 | `discovery-ux-ui` | Discovery and UX/UI |

The localized visible names map to these identities and remain stable after this design is implemented. A locale must not reorder, omit, duplicate, or rename a modality outside the approved copy in this document.

## Typed Content Contract

The implementation must replace the current `readonly string[]` modality list with the following structural and localized contracts. This is a normative design contract rather than a tested code example; compilation belongs to the implementation phase because this task does not modify or run code.

```ts
export const PROJECT_MODE_IDS = [
  "product-from-scratch",
  "mvp-prototype",
  "redesign-modernization",
  "new-module",
  "systems-integration",
  "platform-migration",
  "dedicated-team",
  "maintenance-evolution",
  "discovery-ux-ui",
] as const;

export type ProjectModeId = (typeof PROJECT_MODE_IDS)[number];

export type ProjectModeCopy = {
  name: string;
  description: string;
  inclusions: readonly [string, string, string];
  ctaLabel: string;
};

export type ProjectModesCopy = {
  eyebrow: string;
  title: string;
  emailSubjectPrefix: string;
  includesLabel: string;
  items: Readonly<Record<ProjectModeId, ProjectModeCopy>>;
};
```

`Dictionary["projectModes"]` must use `ProjectModesCopy`. The fixed `PROJECT_MODE_IDS` tuple owns identity, order, and index. Each locale dictionary owns only localized presentation content. `Record<ProjectModeId, ProjectModeCopy>` makes missing and unknown modalities type errors; the three-element tuple makes inclusion cardinality a type error.

## Approved Localized Content

The following copy is normative. It must be entered in the locale dictionaries without unfinished copy, cross-locale fallback, or runtime translation.

### Spanish (`es`)

`includesLabel`: **Qué incluye**

| Index | Name | Description | Exactly three inclusions | CTA label |
|---|---|---|---|---|
| 01 | Producto desde cero | Convertimos una oportunidad en un producto digital listo para lanzar y evolucionar. | Definición de producto y arquitectura; UX/UI y desarrollo integral; Lanzamiento y base de evolución | Hablemos de un producto desde cero |
| 02 | MVP / prototipo | Validamos la propuesta con la menor solución útil antes de ampliar la inversión. | Hipótesis, alcance y métricas; Prototipo navegable; MVP instrumentado para aprender | Hablemos de tu MVP o prototipo |
| 03 | Rediseño & modernización | Renovamos experiencia y tecnología sin perder la continuidad del negocio. | Auditoría de producto y plataforma; Rediseño UX/UI; Modernización incremental | Hablemos de tu rediseño y modernización |
| 04 | Nuevo módulo | Añadimos una capacidad completa al sistema que ya sostiene tu operación. | Definición funcional; Arquitectura de integración; Desarrollo, pruebas y entrega | Hablemos de un nuevo módulo |
| 05 | Integración de sistemas | Conectamos plataformas y datos para eliminar trabajo manual y silos operativos. | Mapa de integraciones; APIs y flujos de datos; Monitoreo y manejo de errores | Hablemos de integrar tus sistemas |
| 06 | Migración de plataforma | Trasladamos producto y datos con un cambio controlado y una ruta de reversión. | Inventario y plan de migración; Migración de código y datos; Corte, validación y reversión | Hablemos de tu migración de plataforma |
| 07 | Equipo dedicado | Sumamos un equipo estable que trabaja dentro de tus prioridades y cadencia. | Perfiles dedicados; Gestión compartida del backlog; Continuidad técnica y de producto | Hablemos de un equipo dedicado |
| 08 | Mantenimiento & evolución | Protegemos la operación mientras mejoramos el producto de forma continua. | Soporte preventivo y correctivo; Mejoras priorizadas; Actualizaciones técnicas y de seguridad | Hablemos de mantenimiento y evolución |
| 09 | Discovery & UX/UI | Reducimos incertidumbre antes de construir mediante investigación y diseño validado. | Investigación de negocio y usuarios; Flujos y prototipos; Roadmap validado y priorizado | Hablemos de discovery y UX/UI |

### Brazilian Portuguese (`pt-BR`)

`includesLabel`: **O que inclui**

| Index | Name | Description | Exactly three inclusions | CTA label |
|---|---|---|---|---|
| 01 | Produto do zero | Transformamos uma oportunidade em um produto digital pronto para lançar e evoluir. | Definição de produto e arquitetura; UX/UI e desenvolvimento completo; Lançamento e base para evolução | Vamos falar sobre um produto do zero |
| 02 | MVP / protótipo | Validamos a proposta com a menor solução útil antes de ampliar o investimento. | Hipóteses, escopo e métricas; Protótipo navegável; MVP instrumentado para aprendizado | Vamos falar sobre seu MVP ou protótipo |
| 03 | Redesign e modernização | Renovamos experiência e tecnologia sem interromper a continuidade do negócio. | Auditoria de produto e plataforma; Redesign de UX/UI; Modernização incremental | Vamos falar sobre redesign e modernização |
| 04 | Novo módulo | Adicionamos uma capacidade completa ao sistema que já sustenta sua operação. | Definição funcional; Arquitetura de integração; Desenvolvimento, testes e entrega | Vamos falar sobre um novo módulo |
| 05 | Integração de sistemas | Conectamos plataformas e dados para eliminar trabalho manual e silos operacionais. | Mapeamento de integrações; APIs e fluxos de dados; Monitoramento e tratamento de erros | Vamos falar sobre integração de sistemas |
| 06 | Migração de plataforma | Transferimos produto e dados com uma mudança controlada e um plano de reversão. | Inventário e plano de migração; Migração de código e dados; Virada, validação e reversão | Vamos falar sobre sua migração de plataforma |
| 07 | Equipe dedicada | Somamos uma equipe estável que trabalha dentro das suas prioridades e cadência. | Perfis dedicados; Gestão compartilhada do backlog; Continuidade técnica e de produto | Vamos falar sobre uma equipe dedicada |
| 08 | Manutenção e evolução | Protegemos a operação enquanto melhoramos o produto continuamente. | Suporte preventivo e corretivo; Melhorias priorizadas; Atualizações técnicas e de segurança | Vamos falar sobre manutenção e evolução |
| 09 | Discovery e UX/UI | Reduzimos incertezas antes da construção com pesquisa e design validados. | Pesquisa de negócio e usuários; Fluxos e protótipos; Roadmap validado e priorizado | Vamos falar sobre discovery e UX/UI |

### English (`en`)

`includesLabel`: **What it includes**

| Index | Name | Description | Exactly three inclusions | CTA label |
|---|---|---|---|---|
| 01 | Product from scratch | We turn an opportunity into a digital product ready to launch and evolve. | Product definition and architecture; End-to-end UX/UI and development; Launch and foundation for evolution | Discuss a product from scratch |
| 02 | MVP / prototype | We validate the proposition with the smallest useful solution before expanding investment. | Hypotheses, scope, and metrics; Clickable prototype; Instrumented MVP for learning | Discuss your MVP or prototype |
| 03 | Redesign and modernization | We renew the experience and technology without disrupting business continuity. | Product and platform audit; UX/UI redesign; Incremental modernization | Discuss redesign and modernization |
| 04 | New module | We add a complete capability to the system already supporting your operation. | Functional definition; Integration architecture; Development, testing, and delivery | Discuss a new module |
| 05 | Systems integration | We connect platforms and data to remove manual work and operational silos. | Integration mapping; APIs and data flows; Monitoring and error handling | Discuss system integration |
| 06 | Platform migration | We move product and data through a controlled change with a rollback path. | Migration inventory and plan; Code and data migration; Cutover, validation, and rollback | Discuss your platform migration |
| 07 | Dedicated team | We add a stable team that works within your priorities and delivery cadence. | Dedicated roles; Shared backlog management; Technical and product continuity | Discuss a dedicated team |
| 08 | Maintenance and evolution | We protect operations while improving the product continuously. | Preventive and corrective support; Prioritized improvements; Technical and security updates | Discuss maintenance and evolution |
| 09 | Discovery and UX/UI | We reduce uncertainty before building through validated research and design. | Business and user research; Flows and prototypes; Validated, prioritized roadmap | Discuss discovery and UX/UI |

## Component and Data Flow

1. Locale resolution continues to select `es`, `pt-BR`, or `en` before rendering the shared landing tree.
2. The landing passes `dictionary.projectModes` to the existing shared `ProjectModes` component.
3. `ProjectModes` maps `PROJECT_MODE_IDS` in their fixed order.
4. For each ID, the component reads `copy.items[id]`, derives the visible `01`–`09` index, and renders one independent `<details>` element.
5. The `<summary>` renders index, localized `name`, and the existing decorative arrow. It contains no `<a>`, button, click handler, or nested interactive element.
6. The panel renders `description`, `copy.includesLabel`, the three `inclusions`, and one CTA anchor.
7. The CTA `href` is built only from trusted dictionary content as `mailto:codedreamers.dev@gmail.com?subject=${encodeURIComponent(`${copy.emailSubjectPrefix} · ${mode.name}`)}`. This preserves the current recipient and modality-specific subject for every locale.

Keys must use the stable modality ID, not localized names or inclusion text. This prevents locale changes and copy edits from changing React identity.

## Markup and Interaction Semantics

- Each row is an independent, uncontrolled native `<details>` with no `open` prop and no shared `name` attribute.
- All nine disclosures are closed in the initial server-rendered markup. Any number may be open simultaneously after interaction.
- Clicking or tapping the summary toggles only that disclosure. It must not navigate, mutate the URL, scroll to another section, or invoke a mail client.
- With focus on the summary, `Enter` and `Space` use native browser behavior to toggle the disclosure. No custom keyboard handler duplicates or overrides this behavior.
- The summary remains the focus owner after opening or closing. Opening must not move focus into the panel; closing must not move focus elsewhere.
- The CTA participates in normal tab order only while its panel is open. Activating the CTA is the only interaction in the row allowed to hand off to the operating system’s mail client.
- The arrow is decorative and hidden from assistive technology. Its visual state rotates or otherwise changes when the parent `<details>` is open; it does not receive focus or an accessible name.
- The browser-provided expanded/collapsed semantics of `<summary>` are authoritative. Do not add redundant `role`, `aria-expanded`, `aria-controls`, or JavaScript announcements.
- Do not place the CTA inside `<summary>`. The CTA belongs after the description and inclusion list in the expanded panel.
- Unrelated React rerenders retain native open state while a disclosure remains mounted with the same stable ID. Locale navigation may reset disclosures to closed; open state is not persisted or transferred between locales.

## Visual and Responsive Behavior

The section keeps its current composition, borders, type, colors, spacing language, and two-column modality ledger where space allows. The product disclosure is the interaction reference, but project modalities retain their own section scale.

### Above 900px

- Keep the current section split between the lead and modality ledger.
- Keep the modality ledger at two columns.
- Each summary uses three columns: fixed index, flexible localized name, and fixed arrow.
- An expanded panel stays within its row and increases that row’s height without overlaying adjacent content.
- Panel text, inclusion list, and CTA align with the name column rather than the index column.
- A long localized label or inclusion wraps; it never clips, overlaps the arrow, or forces horizontal scrolling.

### 621px–900px

- Keep the existing single-column section stack while retaining the two-column modality ledger.
- Expanded content remains contained in its ledger cell. The neighboring cell may have a different height; no equal-height scripting is introduced.
- Summary and panel preserve a visible focus treatment and a touch target of at least 44px in height.

### 320px–620px

- Keep the existing one-column modality ledger and remove right borders from all rows.
- Preserve the current compact row scale while keeping every summary at least 44px high.
- Reduce the index and arrow tracks before reducing readable text width.
- Panel padding aligns content under the name, with enough right padding to prevent viewport contact.
- The CTA wraps to multiple lines when needed and remains fully visible and operable.
- At 320px width, Spanish and Brazilian Portuguese descriptions, labels, inclusions, and CTAs must not create horizontal overflow or clipped text.

Hover styling may complement interaction on pointer devices, but focus-visible and open-state styling must communicate the same affordance without relying on hover or color alone. Existing reduced-motion behavior must cover any arrow or panel-opening transition; content remains fully usable when animation is effectively disabled.

## Static Prerender Expectations

- `/es/`, `/pt-br/`, and `/en/` each contain all nine localized summaries and all nine localized panels in their prerendered HTML before JavaScript runs.
- Every prerendered panel contains one description, one inclusion label, exactly three inclusion list items, and one modality CTA.
- Native disclosure content remains present in the DOM and crawlable while closed; CSS must not remove it from the generated HTML.
- Initial markup omits the `open` attribute for all nine disclosures.
- CTA `href` values are complete, locale-specific, and percent-encoded in the static output.
- Hydration must not replace localized content, reorder modalities, or turn summaries into links. The page remains readable and disclosures remain natively operable if client JavaScript does not run.

## Copy Quality Rules

- Use the approved copy above exactly, subject only to correction of an objectively identified spelling or grammar defect before implementation review.
- Each description states the modality’s outcome in one sentence and is unique within its locale.
- Each inclusion names a concrete deliverable, activity, or operational responsibility; generic entries such as “Consulting,” “Support,” or “Everything you need” are invalid.
- Every locale has exactly three non-empty, pairwise-distinct inclusions per modality.
- Preserve established technical forms and brand-neutral terms: `MVP`, `UX/UI`, `API`/`APIs`, and `roadmap` where used.
- Do not mix languages inside a locale except for established terms already present in the approved copy.
- CTA labels must name the current modality; generic labels such as “Learn more,” “Contact us,” or “Start” are invalid.
- Descriptions, inclusions, and CTA labels must not promise fixed timelines, guaranteed business outcomes, or capabilities not represented by the modality.

## Failure and Completeness Behavior

The feature has no runtime fallback between locale dictionaries. Missing, extra, malformed, or empty content is a build/test failure, not a reason to render another locale or hide a row.

Verification must fail with the locale and stable modality ID when any of these conditions occurs:

- a required modality ID is missing or an unknown ID is present;
- the rendered order differs from `PROJECT_MODE_IDS`;
- a name, description, inclusion label, inclusion, CTA label, or email subject prefix is empty or whitespace-only;
- an inclusion tuple has other than three entries or contains duplicate entries;
- two descriptions in the same locale are identical after trimming and case normalization;
- a CTA subject does not equal the encoded current formula `emailSubjectPrefix + " · " + localized name`;
- a summary contains an anchor or activating it causes navigation or a `mailto:` request;
- a locale silently inherits content from another dictionary.

Type errors stop implementation at typecheck. Runtime completeness tests catch unsafe casts, empty strings, duplicate content, malformed CTA output, and rendered cardinality. The UI does not display unfinished copy, partial rows, empty panels, or a generic error message in place of incomplete authored content.

## Automated Tests

Add or update tests that prove:

1. **Stable identity:** `PROJECT_MODE_IDS` contains exactly the nine approved IDs in the approved order, and each renders exactly once with indices `01`–`09`.
2. **Dictionary completeness:** `es`, `pt-BR`, and `en` each contain exactly the approved IDs; every required field is non-empty; every inclusion tuple has exactly three non-empty, distinct values.
3. **Localized copy:** each locale renders its approved names, `includesLabel`, descriptions, inclusions, and CTA labels without cross-locale fallback.
4. **Independent disclosures:** all nine start closed; opening one does not close another; closing one does not change another.
5. **Summary isolation:** mouse activation, `Enter`, and `Space` on a summary toggle only its disclosure and do not activate or navigate to a `mailto:` URL.
6. **CTA isolation:** each panel contains exactly one CTA; only CTA activation uses `mailto:codedreamers.dev@gmail.com`.
7. **Subject preservation:** every CTA subject decodes exactly to the locale’s existing `emailSubjectPrefix`, ` · `, and localized modality name.
8. **Semantic structure:** each row contains one `<details>`, one direct disclosure `<summary>`, one description, one localized inclusion label, one three-item list, and one CTA outside the summary.
9. **Prerender output:** all three locale HTML outputs contain nine closed disclosures and their complete localized panel content before hydration.
10. **No regression:** product disclosures, locale routing, static metadata, and the rest of the landing composition remain unchanged.

Do not add a test framework or dependency for this feature.

## Browser QA

Run the following checks in Spanish, Brazilian Portuguese, and English at 1440px desktop, 768px tablet, and 320×568 mobile:

- Confirm the fixed order, `01`–`09` indices, localized names, and decorative arrows.
- Open every row by pointer and confirm no URL change, navigation, or mail-client prompt occurs.
- Open at least three rows simultaneously, close the middle row, and confirm the other two remain open.
- Traverse all summaries and open-panel CTAs by keyboard. Confirm visible focus, native `Enter`/`Space` summary toggling, normal `Tab` order, and no focus jump on open or close.
- Activate one CTA per modality and inspect the generated link before allowing external handoff. Confirm recipient and decoded localized subject.
- Confirm every open panel shows its unique description, localized inclusion label, exactly three inclusions, and contextual CTA.
- Disable JavaScript and confirm summaries still toggle and all panel content is present in the DOM.
- Enable reduced motion and confirm the disclosure remains understandable without meaningful animation.
- At 320px, open each modality and confirm there is no horizontal overflow, clipped text, overlap, or off-screen CTA.
- Check the console and network log for errors and confirm summary activation emits no navigation request.

## Acceptance Criteria

- The nine former row-level `mailto:` links are nine independent, uncontrolled native disclosures.
- Every summary keeps the approved index, localized name, and decorative arrow in the approved order.
- Summary activation by pointer, `Enter`, or `Space` changes only native open state and never navigates or invokes an email client.
- Multiple disclosures can remain open; no React state, shared `name`, modal, or accordion abstraction coordinates them.
- Every expanded panel contains exactly one approved localized description, one approved localized inclusion label, exactly three approved localized inclusions, and one approved contextual CTA.
- Only the panel CTA is a link. It targets `codedreamers.dev@gmail.com` and preserves the current locale-specific subject formula for its modality.
- `es`, `pt-BR`, and `en` satisfy the exact typed contract with all nine stable IDs and no fallback, empty value, duplicate inclusion, or unfinished copy.
- One shared component tree renders every locale; no dependency, state abstraction, route change, component fork, or redesign is introduced.
- Initial static HTML for all locale paths contains all complete localized content with every disclosure closed and every CTA fully encoded.
- Keyboard, focus, touch target, reduced-motion, desktop, tablet, and 320×568 mobile checks pass without navigation from summaries, overflow, clipping, overlap, console errors, or network errors.
- Product disclosure behavior and all page areas outside `ProjectModes` remain functionally unchanged.
