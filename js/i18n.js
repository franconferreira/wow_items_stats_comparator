/**
 * i18n.js
 * Internationalization module supporting Spanish (es) and English (en).
 * Automatically updates DOM elements with data-i18n attributes and provides a t() helper.
 */

const TRANSLATIONS = {
    es: {
        // Navigation
        navTitle: 'WoW Top 50 Analyzer',
        navSubtitle: 'Consenso de ítems y estadísticas secundarias de los mejores jugadores',
        navConnected: 'Conectado a Raider.IO & Wowhead',

        // Search Filters
        searchFilters: 'Filtros de Búsqueda',
        classLabel: 'Clase',
        specLabel: 'Especialización',
        regionLabel: 'Región',
        seasonLabel: 'Temporada',
        exclude344Label: 'Excluir ítems de <span class="font-bold text-amber-400">ilvl 344</span> del promedio de estadísticas',
        analyzeBtn: 'Analizar Top 50 Jugadores',

        // Regions
        regionWorld: 'Mundial (World)',
        regionUS: 'América (US)',
        regionEU: 'Europa (EU)',
        regionCN: 'China (CN)',
        regionKR: 'Corea (KR)',
        regionTW: 'Taiwán (TW)',

        // Seasons
        seasonMn2: 'MN Temporada 2',
        seasonMn1: 'MN Temporada 1',

        // SimC Tool
        simcTitle: 'Comparador de Personaje',
        simcBadge: 'SimulationCraft (/simc)',
        simcSubtitle: 'Pega la exportación de tu addon <span class="text-amber-400 font-mono font-bold">/simc</span> para comparar tus estadísticas contra el Top 50 y recibir recomendaciones de sets de mazmorras de la temporada',
        loadSample: 'Cargar ejemplo',
        collapse: 'Plegar',
        expand: 'Desplegar',
        simcPlaceholder: 'Pega aquí el texto exportado por tu addon /simc dentro del juego... (ej. deathknight="MiPersonaje" head=,id=...)',
        simcNote: 'Compara tus stats contra el Top 50 y te recomienda paquetes coordinados de mazmorras para reemplazar tus ítems previos sin desbalancear atributos.',
        compareBtn: 'Comparar Mi Personaje',

        // Progress & Loading
        loadingData: 'Cargando datos...',
        queryingApis: 'Consultando APIs en vivo',

        // Toolbar
        collapseAll: 'Plegar todas las secciones',
        expandAll: 'Desplegar todas',

        // Consensus & Diagnostics
        consensusTitle: 'Consenso de Estadísticas Secundarias',
        consensusSubtitle: 'Promedio y distribución de estadísticas de los 50 mejores clasificados',
        consensusSubtitleExclude: 'Promedio y distribución recalculados excluyendo piezas ilvl 344',
        statDistribution: 'Distribución Proporcional de Estadísticas',
        charDistribution: 'Distribución de tu Personaje',
        top50Distribution: 'Distribución del Top 50',
        detailedDiagnostic: 'Diagnóstico Detallado por Atributo Secundario',
        yourCharacter: 'Tu Personaje',
        top50Avg: 'Promedio Top 50',

        // Stat Names
        crit: 'Crítico',
        haste: 'Celeridad',
        mastery: 'Maestría',
        vers: 'Versatilidad',

        // Paperdoll Tabs
        seasonDetectionTitle: 'Detección de Temporada e Inspección de Ranuras',
        tabActual: 'Actual',
        tabOptimal: 'Óptimo',
        tabRecommended: 'Recomendado',
        tabAlternative: 'Alternativo',

        // Paperdoll Slots & Badges
        replaces: 'Reemplaza',
        keptPiece: 'Pieza conservada en este set',
        currentKept: 'Pieza actual conservada en este set',
        lockedTooltip: 'Conservado (Click para marcar reemplazo)',
        unlockedTooltip: 'A Reemplazar (Click para fijar/conservar)',
        twoHandWeapon: 'Arma de 2 Manos',
        twoHand: '2 Manos',
        freeSlot: 'Ranura libre / no requerida',
        covered: 'Cubierto',
        shirt: 'Camisa',
        tabard: 'Tabardo',
        emptyCosmetic: 'Ranura cosmética vacía',
        trinketKept: 'Abalorio conservado',
        dropIn: 'Dropea en',
        sparkCraft: 'Fabricación con Chispa',
        boss: 'Jefe',
        raid: 'Banda',
        dungeonMPlus: 'Mazmorra M+',

        // Top 50 Tab Section
        tabSlotsTitle: 'Ítems Más Elegidos por Ranura',
        tabSlotsSubtitle: 'Abalorios, armas y anillos más populares del Top 50',
        tabCraftedTitle: 'Ítems Crafteados Más Utilizados',
        tabCraftedSubtitle: 'Piezas fabricadas con chispas o profesiones elegidas en lugar de drops de mazmorra o banda',
        tabGemsTitle: 'Gemas y Encantamientos en Común',
        tabGemsSubtitle: 'Engarces de gemas más elegidos y consenso de encantamientos por cada pieza',

        top50BuildsBadge: 'Top 50 Builds',
        professionsBadge: 'Profesiones & Embellishments',
        socketsBadge: 'Engarces & Encantos',

        btnBySlot: 'Por Ranura',
        btnCrafted: 'Crafteados',
        btnGems: 'Gemas y Encantamientos',

        gemsSubcardTitle: 'Gemas Más Utilizadas',
        gemsSubcardSubtitle: 'Gemas con mayor frecuencia de uso en ranuras prismáticas',
        enchantsSubcardTitle: 'Encantamientos por Ranura',
        enchantsSubcardSubtitle: 'Encanto más elegido para cada ranura de equipamiento',

        // Raid Boss Loot Section
        raidLootTitle: 'Loot de Banda Recomendado',
        raidLootSubtitle: 'Drops de banda utilizados por los Top 50 agrupados por jefe',

        // Player Comparison Table
        tableTitle: 'Comparativa Detallada de los Top 50 Jugadores',
        tableSubtitle: 'Desglose de estadísticas secundarias individuales y equipamiento activo',
        thRank: 'Rank',
        thPlayer: 'Jugador',
        thSpec: 'Espec.',
        thScore: 'M+ Score',
        thIlvl: 'ilvl',
        thCrit: 'Crítico',
        thHaste: 'Celeridad',
        thMastery: 'Maestría',
        thVers: 'Versatilidad',
        thGear: 'Equipo',

        // Storage & Badges
        restoredBadge: 'Último análisis restaurado',
        delete: 'Borrar',
        agoMoment: 'hace un momento',
        agoMin: 'hace {n} min',
        agoH: 'hace {n} h',

        // Footer
        footerData: 'Datos provistos en tiempo real por <a href="https://raider.io" target="_blank" class="text-amber-400 hover:underline">Raider.IO</a> y tooltips de <a href="https://wowhead.com" target="_blank" class="text-yellow-400 hover:underline">Wowhead</a>.',
        footerBlizzard: 'World of Warcraft® es una marca registrada de Blizzard Entertainment.'
    },

    en: {
        // Navigation
        navTitle: 'WoW Top 50 Analyzer',
        navSubtitle: 'Gear consensus & secondary stats from top Mythic+ players',
        navConnected: 'Connected to Raider.IO & Wowhead',

        // Search Filters
        searchFilters: 'Search Filters',
        classLabel: 'Class',
        specLabel: 'Specialization',
        regionLabel: 'Region',
        seasonLabel: 'Season',
        exclude344Label: 'Exclude <span class="font-bold text-amber-400">ilvl 344</span> items from stat averages',
        analyzeBtn: 'Analyze Top 50 Players',

        // Regions
        regionWorld: 'Worldwide (World)',
        regionUS: 'Americas (US)',
        regionEU: 'Europe (EU)',
        regionCN: 'China (CN)',
        regionKR: 'Korea (KR)',
        regionTW: 'Taiwan (TW)',

        // Seasons
        seasonMn2: 'MN Season 2',
        seasonMn1: 'MN Season 1',

        // SimC Tool
        simcTitle: 'Character Comparison',
        simcBadge: 'SimulationCraft (/simc)',
        simcSubtitle: 'Paste your in-game <span class="text-amber-400 font-mono font-bold">/simc</span> export to compare your stats against the Top 50 and receive seasonal dungeon set recommendations',
        loadSample: 'Load sample',
        collapse: 'Collapse',
        expand: 'Expand',
        simcPlaceholder: 'Paste your in-game /simc exported text here... (e.g. deathknight="MyCharacter" head=,id=...)',
        simcNote: 'Compares your stats against the Top 50 and recommends coordinated dungeon packages to replace prior items without unbalancing stats.',
        compareBtn: 'Compare My Character',

        // Progress & Loading
        loadingData: 'Loading data...',
        queryingApis: 'Querying live APIs',

        // Toolbar
        collapseAll: 'Collapse all sections',
        expandAll: 'Expand all',

        // Consensus & Diagnostics
        consensusTitle: 'Secondary Stats Consensus',
        consensusSubtitle: 'Average and stat distribution of top 50 ranked players',
        consensusSubtitleExclude: 'Average and distribution recalculated excluding ilvl 344 pieces',
        statDistribution: 'Proportional Stat Distribution',
        charDistribution: 'Your Character Distribution',
        top50Distribution: 'Top 50 Distribution',
        detailedDiagnostic: 'Detailed Diagnostic by Secondary Stat',
        yourCharacter: 'Your Character',
        top50Avg: 'Top 50 Average',

        // Stat Names
        crit: 'Critical Strike',
        haste: 'Haste',
        mastery: 'Mastery',
        vers: 'Versatility',

        // Paperdoll Tabs
        seasonDetectionTitle: 'Season Detection & Slot Inspection',
        tabActual: 'Current',
        tabOptimal: 'Optimal',
        tabRecommended: 'Recommended',
        tabAlternative: 'Alternative',

        // Paperdoll Slots & Badges
        replaces: 'Replaces',
        keptPiece: 'Piece kept in this set',
        currentKept: 'Current piece kept in this set',
        lockedTooltip: 'Kept (Click to mark for replacement)',
        unlockedTooltip: 'To Replace (Click to lock/keep)',
        twoHandWeapon: '2-Hand Weapon',
        twoHand: '2-Hand',
        freeSlot: 'Free slot / not required',
        covered: 'Covered',
        shirt: 'Shirt',
        tabard: 'Tabard',
        emptyCosmetic: 'Empty cosmetic slot',
        trinketKept: 'Conserved trinket',
        dropIn: 'Drops in',
        sparkCraft: 'Spark Crafting',
        boss: 'Boss',
        raid: 'Raid',
        dungeonMPlus: 'M+ Dungeon',

        // Top 50 Tab Section
        tabSlotsTitle: 'Most Popular Items by Slot',
        tabSlotsSubtitle: 'Most popular trinkets, weapons, and rings in Top 50',
        tabCraftedTitle: 'Most Used Crafted Items',
        tabCraftedSubtitle: 'Spark or profession crafted pieces chosen over dungeon or raid drops',
        tabGemsTitle: 'Common Gems & Enchantments',
        tabGemsSubtitle: 'Top chosen gem sockets and consensus enchantments per slot',

        top50BuildsBadge: 'Top 50 Builds',
        professionsBadge: 'Professions & Embellishments',
        socketsBadge: 'Sockets & Enchants',

        btnBySlot: 'By Slot',
        btnCrafted: 'Crafted',
        btnGems: 'Gems & Enchants',

        gemsSubcardTitle: 'Most Used Gems',
        gemsSubcardSubtitle: 'Gems with highest frequency in prismatic sockets',
        enchantsSubcardTitle: 'Enchantments by Slot',
        enchantsSubcardSubtitle: 'Most chosen enchantment for each gear slot',

        // Raid Boss Loot Section
        raidLootTitle: 'Recommended Raid Loot',
        raidLootSubtitle: 'Raid drops used by Top 50 players grouped by boss',

        // Player Comparison Table
        tableTitle: 'Detailed Top 50 Player Comparison',
        tableSubtitle: 'Breakdown of individual secondary stats and equipped gear',
        thRank: 'Rank',
        thPlayer: 'Player',
        thSpec: 'Spec',
        thScore: 'M+ Score',
        thIlvl: 'ilvl',
        thCrit: 'Crit',
        thHaste: 'Haste',
        thMastery: 'Mastery',
        thVers: 'Versatility',
        thGear: 'Gear',

        // Storage & Badges
        restoredBadge: 'Last analysis restored',
        delete: 'Clear',
        agoMoment: 'just now',
        agoMin: '{n} min ago',
        agoH: '{n} h ago',

        // Footer
        footerData: 'Real-time data provided by <a href="https://raider.io" target="_blank" class="text-amber-400 hover:underline">Raider.IO</a> and tooltips from <a href="https://wowhead.com" target="_blank" class="text-yellow-400 hover:underline">Wowhead</a>.',
        footerBlizzard: 'World of Warcraft® is a registered trademark of Blizzard Entertainment.'
    }
};

