# Contexto del Portfolio

## Resumen
Este repositorio contiene un portfolio personal de **Walter Enzo Wohl** migrado a **React + TypeScript** con **Vite**.

La app principal es una SPA de una sola página con secciones:
- Home
- About Me
- Skills
- Curriculum
- Portfolio
- Contacto
- Footer

## Stack y dependencias
- Runtime/build: `vite`
- UI: `react`, `react-dom`
- Tipado: `typescript`
- Formulario: `react-hook-form`
- Envío de emails: `@emailjs/browser`
- Iconos: Font Awesome vía CDN en `index.html` (raíz)

`package.json` scripts:
- `npm run dev`: servidor local de desarrollo
- `npm run build`: build de producción (`tsc -b && vite build`)
- `npm run preview`: preview del build

## Entrada real de la app
- **Entrada usada por Vite**: `/index.html` (raíz del proyecto)
- Bootstrap React: `src/main.tsx`
- Componente principal: `src/App.tsx`
- Estilos globales: `src/style.css`

## Nota sobre archivo legado
Existe `src/index.html` (legacy) abierto en tu IDE.  
Ese archivo **no es** el entrypoint de Vite y hoy no gobierna la app React.

## Estructura de carpetas relevante
- `index.html`: shell HTML de Vite + CDN de Font Awesome
- `src/main.tsx`: monta `<App />` en `#root`
- `src/App.tsx`: toda la lógica y UI del portfolio
- `src/style.css`: estilos y animaciones
- `public/data/cv.json`: datos de formación/experiencia para Curriculum
- `public/img/*`: imágenes, WebP optimizados y CV PDF descargable
- `dist/`: build generado (salida producción)

## Cómo funciona la app (lógica)

### 1) Navegación y menú responsive
En `App.tsx`:
- `menuVisible` controla si el nav móvil está abierto.
- Botón hamburguesa alterna estado.
- Al clickear un link del menú, se cierra el menú (`selectMenu`).

### 2) Skills estáticas por categorías
- Las skills viven como arrays en `src/App.tsx`.
- Se renderizan como cards modernas con tags.
- La fuente de verdad actual para stack y perfil es el contenido visible del portfolio más `public/data/cv.json`.

### 3) Currículum dinámico desde JSON
- `fetch("/data/cv.json")` en `useEffect`.
- Se carga `formacion` y `experiencia` al estado `curriculum`.
- Si falla, se muestra `curriculumError`.
- Cada item tiene acordeón con estado independiente:
  - `openFormacion` para columna izquierda
  - `openExperiencia` para columna derecha

### 4) Formulario de contacto
- `react-hook-form` maneja registro, validación y errores.
- Validaciones:
  - nombre obligatorio
  - teléfono obligatorio + patrón
  - email obligatorio + formato
  - asunto obligatorio
  - mensaje obligatorio
- Envío con EmailJS (`emailjs.send`) usando:
  - `VITE_EMAILJS_SERVICE_ID`
  - `VITE_EMAILJS_TEMPLATE_ID`
  - `VITE_EMAILJS_PUBLIC_KEY`
- Si no existen variables, usa fallback hardcodeado.
- Muestra estados de envío y mensajes de éxito/error.

### 5) Assets y performance
- Home usa `/img/fondo-banner.webp`.
- Foto de perfil usa `/img/foto-perfil.webp`.
- Proyecto estático usa `/img/d2.webp`.
- Iframes de PowerBI e imagen secundaria usan `loading="lazy"`.

## Variables de entorno
Archivo de ejemplo: `.env.example`

Variables:
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

## Flujo de ejecución local
1. `npm install`
2. `npm run dev`
3. Abrir URL indicada por Vite (normalmente `http://localhost:5173`)

## Build y deploy
- `npm run build` genera `dist/`.
- `npm run preview` permite verificar producción local.
- Deploy típico: Vercel, Netlify o static hosting compatible con Vite.

## Contenido funcional actual del portfolio
- Perfil principal actualizado a **Analista de Datos IT**
- Skills técnicas renderizadas como cards, alineadas con el CV
- Formación y experiencia renderizadas desde `public/data/cv.json`
- Experiencia actual en **GCBA** y experiencia previa en **Arbusta**
- Embeds de dashboards Power BI y proyecto web
- Formulario de contacto con envío vía EmailJS
- Descarga de CV PDF desde `public/img/Walter Enzo Wohl CV.pdf`
