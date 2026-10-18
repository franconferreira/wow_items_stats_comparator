/**
 * constants.js
 * Game definitions, class/spec mappings, colors, and static configuration constants.
 */

// Class configurations with specs, roles, and official Blizzard colors
const WOW_CLASSES = {
    'death-knight': {
        name: 'Death Knight',
        color: '#C41E3A',
        icon: 'spell_deathknight_classicon',
        specs: [
            { slug: 'blood', name: 'Blood', role: 'tank' },
            { slug: 'frost', name: 'Frost', role: 'dps' },
            { slug: 'unholy', name: 'Unholy', role: 'dps' }
        ]
    },
    'demon-hunter': {
        name: 'Demon Hunter',
        color: '#A330C9',
        icon: 'achievement_boss_illidan',
        specs: [
            { slug: 'havoc', name: 'Havoc', role: 'dps' },
            { slug: 'vengeance', name: 'Vengeance', role: 'tank' }
        ]
    },
    'druid': {
        name: 'Druid',
        color: '#FF7C0A',
        icon: 'classicon_druid',
        specs: [
            { slug: 'balance', name: 'Balance', role: 'dps' },
            { slug: 'feral', name: 'Feral', role: 'dps' },
            { slug: 'guardian', name: 'Guardian', role: 'tank' },
            { slug: 'restoration', name: 'Restoration', role: 'healer' }
        ]
    },
    'evoker': {
        name: 'Evoker',
        color: '#33937F',
        icon: 'classicon_evoker',
        specs: [
            { slug: 'devastation', name: 'Devastation', role: 'dps' },
            { slug: 'preservation', name: 'Preservation', role: 'healer' },
            { slug: 'augmentation', name: 'Augmentation', role: 'dps' }
        ]
    },
    'hunter': {
        name: 'Hunter',
        color: '#AAD372',
        icon: 'classicon_hunter',
        specs: [
            { slug: 'beast-mastery', name: 'Beast Mastery', role: 'dps' },
            { slug: 'marksmanship', name: 'Marksmanship', role: 'dps' },
            { slug: 'survival', name: 'Survival', role: 'dps' }
        ]
    },
    'mage': {
        name: 'Mage',
        color: '#3FC7EB',
        icon: 'classicon_mage',
        specs: [
            { slug: 'arcane', name: 'Arcane', role: 'dps' },
            { slug: 'fire', name: 'Fire', role: 'dps' },
            { slug: 'frost', name: 'Frost', role: 'dps' }
        ]
    },
    'monk': {
        name: 'Monk',
        color: '#00FF98',
        icon: 'classicon_monk',
        specs: [
            { slug: 'brewmaster', name: 'Brewmaster', role: 'tank' },
            { slug: 'mistweaver', name: 'Mistweaver', role: 'healer' },
            { slug: 'windwalker', name: 'Windwalker', role: 'dps' }
        ]
    },
    'paladin': {
        name: 'Paladin',
        color: '#F48CBA',
        icon: 'classicon_paladin',
        specs: [
            { slug: 'holy', name: 'Holy', role: 'healer' },
            { slug: 'protection', name: 'Protection', role: 'tank' },
            { slug: 'retribution', name: 'Retribution', role: 'dps' }
        ]
    },
    'priest': {
        name: 'Priest',
        color: '#FFFFFF',
        icon: 'classicon_priest',
        specs: [
            { slug: 'discipline', name: 'Discipline', role: 'healer' },
            { slug: 'holy', name: 'Holy', role: 'healer' },
            { slug: 'shadow', name: 'Shadow', role: 'dps' }
        ]
    },
    'rogue': {
        name: 'Rogue',
        color: '#FFF468',
        icon: 'classicon_rogue',
        specs: [
            { slug: 'assassination', name: 'Assassination', role: 'dps' },
            { slug: 'outlaw', name: 'Outlaw', role: 'dps' },
            { slug: 'subtlety', name: 'Subtlety', role: 'dps' }
        ]
    },
    'shaman': {
        name: 'Shaman',
        color: '#0070DD',
        icon: 'classicon_shaman',
        specs: [
            { slug: 'elemental', name: 'Elemental', role: 'dps' },
            { slug: 'enhancement', name: 'Enhancement', role: 'dps' },
            { slug: 'restoration', name: 'Restoration', role: 'healer' }
        ]
    },
    'warlock': {
        name: 'Warlock',
        color: '#8788EE',
        icon: 'classicon_warlock',
        specs: [
            { slug: 'affliction', name: 'Affliction', role: 'dps' },
            { slug: 'demonology', name: 'Demonology', role: 'dps' },
            { slug: 'destruction', name: 'Destruction', role: 'dps' }
        ]
    },
    'warrior': {
        name: 'Warrior',
        color: '#C69B6D',
        icon: 'classicon_warrior',
        specs: [
            { slug: 'arms', name: 'Arms', role: 'dps' },
            { slug: 'fury', name: 'Fury', role: 'dps' },
            { slug: 'protection', name: 'Protection', role: 'tank' }
        ]
    }
};

