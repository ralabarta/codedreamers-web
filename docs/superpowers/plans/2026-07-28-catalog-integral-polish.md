# Catalog Integral Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing 54-product catalog outcome-first, deterministic, searchable across all existing product text, accessible at every viewport, and copy-consistent without changing product identity, capabilities, details interaction, or conversion scope.

**Architecture:** Keep the existing `families` hierarchy and `ProductDetails` shape, add explicit immutable `outcomeIds` to each product, and derive visible products from one pure outcome → family → query composition. Pass the selected outcome from `OutcomeNavigator` into `Portfolio`; retain native independent `<details>` disclosures and existing sector content. Extend the current unit contract with pure data/filter contracts, then verify the rendered result with source tests, typecheck, build, and browser QA.

**Tech Stack:** React 19, TypeScript 5.9, Vitest 4, Vite 8, existing CSS, native HTML buttons/inputs/details, existing Surge-ready directory.

---

## File map and responsibilities

- **Modify:** `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/CodeDreamersLanding.tsx`
  - Preserve the six `ProductFamily` records, product codes/names/order, outcome cards, sectors, existing visual structure, and native details.
  - Add the explicit `outcomeIds` product contract, pure catalog filtering helpers, outcome-aware portfolio state, outcome-to-catalog anchoring, expanded text search, selected/result-count semantics, and full-label filter markup.
  - Rewrite only `description` and `includes`; do not add capabilities or contact CTAs.
- **Modify:** `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/CodeDreamersLanding.test.ts`
  - Preserve the identity/family contract and add deterministic outcome membership, composition, search-field, accessibility-data, and no-contact contract tests.
- **Modify:** `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/src/styles.css`
  - Keep the established visual language; remove mobile filter-label ellipsis and add accessible horizontal chip scrolling, visible focus, selected outcome/tab treatment, non-overlapping tablet layout, high-zoom wrapping, and reduced-motion-safe anchor behavior.
- **Read-only verification target:** `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source/package.json`
  - Use existing `npm test`, `npm run dev`, `npm run build`, and `npm run preview`; do not add dependencies or scripts unless a test proves an existing command cannot run.
- **Regenerated only after verification, if required by the spec:** `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Surge_Ready`
  - Replace with an exact copy of the verified `dist/`; never hand-edit generated output.
- **Graph maintenance command only:** repository root `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source`
  - Attempt the project-required rebuild command after source edits; document the known module-unavailable result without changing unrelated files.

No commit step is included. The requested source parent is not a Git repository, and the user did not request a commit; do not run Git commands.

## TDD execution rules

Every code change below follows RED → GREEN. Run the focused test immediately after writing it and record the expected failure; then write only the minimum implementation needed, rerun the focused test, and finally run the complete suite before moving on. All commands are run from `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source`.

---

### Task 1: Establish the deterministic outcome data contract

**Files:**
- Modify: `src/CodeDreamersLanding.tsx:12-20, product records in the existing families constant`
- Test: `src/CodeDreamersLanding.test.ts`

- [x] **Step 1: Write the failing outcome-contract test**

Add this type and test below the existing `ProductUnderContract` type and before the existing `describe` block:

```ts
type ProductWithOutcomes = ProductUnderContract & { outcomeIds?: unknown };

const expectedOutcomeIdsByCode: Record<string, string[]> = {
  P01: ["captar"], P02: ["captar"], P03: ["captar"], P04: ["captar"],
  P05: ["captar"], P06: ["captar"], P07: ["captar"], P08: ["captar"],
  P09: ["vender"], P10: ["vender"], P11: ["vender"], P12: ["vender"],
  P13: ["vender"], P14: ["vender"], P15: ["vender"], P16: ["vender"],
  P17: ["operar"], P18: ["operar"], P19: ["operar"], P20: ["operar"],
  P21: ["operar"], P22: ["operar"], P23: ["operar"], P24: ["operar"],
  P25: ["operar"], P26: ["operar"], P27: ["operar"], P28: ["operar"],
  P29: ["decidir"], P30: ["decidir"], P31: ["decidir"], P32: ["decidir"],
  P33: ["decidir"], P34: ["decidir"], P35: ["decidir"], P36: ["decidir"],
  P37: ["escalar"], P38: ["escalar"], P39: ["escalar"], P40: ["escalar"],
  P41: ["escalar"], P42: ["escalar"], P43: ["escalar"], P44: ["escalar"],
  P45: ["escalar"], P46: ["escalar"], P47: ["escalar"], P48: ["escalar"],
  P49: ["escalar"], P50: ["escalar"], P51: ["escalar"], P52: ["escalar"],
  P53: ["escalar"], P54: ["escalar"],
};

it("assigns every product to its deterministic business outcome", () => {
  const products = families.flatMap(
    (family) => family.products as ProductWithOutcomes[],
  );

  expect(products).toHaveLength(54);
  for (const product of products) {
    expect(product.outcomeIds, product.code).toEqual(
      expectedOutcomeIdsByCode[product.code],
    );
    expect((product.outcomeIds as unknown[]).length, product.code).toBeGreaterThan(0);
  }
});
```

- [x] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- src/CodeDreamersLanding.test.ts -t "deterministic business outcome"
```

Expected: FAIL because current products have no `outcomeIds` property; Vitest reports the first product mismatch as `expected undefined to deeply equal ["captar"]`.

- [x] **Step 3: Add the typed field and the explicit product associations**

Change the type at `src/CodeDreamersLanding.tsx:12-20` to:

```tsx
type ProductDetails = {
  description: string;
  includes: [string, string, string];
};

type Product = ProductDetails & {
  code: string;
  name: string;
  outcomeIds: string[];
};
```

Add `outcomeIds: ["captar"]` to P01–P08, `outcomeIds: ["vender"]` to P09–P16, `outcomeIds: ["operar"]` to P17–P28, `outcomeIds: ["decidir"]` to P29–P36, and `outcomeIds: ["escalar"]` to P37–P54. Keep the field immediately after `includes` in every record. Do not derive membership from display ranges. The `sectoriales` family remains contextual within `escalar`; it is not an outcome.

- [x] **Step 4: Run the focused test and verify GREEN**

Run the same command. Expected: PASS; the outcome-contract test and the existing catalog identity test both pass.

---

### Task 2: Rewrite the complete P01–P54 catalog copy without adding capabilities

**Files:**
- Modify: `src/CodeDreamersLanding.tsx:product records in the existing families constant`
- Test: `src/CodeDreamersLanding.test.ts`

- [x] **Step 1: Write the failing copy-shape test**

Add an explicit expected map for the approved copy and test the complete contract:

```ts
type ApprovedCopy = {
  description: string;
  includes: [string, string, string];
};

