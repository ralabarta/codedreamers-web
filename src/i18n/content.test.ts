import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { catalogDefinition, localizeCatalog } from "./catalog";
import { dictionaries } from "./dictionaries";
import { LOCALES } from "./locale";
import {
  PRODUCT_CODES,
  PROJECT_MODE_IDS,
  type ProjectModeCopy,
  type ProjectModeId,
} from "./types";

function flattenStrings(
  value: unknown,
  path = "",
  flattened: Record<string, string> = {},
): Record<string, string> {
  if (typeof value === "string") {
    flattened[path] = value;
    return flattened;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      flattenStrings(item, `${path}[${index}]`, flattened),
    );
    return flattened;
  }

  if (value && typeof value === "object") {
    for (const [key, nestedValue] of Object.entries(value)) {
      flattenStrings(nestedValue, path ? `${path}.${key}` : key, flattened);
    }
  }

  return flattened;
}

const intentionallySharedSpanishValues = new Set<string>([
  "pt-BR:hero.proof[0].value:54",
  "pt-BR:hero.proof[1].value:16",
  "pt-BR:hero.proof[2].value:10",
  "pt-BR:hero.proof[3].value:1",
  "pt-BR:outcomes.items.captar.range:P01—P08",
  "pt-BR:outcomes.items.vender.range:P09—P16",
  "pt-BR:outcomes.items.operar.range:P17—P28",
  "pt-BR:outcomes.items.decidir.range:P29—P36",
  "pt-BR:outcomes.items.escalar.range:P37—P54",
  "pt-BR:catalog.families.ia.shortName:IA",
  "pt-BR:catalog.products.P14.name:Marketplace",
  "pt-BR:catalog.products.P19.name:Progressive Web App (PWA)",
  "pt-BR:catalog.products.P37.name:Chatbot inteligente",
  "pt-BR:formats.items[2]:E-commerce",
  "pt-BR:formats.items[5]:PWA",
  "pt-BR:formats.items[7]:Marketplace",
  "pt-BR:formats.items[8]:CRM / ERP",
  "pt-BR:formats.items[10]:Backoffice",
  "pt-BR:capabilities.items[0]:UX/UI",
  "pt-BR:capabilities.items[6]:Offline",
  "en:hero.kicker:Software · Data · AI",
  "en:hero.proof[0].value:54",
  "en:hero.proof[1].value:16",
  "en:hero.proof[2].value:10",
  "en:hero.proof[3].value:1",
  "en:outcomes.items.captar.range:P01—P08",
  "en:outcomes.items.vender.range:P09—P16",
  "en:outcomes.items.operar.range:P17—P28",
  "en:outcomes.items.decidir.range:P29—P36",
  "en:outcomes.items.escalar.range:P37—P54",
  "en:catalog.products.P14.name:Marketplace",
  "en:catalog.products.P19.name:Progressive Web App (PWA)",
  "en:ecosystem.layers[0]:Web / App",
  "en:ecosystem.layers[1]:CRM / Commerce",
  "en:ecosystem.layers[2]:ERP / Workflows",
  "en:ecosystem.layers[3]:Data / BI",
  "en:ecosystem.layers[4]:AI / Agents",
  "en:formats.items[2]:E-commerce",
  "en:formats.items[5]:PWA",
  "en:formats.items[7]:Marketplace",
  "en:formats.items[8]:CRM / ERP",
  "en:capabilities.items[0]:UX/UI",
  "en:capabilities.items[6]:Offline",
  "en:capabilities.items[8]:Cloud",
  "en:status.system:SYS / 054 · REV 2026",
  "en:status.route:ROUTE / 360° · 06 NODES",
  "en:seo.title:CodeDreamers — Software, Data & AI",
  "en:seo.ogTitle:CodeDreamers — Software, Data & AI",
  "en:seo.twitterTitle:CodeDreamers — Software, Data & AI",
]);

const expectedCodes = Array.from(
  { length: 54 },
  (_, index) => `P${String(index + 1).padStart(2, "0")}`,
);

const expectedCodesByFamily = {
  experiencia: expectedCodes.slice(0, 8),
  ventas: expectedCodes.slice(8, 16),
  operaciones: expectedCodes.slice(16, 28),
  datos: expectedCodes.slice(28, 36),
  ia: expectedCodes.slice(36, 44),
  sectoriales: expectedCodes.slice(44, 54),
};

