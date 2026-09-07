# Imágenes generadas

No editar estos archivos a mano. Ejecutar `npm run images:optimize` después de modificar los originales de `src/assets/` y `npm run images:check` para verificarlos. Requiere las dependencias de `scripts/requirements-images.txt`.

`manifest.json` conserva hashes y medidas para auditoría. `catalog.json` contiene solo los datos usados por el navegador. Las variantes `-480`, `-960` y `-1440` corresponden al ancho máximo sin ampliar la fuente; las capturas más pequeñas mantienen su ancho original. Las variantes `-full` conservan todos los píxeles del original y se reservan para el zoom.

Las variantes y catálogos se versionan junto con los originales para que Vercel pueda compilar sin Python. Más detalles en `docs/performance.md`.