const expectedCopyByCode: Record<string, ApprovedCopy> = {
  P01: { description: "Landing page — presenta una propuesta concreta — convierte atención en una primera acción.", includes: ["Arquitectura de mensaje", "Diseño responsive", "Formulario principal"] },
  P02: { description: "Sitio web corporativo — explica la propuesta y la organización — facilita una relación institucional clara.", includes: ["Mapa de contenidos", "Plantillas de páginas", "Gestión de contenidos"] },
  P03: { description: "Micrositio de producto o campaña — comunica una oferta específica — concentra la atención del lanzamiento.", includes: ["Narrativa de campaña", "Secciones modulares", "Medición de interacciones"] },
  P04: { description: "Portal de contenidos y SEO — publica y estructura conocimiento — amplía el descubrimiento orgánico.", includes: ["Taxonomía editorial", "Plantillas SEO", "Buscador y categorías"] },
  P05: { description: "Web de reservas y citas — gestiona disponibilidad y turnos — reduce fricción antes de la atención.", includes: ["Agenda configurable", "Flujo de reserva", "Confirmaciones y recordatorios"] },
  P06: { description: "Academia online / LMS — ordena cursos y avances — hace visible la progresión del aprendizaje.", includes: ["Catálogo de formación", "Lecciones y evaluaciones", "Seguimiento de progreso"] },
  P07: { description: "Membresía y comunidad digital — reúne miembros, recursos y conversaciones — sostiene una relación recurrente.", includes: ["Perfiles y accesos", "Contenido exclusivo", "Espacios de comunidad"] },
  P08: { description: "Configurador, calculadora o simulador — convierte variables en una respuesta — ayuda a decidir con contexto.", includes: ["Reglas de cálculo", "Interfaz paso a paso", "Resultado personalizado"] },
  P09: { description: "Funnel de ventas multicanal — ordena captación y seguimiento — convierte oportunidades en conversaciones comerciales.", includes: ["Etapas del funnel", "Captura multicanal", "Seguimiento de oportunidades"] },
  P10: { description: "CRM a medida — centraliza clientes e interacciones — mejora la continuidad comercial.", includes: ["Modelo de clientes", "Pipeline comercial", "Registro de interacciones"] },
  P11: { description: "Automatización de marketing — coordina mensajes según datos — mantiene activas las oportunidades relevantes.", includes: ["Segmentos y reglas", "Secuencias de mensajes", "Panel de resultados"] },
  P12: { description: "E-commerce B2C — presenta catálogo y cobra pedidos — acompaña la compra minorista de principio a fin.", includes: ["Catálogo y variantes", "Carrito y checkout", "Gestión de pedidos"] },
  P13: { description: "Comercio digital B2B — gestiona pedidos con condiciones empresariales — ordena la venta por volumen.", includes: ["Cuentas corporativas", "Listas de precios", "Pedidos por volumen"] },
  P14: { description: "Marketplace — conecta vendedores y compradores — amplía la oferta disponible en un mismo canal.", includes: ["Alta de vendedores", "Catálogo multioferta", "Comisiones y liquidaciones"] },
  P15: { description: "Plataforma de suscripciones — administra planes y recurrencia — hace sostenible la relación con suscriptores.", includes: ["Planes y periodicidades", "Cobros recurrentes", "Autogestión de suscriptores"] },
  P16: { description: "Fidelización y referidos — registra beneficios e invitaciones — aumenta la recurrencia de clientes.", includes: ["Reglas de puntos", "Catálogo de beneficios", "Códigos de referido"] },
  P17: { description: "Aplicación web a medida — reúne procesos y registros propios — convierte una necesidad operativa en una herramienta usable.", includes: ["Flujos de trabajo", "Roles y permisos", "Paneles operativos"] },
  P18: { description: "Aplicación móvil iOS / Android — ejecuta tareas desde el teléfono — acerca la operación al momento de trabajo.", includes: ["Interfaz móvil nativa", "Notificaciones", "Publicación en tiendas"] },
  P19: { description: "Progressive Web App (PWA) — ofrece una aplicación instalable — mantiene el acceso ágil en condiciones variables.", includes: ["Instalación desde navegador", "Caché de recursos", "Experiencia adaptable"] },
  P20: { description: "Producto SaaS — entrega una capacidad digital multiusuario — permite operar un servicio con continuidad.", includes: ["Espacios por cliente", "Gestión de planes", "Administración del producto"] },
  P21: { description: "ERP modular — conecta procesos y registros internos — da una visión operativa compartida.", includes: ["Módulos funcionales", "Maestros compartidos", "Reportes operativos"] },
  P22: { description: "Backoffice operativo — ejecuta tareas y mantiene datos — da control al trabajo interno cotidiano.", includes: ["Bandejas de trabajo", "Edición controlada", "Historial de cambios"] },
  P23: { description: "Portal de cliente — ofrece autoservicio sobre la relación — reduce consultas operativas repetitivas.", includes: ["Acceso seguro", "Estado de solicitudes", "Gestión de datos"] },
  P24: { description: "Portal de proveedores o partners — coordina información con terceros — ordena solicitudes y entregas compartidas.", includes: ["Registro de organizaciones", "Intercambio documental", "Seguimiento de gestiones"] },
  P25: { description: "Gestión de casos o expedientes — reúne actuaciones y evidencias — mantiene cada caso trazable.", includes: ["Ficha de expediente", "Estados y asignaciones", "Cronología documental"] },
  P26: { description: "Gestión de proyectos y recursos — planifica trabajo y capacidad — hace visibles avances e hitos.", includes: ["Plan de tareas", "Asignación de recursos", "Seguimiento de hitos"] },
  P27: { description: "Field service y trabajo en campo — coordina órdenes fuera de oficina — conecta actividad con operación central.", includes: ["Agenda de visitas", "Partes de trabajo", "Seguimiento de órdenes"] },
  P28: { description: "Help desk y gestión de tickets — organiza solicitudes y estados — mejora la continuidad del soporte.", includes: ["Cola de tickets", "SLA y prioridades", "Historial de atención"] },
  P29: { description: "Integración de sistemas y APIs — intercambia información entre aplicaciones — elimina duplicación entre herramientas.", includes: ["Mapeo de datos", "Conectores y endpoints", "Registro de sincronizaciones"] },
  P30: { description: "Automatización de procesos — encadena reglas, tareas y sistemas — hace repetible el trabajo operativo.", includes: ["Modelado del flujo", "Reglas y disparadores", "Gestión de excepciones"] },
  P31: { description: "Automatización documental y aprobaciones — controla revisión y archivo — conserva trazabilidad de decisiones.", includes: ["Plantillas documentales", "Rutas de aprobación", "Versionado y auditoría"] },
  P32: { description: "Business Intelligence y dashboards — reúne indicadores del negocio — acelera la lectura para decidir.", includes: ["Modelo de métricas", "Visualizaciones interactivas", "Filtros y exportación"] },
  P33: { description: "Plataforma de datos — ingiere, transforma y sirve información — habilita usos compartidos sobre una base común.", includes: ["Pipelines de ingesta", "Capas de transformación", "Acceso a conjuntos de datos"] },
  P34: { description: "Calidad y gobierno de datos — define reglas y responsables — aumenta la confianza en la información.", includes: ["Catálogo de datos", "Reglas de calidad", "Roles y linaje"] },
  P35: { description: "Alertas y monitorización operativa — detecta eventos relevantes — permite reaccionar antes de que escale la fricción.", includes: ["Fuentes monitorizadas", "Umbrales y reglas", "Canales de alerta"] },
  P36: { description: "Búsqueda empresarial y base de conocimiento — indexa contenido interno — acorta el camino hacia respuestas confiables.", includes: ["Indexación de fuentes", "Buscador con filtros", "Gestión de conocimiento"] },
  P37: { description: "Chatbot inteligente — responde consultas con fuentes definidas — ofrece orientación inmediata a cada visitante.", includes: ["Diseño de conversaciones", "Fuentes de respuesta", "Derivación de consultas"] },
  P38: { description: "Asistente transaccional — guía conversaciones y acciones autorizadas — reduce pasos en operaciones conectadas.", includes: ["Intenciones y flujos", "Integración de acciones", "Confirmaciones de usuario"] },
  P39: { description: "Copiloto de conocimiento interno — consulta procedimientos y documentos — acerca el saber organizacional al trabajo diario.", includes: ["Conexión de fuentes", "Respuestas con referencias", "Control de accesos"] },
  P40: { description: "Copiloto comercial y de servicio — prepara respuestas y contexto — ayuda a orientar la próxima acción con clientes.", includes: ["Resumen de interacciones", "Borradores asistidos", "Sugerencias de seguimiento"] },
  P41: { description: "Inteligencia documental — extrae y clasifica información — acelera la revisión de documentos.", includes: ["Clasificación documental", "Extracción de campos", "Revisión humana"] },
  P42: { description: "Agentes de IA — coordinan herramientas en límites definidos — completan tareas con trazas de ejecución.", includes: ["Objetivos y límites", "Herramientas autorizadas", "Trazas de ejecución"] },
  P43: { description: "Agentes de voz — atienden solicitudes mediante audio — operan flujos sin exigir una interfaz visual.", includes: ["Guion conversacional", "Reconocimiento y síntesis", "Integración telefónica"] },
  P44: { description: "Predicción y recomendación — estima resultados y prioriza opciones — convierte datos disponibles en orientación accionable.", includes: ["Preparación de variables", "Modelo y evaluación", "Predicciones o recomendaciones integradas"] },
  P45: { description: "Legal y compliance — organiza obligaciones y evidencias — hace comprobable el cumplimiento.", includes: ["Matriz de obligaciones", "Gestión de asuntos", "Repositorio de evidencias"] },
  P46: { description: "Salud, clínicas y bienestar — coordina atención e información — ordena la experiencia de pacientes y equipos.", includes: ["Agenda asistencial", "Registro de atención", "Portal de pacientes"] },
  P47: { description: "Inmobiliario, arquitectura y construcción — gestiona activos y proyectos — conecta obra con documentación técnica.", includes: ["Inventario de activos", "Seguimiento de obra", "Documentación técnica"] },
  P48: { description: "Retail y marcas de consumo — conecta catálogo y operación comercial — mantiene una visión coherente de la marca.", includes: ["Catálogo omnicanal", "Gestión de promociones", "Panel comercial"] },
  P49: { description: "Educación y servicios profesionales — administra oferta y participantes — ordena una prestación basada en conocimiento.", includes: ["Catálogo de programas", "Gestión de participantes o clientes", "Prestación y seguimiento del servicio"] },
  P50: { description: "Logística y transporte — coordina envíos y recorridos — hace visible el estado de la operación.", includes: ["Planificación de despachos", "Seguimiento de estados", "Gestión de incidencias"] },
  P51: { description: "Finanzas y seguros — digitaliza solicitudes y evaluaciones de productos financieros o de seguros — ordena la gestión de servicios financieros.", includes: ["Flujos de solicitud", "Reglas de evaluación", "Portal de operaciones"] },
  P52: { description: "Turismo y hospitality — coordina oferta y reservas — mejora la continuidad de la experiencia huésped.", includes: ["Inventario y tarifas", "Reservas de servicios", "Gestión de huéspedes"] },
  P53: { description: "Industria y mantenimiento — planifica intervenciones sobre equipos — reduce fricción en la continuidad operativa.", includes: ["Inventario de equipos", "Órdenes de mantenimiento", "Historial de intervenciones"] },
  P54: { description: "Sector público y organizaciones — gestiona trámites y programas — hace más clara la atención a organizaciones, usuarios y ciudadanía.", includes: ["Catálogo de trámites", "Gestión de solicitudes", "Seguimiento de usuarios o ciudadanía"] },
};

