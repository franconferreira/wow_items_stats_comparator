/**
 * gear-solver.js
 * Combinatorial beam search solver to compute complementary Mythic+ dungeon packages
 * and the Óptimo (BiS) set taking into account realistic Top Crafted gear, Raid loot,
 * and 1 On-Use + 1 Passive Trinket constraint.
 */

function getCanonicalSlot(rawSlot) {
    const s = (rawSlot || '').toLowerCase().replace(/_/g, '');
    if (s.startsWith('finger')) return 'finger';
    if (s.startsWith('trinket')) return 'trinket';
    if (s === 'mainhand' || s === 'offhand') return 'weapon';
    return s;
}

// Helper: Extract consensus enchants and socketed gems from Top 50 players
function getConsensusEnchantsAndGems(top10Players) {
    const gemCounts = new Map();
    const enchantCountsBySlot = new Map();

    (top10Players || []).forEach(p => {
        Object.entries(p.itemDetails || {}).forEach(([slot, it]) => {
            if (!it) return;
            const canonical = getCanonicalSlot(slot);

            // Gems
            (it.gems || []).forEach(g => {
                if (!g || !g.name) return;
                const cleanName = (typeof cleanWoWString === 'function') ? cleanWoWString(g.name) : g.name;
                if (!cleanName) return;
                const k = cleanName;
                if (!gemCounts.has(k)) {
                    gemCounts.set(k, { name: cleanName, icon: g.icon, id: g.id, count: 0 });
                }
                gemCounts.get(k).count++;
            });

            // Enchants
            (it.enchants || []).forEach(e => {
                if (!e || !e.name) return;
                const cleanName = (typeof cleanWoWString === 'function') ? cleanWoWString(e.name) : e.name;
                if (!cleanName) return;
                if (!enchantCountsBySlot.has(canonical)) {
                    enchantCountsBySlot.set(canonical, new Map());
                }
                const slotEnchMap = enchantCountsBySlot.get(canonical);
                if (!slotEnchMap.has(cleanName)) {
                    slotEnchMap.set(cleanName, { name: cleanName, icon: e.icon, id: e.id, count: 0 });
                }
                slotEnchMap.get(cleanName).count++;
            });
        });
    });

    const sortedGems = Array.from(gemCounts.values()).sort((a, b) => b.count - a.count);
    const topGem = sortedGems[0] || null;

    // Parse secondary stats of top gem
    const gemStats = {};
    if (topGem) {
        const mGems = topGem.name.matchAll(/(\d+)\s*(Crit|Vers|Haste|Mastery)/gi);
        const gemStatMap = { 'crit': 'Critical Strike', 'vers': 'Versatility', 'haste': 'Haste', 'mastery': 'Mastery' };
        for (const gm of mGems) {
            const val = parseInt(gm[1], 10);
            const key = gemStatMap[gm[2].toLowerCase()];
            if (key) gemStats[key] = (gemStats[key] || 0) + val;
        }
    }
    // Fallback if gem name didn't contain numeric regex
    if (Object.keys(gemStats).length === 0 && topGem) {
        gemStats['Mastery'] = 147;
    }

    const consensusEnchants = {};
    enchantCountsBySlot.forEach((enchMap, slot) => {
        const sorted = Array.from(enchMap.values()).sort((a, b) => b.count - a.count);
        if (sorted.length > 0) {
            consensusEnchants[slot] = sorted[0];
        }
    });

    return {
        topGem,
        gemStats,
        consensusEnchants
    };
}

