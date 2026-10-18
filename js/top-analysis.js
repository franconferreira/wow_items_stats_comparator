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
        const MAX_PAGES = 5;
        const collectedRankedChars = [];
        
        setProgress(10, `Buscando Top ${TARGET_PLAYER_COUNT} jugadores de ${specObj?.name || specSlug} en Raider.IO...`);
        
        // 1. Fetch Leaderboard with pagination, strictly filtering to the selected specialization
        for (let page = 0; page < MAX_PAGES && collectedRankedChars.length < TARGET_PLAYER_COUNT; page++) {
            const lbUrl = `https://raider.io/api/mythic-plus/rankings/characters?region=${regionSlug}&season=${seasonSlug}&class=${classSlug}&role=${roleParam}&page=${page}`;
            const lbData = await fetchJson(lbUrl);
            
            const rawRankings = lbData?.rankings?.rankedCharacters || [];
            if (rawRankings.length === 0) break;
            
            for (const r of rawRankings) {
                if (r.character?.spec?.slug === specSlug) {
                    collectedRankedChars.push(r);
                    if (collectedRankedChars.length >= TARGET_PLAYER_COUNT) break;
                }
            }
            
            if (rawRankings.length < 100) break;
        }
        
        const topPlayers = collectedRankedChars.slice(0, TARGET_PLAYER_COUNT);
        if (topPlayers.length === 0) {
            throw new Error(`No se encontraron jugadores para la especialización ${specObj?.name || specSlug} en el ranking.`);
        }
        
        setProgress(20, `Se encontraron ${topPlayers.length} jugadores (${specObj?.name || specSlug}). Descargando perfiles y equipamiento verificado...`);
        
        // 2. Fetch Profiles & Gear Snapshots using a concurrency pool (10 workers)
        let completedPlayers = 0;
        const CONCURRENCY = 10;
        const loadedPlayersResults = new Array(topPlayers.length);
        
        async function fetchSinglePlayerGear(rankedChar, idx) {
            const char = rankedChar.character;
            const rankNum = rankedChar.rank || (idx + 1);
            const score = rankedChar.score;
            const runs = rankedChar.runs || [];
            
            let gearItems = null;
            let equippedIlvl = 0;
            let runInfo = null;
            let playerSpec = char.spec?.name || '';
            let profileUrl = `https://raider.io/characters/${char.region.slug}/${char.realm.slug}/${encodeURIComponent(char.name)}`;
            let thumbnailUrl = '';

            // Step A: Find the player's best run (highest mythicLevel, then highest score)
            let bestRun = null;
            if (runs.length > 0) {
                const sortedRuns = [...runs].sort((a, b) => (b.mythicLevel || 0) - (a.mythicLevel || 0) || (b.score || 0) - (a.score || 0));
                bestRun = sortedRuns[0];
            }

            // Step B: Query the run-details to get the authentic gear snapshot worn during that M+ run
            if (bestRun && bestRun.keystoneRunId) {
                const runUrl = `https://raider.io/api/v1/mythic-plus/run-details?season=${seasonSlug}&id=${bestRun.keystoneRunId}`;
                try {
                    const runData = await fetchJson(runUrl);
                    const roster = runData.roster || [];
                    for (const m of roster) {
                        if (m.character?.name?.toLowerCase() === char.name.toLowerCase()) {
                            const rawGear = m.items?.items || {};
                            if (Object.keys(rawGear).length > 0) {
                                gearItems = rawGear;
                                equippedIlvl = m.items?.item_level_equipped || 0;
                                playerSpec = m.character?.spec?.name || playerSpec;
                                runInfo = {
                                    dungeon: runData.dungeon?.name || 'Mítica+',
                                    level: runData.mythic_level || bestRun.mythicLevel,
                                    runId: bestRun.keystoneRunId
                                };
                            }
                            break;
                        }
                    }
                } catch (err) {
                    console.warn(`No se pudo obtener la run ${bestRun.keystoneRunId} para ${char.name}, recurriendo a perfil:`, err);
                }
            }

            // Step C: Fallback to active equipped profile if run-details was not found
            if (!gearItems) {
                const pUrl = `https://raider.io/api/v1/characters/profile?region=${char.region.slug}&realm=${char.realm.slug}&name=${encodeURIComponent(char.name)}&fields=gear`;
                try {
                    const pData = await fetchJson(pUrl);
                    gearItems = pData.gear?.items || {};
                    equippedIlvl = pData.gear?.item_level_equipped || 0;
                    playerSpec = pData.active_spec_name || playerSpec;
                    thumbnailUrl = pData.thumbnail_url || '';
                    profileUrl = pData.profile_url || profileUrl;
                } catch (err) {
                    console.warn(`Error al cargar perfil de ${char.name}:`, err);
                }
            }

            completedPlayers++;
            const currentPct = 20 + Math.floor((completedPlayers / topPlayers.length) * 45);
            const runLabel = runInfo ? ` (+${runInfo.level} ${runInfo.dungeon})` : '';
            setProgress(currentPct, `Obtenido equipo verificado de ${char.name}${runLabel} (${completedPlayers}/${topPlayers.length})...`);

            if (!gearItems) return null;

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
        
        let nextIndex = 0;
        async function worker() {
            while (nextIndex < topPlayers.length) {
                const cur = nextIndex++;
                loadedPlayersResults[cur] = await fetchSinglePlayerGear(topPlayers[cur], cur);
            }
        }
        
        const workerCount = Math.min(CONCURRENCY, topPlayers.length);
        const workers = [];
        for (let w = 0; w < workerCount; w++) {
            workers.push(worker());
        }
        await Promise.all(workers);
        
        const loadedPlayers = loadedPlayersResults.filter(Boolean);
        if (loadedPlayers.length === 0) {
            throw new Error('No se pudo descargar el equipamiento de los jugadores.');
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