let currentLang = 'es';

try {
    const saved = localStorage.getItem('wow_lang');
    if (saved && (saved === 'es' || saved === 'en')) {
        currentLang = saved;
    }
} catch (e) {
    currentLang = 'es';
}

function getLanguage() {
    return currentLang;
}

function t(key, params = {}) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.es;
    let text = dict[key] !== undefined ? dict[key] : (TRANSLATIONS.es[key] !== undefined ? TRANSLATIONS.es[key] : key);
    if (params && typeof params === 'object') {
        Object.keys(params).forEach(k => {
            text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
        });
    }
    return text;
}

function setLanguage(lang) {
    if (lang !== 'es' && lang !== 'en') return;
    currentLang = lang;
    try {
        localStorage.setItem('wow_lang', lang);
    } catch (e) {
        console.warn('Could not save language to localStorage:', e);
    }

    document.documentElement.lang = lang;

    // Update active button classes on language switchers
    const btnEs = document.getElementById('lang-btn-es');
    const btnEn = document.getElementById('lang-btn-en');
    if (btnEs && btnEn) {
        if (lang === 'es') {
            btnEs.className = 'px-2 py-0.5 rounded text-xs font-black bg-amber-500 text-black shadow-sm transition';
            btnEn.className = 'px-2 py-0.5 rounded text-xs font-bold text-gray-400 hover:text-white transition';
        } else {
            btnEn.className = 'px-2 py-0.5 rounded text-xs font-black bg-amber-500 text-black shadow-sm transition';
            btnEs.className = 'px-2 py-0.5 rounded text-xs font-bold text-gray-400 hover:text-white transition';
        }
    }

    // Apply translations to all DOM elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key && (TRANSLATIONS[lang]?.[key] || TRANSLATIONS.es?.[key])) {
            el.innerHTML = t(key);
        }
    });

    // Apply placeholder translations
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) el.setAttribute('placeholder', t(key));
    });

    // Apply title translations
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (key) el.setAttribute('title', t(key));
    });

    // Re-render Top 50 results if present to update tab titles, stats and table headers
    if (window.cachedPlayers && window.cachedPlayers.length > 0 && typeof window.renderResults === 'function') {
        window.renderResults(window.cachedPlayers, window.cachedClassSlug, window.cachedSpecSlug);
    }

    // Re-render SimC comparison if present
    if (window.activeSimCProfile && typeof window.renderSimCComparisonResults === 'function') {
        window.renderSimCComparisonResults();
    }
}

// Initial setup when DOM is ready
if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('DOMContentLoaded', () => {
        setLanguage(currentLang);
    });
}

if (typeof window !== 'undefined') {
    window.TRANSLATIONS = TRANSLATIONS;
    window.getLanguage = getLanguage;
    window.setLanguage = setLanguage;
    window.t = t;
}
