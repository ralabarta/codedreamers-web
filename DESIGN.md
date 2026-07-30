---
name: CodeDreamers 360
description: Un atlas cinético de productos conectables que convierte una cartera amplia en una ruta clara de evolución.
colors:
  night: "#071b2a"
  night-deep: "#03121e"
  night-panel: "#0b2a40"
  paper: "#f4f7fb"
  paper-deep: "#e7eef5"
  ink: "#0a2234"
  ink-soft: "#3d5a70"
  line: "#c8d6e3"
  cyan-signal: "#20cfd4"
  indigo-vector: "#5b63ff"
  magenta-commerce: "#f347a6"
  mint-flow: "#36cfaa"
  amber-intelligence: "#ffb83f"
  violet-sector: "#8857ff"
typography:
  display:
    fontFamily: "Geologica Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(3.15rem, 5.15vw, 5.75rem)"
    fontWeight: 770
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geologica Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(3rem, 5.8vw, 5.7rem)"
    fontWeight: 770
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Archivo Variable, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Azeret Mono Variable, ui-monospace, monospace"
    fontSize: "0.7rem"
    fontWeight: 650
    lineHeight: 1.5
    letterSpacing: "0.14em"
rounded:
  square: "0px"
  plate: "16px"
  pill: "999px"
spacing:
  unit: "8px"
  control: "16px"
  group: "32px"
  section: "clamp(6rem, 10vw, 10.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.cyan-signal}"
    textColor: "{colors.night}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "14px 20px"
    height: "56px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "14px 20px"
    height: "56px"
  atlas-plate:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "clamp(24px, 3vw, 48px)"
---

# Design System: CodeDreamers 360

## Overview

**Creative North Star: "El Atlas de Sistemas"**

La identidad se comporta como una cartografía técnica viva: rutas de negocio, nodos de producto y capas de capacidad se alinean, se cruzan y forman sistemas mayores. La precisión editorial de un atlas convive con la energía de un instrumento digital, manteniendo siempre una lectura comercial inmediata.

La composición es densa cuando demuestra amplitud y radicalmente clara cuando pide una decisión. El recurso distintivo es una trayectoria modular continua - heredada de las curvas y cápsulas del símbolo - que conecta navegación, catálogo, ecosistema y cierre.

**Key Characteristics:**

- Cartografía de producto, no decoración tecnológica.
- Escala tipográfica extrema frente a microetiquetas técnicas.
- Placas de información claras sobre un escenario azul noche.
- Color saturado con función semántica por familia.
- Movimiento continuo, preciso y sin rebotes.

## Colors

Estrategia de paleta completa: Noche de Sistema ocupa el escenario y Papel Frío crea placas de lectura. Los seis acentos identifican rutas y familias sin mezclarse en degradados genéricos.

### Primary

- **Noche de Sistema:** campo principal y marco de inmersión.
- **Papel Frío:** superficies de catálogo y texto de máximo contraste.

### Secondary

- **Cian Señal:** experiencia digital y acciones de descubrimiento.
- **Índigo Vector:** apps, operaciones y estados activos.
- **Magenta Comercio:** ventas, conversión y puntos de decisión.

### Tertiary

- **Menta Flujo:** datos conectados y automatización.
- **Ámbar Inteligencia:** IA aplicada y momentos de anticipación.
- **Violeta Sector:** plataformas sectoriales y expansión.

### Neutral

- **Azul Placa:** paneles oscuros secundarios.
- **Tinta Técnica:** texto sobre superficies claras.
- **Línea Niebla:** divisores y retículas sobre papel.

**The Owned Color Rule.** Cada color saturado representa una ruta o familia; nunca se usa como confeti intercambiable.

## Typography

**Display Font:** Geologica Variable
**Body Font:** Archivo Variable
**Label/Mono Font:** Azeret Mono Variable

**Character:** Geologica aporta volumen técnico y curvas tensas para mensajes de gran escala; Archivo mantiene claridad en textos comerciales y catálogo; Azeret convierte numeración, filtros y coordenadas en una capa instrumental legible.

