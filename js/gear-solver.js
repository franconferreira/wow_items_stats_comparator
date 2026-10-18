/**
 * gear-solver.js
 * Combinatorial beam search solver to compute complementary Mythic+ dungeon packages
 * and the Óptimo (BiS) set taking into account Crafted gear and Raid loot.
 */

function getCanonicalSlot(rawSlot) {
    const s = (rawSlot || '').toLowerCase().replace(/_/g, '');
    if (s.startsWith('finger')) return 'finger';
    if (s.startsWith('trinket')) return 'trinket';
    if (s === 'mainhand' || s === 'offhand') return 'weapon';
    return s;
}

// Combinatorial Solver to find complementary packages (Mythic+ Dungeon Loot & Optimal BiS with Crafted and Raid gear)
function findOptimalDungeonPackages(userItemsDetails, lockedSlots, targetPcts, armorType, top10Players = [], seasonSlug = 'season-mn-2') {
    const openSlots = [];
    for (const [slotKey, it] of Object.entries(userItemsDetails)) {
        if (slotKey === 'shirt' || slotKey === 'tabard') continue;
        // Never recommend trinkets in packages per user request
        if (slotKey.startsWith('trinket')) continue;
        if (!lockedSlots.has(slotKey)) {
            openSlots.push(slotKey);
        }
    }

    if (openSlots.length === 0) {
        return { allCurrent: true, openSlots: [], pkg1: null, pkg2: null, pkgOptimal: null };
    }

    // 1. Calculate base locked stats (include locked slots and user's equipped trinkets as fixed baseline)
    const lockedStats = { 'Critical Strike': 0, 'Haste': 0, 'Mastery': 0, 'Versatility': 0 };
    for (const [slotKey, it] of Object.entries(userItemsDetails)) {
        if (lockedSlots.has(slotKey) || slotKey.startsWith('trinket')) {
            if (it && it.stats) {
                for (const [sName, sVal] of Object.entries(it.stats)) {
                    if (lockedStats[sName] !== undefined) {
                        lockedStats[sName] += sVal;
                    }
                }
            }
        }
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
            dungeonsMap
        };
    };

    const BEAM_WIDTH = 50;

    // 2. Build candidate items list strictly from genuine Season 2 Mythic+ dungeon loot pool (for pkg1 & pkg2)
    const slotCandidates = [];
    for (const slotKey of openSlots) {
        const canonical = getCanonicalSlot(slotKey);
        let itemsForSlot = SEASON_DUNGEON_LOOT.filter(it => 
            it.slot === canonical && (it.armor === armorType || it.armor === 'universal')
        );

        if (itemsForSlot.length === 0) {
            itemsForSlot = SEASON_DUNGEON_LOOT.filter(it => it.slot === canonical);
        }

        slotCandidates.push({
            slotKey: slotKey,
            slotName: SLOT_NAMES_ES[slotKey] || slotKey,
            candidates: itemsForSlot.map(it => ({
                ...it,
                itemType: 'dungeon',
                badgeText: 'M+'
            }))
        });
    }

    // 3. Evaluate dungeon packages using Beam Search
    let beam = [{
        items: [],
        totalStats: { ...lockedStats },
        score: 0
    }];

    for (const slotObj of slotCandidates) {
        const nextBeam = [];
        const topCandidates = slotObj.candidates.slice(0, 4);
        for (const state of beam) {
            for (const item of topCandidates) {
                const nextStats = { ...state.totalStats };
                for (const [sName, sVal] of Object.entries(item.stats || {})) {
                    if (nextStats[sName] !== undefined) nextStats[sName] += sVal;
                }

                const totalSec = Object.values(nextStats).reduce((a, b) => a + b, 0);
                let score = 0;
                for (const [st, target] of Object.entries(targetPcts)) {
                    const pct = totalSec > 0 ? (nextStats[st] / totalSec) * 100 : 0;
                    const diff = pct - target;
                    score += diff * diff;
                }

                nextBeam.push({
                    items: [...state.items, { ...item, targetSlot: slotObj.slotName, slotKey: slotObj.slotKey }],
                    totalStats: nextStats,
                    score
                });
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

    // 4. Build candidate items list for "Óptimo" (Crafted + Raid + Dungeon)
    const optSlotCandidates = [];
    const raids = SEASON_RAID_DATA[seasonSlug] || SEASON_RAID_DATA['season-mn-2'] || [];

    for (const slotKey of openSlots) {
        const canonical = getCanonicalSlot(slotKey);
        const candidates = [];
        const seenIds = new Set();

        const craftedMap = new Map();
        const raidMap = new Map();

        (top10Players || []).forEach(p => {
            Object.entries(p.itemDetails || {}).forEach(([pSlot, it]) => {
                if (!it || !it.item_id || !it.name) return;
                if (getCanonicalSlot(pSlot) !== canonical) return;

                const isCrafted = (it.bonuses || []).some(b => CRAFTED_BONUS_SET.has(b));
                const isDungeon = SEASON_DUNGEON_LOOT.some(d => d.id === it.item_id);

                if (isCrafted) {
                    if (!craftedMap.has(it.item_id)) {
                        craftedMap.set(it.item_id, {
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
                    craftedMap.get(it.item_id).playerCount++;
                } else if (!isDungeon) {
                    // Raid / Tier item
                    if (!raidMap.has(it.item_id)) {
                        let bossName = 'Jefe de Banda';
                        let raidName = 'Banda de Temporada';
                        for (const r of raids) {
                            for (const b of r.bosses) {
                                if (b.patterns && b.patterns.some(pat => it.name.toLowerCase().includes(pat.toLowerCase()))) {
                                    bossName = b.name;
                                    raidName = r.raidName;
                                    break;
                                }
                                if (b.tierSlot && b.tierSlot === canonical) {
                                    bossName = b.name;
                                    raidName = r.raidName;
                                    break;
                                }
                            }
                        }
                        raidMap.set(it.item_id, {
                            id: it.item_id,
                            name: it.name,
                            icon: it.icon,
                            slot: canonical,
                            ilvl: it.ilvl || 334,
                            stats: it.stats || {},
                            dungeon: raidName,
                            boss: bossName,
                            itemType: 'raid',
                            playerCount: 0
                        });
                    }
                    raidMap.get(it.item_id).playerCount++;
                }
            });
        });

        // Top 2 crafted pieces for this slot
        const sortedCrafted = Array.from(craftedMap.values()).sort((a, b) => b.playerCount - a.playerCount);
        sortedCrafted.slice(0, 2).forEach(it => {
            if (!seenIds.has(it.id)) {
                seenIds.add(it.id);
                candidates.push(it);
            }
        });

        // Top 3 raid pieces for this slot
        const sortedRaid = Array.from(raidMap.values()).sort((a, b) => b.playerCount - a.playerCount);
        sortedRaid.slice(0, 3).forEach(it => {
            if (!seenIds.has(it.id)) {
                seenIds.add(it.id);
                candidates.push(it);
            }
        });

        // Complement with top 3 seasonal dungeon drops
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

        optSlotCandidates.push({
            slotKey: slotKey,
            slotName: SLOT_NAMES_ES[slotKey] || slotKey,
            candidates: candidates
        });
    }

    // 5. Evaluate "Óptimo" combination using Beam Search with Crafted Constraints
    // Constraints:
    // 1. No se puede tener 2 items crafteados del mismo tipo (2 dagas, 2 anillos).
    // 2. Como mucho deberia tener solo 2 o 3 items crafteados (máx 2 a 3, los míticos tienen más ilvl).

    // Determine crafted items already locked on the player
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

    // Check crafted count distribution among Top 50 players (capped between 2 and 3)
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

    let optBeam = [{
        items: [],
        totalStats: { ...lockedStats },
        craftedCount: initialCraftedCount,
        craftedCategories: new Set(initialCraftedCategories),
        craftedIds: new Set(initialCraftedIds),
        popularityBonus: 0,
        score: 0
    }];

    for (const slotObj of optSlotCandidates) {
        const nextBeam = [];
        const canonicalSlot = getCanonicalSlot(slotObj.slotKey);

        for (const state of optBeam) {
            for (const item of slotObj.candidates) {
                const isItemCrafted = item.itemType === 'crafted';

                // Prevent equipping the exact same item ID twice in the entire set (e.g. 2 identical rings or weapons)
                if (state.items.some(existing => existing.id === item.id)) {
                    continue;
                }

                // Crafted Specific Constraints:
                if (isItemCrafted) {
                    // Rule 1: Max 2 or 3 crafted items in total
                    if (state.craftedCount >= maxTopCrafted) {
                        continue;
                    }

                    // Rule 2: Cannot duplicate crafted item ID
                    if (state.craftedIds.has(item.id)) {
                        continue;
                    }

                    // Rule 3: Cannot have 2 crafted items of the same type (e.g. 2 rings, 2 weapons/daggers)
                    if (state.craftedCategories.has(canonicalSlot)) {
                        continue;
                    }
                }

                const nextStats = { ...state.totalStats };
                for (const [sName, sVal] of Object.entries(item.stats || {})) {
                    if (nextStats[sName] !== undefined) nextStats[sName] += sVal;
                }

                const totalSec = Object.values(nextStats).reduce((a, b) => a + b, 0);
                let statScore = 0;
                for (const [st, target] of Object.entries(targetPcts)) {
                    const pct = totalSec > 0 ? (nextStats[st] / totalSec) * 100 : 0;
                    const diff = pct - target;
                    statScore += diff * diff;
                }

                // Reward popular items worn by multiple Top 50 players (Tier pieces, top crafted & raid BiS)
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

                nextBeam.push({
                    items: [...state.items, { ...item, targetSlot: slotObj.slotName, slotKey: slotObj.slotKey }],
                    totalStats: nextStats,
                    craftedCount: nextCraftedCount,
                    craftedCategories: nextCraftedCategories,
                    craftedIds: nextCraftedIds,
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
        pkgOptimal
    };
}

if (typeof window !== 'undefined') {
    window.getCanonicalSlot = getCanonicalSlot;
    window.findOptimalDungeonPackages = findOptimalDungeonPackages;
}
