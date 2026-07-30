# Final Landing Interactions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the multilingual landing with typed project-modality disclosures, a protected native back-to-top control, localized icon-only WhatsApp actions, and a fully animated decorative Contact architecture visual, then verify, review, commit, synchronize, and publish the exact approved result.

**Architecture:** Keep the existing single React tree, typed locale dictionaries, native HTML interactions, dependency-free static prerender, and CSS visual system. Stable modality IDs own order while locale records own copy; a focused `BackToTop` component owns one shared observer and native focus handoff; Contact reuses one trusted WhatsApp URL and one stateless inline SVG. Normalize and verify all source before starting native bounded review, then make no source, path, or mode mutation after review starts.

**Tech Stack:** React 19, TypeScript 5.9, Vite 8, Vitest 4, React DOM server rendering, CSS, Node.js 20 built-ins, gstack `/browse`, native `gentle-ai` review, Surge; no new dependency.

---

## Task Tracking

At execution start, use `TaskCreate` to create these six tasks and mark each complete only after its stated GREEN checks pass:

1. Add typed localized project-modality data and completeness tests.
2. Replace project-mode links with native disclosures, internal CTAs, styles, and accessibility contracts.
3. Add localized back-to-top copy, component, shared observer, focus handoff, styles, and tests.
4. Replace both visible telephone links with exact localized icon-only WhatsApp actions and security/static tests.
5. Replace the Contact ornament with the complete inline architecture SVG, reveal/motion CSS, reduced-motion final state, and tests.
6. Run final gates, graph refresh attempt, six-cell browser QA, native bounded review, one commit, Surge_Ready backup/sync/parity, deployment, production verification, and rollback if required.

## Execution Rules

- Repository root for every command: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source`.
- Approved contracts:
  - `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/docs/superpowers/specs/2026-07-29-project-modality-details-design.md`
  - `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/docs/superpowers/specs/2026-07-29-final-landing-polish-design.md`
- Current baseline has the two approved specs untracked. Preserve their bytes and include them, this plan, implementation, tests, styles, and any successful graph refresh output in the one final reviewed commit.
- After plan approval and before edits, run `/superpowers:executing-plans`, `/superpowers:test-driven-development`, and `/ecc:accessibility`. Invoke `/browse` only for Task 6 browser QA and `/careful` before the backup/swap/deploy sequence.
- Follow RED→GREEN in order. Do not add a dependency, route, locale-specific component branch, React-controlled disclosure state, animation library, scroll/resize listener, or unrelated refactor.
- Do not commit per task. Create exactly one conventional commit in Task 6 after native review and staged-content pre-commit validation.
- Run every source-mutating operation before native review starts. This repository has no formatter or lint script; source normalization is therefore the implemented edits plus `git diff --check`, TypeScript, tests, build, static verification, browser QA, and the required graph refresh attempt. Once review starts, do not change reviewed source bytes, paths, or modes. Only check-only gates, exact staging of reviewed paths, the commit, external Surge_Ready synchronization, and publication may follow.
- Preserve `organizationJsonLd(locale).telephone` in `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/static-render.tsx`; it is non-visible structured metadata.

## Existing Patterns

- `src/i18n/types.ts` already owns stable typed catalog identity and `Dictionary`; add modality identity and presentation contracts there rather than introducing a second data model.
- `src/i18n/dictionaries/es.ts`, `ptBR.ts`, and `en.ts` already provide complete independent locale objects; replace each `projectModes` array with an ID-keyed record and add the new localized fields without fallback composition.
- `src/CodeDreamersLanding.tsx` already renders product details as independent native `<details>/<summary>` and uses one reveal observer for every `[data-reveal]`; project modes follow that native pattern while the architecture SVG joins the existing reveal observer.
- `src/CodeDreamersLanding.test.ts` uses Vitest, `renderToStaticMarkup`, exact source/CSS assertions, and regex-based semantic contracts. `src/i18n/content.test.ts` owns dictionary completeness. `src/static-render.test.ts` owns prerender and JSON-LD assertions.
- `src/styles.css` already defines focus-visible, product disclosure, responsive 900px/620px, and reduced-motion rules. Extend those sections without redesigning neighboring sections.
- `dist/` is generated by `npm run build`. `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Surge_Ready` is an external publication artifact copied from a verified `dist/`; never edit compiled files manually.
- No separate pattern-survey agent was used because this plan-authoring request expressly prohibited agents. These alignments come from the exact current implementation, tests, styles, types, dictionaries, package scripts, graph report, and approved specs.

---

### Task 1: Add Typed Localized Modality Data and Completeness Tests

**Files:**
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/i18n/types.ts`
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/i18n/dictionaries/es.ts`
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/i18n/dictionaries/ptBR.ts`
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/i18n/dictionaries/en.ts`
- Test: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/i18n/content.test.ts`

- [ ] **Step 1: Write the RED stable-identity and completeness tests**

Change the `./types` import in `src/i18n/content.test.ts` to:

```ts
import { PRODUCT_CODES, PROJECT_MODE_IDS } from "./types";
```

Add these focused tests inside `describe("localized content contract", ...)`:

```ts
it("defines the exact ordered project modality identities", () => {
  expect(PROJECT_MODE_IDS).toEqual([
    "product-from-scratch",
    "mvp-prototype",
    "redesign-modernization",
    "new-module",
    "systems-integration",
    "platform-migration",
    "dedicated-team",
    "maintenance-evolution",
    "discovery-ux-ui",
  ]);
  expect(new Set(PROJECT_MODE_IDS).size).toBe(9);
});

it.each(["es", "pt-BR", "en"] as const)(
  "provides complete project modality copy for %s",
  (locale) => {
    const copy = dictionaries[locale].projectModes;

    expect(Object.keys(copy.items)).toEqual([...PROJECT_MODE_IDS]);
    expect(copy.includesLabel.trim()).not.toBe("");

    for (const id of PROJECT_MODE_IDS) {
      const mode = copy.items[id];
      expect(mode.name.trim(), `${locale}:${id}:name`).not.toBe("");
      expect(mode.description.trim(), `${locale}:${id}:description`).not.toBe("");
      expect(mode.ctaLabel.trim(), `${locale}:${id}:ctaLabel`).not.toBe("");
      expect(mode.inclusions, `${locale}:${id}:inclusions`).toHaveLength(3);
      expect(
        mode.inclusions.every((value) => value.trim() !== ""),
        `${locale}:${id}:non-empty inclusions`,
      ).toBe(true);
      expect(
        new Set(mode.inclusions).size,
        `${locale}:${id}:distinct inclusions`,
      ).toBe(3);
    }
  },
);
```

- [ ] **Step 2: Run the focused tests and confirm RED**

Run:

```bash
npm test -- src/i18n/content.test.ts
```

Expected: FAIL because `PROJECT_MODE_IDS` is not exported, `projectModes.includesLabel` does not exist, and `projectModes.items` is still `readonly string[]`.

- [ ] **Step 3: Add the exact modality type contract**

Add this block after `PRODUCT_CODES`/`ProductCode` in `src/i18n/types.ts`:

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

Replace the current inline `projectModes` shape in `Dictionary` with:

```ts
  projectModes: ProjectModesCopy;
```

- [ ] **Step 4: Replace Spanish modality data with the exact approved record**

Replace the complete `projectModes` object in `src/i18n/dictionaries/es.ts` with:

```ts
  projectModes: {
    eyebrow: "Modalidades de proyecto",
    title: "Entramos donde el negocio lo necesita.",
    emailSubjectPrefix: "Proyecto",
    includesLabel: "Qué incluye",
    items: {
      "product-from-scratch": {
        name: "Producto desde cero",
        description: "Convertimos una oportunidad en un producto digital listo para lanzar y evolucionar.",
        inclusions: ["Definición de producto y arquitectura", "UX/UI y desarrollo integral", "Lanzamiento y base de evolución"],
        ctaLabel: "Hablemos de un producto desde cero",
      },
      "mvp-prototype": {
        name: "MVP / prototipo",
        description: "Validamos la propuesta con la menor solución útil antes de ampliar la inversión.",
        inclusions: ["Hipótesis, alcance y métricas", "Prototipo navegable", "MVP instrumentado para aprender"],
        ctaLabel: "Hablemos de tu MVP o prototipo",
      },
      "redesign-modernization": {
        name: "Rediseño & modernización",
        description: "Renovamos experiencia y tecnología sin perder la continuidad del negocio.",
        inclusions: ["Auditoría de producto y plataforma", "Rediseño UX/UI", "Modernización incremental"],
        ctaLabel: "Hablemos de tu rediseño y modernización",
      },
      "new-module": {
        name: "Nuevo módulo",
        description: "Añadimos una capacidad completa al sistema que ya sostiene tu operación.",
        inclusions: ["Definición funcional", "Arquitectura de integración", "Desarrollo, pruebas y entrega"],
        ctaLabel: "Hablemos de un nuevo módulo",
      },
      "systems-integration": {
        name: "Integración de sistemas",
        description: "Conectamos plataformas y datos para eliminar trabajo manual y silos operativos.",
        inclusions: ["Mapa de integraciones", "APIs y flujos de datos", "Monitoreo y manejo de errores"],
        ctaLabel: "Hablemos de integrar tus sistemas",
      },
      "platform-migration": {
        name: "Migración de plataforma",
        description: "Trasladamos producto y datos con un cambio controlado y una ruta de reversión.",
        inclusions: ["Inventario y plan de migración", "Migración de código y datos", "Corte, validación y reversión"],
        ctaLabel: "Hablemos de tu migración de plataforma",
      },
      "dedicated-team": {
        name: "Equipo dedicado",
        description: "Sumamos un equipo estable que trabaja dentro de tus prioridades y cadencia.",
        inclusions: ["Perfiles dedicados", "Gestión compartida del backlog", "Continuidad técnica y de producto"],
        ctaLabel: "Hablemos de un equipo dedicado",
      },
      "maintenance-evolution": {
        name: "Mantenimiento & evolución",
        description: "Protegemos la operación mientras mejoramos el producto de forma continua.",
        inclusions: ["Soporte preventivo y correctivo", "Mejoras priorizadas", "Actualizaciones técnicas y de seguridad"],
        ctaLabel: "Hablemos de mantenimiento y evolución",
      },
      "discovery-ux-ui": {
        name: "Discovery & UX/UI",
        description: "Reducimos incertidumbre antes de construir mediante investigación y diseño validado.",
        inclusions: ["Investigación de negocio y usuarios", "Flujos y prototipos", "Roadmap validado y priorizado"],
        ctaLabel: "Hablemos de discovery y UX/UI",
      },
    },
  },
```