it("preserves the approved copy contract for every product", () => {
  const products = families.flatMap((family) => family.products as ProductUnderContract[]);
  expect(Object.keys(expectedCopyByCode)).toHaveLength(54);
  expect(products.map((product) => product.code)).toEqual(
    Object.keys(expectedCopyByCode),
  );

  for (const product of products) {
    const expected = expectedCopyByCode[product.code];
    expect(product.description, product.code).toBe(expected.description);
    expect(product.includes, product.code).toEqual(expected.includes);
    expect(product.description.trim(), product.code).not.toBe("");
    expect(product.includes, product.code).toHaveLength(3);
    expect(product.includes.every((item) => item.trim() !== ""), product.code).toBe(true);
    expect(new Set(product.includes).size, product.code).toBe(3);
  }
});
```

The expected map is a complete 54-entry literal with explicit P01–P54 keys and exact descriptions/includes. It duplicates the approved copy independently so the test locks identity/order and exact editorial copy; it does not derive values from production data. Every entry preserves the product’s existing capabilities.

- [x] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- src/CodeDreamersLanding.test.ts -t "approved copy contract"
```

Expected: FAIL because the existing descriptions/includes differ from the approved exact map; the first mismatch identifies the current product copy.

- [x] **Step 3: Replace the 54 descriptions/includes with this complete copy**

