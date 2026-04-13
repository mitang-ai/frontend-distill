# Frontend Distill

`Frontend Distill` es un proyecto skill + toolchain para destilar el frontend de sitios web reales y convertirlo en activos reutilizables para IA.

No se limita a extraer colores o tipografía. Intenta destilar tres capas al mismo tiempo:

- diseño visual
- estructura de layout
- comportamiento responsive

La meta es que la IA no solo genere interfaces “parecidas”, sino también páginas estructuralmente más correctas.

## Salidas principales

- `DESIGN.md`
- `LAYOUT.md`
- `design-tokens.json`
- `layout-tokens.json`

## Flujo básico

1. Abre el sitio objetivo en el navegador
2. Ejecuta [`tools/browser/extract_design_tokens.js`](./tools/browser/extract_design_tokens.js)
3. Pasa el JSON extraído por la toolchain de normalización
4. Reutiliza el resultado con el skill `frontend-distill`

## Referencias

- [README en chino simplificado](./README.md)
- [README en inglés](./README.en.md)
