# ⚔️ WoW Items & Secondary Stats Comparator

Una aplicación web moderna, modular y rápida diseñada para analizar y comparar el equipamiento y la distribución de atributos secundarios (**Golpe Crítico, Celeridad, Maestría y Versatilidad**) de los **50 mejores jugadores del mundo** en World of Warcraft Míticas+ (Raider.IO) contra tu propio personaje mediante exportación de **SimulationCraft** (`/simc`).

---

## 🚀 Características Principales

1. **Top 50 con Filtro Estricto por Especialización:**
   - Análisis de los 50 mejores jugadores del ranking mundial filtrados con precisión absoluta por clase y especialización (evitando distorsiones estadísticas entre distintas specs de una misma clase).
   - Concurrencia optimizada con 10 workers en paralelo para una carga y análisis ultra rápidos.

2. **Integración con SimulationCraft (`/simc`):**
   - Pega tu string de exportación de SimulationCraft y la app detectará automáticamente tu clase, especialización, nivel de objeto medio y todas tus piezas equipadas.
   - Diagnóstico detallado por atributo secundario con recomendaciones automáticas (Subir, Bajar/Exceso u Óptimo) comparadas con el consenso del Top 50.

3. **Pantalla de Personaje Réplica de WoW (Paperdoll Interactivo):**
   - Réplica visual de la pantalla de equipamiento de WoW en 3 columnas (ranuras izquierdas, cámara central con silueta y ranuras derechas).
   - Bloqueo/desbloqueo interactivo (`🔒` / `🔓`) para fijar piezas que deseas conservar o marcar las ranuras que deseas optimizar.
   - Tooltips oficiales integrados de **Wowhead**.

4. **Solver Combinatorio Inteligente (Pestañas de Equipamiento):**
   - **Actual:** Muestra tu equipamiento actual clasificado por temporada (S2 / S1).
   - **Óptimo:** Set BiS complementario considerando el botín de Mazmorras de Temporada, las piezas de Banda y hasta 2-3 ítems crafteados con chispa (respetando restricciones únicas: no 2 anillos crafteados, no 2 armas crafteadas).
   - **Recomendado:** Paquete coordinado de mazmorras de Míticas+ enfocado en tus atributos prioritarios.
   - **Alternativo:** Ruta complementaria secundaria de mazmorras.

5. **Pestañas de Consenso y Referencia:**
   - Equipamiento agrupado por ranuras, piezas fabricadas con chispa más populares, gemas y encantamientos frecuentes, y botín clasificado por jefe de banda.
   - Tabla completa de los 50 jugadores con puntuación M+, snapshots de carreras y equipamiento detallado.

6. **Arquitectura Modular (`js/`):**
   - Código 100% modular, desacoplado y mantenible:
     - `js/constants.js`: Constantes, paleta de atributos y configuraciones de clase.
     - `js/loot-data.js`: Base de datos de botín auténtico de mazmorras y bandas de temporada.
     - `js/api.js`: Cliente de Raider.IO, Wowhead tooltips y cálculo de stats.
     - `js/storage.js`: Caché persistente y restauración de sesión en `localStorage`.
     - `js/ui-helpers.js`: Barras de progreso, alertas y colapsables interactivos.
     - `js/top-analysis.js`: Paginación y workers de concurrencia para el Top 50.
     - `js/top-render.js`: Renderizado de resultados, consenso y tablas.
     - `js/simc-parser.js`: Parser de SimulationCraft y sincronización reactiva.
     - `js/gear-solver.js`: Algoritmo Beam Search para optimización de sets.
     - `js/paperdoll.js`: Vista Paperdoll, diagnóstico de stats y pestañas.
     - `js/main.js`: Inicialización de DOM y controladores de eventos.

---

## 💻 Ejecución Local

* **Opción 1:** Haz doble clic en el archivo `start.bat`. Esto abrirá automáticamente la aplicación en tu navegador en `http://localhost:8088`.
* **Opción 2:** O simplemente abre el archivo `index.html` con cualquier navegador moderno.

---

## 🌐 Despliegue en la Web

La aplicación es **100% estática / client-side** y puede ser desplegada instantáneamente en:
- **GitHub Pages** (Settings > Pages > Deploy from `main` branch)
- **Vercel** (`vercel.json` incluido)
- **Netlify**