Add the complete map as valid TypeScript immediately before the existing `families` constant, then replace each product’s current `description` and `includes` fields with `...rewrittenProductCopy.P01` through `...rewrittenProductCopy.P54` respectively. Keep each existing `code`, `name`, and the `outcomeIds` field from Task 1 in the product record. This makes the following block executable source rather than prose:

```ts
const rewrittenProductCopy: Record<string, ProductDetails> = {
P01: { description: "Landing page — presenta una propuesta concreta — convierte atención en una primera acción.", includes: ["Arquitectura de mensaje", "Diseño responsive", "Formulario principal"] },
P02: { description: "Sitio web corporativo — explica la propuesta y la organización — facilita una relación institucional clara.", includes: ["Mapa de contenidos", "Plantillas de páginas", "Gestión de contenidos"] },
P03: { description: "Micrositio de producto o campaña — comunica una oferta específica — concentra la atención del lanzamiento.", includes: ["Narrativa de campaña", "Secciones modulares", "Medición de interacciones"] },
P04: { description: "Portal de contenidos y SEO — publica y estructura conocimiento — amplía el descubrimiento orgánico.", includes: ["Taxonomía editorial", "Plantillas SEO", "Buscador y categorías"] },
P05: { description: "Web de reservas y citas — gestiona disponibilidad y turnos — reduce fricción antes de la atención.", includes: ["Agenda configurable", "Flujo de reserva", "Confirmaciones y recordatorios"] },
P06: { description: "Academia online / LMS — ordena cursos y avances — hace visible la progresión del aprendizaje.", includes: ["Catálogo de formación", "Lecciones y evaluaciones", "Seguimiento de progreso"] },
P07: { description: "Membresía y comunidad digital — reúne miembros, recursos y conversaciones — sostiene una relación recurrente.", includes: ["Perfiles y accesos", "Contenido exclusivo", "Espacios de comunidad"] },
P08: { description: "Configurador, calculadora o simulador — convierte variables en una respuesta — ayuda a decidir con contexto.", includes: ["Reglas de cálculo", "Interfaz paso a paso", "Resultado personalizado"] },
P09: { description: "Funnel de ventas multicanal — ordena captación y seguimiento — convierte oportunidades en conversaciones comerciales.", includes: ["Etapas del funnel", "Captura multicanal", "Seguimiento de oportunidades"] },
P10: { description: "CRM a medida — centraliza clientes e interacciones — mejora la continuidad comercial.", includes: ["Modelo de clientes", "Pipeline comercial", "Registro de interacciones"] },
P11: { description: "Automatización de marketing — coordina mensajes según datos — mantiene activas las oportunidades relevantes.", includes: ["Segmentos y reglas", "Secuencias de mensajes", "Panel de resultados"] },
P12: { description: "E-commerce B2C — presenta catálogo y cobra pedidos — acompaña la compra minorista de principio a fin.", includes: ["Catálogo y variantes", "Carrito y checkout", "Gestión de pedidos"] },
P13: { description: "Comercio digital B2B — gestiona pedidos con condiciones empresariales — ordena la venta por volumen.", includes: ["Cuentas corporativas", "Listas de precios", "Pedidos por volumen"] },
P14: { description: "Marketplace — conecta vendedores y compradores — amplía la oferta disponible en un mismo canal.", includes: ["Alta de vendedores", "Catálogo multioferta", "Comisiones y liquidaciones"] },
P15: { description: "Plataforma de suscripciones — administra planes y recurrencia — hace sostenible la relación con suscriptores.", includes: ["Planes y periodicidades", "Cobros recurrentes", "Autogestión de suscriptores"] },
P16: { description: "Fidelización y referidos — registra beneficios e invitaciones — aumenta la recurrencia de clientes.", includes: ["Reglas de puntos", "Catálogo de beneficios", "Códigos de referido"] },
P17: { description: "Aplicación web a medida — reúne procesos y registros propios — convierte una necesidad operativa en una herramienta usable.", includes: ["Flujos de trabajo", "Roles y permisos", "Paneles operativos"] },
P18: { description: "Aplicación móvil iOS / Android — ejecuta tareas desde el teléfono — acerca la operación al momento de trabajo.", includes: ["Interfaz móvil nativa", "Notificaciones", "Publicación en tiendas"] },
P19: { description: "Progressive Web App (PWA) — ofrece una aplicación instalable — mantiene el acceso ágil en condiciones variables.", includes: ["Instalación desde navegador", "Caché de recursos", "Experiencia adaptable"] },
P20: { description: "Producto SaaS — entrega una capacidad digital multiusuario — permite operar un servicio con continuidad.", includes: ["Espacios por cliente", "Gestión de planes", "Administración del producto"] },
P21: { description: "ERP modular — conecta procesos y registros internos — da una visión operativa compartida.", includes: ["Módulos funcionales", "Maestros compartidos", "Reportes operativos"] },
P22: { description: "Backoffice operativo — ejecuta tareas y mantiene datos — da control al trabajo interno cotidiano.", includes: ["Bandejas de trabajo", "Edición controlada", "Historial de cambios"] },
P23: { description: "Portal de cliente — ofrece autoservicio sobre la relación — reduce consultas operativas repetitivas.", includes: ["Acceso seguro", "Estado de solicitudes", "Gestión de datos"] },
P24: { description: "Portal de proveedores o partners — coordina información con terceros — ordena solicitudes y entregas compartidas.", includes: ["Registro de organizaciones", "Intercambio documental", "Seguimiento de gestiones"] },
P25: { description: "Gestión de casos o expedientes — reúne actuaciones y evidencias — mantiene cada caso trazable.", includes: ["Ficha de expediente", "Estados y asignaciones", "Cronología documental"] },
P26: { description: "Gestión de proyectos y recursos — planifica trabajo y capacidad — hace visibles avances e hitos.", includes: ["Plan de tareas", "Asignación de recursos", "Seguimiento de hitos"] },
P27: { description: "Field service y trabajo en campo — coordina órdenes fuera de oficina — conecta actividad con operación central.", includes: ["Agenda de visitas", "Partes de trabajo", "Seguimiento de órdenes"] },
P28: { description: "Help desk y gestión de tickets — organiza solicitudes y estados — mejora la continuidad del soporte.", includes: ["Cola de tickets", "SLA y prioridades", "Historial de atención"] },
P29: { description: "Integración de sistemas y APIs — intercambia información entre aplicaciones — elimina duplicación entre herramientas.", includes: ["Mapeo de datos", "Conectores y endpoints", "Registro de sincronizaciones"] },
P30: { description: "Automatización de procesos — encadena reglas, tareas y sistemas — hace repetible el trabajo operativo.", includes: ["Modelado del flujo", "Reglas y disparadores", "Gestión de excepciones"] },
P31: { description: "Automatización documental y aprobaciones — controla revisión y archivo — conserva trazabilidad de decisiones.", includes: ["Plantillas documentales", "Rutas de aprobación", "Versionado y auditoría"] },
P32: { description: "Business Intelligence y dashboards — reúne indicadores del negocio — acelera la lectura para decidir.", includes: ["Modelo de métricas", "Visualizaciones interactivas", "Filtros y exportación"] },
P33: { description: "Plataforma de datos — ingiere, transforma y sirve información — habilita usos compartidos sobre una base común.", includes: ["Pipelines de ingesta", "Capas de transformación", "Acceso a conjuntos de datos"] },
P34: { description: "Calidad y gobierno de datos — define reglas y responsables — aumenta la confianza en la información.", includes: ["Catálogo de datos", "Reglas de calidad", "Roles y linaje"] },
P35: { description: "Alertas y monitorización operativa — detecta eventos relevantes — permite reaccionar antes de que escale la fricción.", includes: ["Fuentes monitorizadas", "Umbrales y reglas", "Canales de alerta"] },
P36: { description: "Búsqueda empresarial y base de conocimiento — indexa contenido interno — acorta el camino hacia respuestas confiables.", includes: ["Indexación de fuentes", "Buscador con filtros", "Gestión de conocimiento"] },
P37: { description: "Chatbot inteligente — responde consultas con fuentes definidas — ofrece orientación inmediata a cada visitante.", includes: ["Diseño de conversaciones", "Fuentes de respuesta", "Derivación de consultas"] },
P38: { description: "Asistente transaccional — guía conversaciones y acciones autorizadas — reduce pasos en operaciones conectadas.", includes: ["Intenciones y flujos", "Integración de acciones", "Confirmaciones de usuario"] },
P39: { description: "Copiloto de conocimiento interno — consulta procedimientos y documentos — acerca el saber organizacional al trabajo diario.", includes: ["Conexión de fuentes", "Respuestas con referencias", "Control de accesos"] },
P40: { description: "Copiloto comercial y de servicio — prepara respuestas y contexto — ayuda a orientar la próxima acción con clientes.", includes: ["Resumen de interacciones", "Borradores asistidos", "Sugerencias de seguimiento"] },
P41: { description: "Inteligencia documental — extrae y clasifica información — acelera la revisión de documentos.", includes: ["Clasificación documental", "Extracción de campos", "Revisión humana"] },
P42: { description: "Agentes de IA — coordinan herramientas en límites definidos — completan tareas con trazas de ejecución.", includes: ["Objetivos y límites", "Herramientas autorizadas", "Trazas de ejecución"] },
P43: { description: "Agentes de voz — atienden solicitudes mediante audio — operan flujos sin exigir una interfaz visual.", includes: ["Guion conversacional", "Reconocimiento y síntesis", "Integración telefónica"] },
P44: { description: "Predicción y recomendación — estima resultados y prioriza opciones — convierte datos disponibles en orientación accionable.", includes: ["Preparación de variables", "Modelo y evaluación", "Predicciones o recomendaciones integradas"] },
P45: { description: "Legal y compliance — organiza obligaciones y evidencias — hace comprobable el cumplimiento.", includes: ["Matriz de obligaciones", "Gestión de asuntos", "Repositorio de evidencias"] },
P46: { description: "Salud, clínicas y bienestar — coordina atención e información — ordena la experiencia de pacientes y equipos.", includes: ["Agenda asistencial", "Registro de atención", "Portal de pacientes"] },
P47: { description: "Inmobiliario, arquitectura y construcción — gestiona activos y proyectos — conecta obra con documentación técnica.", includes: ["Inventario de activos", "Seguimiento de obra", "Documentación técnica"] },
P48: { description: "Retail y marcas de consumo — conecta catálogo y operación comercial — mantiene una visión coherente de la marca.", includes: ["Catálogo omnicanal", "Gestión de promociones", "Panel comercial"] },
P49: { description: "Educación y servicios profesionales — administra oferta y participantes — ordena una prestación basada en conocimiento.", includes: ["Catálogo de programas", "Gestión de participantes o clientes", "Prestación y seguimiento del servicio"] },
P50: { description: "Logística y transporte — coordina envíos y recorridos — hace visible el estado de la operación.", includes: ["Planificación de despachos", "Seguimiento de estados", "Gestión de incidencias"] },
P51: { description: "Finanzas y seguros — digitaliza solicitudes y evaluaciones de productos financieros o de seguros — ordena la gestión de servicios financieros.", includes: ["Flujos de solicitud", "Reglas de evaluación", "Portal de operaciones"] },
P52: { description: "Turismo y hospitality — coordina oferta y reservas — mejora la continuidad de la experiencia huésped.", includes: ["Inventario y tarifas", "Reservas de servicios", "Gestión de huéspedes"] },
P53: { description: "Industria y mantenimiento — planifica intervenciones sobre equipos — reduce fricción en la continuidad operativa.", includes: ["Inventario de equipos", "Órdenes de mantenimiento", "Historial de intervenciones"] },
P54: { description: "Sector público y organizaciones — gestiona trámites y programas — hace más clara la atención a organizaciones, usuarios y ciudadanía.", includes: ["Catálogo de trámites", "Gestión de solicitudes", "Seguimiento de usuarios o ciudadanía"] },
};
```

