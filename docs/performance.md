# Rendimiento — 7 de septiembre de 2026

La optimización conserva el contenido, los idiomas, las rutas, el tema y las capturas originales. Los resultados siguientes corresponden al build local de producción servido por Vite en Chrome headless, con contextos nuevos y caché fría. No son datos reales de visitantes de enzowohl.com ni garantizan una puntuación fija en producción.

| Medición | Antes | Después |
| --- | ---: | ---: |
| Recursos iniciales, escritorio 1366 × 768 | 16,00 MB | 461 kB |
| Recursos iniciales, móvil 390 × 844 | 13,43 MB | 358 kB |
| Lighthouse móvil, rendimiento | 63 | 92 |
| Lighthouse móvil, LCP | 7,0 s | 3,0 s |
| Lighthouse móvil, Speed Index | 5,5 s | 2,2 s |
| Lighthouse móvil, bloqueo del hilo principal | 130 ms | 90 ms |
| Lighthouse móvil, desplazamiento de contenido (CLS) | 0 | 0 |
| JavaScript necesario para renderizar la portada, gzip | 183,38 kB | 160,87 kB |

Los bytes de recursos suman `PerformanceResourceTiming.encodedBodySize` después de `networkidle`, sin HTML. Los recursos externos sin permisos de timing pueden devolver cero. La medición de red usa el dispositivo local sin limitación; Lighthouse usa su simulación móvil. Las dos metodologías se comparan únicamente con su equivalente anterior. Los resultados y las verificaciones funcionales están en [performance-results.json](performance-results.json).

El JS de portada incluye el archivo principal y React/Router. Las secciones inferiores descargan otros 26,56 kB gzip entre su chunk y el zoom compartido; los casos de estudio descargan su propio chunk de 16,56 kB gzip. Separar esos archivos permite mostrar la portada antes y reutilizar la caché del runtime. El total de JS descargado en el inicio completo queda cercano al anterior; la mayor reducción de transferencia proviene de las imágenes y fuentes.

## Cambios

- Imágenes responsive: 50 originales de 33,81 MB generan vistas previas de 2,23 MB en sus tamaños por defecto, una reducción del 93,4 %. La descarga real depende del viewport, DPR, caché y proximidad al contenido visible.
- Los full de capturas/certificados conservan dimensiones y píxeles: 27,85 MB originales pasan a 18,62 MB. Solo el visor pide estas versiones; los previews usan WebP de calidad 90 o sin pérdida cuando comprime mejor. Se preserva el original JPEG cuando ya pesa menos que la conversión sin pérdida.
- `srcSet`, `sizes`, dimensiones conocidas y lazy loading para imágenes inferiores. `height: auto` preserva el recuadro de los certificados frente a las dimensiones intrínsecas HTML.
- Fuente variable Plus Jakarta Sans local y precargada. Iconos SVG locales mediante la dependencia existente `react-icons`. Se eliminan las hojas de Google Fonts y Font Awesome del camino de renderizado.
- Carga separada de portada, secciones inferiores y casos de estudio con [React lazy/Suspense](https://react.dev/reference/react/lazy). Los anchors esperan el montaje diferido; el scrollspy actualiza su inventario después de cargar las secciones.
- EmailJS se importa al enviar, después de validar la configuración. Sin variables EmailJS locales, Vite puede eliminar por completo ese código del build; en producción con configuración se carga bajo demanda.
- El carrusel móvil deja de actualizarse fuera de pantalla. El landing evita renders por los cambios de hash del scrollspy. El título y la foto de portada aparecen sin esperar una animación de entrada.

## Mantenimiento

Para agregar o reemplazar imágenes, editar los originales y regenerar las variantes. No editar manualmente los catálogos ni los WebP generados.

```powershell
python -m pip install -r scripts/requirements-images.txt
npm run images:optimize
npm run images:check
npm run build
git diff --check
```

Guardar en git tanto el original nuevo como `src/assets/optimized/`. El build de Vercel consume los archivos generados y no necesita Python. No se agregaron dependencias npm al proyecto. Los scripts de imágenes requieren Python 3.10+ y Pillow con WebP.

Las fuentes proceden de Google Fonts; su licencia y referencias están en `src/assets/fonts/`. Las capturas originales permanecen en `src/assets/proyectos/capturas/` con su numeración habitual.

## Verificación

Build completado con Node 22.23.2, sin advertencia de chunks grandes, y `git diff --check` correcto. `images:check` verifica el inventario, los hashes originales, las dimensiones y la igualdad de píxeles de las versiones full.

Pruebas de navegador: nueve rutas de proyecto y sus visores, búsqueda, enlaces directos con descarga diferida, navegación Inicio, ES/EN y tema persistentes, validación del formulario y foco en el primer error, zoom de certificados y restauración de foco. Se revisaron overflow y proporciones de certificados a 360, 390, 430, 768, 1024, 1366, 1440 y 1920 px. También se verificó que el carrusel rota visible, se pausa fuera de pantalla y responde al activar movimiento reducido sin recargar. Se usó Chrome local porque el navegador integrado no tenía conexión. No se enviaron mensajes reales mediante EmailJS.

## Próxima etapa visual

El sitio ya tiene entradas, hover, drawers y transición de tema. Conviene afinar esos efectos manteniendo visible desde el primer render el contenido principal:

1. Entrada breve de tarjetas al aparecer en pantalla: desplazamiento de 6–8 px y opacidad, 180–240 ms, una sola vez y con poco escalonado. Aprovechar las variantes compartidas actuales.
2. Respuesta en tarjetas de proyectos: elevación de 2–3 px y desplazamiento corto de la flecha al hover/foco, manteniendo estable el contenedor de la captura.
3. Continuidad entre tarjeta y caso de estudio: probar una transición del contenedor visual con fallback y movimiento reducido. Medir el coste de la captura/transición antes de extenderla a toda la página.

Priorizar `transform` y `opacity`, reutilizar Motion instalado y respetar `prefers-reduced-motion`. [La configuración de Motion](https://motion.dev/docs/react-motion-config) permite aplicar esa preferencia. Para esta identidad de dashboard, los fondos animados continuamente, partículas y seguimiento del cursor aportan menos que una interacción breve y legible. Estas propuestas quedan documentadas para la próxima etapa; no se añadieron nuevos efectos.