// Helper: Calculate globally popular crafted items across all Top 50 players
function getGlobalTopCraftedItems(top10Players) {
    const globalCraftedMap = new Map();
    (top10Players || []).forEach(p => {
        Object.entries(p.itemDetails || {}).forEach(([pSlot, it]) => {
            if (!it || !it.item_id || !it.name) return;
            const isCrafted = (it.bonuses || []).some(b => CRAFTED_BONUS_SET.has(b));
            if (!isCrafted) return;
            const canonical = getCanonicalSlot(pSlot);
            if (!globalCraftedMap.has(it.item_id)) {
                globalCraftedMap.set(it.item_id, {
                    id: it.item_id,
                    name: it.name,
                    icon: it.icon,
                    slot: canonical,
                    ilvl: it.ilvl || 334,
                    stats: it.stats || {},
                    dungeon: 'Fabricación con Chispa',
                    boss: 'Profesión',
                    itemType: 'crafted',
                    playerCount: 0
                });
            }
            globalCraftedMap.get(it.item_id).playerCount++;
        });
    });

    const sorted = Array.from(globalCraftedMap.values()).sort((a, b) => b.playerCount - a.playerCount);
    // Requirement 1: Only items crafted by a significant number of players (at least 3 players or 8% of pool)
    const threshold = Math.max(2, Math.floor(((top10Players?.length || 10) * 0.08)));
    const popularCrafted = sorted.filter(it => it.playerCount >= threshold).slice(0, 5);
    const validCraftedItemIds = new Set(popularCrafted.map(it => it.id));

    return {
        popularCrafted,
        validCraftedItemIds
    };
}