For each existing product object, spread the matching entry before its unchanged identity fields, for example `...rewrittenProductCopy.P01, code: "P01", name: "Landing page de conversión", outcomeIds: ["captar"]`. Repeat that explicit pattern for P01 through P54; do not add a second product object or alter names. The 54 descriptions use exactly `artifact — primary job — differentiating outcome`; each includes array has exactly three existing-capability noun phrases.

- [x] **Step 4: Run the focused copy test and verify GREEN**

Run:

```bash
npm test -- src/CodeDreamersLanding.test.ts -t "approved copy contract"
```

Expected: PASS. Then run `npm test -- src/CodeDreamersLanding.test.ts`; expected: all existing and new catalog-contract tests pass.

---

### Task 3: Add pure outcome/family/search composition helpers

**Files:**
- Modify: `src/CodeDreamersLanding.tsx:12-20 and immediately after the families constant`
- Test: `src/CodeDreamersLanding.test.ts`

- [x] **Step 1: Write RED tests for composition and search scope**

Extend the existing import to include the helpers, then add these tests:

```ts
import {
  expect,
  it,
  families,
  filterFamilies,
  getSearchText,
} from "./CodeDreamersLanding";

type TestProduct = ProductUnderContract & { outcomeIds: string[] };

it("composes outcome, family, and search without resetting earlier scope", () => {
  const all = filterFamilies(families, null, "all", "");
  expect(all.flatMap((family) => family.products)).toHaveLength(54);

  const outcome = filterFamilies(families, "operar", "all", "");
  expect(outcome.flatMap((family) => family.products).map((product) => product.code)).toEqual(
    Array.from({ length: 12 }, (_, index) => `P${String(index + 17).padStart(2, "0")}`),
  );

  const family = filterFamilies(families, "operar", "operaciones", "");
  expect(family.flatMap((item) => item.products).map((product) => product.code)).toEqual(
    Array.from({ length: 12 }, (_, index) => `P${String(index + 17).padStart(2, "0")}`),
  );

  const searched = filterFamilies(families, "operar", "all", "tickets");
  expect(searched.flatMap((item) => item.products).map((product) => product.code)).toEqual(["P28"]);
});

it("searches only code, name, description, and includes", () => {
  const product = families.flatMap((family) => family.products as TestProduct[])[0];
  expect(getSearchText(product)).toContain(product.code.toLocaleLowerCase("es"));
  expect(getSearchText(product)).toContain(product.name.toLocaleLowerCase("es"));
  expect(getSearchText(product)).toContain((product.description as string).toLocaleLowerCase("es"));
  expect(getSearchText(product)).toContain((product.includes as string[])[0].toLocaleLowerCase("es"));
  expect(getSearchText(product)).not.toContain("captar");
});

it("keeps scoped no-result, restoration, and no-contact contracts", () => {
  expect(filterFamilies(families, "captar", "all", "P54")).toEqual([]);
  const selected = filterFamilies(families, "decidir", "all", "dashboard");
  const restored = filterFamilies(families, "decidir", "all", "");
  expect(selected.flatMap((family) => family.products).map((product) => product.code)).toEqual(["P32"]);
  expect(restored.flatMap((family) => family.products)).toHaveLength(8);
  for (const product of families.flatMap((family) => family.products as ProductUnderContract[])) {
    expect(product.description).not.toMatch(/mailto:|contacto|hablemos/i);
    expect(product.includes).toHaveLength(3);
  }
});
```

