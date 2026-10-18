/**
 * loot-data.js
 * Authentic Season Dungeon Loot pool (~ilvl 330) and Raid Boss encounters with Tier tokens.
 */

// Season Raid Bosses & Loot Priority
const SEASON_RAID_DATA = {
    'season-mn-2': [
        {
            raidName: 'The Venomous Abyss',
            raidDesc: 'Banda Principal de Midnight Temporada 2',
            bosses: [
                {
                    name: "Ula'tek",
                    title: 'Último Jefe de Banda (Encounter 8)',
                    npcId: 268956,
                    slug: 'ulatek',
                    bossImage: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-ulatek.png',
                    bossIcon: 'inv_misc_head_dragon_green',
                    patterns: ["Voracious Heart of Ula'tek", "Aqirbane Reliquary", "Chausses of Unbound Rancor", "Breath of Ula'tek", "Keeper's Seething Core", "Ula'tek"],
                    tierToken: 'Omnitoken de Tier (Cualquier ranura / Curio)'
                },
                {
                    name: 'The Coiled Altar',
                    title: 'Encuentro 7',
                    npcId: 268430,
                    slug: 'kursak-the-coiled',
                    bossIcon: 'inv_relics_idolofrejuvenation',
                    patterns: ['Coiled Altar', 'Coiled'],
                    tierSlot: 'head',
                    tierToken: 'Token de Casco Tier'
                },
                {
                    name: 'The Twin Fangs',
                    title: 'Encuentro 6',
                    bossIcon: 'achievement_boss_shadeoferanikus',
                    patterns: ['Twin Fangs', 'Fang'],
                    tierSlot: 'shoulder',
                    tierToken: 'Token de Hombreras Tier'
                },
                {
                    name: 'Sszorak',
                    title: 'Encuentro 5',
                    npcId: 257347,
                    slug: 'sszorak',
                    bossImage: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-brute.png',
                    bossIcon: 'inv_misc_monsterhead_03',
                    patterns: ["Apex Brute's Claw Ring", 'Sszorak'],
                    tierSlot: 'chest',
                    tierToken: 'Token de Pechera Tier'
                },
                {
                    name: 'Vashnik the Malignant',
                    title: 'Encuentro 4',
                    npcId: 259181,
                    slug: 'vashnik',
                    bossIcon: 'inv_potion_68',
                    patterns: ["Scaled Fiend's Warboots", "Vile Alchemist's Band", 'Vashnik'],
                    tierSlot: 'legs',
                    tierToken: 'Token de Pantalones Tier'
                },
                {
                    name: 'The Lost Explorers',
                    title: 'Encuentro 3',
                    bossIcon: 'inv_misc_spyglass_02',
                    patterns: ['Lost Explorers'],
                    tierSlot: 'hands',
                    tierToken: 'Token de Guantes Tier'
                },
                {
                    name: 'Entombed Sentinels',
                    title: 'Encuentro 2',
                    bossIcon: 'inv_helmet_147',
                    patterns: ['Entombed Sentinels', 'Entombed']
                },
                {
                    name: "Nek'zali the Soulcoiler",
                    title: 'Encuentro 1',
                    npcId: 259927,
                    slug: 'nekzali-the-soulcoiler',
                    bossIcon: 'inv_misc_head_troll_01',
                    patterns: ["Entombed Cultist's Sabatons", "Amani Summoning Shawl", "Nek'zali", "Soulcoiler"]
                }
            ]
        },
        {
            raidName: "Zul'Aman / Hex Lord Malacrass",
            raidDesc: 'Encuentro Épico / Banda de Mazmorra',
            bosses: [
                {
                    name: "Hex Lord Malacrass / Zul'jan",
                    title: 'Jefe Supremo',
                    npcId: 24239,
                    slug: 'hex-lord-malacrass',
                    bossIcon: 'achievement_boss_zuljin',
                    patterns: ["Zul'jin's Guillotine Technique", "Maze-roa, Warlord's Fury", "Silken Voodoo Drape", "Girdle of Toxic Regret", "Malacrass", "Zul'jin", "Zul'jan"]
                }
            ]
        },
        {
            raidName: 'Jefes de Mundo y Mini-Bandas (Midnight)',
            raidDesc: 'Encuentros de Asalto y Jefes Semanales',
            bosses: [
                {
                    name: 'Nymrissa Wavecaller',
                    title: 'The Tidebound Grotto',
                    npcId: 252959,
                    slug: 'nymrissa-wavecaller',
                    bossImage: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-nagasorcerer.png',
                    bossIcon: 'ability_druid_primaltenacity',
                    patterns: ['Alluring Bubbleband', 'Swelling Sea Spaulders', 'Nymrissa', 'Wavecaller']
                },
                {
                    name: 'Rotmire',
                    title: 'Sporefall',
                    npcId: 254176,
                    slug: 'rotmire',
                    bossImage: 'https://wow.zamimg.com/images/wow/journal/ui-ej-boss-fungariangiant.png',
                    bossIcon: 'spell_shadow_plaguecloud',
                    patterns: ['Rotmire', 'Sporefall']
                },
                {
                    name: "Kith'ix",
                    title: "The Unbinding of Kith'ix",
                    npcId: 267861,
                    slug: 'kithix',
                    bossIcon: 'achievement_boss_hakkar',
                    patterns: ["Kith'ix", 'Kithix']
                }
            ]
        }
    ],
    'season-mn-1': [
        {
            raidName: 'MN Tier 1 (VS / DR / MQD)',
            raidDesc: 'Banda Principal de Midnight Temporada 1',
            bosses: [
                { name: 'Midnight Falls', title: 'Jefe Final', patterns: ['Midnight Falls'] },
                { name: "Belo'ren, Child of Al'ar", title: 'Encuentro 8', patterns: ["Belo'ren", 'Al\'ar'] },
                { name: 'Chimaerus the Undreamt God', title: 'Encuentro 7', patterns: ['Chimaerus'] },
                { name: 'Crown of the Cosmos', title: 'Encuentro 6', patterns: ['Crown of the Cosmos'] },
                { name: 'Lightblinded Vanguard', title: 'Encuentro 5', patterns: ['Lightblinded'] },
                { name: 'Vaelgor & Ezzorak', title: 'Encuentro 4', patterns: ['Vaelgor', 'Ezzorak'] },
                { name: 'Fallen-King Salhadaar', title: 'Encuentro 3', patterns: ['Salhadaar'] },
                { name: 'Vorasius', title: 'Encuentro 2', patterns: ['Vorasius'] },
                { name: 'Imperator Averzian', title: 'Encuentro 1', patterns: ['Averzian'] }
            ]
        }
    ]
};