// Combinatorial Solver to find complementary packages (Mythic+ Dungeon Loot, Crafted & Optimal BiS with 1 Use + 1 Passive Trinket)
function findOptimalDungeonPackages(userItemsDetails, lockedSlots, targetPcts, armorType, top10Players = [], seasonSlug = 'season-mn-2') {
    const openSlots = [];
    for (const [slotKey, it] of Object.entries(userItemsDetails)) {
        if (slotKey === 'shirt' || slotKey === 'tabard') continue;
        // Trinkets are now fully unlockable / lockable
        if (!lockedSlots.has(slotKey)) {
            openSlots.push(slotKey);
        }
    }

    if (openSlots.length === 0) {
        return { allCurrent: true, openSlots: [], pkg1: null, pkg2: null, pkgOptimal: null };
    }

    // 1. Calculate base locked stats
    const lockedStats = { 'Critical Strike': 0, 'Haste': 0, 'Mastery': 0, 'Versatility': 0 };
    for (const [slotKey, it] of Object.entries(userItemsDetails)) {
        if (lockedSlots.has(slotKey)) {
            if (it && it.stats) {
                for (const [sName, sVal] of Object.entries(it.stats)) {
                    if (lockedStats[sName] !== undefined) {
                        lockedStats[sName] += sVal;
                    }
                }
            }
        }
    }

    // 2. Extract consensus gems, enchants & realistic top crafted items
    const { topGem, gemStats, consensusEnchants } = getConsensusEnchantsAndGems(top10Players);
    const { popularCrafted, validCraftedItemIds } = getGlobalTopCraftedItems(top10Players);

    // Initial crafted items locked on the player
    let initialCraftedCount = 0;
    const initialCraftedCategories = new Set();
    const initialCraftedIds = new Set();

    lockedSlots.forEach(lSlot => {
        const it = userItemsDetails ? userItemsDetails[lSlot] : null;
        if (it) {
            const isCrafted = (it.bonuses || []).some(b => CRAFTED_BONUS_SET.has(b));
            if (isCrafted) {
                initialCraftedCount++;
                const lCanonical = getCanonicalSlot(lSlot);
                initialCraftedCategories.add(lCanonical);
                if (it.item_id) initialCraftedIds.add(it.item_id);
            }
        }
    });

    // Initial Trinket state: determine if locked trinkets are on-use or passive
    let initialTrinketUse = 0;
    let initialTrinketPassive = 0;

    ['trinket1', 'trinket2'].forEach(tSlot => {
        if (lockedSlots.has(tSlot)) {
            const tItem = userItemsDetails[tSlot];
            if (tItem) {
                const isUse = tItem.isUse ?? (/(?:Use:|Uso:|Utilizar:)/i.test(tItem.name || ''));
                if (isUse) {
                    initialTrinketUse++;
                } else {
                    initialTrinketPassive++;
                }
            }
        }
    });

    // Check crafted count cap from Top 50 (max 2 or 3)
    let maxTopCrafted = 2;
    if (top10Players && top10Players.length > 0) {
        const playerCraftedCounts = top10Players.map(p => {
            let count = 0;
            Object.values(p.itemDetails || {}).forEach(it => {
                if (it && (it.bonuses || []).some(b => CRAFTED_BONUS_SET.has(b))) {
                    count++;
                }
            });
            return count;
        });
        playerCraftedCounts.sort((a, b) => a - b);
        const p90 = playerCraftedCounts[Math.floor(playerCraftedCounts.length * 0.9)] || 2;
        maxTopCrafted = Math.min(3, Math.max(2, p90));
    }

    const formatPackage = (state) => {
        const totalSec = Object.values(state.totalStats).reduce((a, b) => a + b, 0);
        const pcts = {};
        for (const [st, val] of Object.entries(state.totalStats)) {
            pcts[st] = totalSec > 0 ? (val / totalSec) * 100 : 0;
        }
        const dungeonsMap = {};
        state.items.forEach(it => {
            const d = it.dungeon;
            if (!dungeonsMap[d]) dungeonsMap[d] = [];
            dungeonsMap[d].push(it);
        });
        return {
            items: state.items,
            totalStats: state.totalStats,
            pcts,
            score: state.score,
            dungeonsMap,
            consensusEnchants,
            topGem,
            gemStats
        };
    };

    const BEAM_WIDTH = 50;

    // 3. Build candidate items list for pkg1 & pkg2 (Season 2 Dungeon Loot + Realistic Top Crafted gear)
    // Requirement 2: Allow player to also get top crafted items in Recomendado & Alternativo
    // Requirement 5: Trinkets in Recomendado & Alternativo must be dungeon-only (no raid), 1 on-use + 1 passive
    const slotCandidates = [];
    for (const slotKey of openSlots) {
        const canonical = getCanonicalSlot(slotKey);
        const candidates = [];
        const seenIds = new Set();

        // A. Add valid top crafted pieces for this slot (if any)
        popularCrafted.filter(it => it.slot === canonical).forEach(it => {
            if (!seenIds.has(it.id)) {
                seenIds.add(it.id);
                candidates.push({
                    ...it,
                    itemType: 'crafted',
                    badgeText: 'CRAFT'
                });
            }
        });

        // B. Add seasonal dungeon loot
        let itemsForSlot = SEASON_DUNGEON_LOOT.filter(it => 
            it.slot === canonical && (it.armor === armorType || it.armor === 'universal')
        );
        if (itemsForSlot.length === 0) {
            itemsForSlot = SEASON_DUNGEON_LOOT.filter(it => it.slot === canonical);
        }

        itemsForSlot.forEach(it => {
            if (!seenIds.has(it.id)) {
                seenIds.add(it.id);
                candidates.push({
                    ...it,
                    itemType: 'dungeon',
                    badgeText: 'M+'
                });
            }
        });

        slotCandidates.push({
            slotKey: slotKey,
            slotName: (typeof SLOT_NAMES_ES !== 'undefined' && SLOT_NAMES_ES[slotKey]) ? SLOT_NAMES_ES[slotKey] : slotKey,
            candidates
        });
    }

    // 4. Evaluate dungeon & crafted packages using Beam Search
    let beam = [{
        items: [],
        totalStats: { ...lockedStats },
        craftedCount: initialCraftedCount,
        craftedCategories: new Set(initialCraftedCategories),
        craftedIds: new Set(initialCraftedIds),
        trinketUseCount: initialTrinketUse,
        trinketPassiveCount: initialTrinketPassive,
        score: 0
    }];

    for (const slotObj of slotCandidates) {
        const nextBeam = [];
        const canonicalSlot = getCanonicalSlot(slotObj.slotKey);
        const isTrinket = canonicalSlot === 'trinket';

        for (const state of beam) {
            for (const item of slotObj.candidates) {
                const isItemCrafted = item.itemType === 'crafted';

                // Prevent equipping duplicate item IDs
                if (state.items.some(existing => existing.id === item.id)) {
                    continue;
                }

                // Trinket Pairing Constraint: Exactly 1 on-use and 1 passive
                if (isTrinket) {
                    if (item.isUse && state.trinketUseCount >= 1) {
                        continue;
                    }
                    if (!item.isUse && state.trinketPassiveCount >= 1) {
                        continue;
                    }
                }

                // Crafted Specific Constraints:
                if (isItemCrafted) {
                    if (state.craftedCount >= maxTopCrafted) continue;
                    if (state.craftedIds.has(item.id)) continue;
                    if (state.craftedCategories.has(canonicalSlot)) continue;
                }

                const nextStats = { ...state.totalStats };
                for (const [sName, sVal] of Object.entries(item.stats || {})) {
                    if (nextStats[sName] !== undefined) nextStats[sName] += sVal;
                }

                // Add socket gem stats if slot is ring or neck (Requirement 3: gems affect stat balancing)
                const isSocketSlot = canonicalSlot === 'finger' || canonicalSlot === 'neck';
                if (isSocketSlot && topGem && gemStats) {
                    const socketCount = (canonicalSlot === 'finger') ? 2 : 1;
                    for (const [sName, sVal] of Object.entries(gemStats)) {
                        if (nextStats[sName] !== undefined) nextStats[sName] += sVal * socketCount;
                    }
                }

                const totalSec = Object.values(nextStats).reduce((a, b) => a + b, 0);
                let score = 0;
                for (const [st, target] of Object.entries(targetPcts)) {
                    const pct = totalSec > 0 ? (nextStats[st] / totalSec) * 100 : 0;
                    const diff = pct - target;
                    score += diff * diff;
                }

                const nextCraftedCategories = new Set(state.craftedCategories);
                const nextCraftedIds = new Set(state.craftedIds);
                let nextCraftedCount = state.craftedCount;
                if (isItemCrafted) {
                    nextCraftedCount++;
                    nextCraftedCategories.add(canonicalSlot);
                    nextCraftedIds.add(item.id);
                }

                const nextTrinketUse = state.trinketUseCount + (isTrinket && item.isUse ? 1 : 0);
                const nextTrinketPassive = state.trinketPassiveCount + (isTrinket && !item.isUse ? 1 : 0);

                nextBeam.push({
                    items: [...state.items, { ...item, targetSlot: slotObj.slotName, slotKey: slotObj.slotKey }],
                    totalStats: nextStats,
                    craftedCount: nextCraftedCount,
                    craftedCategories: nextCraftedCategories,
                    craftedIds: nextCraftedIds,
                    trinketUseCount: nextTrinketUse,
                    trinketPassiveCount: nextTrinketPassive,
                    score
                });
            }
        }

        // Safety fallback if constraints filtered all items
        if (nextBeam.length === 0) {
            for (const state of beam) {
                for (const item of slotObj.candidates) {
                    if (item.itemType !== 'crafted') {
                        nextBeam.push({
                            items: [...state.items, { ...item, targetSlot: slotObj.slotName, slotKey: slotObj.slotKey }],
                            totalStats: state.totalStats,
                            craftedCount: state.craftedCount,
                            craftedCategories: state.craftedCategories,
                            craftedIds: state.craftedIds,
                            trinketUseCount: state.trinketUseCount,
                            trinketPassiveCount: state.trinketPassiveCount,
                            score: state.score + 100
                        });
                    }
                }
            }
        }

        nextBeam.sort((a, b) => a.score - b.score);
        beam = nextBeam.slice(0, BEAM_WIDTH);
    }

    const pkg1 = beam.length > 0 ? formatPackage(beam[0]) : null;
    let pkg2 = null;
    if (pkg1) {
        const pkg1ItemIds = new Set(pkg1.items.map(it => it.id));
        for (let i = 1; i < beam.length; i++) {
            const cand = beam[i];
            let diffCount = 0;
            cand.items.forEach(it => { if (!pkg1ItemIds.has(it.id)) diffCount++; });
            if (diffCount >= Math.max(1, Math.floor(openSlots.length / 3))) {
                pkg2 = formatPackage(cand);
                break;
            }
        }
        if (!pkg2 && beam.length > 1) pkg2 = formatPackage(beam[1]);
    }

    // 5. Build candidate items list for "Óptimo" (Crafted + Raid + Dungeon)
    // Requirement 1: Only genuinely popular crafted items (validCraftedItemIds)
    // Requirement 5: In Óptimo, show the trinkets most used by Top 50, with 1 on-use + 1 passive
    // Requirement 6: Boss portrait & Wowhead tooltip for raid bosses
    const optSlotCandidates = [];
    const raids = SEASON_RAID_DATA[seasonSlug] || SEASON_RAID_DATA['season-mn-2'] || [];

    for (const slotKey of openSlots) {
        const canonical = getCanonicalSlot(slotKey);
        const candidates = [];
        const seenIds = new Set();
        const isTrinket = canonical === 'trinket';

        const raidMap = new Map();
        const topTrinketMap = new Map();

        (top10Players || []).forEach(p => {
            Object.entries(p.itemDetails || {}).forEach(([pSlot, it]) => {
                if (!it || !it.item_id || !it.name) return;
                if (getCanonicalSlot(pSlot) !== canonical) return;

                const isCrafted = (it.bonuses || []).some(b => CRAFTED_BONUS_SET.has(b));
                const isDungeon = SEASON_DUNGEON_LOOT.some(d => d.id === it.item_id);

                if (isTrinket) {
                    // Trinket collection for Top 50
                    if (!topTrinketMap.has(it.item_id)) {
                        let bossName = 'Jefe de Banda';
                        let raidName = 'Banda de Temporada';
                        let bossNpcId = 231450;
                        let bossIcon = 'achievement_boss_generalvezax';
                        let isRaid = false;

                        for (const r of raids) {
                            for (const b of r.bosses) {
                                if (b.patterns && b.patterns.some(pat => it.name.toLowerCase().includes(pat.toLowerCase()))) {
                                    bossName = b.name;
                                    raidName = r.raidName;
                                    bossNpcId = b.npcId || bossNpcId;
                                    bossIcon = b.bossIcon || bossIcon;
                                    isRaid = true;
                                    break;
                                }
                            }
                            if (isRaid) break;
                        }

                        const dItem = SEASON_DUNGEON_LOOT.find(d => d.id === it.item_id);
                        const isUse = (dItem && dItem.isUse !== undefined)
                            ? dItem.isUse
                            : (it.isUse ?? (/(?:Use:|Uso:|Utilizar:)/i.test(it.name || '')));

                        topTrinketMap.set(it.item_id, {
                            id: it.item_id,
                            name: it.name,
                            icon: it.icon,
                            slot: 'trinket',
                            ilvl: it.ilvl || 334,
                            stats: it.stats || (dItem ? dItem.stats : {}),
                            dungeon: isRaid ? raidName : (dItem ? dItem.dungeon : 'Mítica+'),
                            boss: isRaid ? bossName : (dItem ? dItem.boss : 'Jefe de Mazmorra'),
                            bossNpcId: isRaid ? bossNpcId : null,
                            bossIcon: isRaid ? bossIcon : null,
                            isUse: isUse,
                            itemType: isRaid ? 'raid' : 'dungeon',
                            playerCount: 0
                        });
                    }
                    topTrinketMap.get(it.item_id).playerCount++;
                } else if (!isCrafted && !isDungeon) {
                    // Raid / Tier item
                    if (!raidMap.has(it.item_id)) {
                        let bossName = 'Jefe de Banda';
                        let raidName = 'Banda de Temporada';
                        let bossTitle = '';
                        let bossIcon = 'achievement_boss_yoggsaron_01';

                        for (const r of raids) {
                            for (const b of r.bosses) {
                                if (b.patterns && b.patterns.some(pat => it.name.toLowerCase().includes(pat.toLowerCase()))) {
                                    bossName = b.name;
                                    bossTitle = b.title || '';
                                    raidName = r.raidName;
                                    bossIcon = b.bossIcon || bossIcon;
                                    break;
                                }
                                if (b.tierSlot && b.tierSlot === canonical) {
                                    bossName = b.name;
                                    bossTitle = b.title || '';
                                    raidName = r.raidName;
                                    bossIcon = b.bossIcon || bossIcon;
                                    break;
                                }
                            }
                        }

                        raidMap.set(it.item_id, {
                            id: it.item_id,
                            name: (typeof cleanWoWString === 'function') ? cleanWoWString(it.name) : it.name,
                            icon: it.icon,
                            slot: canonical,
                            ilvl: it.ilvl || 334,
                            stats: it.stats || {},
                            dungeon: raidName,
                            boss: bossName,
                            bossTitle: bossTitle,
                            bossIcon: bossIcon,
                            itemType: 'raid',
                            playerCount: 0
                        });
                    }
                    raidMap.get(it.item_id).playerCount++;
                }
            });
        });

        if (isTrinket) {
            // For Trinkets: add Top 50 most used trinkets
            const sortedTrinkets = Array.from(topTrinketMap.values()).sort((a, b) => b.playerCount - a.playerCount);
            sortedTrinkets.slice(0, 8).forEach(it => {
                if (!seenIds.has(it.id)) {
                    seenIds.add(it.id);
                    candidates.push(it);
                }
            });

            // Complement with seasonal dungeon trinkets
            const dTrinkets = SEASON_DUNGEON_LOOT.filter(it => it.slot === 'trinket');
            dTrinkets.slice(0, 8).forEach(it => {
                if (!seenIds.has(it.id)) {
                    seenIds.add(it.id);
                    candidates.push({
                        ...it,
                        itemType: 'dungeon',
                        playerCount: 0
                    });
                }
            });
        } else {
            // A. Add ONLY popular crafted pieces matching this slot (Requirement 1)
            popularCrafted.filter(it => it.slot === canonical).forEach(it => {
                if (!seenIds.has(it.id)) {
                    seenIds.add(it.id);
                    candidates.push(it);
                }
            });

            // B. Top raid pieces for this slot
            const sortedRaid = Array.from(raidMap.values()).sort((a, b) => b.playerCount - a.playerCount);
            sortedRaid.slice(0, 4).forEach(it => {
                if (!seenIds.has(it.id)) {
                    seenIds.add(it.id);
                    candidates.push(it);
                }
            });

            // C. Complement with seasonal dungeon drops
            let dungeonItems = SEASON_DUNGEON_LOOT.filter(it => 
                it.slot === canonical && (it.armor === armorType || it.armor === 'universal')
            );
            if (dungeonItems.length === 0) {
                dungeonItems = SEASON_DUNGEON_LOOT.filter(it => it.slot === canonical);
            }
            dungeonItems.slice(0, 3).forEach(it => {
                if (!seenIds.has(it.id)) {
                    seenIds.add(it.id);
                    candidates.push({
                        id: it.id,
                        name: it.name,
                        icon: it.icon,
                        slot: canonical,
                        ilvl: it.ilvl || 330,
                        stats: it.stats || {},
                        dungeon: it.dungeon,
                        boss: it.boss,
                        itemType: 'dungeon',
                        playerCount: 0
                    });
                }
            });
        }

        optSlotCandidates.push({
            slotKey: slotKey,
            slotName: (typeof SLOT_NAMES_ES !== 'undefined' && SLOT_NAMES_ES[slotKey]) ? SLOT_NAMES_ES[slotKey] : slotKey,
            candidates: candidates
        });
    }

    // 6. Evaluate "Óptimo" combination using Beam Search with Crafted & Trinket Constraints
    let optBeam = [{
        items: [],
        totalStats: { ...lockedStats },
        craftedCount: initialCraftedCount,
        craftedCategories: new Set(initialCraftedCategories),
        craftedIds: new Set(initialCraftedIds),
        trinketUseCount: initialTrinketUse,
        trinketPassiveCount: initialTrinketPassive,
        popularityBonus: 0,
        score: 0
    }];

    for (const slotObj of optSlotCandidates) {
        const nextBeam = [];
        const canonicalSlot = getCanonicalSlot(slotObj.slotKey);
        const isTrinket = canonicalSlot === 'trinket';

        for (const state of optBeam) {
            for (const item of slotObj.candidates) {
                const isItemCrafted = item.itemType === 'crafted';

                // Prevent equipping duplicate item IDs
                if (state.items.some(existing => existing.id === item.id)) {
                    continue;
                }

                // Trinket Pairing Constraint: Exactly 1 on-use and 1 passive (Requirement 5)
                if (isTrinket) {
                    if (item.isUse && state.trinketUseCount >= 1) {
                        continue;
                    }
                    if (!item.isUse && state.trinketPassiveCount >= 1) {
                        continue;
                    }
                }

                // Crafted Specific Constraints:
                if (isItemCrafted) {
                    if (state.craftedCount >= maxTopCrafted) {
                        continue;
                    }
                    if (state.craftedIds.has(item.id)) {
                        continue;
                    }
                    if (state.craftedCategories.has(canonicalSlot)) {
                        continue;
                    }
                }

                const nextStats = { ...state.totalStats };
                for (const [sName, sVal] of Object.entries(item.stats || {})) {
                    if (nextStats[sName] !== undefined) nextStats[sName] += sVal;
                }

                // Add socket gem stats if slot is ring or neck (Requirement 3)
                const isSocketSlot = canonicalSlot === 'finger' || canonicalSlot === 'neck';
                if (isSocketSlot && topGem && gemStats) {
                    const socketCount = (canonicalSlot === 'finger') ? 2 : 1;
                    for (const [sName, sVal] of Object.entries(gemStats)) {
                        if (nextStats[sName] !== undefined) nextStats[sName] += sVal * socketCount;
                    }
                }

                const totalSec = Object.values(nextStats).reduce((a, b) => a + b, 0);
                let statScore = 0;
                for (const [st, target] of Object.entries(targetPcts)) {
                    const pct = totalSec > 0 ? (nextStats[st] / totalSec) * 100 : 0;
                    const diff = pct - target;
                    statScore += diff * diff;
                }

                // Reward popular items worn by multiple Top 50 players
                const popularityRatio = (top10Players && top10Players.length > 0) ? (item.playerCount || 0) / top10Players.length : 0;
                const cumBonus = (state.popularityBonus || 0) + (popularityRatio * 150);
                const finalScore = Math.max(0, statScore - cumBonus);

                const nextCraftedCategories = new Set(state.craftedCategories);
                const nextCraftedIds = new Set(state.craftedIds);
                let nextCraftedCount = state.craftedCount;
                if (isItemCrafted) {
                    nextCraftedCount++;
                    nextCraftedCategories.add(canonicalSlot);
                    nextCraftedIds.add(item.id);
                }

                const nextTrinketUse = state.trinketUseCount + (isTrinket && item.isUse ? 1 : 0);
                const nextTrinketPassive = state.trinketPassiveCount + (isTrinket && !item.isUse ? 1 : 0);

                nextBeam.push({
                    items: [...state.items, { ...item, targetSlot: slotObj.slotName, slotKey: slotObj.slotKey }],
                    totalStats: nextStats,
                    craftedCount: nextCraftedCount,
                    craftedCategories: nextCraftedCategories,
                    craftedIds: nextCraftedIds,
                    trinketUseCount: nextTrinketUse,
                    trinketPassiveCount: nextTrinketPassive,
                    popularityBonus: cumBonus,
                    score: finalScore
                });
            }
        }

        // Safety fallback: if all candidates were skipped, relax crafted limit for this slot
        if (nextBeam.length === 0) {
            for (const state of optBeam) {
                for (const item of slotObj.candidates) {
                    if (item.itemType !== 'crafted') {
                        nextBeam.push({
                            items: [...state.items, { ...item, targetSlot: slotObj.slotName, slotKey: slotObj.slotKey }],
                            totalStats: state.totalStats,
                            craftedCount: state.craftedCount,
                            craftedCategories: state.craftedCategories,
                            craftedIds: state.craftedIds,
                            trinketUseCount: state.trinketUseCount,
                            trinketPassiveCount: state.trinketPassiveCount,
                            popularityBonus: state.popularityBonus,
                            score: state.score + 100
                        });
                    }
                }
            }
        }

        nextBeam.sort((a, b) => a.score - b.score);
        optBeam = nextBeam.slice(0, BEAM_WIDTH);
    }

    const pkgOptimal = optBeam.length > 0 ? formatPackage(optBeam[0]) : null;

    return {
        allCurrent: false,
        openSlots,
        pkg1,
        pkg2,
        pkgOptimal,
        consensusEnchants,
        topGem,
        gemStats
    };
}

if (typeof window !== 'undefined') {
    window.getCanonicalSlot = getCanonicalSlot;
    window.getConsensusEnchantsAndGems = getConsensusEnchantsAndGems;
    window.getGlobalTopCraftedItems = getGlobalTopCraftedItems;
    window.findOptimalDungeonPackages = findOptimalDungeonPackages;
}