- [x] **Step 2: Run the focused tests and verify RED**

Run:

```bash
npm test -- src/CodeDreamersLanding.test.ts -t "composes outcome|searches only|keeps scoped no-result"
```

Expected: FAIL with the named exports `filterFamilies` and `getSearchText` missing.

- [x] **Step 3: Add the minimal typed pure helpers**

Immediately after the family data, add:

```tsx
export const getSearchText = (product: Product): string =>
  [product.code, product.name, product.description, ...product.includes]
    .join(" ")
    .toLocaleLowerCase("es");

export const filterFamilies = (
  sourceFamilies: ProductFamily[],
  activeOutcome: string | null,
  activeFamily: string,
  query: string,
): ProductFamily[] => {
  const normalized = query.trim().toLocaleLowerCase("es");

  return sourceFamilies
    .filter((family) => activeFamily === "all" || family.id === activeFamily)
    .map((family) => ({
      ...family,
      products: family.products.filter((product) => {
        const matchesOutcome =
          activeOutcome === null || product.outcomeIds.includes(activeOutcome);
        const matchesSearch = !normalized || getSearchText(product).includes(normalized);
        return matchesOutcome && matchesSearch;
      }),
    }))
    .filter((family) => family.products.length > 0);
};
```

Define `ProductFamily` before the helper if it is currently declared later; keep its existing fields and use `products: Product[]`. Do not include sectors, promises, or arbitrary rendered text in `getSearchText`.

- [x] **Step 4: Run focused tests and verify GREEN**

Run the same command. Expected: PASS. Run `npm test -- src/CodeDreamersLanding.test.ts`; expected: all catalog tests pass.

---

### Task 4: Wire the existing outcome navigator into the catalog

**Files:**
- Modify: `src/CodeDreamersLanding.tsx:existing OutcomeNavigator, Portfolio, and root composition`
- Test: `src/CodeDreamersLanding.test.ts`

- [x] **Step 1: Write the failing callback-wiring contract**

Add the Node import with the existing test imports, then add the source contract:

```ts
import { readFileSync } from "node:fs";

it("wires the existing solutions link to the selected outcome", () => {
  const source = readFileSync(
    new URL("./CodeDreamersLanding.tsx", import.meta.url),
    "utf8",
  );

  expect(source).toContain(
    "onClick={() => onSelectOutcome(activeOutcome.id)}",
  );
  expect(source).toContain('href="#cartera"');
  expect(source).not.toContain("scrollIntoView");
});
```

This test is intentionally limited to wiring that the pure filtering tests cannot observe. The five existing outcome tabs remain the preview controls.