const expectedProjectModeIds = [
  "product-from-scratch",
  "mvp-prototype",
  "redesign-modernization",
  "new-module",
  "systems-integration",
  "platform-migration",
  "dedicated-team",
  "maintenance-evolution",
  "discovery-ux-ui",
] as const satisfies readonly ProjectModeId[];

const expectedProjectModes = {
  es: {
    emailSubjectPrefix: "Proyecto",
    includesLabel: "Qué incluye",
    items: {
      "product-from-scratch": { name: "Producto desde cero", description: "Convertimos una oportunidad en un producto digital listo para lanzar y evolucionar.", inclusions: ["Definición de producto y arquitectura", "UX/UI y desarrollo integral", "Lanzamiento y base de evolución"], ctaLabel: "Hablemos de un producto desde cero" },
      "mvp-prototype": { name: "MVP / prototipo", description: "Validamos la propuesta con la menor solución útil antes de ampliar la inversión.", inclusions: ["Hipótesis, alcance y métricas", "Prototipo navegable", "MVP instrumentado para aprender"], ctaLabel: "Hablemos de tu MVP o prototipo" },
      "redesign-modernization": { name: "Rediseño & modernización", description: "Renovamos experiencia y tecnología sin perder la continuidad del negocio.", inclusions: ["Auditoría de producto y plataforma", "Rediseño UX/UI", "Modernización incremental"], ctaLabel: "Hablemos de tu rediseño y modernización" },
      "new-module": { name: "Nuevo módulo", description: "Añadimos una capacidad completa al sistema que ya sostiene tu operación.", inclusions: ["Definición funcional", "Arquitectura de integración", "Desarrollo, pruebas y entrega"], ctaLabel: "Hablemos de un nuevo módulo" },
      "systems-integration": { name: "Integración de sistemas", description: "Conectamos plataformas y datos para eliminar trabajo manual y silos operativos.", inclusions: ["Mapa de integraciones", "APIs y flujos de datos", "Monitoreo y manejo de errores"], ctaLabel: "Hablemos de integrar tus sistemas" },
      "platform-migration": { name: "Migración de plataforma", description: "Trasladamos producto y datos con un cambio controlado y una ruta de reversión.", inclusions: ["Inventario y plan de migración", "Migración de código y datos", "Corte, validación y reversión"], ctaLabel: "Hablemos de tu migración de plataforma" },
      "dedicated-team": { name: "Equipo dedicado", description: "Sumamos un equipo estable que trabaja dentro de tus prioridades y cadencia.", inclusions: ["Perfiles dedicados", "Gestión compartida del backlog", "Continuidad técnica y de producto"], ctaLabel: "Hablemos de un equipo dedicado" },
      "maintenance-evolution": { name: "Mantenimiento & evolución", description: "Protegemos la operación mientras mejoramos el producto de forma continua.", inclusions: ["Soporte preventivo y correctivo", "Mejoras priorizadas", "Actualizaciones técnicas y de seguridad"], ctaLabel: "Hablemos de mantenimiento y evolución" },
      "discovery-ux-ui": { name: "Discovery & UX/UI", description: "Reducimos incertidumbre antes de construir mediante investigación y diseño validado.", inclusions: ["Investigación de negocio y usuarios", "Flujos y prototipos", "Roadmap validado y priorizado"], ctaLabel: "Hablemos de discovery y UX/UI" },
    },
  },
  "pt-BR": {
    emailSubjectPrefix: "Projeto",
    includesLabel: "O que inclui",
    items: {
      "product-from-scratch": { name: "Produto do zero", description: "Transformamos uma oportunidade em um produto digital pronto para lançar e evoluir.", inclusions: ["Definição de produto e arquitetura", "UX/UI e desenvolvimento completo", "Lançamento e base para evolução"], ctaLabel: "Vamos falar sobre um produto do zero" },
      "mvp-prototype": { name: "MVP / protótipo", description: "Validamos a proposta com a menor solução útil antes de ampliar o investimento.", inclusions: ["Hipóteses, escopo e métricas", "Protótipo navegável", "MVP instrumentado para aprendizado"], ctaLabel: "Vamos falar sobre seu MVP ou protótipo" },
      "redesign-modernization": { name: "Redesign e modernização", description: "Renovamos experiência e tecnologia sem interromper a continuidade do negócio.", inclusions: ["Auditoria de produto e plataforma", "Redesign de UX/UI", "Modernização incremental"], ctaLabel: "Vamos falar sobre redesign e modernização" },
      "new-module": { name: "Novo módulo", description: "Adicionamos uma capacidade completa ao sistema que já sustenta sua operação.", inclusions: ["Definição funcional", "Arquitetura de integração", "Desenvolvimento, testes e entrega"], ctaLabel: "Vamos falar sobre um novo módulo" },
      "systems-integration": { name: "Integração de sistemas", description: "Conectamos plataformas e dados para eliminar trabalho manual e silos operacionais.", inclusions: ["Mapeamento de integrações", "APIs e fluxos de dados", "Monitoramento e tratamento de erros"], ctaLabel: "Vamos falar sobre integração de sistemas" },
      "platform-migration": { name: "Migração de plataforma", description: "Transferimos produto e dados com uma mudança controlada e um plano de reversão.", inclusions: ["Inventário e plano de migração", "Migração de código e dados", "Virada, validação e reversão"], ctaLabel: "Vamos falar sobre sua migração de plataforma" },
      "dedicated-team": { name: "Equipe dedicada", description: "Somamos uma equipe estável que trabalha dentro das suas prioridades e cadência.", inclusions: ["Perfis dedicados", "Gestão compartilhada do backlog", "Continuidade técnica e de produto"], ctaLabel: "Vamos falar sobre uma equipe dedicada" },
      "maintenance-evolution": { name: "Manutenção e evolução", description: "Protegemos a operação enquanto melhoramos o produto continuamente.", inclusions: ["Suporte preventivo e corretivo", "Melhorias priorizadas", "Atualizações técnicas e de segurança"], ctaLabel: "Vamos falar sobre manutenção e evolução" },
      "discovery-ux-ui": { name: "Discovery e UX/UI", description: "Reduzimos incertezas antes da construção com pesquisa e design validados.", inclusions: ["Pesquisa de negócio e usuários", "Fluxos e protótipos", "Roadmap validado e priorizado"], ctaLabel: "Vamos falar sobre discovery e UX/UI" },
    },
  },
  en: {
    emailSubjectPrefix: "Project",
    includesLabel: "What it includes",
    items: {
      "product-from-scratch": { name: "Product from scratch", description: "We turn an opportunity into a digital product ready to launch and evolve.", inclusions: ["Product definition and architecture", "End-to-end UX/UI and development", "Launch and foundation for evolution"], ctaLabel: "Discuss a product from scratch" },
      "mvp-prototype": { name: "MVP / prototype", description: "We validate the proposition with the smallest useful solution before expanding investment.", inclusions: ["Hypotheses, scope, and metrics", "Clickable prototype", "Instrumented MVP for learning"], ctaLabel: "Discuss your MVP or prototype" },
      "redesign-modernization": { name: "Redesign and modernization", description: "We renew the experience and technology without disrupting business continuity.", inclusions: ["Product and platform audit", "UX/UI redesign", "Incremental modernization"], ctaLabel: "Discuss redesign and modernization" },
      "new-module": { name: "New module", description: "We add a complete capability to the system already supporting your operation.", inclusions: ["Functional definition", "Integration architecture", "Development, testing, and delivery"], ctaLabel: "Discuss a new module" },
      "systems-integration": { name: "Systems integration", description: "We connect platforms and data to remove manual work and operational silos.", inclusions: ["Integration mapping", "APIs and data flows", "Monitoring and error handling"], ctaLabel: "Discuss system integration" },
      "platform-migration": { name: "Platform migration", description: "We move product and data through a controlled change with a rollback path.", inclusions: ["Migration inventory and plan", "Code and data migration", "Cutover, validation, and rollback"], ctaLabel: "Discuss your platform migration" },
      "dedicated-team": { name: "Dedicated team", description: "We add a stable team that works within your priorities and delivery cadence.", inclusions: ["Dedicated roles", "Shared backlog management", "Technical and product continuity"], ctaLabel: "Discuss a dedicated team" },
      "maintenance-evolution": { name: "Maintenance and evolution", description: "We protect operations while improving the product continuously.", inclusions: ["Preventive and corrective support", "Prioritized improvements", "Technical and security updates"], ctaLabel: "Discuss maintenance and evolution" },
      "discovery-ux-ui": { name: "Discovery and UX/UI", description: "We reduce uncertainty before building through validated research and design.", inclusions: ["Business and user research", "Flows and prototypes", "Validated, prioritized roadmap"], ctaLabel: "Discuss discovery and UX/UI" },
    },
  },
} as const satisfies Record<
  (typeof LOCALES)[number],
  { emailSubjectPrefix: string; includesLabel: string; items: Readonly<Record<ProjectModeId, ProjectModeCopy>> }