### Hierarchy

- **Display:** mensajes de primer viewport, peso pesado y altura de línea cerrada.
- **Headline:** grandes cambios de sección y promesas de una sola idea.
- **Body:** textos comerciales y descripciones con ancho máximo de 68 caracteres.
- **Label:** coordenadas, códigos, filtros, familias y estados en mayúsculas.

**The Scale Delta Rule.** Los titulares son deliberadamente monumentales o las etiquetas deliberadamente pequeñas; se evita la escala media uniforme.

## Layout

Una retícula de doce columnas sostiene composiciones asimétricas de borde a borde. El primer viewport se organiza alrededor de una topología orbital, no de una columna de hero convencional. Los bloques densos aparecen como placas de atlas con reglas, índices y carriles; los descansos usan grandes campos de color y una sola idea.

En móvil, las trayectorias se convierten en un eje vertical y las matrices pasan a listas. La narrativa, el orden de tabulación y las acciones permanecen intactos.

## Elevation & Depth

La profundidad nace de la oclusión, las líneas que pasan por detrás y delante de las placas y los cambios de escala. No hay vidrio difuso ni niebla luminosa. Las pocas sombras son amplias, desplazadas y estructurales.

**The Diagram Has Depth Rule.** Una capa puede cruzar otra, pero ninguna puede reducir la legibilidad de contenido o controles.

## Shapes

Las cápsulas cruzadas del símbolo originan botones, estaciones, etiquetas y recortes. Las placas principales reservan esquinas amplias para hojas o módulos completos; el contenido interno se separa con reglas y alineación, nunca con tarjetas anidadas.

## Components

### Buttons

- **Shape:** controles rectangulares y tensos; las cápsulas quedan para nodos y tags.
- **Primary:** Cian Señal sobre Noche de Sistema, con altura táctil constante.
- **Hover / Focus:** desplazamiento vertical breve, contraste directo y foco Ámbar Inteligencia.
- **Secondary:** transparente con regla clara; cambia a Cian Señal sin introducir elevación.

### Chips

- **Style:** etiquetas pequeñas, oblongas solo cuando funcionan como filtro o índice.
- **State:** el filtro activo invierte a Tinta Técnica y adopta el color semántico de su familia.

### Cards / Containers

- **Corner Style:** las placas de atlas son rectas; no existen tarjetas de servicio.
- **Background:** Papel Frío para catálogos densos y Azul Placa para instrumentos oscuros.
- **Shadow Strategy:** separación por reglas, oclusión y cambio tonal.
- **Border:** reglas de un píxel.

### Inputs / Fields

- **Style:** campo de búsqueda integrado en la barra del catálogo, sin caja independiente.
- **Focus:** anillo Ámbar Inteligencia y contraste completo del placeholder.
- **Empty:** mensaje específico y acción para restaurar la cartera.

### Navigation

Navegación compacta en Azeret Mono; en móvil se convierte en una placa de pantalla completa con titulares Geologica y cierre explícito.

### Atlas Orbital

El dispositivo de firma conecta seis estaciones y cinco resultados alrededor del número 54. Las rutas se dibujan una vez con easing exponencial y los nodos se resuelven en secuencia; el contenido ya es visible con movimiento reducido.

## Do's and Don'ts

### Do:

- **Do** usar rutas, nodos e índices para mostrar cómo una solución crece por capas.
- **Do** reservar Papel Frío para momentos de máxima información y contraste.
- **Do** hacer que cada animación explique conexión, ensamblaje o progresión.
- **Do** mantener visible y usable todo el contenido con movimiento reducido.

### Don't:

- **Don't** convertir los 54 productos en una cuadrícula de tarjetas genéricas.
- **Don't** usar degradados púrpura-azul, halos de neón o cristal esmerilado como atajo visual.
- **Don't** inventar clientes, cifras de impacto, precios o testimonios.
- **Don't** repartir microanimaciones inconexas por todos los elementos.
