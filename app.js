/**
 * app.js - Arquitectura Modular
 *
 * El código de la aplicación ha sido refactorizado y dividido en módulos independientes
 * y especializados dentro de la carpeta `js/`:
 *
 * 1.  js/constants.js     -> WOW_CLASSES, STAT_COLORS, CRAFTED_BONUS_SET, CLASS_ARMOR_MAP, SAMPLE_SIMC_STRING.
 * 2.  js/loot-data.js     -> Tablas completas y auténticas de SEASON_DUNGEON_LOOT (M+) y SEASON_RAID_DATA (Banda).
 * 3.  js/api.js           -> Cliente Raider.IO, tooltipCache, fetchItemTooltip y getPlayerSecondaryStats.
 * 4.  js/storage.js       -> Variables de estado compartidas y persistencia (localStorage) de Top 50 y SimC.
 * 5.  js/ui-helpers.js    -> Barras de progreso, alertas y colapsables (toggleCollapse, toggleAllSections).
 * 6.  js/top-analysis.js  -> Paginación estricta por especialización, 10 workers concurrentes y batching.
 * 7.  js/top-render.js    -> Renderizado de pestañas de ranura/crafteo/gemas, consenso, boss loot y tabla Top 50.
 * 8.  js/simc-parser.js   -> Parser de /simc export, autodetección de clase/spec y disparador de comparación.
 * 9.  js/gear-solver.js   -> Beam search combinatorio para sets Óptimo, Recomendado y Alternativo.
 * 10. js/paperdoll.js     -> WoW Character Screen Replica, diagnóstico de atributos y tabs (Actual, Óptimo, etc).
 * 11. js/main.js          -> Inicialización de selectores, event listeners y carga de DOMContentLoaded.
 *
 * Si este archivo es incluido directamente en un entorno web legacy, cargará dinámicamente los módulos.
 */

(function() {
    if (typeof window !== 'undefined' && !window.__WOW_STATS_MODULAR_LOADED__) {
        const modules = [
            'js/constants.js',
            'js/loot-data.js',
            'js/api.js',
            'js/storage.js',
            'js/ui-helpers.js',
            'js/top-analysis.js',
            'js/top-render.js',
            'js/simc-parser.js',
            'js/gear-solver.js',
            'js/paperdoll.js',
            'js/main.js'
        ];

        // Only inject if not already declared in index.html
        if (!document.querySelector('script[src*="js/main.js"]')) {
            modules.forEach(src => {
                const s = document.createElement('script');
                s.src = src + '?v=13';
                s.async = false;
                document.head.appendChild(s);
            });
        }
        window.__WOW_STATS_MODULAR_LOADED__ = true;
    }
})();
