# Contexto del portfolio

Documento breve para iniciar futuras conversaciones. Revisar `git status` y el código antes de editar: este archivo describe el estado al 2026-09-07.

## Objetivo y criterios

- Portfolio profesional de Walter Enzo Wohl, enfocado en análisis de datos, automatización, herramientas internas y desarrollo web.
- Identidad visual: dashboard azul marino oscuro, acento turquesa, bordes azulados finos, tarjetas compactas, tipografía legible y animaciones discretas.
- Conservar contenido, rutas, ES/EN, tema claro/oscuro, navegación, accesibilidad y responsive salvo pedido explícito.
- Escritorio debe sentirse compacto, especialmente a `1366x768` con navegador al 100%. No usar `zoom`, escalado global, reducción global de `html` ni alturas que corten contenido.
- Mobile es diseño específico, no escritorio encogido. Evitar scroll horizontal, superposiciones y contenido oculto por navbar inferior.
- Capturas deben priorizar imagen completa: `object-fit: contain`, relación de aspecto estable y sin recortes arbitrarios.
- Respetar `prefers-reduced-motion`, foco visible, teclado y áreas táctiles mínimas de 44 px.
- No inventar métricas, capturas, certificados, logos, datos ni funcionalidades.

## Stack

- React `19`, TypeScript, Vite `7`, React Router `7`.
- Motion: `motion/react`.
- Formularios: `react-hook-form`.
- Email: `@emailjs/browser`.
- Iconos: `react-icons`; `FontIcon.tsx` conserva las clases de Font Awesome y renderiza SVG locales. Sin CDN de iconos.
- Sin framework CSS. Estilos CSS separados por pantalla/componente.
- Node requerido: `22.x`.
- Scripts disponibles: `npm run dev`, `npm run build`, `npm run preview`, `npm run images:optimize` y `npm run images:check`. No hay scripts de lint ni tests de UI instalados en el repo.

## Arquitectura

- Entrada: `src/main.tsx`; router: `BrowserRouter`.
- Orquestación, idioma, tema y rutas: `src/App.tsx`.
- Layout global: `src/components/DashboardLayout.tsx`.
- Navegación: `src/config/navigation.ts`, `DashboardLayout.tsx` y `MobileNavigation.tsx`.
- Pantallas principales, dentro de `/` mediante anchors: `#home`, `#portfolio`, `#curriculum`, `#certifications`, `#contacto`.
- Case studies: `/proyectos/:slug`.
- Componentes principales: `OverviewDashboard`, `ProjectsGallery`, `ExperienceSection`, `CertificationsSection`, `ContactSection`.
- Tipos de case study: datos (`ProjectCaseStudy`), web/herramienta interna (`WebProjectCaseStudy`) y WOHL (`FitnessProjectCaseStudy`).
- Datos centralizados en `src/data/`; evitar textos visibles duplicados dentro de componentes.
- Animaciones compartidas: `src/animations/motion.ts`.
- Orden CSS importado en `App.tsx`: base, dashboard, páginas, case studies, carrusel/zoom, `density.css` y finalmente `mobile.css`.

## Navegación y estado global

- Desktop: sidebar fijo y sección activa derivada de URL/hash. El logo W es enlace semántico al resumen.
- Mobile inferior, orden obligatorio: Inicio, Proyectos, Experiencia, Certificaciones, Contacto. No existe menú “Más”.
- Al ir a Inicio, incluso desde abajo o desde la misma ruta, debe volver a `/` y hacer scroll arriba.
- Idiomas `es`/`en`: estado en `App.tsx`, persistido como `portfolio-language`; actualiza `<html lang>` sin recarga.
- Tema `dark`/`light`: persistido como `portfolio-theme`; transición View Transitions con fallback y reduced motion.
- Todo texto nuevo debe tener español e inglés.

## Proyectos y rutas

Fuente única: `src/data/projects.ts`. `projectNumber` es estable y nunca debe derivarse del índice de un `.map()`.

- `1`: Análisis de Gastos RRHH, `/proyectos/analisis-de-gastos-rrhh`.
- `2`: Informe de Ventas Appol, `/proyectos/informe-de-ventas-appol`.
- `3`: Métricas de Mailing GCBA, `/proyectos/metricas-de-mailing-gcba`.
- `4`: Gestión de Nómina RRHH, `/proyectos/gestion-de-nomina-rrhh`.
- `5`: JennyUGC.com, `/proyectos/jenny-ugc`.
- `6`: RikiWohl.com, `/proyectos/riki-wohl`.
- `7`: WOHL - App fitness, `/proyectos/wohl-fitness`.
- `8`: Tablero de Eventos Interno, `/proyectos/tablero-eventos-interno`.
- `9`: SIGO, `/proyectos/sigo`.

Resumen actual: destacado `wohl-fitness`; recientes `mailing-gcba`, `jenny-ugc`, `riki-wohl`.

Detalles de datos: `projectCaseStudies.ts` (1-4), `webCaseStudies.ts` (5, 6, 8, 9), `fitnessCaseStudy.ts` (7). Links externos viven en estos datos o en `projects.ts`; no reemplazarlos sin verificar.

## Capturas y visor