- [ ] **Step 5: Replace Brazilian Portuguese modality data with the exact approved record**

Replace the complete `projectModes` object in `src/i18n/dictionaries/ptBR.ts` with:

```ts
  projectModes: {
    eyebrow: "Modalidades de projeto",
    title: "Entramos onde a empresa mais precisa.",
    emailSubjectPrefix: "Projeto",
    includesLabel: "O que inclui",
    items: {
      "product-from-scratch": {
        name: "Produto do zero",
        description: "Transformamos uma oportunidade em um produto digital pronto para lançar e evoluir.",
        inclusions: ["Definição de produto e arquitetura", "UX/UI e desenvolvimento completo", "Lançamento e base para evolução"],
        ctaLabel: "Vamos falar sobre um produto do zero",
      },
      "mvp-prototype": {
        name: "MVP / protótipo",
        description: "Validamos a proposta com a menor solução útil antes de ampliar o investimento.",
        inclusions: ["Hipóteses, escopo e métricas", "Protótipo navegável", "MVP instrumentado para aprendizado"],
        ctaLabel: "Vamos falar sobre seu MVP ou protótipo",
      },
      "redesign-modernization": {
        name: "Redesign e modernização",
        description: "Renovamos experiência e tecnologia sem interromper a continuidade do negócio.",
        inclusions: ["Auditoria de produto e plataforma", "Redesign de UX/UI", "Modernização incremental"],
        ctaLabel: "Vamos falar sobre redesign e modernização",
      },
      "new-module": {
        name: "Novo módulo",
        description: "Adicionamos uma capacidade completa ao sistema que já sustenta sua operação.",
        inclusions: ["Definição funcional", "Arquitetura de integração", "Desenvolvimento, testes e entrega"],
        ctaLabel: "Vamos falar sobre um novo módulo",
      },
      "systems-integration": {
        name: "Integração de sistemas",
        description: "Conectamos plataformas e dados para eliminar trabalho manual e silos operacionais.",
        inclusions: ["Mapeamento de integrações", "APIs e fluxos de dados", "Monitoramento e tratamento de erros"],
        ctaLabel: "Vamos falar sobre integração de sistemas",
      },
      "platform-migration": {
        name: "Migração de plataforma",
        description: "Transferimos produto e dados com uma mudança controlada e um plano de reversão.",
        inclusions: ["Inventário e plano de migração", "Migração de código e dados", "Virada, validação e reversão"],
        ctaLabel: "Vamos falar sobre sua migração de plataforma",
      },
      "dedicated-team": {
        name: "Equipe dedicada",
        description: "Somamos uma equipe estável que trabalha dentro das suas prioridades e cadência.",
        inclusions: ["Perfis dedicados", "Gestão compartilhada do backlog", "Continuidade técnica e de produto"],
        ctaLabel: "Vamos falar sobre uma equipe dedicada",
      },
      "maintenance-evolution": {
        name: "Manutenção e evolução",
        description: "Protegemos a operação enquanto melhoramos o produto continuamente.",
        inclusions: ["Suporte preventivo e corretivo", "Melhorias priorizadas", "Atualizações técnicas e de segurança"],
        ctaLabel: "Vamos falar sobre manutenção e evolução",
      },
      "discovery-ux-ui": {
        name: "Discovery e UX/UI",
        description: "Reduzimos incertezas antes da construção com pesquisa e design validados.",
        inclusions: ["Pesquisa de negócio e usuários", "Fluxos e protótipos", "Roadmap validado e priorizado"],
        ctaLabel: "Vamos falar sobre discovery e UX/UI",
      },
    },
  },
```

- [ ] **Step 6: Replace English modality data with the exact approved record**

Replace the complete `projectModes` object in `src/i18n/dictionaries/en.ts` with:

```ts
  projectModes: {
    eyebrow: "Project models",
    title: "We step in where your business needs us.",
    emailSubjectPrefix: "Project",
    includesLabel: "What it includes",
    items: {
      "product-from-scratch": {
        name: "Product from scratch",
        description: "We turn an opportunity into a digital product ready to launch and evolve.",
        inclusions: ["Product definition and architecture", "End-to-end UX/UI and development", "Launch and foundation for evolution"],
        ctaLabel: "Discuss a product from scratch",
      },
      "mvp-prototype": {
        name: "MVP / prototype",
        description: "We validate the proposition with the smallest useful solution before expanding investment.",
        inclusions: ["Hypotheses, scope, and metrics", "Clickable prototype", "Instrumented MVP for learning"],
        ctaLabel: "Discuss your MVP or prototype",
      },
      "redesign-modernization": {
        name: "Redesign and modernization",
        description: "We renew the experience and technology without disrupting business continuity.",
        inclusions: ["Product and platform audit", "UX/UI redesign", "Incremental modernization"],
        ctaLabel: "Discuss redesign and modernization",
      },
      "new-module": {
        name: "New module",
        description: "We add a complete capability to the system already supporting your operation.",
        inclusions: ["Functional definition", "Integration architecture", "Development, testing, and delivery"],
        ctaLabel: "Discuss a new module",
      },
      "systems-integration": {
        name: "Systems integration",
        description: "We connect platforms and data to remove manual work and operational silos.",
        inclusions: ["Integration mapping", "APIs and data flows", "Monitoring and error handling"],
        ctaLabel: "Discuss system integration",
      },
      "platform-migration": {
        name: "Platform migration",
        description: "We move product and data through a controlled change with a rollback path.",
        inclusions: ["Migration inventory and plan", "Code and data migration", "Cutover, validation, and rollback"],
        ctaLabel: "Discuss your platform migration",
      },
      "dedicated-team": {
        name: "Dedicated team",
        description: "We add a stable team that works within your priorities and delivery cadence.",
        inclusions: ["Dedicated roles", "Shared backlog management", "Technical and product continuity"],
        ctaLabel: "Discuss a dedicated team",
      },
      "maintenance-evolution": {
        name: "Maintenance and evolution",
        description: "We protect operations while improving the product continuously.",
        inclusions: ["Preventive and corrective support", "Prioritized improvements", "Technical and security updates"],
        ctaLabel: "Discuss maintenance and evolution",
      },
      "discovery-ux-ui": {
        name: "Discovery and UX/UI",
        description: "We reduce uncertainty before building through validated research and design.",
        inclusions: ["Business and user research", "Flows and prototypes", "Validated, prioritized roadmap"],
        ctaLabel: "Discuss discovery and UX/UI",
      },
    },
  },
```

- [ ] **Step 7: Run the focused tests and confirm GREEN**

Run:

```bash
npm test -- src/i18n/content.test.ts
```

Expected: PASS; all three dictionaries expose the same nine IDs in order, every required string is non-empty, and every inclusion tuple contains exactly three distinct non-empty values.

---

### Task 2: Replace Project-Mode Links with Native Disclosures and Internal CTAs

**Files:**
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/CodeDreamersLanding.tsx`
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/styles.css`
- Test: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/CodeDreamersLanding.test.ts`
- Test: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/static-render.test.ts`

- [ ] **Step 1: Write RED rendered-structure and source-contract tests**

Replace the current `./i18n/types` import in `src/CodeDreamersLanding.test.ts` with:

```ts
import {
  PROJECT_MODE_IDS,
  type FamilyId,
  type OutcomeId,
} from "./i18n/types";
```

Then add:

```ts
it.each(["es", "pt-BR", "en"] as const)(
  "renders nine closed native project disclosures with isolated CTAs for %s",
  (locale) => {
    const dictionary = getDictionary(locale);
    const markup = renderToStaticMarkup(
      createElement(CodeDreamersLanding, { locale }),
    );

    expect(markup.match(/<details data-project-mode=/g)).toHaveLength(9);
    expect(markup.match(/<summary>/g)).toHaveLength(9);
    expect(markup).not.toMatch(/<details[^>]*\sopen(?:=|\s|>)/);
    expect(markup.match(/class="project-mode__cta"/g)).toHaveLength(9);

    for (const [index, id] of PROJECT_MODE_IDS.entries()) {
      const mode = dictionary.projectModes.items[id];
      const subject = encodeURIComponent(
        `${dictionary.projectModes.emailSubjectPrefix} · ${mode.name}`,
      );
      expect(markup).toContain(`data-project-mode="${id}"`);
      expect(markup).toContain(
        `<span>${String(index + 1).padStart(2, "0")}</span>`,
      );
      expect(markup).toContain(mode.description);
      expect(markup).toContain(mode.ctaLabel);
      expect(markup).toContain(
        `href="mailto:codedreamers.dev@gmail.com?subject=${subject}"`,
      );
      expect(mode.inclusions.every((value) => markup.includes(value))).toBe(true);
    }
  },
);

it("keeps project summaries native and free of competing interaction handlers", () => {
  const source = readFileSync(
    new URL("./CodeDreamersLanding.tsx", import.meta.url),
    "utf8",
  );
  const projectModesSource = source.slice(
    source.indexOf("function ProjectModes"),
    source.indexOf("function Contact"),
  );

  const summarySource =
    projectModesSource.match(/<summary>[\s\S]*?<\/summary>/)?.[0] ?? "";

  expect(projectModesSource).toContain("PROJECT_MODE_IDS.map");
  expect(projectModesSource).toContain("<details");
  expect(projectModesSource).toContain("<summary>");
  expect(projectModesSource).not.toMatch(/<details[^>]*\bopen=/);
  expect(projectModesSource).not.toMatch(/<details[^>]*\bname=/);
  expect(projectModesSource).not.toMatch(/<summary[^>]*on(?:Click|KeyDown)=/);
  expect(summarySource).not.toContain("<a");
});
```

In the locale loop inside `describe("static locale rendering", ...)` in `src/static-render.test.ts`, replace:

```ts
      const product = getDictionary(locale).catalog.products.P01;
```

with:

```ts
      const dictionary = getDictionary(locale);
      const product = dictionary.catalog.products.P01;
```

Then add:

```ts
expect(count(html, /<details data-project-mode=/g)).toBe(9);
expect(count(html, /<summary>/g)).toBeGreaterThanOrEqual(63);
expect(html).not.toMatch(/<details[^>]*\sopen(?:=|\s|>)/);
for (const id of PROJECT_MODE_IDS) {
  const mode = dictionary.projectModes.items[id];
  expect(html).toContain(mode.description);
  expect(mode.inclusions.every((value) => html.includes(value))).toBe(true);
  expect(html).toContain(mode.ctaLabel);
}
```

Add this import to `src/static-render.test.ts`:

```ts
import { PROJECT_MODE_IDS } from "./i18n/types";
```

- [ ] **Step 2: Run focused tests and confirm RED**

Run:

```bash
npm test -- src/CodeDreamersLanding.test.ts src/static-render.test.ts
```

Expected: FAIL because ProjectModes still renders nine row-level `<a>` elements, has no native disclosures or panel content, and does not use stable IDs.

- [ ] **Step 3: Import stable IDs and replace `ProjectModes` with exact native markup**

Replace the current type-only import from `./i18n/types` in `src/CodeDreamersLanding.tsx` with:

```ts
import {
  PROJECT_MODE_IDS,
  type Dictionary,
  type FamilyId,
  type MessageCount,
  type OutcomeId,
} from "./i18n/types";
```

Then replace the complete `ProjectModes` function with:

```tsx
function ProjectModes({ copy }: { copy: Dictionary["projectModes"] }) {
  return (
    <section className="project-modes section-pad">
      <div className="project-modes__lead" data-reveal>
        <p className="coordinate-label coordinate-label--dark">
          {copy.eyebrow}
        </p>
        <h2>{copy.title}</h2>
      </div>
      <ol data-reveal>
        {PROJECT_MODE_IDS.map((id, index) => {
          const mode = copy.items[id];
          const subject = encodeURIComponent(
            `${copy.emailSubjectPrefix} · ${mode.name}`,
          );

          return (
            <li key={id}>
              <details data-project-mode={id}>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{mode.name}</strong>
                  <Arrow />
                </summary>
                <div className="project-mode__panel">
                  <p>{mode.description}</p>
                  <strong className="project-mode__includes-label">
                    {copy.includesLabel}
                  </strong>
                  <ul>
                    {mode.inclusions.map((inclusion) => (
                      <li key={inclusion}>{inclusion}</li>
                    ))}
                  </ul>
                  <a
                    className="project-mode__cta"
                    href={`mailto:codedreamers.dev@gmail.com?subject=${subject}`}
                  >
                    {mode.ctaLabel}
                    <Arrow />
                  </a>
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
```

This supplies no `open` prop, shared `name`, React state, click handler, keyboard handler, redundant ARIA state, or interactive descendant inside `<summary>`. Multiple disclosures remain independently open under native browser behavior.

- [ ] **Step 4: Replace ProjectModes link styles with disclosure styles**

Keep `.project-modes`, `.project-modes__lead`, `.project-modes h2`, `.project-modes > ol`, `.project-modes li`, and the even-row border rule. Replace the current `.project-modes li a` through `.project-modes li strong` rules with:

```css
.project-modes details {
  height: 100%;
}

.project-modes summary {
  display: grid;
  width: 100%;
  min-height: 114px;
  grid-template-columns: 42px minmax(0, 1fr) 24px;
  gap: 1rem;
  align-items: center;
  padding: 0 1rem;
  cursor: pointer;
  list-style: none;
  transition:
    background-color 220ms var(--ease-out),
    color 220ms var(--ease-out);
}

.project-modes summary::-webkit-details-marker {
  display: none;
}

.project-modes summary:hover,
.project-modes summary:focus-visible,
.project-modes details[open] > summary {
  background: var(--ink);
  color: var(--paper);
}

.project-modes summary:focus-visible {
  outline: 2px solid var(--cyan);
  outline-offset: -4px;
}

.project-modes summary > span:first-child {
  color: #6e899b;
  font-family: var(--font-mono);
  font-size: 0.6rem;
}

.project-modes summary:hover > span:first-child,
.project-modes summary:focus-visible > span:first-child,
.project-modes details[open] > summary > span:first-child {
  color: var(--cyan);
}

.project-modes summary strong {
  min-width: 0;
  font-variation-settings: "wght" 570;
}

.project-modes summary .arrow {
  transition: transform 220ms var(--ease-out);
}

.project-modes details[open] > summary .arrow {
  transform: rotate(90deg);
}

.project-mode__panel {
  padding: 0 1rem 1.5rem 4.25rem;
}

.project-mode__panel > p {
  max-width: 54ch;
  margin: 0;
  color: #405c6f;
  line-height: 1.65;
}

.project-mode__includes-label {
  display: block;
  margin-top: 1.25rem;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.project-mode__panel ul {
  display: grid;
  gap: 0.5rem;
  margin: 0.75rem 0 1.25rem;
  padding: 0;
  list-style: none;
}

.project-mode__panel li {
  position: relative;
  padding-left: 1rem;
  border: 0;
  color: #28475a;
  line-height: 1.45;
}

.project-mode__panel li::before {
  position: absolute;
  top: 0.65em;
  left: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--cyan);
  content: "";
}

.project-mode__cta {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 0.65rem;
  color: var(--ink);
  font-variation-settings: "wght" 620;
  text-decoration: underline;
  text-decoration-color: var(--cyan);
  text-underline-offset: 0.3em;
}

.project-mode__cta:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 4px;
}
```

Inside `@media (max-width: 620px)`, replace `.project-modes li a { min-height: 92px; }` with:

```css
  .project-modes summary {
    min-height: 92px;
    grid-template-columns: 30px minmax(0, 1fr) 20px;
    gap: 0.75rem;
    padding: 0 0.75rem;
  }

  .project-mode__panel {
    padding: 0 0.75rem 1.5rem 3.3rem;
  }

  .project-mode__cta {
    width: fit-content;
    max-width: 100%;
    white-space: normal;
  }
```

Inside the existing reduced-motion query, add:

```css
  .project-modes summary .arrow {
    transition: none;
  }
```

- [ ] **Step 5: Run focused tests and confirm GREEN**

Run:

```bash
npm test -- src/i18n/content.test.ts src/CodeDreamersLanding.test.ts src/static-render.test.ts
```

Expected: PASS; all locales prerender nine closed disclosures with exact panel copy and encoded CTAs, source contains no competing disclosure state/handlers, and existing product-detail tests remain green.

---

### Task 3: Add the Localized Back-to-Top Control, Shared Observer, Focus Handoff, Styles, and Tests

**Files:**
- Create: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/BackToTop.tsx`
- Create: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/BackToTop.test.ts`
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/i18n/types.ts`
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/i18n/dictionaries/es.ts`
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/i18n/dictionaries/ptBR.ts`
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/i18n/dictionaries/en.ts`
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/CodeDreamersLanding.tsx`
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/styles.css`
- Test: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/CodeDreamersLanding.test.ts`

- [ ] **Step 1: Write RED observer, initial-markup, and focus-handoff tests**

Create `src/BackToTop.test.ts` with:

```tsx
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import BackToTop, {
  observeBackToTopTargets,
  scheduleHeroFocus,
  type BackToTopTargets,
  type ObserverConstructor,
} from "./BackToTop";

const entry = (target: Element, isIntersecting: boolean) =>
  ({ target, isIntersecting }) as IntersectionObserverEntry;

