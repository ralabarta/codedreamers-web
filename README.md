# CodeDreamers 360

Landing estática en español para presentar la cartera 360 de CodeDreamers: 54 productos, 16 formatos de entrega, 10 sectores y un ecosistema modular de software, datos e IA.

## Desarrollo

Requiere Node.js 20 o posterior.

```bash
npm ci
npm run dev
```

## Compilar

```bash
npm run build
```

El contenido de `dist/` queda listo para publicar en Surge:

```bash
npx surge ./dist codedreamers.surge.sh
```

El build utiliza rutas relativas, genera el fallback `200.html`, incluye fuentes locales y no necesita backend ni CDN.

## Contenido principal

- `src/CodeDreamersLanding.tsx`: catálogo, contenido e interacciones.
- `src/styles.css`: sistema visual, responsive y movimiento.
- `public/`: identidad, vista social, robots y sitemap.
- `PRODUCT.md`: verdad de producto extraída de la cartera.
- `DESIGN.md`: sistema de marca y dirección creativa.

## Contacto incluido

- `codedreamers.dev@gmail.com`
- `+53 52015051`