// Canonical Season 2 Heroic & Mythic+ Dungeon Loot Pool (~ilvl 330) - 100% Genuine Dungeon Drops (No Raid Gear)
const SEASON_DUNGEON_LOOT = [

    // --- PLATE ---
    { id: 159422, name: "Helm of the Raptor King", icon: "inv_helm_plate_zandalardungeon_c_01", slot: "head", armor: "plate", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Haste': 105, 'Critical Strike': 95 } },
    { id: 239050, name: "Helm of the Raptor King", icon: "inv_helm_plate_zandalardungeon_c_01", slot: "head", armor: "plate", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Haste': 82, 'Versatility': 116 } },
    { id: 251126, name: "Greathelm of Temptation", icon: "inv_helm_plate_dungeonharronir_c_01", slot: "head", armor: "plate", dungeon: "Murder Row", boss: "Kystia Manaheart", stats: { 'Critical Strike': 73, 'Mastery': 124 } },
    { id: 251229, name: "Visor of the Predator", icon: "inv_helm_armor_domanaar_d_01", slot: "head", armor: "plate", dungeon: "Voidscar Arena", boss: "Atroxus", stats: { 'Critical Strike': 128, 'Mastery': 69 } },
    { id: 159423, name: "Pauldrons of the Great Unifier", icon: "inv_shoulder_plate_zandalardungeon_c_01", slot: "shoulder", armor: "plate", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Haste': 105, 'Critical Strike': 95 } },
    { id: 239051, name: "Pauldrons of the Great Unifier", icon: "inv_shoulder_plate_zandalardungeon_c_01", slot: "shoulder", armor: "plate", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Versatility': 84, 'Mastery': 65 } },
    { id: 251138, name: "Cinderfury Shoulderguards", icon: "inv_shoulder_plate_dungeonharronir_c_01", slot: "shoulder", armor: "plate", dungeon: "Murder Row", boss: "Lithiel Cinderfury", stats: { 'Haste': 93, 'Mastery': 55 } },
    { id: 159439, name: "C'thraxxi Binders Pauldrons", icon: "inv_shoulder_plate_zandalardungeon_c_01", slot: "shoulder", armor: "plate", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", stats: { 'Haste': 105, 'Critical Strike': 95 } },
    { id: 239037, name: "C'thraxxi Binders Pauldrons", icon: "inv_shoulder_plate_zandalardungeon_c_01", slot: "shoulder", armor: "plate", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", stats: { 'Critical Strike': 49, 'Haste': 100 } },
    { id: 273787, name: "Aged Interwoven Scaleplate", icon: "inv_chest_plate_outdooramaniloa_c_01", slot: "chest", armor: "plate", dungeon: "Altar of Fangs", boss: "The Writhing Coil", stats: { 'Critical Strike': 103, 'Versatility': 95 } },
    { id: 193753, name: "Breastplate of Soaring Terror", icon: "inv_plate_dragondungeon_c_01_chest", slot: "chest", armor: "plate", dungeon: "Ruby Life Pools", boss: "Jefe de Mazmorra", stats: { 'Haste': 73, 'Mastery': 124 } },
    { id: 159424, name: "Desert Guardian's Breastplate", icon: "inv_chest_plate_zandalardungeon_c_01", slot: "chest", armor: "plate", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", stats: { 'Haste': 105, 'Critical Strike': 95 } },
    { id: 239036, name: "Desert Guardian's Breastplate", icon: "inv_chest_plate_zandalardungeon_c_01", slot: "chest", armor: "plate", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", stats: { 'Critical Strike': 78, 'Mastery': 120 } },
    { id: 251193, name: "Taproot Ribs", icon: "inv_chest_plate_dungeonharronir_c_01", slot: "chest", armor: "plate", dungeon: "The Blinding Vale", boss: "Lightwarden Ruia", stats: { 'Haste': 124, 'Versatility': 73 } },
    { id: 159409, name: "Embalmer's Steadying Bracers", icon: "inv_bracer_plate_zandalardungeon_c_01", slot: "wrist", armor: "plate", dungeon: "Kings' Rest", boss: "Mchimba the Embalmer", stats: { 'Critical Strike': 68, 'Haste': 44 } },
    { id: 251133, name: "Overseer's Vambraces", icon: "inv_bracer_plate_dungeonharronir_c_01", slot: "wrist", armor: "plate", dungeon: "Murder Row", boss: "Zaen Bladesorrow", stats: { 'Critical Strike': 44, 'Haste': 68 } },
    { id: 159425, name: "Shard-Tipped Vambraces", icon: "inv_bracer_plate_zandalardungeon_c_01", slot: "wrist", armor: "plate", dungeon: "Temple of Sethraliss", boss: "Jefe de Mazmorra", stats: { 'Haste': 46, 'Versatility': 65 } },
    { id: 159413, name: "Gauntlets of the Avian Sentinel", icon: "inv_glove_plate_zandalardungeon_c_01", slot: "hands", armor: "plate", dungeon: "Kings' Rest", boss: "The Golden Serpent", stats: { 'Critical Strike': 49, 'Mastery': 100 } },
    { id: 159437, name: "Fangproof Gauntlets", icon: "inv_glove_plate_zandalardungeon_c_01", slot: "hands", armor: "plate", dungeon: "Temple of Sethraliss", boss: "Merektha", stats: { 'Haste': 90, 'Mastery': 58 } },
    { id: 251197, name: "Thornspike Gauntlets", icon: "inv_glove_plate_dungeonharronir_c_01", slot: "hands", armor: "plate", dungeon: "The Blinding Vale", boss: "Ziekket", stats: { 'Versatility': 52, 'Mastery': 96 } },
    { id: 251221, name: "Despondent's Gauntlets", icon: "inv_glove_plate_dungeonharronir_c_01", slot: "hands", armor: "plate", dungeon: "Voidscar Arena", boss: "Taz'Rah", stats: { 'Versatility': 90, 'Mastery': 58 } },
    { id: 251144, name: "Autumn's Boon Belt", icon: "inv_belt_plate_dungeonharronir_c_01", slot: "waist", armor: "plate", dungeon: "Den of Nalorakk", boss: "The Hoardmonger", stats: { 'Versatility': 58, 'Mastery': 90 } },
    { id: 159418, name: "Girdle of Pestilent Purification", icon: "inv_belt_plate_zandalardungeon_c_01", slot: "waist", armor: "plate", dungeon: "Kings' Rest", boss: "Aka'ali the Conqueror", stats: { 'Haste': 93, 'Mastery': 55 } },
    { id: 159442, name: "Sand-Scoured Greatbelt", icon: "inv_belt_plate_zandalardungeon_c_01", slot: "waist", armor: "plate", dungeon: "Temple of Sethraliss", boss: "Galvazzt", stats: { 'Versatility': 93, 'Mastery': 55 } },
    { id: 159435, name: "Legplates of Charged Duality", icon: "inv_pant_plate_zandalardungeon_c_01", slot: "legs", armor: "plate", dungeon: "Temple of Sethraliss", boss: "Jefe de Mazmorra", stats: { 'Critical Strike': 73, 'Versatility': 124 } },
    { id: 251182, name: "Bedrock Breeches", icon: "inv_pant_plate_dungeonharronir_c_01", slot: "legs", armor: "plate", dungeon: "The Blinding Vale", boss: "Meittik", stats: { 'Critical Strike': 120, 'Versatility': 78 } },
    { id: 273777, name: "Poison-Proof Stompers", icon: "inv_boot_plate_outdooramaniloa_c_01", slot: "feet", armor: "plate", dungeon: "Altar of Fangs", boss: "Rav'i", stats: { 'Haste': 77, 'Versatility': 71 } },
    { id: 159412, name: "Auric Puddle Stompers", icon: "inv_boot_plate_zandalardungeon_c_01", slot: "feet", armor: "plate", dungeon: "Kings' Rest", boss: "The Golden Serpent", stats: { 'Critical Strike': 61, 'Versatility': 87 } },
    { id: 193728, name: "Scaleguard's Stalwart Greatboots", icon: "inv_plate_dragondungeon_c_01_boot", slot: "feet", armor: "plate", dungeon: "Ruby Life Pools", boss: "Melidrussa Chillworn", stats: { 'Versatility': 96, 'Mastery': 52 } },

    // --- LEATHER ---
    { id: 251140, name: "Vilefiend's Guise", icon: "inv_helm_leather_dungeonharronir_c_01", slot: "head", armor: "leather", dungeon: "Murder Row", boss: "Lithiel Cinderfury", stats: { 'Haste': 116, 'Mastery': 82 } },
    { id: 193751, name: "Crown of Roaring Storms", icon: "inv_leather_dragondungeon_c_01_helm", slot: "head", armor: "leather", dungeon: "Ruby Life Pools", boss: "Jefe de Mazmorra", stats: { 'Critical Strike': 73, 'Versatility': 124 } },
    { id: 159318, name: "Hood of the Slithering Loa", icon: "inv_helm_leather_zandalardungeon_c_01", slot: "head", armor: "leather", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", stats: { 'Haste': 105, 'Critical Strike': 95 } },
    { id: 239033, name: "Hood of the Slithering Loa", icon: "inv_helm_leather_zandalardungeon_c_01", slot: "head", armor: "leather", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", stats: { 'Critical Strike': 116, 'Haste': 82 } },
    { id: 273774, name: "Snakeskin Spaulders", icon: "inv_shoulder_leather_outdooramaniloa_c_01", slot: "shoulder", armor: "leather", dungeon: "Altar of Fangs", boss: "The Writhing Coil", stats: { 'Critical Strike': 87, 'Versatility': 61 } },
    { id: 251146, name: "Scavenger's Spaulders", icon: "inv_shoulder_leather_dungeonharronir_c_01", slot: "shoulder", armor: "leather", dungeon: "Den of Nalorakk", boss: "The Hoardmonger", stats: { 'Critical Strike': 61, 'Versatility': 87 } },
    { id: 251223, name: "Somber Spaulders", icon: "inv_shoulder_leather_dungeonharronir_c_01", slot: "shoulder", armor: "leather", dungeon: "Voidscar Arena", boss: "Taz'Rah", stats: { 'Critical Strike': 93, 'Haste': 55 } },
    { id: 159303, name: "Vest of Reverent Adoration", icon: "inv_chest_leather_zandalardungeon_c_01", slot: "chest", armor: "leather", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Haste': 105, 'Critical Strike': 95 } },
    { id: 239048, name: "Vest of Reverent Adoration", icon: "inv_chest_leather_zandalardungeon_c_01", slot: "chest", armor: "leather", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Critical Strike': 112, 'Mastery': 86 } },
    { id: 193764, name: "Invader's Firestorm Chestguard", icon: "inv_leather_dragondungeon_c_01_chest", slot: "chest", armor: "leather", dungeon: "Ruby Life Pools", boss: "Kokia Blazehoof", stats: { 'Versatility': 78, 'Mastery': 120 } },
    { id: 251226, name: "Hide of Pestilence", icon: "inv_chest_leather_dungeonharronir_c_01", slot: "chest", armor: "leather", dungeon: "Voidscar Arena", boss: "Atroxus", stats: { 'Critical Strike': 116, 'Versatility': 82 } },
    { id: 159300, name: "Kula's Butchering Wristwraps", icon: "inv_bracer_leather_zandalardungeon_c_01", slot: "wrist", armor: "leather", dungeon: "Kings' Rest", boss: "Aka'ali the Conqueror", stats: { 'Critical Strike': 70, 'Versatility': 41 } },
    { id: 251135, name: "Fury-fletched Armlets", icon: "inv_bracer_leather_dungeonharronir_c_01", slot: "wrist", armor: "leather", dungeon: "Murder Row", boss: "Xathuux the Annihilator", stats: { 'Critical Strike': 41, 'Haste': 70 } },
    { id: 251183, name: "Rootwarden Wraps", icon: "inv_bracer_leather_dungeonharronir_c_01", slot: "wrist", armor: "leather", dungeon: "The Blinding Vale", boss: "Meittik", stats: { 'Critical Strike': 72, 'Mastery': 39 } },
    { id: 159312, name: "Desiccator's Blessed Gloves", icon: "inv_glove_leather_zandalardungeon_c_01", slot: "hands", armor: "leather", dungeon: "Kings' Rest", boss: "Mchimba the Embalmer", stats: { 'Critical Strike': 90, 'Mastery': 58 } },
    { id: 251124, name: "Gauntlets of Fevered Defense", icon: "inv_glove_leather_dungeonharronir_c_01", slot: "hands", armor: "leather", dungeon: "Murder Row", boss: "Kystia Manaheart", stats: { 'Critical Strike': 96, 'Haste': 52 } },
    { id: 193758, name: "Subjugator's Chilling Grips", icon: "inv_leather_dragondungeon_c_01_glove", slot: "hands", armor: "leather", dungeon: "Ruby Life Pools", boss: "Melidrussa Chillworn", stats: { 'Critical Strike': 87, 'Versatility': 61 } },
    { id: 159337, name: "Grips of Electrified Defense", icon: "inv_glove_leather_zandalardungeon_c_01", slot: "hands", armor: "leather", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", stats: { 'Versatility': 68, 'Mastery': 80 } },
    { id: 159301, name: "Primal Dinomancer's Belt", icon: "inv_belt_leather_zandalardungeon_c_01", slot: "waist", armor: "leather", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Critical Strike': 84, 'Haste': 65 } },
    { id: 159317, name: "Whirling Dervish Sash", icon: "inv_belt_leather_zandalardungeon_c_01", slot: "waist", armor: "leather", dungeon: "Temple of Sethraliss", boss: "Jefe de Mazmorra", stats: { 'Haste': 58, 'Mastery': 90 } },
    { id: 251189, name: "Rootwalker Harness", icon: "inv_belt_leather_dungeonharronir_c_01", slot: "waist", armor: "leather", dungeon: "The Blinding Vale", boss: "Ikuzz the Light Hunter", stats: { 'Critical Strike': 55, 'Versatility': 93 } },
    { id: 251235, name: "Gravitic Girdle", icon: "inv_belt_leather_dungeonharronir_c_01", slot: "waist", armor: "leather", dungeon: "Voidscar Arena", boss: "Charonus", stats: { 'Versatility': 96, 'Mastery': 52 } },
    { id: 159313, name: "Breeches of the Sacred Hall", icon: "inv_pant_leather_zandalardungeon_c_01", slot: "legs", armor: "leather", dungeon: "Kings' Rest", boss: "The Golden Serpent", stats: { 'Haste': 82, 'Versatility': 116 } },
    { id: 251130, name: "Breeches of Deft Deals", icon: "inv_pant_leather_dungeonharronir_c_01", slot: "legs", armor: "leather", dungeon: "Murder Row", boss: "Zaen Bladesorrow", stats: { 'Critical Strike': 116, 'Mastery': 82 } },
    { id: 159329, name: "Leggings of the Galeforce Viper", icon: "inv_pant_leather_zandalardungeon_c_01", slot: "legs", armor: "leather", dungeon: "Temple of Sethraliss", boss: "Jefe de Mazmorra", stats: { 'Versatility': 90, 'Mastery': 107 } },
    { id: 251198, name: "Lightspore Leggings", icon: "inv_pant_leather_dungeonharronir_c_01", slot: "legs", armor: "leather", dungeon: "The Blinding Vale", boss: "Ziekket", stats: { 'Versatility': 124, 'Mastery': 73 } },
    { id: 159304, name: "Goldfeather Boots", icon: "inv_boot_leather_zandalardungeon_c_01", slot: "feet", armor: "leather", dungeon: "Kings' Rest", boss: "The Golden Serpent", stats: { 'Versatility': 84, 'Mastery': 65 } },
    { id: 159327, name: "Sand-Shined Snakeskin Sandals", icon: "inv_boot_leather_zandalardungeon_c_01", slot: "feet", armor: "leather", dungeon: "Temple of Sethraliss", boss: "Merektha", stats: { 'Critical Strike': 87, 'Mastery': 61 } },

    // --- MAIL ---
    { id: 193765, name: "Blazebound Lieutenant's Helm", icon: "inv_mail_dragondungeon_c_01_helm", slot: "head", armor: "mail", dungeon: "Ruby Life Pools", boss: "Kokia Blazehoof", stats: { 'Versatility': 73, 'Mastery': 124 } },
    { id: 159374, name: "Sethraliss' Fanged Helm", icon: "inv_helm_mail_zandalardungeon_c_01", slot: "head", armor: "mail", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", stats: { 'Haste': 105, 'Critical Strike': 95 } },
    { id: 239035, name: "Sethraliss' Fanged Helm", icon: "inv_helm_mail_zandalardungeon_c_01", slot: "head", armor: "mail", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", stats: { 'Critical Strike': 78, 'Mastery': 120 } },
    { id: 251220, name: "Voidscarred Crown", icon: "inv_helm_mail_dungeonharronir_c_01", slot: "head", armor: "mail", dungeon: "Voidscar Arena", boss: "Taz'Rah", stats: { 'Haste': 124, 'Mastery': 73 } },
    { id: 159368, name: "Spaulders of Prime Emperor", icon: "inv_shoulder_mail_zandalardungeon_c_01", slot: "shoulder", armor: "mail", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Haste': 105, 'Critical Strike': 95 } },
    { id: 239049, name: "Spaulders of Prime Emperor", icon: "inv_shoulder_mail_zandalardungeon_c_01", slot: "shoulder", armor: "mail", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Critical Strike': 71, 'Haste': 77 } },
    { id: 251131, name: "Jangling Felpaulets", icon: "inv_shoulder_mail_dungeonharronir_c_01", slot: "shoulder", armor: "mail", dungeon: "Murder Row", boss: "Zaen Bladesorrow", stats: { 'Critical Strike': 61, 'Versatility': 87 } },
    { id: 251184, name: "Ironroot Collar", icon: "inv_shoulder_mail_dungeonharronir_c_01", slot: "shoulder", armor: "mail", dungeon: "The Blinding Vale", boss: "Meittik", stats: { 'Haste': 93, 'Versatility': 55 } },
    { id: 158355, name: "Loa-Blessed Chestguard", icon: "inv_chest_mail_zandalardungeon_c_01", slot: "chest", armor: "mail", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Haste': 105, 'Critical Strike': 95 } },
    { id: 239046, name: "Loa-Blessed Chestguard", icon: "inv_chest_mail_zandalardungeon_c_01", slot: "chest", armor: "mail", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Critical Strike': 128, 'Versatility': 69 } },
    { id: 159370, name: "Corrupted Hexxer's Vestments", icon: "inv_chest_mail_zandalardungeon_c_01", slot: "chest", armor: "mail", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", stats: { 'Haste': 105, 'Critical Strike': 95 } },
    { id: 239034, name: "Corrupted Hexxer's Vestments", icon: "inv_chest_mail_zandalardungeon_c_01", slot: "chest", armor: "mail", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", stats: { 'Versatility': 133, 'Mastery': 65 } },
    { id: 251233, name: "Manipulator's Vest", icon: "inv_chest_mail_dungeonharronir_c_01", slot: "chest", armor: "mail", dungeon: "Voidscar Arena", boss: "Charonus", stats: { 'Critical Strike': 124, 'Haste': 73 } },
    { id: 273775, name: "Hydra Scale Wristguards", icon: "inv_bracer_mail_outdooramaniloa_c_01", slot: "wrist", armor: "mail", dungeon: "Altar of Fangs", boss: "Rav'i", stats: { 'Versatility': 51, 'Mastery': 60 } },
    { id: 159380, name: "Arc-Glass Bindings", icon: "inv_bracer_mail_zandalardungeon_c_01", slot: "wrist", armor: "mail", dungeon: "Temple of Sethraliss", boss: "Jefe de Mazmorra", stats: { 'Critical Strike': 68, 'Haste': 44 } },
    { id: 251200, name: "Saptorbane Guards", icon: "inv_bracer_mail_dungeonharronir_c_01", slot: "wrist", armor: "mail", dungeon: "The Blinding Vale", boss: "Ziekket", stats: { 'Critical Strike': 41, 'Haste': 70 } },
    { id: 160213, name: "Sepulchral Construct's Gloves", icon: "inv_glove_mail_zandalardungeon_c_01", slot: "hands", armor: "mail", dungeon: "Kings' Rest", boss: "Mchimba the Embalmer", stats: { 'Haste': 65, 'Mastery': 84 } },
    { id: 193752, name: "Galerattle Gauntlets", icon: "inv_mail_dragondungeon_c_01_glove", slot: "hands", armor: "mail", dungeon: "Ruby Life Pools", boss: "Jefe de Mazmorra", stats: { 'Critical Strike': 61, 'Mastery': 87 } },
    { id: 251165, name: "Pulverizing Pads", icon: "inv_glove_mail_dungeonharronir_c_01", slot: "hands", armor: "mail", dungeon: "The Blinding Vale", boss: "Lightwarden Ruia", stats: { 'Critical Strike': 90, 'Versatility': 58 } },
    { id: 251155, name: "Tribal Defender's Cord", icon: "inv_belt_mail_dungeonharronir_c_01", slot: "waist", armor: "mail", dungeon: "Den of Nalorakk", boss: "Sentinel of Winter", stats: { 'Critical Strike': 93, 'Mastery': 55 } },
    { id: 159369, name: "Belt of the Consecrated Tomb", icon: "inv_belt_mail_zandalardungeon_c_01", slot: "waist", armor: "mail", dungeon: "Kings' Rest", boss: "The Golden Serpent", stats: { 'Haste': 65, 'Versatility': 84 } },
    { id: 251228, name: "Behemoth Waistband", icon: "inv_belt_mail_dungeonharronir_c_01", slot: "waist", armor: "mail", dungeon: "Voidscar Arena", boss: "Atroxus", stats: { 'Haste': 90, 'Mastery': 58 } },
    { id: 251141, name: "Lithiel's Linked Leggings", icon: "inv_pant_mail_dungeonharronir_c_01", slot: "legs", armor: "mail", dungeon: "Murder Row", boss: "Lithiel Cinderfury", stats: { 'Haste': 120, 'Versatility': 78 } },
    { id: 193759, name: "Egg Tender's Leggings", icon: "inv_mail_dragondungeon_c_01_pant", slot: "legs", armor: "mail", dungeon: "Ruby Life Pools", boss: "Melidrussa Chillworn", stats: { 'Haste': 78, 'Versatility': 120 } },
    { id: 159375, name: "Legguards of the Awakening Brood", icon: "inv_pant_mail_zandalardungeon_c_01", slot: "legs", armor: "mail", dungeon: "Temple of Sethraliss", boss: "Merektha", stats: { 'Critical Strike': 116, 'Haste': 82 } },
    { id: 251145, name: "Forgotten Tribe Footguards", icon: "inv_boot_mail_dungeonharronir_c_01", slot: "feet", armor: "mail", dungeon: "Den of Nalorakk", boss: "The Hoardmonger", stats: { 'Haste': 87, 'Versatility': 61 } },
    { id: 159371, name: "Boots of the Headlong Conqueror", icon: "inv_boot_mail_zandalardungeon_c_01", slot: "feet", armor: "mail", dungeon: "Kings' Rest", boss: "Aka'ali the Conqueror", stats: { 'Versatility': 87, 'Mastery': 61 } },
    { id: 251125, name: "Felsoaked Soles", icon: "inv_boot_mail_dungeonharronir_c_01", slot: "feet", armor: "mail", dungeon: "Murder Row", boss: "Kystia Manaheart", stats: { 'Critical Strike': 52, 'Versatility': 96 } },
    { id: 159388, name: "Sabatons of Coruscating Energy", icon: "inv_boot_mail_zandalardungeon_c_01", slot: "feet", armor: "mail", dungeon: "Temple of Sethraliss", boss: "Jefe de Mazmorra", stats: { 'Critical Strike': 65, 'Mastery': 84 } },

    // --- CLOTH ---
    { id: 159236, name: "Headdress of the First Empire", icon: "inv_helm_cloth_zandalardungeon_c_01", slot: "head", armor: "cloth", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Haste': 105, 'Critical Strike': 95 } },
    { id: 239047, name: "Headdress of the First Empire", icon: "inv_helm_cloth_zandalardungeon_c_01", slot: "head", armor: "cloth", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Critical Strike': 86, 'Versatility': 112 } },
    { id: 251199, name: "Worldroot Canopy", icon: "inv_helm_cloth_dungeonharronir_c_01", slot: "head", armor: "cloth", dungeon: "The Blinding Vale", boss: "Ziekket", stats: { 'Critical Strike': 73, 'Mastery': 124 } },
    { id: 251232, name: "Overseer's Diadem", icon: "inv_helm_cloth_dungeonharronir_c_01", slot: "head", armor: "cloth", dungeon: "Voidscar Arena", boss: "Charonus", stats: { 'Haste': 120, 'Mastery': 78 } },
    { id: 158344, name: "Mantle of Ceremonial Ascension", icon: "inv_shoulder_cloth_zandalardungeon_c_01", slot: "shoulder", armor: "cloth", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Haste': 105, 'Critical Strike': 95 } },
    { id: 239045, name: "Mantle of Ceremonial Ascension", icon: "inv_shoulder_cloth_zandalardungeon_c_01", slot: "shoulder", armor: "cloth", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Haste': 51, 'Mastery': 97 } },
    { id: 159254, name: "Brood Cleanser's Amice", icon: "inv_shoulder_cloth_zandalardungeon_c_01", slot: "shoulder", armor: "cloth", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", stats: { 'Haste': 105, 'Critical Strike': 95 } },
    { id: 239031, name: "Brood Cleanser's Amice", icon: "inv_shoulder_cloth_zandalardungeon_c_01", slot: "shoulder", armor: "cloth", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", stats: { 'Critical Strike': 72, 'Haste': 76 } },
    { id: 251227, name: "Poisoner's Pauldrons", icon: "inv_shoulder_cloth_dungeonharronir_c_01", slot: "shoulder", armor: "cloth", dungeon: "Voidscar Arena", boss: "Atroxus", stats: { 'Versatility': 87, 'Mastery': 61 } },
    { id: 273785, name: "Primordial Robe of Rites", icon: "inv_robe_cloth_outdooramaniloa_c_01", slot: "chest", armor: "cloth", dungeon: "Altar of Fangs", boss: "Rav'i", stats: { 'Haste': 103, 'Mastery': 95 } },
    { id: 251139, name: "Summoner's Searing Shirt", icon: "inv_chest_cloth_dungeonharronir_c_01", slot: "chest", armor: "cloth", dungeon: "Murder Row", boss: "Lithiel Cinderfury", stats: { 'Critical Strike': 69, 'Haste': 128 } },
    { id: 159257, name: "Robes of the Reborn Serpent", icon: "inv_chest_cloth_zandalardungeon_c_01", slot: "chest", armor: "cloth", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", stats: { 'Haste': 105, 'Critical Strike': 95 } },
    { id: 239032, name: "Robes of the Reborn Serpent", icon: "inv_chest_cloth_zandalardungeon_c_01", slot: "chest", armor: "cloth", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", stats: { 'Critical Strike': 86, 'Mastery': 112 } },
    { id: 251154, name: "Winter's Embrace Bracers", icon: "inv_bracer_cloth_dungeonharronir_c_01", slot: "wrist", armor: "cloth", dungeon: "Den of Nalorakk", boss: "Sentinel of Winter", stats: { 'Critical Strike': 70, 'Mastery': 41 } },
    { id: 251127, name: "Nibbling Armbands", icon: "inv_bracer_cloth_dungeonharronir_c_01", slot: "wrist", armor: "cloth", dungeon: "Murder Row", boss: "Kystia Manaheart", stats: { 'Critical Strike': 44, 'Haste': 68 } },
    { id: 159263, name: "Bindings of the Slithering Current", icon: "inv_bracer_cloth_zandalardungeon_c_01", slot: "wrist", armor: "cloth", dungeon: "Temple of Sethraliss", boss: "Jefe de Mazmorra", stats: { 'Critical Strike': 65, 'Versatility': 46 } },
    { id: 251129, name: "Counterfeit Clutches", icon: "inv_glove_cloth_dungeonharronir_c_01", slot: "hands", armor: "cloth", dungeon: "Murder Row", boss: "Zaen Bladesorrow", stats: { 'Versatility': 55, 'Mastery': 93 } },
    { id: 159247, name: "Handwraps of Oscillating Polarity", icon: "inv_glove_cloth_zandalardungeon_c_01", slot: "hands", armor: "cloth", dungeon: "Temple of Sethraliss", boss: "Galvazzt", stats: { 'Critical Strike': 100, 'Haste': 49 } },
    { id: 193691, name: "Sky Saddle Cord", icon: "inv_belt_dragondungeon_c_01", slot: "waist", armor: "cloth", dungeon: "Ruby Life Pools", boss: "Jefe de Mazmorra", stats: { 'Haste': 93, 'Mastery': 55 } },
    { id: 159255, name: "Ouroborial Sash", icon: "inv_belt_cloth_zandalardungeon_c_01", slot: "waist", armor: "cloth", dungeon: "Temple of Sethraliss", boss: "Merektha", stats: { 'Versatility': 61, 'Mastery': 87 } },
    { id: 251185, name: "Lightblossom Cinch", icon: "inv_belt_cloth_dungeonharronir_c_01", slot: "waist", armor: "cloth", dungeon: "The Blinding Vale", boss: "Meittik", stats: { 'Haste': 61, 'Mastery': 87 } },
    { id: 251222, name: "Ethereal Netherwrap", icon: "inv_belt_cloth_dungeonharronir_c_01", slot: "waist", armor: "cloth", dungeon: "Voidscar Arena", boss: "Taz'Rah", stats: { 'Critical Strike': 55, 'Haste': 93 } },
    { id: 273786, name: "Leggings of Entwined Serpents", icon: "inv_pant_cloth_outdooramaniloa_c_01", slot: "legs", armor: "cloth", dungeon: "Altar of Fangs", boss: "The Writhing Coil", stats: { 'Critical Strike': 109, 'Haste': 89 } },
    { id: 159234, name: "Down-Lined Breeches", icon: "inv_pant_cloth_zandalardungeon_c_01", slot: "legs", armor: "cloth", dungeon: "Kings' Rest", boss: "The Golden Serpent", stats: { 'Critical Strike': 112, 'Mastery': 86 } },
    { id: 193750, name: "Wind Soarer's Breeches", icon: "inv_pant_cloth_dragondungeon_c_01", slot: "legs", armor: "cloth", dungeon: "Ruby Life Pools", boss: "Jefe de Mazmorra", stats: { 'Critical Strike': 69, 'Mastery': 128 } },
    { id: 159243, name: "Sandals of Wise Voodoo", icon: "inv_boot_cloth_zandalardungeon_c_01", slot: "feet", armor: "cloth", dungeon: "Kings' Rest", boss: "Aka'ali the Conqueror", stats: { 'Haste': 52, 'Versatility': 96 } },
    { id: 251137, name: "Tempestuous Sandals", icon: "inv_boot_cloth_dungeonharronir_c_01", slot: "feet", armor: "cloth", dungeon: "Murder Row", boss: "Xathuux the Annihilator", stats: { 'Haste': 55, 'Mastery': 93 } },
    { id: 159259, name: "Sandswept Sandals", icon: "inv_boot_cloth_zandalardungeon_c_01", slot: "feet", armor: "cloth", dungeon: "Temple of Sethraliss", boss: "Jefe de Mazmorra", stats: { 'Critical Strike': 90, 'Haste': 58 } },
    { id: 251219, name: "Riftworn Stompers", icon: "inv_boot_cloth_dungeonharronir_c_01", slot: "feet", armor: "cloth", dungeon: "Voidscar Arena", boss: "Taz'Rah", stats: { 'Critical Strike': 61, 'Haste': 87 } },

    // --- UNIVERSAL ---
    { id: 273781, name: "Strand of Warding Fangs", icon: "inv_121_jewelry_neck03_teal", slot: "neck", armor: "universal", dungeon: "Altar of Fangs", boss: "The Writhing Coil", stats: { 'Critical Strike': 225, 'Haste': 171 } },
    { id: 251142, name: "Pendant of Malefic Fury", icon: "inv_12_jewelry_silvermoonelf_necklace_green", slot: "neck", armor: "universal", dungeon: "Murder Row", boss: "Lithiel Cinderfury", stats: { 'Haste': 125, 'Mastery': 272 } },
    { id: 251234, name: "Graft of the Domanaar", icon: "inv_12_jewelry_devouringhost_necklace_silver2", slot: "neck", armor: "universal", dungeon: "Voidscar Arena", boss: "Charonus", stats: { 'Critical Strike': 255, 'Mastery': 142 } },
    { id: 159288, name: "Cloak of the Restless Tribes", icon: "inv_cape_mail_zandalardungeon_c_01", slot: "back", armor: "universal", dungeon: "Kings' Rest", boss: "Aka'ali the Conqueror", stats: { 'Versatility': 60, 'Mastery': 51 } },
    { id: 251132, name: "Speakeasy Shroud", icon: "inv_cape_leather_dungeonharronir_c_01", slot: "back", armor: "universal", dungeon: "Murder Row", boss: "Zaen Bladesorrow", stats: { 'Critical Strike': 65, 'Mastery': 46 } },
    { id: 193763, name: "Fireproof Drape", icon: "inv_mail_dragondungeon_c_01_cape", slot: "back", armor: "universal", dungeon: "Ruby Life Pools", boss: "Kokia Blazehoof", stats: { 'Critical Strike': 41, 'Haste': 70 } },
    { id: 251190, name: "Bloodthorn Burnous", icon: "inv_cape_mail_dungeonharronir_c_01", slot: "back", armor: "universal", dungeon: "The Blinding Vale", boss: "Ikuzz the Light Hunter", stats: { 'Haste': 72, 'Mastery': 39 } },
    { id: 159459, name: "Ritual Binder's Ring", icon: "inv_ring_80_03e", slot: "finger", armor: "universal", dungeon: "Kings' Rest", boss: "Mchimba the Embalmer", stats: { 'Haste': 260, 'Versatility': 136 } },
    { id: 251136, name: "Signet of Snarling Servitude", icon: "inv_12_jewelry_voidelf_ring_teal", slot: "finger", armor: "universal", dungeon: "Murder Row", boss: "Xathuux the Annihilator", stats: { 'Critical Strike': 243, 'Mastery': 153 } },
    { id: 158366, name: "Charged Sandstone Band", icon: "inv_ring_80_03d", slot: "finger", armor: "universal", dungeon: "Temple of Sethraliss", boss: "Galvazzt", stats: { 'Critical Strike': 226, 'Mastery': 170 } },
    { id: 162544, name: "Jade Ophidian Band", icon: "inv_ring_80_04c", slot: "finger", armor: "universal", dungeon: "Temple of Sethraliss", boss: "Merektha", stats: { 'Versatility': 147, 'Mastery': 249 } },
    { id: 251194, name: "Lightwarden's Bind", icon: "inv12_jewelrytrinkets_rutaani_ring_yellow", slot: "finger", armor: "universal", dungeon: "The Blinding Vale", boss: "Lightwarden Ruia", stats: { 'Versatility': 130, 'Mastery': 266 } },
    { id: 252258, name: "Sickening Signet of Atroxus", icon: "inv_12_jewelry_devouringhost_ring_bronze2", slot: "finger", armor: "universal", dungeon: "Voidscar Arena", boss: "Atroxus", stats: { 'Haste': 272, 'Mastery': 125 } },
    { id: 273793, name: "Hydraspine Twinblade", icon: "inv_glaive_1h_outdooramaniloa_c_01", slot: "weapon", armor: "universal", dungeon: "Altar of Fangs", boss: "Rav'i", stats: { 'Versatility': 44, 'Mastery': 55 } },
    { id: 273779, name: "Nocuous Focal Fang", icon: "inv_offhand_1h_outdooramaniloa_c_01", slot: "weapon", armor: "universal", dungeon: "Altar of Fangs", boss: "The Writhing Coil", stats: { 'Critical Strike': 56, 'Haste': 43 } },
    { id: 273783, name: "Toxin-Coated Warstaff", icon: "inv_staff_2h_outdooramaniloa_c_01", slot: "weapon", armor: "universal", dungeon: "Altar of Fangs", boss: "The Writhing Coil", stats: { 'Haste': 114, 'Mastery': 83 } },
    { id: 273780, name: "Venom-Etched Crescent", icon: "inv_axe_1h_outdooramaniloa_c_01", slot: "weapon", armor: "universal", dungeon: "Altar of Fangs", boss: "Rav'i", stats: { 'Critical Strike': 47, 'Mastery': 52 } },
    { id: 273782, name: "Vile Writhefang Glaive", icon: "inv_polearm_2h_outdooramaniloa_c_01", slot: "weapon", armor: "universal", dungeon: "Altar of Fangs", boss: "The Writhing Coil", stats: { 'Critical Strike': 109, 'Haste': 89 } },
    { id: 271681, name: "Perennial Frostbound Charm", icon: "inv_offhand_1h_dungeonharronir_c_01", slot: "weapon", armor: "universal", dungeon: "Den of Nalorakk", boss: "Sentinel of Winter", stats: { 'Critical Strike': 41, 'Mastery': 58 } },
    { id: 251150, name: "Tempest's Shelter", icon: "inv_shield_1h_dungeonharronir_c_01", slot: "weapon", armor: "universal", dungeon: "Den of Nalorakk", boss: "Sentinel of Winter", stats: { 'Haste': 62, 'Mastery': 37 } },
    { id: 160216, name: "Crackling Jade Kilij", icon: "inv_sword_1h_battledungeon_c_02", slot: "weapon", armor: "universal", dungeon: "Kings' Rest", boss: "Aka'ali the Conqueror", stats: { 'Critical Strike': 58, 'Mastery': 41 } },
    { id: 159643, name: "Crossbow of Forgotten Majesty", icon: "inv_bow_2h_crossbow_pandaraid_d_01", slot: "weapon", armor: "universal", dungeon: "Kings' Rest", boss: "Aka'ali the Conqueror", stats: { 'Haste': 116, 'Mastery': 82 } },
    { id: 159644, name: "Geti'ikku, Cut of Death", icon: "inv_sword_2h_battledungeon_c_01", slot: "weapon", armor: "universal", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Haste': 72, 'Mastery': 48 } },
    { id: 159137, name: "Gilded Serpent's Tooth", icon: "inv_knife_1h_battledungeon_c_01", slot: "weapon", armor: "universal", dungeon: "Kings' Rest", boss: "The Golden Serpent", stats: { 'Haste': 43, 'Versatility': 56 } },
    { id: 159645, name: "Headcracker of Supplication", icon: "inv_mace_1h_battledungeon_c_01", slot: "weapon", armor: "universal", dungeon: "Kings' Rest", boss: "King Dazar", stats: { 'Critical Strike': 41, 'Mastery': 58 } },
    { id: 159136, name: "Jeweled Dagger of Subjugation", icon: "inv_knife_1h_battledungeon_c_01", slot: "weapon", armor: "universal", dungeon: "Kings' Rest", boss: "Aka'ali the Conqueror", stats: { 'Haste': 52, 'Mastery': 47 } },
    { id: 159642, name: "Royal Purifier's Spade", icon: "inv_polearm_2h_zandalariguard_b_01", slot: "weapon", armor: "universal", dungeon: "Kings' Rest", boss: "Mchimba the Embalmer", stats: { 'Critical Strike': 112, 'Mastery': 86 } },
    { id: 159667, name: "Vessel of Last Rites", icon: "inv_offhand_1h_battledungeon_c_02", slot: "weapon", armor: "universal", dungeon: "Kings' Rest", boss: "Mchimba the Embalmer", stats: { 'Haste': 60, 'Versatility': 39 } },
    { id: 251128, name: "Bladesorrow", icon: "inv_knife_1h_dungeonharronir_c_01", slot: "weapon", armor: "universal", dungeon: "Murder Row", boss: "Zaen Bladesorrow", stats: { 'Critical Strike': 58, 'Mastery': 41 } },
    { id: 258045, name: "Dawnblade's Glaives", icon: "inv_glaive_1h_questbloodelf_b_01", slot: "weapon", armor: "universal", dungeon: "Murder Row", boss: "Lithiel Cinderfury", stats: { 'Haste': 72, 'Mastery': 48 } },
    { id: 251123, name: "Nibbles' Training Rod", icon: "inv_staff_2h_dungeonharronir_c_02", slot: "weapon", armor: "universal", dungeon: "Murder Row", boss: "Kystia Manaheart", stats: { 'Critical Strike': 120, 'Haste': 78 } },
    { id: 271680, name: "Sinseared Repeater", icon: "inv_firearm_2h_undergroundquest_b_01", slot: "weapon", armor: "universal", dungeon: "Murder Row", boss: "Kystia Manaheart", stats: { 'Critical Strike': 128, 'Versatility': 69 } },
    { id: 251134, name: "Xathuux's Cleave", icon: "inv_axe_2h_dungeonharronir_c_01", slot: "weapon", armor: "universal", dungeon: "Murder Row", boss: "Xathuux the Annihilator", stats: { 'Critical Strike': 116, 'Haste': 82 } },
    { id: 193755, name: "Backdraft Cleaver", icon: "inv_axe_2h_drakonoid_c_01", slot: "weapon", armor: "universal", dungeon: "Ruby Life Pools", boss: "Jefe de Mazmorra", stats: { 'Critical Strike': 73, 'Haste': 124 } },
    { id: 193761, name: "Chillworn's Infusion Staff", icon: "inv_staff_2h_dragondungeon_c_02", slot: "weapon", armor: "universal", dungeon: "Ruby Life Pools", boss: "Melidrussa Chillworn", stats: { 'Critical Strike': 120, 'Mastery': 78 } },
    { id: 193754, name: "Drake Rider's Stecktarge", icon: "inv_shield_1h_drakonid_c_01", slot: "weapon", armor: "universal", dungeon: "Ruby Life Pools", boss: "Jefe de Mazmorra", stats: { 'Versatility': 60, 'Mastery': 39 } },
    { id: 193767, name: "Havoc Crusher", icon: "inv_mace_1h_dragondungeon_c_02", slot: "weapon", armor: "universal", dungeon: "Ruby Life Pools", boss: "Kokia Blazehoof", stats: { 'Critical Strike': 62, 'Haste': 37 } },
    { id: 193766, name: "Kokia's Burnout Rod", icon: "inv_offhand_1h_drakonid_c_01", slot: "weapon", armor: "universal", dungeon: "Ruby Life Pools", boss: "Kokia Blazehoof", stats: { 'Critical Strike': 64, 'Versatility': 35 } },
    { id: 193756, name: "Skyferno Rondel", icon: "inv_knife_1h_dragondungeon_c_02", slot: "weapon", armor: "universal", dungeon: "Ruby Life Pools", boss: "Jefe de Mazmorra", stats: { 'Haste': 39, 'Versatility': 60 } },
    { id: 159664, name: "Bulwark of Brimming Potential", icon: "inv_shield_1h_battledungeon_c_02", slot: "weapon", armor: "universal", dungeon: "Temple of Sethraliss", boss: "Galvazzt", stats: { 'Critical Strike': 45, 'Versatility': 54 } },
    { id: 158369, name: "Galvanized Stormcrusher", icon: "inv_mace_1h_pandaraid_d_01", slot: "weapon", armor: "universal", dungeon: "Temple of Sethraliss", boss: "Jefe de Mazmorra", stats: { 'Haste': 58, 'Versatility': 41 } },
    { id: 158373, name: "Resonating Crystal Scimitar", icon: "inv_sword_1h_battledungeon_c_02", slot: "weapon", armor: "universal", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", stats: { 'Critical Strike': 56, 'Haste': 43 } },
    { id: 159637, name: "Snakebite Recurve", icon: "inv_bow_1h_battledungeon_c_01", slot: "weapon", armor: "universal", dungeon: "Temple of Sethraliss", boss: "Merektha", stats: { 'Critical Strike': 112, 'Haste': 86 } },
    { id: 159636, name: "Staff of the Lightning Serpent", icon: "inv_staff_2h_battledungeon_c_04", slot: "weapon", armor: "universal", dungeon: "Temple of Sethraliss", boss: "Jefe de Mazmorra", stats: { 'Haste': 116, 'Mastery': 82 } },
    { id: 158714, name: "Swarm's Edge", icon: "inv_sword_1h_battledungeon_c_02", slot: "weapon", armor: "universal", dungeon: "Temple of Sethraliss", boss: "Merektha", stats: { 'Versatility': 58, 'Mastery': 41 } },
    { id: 158370, name: "Twin-Strike Polearm", icon: "inv_polearm_2h_snakeman_c_01", slot: "weapon", armor: "universal", dungeon: "Temple of Sethraliss", boss: "Jefe de Mazmorra", stats: { 'Critical Strike': 78, 'Haste': 120 } },
    { id: 251187, name: "Amirdrassil's Reach", icon: "inv_crossbow_2h_dungeonharronir_c_01", slot: "weapon", armor: "universal", dungeon: "The Blinding Vale", boss: "Ikuzz the Light Hunter", stats: { 'Critical Strike': 82, 'Versatility': 116 } },
    { id: 251192, name: "Branch of Pride", icon: "inv_staff_2h_dungeonharronir_c_01", slot: "weapon", armor: "universal", dungeon: "The Blinding Vale", boss: "Lightwarden Ruia", stats: { 'Critical Strike': 128, 'Versatility': 69 } },
    { id: 251188, name: "Doompetal", icon: "inv_wand_1h_dungeonharronir_c_01", slot: "weapon", armor: "universal", dungeon: "The Blinding Vale", boss: "Ikuzz the Light Hunter", stats: { 'Haste': 62, 'Mastery': 37 } },
    { id: 251191, name: "Luminescent Sprout", icon: "inv_offhand_1h_dungeonharronir_c_01", slot: "weapon", armor: "universal", dungeon: "The Blinding Vale", boss: "Lightwarden Ruia", stats: { 'Haste': 41, 'Mastery': 58 } },
    { id: 251181, name: "Pruning Lance", icon: "inv_polearm_2h_rutaani_b_01", slot: "weapon", armor: "universal", dungeon: "The Blinding Vale", boss: "Meittik", stats: { 'Haste': 116, 'Versatility': 82 } },
    { id: 251196, name: "Teldrassil's Sacrifice", icon: "inv_shield_1h_rutaani_b_01", slot: "weapon", armor: "universal", dungeon: "The Blinding Vale", boss: "Ziekket", stats: { 'Critical Strike': 60, 'Versatility': 39 } },
    { id: 251180, name: "Thornblade", icon: "inv_knife_1h_rutaani_b_01", slot: "weapon", armor: "universal", dungeon: "The Blinding Vale", boss: "Meittik", stats: { 'Haste': 39, 'Mastery': 60 } },
    { id: 251195, name: "Thorned Reply", icon: "inv_sword_1h_dungeonharronir_c_01", slot: "weapon", armor: "universal", dungeon: "The Blinding Vale", boss: "Ziekket", stats: { 'Critical Strike': 41, 'Haste': 58 } },
    { id: 251186, name: "Thorntalon Edge", icon: "inv_hand_1h_dungeonharronir_c_01", slot: "weapon", armor: "universal", dungeon: "The Blinding Vale", boss: "Ikuzz the Light Hunter", stats: { 'Critical Strike': 37, 'Mastery': 62 } },
    { id: 251230, name: "Charonic Crescent", icon: "inv_polearm_2h_domanaar_b_01", slot: "weapon", armor: "universal", dungeon: "Voidscar Arena", boss: "Charonus", stats: { 'Versatility': 120, 'Mastery': 78 } },
    { id: 251225, name: "Fang of Contagion", icon: "inv_knife_1h_dungeonharronir_c_02", slot: "weapon", armor: "universal", dungeon: "Voidscar Arena", boss: "Atroxus", stats: { 'Versatility': 41, 'Mastery': 58 } },
    { id: 251224, name: "Hulking Handaxe", icon: "inv_axe_1h_dungeonharronir_c_01", slot: "weapon", armor: "universal", dungeon: "Voidscar Arena", boss: "Atroxus", stats: { 'Haste': 35, 'Mastery': 64 } },
    { id: 251231, name: "Singularity Slicer", icon: "inv_glaive_1h_dungeonharronir_c_01", slot: "weapon", armor: "universal", dungeon: "Voidscar Arena", boss: "Charonus", stats: { 'Critical Strike': 58, 'Haste': 41 } },
    { id: 251218, name: "Taz'Rah's Cosmic Edge", icon: "inv_sword_1h_domanaar_b_01", slot: "weapon", armor: "universal", dungeon: "Voidscar Arena", boss: "Taz'Rah", stats: { 'Haste': 58, 'Mastery': 41 } },

    // --- TRINKETS (SEASON 2 DUNGEON DROPS) ---
    // Active (On-Use)
    { id: 159617, name: "Lustrous Golden Plumage", icon: "inv_feather_09", slot: "trinket", armor: "universal", dungeon: "Kings' Rest", boss: "The Golden Serpent", isUse: true, stats: { 'Versatility': 175 } },
    { id: 159614, name: "Galecaller's Boon", icon: "inv_elemental_primal_air", slot: "trinket", armor: "universal", dungeon: "Temple of Sethraliss", boss: "Galvazzt", isUse: true, stats: { 'Mastery': 165 } },
    { id: 159615, name: "Ignition Mage's Fuse", icon: "inv_misc_bomb_08", slot: "trinket", armor: "universal", dungeon: "Temple of Sethraliss", boss: "Galvazzt", isUse: true, stats: { 'Haste': 170 } },
    { id: 159618, name: "Mchimba's Ritual Bandages", icon: "inv_fabric_bandage_02", slot: "trinket", armor: "universal", dungeon: "Kings' Rest", boss: "Mchimba the Embalmer", isUse: true, stats: { 'Mastery': 160 } },
    { id: 159619, name: "Vessel of Skittering Shadows", icon: "inv_trinket_80_shadowpotion", slot: "trinket", armor: "universal", dungeon: "Kings' Rest", boss: "King Dazar", isUse: true, stats: { 'Critical Strike': 170 } },
    { id: 251202, name: "Ziekket's Barbed Stinger", icon: "inv_misc_monsterhorn_04", slot: "trinket", armor: "universal", dungeon: "The Blinding Vale", boss: "Ziekket", isUse: true, stats: { 'Critical Strike': 165 } },
    { id: 273789, name: "Rav'i's Toxic Censer", icon: "inv_misc_urn_01", slot: "trinket", armor: "universal", dungeon: "Altar of Fangs", boss: "Rav'i", isUse: true, stats: { 'Haste': 165 } },
    { id: 251237, name: "Charonus' Singularity", icon: "spell_shadow_unstableaffliction_3", slot: "trinket", armor: "universal", dungeon: "Voidscar Arena", boss: "Charonus", isUse: true, stats: { 'Critical Strike': 175 } },
    { id: 251156, name: "Nalorakk's Ferocious Rage", icon: "ability_druid_challangingroar", slot: "trinket", armor: "universal", dungeon: "Den of Nalorakk", boss: "The Hoardmonger", isUse: true, stats: { 'Versatility': 165 } },
    { id: 251143, name: "Sinseared Voodoo Doll", icon: "inv_misc_head_troll_01", slot: "trinket", armor: "universal", dungeon: "Murder Row", boss: "Lithiel Cinderfury", isUse: true, stats: { 'Critical Strike': 145, 'Versatility': 95 } },

    // Passive (Equip-Proc)
    { id: 159623, name: "Dead-Eye Spyglass", icon: "inv_misc_spyglass_02", slot: "trinket", armor: "universal", dungeon: "Temple of Sethraliss", boss: "Merektha", isUse: false, stats: { 'Critical Strike': 170 } },
    { id: 159620, name: "Conch of Dark Whispers", icon: "inv_misc_shell_02", slot: "trinket", armor: "universal", dungeon: "Temple of Sethraliss", boss: "Avatar of Sethraliss", isUse: false, stats: { 'Mastery': 175 } },
    { id: 159616, name: "Gore-Crusted Butcher's Block", icon: "inv_misc_food_meat_raw_01", slot: "trinket", armor: "universal", dungeon: "Kings' Rest", boss: "Aka'ali the Conqueror", isUse: false, stats: { 'Haste': 170 } },
    { id: 193757, name: "Ruby Whelp Shell", icon: "inv_egg_dragon_red", slot: "trinket", armor: "universal", dungeon: "Ruby Life Pools", boss: "Melidrussa Chillworn", isUse: false, stats: { 'Critical Strike': 175 } },
    { id: 193710, name: "Kyrakka's Searing Embers", icon: "spell_fire_sealoffire", slot: "trinket", armor: "universal", dungeon: "Ruby Life Pools", boss: "Kyrakka and Erkhart Stormvein", isUse: false, stats: { 'Mastery': 170 } },
    { id: 251201, name: "Ruia's Luminous Seed", icon: "inv_misc_herb_01", slot: "trinket", armor: "universal", dungeon: "The Blinding Vale", boss: "Lightwarden Ruia", isUse: false, stats: { 'Mastery': 175 } },
    { id: 251203, name: "Spore-Infused Idol", icon: "inv_jewelry_trinket_02", slot: "trinket", armor: "universal", dungeon: "The Blinding Vale", boss: "Ikuzz the Light Hunter", isUse: false, stats: { 'Versatility': 170 } },
    { id: 251236, name: "Atroxus' Pulsing Heart", icon: "inv_misc_organ_05", slot: "trinket", armor: "universal", dungeon: "Voidscar Arena", boss: "Atroxus", isUse: false, stats: { 'Haste': 175 } },
    { id: 273788, name: "Fang of the Writhing Coil", icon: "inv_misc_monsterfang_01", slot: "trinket", armor: "universal", dungeon: "Altar of Fangs", boss: "The Writhing Coil", isUse: false, stats: { 'Critical Strike': 175 } },
    { id: 251157, name: "Winter's Howling Totem", icon: "inv_misc_totem_01", slot: "trinket", armor: "universal", dungeon: "Den of Nalorakk", boss: "Sentinel of Winter", isUse: false, stats: { 'Mastery': 170 } },
    { id: 251147, name: "Bladesorrow's Poisoned Flask", icon: "inv_potion_52", slot: "trinket", armor: "universal", dungeon: "Murder Row", boss: "Zaen Bladesorrow", isUse: false, stats: { 'Mastery': 165, 'Haste': 85 } }
];

if (typeof window !== 'undefined') {
    window.SEASON_RAID_DATA = SEASON_RAID_DATA;
    window.SEASON_DUNGEON_LOOT = SEASON_DUNGEON_LOOT;
}
