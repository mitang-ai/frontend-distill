<div align="center">
  <h1>Frontend Distill</h1>
  <h2>Destila frontends web en activos de sistema reutilizables para IA</h2>
  <h3>frontend-distill skill</h3>
  <p>No extrae solo estilos: también estructura, ritmo y restricciones responsive.</p>
  <p>Le entrega a la IA algo más útil que una referencia visual: un sistema que puede reutilizar.</p>

  <p>
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" />
    <img src="https://img.shields.io/badge/Claude%20Code-Skill-blue" alt="Claude Code Skill" />
    <img src="https://img.shields.io/badge/Frontend-Distill-black" alt="Frontend Distill" />
  </p>

  <p>
    Other Languages / Otros idiomas:
    <a href="./README.md">简体中文</a> ·
    <a href="./README.en.md">English</a> ·
    <a href="./README.ja.md">日本語</a> ·
    <a href="./README.ko.md">한국어</a>
  </p>
</div>

`Frontend Distill` es un skill + toolchain open source para convertir sitios web reales en activos frontend que una IA pueda reutilizar con más estabilidad.

No pretende ser un simple volcado de CSS, ni otro README de referencia visual.  
Su objetivo es extraer restricciones reutilizables desde la superficie de un sitio y empaquetarlas en salidas más claras y más baratas de consumir para la IA.

El ritmo organizativo de este README está inspirado en la forma en que Hua Shu suele estructurar documentación open source, pero el título, la voz, el encuadre y la narrativa fueron reescritos específicamente para `Frontend Distill`.

---

## Qué problema resuelve