describe("back-to-top behavior", () => {
  it("prerenders a localized hidden native anchor", () => {
    const markup = renderToStaticMarkup(
      createElement(BackToTop, { copy: { ariaLabel: "Back to top" } }),
    );

    expect(markup).toContain('class="back-to-top"');
    expect(markup).toContain('href="#inicio"');
    expect(markup).toContain('aria-label="Back to top"');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('tabindex="-1"');
    expect(markup).toContain('aria-hidden="true" focusable="false"');
  });

  it("uses one observer for hero, Contact, and footer and disconnects it", () => {
    const hero = {} as Element;
    const contact = {} as Element;
    const footer = {} as Element;
    const targets: BackToTopTargets = { hero, contact, footer };
    const observed: Element[] = [];
    const disconnect = vi.fn();
    let callback: IntersectionObserverCallback = () => undefined;
    let instances = 0;

    class FakeObserver {
      constructor(nextCallback: IntersectionObserverCallback) {
        instances += 1;
        callback = nextCallback;
      }

      observe(target: Element) {
        observed.push(target);
      }

      disconnect() {
        disconnect();
      }
    }

    const visibility: boolean[] = [];
    const cleanup = observeBackToTopTargets(
      targets,
      (visible) => visibility.push(visible),
      FakeObserver as unknown as ObserverConstructor,
    );

    expect(instances).toBe(1);
    expect(observed).toEqual([hero, contact, footer]);

    callback(
      [entry(hero, true), entry(contact, false), entry(footer, false)],
      {} as IntersectionObserver,
    );
    callback([entry(hero, false)], {} as IntersectionObserver);
    callback([entry(contact, true)], {} as IntersectionObserver);
    callback([entry(contact, false), entry(footer, true)], {} as IntersectionObserver);
    callback([entry(footer, false)], {} as IntersectionObserver);

    expect(visibility).toEqual([false, true, false, false, true]);
    cleanup();
    expect(disconnect).toHaveBeenCalledOnce();
  });

  it("waits for all three initial intersection states", () => {
    const hero = {} as Element;
    const contact = {} as Element;
    const footer = {} as Element;
    let callback: IntersectionObserverCallback = () => undefined;
    const visibility = vi.fn();

    class FakeObserver {
      constructor(nextCallback: IntersectionObserverCallback) {
        callback = nextCallback;
      }
      observe() {}
      disconnect() {}
    }

    observeBackToTopTargets(
      { hero, contact, footer },
      visibility,
      FakeObserver as unknown as ObserverConstructor,
    );

    callback([entry(hero, false)], {} as IntersectionObserver);
    callback([entry(contact, false)], {} as IntersectionObserver);
    expect(visibility).not.toHaveBeenCalled();

    callback([entry(footer, false)], {} as IntersectionObserver);
    expect(visibility).toHaveBeenCalledWith(true);
  });

  it("schedules exactly one prevent-scroll focus handoff", () => {
    const requestFrame = vi.fn((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    const focus = vi.fn();

    scheduleHeroFocus(requestFrame, () => ({ focus }));

    expect(requestFrame).toHaveBeenCalledOnce();
    expect(focus).toHaveBeenCalledOnce();
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it("keeps missing observer and target fallbacks hidden", () => {
    const source = readFileSync(new URL("./BackToTop.tsx", import.meta.url), "utf8");

    expect(source).toContain('if (!("IntersectionObserver" in window))');
    expect(source).toContain("if (!hero || !contact || !footer)");
    expect(source).toContain("return undefined");
    expect(source).toContain("useState(false)");
  });
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
npm test -- src/BackToTop.test.ts
```

Expected: FAIL because `src/BackToTop.tsx` and its exports do not exist.

- [ ] **Step 3: Add the exact localized dictionary contract**

Add this field to `Dictionary` immediately before `contact` in `src/i18n/types.ts`:

```ts
  backToTop: {
    ariaLabel: string;
  };
```

Add these exact objects immediately before `contact` in each dictionary:

```ts
// src/i18n/dictionaries/es.ts
  backToTop: {
    ariaLabel: "Volver al inicio",
  },

// src/i18n/dictionaries/ptBR.ts
  backToTop: {
    ariaLabel: "Voltar ao início",
  },

// src/i18n/dictionaries/en.ts
  backToTop: {
    ariaLabel: "Back to top",
  },
```

- [ ] **Step 4: Create the complete shared observer and component**

Create `src/BackToTop.tsx` with:

```tsx
import { useEffect, useState } from "react";

import type { Dictionary } from "./i18n/types";

export type BackToTopTargets = {
  hero: Element;
  contact: Element;
  footer: Element;
};

type Observer = Pick<IntersectionObserver, "observe" | "disconnect">;

export type ObserverConstructor = new (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
) => Observer;

export function observeBackToTopTargets(
  targets: BackToTopTargets,
  onVisibilityChange: (visible: boolean) => void,
  ObserverClass: ObserverConstructor = window.IntersectionObserver,
): () => void {
  const intersection = new Map<Element, boolean>();
  const requiredTargets = [targets.hero, targets.contact, targets.footer];
  const observer = new ObserverClass(
    (entries) => {
      for (const currentEntry of entries) {
        intersection.set(currentEntry.target, currentEntry.isIntersecting);
      }

      if (requiredTargets.every((target) => intersection.has(target))) {
        onVisibilityChange(
          !intersection.get(targets.hero) &&
            !intersection.get(targets.contact) &&
            !intersection.get(targets.footer),
        );
      }
    },
    { threshold: 0 },
  );

  requiredTargets.forEach((target) => observer.observe(target));
  return () => observer.disconnect();
}

export function scheduleHeroFocus(
  requestFrame: (callback: FrameRequestCallback) => number = requestAnimationFrame,
  getHero: () => Pick<HTMLElement, "focus"> | null = () =>
    document.getElementById("inicio"),
): void {
  requestFrame(() => getHero()?.focus({ preventScroll: true }));
}

export default function BackToTop({
  copy,
}: {
  copy: Dictionary["backToTop"];
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      return undefined;
    }

    const hero = document.getElementById("inicio");
    const contact = document.getElementById("contacto");
    const footer = document.querySelector("#contacto footer");

    if (!hero || !contact || !footer) {
      return undefined;
    }

    return observeBackToTopTargets({ hero, contact, footer }, setVisible);
  }, []);

  return (
    <a
      className="back-to-top"
      data-visible={visible ? "true" : "false"}
      href="#inicio"
      aria-label={copy.ariaLabel}
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? 0 : -1}
      onClick={() => scheduleHeroFocus()}
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
```

The click handler never receives the event and therefore cannot cancel native hash navigation. It schedules one animation frame and one focus call only.

- [ ] **Step 5: Integrate the hero focus target and one shared BackToTop instance**

Add:

```tsx
import BackToTop from "./BackToTop";
```

Add `tabIndex={-1}` to the existing hero section so its opening attributes become:

```tsx
    <section
      className="hero"
      id="inicio"
      tabIndex={-1}
      ref={heroRef}
      onPointerMove={handlePointerMove}
    >
```

Render the control once immediately after `<Contact ... />` in the root component:

```tsx
      <BackToTop copy={dictionary.backToTop} />
```

- [ ] **Step 6: Add exact back-to-top styles and correct the motion policy**

Remove `scroll-behavior: smooth` from the unconditional `html` rule. Add before the reduced-motion query:

```css
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

.back-to-top {
  position: fixed;
  z-index: 45;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 1px solid rgba(200, 214, 227, 0.72);
  background: var(--paper);
  color: var(--ink);
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px);
  visibility: hidden;
  transition:
    opacity 220ms var(--ease-out),
    transform 220ms var(--ease-out),
    visibility 0s linear 220ms;
}

.back-to-top[data-visible="true"] {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
  visibility: visible;
  transition-delay: 0s;
}

.back-to-top:hover {
  border-color: var(--cyan);
  background: var(--ink);
  color: var(--paper);
}

.back-to-top:active {
  background: var(--cyan);
  color: var(--ink);
}

.back-to-top:focus-visible {
  outline: 2px solid var(--cyan);
  outline-offset: 3px;
}
```

Inside `@media (max-width: 620px)`, add:

```css
  .back-to-top {
    right: max(0.75rem, env(safe-area-inset-right));
    bottom: max(5rem, calc(env(safe-area-inset-bottom) + 0.75rem));
  }
```

Inside `@media (prefers-reduced-motion: reduce)`, add:

```css
  .back-to-top,
  .back-to-top[data-visible="true"] {
    transform: none;
    transition: none;
  }
```

Keep the control below the existing open mobile navigation layer by retaining `z-index: 45`; do not raise it above the menu overlay.

- [ ] **Step 7: Add the rendered accessibility contract**

Add this focused test to `src/CodeDreamersLanding.test.ts`:

```ts
it.each(["es", "pt-BR", "en"] as const)(
  "prerenders one inert localized back-to-top anchor for %s",
  (locale) => {
    const dictionary = getDictionary(locale);
    const markup = renderToStaticMarkup(
      createElement(CodeDreamersLanding, { locale }),
    );

    expect(markup.match(/class="back-to-top"/g)).toHaveLength(1);
    expect(markup).toContain('href="#inicio"');
    expect(markup).toContain(`aria-label="${dictionary.backToTop.ariaLabel}"`);
    expect(markup).toContain('data-visible="false"');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('tabindex="-1"');
    expect(markup).toMatch(/<section class="hero" id="inicio" tabindex="-1"/);
  },
);
```

- [ ] **Step 8: Run focused tests and confirm GREEN**

Run:

```bash
npm test -- src/BackToTop.test.ts src/CodeDreamersLanding.test.ts src/i18n/content.test.ts
```

Expected: PASS; SSR starts hidden and unfocusable, all three locale labels are exact, one observer instance tracks all three targets, no visibility update occurs before all initial states arrive, cleanup disconnects, and focus handoff uses one animation frame with `preventScroll`.

---

### Task 4: Replace Both Visible Telephone Links with Exact Localized WhatsApp Actions

**Files:**
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/i18n/types.ts`
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/i18n/dictionaries/es.ts`
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/i18n/dictionaries/ptBR.ts`
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/i18n/dictionaries/en.ts`
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/CodeDreamersLanding.tsx`
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/styles.css`
- Test: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/i18n/content.test.ts`
- Test: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/CodeDreamersLanding.test.ts`
- Test: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/static-render.test.ts`

- [ ] **Step 1: Write RED exact-copy, URL, security, and visibility tests**

Add this constant near the top of `src/CodeDreamersLanding.test.ts`:

```ts
const expectedWhatsApp = {
  es: {
    ariaLabel: "Conversar con CodeDreamers por WhatsApp sobre un proyecto",
    message: "Hola, CodeDreamers. Me gustaría conversar sobre un proyecto.",
    href: "https://wa.me/5352015051?text=Hola%2C%20CodeDreamers.%20Me%20gustar%C3%ADa%20conversar%20sobre%20un%20proyecto.",
  },
  "pt-BR": {
    ariaLabel: "Conversar com a CodeDreamers pelo WhatsApp sobre um projeto",
    message: "Olá, CodeDreamers. Gostaria de conversar sobre um projeto.",
    href: "https://wa.me/5352015051?text=Ol%C3%A1%2C%20CodeDreamers.%20Gostaria%20de%20conversar%20sobre%20um%20projeto.",
  },
  en: {
    ariaLabel: "Discuss a project with CodeDreamers on WhatsApp",
    message: "Hello, CodeDreamers. I would like to discuss a project.",
    href: "https://wa.me/5352015051?text=Hello%2C%20CodeDreamers.%20I%20would%20like%20to%20discuss%20a%20project.",
  },
} as const;
```

Add:

```ts
it.each(["es", "pt-BR", "en"] as const)(
  "renders exactly two secure icon-only WhatsApp actions for %s",
  (locale) => {
    const dictionary = getDictionary(locale);
    const expected = expectedWhatsApp[locale];
    const markup = renderToStaticMarkup(
      createElement(CodeDreamersLanding, { locale }),
    );
    const visibleText = markup.replace(/<[^>]+>/g, "");

    expect(dictionary.contact.whatsappAriaLabel).toBe(expected.ariaLabel);
    expect(dictionary.contact.whatsappMessage).toBe(expected.message);
    expect(
      `https://wa.me/5352015051?text=${encodeURIComponent(expected.message)}`,
    ).toBe(expected.href);
    expect(markup.match(/href="https:\/\/wa\.me\/5352015051\?text=/g)).toHaveLength(2);
    expect(markup.match(/target="_blank"/g)).toHaveLength(2);
    expect(markup.match(/rel="noreferrer"/g)).toHaveLength(2);
    expect(markup.match(/class="whatsapp-icon"/g)).toHaveLength(2);
    expect(markup).not.toContain('href="tel:');
    expect(visibleText).not.toContain("+53 52015051");
    expect(visibleText).not.toContain("5352015051");
  },
);
```

Add this dictionary test in `src/i18n/content.test.ts`:

```ts
it("keeps exact localized WhatsApp content and removes the telephone label", () => {
  expect(dictionaries.es.contact).toMatchObject({
    whatsappAriaLabel: "Conversar con CodeDreamers por WhatsApp sobre un proyecto",
    whatsappMessage: "Hola, CodeDreamers. Me gustaría conversar sobre un proyecto.",
  });
  expect(dictionaries["pt-BR"].contact).toMatchObject({
    whatsappAriaLabel: "Conversar com a CodeDreamers pelo WhatsApp sobre um projeto",
    whatsappMessage: "Olá, CodeDreamers. Gostaria de conversar sobre um projeto.",
  });
  expect(dictionaries.en.contact).toMatchObject({
    whatsappAriaLabel: "Discuss a project with CodeDreamers on WhatsApp",
    whatsappMessage: "Hello, CodeDreamers. I would like to discuss a project.",
  });

  for (const locale of LOCALES) {
    expect(dictionaries[locale].contact).not.toHaveProperty("phoneLabel");
  }
});
```

Add this test to `src/static-render.test.ts`:

```ts
it("keeps the phone only in non-visible WhatsApp URLs and Organization JSON-LD", () => {
  for (const locale of ["es", "pt-BR", "en"] as const) {
    const document = renderLocaleDocument(template, locale);
    const body = document.match(/<body>([\s\S]*?)<\/body>/)?.[1] ?? "";
    const bodyWithoutJsonLd = body.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/g,
      "",
    );
    const visibleText = bodyWithoutJsonLd.replace(/<[^>]+>/g, "");

    expect(body.match(/https:\/\/wa\.me\/5352015051\?text=/g)).toHaveLength(2);
    expect(body).not.toContain('href="tel:');
    expect(visibleText).not.toMatch(/\+53\s*52015051|5352015051/);
    expect(organizationJsonLd(locale).telephone).toBe("+53 52015051");
  }
});
```

- [ ] **Step 2: Run focused tests and confirm RED**

Run:

```bash
npm test -- src/i18n/content.test.ts src/CodeDreamersLanding.test.ts src/static-render.test.ts
```

Expected: FAIL because dictionaries still expose `phoneLabel`, rendered UI still has two `tel:` anchors and visible digits, and WhatsApp fields/links do not exist.

- [ ] **Step 3: Replace the contact type and add exact localized WhatsApp content**

Replace the `contact` shape in `Dictionary` with:

```ts
  contact: {
    eyebrow: string;
    title: readonly [string, string, string];
    action: string;
    mailSubject: string;
    whatsappAriaLabel: string;
    whatsappMessage: string;
    footerSummary: string;
  };
```

In each locale’s `contact` object, remove `phoneLabel` and add these exact fields after `mailSubject`:

```ts
// es.ts
    whatsappAriaLabel: "Conversar con CodeDreamers por WhatsApp sobre un proyecto",
    whatsappMessage: "Hola, CodeDreamers. Me gustaría conversar sobre un proyecto.",

// ptBR.ts
    whatsappAriaLabel: "Conversar com a CodeDreamers pelo WhatsApp sobre um projeto",
    whatsappMessage: "Olá, CodeDreamers. Gostaria de conversar sobre um projeto.",

// en.ts
    whatsappAriaLabel: "Discuss a project with CodeDreamers on WhatsApp",
    whatsappMessage: "Hello, CodeDreamers. I would like to discuss a project.",
```

- [ ] **Step 4: Add one recognizable decorative WhatsApp icon function**

Add immediately before `Contact` in `src/CodeDreamersLanding.tsx`:

```tsx
function WhatsAppIcon() {
  return (
    <svg
      className="whatsapp-icon"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.009-.371-.011-.57-.011-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.875 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.045 21.502h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.437-9.884 9.891-9.884a9.82 9.82 0 0 1 6.988 2.897 9.83 9.83 0 0 1 2.893 6.99c-.003 5.45-4.437 9.889-9.888 9.889"
      />
    </svg>
  );
}
```

- [ ] **Step 5: Build one trusted URL and reuse it in both exact positions**

At the top of `Contact`, before `return`, add:

```ts
  const whatsappHref = `https://wa.me/5352015051?text=${encodeURIComponent(
    copy.whatsappMessage,
  )}`;
```

Replace the current action-area telephone anchor with:

```tsx
        <a
          className="contact__phone"
          href={whatsappHref}
          aria-label={copy.whatsappAriaLabel}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon />
        </a>
```

Replace the current footer telephone anchor with:

```tsx
          <a
            className="footer__whatsapp"
            href={whatsappHref}
            aria-label={copy.whatsappAriaLabel}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon />
          </a>
```

Do not change either email anchor. Do not change `organizationJsonLd(locale).telephone`.

- [ ] **Step 6: Convert both former phone styles to 44px icon targets**

Replace `.contact__phone` and `.contact__phone span` rules with:

```css
.contact__phone,
.footer__whatsapp {
  display: inline-grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  border: 1px solid rgba(200, 214, 227, 0.42);
  color: var(--paper);
  transition:
    border-color 220ms var(--ease-out),
    background-color 220ms var(--ease-out),
    color 220ms var(--ease-out);
}

.contact__phone:hover,
.footer__whatsapp:hover {
  border-color: var(--cyan);
  background: var(--cyan);
  color: var(--ink);
}

.contact__phone:focus-visible,
.footer__whatsapp:focus-visible {
  outline: 2px solid var(--cyan);
  outline-offset: 3px;
}

.whatsapp-icon {
  display: block;
  pointer-events: none;
}
```

- [ ] **Step 7: Run focused tests and confirm GREEN**

Run:

```bash
npm test -- src/i18n/content.test.ts src/CodeDreamersLanding.test.ts src/static-render.test.ts
```

Expected: PASS; each locale emits exactly two exact `%20`-encoded `wa.me` URLs, both links are icon-only with localized names and `target="_blank" rel="noreferrer"`, rendered visible text has no phone digits, no `tel:` remains, and JSON-LD retains `+53 52015051`.

---

### Task 5: Replace the Contact Ornament with the Complete Architecture SVG and Motion Contract

**Files:**
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/CodeDreamersLanding.tsx`
- Modify: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/styles.css`
- Test: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/CodeDreamersLanding.test.ts`
- Test: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/static-render.test.ts`

- [ ] **Step 1: Write RED SVG safety, structure, and motion tests**

Add this test to `src/CodeDreamersLanding.test.ts`:

```ts
it("renders one complete safe decorative Contact architecture", () => {
  const markup = renderToStaticMarkup(
    createElement(CodeDreamersLanding, { locale: "es" }),
  );
  const svg =
    markup.match(/<svg class="contact-architecture"[\s\S]*?<\/svg>/)?.[0] ?? "";

  expect(svg).not.toBe("");
  expect(markup).not.toContain('class="contact-route"');
  expect(svg).toContain('viewBox="0 0 520 520"');
  expect(svg).toContain('aria-hidden="true"');
  expect(svg).toContain('focusable="false"');
  expect(svg).toContain("data-reveal");
  expect(svg.match(/contact-architecture__branch contact-architecture__branch--/g)).toHaveLength(6);
  expect(svg.match(/contact-architecture__endpoint contact-architecture__endpoint--/g)).toHaveLength(6);
  expect(svg.match(/pathLength="1"/g)).toHaveLength(6);
  expect(svg).toContain("contact-architecture__core");
  expect(svg).toContain("contact-architecture__core-ring");
  expect(svg).toContain("contact-architecture__pulse");
  expect(svg).toContain("contact-architecture__signal");
  expect(svg).not.toMatch(/<script|\son\w+=|\bhref=|xlink:href|<foreignObject/i);
});
```

Add this CSS/source contract test:

```ts
it("defines ordered architecture reveal and a complete reduced-motion state", () => {
  const source = readFileSync(
    new URL("./CodeDreamersLanding.tsx", import.meta.url),
    "utf8",
  );
  const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

  expect(source).toContain('<svg className="contact-architecture"');
  expect(source).toContain("data-reveal");
  expect(source).not.toContain("<animate");
  expect(css).toContain("stroke-dasharray: 1");
  expect(css).toContain("stroke-dashoffset: 1");
  expect(css).toContain("@keyframes contact-branch-draw");
  expect(css).toContain("@keyframes contact-node-resolve");
  expect(css).toContain("@keyframes contact-signal-pass");
  expect(css).toMatch(
    /@media \(prefers-reduced-motion: no-preference\)[\s\S]*scroll-behavior: smooth/,
  );
  expect(css).toMatch(
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.contact-architecture__branch[\s\S]*stroke-dashoffset: 0/,
  );
  expect(css).toMatch(
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.contact-architecture__signal[\s\S]*animation: none/,
  );
});
```

In each locale case in `src/static-render.test.ts`, add:

```ts
expect(count(html, /class="contact-architecture"/g)).toBe(1);
expect(count(html, /contact-architecture__branch--/g)).toBe(6);
expect(count(html, /contact-architecture__endpoint--/g)).toBe(6);
```

- [ ] **Step 2: Run focused tests and confirm RED**

Run:

```bash
npm test -- src/CodeDreamersLanding.test.ts src/static-render.test.ts
```

Expected: FAIL because Contact still renders `.contact-route` with six empty spans and no complete inline architecture SVG or new motion contract.

- [ ] **Step 3: Add the complete safe stateless SVG**

Add immediately before `WhatsAppIcon` in `src/CodeDreamersLanding.tsx`:

```tsx
function ContactArchitecture() {
  const branches = [
    { path: "M260 260 L180 184 L92 116", x: 92, y: 116 },
    { path: "M260 260 L260 158 L260 68", x: 260, y: 68 },
    { path: "M260 260 L340 184 L428 116", x: 428, y: 116 },
    { path: "M260 260 L360 260 L460 260", x: 460, y: 260 },
    { path: "M260 260 L340 336 L428 404", x: 428, y: 404 },
    { path: "M260 260 L180 336 L92 404", x: 92, y: 404 },
  ] as const;

  return (
    <svg
      className="contact-architecture"
      viewBox="0 0 520 520"
      aria-hidden="true"
      focusable="false"
      data-reveal
    >
      <g className="contact-architecture__network" fill="none">
        {branches.map((branch, index) => (
          <path
            key={branch.path}
            className={`contact-architecture__branch contact-architecture__branch--${index + 1}`}
            d={branch.path}
            pathLength="1"
          />
        ))}
      </g>
      <g className="contact-architecture__core">
        <circle className="contact-architecture__core-ring" cx="260" cy="260" r="46" />
        <circle className="contact-architecture__core-node" cx="260" cy="260" r="20" />
      </g>
      <g className="contact-architecture__endpoints">
        {branches.map((branch, index) => (
          <circle
            key={`${branch.x}-${branch.y}`}
            className={`contact-architecture__endpoint contact-architecture__endpoint--${index + 1}`}
            cx={branch.x}
            cy={branch.y}
            r="12"
          />
        ))}
      </g>
      <circle className="contact-architecture__pulse" cx="260" cy="260" r="28" />
      <circle className="contact-architecture__signal" cx="260" cy="260" r="6" />
    </svg>
  );
}
```

This has one dominant core, six bent connected paths, six terminal nodes, one pulse ring, and one signal marker. It contains no script, event attribute, URL, link, embedded HTML, or external reference.

- [ ] **Step 4: Replace the complete six-span ornament**

Replace:

```tsx
      <div className="contact-route" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
```

with:

```tsx
      <ContactArchitecture />
```

- [ ] **Step 5: Replace `.contact-route` styles with exact architecture presentation and reveal CSS**

Remove every `.contact-route`, `.contact-route::before`, `.contact-route::after`, and `.contact-route span` rule from base and responsive sections. Add in the base Contact section:

```css
.contact-architecture {
  position: absolute;
  top: 50%;
  right: clamp(-5rem, -3vw, -1rem);
  width: min(46vw, 560px);
  height: auto;
  overflow: visible;
  color: var(--cyan);
  opacity: 0.72;
  pointer-events: none;
  transform: translateY(-50%);
}

.contact-architecture__branch {
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}

.contact-architecture__core,
.contact-architecture__endpoint {
  opacity: 0;
  transform: scale(0.72);
  transform-box: fill-box;
  transform-origin: center;
}

.contact-architecture__core-ring,
.contact-architecture__pulse {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.contact-architecture__core-node,
.contact-architecture__endpoint,
.contact-architecture__signal {
  fill: currentColor;
}

.contact-architecture__pulse,
.contact-architecture__signal {
  opacity: 0;
}

.contact-architecture.is-visible .contact-architecture__core {
  animation: contact-node-resolve 280ms var(--ease-out) forwards;
}

.contact-architecture.is-visible .contact-architecture__branch {
  animation: contact-branch-draw 560ms var(--ease-out) forwards;
}

.contact-architecture.is-visible .contact-architecture__branch--1,
.contact-architecture.is-visible .contact-architecture__branch--2 {
  animation-delay: 240ms;
}

.contact-architecture.is-visible .contact-architecture__branch--3,
.contact-architecture.is-visible .contact-architecture__branch--4 {
  animation-delay: 390ms;
}

.contact-architecture.is-visible .contact-architecture__branch--5,
.contact-architecture.is-visible .contact-architecture__branch--6 {
  animation-delay: 540ms;
}

.contact-architecture.is-visible .contact-architecture__endpoint {
  animation: contact-node-resolve 260ms var(--ease-out) forwards;
}

.contact-architecture.is-visible .contact-architecture__endpoint--1,
.contact-architecture.is-visible .contact-architecture__endpoint--2 {
  animation-delay: 700ms;
}

.contact-architecture.is-visible .contact-architecture__endpoint--3,
.contact-architecture.is-visible .contact-architecture__endpoint--4 {
  animation-delay: 850ms;
}

.contact-architecture.is-visible .contact-architecture__endpoint--5,
.contact-architecture.is-visible .contact-architecture__endpoint--6 {
  animation-delay: 1s;
}

.contact-architecture.is-visible .contact-architecture__pulse {
  animation: contact-pulse 4s 1.12s ease-out infinite;
}

.contact-architecture.is-visible .contact-architecture__signal {
  animation: contact-signal-pass 4s 1.12s ease-in-out infinite;
}

@keyframes contact-branch-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes contact-node-resolve {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes contact-pulse {
  0% {
    opacity: 0;
    transform: scale(0.72);
    transform-origin: 260px 260px;
  }
  4% {
    opacity: 0.5;
  }
  16% {
    opacity: 0;
    transform: scale(2.15);
    transform-origin: 260px 260px;
  }
  100% {
    opacity: 0;
    transform: scale(2.15);
    transform-origin: 260px 260px;
  }
}

@keyframes contact-signal-pass {
  0% {
    opacity: 0;
    transform: translate(0, 0);
  }
  4% {
    opacity: 0.8;
  }
  16% {
    opacity: 0;
    transform: translate(168px, -144px);
  }
  100% {
    opacity: 0;
    transform: translate(168px, -144px);
  }
}
```

The core appears by 280ms; branch groups complete by 1.1s; endpoints complete by 1.26s; the first pulse/signal pass completes by 1.76s. Repetition starts no more often than every four seconds.

- [ ] **Step 6: Add exact responsive and reduced-motion final states**

Inside `@media (max-width: 900px)`, add:

```css
  .contact-architecture {
    top: 34%;
    right: -9rem;
    width: 480px;
    opacity: 0.55;
  }
```

Inside `@media (max-width: 620px)`, add:

```css
  .contact-architecture {
    top: 47%;
    right: -11rem;
    width: 420px;
    max-width: none;
    opacity: 0.38;
  }
```

Inside `@media (prefers-reduced-motion: reduce)`, add:

```css
  .contact-architecture__branch {
    stroke-dashoffset: 0;
  }

  .contact-architecture__core,
  .contact-architecture__endpoint {
    opacity: 1;
    transform: scale(1);
  }

  .contact-architecture__pulse {
    opacity: 0.28;
    transform: scale(1.4);
    transform-origin: 260px 260px;
    animation: none;
  }

  .contact-architecture__signal {
    opacity: 0.8;
    transform: translate(84px, -72px);
    animation: none;
  }

  .contact-architecture.is-visible .contact-architecture__core,
  .contact-architecture.is-visible .contact-architecture__branch,
  .contact-architecture.is-visible .contact-architecture__endpoint,
  .contact-architecture.is-visible .contact-architecture__pulse,
  .contact-architecture.is-visible .contact-architecture__signal {
    animation: none;
  }
```

The reduced-motion state is complete before reveal: all six branches have zero dash offset, core/endpoints are fully visible at scale 1, and the pulse/signal motif is visible in a static animation-free state.

- [ ] **Step 7: Run focused tests and confirm GREEN**

Run:

```bash
npm test -- src/CodeDreamersLanding.test.ts src/static-render.test.ts
```

Expected: PASS; all locales prerender one safe decorative SVG with one core, six paths, six endpoints, pulse and signal classes; old span ornament is absent; CSS includes ordered reveal under 1.8 seconds and a complete animation-free reduced-motion state.

---

### Task 6: Verify, Review, Commit Once, Synchronize, Deploy, and Verify Production

**Files checked or generated before review:**
- Check all changed source, tests, styles, specs, and this plan under `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source`
- Regenerate: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/dist`
- Attempt refresh: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/graphify-out`
- Replace after review/commit only: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Surge_Ready`
- Create and retain: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Surge_Ready.backup.<UTC timestamp>`

- [ ] **Step 1: Run all focused RED→GREEN suites together**

Run:

```bash
npm test -- src/i18n/content.test.ts src/BackToTop.test.ts src/CodeDreamersLanding.test.ts src/static-render.test.ts
```

Expected: PASS with zero failed tests; modality completeness, disclosure markup, observer/focus behavior, exact WhatsApp URLs/security, visible-phone removal, JSON-LD preservation, SVG structure, motion, and prerender assertions all pass together.

- [ ] **Step 2: Run the complete technical gate before browser QA**

Run exactly:

```bash
git diff --check
npx tsc --noEmit
npm test
npm run build
npm run verify:static
```

Expected: every command exits 0; Vitest reports zero failures; TypeScript reports no diagnostics; Vite emits client and SSR output; prerender creates `/es/`, `/pt-br/`, `/en/`, root, and `200.html`; `.prerender` is removed; static verification accepts every localized route.

- [ ] **Step 3: Start local preview and run the exact six-cell gstack `/browse` matrix**

Start preview without changing source:

```bash
npm run preview -- --host 127.0.0.1
```

In a second shell, invoke `/browse`, resolve its binary, and use it for every browser action:

```bash
_ROOT="/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source"
B=""
[ -x "$_ROOT/.claude/skills/gstack/browse/dist/browse" ] && B="$_ROOT/.claude/skills/gstack/browse/dist/browse"
[ -z "$B" ] && B="$HOME/.claude/skills/gstack/browse/dist/browse"
test -x "$B"
```

Run these exact locale/viewport pairs:

```text
http://127.0.0.1:4173/es/     320x568
http://127.0.0.1:4173/es/     1280x720
http://127.0.0.1:4173/pt-br/  320x568
http://127.0.0.1:4173/pt-br/  1280x720
http://127.0.0.1:4173/en/     320x568
http://127.0.0.1:4173/en/     1280x720
```

For each pair, run:

```bash
$B viewport 320x568
$B goto http://127.0.0.1:4173/es/
$B wait --networkidle
$B snapshot -i
$B js "({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,details:document.querySelectorAll('.project-modes details').length,closed:document.querySelectorAll('.project-modes details:not([open])').length,whatsapp:document.querySelectorAll('a[href^=\"https://wa.me/5352015051?text=\"]').length,tel:document.querySelectorAll('a[href^=\"tel:\"]').length,branches:document.querySelectorAll('.contact-architecture__branch').length,endpoints:document.querySelectorAll('.contact-architecture__endpoint').length})"
$B click ".project-modes li:nth-child(1) summary"
$B click ".project-modes li:nth-child(2) summary"
$B js "({open:document.querySelectorAll('.project-modes details[open]').length,focus:document.activeElement?.tagName})"
$B js "window.scrollTo(0,document.querySelector('#cartera').offsetTop);true"
$B js "new Promise((resolve)=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(true))))"
$B is visible ".back-to-top"
$B js "window.scrollTo(0,document.querySelector('#contacto').offsetTop);true"
$B js "new Promise((resolve)=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(true))))"
$B is hidden ".back-to-top"
$B js "window.scrollTo(0,document.querySelector('#cartera').offsetTop);true"
$B js "new Promise((resolve)=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(true))))"
$B is visible ".back-to-top"
$B click ".back-to-top"
$B js "new Promise((resolve)=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(true))))"
$B js "({hash:location.hash,activeId:document.activeElement?.id})"
$B console --errors
$B network
$B screenshot /tmp/codedreamers-es-320x568.png --viewport
```

Repeat the same commands with the corresponding URL, viewport, and screenshot path:

```text
/tmp/codedreamers-es-1280x720.png
/tmp/codedreamers-pt-br-320x568.png
/tmp/codedreamers-pt-br-1280x720.png
/tmp/codedreamers-en-320x568.png
/tmp/codedreamers-en-1280x720.png
```

For each cell, expected values are:

```text
overflow = 0
details = 9
closed = 9 before activation
whatsapp = 2
tel = 0
branches = 6
endpoints = 6
open = 2 after opening the first two summaries
focus = SUMMARY
back-to-top hidden at hero, visible at unprotected portfolio, hidden at Contact/footer, visible again after upward return
hash = #inicio after activation
activeId = inicio after activation
console errors = none
failed/unexpected network requests = none
```

At both viewport sizes for each locale, additionally use `Tab`, `Enter`, and `Space` through `$B press` to confirm summaries keep focus and toggle natively; inspect the CTA only after opening; confirm each summary and CTA is at least 44px high; confirm both WhatsApp targets are 44×44; confirm the back-to-top target is exactly 44×44 with a visible focus ring; confirm long Spanish/Portuguese panel copy wraps without clipping; confirm one core, six connected branches, six endpoints, and one coherent signal motif remain unclipped.

Emulate reduced motion once per viewport size:

```bash
$B cdp Emulation.setEmulatedMedia '{"features":[{"name":"prefers-reduced-motion","value":"reduce"}]}'
$B reload
$B js "({scrollBehavior:getComputedStyle(document.documentElement).scrollBehavior,branchOffset:getComputedStyle(document.querySelector('.contact-architecture__branch')).strokeDashoffset,coreOpacity:getComputedStyle(document.querySelector('.contact-architecture__core')).opacity,pulseAnimation:getComputedStyle(document.querySelector('.contact-architecture__pulse')).animationName,backTransition:getComputedStyle(document.querySelector('.back-to-top')).transitionDuration})"
$B cdp Emulation.setEmulatedMedia '{"features":[]}'
```

Expected reduced-motion values: `scrollBehavior` is `auto`; branch dash offset is `0px` or numeric zero; core opacity is `1`; pulse animation is `none`; back-to-top transition duration is `0s` or effectively zero. Read all six screenshots with the image reader before accepting QA.

- [ ] **Step 4: Attempt the required graph refresh before review**

Run exactly from the repository root:

```bash
python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"
```

Expected: exit 0 and refreshed `graphify-out` tracked for review. If and only if Python reports `ModuleNotFoundError: No module named 'graphify'`, record that exact environment limitation and continue because the required refresh was attempted. Any other graph refresh error blocks review until resolved.

- [ ] **Step 5: Re-run check-only gates and freeze the review candidate**

Run:

```bash
git diff --check
npx tsc --noEmit
npm test
npm run build
npm run verify:static
git status --short
```

Expected: all checks exit 0; `git status --short` lists only the two approved specs, this plan, intended source/tests/styles, and successful graph refresh output. It must not list a dependency change, unrelated file, manually edited generated file, staging change, or unexpected artifact.

Record the candidate manifest before review:

```bash
git diff --name-status
git status --short
```

After this point, do not run a formatter, fixer, graph refresh, generated-source writer, or any command that changes reviewed source bytes, paths, or modes.

- [ ] **Step 6: Start and complete one native bounded review on the frozen workspace**

Bootstrap once and save the native transition:

```bash
review_status="$(mktemp)"
gentle-ai review status --cwd "/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source" --contract gentle-ai.review-integration/v1 --next-transition > "$review_status"
node -e 'const fs=require("fs");const value=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));if(value.next_transition?.kind!=="execute")process.exit(2);process.stdout.write(value.next_transition.execute.command)' "$review_status" > /tmp/codedreamers-review-next-command
```

Expected: the native status reports `action: "start"`, `reason_code: "fresh_target_ready"`, and one exact `review.start` command bound to the frozen target.

Execute that exact command once and preserve its output:

```bash
review_command="$(< /tmp/codedreamers-review-next-command)"
$SHELL -lc "$review_command" | tee /tmp/codedreamers-review-start.json
```

Run every lens selected by native START exactly once, in selected order, with the exact `GENTLE_AI_REVIEW_BINDING` and immutable candidate diff/changed-path manifest emitted by START. Capture each result with the exact `gentle-ai review capture-result` command emitted for that lens. Pass the emitted manifest JSON values to the exact native `review.finalize` transition in selected-lens order. Do not start another review, add a lens, run Judgment Day unless native START explicitly selects it, or construct a lineage/target/binding manually.

Expected: FINALIZE returns an allowed terminal receipt bound to the unchanged candidate. If FINALIZE reports correction required, stop: any source correction would invalidate the frozen candidate and requires the native-authorized bounded correction path, complete re-verification, and a new explicit scope action. Do not silently edit after START.

- [ ] **Step 7: Stage only exact reviewed paths and validate pre-commit against the same receipt**

Stage every reviewed path by explicit name, including successful graph outputs reported by `git status`; the base command is:

```bash
git add \
  docs/superpowers/specs/2026-07-29-project-modality-details-design.md \
  docs/superpowers/specs/2026-07-29-final-landing-polish-design.md \
  docs/superpowers/plans/2026-07-29-final-landing-interactions.md \
  src/i18n/types.ts \
  src/i18n/dictionaries/es.ts \
  src/i18n/dictionaries/ptBR.ts \
  src/i18n/dictionaries/en.ts \
  src/i18n/content.test.ts \
  src/BackToTop.tsx \
  src/BackToTop.test.ts \
  src/CodeDreamersLanding.tsx \
  src/CodeDreamersLanding.test.ts \
  src/static-render.test.ts \
  src/styles.css
```

If graph refresh changed tracked `graphify-out` paths, append only the exact changed graph paths shown in the frozen manifest. Staging must not alter content or mode.

Extract the exact lineage returned by native START and verify it is present:

```bash
export GENTLE_AI_REVIEW_LINEAGE="$(node -e 'const fs=require("fs");const value=JSON.parse(fs.readFileSync("/tmp/codedreamers-review-start.json","utf8"));if(typeof value.lineage!=="string"||value.lineage.length===0)process.exit(2);process.stdout.write(value.lineage)')"
test -n "$GENTLE_AI_REVIEW_LINEAGE"
```

Validate with that same lineage using the native pre-commit command:

```bash
gentle-ai review validate --gate pre-commit --cwd "/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source" --lineage "$GENTLE_AI_REVIEW_LINEAGE"
```

Expected: native authority allows pre-commit and confirms staged tree, paths, policy, evidence, lineage, and receipt match the reviewed target exactly.

- [ ] **Step 8: Create exactly one final conventional commit**

Run:

```bash
git commit -m "feat: complete final landing interactions"
git status --short
```

Expected: one new commit named `feat: complete final landing interactions`; commit hooks pass without changing bytes; `git status --short` is empty. If a hook changes any byte/path/mode, stop because the receipt is invalid; do not amend and do not commit the mutated candidate without a new normalized review.

- [ ] **Step 9: Create a rollback-safe Surge_Ready backup and synchronize exact verified output**

Invoke `/careful`, then run this authorized autonomous swap without asking for another confirmation:

```bash
target="/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Surge_Ready"
next="${target}.next"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup="${target}.backup.${stamp}"
failed="${target}.failed.${stamp}"
test -d dist
test ! -e "$next"
test ! -e "$backup"
cp -a dist "$next"
diff -qr dist "$next"
mv "$target" "$backup"
if mv "$next" "$target" && diff -qr dist "$target"; then
  printf 'Verified backup retained at %s\n' "$backup"
else
  test ! -e "$failed"
  test -e "$target" && mv "$target" "$failed"
  mv "$backup" "$target"
  exit 1
fi
printf '%s\n' "$backup" > /tmp/codedreamers-surge-backup-path
diff -qr dist "$target"
```

Expected: all commands exit 0; `CodeDreamers_360_Surge_Ready` is byte-for-byte equal to `dist`; the timestamped backup remains intact; `/tmp/codedreamers-surge-backup-path` records the exact rollback source.

- [ ] **Step 10: Deploy only `codedreamers.surge.sh`**

Run exactly:

```bash
surge "/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Surge_Ready" codedreamers.surge.sh
```

Expected: Surge reports a successful publication to `https://codedreamers.surge.sh` and no other domain.

- [ ] **Step 11: Verify production and roll back on any failure**

Run exact static checks:

```bash
curl --fail --silent --show-error https://codedreamers.surge.sh/es/ | rg '<html lang="es"|href="https://wa.me/5352015051\?text=Hola%2C%20CodeDreamers|class="contact-architecture"|class="back-to-top"'
curl --fail --silent --show-error https://codedreamers.surge.sh/pt-br/ | rg '<html lang="pt-BR"|href="https://wa.me/5352015051\?text=Ol%C3%A1%2C%20CodeDreamers|class="contact-architecture"|class="back-to-top"'
curl --fail --silent --show-error https://codedreamers.surge.sh/en/ | rg '<html lang="en"|href="https://wa.me/5352015051\?text=Hello%2C%20CodeDreamers|class="contact-architecture"|class="back-to-top"'
```

Invoke `/browse` against production at `320x568` and `1280x720` for `/es/`, `/pt-br/`, and `/en/`. Repeat the Task 6 Step 3 semantic, interaction, focus, motion, overflow, console, network, WhatsApp, modality, SVG, and collision assertions. Expected: all six production cells match local QA and all static checks return the exact localized additions.

If any production check fails, run:

```bash
backup="$(< /tmp/codedreamers-surge-backup-path)"
test -d "$backup"
surge "$backup" codedreamers.surge.sh
curl --fail --silent --show-error https://codedreamers.surge.sh/es/ > /dev/null
```

Expected rollback: the retained pre-deploy backup is republished to `codedreamers.surge.sh`, the Spanish route returns HTTP success, and the failed new production is no longer served. Preserve the failed synchronized directory and backup for diagnosis; do not delete either automatically.

- [ ] **Step 12: Record final evidence without another mutation**

Report:

```text
Focused tests: PASS
Full TypeScript/Vitest/build/static gates: PASS
Graph refresh: PASS, or exact ModuleNotFoundError environment limitation recorded
Local gstack matrix: 6/6 PASS
Native bounded review receipt: ALLOW
Pre-commit receipt validation: ALLOW
Final commits created: exactly 1
Surge_Ready parity: PASS
Deployment target: codedreamers.surge.sh only
Production gstack matrix: 6/6 PASS, or rollback completed
Structured JSON-LD telephone: preserved
Visible tel links/digits: absent
Dependencies/unrelated refactors: absent
```

Do not run another formatter, fixer, graph refresh, review start, commit, sync, or deploy after recording this evidence.

---

## Author-Side Coverage Check

- Both approved specifications are named as normative contracts, while every implementation value needed for execution is repeated in this plan.
- All nine stable modality IDs, all 27 localized modality records, all three inclusion labels, all 27 descriptions, all 81 inclusions, and all 27 contextual CTA labels are exact.
- Project modes use uncontrolled native `<details>/<summary>`, stable keys/order, no shared name/state/handlers, and one internal encoded mailto CTA per panel.
- Back-to-top copy is exact for `es`, `pt-BR`, and `en`; initial SSR state, one observer, all three protected targets, cleanup, unavailable-target fallback, native hash behavior, one animation frame, focus handoff, 44×44 target, safe-area placement, collision behavior, and reduced motion are specified with matching types and tests.
- WhatsApp messages, accessible labels, percent-encoded destinations, exact digit-only number, icon-only semantics, two-link count, `_blank`/`noreferrer`, zero visible telephone links/digits, and unchanged JSON-LD telephone are covered.
- Contact architecture markup defines one core, six bent connected paths, six endpoints, one pulse, one signal, safe decorative attributes, no active/external content, ordered CSS reveal under 1.8 seconds, four-second repeat ceiling, responsive placement, and a complete static reduced-motion state.
- Focused RED and GREEN commands, full gates, graph attempt, all six local and production browser cells, source-freeze ordering, native review, receipt-bound pre-commit validation, exactly one final commit, rollback-safe Surge_Ready parity, deploy-only domain, production checks, and rollback are concrete.
- No new dependency, route, state abstraction, page fork, manually edited generated output, per-task commit, unrelated refactor, or second review budget is included.
- This is an author-side contract coverage and consistency check, not independent reviewer approval; no reviewer agent was used because the authoring request prohibited agents.