- Carpeta única: `src/assets/proyectos/capturas/`.
- Convención: `<projectNumber><letter>`, por ejemplo `5A.png`; inventario en su `README.md`.
- Resolución automática mediante `import.meta.glob` en `src/data/projectCaptures.ts`.
- Letras admitidas: `A` a `H`. Si falta una imagen, `ProjectCapture` muestra placeholder con código; no reutilizar capturas ajenas.
- 1-4 usan A-D; 5 y 6 A-D; 7 A-H (`7A` hero, `7B-7G` funciones, `7H` portada de card); 8 y 9 A-E.
- Carrusel/lightbox: `ProjectCaptureCarousel.tsx`; zoom reutilizable: `ZoomableMedia.tsx` + `image-zoom.css`.
- Zoom entre 100% y 300%, rueda, doble clic, controles y pan por click. Imagen nativa no arrastrable; navegación del carrusel se bloquea mientras hay zoom.
- Certificados también reutilizan el zoom. Controles deben quedar fuera de la imagen para no camuflarse.

## Secciones y assets

- Branding: `src/assets/branding/`; experiencia: `src/assets/experiencia/`; certificados: `src/assets/certificaciones/`; fondos y placeholders en carpetas propias.
- CV: `public/img/Walter Enzo Wohl CV.pdf`.
- Experiencia y logos: `src/data/experience.ts` + `ExperienceSection.tsx`; logos usan encuadre/zoom CSS para no chocar con texto.
- Certificaciones: `src/data/certifications.ts`; Google en curso, UTN y Crehana completadas. Certificados reales: `utn_certificado.png` y `crehana_certificado.jpg`.
- Contacto: `ContactSection.tsx`, datos en `contact.ts`. Email `walterenzowohl@gmail.com`, teléfono `+54 11 4141 9407`, LinkedIn `/in/walterenzowohl`, GitHub `WalterEnzoWohl`.
- Envío usa EmailJS y requiere en Vercel: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`. Incluye validación, estados, copia de datos y honeypot. No inventar endpoint alternativo.
- Carrusel móvil de áreas: `MobileWorkAreasCarousel.tsx`; inicia en índice 0, rota cada 3000 ms, swipe y pausa de interacción.

## Responsive y estilos

- Mobile principal: `src/mobile.css`, `max-width: 767px`.
- Densidad: `src/density.css`; escritorio desde 1025 px, compacto desde 1280 px, tablet 768-1024 px.
- Cada sección posee CSS propio. Antes de agregar reglas globales, buscar reglas existentes y cascada final de `density.css`/`mobile.css`.
- No cambiar sidebar o navegación global al ajustar un case study salvo pedido explícito.
- Validación visual prioritaria: 1366x768 desktop y 360/390/430 mobile; también 1920x1080, 1440x900, 1024x768 y 768x1024.

## Git y despliegue

- Repo: `https://github.com/WalterEnzoWohl/Portfolio.git`.
- Producción: Vercel conectado a `main`; dominio `enzowohl.com`.
- `vercel.json`: framework Vite, build `npm run build`, salida `dist`, rewrite SPA hacia `index.html`.
- Ramas: `main` actual; `legacy-portfolio` conserva diseño anterior; existe `redesign-v2`.
- Último commit remoto al crear este documento: `47f7c81 Agrega SIGO y zoom de imágenes`.
- Estado pendiente al crear este documento: `src/dashboard.css` modificado sin commit para separar el botón “volver arriba” del borde del footer (`padding-top: 86px`, botón `top: 16px`). `npm run build` pasó.

## Flujo recomendado

1. Ejecutar `git status --short --branch`; no pisar cambios locales.
2. Inspeccionar componente, datos y CSS específico antes de editar.
3. Reutilizar arquitectura y dependencias; no instalar paquetes sin necesidad.
4. Ejecutar `npm run build` y `git diff --check`.
5. Probar ruta afectada en desktop/mobile, overflow horizontal, teclado, ES/EN, tema y consola.
6. Commit/push solo si el usuario lo pide; push a `main` dispara Vercel.

## Optimizaci?n de rendimiento (2026-09-07)

- Informe y evidencia: `docs/performance.md` y `docs/performance-results.json`.
- La portada se renderiza primero; `LandingSections.tsx` y `ProjectCaseStudyPage.tsx` se cargan en chunks separados. `ScrollManager` espera anchors diferidos y `DashboardLayout` actualiza los nodos del scrollspy al montar las secciones.
- React/Router tienen chunk propio para cach?; EmailJS se importa al enviar. No hubo nuevas dependencias npm en el proyecto.
- Fuente Plus Jakarta Sans variable ES/EN autoalojada en `src/assets/fonts/`, con licencia OFL y preload normal. No hay solicitudes de fuentes a Google/CDN.
- Capturas: previews WebP de hasta 480/960/1440 px, `srcSet` y `sizes`; full sin p?rdida para zoom (`ProjectCapture fullResolution`). Logos reducidos para su tama?o de uso y carga lazy fuera de portada.
- `scripts/optimize-images.py` requiere Pillow (`scripts/requirements-images.txt`). Los generados se guardan en git; Vercel no necesita Python para compilar. `images:check` verifica cat?logo, hashes, dimensiones y p?xeles de los full.
- Las dimensiones de imagen se conocen antes de cargar. En certificados, conservar `height: auto` junto al `aspect-ratio: 1.24 / 1` de `.certification-card-preview > img` para que el atributo HTML height no estire las tarjetas.
- Carrusel m?vil pausa fuera del viewport, adem?s de pesta?a oculta, interacci?n y reduced motion. El texto principal de portada aparece de inmediato; conserva la animaci?n del gr?fico.
- Validado build con Node 22.23.2, nueve rutas/zoom, ES/EN, tema persistente, validaci?n local del formulario y ocho tama?os 360?1920 px. No se enviaron emails reales. Cambios pendientes de commit/push.
