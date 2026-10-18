/**
 * top-analysis.js
 * Raider.IO Top 50 character retrieval, pagination, concurrent gear fetching, and stats aggregation.
 */

// Main Analysis workflow
async function startAnalysis() {
    const classSlug = document.getElementById('class-select').value;
    const specSlug = document.getElementById('spec-select').value;
    const regionSlug = document.getElementById('region-select').value;
    const seasonSlug = document.getElementById('season-select').value;
    cachedSeasonSlug = seasonSlug;
    cachedSpecSlug = specSlug;
    const btn = document.getElementById('analyze-btn');
    
    if (btn) {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    }
    
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) resultsSection.classList.add('hidden');
    const errorBox = document.getElementById('error-box');
    if (errorBox) errorBox.classList.add('hidden');
    
    try {
        const specObj = WOW_CLASSES[classSlug]?.specs?.find(s => s.slug === specSlug);
        const roleParam = specObj?.role || 'all';
        const TARGET_PLAYER_COUNT = 50;
        const MAX_PAGES = 8;
        const candidatePool = [];
        
        setProgress(10, `Buscando Top ${TARGET_PLAYER_COUNT} jugadores de ${specObj?.name || specSlug} en Raider.IO...`);
        
        // 1. Fetch Leaderboard with pagination to gather candidate pool
        for (let page = 0; page < MAX_PAGES && candidatePool.length < 80; page++) {
            const lbUrl = `https://raider.io/api/mythic-plus/rankings/characters?region=${regionSlug}&season=${seasonSlug}&class=${classSlug}&role=${roleParam}&page=${page}`;
            const lbData = await fetchJson(lbUrl);
            
            const rawRankings = lbData?.rankings?.rankedCharacters || [];
            if (rawRankings.length === 0) break;
            
            for (const r of rawRankings) {
                if (r.character?.spec?.slug === specSlug) {
                    candidatePool.push(r);
                }
            }
            
            if (rawRankings.length < 100) break;
        }

        // Secondary collection pass: If fewer than 70 candidates have the spec slug on their profile,
        // gather other class players to inspect if they ran keys in the target spec
        if (candidatePool.length < 70) {
            for (let page = 0; page < MAX_PAGES && candidatePool.length < 80; page++) {
                const lbUrl = `https://raider.io/api/mythic-plus/rankings/characters?region=${regionSlug}&season=${seasonSlug}&class=${classSlug}&role=${roleParam}&page=${page}`;
                const lbData = await fetchJson(lbUrl);
                const rawRankings = lbData?.rankings?.rankedCharacters || [];
                for (const r of rawRankings) {
                    if (!candidatePool.some(c => c.character?.name === r.character?.name && c.character?.realm?.slug === r.character?.realm?.slug)) {
                        candidatePool.push(r);
                        if (candidatePool.length >= 80) break;
                    }
                }
                if (rawRankings.length < 100) break;
            }
        }
        
        if (candidatePool.length === 0) {
            throw new Error(`No se encontraron jugadores para la especialización ${specObj?.name || specSlug} en el ranking.`);
        }
        
        setProgress(20, `Analizando candidatos para ${specObj?.name || specSlug}. Verificando que cada jugador use exactamente esta especialidad...`);
        
        // 2. Fetch Profiles & Gear Snapshots with STRICT SPEC VERIFICATION using worker pool
        const CONCURRENCY = 10;
        
        async function fetchSinglePlayerGear(rankedChar) {
            const char = rankedChar.character;
            const rankNum = rankedChar.rank || 0;
            const score = rankedChar.score;
            const runs = rankedChar.runs || [];
            
            let gearItems = null;
            let equippedIlvl = 0;
            let runInfo = null;
            let playerSpec = null;
            let profileUrl = `https://raider.io/characters/${char.region.slug}/${char.realm.slug}/${encodeURIComponent(char.name)}`;
            let thumbnailUrl = '';

            // Step A: Search player's runs (ordered by mythicLevel desc, then score desc)
            // for an authentic run verified to be played in the target spec
            const sortedRuns = [...runs].sort((a, b) => (b.mythicLevel || 0) - (a.mythicLevel || 0) || (b.score || 0) - (a.score || 0));

            for (const bestRun of sortedRuns) {
                if (!bestRun.keystoneRunId) continue;
                const runUrl = `https://raider.io/api/v1/mythic-plus/run-details?season=${seasonSlug}&id=${bestRun.keystoneRunId}`;
                try {
                    const runData = await fetchJson(runUrl);
                    const roster = runData.roster || [];
                    const m = roster.find(mem => mem.character?.name?.toLowerCase() === char.name.toLowerCase());
                    if (m && m.character?.spec) {
                        const mSlug = m.character.spec.slug;
                        const mName = m.character.spec.name;
                        const isTargetSpec = mSlug === specSlug || (specObj && mName.toLowerCase() === specObj.name.toLowerCase());
                        if (isTargetSpec) {
                            const rawGear = m.items?.items || {};
                            if (Object.keys(rawGear).length > 0) {
                                gearItems = rawGear;
                                equippedIlvl = m.items?.item_level_equipped || 0;
                                playerSpec = mName;
                                runInfo = {
                                    dungeon: runData.dungeon?.name || 'Mítica+',
                                    level: runData.mythic_level || bestRun.mythicLevel,
                                    runId: bestRun.keystoneRunId
                                };
                                break; // Found authentic run in target spec!
                            }
                        }
                    }
                } catch (err) {
                    console.warn(`No se pudo obtener la run ${bestRun.keystoneRunId} para ${char.name}:`, err);
                }
            }

            // Step B: Fallback to active equipped profile ONLY IF active spec matches the target spec
            if (!gearItems) {
                const pUrl = `https://raider.io/api/v1/characters/profile?region=${char.region.slug}&realm=${char.realm.slug}&name=${encodeURIComponent(char.name)}&fields=gear`;
                try {
                    const pData = await fetchJson(pUrl);
                    const activeSpec = pData.active_spec_name || '';
                    const isTargetSpec = specObj && activeSpec.toLowerCase() === specObj.name.toLowerCase();
                    if (isTargetSpec) {
                        gearItems = pData.gear?.items || {};
                        equippedIlvl = pData.gear?.item_level_equipped || 0;
                        playerSpec = activeSpec;
                        thumbnailUrl = pData.thumbnail_url || '';
                        profileUrl = pData.profile_url || profileUrl;
                    }
                } catch (err) {
                    console.warn(`Error al cargar perfil de ${char.name}:`, err);
                }
            }

            // Step C: STRICT SPEC VALIDATION - Discard completely if not playing target spec
            if (!gearItems || !playerSpec || (specObj && playerSpec.toLowerCase() !== specObj.name.toLowerCase())) {
                return null;
            }

            return {
                rank: rankNum,
                name: char.name,
                realm: char.realm.name || char.realm.slug,
                region: char.region.slug.toUpperCase(),
                spec: playerSpec,
                class: char.class?.name || '',
                classSlug: classSlug,
                score: score,
                ilvl: equippedIlvl,
                thumbnail: thumbnailUrl,
                profileUrl: profileUrl,
                runInfo: runInfo,
                gear: gearItems
            };
        }
        
        const verifiedPlayers = [];
        let candidateIndex = 0;
        let isDone = false;

        async function worker() {
            while (!isDone && candidateIndex < candidatePool.length) {
                if (verifiedPlayers.length >= TARGET_PLAYER_COUNT) {
                    isDone = true;
                    break;
                }
                const cur = candidateIndex++;
                const candidate = candidatePool[cur];
                const result = await fetchSinglePlayerGear(candidate);
                if (result && result.gear && Object.keys(result.gear).length > 0) {
                    if (result.spec && specObj && result.spec.toLowerCase() === specObj.name.toLowerCase()) {
                        if (verifiedPlayers.length < TARGET_PLAYER_COUNT) {
                            verifiedPlayers.push(result);
                            const currentPct = 20 + Math.floor((verifiedPlayers.length / TARGET_PLAYER_COUNT) * 45);
                            const runLabel = result.runInfo ? ` (+${result.runInfo.level} ${result.runInfo.dungeon})` : '';
                            setProgress(currentPct, `Verificado [${result.spec}]: ${result.name}${runLabel} (${verifiedPlayers.length}/${TARGET_PLAYER_COUNT})...`);
                        }
                        if (verifiedPlayers.length >= TARGET_PLAYER_COUNT) {
                            isDone = true;
                            break;
                        }
                    }
                }
            }
        }
        
        const workerCount = Math.min(CONCURRENCY, candidatePool.length);
        const workers = [];
        for (let w = 0; w < workerCount; w++) {
            workers.push(worker());
        }
        await Promise.all(workers);
        
        // Sort verified players by score descending
        verifiedPlayers.sort((a, b) => (b.score || 0) - (a.score || 0));

        const loadedPlayers = verifiedPlayers;
        if (loadedPlayers.length === 0) {
            throw new Error(`No se encontraron jugadores verificados para la especialización ${specObj?.name || specSlug}.`);
        }
        
        setProgress(65, 'Analizando atributos secundarios y gemas con Wowhead...');
        
        // 3. Process items and calculate stats for all players (parallelized tooltips per player)
        for (let pIdx = 0; pIdx < loadedPlayers.length; pIdx++) {
            const p = loadedPlayers[pIdx];
            p.stats = {
                'Critical Strike': 0,
                'Haste': 0,
                'Mastery': 0,
                'Versatility': 0
            };
            p.itemDetails = {};
            
            const itemEntries = Object.entries(p.gear).filter(([slot, item]) => item && item.item_id && slot !== 'shirt' && slot !== 'tabard');
            
            const slotDetails = await Promise.all(itemEntries.map(async ([slot, item]) => {
                const tt = await fetchItemTooltip(item.item_id, item.item_level, item.bonuses);
                return { slot, item, tt };
            }));

            for (const { slot, item, tt } of slotDetails) {
                // Add base item secondary stats
                for (const [statName, val] of Object.entries(tt.stats || {})) {
                    if (p.stats[statName] !== undefined) {
                        p.stats[statName] += val;
                    }
                }
                
                // Add gem secondary stats
                const gems = item.gems_detail || [];
                for (const g of gems) {
                    const gName = g.name || '';
                    const mGems = gName.matchAll(/(\d+)\s*(Crit|Vers|Haste|Mastery)/gi);
                    const gemStatMap = { 'crit': 'Critical Strike', 'vers': 'Versatility', 'haste': 'Haste', 'mastery': 'Mastery' };
                    for (const gm of mGems) {
                        const val = parseInt(gm[1], 10);
                        const key = gemStatMap[gm[2].toLowerCase()];
                        if (key && p.stats[key] !== undefined) {
                            p.stats[key] += val;
                        }
                    }
                }
                
                p.itemDetails[slot] = {
                    slot: slot,
                    item_id: item.item_id,
                    ilvl: item.item_level,
                    name: item.name || tt.name,
                    icon: item.icon || tt.icon,
                    bonuses: item.bonuses || [],
                    stats: tt.stats || {},
                    gems: gems,
                    enchants: item.enchants_detail || []
                };
            }
            
            // Total secondary stats sum
            p.totalSecondary = Object.values(p.stats).reduce((a, b) => a + b, 0);
            
            const pProgress = 65 + Math.floor(((pIdx + 1) / loadedPlayers.length) * 30);
            setProgress(pProgress, `Calculando estadísticas secundarias (${pIdx + 1}/${loadedPlayers.length})...`);
        }
        
        // Synchronously cache players and update UI immediately
        cachedPlayers = loadedPlayers;
        cachedClassSlug = classSlug;
        cachedSpecSlug = specSlug;

        setProgress(100, '¡Análisis completado!');
        hideProgress();
        renderResults(loadedPlayers, classSlug, specSlug);
        saveTop10AnalysisToStorage(loadedPlayers, classSlug, specSlug, regionSlug, seasonSlug);
        const badge = document.getElementById('restored-session-badge');
        if (badge) badge.classList.add('hidden');

        return loadedPlayers;
        
    } catch (err) {
        console.error(err);
        hideProgress();
        showError(err.message || 'Ocurrió un error inesperado al procesar los datos.');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
}

if (typeof window !== 'undefined') {
    window.startAnalysis = startAnalysis;
}