[`awesome-design-md`](https://github.com/VoltAgent/awesome-design-md) ya demostró que `DESIGN.md` es un medio muy útil para transferir estilo visual a agentes de IA.

Pero en la práctica, el problema rara vez es solo que el color no coincida. Los problemas suelen ser:

- esqueletos de página inestables
- ritmo débil entre secciones
- layouts de escritorio demasiado apretados
- apilado móvil incómodo
- CTA, navegación y estructura de contenido dejados a la improvisación del modelo

En otras palabras, muchos recursos le dicen a la IA cómo debería verse una interfaz, pero no explican con suficiente claridad cómo debería componerse la página.

`Frontend Distill` existe para cubrir esa capa faltante.

## Posicionamiento

Este proyecto no es solo un extractor. Combina tres elementos:

- un skill guiado por prompts precisos
- herramientas deterministas para extracción y normalización
- salidas reutilizables diseñadas para consumo por IA

La idea es dejar el trabajo repetitivo a los scripts y reservar el razonamiento del modelo para las partes que realmente necesitan criterio.

## Salidas principales

`Frontend Distill` gira actualmente alrededor de cuatro artefactos principales:

- `DESIGN.md`
- `LAYOUT.md`
- `design-tokens.json`
- `layout-tokens.json`

Cada uno cumple una función distinta:

- Markdown ofrece guía de alto nivel para humanos y agentes
- JSON ofrece entradas estructuradas con menos ambigüedad y menor costo en tokens

## Por qué ahorra tokens

Si dependes solo de un prompt largo y le pides a la IA que inspeccione un sitio, infiera el sistema y lo resuma por sí sola, normalmente aparecen tres problemas:

- deriva del flujo
- mayor aleatoriedad
- uso caro de tokens

Este proyecto invierte ese modelo:

- los prompts se encargan de la orquestación y las restricciones
- los scripts se encargan de extraer, agrupar, deduplicar y recortar
- la IA lee al final un resultado ya limpio

Por eso se parece más a una tubería de destilación frontend que a un prompt puntual de estilo.

## Instalación

Clona el repositorio:

```bash
git clone <your-repo-url>
cd frontend-distill
```

Instala las dependencias:

```bash
npm install
```

Instala el skill en tu directorio local de skills:

```bash
npm run skill:install -- --target "C:\\Users\\your-name\\.claude\\skills"
```

Si tu agente puede cargar un skill directamente desde la ruta del repositorio, también puedes usar:

- [`skill/frontend-distill`](./skill/frontend-distill)

## Flujo de uso

1. Abre el sitio objetivo con un navegador o con un agente que tenga acceso al navegador.
2. Ejecuta [`tools/browser/extract_design_tokens.js`](./tools/browser/extract_design_tokens.js) en la consola de la página.
3. Pasa el JSON bruto por las herramientas de normalización, validación y división.
4. Entrega el bundle resultante, los tokens y las guías Markdown al skill `frontend-distill`.

Comandos de ejemplo:

```bash
npm run bundle:normalize -- --input ./examples/sample-raw-extraction.json --output ./output/extraction-bundle.json
npm run bundle:validate -- --input ./output/extraction-bundle.json
npm run bundle:split -- --input ./output/extraction-bundle.json --design-output ./output/design-tokens.json --layout-output ./output/layout-tokens.json
```

## Qué destila

Los sistemas frontend no son de una sola capa. Este proyecto trabaja actualmente con cinco capas:

Capa | Contenido principal | Por qué importa
--- | --- | ---
Visual | color, tipografía, sombras, radios, efectos decorativos | determina si el estilo se siente correcto
Componentes | botones, tarjetas, inputs, navegación, tags y variantes | estabiliza el detalle de los componentes
Layout | contenedores, grids, ritmo de secciones, anchos de lectura, esqueletos de página | determina si la página respira bien
Responsive | breakpoints, reglas de colapso, compresión de espacios, cambios de navegación, evidencia de viewport | determina si sobrevive en distintos dispositivos
Reutilización | `DESIGN.md`, `LAYOUT.md`, tokens estructurados | determina si la IA puede reutilizar el sistema con bajo costo

Si solo se destilan las dos primeras capas, la IA suele generar interfaces que se parecen.  
Cuando las otras tres capas también se vuelven explícitas, las probabilidades de obtener una estructura correcta aumentan mucho.

## Cómo funciona

Para un sitio objetivo, `Frontend Distill` pasa por cuatro etapas:

1. Recoger evidencia frontend  
   Captura visual tokens, muestras de componentes, señales de layout, pistas responsive, variables CSS, efectos decorativos y evidencia relacionada con estados.

2. Normalizar la salida bruta  
   Deduplica, agrupa, recorta y estandariza colores, valores de spacing, firmas de estilo y variantes de componentes.

3. Construir artefactos reutilizables  
   La toolchain genera un `extraction-bundle`, lo divide en `design-tokens.json` y `layout-tokens.json`, y prepara entradas para `DESIGN.md` y `LAYOUT.md`.

4. Dejar que el skill lo consuma  
   El skill lee primero los resúmenes estructurados y los tokens, y luego las guías Markdown, reduciendo improvisación y gasto de tokens.

## Qué incluye ya el repositorio

El repositorio ya incluye:

- un skill local al repo
- un script de extracción en navegador
- herramientas de normalización, validación y división
- un schema estructurado
- guía para `DESIGN.md`
- guía para `LAYOUT.md`
- análisis del upstream

Así que ya no es solo una idea de prompt. Ya es la base funcional de una toolchain real para skills.

## Límites honestos

Este proyecto mantiene sus límites de forma explícita:

- lee salida renderizada pública, no archivos de diseño privados
- es bueno extrayendo patrones frontend repetidos, no intención de negocio o estrategia de marca
- puede registrar evidencia estructural, pero no todos los estados de interacción en una sola ejecución
- la captura responsive en múltiples viewports mejora cuando se combina con agentes con capacidad de navegador

Decir esos límites con claridad hace que el resultado sea más confiable.

## Estructura del repositorio

```text
frontend-distill/
├── skill/
│   └── frontend-distill/
│       ├── SKILL.md
│       ├── extract-script.md
│       ├── reference.md
│       ├── layout-reference.md
│       └── skill-output-template.md
├── tools/
│   ├── browser/
│   │   └── extract_design_tokens.js
│   ├── install-skill.mjs
│   ├── normalize-extraction-bundle.mjs
│   ├── split-extraction-bundle.mjs
│   ├── validate-extraction-bundle.mjs
│   └── lib/
│       └── bundle-utils.mjs
├── schemas/
│   └── extraction-bundle.schema.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   └── UPSTREAM_ANALYSIS.md
├── examples/
│   └── sample-raw-extraction.json
├── package.json
├── .gitignore
└── LICENSE
```

## Documentación pública

- Architecture: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- Roadmap: [`docs/ROADMAP.md`](./docs/ROADMAP.md)
- Upstream analysis: [`docs/UPSTREAM_ANALYSIS.md`](./docs/UPSTREAM_ANALYSIS.md)

## Licencia

MIT License. See [`LICENSE`](./LICENSE).