// Secondary stats definitions and colors
const STAT_COLORS = {
    'Critical Strike': { name: 'Crítico', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b' },
    'Haste': { name: 'Celeridad', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981' },
    'Mastery': { name: 'Maestría', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7' },
    'Versatility': { name: 'Versatilidad', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', border: '#06b6d4' }
};

// Set of bonus IDs that uniquely indicate crafted (Sparks, profession embellishments, crafting quality)
const CRAFTED_BONUS_SET = new Set([
    12214, 13667, 13751, 14001, 8792, 10222, 10223, 10224, 10225, 9637, 9638, 9639,
    9467, 9468, 9469, 9470, 9471, 9472, 9473, 9474, 9475, 9476, 8836, 8837, 8838, 8839
]);

// Universal WoW string sanitizer (removes color codes like |cff..., |cnIQ4:..., |r, and hyperlinks)
function cleanWoWString(str) {
    if (!str || typeof str !== 'string') return '';
    return str
        .replace(/\|c[0-9a-fA-F]{8}/gi, '')
        .replace(/\|cn[A-Za-z0-9_]+:/gi, '')
        .replace(/\|r/gi, '')
        .replace(/\|H[^|]+\|h([^|]*)\|h/gi, '$1')
        .trim();
}

// Localized stat names helper
function getStatName(statKey, short = false) {
    const lang = (typeof getLanguage === 'function') ? getLanguage() : 'es';
    const dict = {
        'Critical Strike': {
            es: short ? 'Crítico' : 'Golpe Crítico',
            en: short ? 'Crit' : 'Critical Strike'
        },
        'Haste': {
            es: 'Celeridad',
            en: 'Haste'
        },
        'Mastery': {
            es: 'Maestría',
            en: 'Mastery'
        },
        'Versatility': {
            es: short ? 'Vers' : 'Versatilidad',
            en: short ? 'Vers' : 'Versatility'
        }
    };
    if (dict[statKey]) {
        return dict[statKey][lang] || dict[statKey].es;
    }
    return statKey;
}

// Localized class and spec names
const CLASS_NAMES_ES = {
    'death-knight': 'Caballero de la Muerte',
    'demon-hunter': 'Cazador de Demonios',
    'druid': 'Druida',
    'evoker': 'Evocador',
    'hunter': 'Cazador',
    'mage': 'Mago',
    'monk': 'Monje',
    'paladin': 'Paladín',
    'priest': 'Sacerdote',
    'rogue': 'Pícaro',
    'shaman': 'Chamán',
    'warlock': 'Brujo',
    'warrior': 'Guerrero'
};

const SPEC_NAMES_ES = {
    'blood': 'Sangre',
    'frost': 'Escarcha',
    'unholy': 'Profano',
    'havoc': 'Devastación',
    'vengeance': 'Venganza',
    'balance': 'Equilibrio',
    'feral': 'Feral',
    'guardian': 'Guardián',
    'restoration': 'Restauración',
    'devastation': 'Devastación',
    'preservation': 'Preservación',
    'augmentation': 'Aumento',
    'beast-mastery': 'Bestias',
    'beast mastery': 'Bestias',
    'marksmanship': 'Puntería',
    'survival': 'Supervivencia',
    'arcane': 'Arcano',
    'fire': 'Fuego',
    'brewmaster': 'Maestro Cervecero',
    'mistweaver': 'Tejedor de Niebla',
    'windwalker': 'Viajero del Viento',
    'holy': 'Sagrado',
    'protection': 'Protección',
    'retribution': 'Reprensión',
    'discipline': 'Disciplina',
    'shadow': 'Sombras',
    'assassination': 'Asesinato',
    'outlaw': 'Forajido',
    'subtlety': 'Sutileza',
    'elemental': 'Elemental',
    'enhancement': 'Mejora',
    'affliction': 'Aflicción',
    'demonology': 'Demonología',
    'destruction': 'Destrucción',
    'arms': 'Armas',
    'fury': 'Furia'
};

function getLocalizedClassName(classSlug) {
    const lang = (typeof getLanguage === 'function') ? getLanguage() : 'es';
    const slug = (classSlug || '').toLowerCase();
    if (lang === 'es' && CLASS_NAMES_ES[slug]) {
        return CLASS_NAMES_ES[slug];
    }
    const cData = WOW_CLASSES[slug];
    return cData ? cData.name : (classSlug ? classSlug.replace('-', ' ') : 'Clase');
}

function getLocalizedSpecName(classSlug, specSlug) {
    const lang = (typeof getLanguage === 'function') ? getLanguage() : 'es';
    const sSlug = (specSlug || '').toLowerCase();
    if (lang === 'es' && SPEC_NAMES_ES[sSlug]) {
        return SPEC_NAMES_ES[sSlug];
    }
    const cData = WOW_CLASSES[(classSlug || '').toLowerCase()];
    const specObj = cData?.specs?.find(s => s.slug === sSlug || s.name.toLowerCase() === sSlug);
    return specObj ? specObj.name : (specSlug ? specSlug.charAt(0).toUpperCase() + specSlug.slice(1) : '');
}

// Localized Dungeon & Boss translations
const DUNGEON_NAMES_MAP = {
    "Kings' Rest": { es: "Reposo de los Reyes", en: "Kings' Rest" },
    "Temple of Sethraliss": { es: "Templo de Sethraliss", en: "Temple of Sethraliss" },
    "Murder Row": { es: "Callejón del Asesinato", en: "Murder Row" },
    "Voidscar Arena": { es: "Arena Cicatriz del Vacío", en: "Voidscar Arena" },
    "Altar of Fangs": { es: "Altar de los Colmillos", en: "Altar of Fangs" },
    "Ruby Life Pools": { es: "Estanques de Vida Rubí", en: "Ruby Life Pools" },
    "Den of Nalorakk": { es: "Guarida de Nalorakk", en: "Den of Nalorakk" },
    "The Blinding Vale": { es: "El Valle Cegador", en: "The Blinding Vale" },
    "The Venomous Abyss": { es: "El Abismo Venenoso", en: "The Venomous Abyss" },
    "Zul'Aman / Hex Lord Malacrass": { es: "Zul'Aman / Señor Aojador Malacrass", en: "Zul'Aman / Hex Lord Malacrass" },
    "World Bosses & Mini-Raids": { es: "Jefes de Mundo y Mini-Bandas", en: "World Bosses & Mini-Raids" }
};

const BOSS_NAMES_MAP = {
    "King Dazar": { es: "Rey Dazar", en: "King Dazar" },
    "Kystia Manaheart": { es: "Kystia Corazón de Maná", en: "Kystia Manaheart" },
    "Atroxus": { es: "Atroxus", en: "Atroxus" },
    "Avatar of Sethraliss": { es: "Avatar de Sethraliss", en: "Avatar of Sethraliss" },
    "The Writhing Coil": { es: "La Espiral Serpenteante", en: "The Writhing Coil" },
    "Jefe de Mazmorra": { es: "Jefe de Mazmorra", en: "Dungeon Boss" },
    "Dungeon Boss": { es: "Jefe de Mazmorra", en: "Dungeon Boss" },
    "Lightwarden Ruia": { es: "Celadora de la Luz Ruia", en: "Lightwarden Ruia" },
    "Mchimba the Embalmer": { es: "Mchimba el Embalsamador", en: "Mchimba the Embalmer" },
    "Zaen Bladesorrow": { es: "Zaen Penahojas", en: "Zaen Bladesorrow" },
    "The Golden Serpent": { es: "La Serpiente Dorada", en: "The Golden Serpent" },
    "Merektha": { es: "Merektha", en: "Merektha" },
    "Ziekket": { es: "Ziekket", en: "Ziekket" },
    "Taz'Rah": { es: "Taz'Rah", en: "Taz'Rah" },
    "The Hoardmonger": { es: "El Tratante de Alijos", en: "The Hoardmonger" },
    "Aka'ali the Conqueror": { es: "Aka'ali la Conquistadora", en: "Aka'ali the Conqueror" },
    "Galvazzt": { es: "Galvazzt", en: "Galvazzt" },
    "Meittik": { es: "Meittik", en: "Meittik" },
    "Rav'i": { es: "Rav'i", en: "Rav'i" },
    "Melidrussa Chillworn": { es: "Melidrussa Faucefría", en: "Melidrussa Chillworn" },
    "Lithiel Cinderfury": { es: "Lithiel Furiaceniza", en: "Lithiel Cinderfury" },
    "Kokia Blazehoof": { es: "Kokia Pezuña de Fuego", en: "Kokia Blazehoof" },
    "Xathuux the Annihilator": { es: "Xathuux el Aniquilador", en: "Xathuux the Annihilator" },
    "Ikuzz the Light Hunter": { es: "Ikuzz el Cazador de Luz", en: "Ikuzz the Light Hunter" },
    "Charonus": { es: "Charonus", en: "Charonus" },
    "Sentinel of Winter": { es: "Centinela del Invierno", en: "Sentinel of Winter" },
    "Kyrakka and Erkhart Stormvein": { es: "Kyrakka y Erkhart Vena de Tormenta", en: "Kyrakka and Erkhart Stormvein" },
    "Ula'tek": { es: "Ula'tek", en: "Ula'tek" },
    "The Coiled Altar": { es: "El Altar Enroscado", en: "The Coiled Altar" },
    "The Twin Fangs": { es: "Los Colmillos Gemelos", en: "The Twin Fangs" },
    "Sszorak": { es: "Sszorak", en: "Sszorak" },
    "Vashnik the Malignant": { es: "Vashnik el Maligno", en: "Vashnik the Malignant" },
    "The Lost Explorers": { es: "Los Exploradores Perdidos", en: "The Lost Explorers" },
    "Entombed Sentinels": { es: "Centinelas Sepultados", en: "Entombed Sentinels" },
    "Nek'zali the Soulcoiler": { es: "Nek'zali el Atador de Almas", en: "Nek'zali the Soulcoiler" },
    "Hex Lord Malacrass": { es: "Señor Aojador Malacrass", en: "Hex Lord Malacrass" },
    "Hex Lord Malacrass / Zul'jan": { es: "Señor Aojador Malacrass / Zul'jan", en: "Hex Lord Malacrass / Zul'jan" },
    "Nymrissa Wavecaller": { es: "Nymrissa Clamaolas", en: "Nymrissa Wavecaller" },
    "Rotmire": { es: "Ciénaga Podrida", en: "Rotmire" },
    "Kith'ix": { es: "Kith'ix", en: "Kith'ix" }
};

function getLocalizedDungeonName(name) {
    if (!name) return '';
    const lang = (typeof getLanguage === 'function') ? getLanguage() : 'es';
    if (DUNGEON_NAMES_MAP[name]) {
        return DUNGEON_NAMES_MAP[name][lang] || DUNGEON_NAMES_MAP[name].es;
    }
    return name;
}

function getLocalizedBossName(name) {
    if (!name) return '';
    const lang = (typeof getLanguage === 'function') ? getLanguage() : 'es';
    if (BOSS_NAMES_MAP[name]) {
        return BOSS_NAMES_MAP[name][lang] || BOSS_NAMES_MAP[name].es;
    }
    return name;
}

const SLOT_NAMES_ES = {
    head: 'Casco',
    neck: 'Cuello',
    shoulder: 'Hombreras',
    back: 'Capa',
    chest: 'Pechera',
    shirt: 'Camisa',
    tabard: 'Tabardo',
    wrist: 'Brazales',
    hands: 'Guantes',
    waist: 'Cinturón',
    legs: 'Pantalones',
    feet: 'Botas',
    finger: 'Anillo',
    finger1: 'Anillo 1',
    finger2: 'Anillo 2',
    trinket: 'Abalorio',
    trinket1: 'Abalorio 1',
    trinket2: 'Abalorio 2',
    mainhand: 'Arma Principal',
    main_hand: 'Arma Principal',
    offhand: 'Mano Secundaria',
    off_hand: 'Mano Secundaria'
};

const SLOT_NAMES_EN = {
    head: 'Head',
    neck: 'Neck',
    shoulder: 'Shoulder',
    back: 'Back',
    chest: 'Chest',
    shirt: 'Shirt',
    tabard: 'Tabard',
    wrist: 'Wrist',
    hands: 'Hands',
    waist: 'Waist',
    legs: 'Legs',
    feet: 'Feet',
    finger: 'Ring',
    finger1: 'Ring 1',
    finger2: 'Ring 2',
    trinket: 'Trinket',
    trinket1: 'Trinket 1',
    trinket2: 'Trinket 2',
    mainhand: 'Main Hand',
    main_hand: 'Main Hand',
    offhand: 'Off Hand',
    off_hand: 'Off Hand'
};

function getSlotName(slotKey) {
    const lang = (typeof getLanguage === 'function') ? getLanguage() : 'es';
    if (lang === 'en') {
        return SLOT_NAMES_EN[slotKey] || SLOT_NAMES_ES[slotKey] || slotKey;
    }
    return SLOT_NAMES_ES[slotKey] || slotKey;
}


const CLASS_ARMOR_MAP = {
    'death-knight': 'plate',
    'paladin': 'plate',
    'warrior': 'plate',
    'hunter': 'mail',
    'shaman': 'mail',
    'evoker': 'mail',
    'demon-hunter': 'leather',
    'druid': 'leather',
    'monk': 'leather',
    'rogue': 'leather',
    'mage': 'cloth',
    'priest': 'cloth',
    'warlock': 'cloth'
};

const SIMC_CLASS_MAP = {
    deathknight: 'death-knight',
    demonhunter: 'demon-hunter',
    druid: 'druid',
    evoker: 'evoker',
    hunter: 'hunter',
    mage: 'mage',
    monk: 'monk',
    paladin: 'paladin',
    priest: 'priest',
    rogue: 'rogue',
    shaman: 'shaman',
    warlock: 'warlock',
    warrior: 'warrior'
};

const SAMPLE_SIMC_STRING = `# SimulationCraft Profile Export (Ejemplo de Prueba)
deathknight="Franco"
level=80
race=blood_elf
region=us
server=quelthalas
role=tank
spec=blood

head=,id=271474,bonus_id=6652/13335/12854/13696/13692/13698/1587,enchant_id=243981
neck=,id=268265,bonus_id=6652/13668/13335/13848/13987,gem_id=240983/240894
shoulder=,id=271472,bonus_id=6652/13335/12854/13694/13697/1587,enchant_id=243963
back=,id=268253,bonus_id=6652/13662/13335/13848
chest=,id=271477,bonus_id=13335/13690/6652/13698/12854,enchant_id=243977
wrist=,id=237834,bonus_id=12214/13667/13695/12497/13751/14001/8960/12384/8792/13836/13696,gem_id=240894
hands=,id=237836,bonus_id=12214/13667/12497/13751/14001/8960/12384/8792/13836
waist=,id=271445,bonus_id=6652/13695/13662/13335/10844/12854,gem_id=240894
legs=,id=271473,bonus_id=6652/13335/13708/13848/13693/13698/1597,enchant_id=244641
feet=,id=268260,bonus_id=6652/13662/13335/12854,enchant_id=244009
finger1=,id=268266,bonus_id=6652/13668/13335/12854,gem_id=240894,enchant_id=243957
finger2=,id=268252,bonus_id=6652/13668/13335/12854,gem_id=240914,enchant_id=243957
trinket1=,id=270175,bonus_id=6652/13334/12854
trinket2=,id=270173,bonus_id=6652/13335/13848
main_hand=,id=268213,bonus_id=6652/13335/13848`;

if (typeof window !== 'undefined') {
    window.cleanWoWString = cleanWoWString;
    window.getStatName = getStatName;
    window.getLocalizedClassName = getLocalizedClassName;
    window.getLocalizedSpecName = getLocalizedSpecName;
    window.getLocalizedDungeonName = getLocalizedDungeonName;
    window.getLocalizedBossName = getLocalizedBossName;
    window.WOW_CLASSES = WOW_CLASSES;
    window.STAT_COLORS = STAT_COLORS;
    window.CRAFTED_BONUS_SET = CRAFTED_BONUS_SET;
    window.SLOT_NAMES_ES = SLOT_NAMES_ES;
    window.SLOT_NAMES_EN = SLOT_NAMES_EN;
    window.getSlotName = getSlotName;
    window.CLASS_ARMOR_MAP = CLASS_ARMOR_MAP;
    window.SIMC_CLASS_MAP = SIMC_CLASS_MAP;
    window.SAMPLE_SIMC_STRING = SAMPLE_SIMC_STRING;
}