>;

describe("localized content contract", () => {
  it("defines the exact unique ordered product codes P01 through P54", () => {
    expect(PRODUCT_CODES).toEqual(expectedCodes);
    expect(new Set(PRODUCT_CODES).size).toBe(54);
  });

  it("preserves the product membership range of every family", () => {
    expect(
      Object.fromEntries(
        catalogDefinition.map((family) => [
          family.id,
          family.products.map((product) => product.code),
        ]),
      ),
    ).toEqual(expectedCodesByFamily);
  });

  it("localizes six families and 54 products in Spanish", () => {
    const families = localizeCatalog("es");

    expect(families).toHaveLength(6);
    expect(families.flatMap((family) => family.products)).toHaveLength(54);
  });

  it("provides complete Spanish copy for every product", () => {
    const products = localizeCatalog("es").flatMap((family) => family.products);

    for (const product of products) {
      expect(product.name.trim(), product.code).not.toBe("");
      expect(product.description.trim(), product.code).not.toBe("");
      expect(product.includes, product.code).toHaveLength(3);
      expect(
        product.includes.every((includedItem) => includedItem.trim() !== ""),
        product.code,
      ).toBe(true);
    }
  });

  it("provides identical non-empty string paths for every locale", () => {
    const spanish = flattenStrings(dictionaries.es);
    const spanishPaths = Object.keys(spanish).sort();

    for (const locale of LOCALES) {
      const localized = flattenStrings(dictionaries[locale]);

      expect(Object.keys(localized).sort(), locale).toEqual(spanishPaths);
      for (const [path, value] of Object.entries(localized)) {
        expect(value.trim(), `${locale}:${path}`).not.toBe("");
      }
    }
  });

  it("provides exact project modality contracts and approved localized copy", () => {
    expect(PROJECT_MODE_IDS).toEqual(expectedProjectModeIds);
    expect(new Set(PROJECT_MODE_IDS).size).toBe(9);

    for (const locale of LOCALES) {
      const projectModes = dictionaries[locale].projectModes;
      const typedItems: Readonly<Record<ProjectModeId, ProjectModeCopy>> =
        projectModes.items;

      expect(Object.keys(typedItems), `${locale}:exact IDs`).toEqual(
        expectedProjectModeIds,
      );
      expect(projectModes.includesLabel, `${locale}:includesLabel`).toBe(
        expectedProjectModes[locale].includesLabel,
      );
      expect(typedItems, `${locale}:approved items`).toEqual(
        expectedProjectModes[locale].items,
      );
      expect(projectModes.emailSubjectPrefix, `${locale}:email subject prefix`).toBe(
        expectedProjectModes[locale].emailSubjectPrefix,
      );

      for (const id of PROJECT_MODE_IDS) {
        const item = typedItems[id];
        expect(Object.keys(item).sort(), `${locale}:${id}:shape`).toEqual([
          "ctaLabel",
          "description",
          "inclusions",
          "name",
        ]);
        expect(item.inclusions, `${locale}:${id}:inclusions`).toHaveLength(3);
        expect(
          item.inclusions.every((inclusion) => inclusion.trim() !== ""),
          `${locale}:${id}:non-empty inclusions`,
        ).toBe(true);
        expect(new Set(item.inclusions).size, `${locale}:${id}:distinct inclusions`).toBe(
          3,
        );
        expect(
          `${projectModes.emailSubjectPrefix} · ${item.name}`,
          `${locale}:${id}:subject formula`,
        ).toBe(
          `${expectedProjectModes[locale].emailSubjectPrefix} · ${item.name}`,
        );
      }

      expect(
        new Set(PROJECT_MODE_IDS.map((id) => typedItems[id].ctaLabel)).size,
        `${locale}:distinct CTA labels`,
      ).toBe(9);
    }
  });

  it("provides the exact localized back-to-top accessible names", () => {
    expect(
      Object.fromEntries(
        LOCALES.map((locale) => [locale, dictionaries[locale].backToTop.ariaLabel]),
      ),
    ).toEqual({
      es: "Volver al inicio",
      "pt-BR": "Voltar ao início",
      en: "Back to top",
    });
  });

  it("provides the exact localized WhatsApp contact contract", () => {
    const expected = {
      es: {
        whatsappAriaLabel: "Conversar con CodeDreamers por WhatsApp sobre un proyecto",
        whatsappMessage: "Hola, CodeDreamers. Me gustaría conversar sobre un proyecto.",
      },
      "pt-BR": {
        whatsappAriaLabel: "Conversar com a CodeDreamers pelo WhatsApp sobre um projeto",
        whatsappMessage: "Olá, CodeDreamers. Gostaria de conversar sobre um projeto.",
      },
      en: {
        whatsappAriaLabel: "Discuss a project with CodeDreamers on WhatsApp",
        whatsappMessage: "Hello, CodeDreamers. I would like to discuss a project.",
      },
    } as const;

    for (const locale of LOCALES) {
      expect(dictionaries[locale].contact).toMatchObject(expected[locale]);
      expect(dictionaries[locale].contact.whatsappAriaLabel.trim()).not.toBe("");
      expect(dictionaries[locale].contact.whatsappMessage.trim()).not.toBe("");
      expect(dictionaries[locale].contact).not.toHaveProperty("phoneLabel");
    }
  });

  it("identifies every dictionary with its exact locale", () => {
    for (const locale of LOCALES) {
      expect(dictionaries[locale].locale).toBe(locale);
    }
  });

  it("uses exact localized full language names in every selector", () => {
    expect(dictionaries.es.selector.labels).toEqual({
      es: "Español",
      "pt-BR": "Portugués (Brasil)",
      en: "Inglés",
    });
    expect(dictionaries["pt-BR"].selector.labels).toEqual({
      es: "Espanhol",
      "pt-BR": "Português (Brasil)",
      en: "Inglês",
    });
    expect(dictionaries.en.selector.labels).toEqual({
      es: "Spanish",
      "pt-BR": "Portuguese (Brazil)",
      en: "English",
    });
  });

  it("localizes the complete ordered catalog for every locale", () => {
    for (const locale of LOCALES) {
      const products = localizeCatalog(locale).flatMap(
        (family) => family.products,
      );

      expect(products.map((product) => product.code), locale).toEqual(
        PRODUCT_CODES,
      );
      expect(products, locale).toHaveLength(54);

      for (const product of products) {
        expect(product.name.trim(), `${locale}:${product.code}:name`).not.toBe(
          "",
        );
        expect(
          product.description.trim(),
          `${locale}:${product.code}:description`,
        ).not.toBe("");
        expect(product.includes, `${locale}:${product.code}:includes`).toHaveLength(
          3,
        );
        expect(
          product.includes.every((includedItem) => includedItem.trim() !== ""),
          `${locale}:${product.code}:includes`,
        ).toBe(true);
        expect(
          new Set(product.includes).size,
          `${locale}:${product.code}:unique includes`,
        ).toBe(3);
      }
    }
  });

  it("keeps Portuguese and English dictionaries independent from Spanish", () => {
    for (const fileName of ["ptBR.ts", "en.ts"]) {
      const source = readFileSync(
        new URL(`./dictionaries/${fileName}`, import.meta.url),
        "utf8",
      );

      expect(source, fileName).not.toMatch(/from\s+["']\.\/es["']/);
      expect(source, fileName).not.toMatch(/\.\.\.es\b/);
    }
  });

  it("only preserves reviewed Spanish-equal values outside Spanish", () => {
    const spanish = flattenStrings(dictionaries.es);

    for (const locale of ["pt-BR", "en"] as const) {
      const localized = flattenStrings(dictionaries[locale]);
      const unexpectedSharedValues = Object.entries(localized).filter(
        ([path, value]) =>
          path !== "locale" &&
          spanish[path] === value &&
          !intentionallySharedSpanishValues.has(`${locale}:${path}:${value}`),
      );

      expect(unexpectedSharedValues, locale).toEqual([]);
    }
  });

  it("keeps catalog family and product data out of the landing component", () => {
    const landingSource = readFileSync(
      new URL("../CodeDreamersLanding.tsx", import.meta.url),
      "utf8",
    );

    expect(landingSource).not.toContain("legacyFamilies");
    expect(landingSource).not.toContain("withOutcome");
    expect(landingSource).not.toContain('code: "P');
    expect(landingSource).not.toContain("description:");
    expect(landingSource).not.toContain("includes:");
  });

  it("identifies the Spanish dictionary locale", () => {
    expect(dictionaries.es.locale).toBe("es");
  });
});