- [x] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- src/CodeDreamersLanding.test.ts -t "wires the existing solutions link"
```

Expected: FAIL because the existing `Ver soluciones` link has no `onSelectOutcome(activeOutcome.id)` handler.

- [x] **Step 3: Add the callback without replacing existing markup**

Change only the existing navigator signature:

```tsx
function OutcomeNavigator({
  onSelectOutcome,
}: {
  onSelectOutcome: (outcomeId: string) => void;
}) {
```

Add the callback to the existing link while preserving its current children:

```tsx
<a
  href="#cartera"
  onClick={() => onSelectOutcome(activeOutcome.id)}
>
  Ver soluciones
  <Arrow />
</a>
```

Change the existing portfolio signature and replace only its current `visibleFamilies` memo:

```tsx
export function Portfolio({
  activeOutcome,
}: {
  activeOutcome: string | null;
}) {
  const [activeFamily, setActiveFamily] = useState("all");
  const [query, setQuery] = useState("");

  const visibleFamilies = useMemo(
    () => filterFamilies(families, activeOutcome, activeFamily, query),
    [activeOutcome, activeFamily, query],
  );
```

Inside the existing root component, add the state beside its other `useState` calls:

```tsx
const [activeOutcome, setActiveOutcome] = useState<string | null>(null);
```

Replace only the two existing component invocations:

```tsx
<OutcomeNavigator onSelectOutcome={setActiveOutcome} />
<Portfolio activeOutcome={activeOutcome} />
```

Do not replace either component body. Outcome-tab selection continues to update only the preview. Clicking `Ver soluciones` applies the previewed outcome and uses the existing native `#cartera` anchor. Family and query changes must not clear `activeOutcome`.

- [x] **Step 4: Run the focused test and verify GREEN**

Run the focused command again. Expected: PASS. Then run `npm test`; expected: all catalog tests pass.

---

### Task 5: Strengthen the rendered accessibility contract

**Files:**
- Modify: `src/CodeDreamersLanding.tsx:existing portfolio search and result count`
- Test: `src/CodeDreamersLanding.test.ts`

- [x] **Step 1: Write the failing SSR contract**

Add the existing React/ReactDOM dependencies to the test imports, then render the exported portfolio:

```ts
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

it("renders the accessible result and filter contract", () => {
  const html = renderToStaticMarkup(
    createElement(Portfolio, { activeOutcome: "captar" }),
  );

  expect(html).toContain('role="group"');
  expect(html).toContain('aria-label="Filtrar por familia"');
  expect(html).toContain('aria-pressed="true"');
  expect(html).toContain('type="button"');
  expect(html).toContain('aria-live="polite"');
  expect(html).toContain('aria-atomic="true"');
  expect(html).toContain('aria-label="Buscar solución"');
  expect(html).toContain("<details");
  expect(html).toContain("<summary");
});
```

- [x] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- src/CodeDreamersLanding.test.ts -t "renders the accessible result and filter contract"
```

Expected: FAIL because current rendered output lacks `aria-atomic="true"` on the result and an explicit accessible name on the search input.

- [x] **Step 3: Add only the missing attributes**

Preserve the existing toolbar, classes, active-state classes, counts, labels, inline family colors, and native disclosures. Add `aria-label` to the existing search input:

```tsx
<input
  aria-label="Buscar solución"
  type="search"
  value={query}
  onChange={(event) => setQuery(event.target.value)}
  placeholder="CRM, app, automatización..."
/>
```

Add `aria-atomic` to the existing result element without changing its class or copy:

```tsx
<p className="portfolio-result" aria-live="polite" aria-atomic="true">
  Mostrando {visibleCount} {visibleCount === 1 ? "producto" : "productos"}
</p>
```

Keep the existing family-filter `role`, button types, `aria-pressed`, native `<details>/<summary>`, and product content unchanged. Add no product contact action.

- [x] **Step 4: Run the focused test and verify GREEN**

Run the focused command again. Expected: PASS with every SSR assertion. Then run `npm test`; expected: complete suite passes.

---

### Task 6: Keep every family label readable on narrow viewports

**Files:**
- Modify: `src/styles.css:existing .family-filter button strong rule and max-width: 900px .family-filter rule`
- Test: browser QA in Task 8

- [x] **Step 1: Record the failing browser contract**

At 320 CSS pixels and 400% zoom, require every family label to remain complete, the chip row to scroll horizontally, every button to remain keyboard reachable, the existing focus outline to remain visible, and the toolbar to avoid overlap.

- [x] **Step 2: Verify current behavior is RED**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: Vite serves the page. At mobile width, the current label rule uses `overflow: hidden`, `text-overflow: ellipsis`, and `white-space: nowrap`; labels render as ambiguous fragments. Stop the server after recording the failure.

- [x] **Step 3: Remove truncation and preserve the existing grid**

Replace only the current label rule:

```css
.family-filter button strong {
  overflow: visible;
  font-size: 0.64rem;
  text-align: left;
  text-overflow: clip;
  white-space: normal;
}
```

Inside the existing `@media (max-width: 900px)` block, replace only its current `.family-filter` declaration:

```css
.family-filter {
  grid-template-columns: none;
  grid-auto-flow: column;
  grid-auto-columns: minmax(9rem, max-content);
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}
```

Do not replace `.family-filter` with flexbox. Preserve existing button layout, borders, active styles, family colors, the max-width 1180px single-column toolbar rule, the global focus-visible rule, local search/summary focus rules, and reduced-motion rules.

- [x] **Step 4: Verify CSS RED→GREEN in the browser**

Run:

```bash
npm run build
npm run preview -- --host 127.0.0.1
```

Expected: build succeeds. At mobile and 400% zoom, all labels remain complete, horizontal scrolling works without document-level overflow, buttons remain keyboard reachable, and no toolbar control overlaps.

---

### Task 7: Typecheck and verify the production build before generated output

**Files:**
- No new files.
- Read-only verification of `package.json`; implementation files from Tasks 1–6 are the only source changes.

- [x] **Step 1: Run the complete source verification command**

Run:

```bash
npx tsc --noEmit && npm test && npm run build
```

Expected: `tsc` exits 0 without diagnostics; Vitest reports all tests passing; Vite reports a successful production build and recreates `dist/`.

- [x] **Step 2: If typecheck fails, correct only the named source mismatch**

Valid corrections are limited to matching `ProductFamily`, `Product`, helper return types, callback props, and the existing root component signature. Do not suppress errors with `any`, `@ts-ignore`, or dependency changes. Rerun the exact command from Step 1 and require the same successful output.

- [x] **Step 3: Confirm generated output is not used as a substitute**

Do not copy `dist/` until Task 8 browser QA is complete. A successful build is necessary but does not prove anchor, keyboard, mobile, details, or reduced-motion behavior.

---

### Task 8: Perform desktop/tablet/mobile browser QA, including high zoom

**Files:**
- No source edits unless a QA failure identifies a specific selector or state defect; return to the relevant RED→GREEN task if so.

- [x] **Step 1: Serve the verified source build**

Run:

```bash
npm run preview -- --host 127.0.0.1
```

Expected: Vite preview prints a local URL serving the current `dist/`.

- [x] **Step 2: Verify desktop at 1440×900**

Open the preview URL and verify: outcome cards are the primary discovery controls; selecting each outcome tab changes `aria-pressed` and updates the preview; clicking the existing `Ver soluciones` link applies the selected outcome and anchors to `#cartera`; the live count becomes 8/8/12/8/18; the exact outcome product set appears; family “Todo” refines within the outcome; selecting a family keeps the outcome selected; search matches code, name, description, and each include item; unrelated visible text does not match; clearing search restores the selected outcome/family scope; each product opens independently with native `<details>`; opening details does not alter filters; no product detail contains a contact CTA.

Expected: all checks pass with no horizontal overflow or changed established typography/colors.

- [x] **Step 3: Verify tablet at 768×1024**

Expected: toolbar controls wrap without overlapping the result count, search field, catalog rows, or details; all outcome/family controls remain reachable; focus remains visible; selected states remain visually identifiable.

- [x] **Step 4: Verify mobile at 320×844 and 390×844**

Expected: chips use horizontal touch scrolling, every label remains complete (no ellipsis or clipped replacement), every chip is individually reachable by Tab, the scroll container does not trap focus, selected chips/cards remain identifiable, result count remains visible, product details are readable inline, and outcome-to-catalog anchoring does not hide the catalog heading.

- [x] **Step 5: Verify keyboard and reduced motion**

Use only keyboard navigation to focus outcome cards, family chips, search, and summaries; press Enter/Space on buttons and Enter on summaries. Expected: standard button/summary activation works and visible focus never disappears. Enable `prefers-reduced-motion: reduce`, select an outcome, and verify the anchor uses instant scrolling and no motion-heavy transition; native details still open independently.

- [x] **Step 6: Verify 400% zoom**

At desktop browser zoom 400%, expected: no critical content is hidden, controls wrap or scroll rather than truncate, search and result count remain usable, details remain readable, and no control overlap occurs. Record pass/fail for desktop, tablet, mobile, high zoom, keyboard, and reduced motion.

---

### Task 9: Regenerate the Surge-ready directory only after verified build and QA

**Files:**
- Replace only: `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Surge_Ready`

- [x] **Step 1: Stage and compare the exact verified build**

Use a sibling staging directory and verify it does not already exist:

```bash
next="/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Surge_Ready.next"
test ! -e "$next"
cp -a dist "$next"
diff -qr dist "$next"
```

The staging copy must compare cleanly. Replacing the existing publishable directory requires explicit user confirmation.

- [x] **Step 2: Swap with a timestamped backup after confirmation**

After explicit user confirmation, run this rollback-safe swap and leave the backup intact:

```bash
target="/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Surge_Ready"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup="${target}.backup.${stamp}"
failed="${target}.failed.${stamp}"
mv "$target" "$backup"
if mv "$next" "$target" && diff -qr dist "$target"; then
  printf 'Verified backup retained at %s\n' "$backup"
else
  test ! -e "$failed"
  test -e "$target" && mv "$target" "$failed"
  mv "$backup" "$target"
  exit 1
fi
```

Any failed replacement is moved aside before the original directory is restored. Never delete the backup or failed candidate automatically.

---

### Task 10: Attempt the required graph rebuild and record expected unavailable-module handling

**Files:**
- No intended file changes.

- [x] **Step 1: Run the project-required graph rebuild command**

From `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Source/CodeDreamers-360-source`, run exactly:

```bash
python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"
```

Expected: if `graphify.watch` is available, the code graph rebuild completes without a traceback. If the environment reports `ModuleNotFoundError: No module named 'graphify'`, record that expected environment blocker and do not install packages, modify graphify files, or alter implementation scope. Any other traceback is unresolved and must be reported rather than hidden.

---

### Task 11: Final self-review and completion evidence

**Files:**
- Modify only: `docs/superpowers/plans/2026-07-28-catalog-integral-polish.md` if this plan itself needs correction before handoff.

- [x] **Step 1: Run the final source checks**

Run:

```bash
npx tsc --noEmit && npm test && npm run build && diff -qr dist /home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Surge_Ready
```

Expected: all commands exit 0; no diff output; tests, typecheck, and production build are successful.

- [x] **Step 2: Perform the spec coverage matrix review**

Confirm each requirement has evidence: deterministic P01–P54 membership (Tasks 1/4), outcome-first anchor and selected state (Tasks 4/8), family secondary refinement and composed state (Tasks 3/4/8), contextual sectors (Tasks 4/8), search over code/name/description/includes only (Tasks 3/8), complete consistent copy and exactly three includes (Task 2), native independent details and no contact CTA (Tasks 5/8), live count/keyboard/focus/reduced motion (Tasks 5/6/8), desktop/tablet/mobile/400% zoom (Task 8), typecheck/test/build (Task 7), exact Surge regeneration after verification (Task 9), and graph rebuild handling (Task 10).

- [x] **Step 3: Complete the plan consistency review**

Perform a consistency review of this plan without adding a pattern-matching command. Confirm no unresolved tokens, invented symbols or dependencies, contact CTA, sector filter, Git command, or unsupported behavior claims remain. Confirm every referenced symbol is defined in the plan or already present in the named source file, all paths are absolute in the file map and exact paths in task sections, and all 54 product entries retain valid TypeScript syntax.

- [x] **Step 4: Record unresolved blockers without weakening scope**

Confirm the revised plan contains 11 tasks and 40 task checkboxes. The required-sub-skill header explains checkbox tracking but is not itself a task checkbox.

The only pre-identified acceptable blocker is `ModuleNotFoundError: No module named 'graphify'` during the required rebuild attempt. Report its exact output if encountered; do not mark source verification failed when typecheck, unit tests, build, browser QA, and exact generated-copy comparison all pass.

## Execution Results

- Source verification passed: 13/13 Vitest tests, TypeScript, and Vite build.
- Final gstack runtime smoke passed: Escalar 18, Decidir 8, reset 54, accentless P11, independent details, 320px labels/focus/no overflow, and clean console/network.
- Native reduced-motion emulation was unavailable; native anchor behavior, absence of `scrollIntoView`, and existing reduced-motion CSS were verified.
- Surge output matched exactly. Backup retained at `/home/home/workspace/knowledge/codedreamers/web2/CodeDreamers_360_Surge_Ready.backup.20260728T183559Z`.
- Graph rebuild was attempted and blocked by `ModuleNotFoundError: No module named 'graphify'`.
- Formal `gentle-ai` lifecycle status was attempted but stopped pre-mutation with `git_command_failed` because the project is not Git.
- No commit was made.