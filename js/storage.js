/**
 * storage.js
 * Session state, localStorage persistence, and cache restoration.
 */

// Cached analysis results for instant recalculation without re-fetching
var cachedPlayers = [];
var cachedClassSlug = '';
var cachedSpecSlug = '';
var cachedSeasonSlug = 'season-mn-2';
var activeSimCProfile = null;

// -------------------------------------------------------------
// Session Persistence (localStorage)
// -------------------------------------------------------------
function saveTop10AnalysisToStorage(players, classSlug, specSlug, regionSlug, seasonSlug) {
    try {
        const data = {
            players: players || cachedPlayers,
            classSlug: classSlug || cachedClassSlug || document.getElementById('class-select')?.value,
            specSlug: specSlug || cachedSpecSlug || document.getElementById('spec-select')?.value,
            regionSlug: regionSlug || document.getElementById('region-select')?.value,
            seasonSlug: seasonSlug || cachedSeasonSlug || document.getElementById('season-select')?.value,
            exclude344: document.getElementById('exclude-344-check')?.checked || false,
            timestamp: Date.now()
        };
        localStorage.setItem('wow_top10_analysis_cache', JSON.stringify(data));
    } catch (e) {
        console.warn('Could not save top 50 analysis to localStorage:', e);
    }
}

function loadTop10AnalysisFromStorage() {
    try {
        const raw = localStorage.getItem('wow_top10_analysis_cache');
        if (!raw) return false;
        const data = JSON.parse(raw);
        if (!data || !data.players || !Array.isArray(data.players) || data.players.length === 0) {
            return false;
        }

        // Restore filter values in UI
        if (data.classSlug) {
            const classSelect = document.getElementById('class-select');
            if (classSelect) classSelect.value = data.classSlug;
        }
        if (typeof updateSpecSelect === 'function') {
            updateSpecSelect(data.specSlug);
        }

        if (data.regionSlug) {
            const regSelect = document.getElementById('region-select');
            if (regSelect) regSelect.value = data.regionSlug;
        }
        if (data.seasonSlug) {
            const sSelect = document.getElementById('season-select');
            if (sSelect) sSelect.value = data.seasonSlug;
        }
        if (typeof data.exclude344 === 'boolean') {
            const check = document.getElementById('exclude-344-check');
            if (check) check.checked = data.exclude344;
        }

        cachedPlayers = data.players;
        cachedClassSlug = data.classSlug || document.getElementById('class-select')?.value;
        cachedSpecSlug = data.specSlug || document.getElementById('spec-select')?.value;
        cachedSeasonSlug = data.seasonSlug || 'season-mn-2';

        // Pre-fill tooltip cache from restored players' items
        data.players.forEach(p => {
            Object.values(p.itemDetails || {}).forEach(it => {
                if (it && it.item_id) {
                    const bonusStr = (it.bonuses || []).join(':');
                    const cacheKey = `${it.item_id}_${it.ilvl || 0}_${bonusStr}`;
                    if (!tooltipCache.has(cacheKey)) {
                        tooltipCache.set(cacheKey, {
                            name: it.name,
                            icon: it.icon,
                            ilvl: it.ilvl,
                            stats: it.stats || {}
                        });
                    }
                }
            });
        });

        // Render results instantly
        if (typeof renderResults === 'function') {
            renderResults(cachedPlayers, cachedClassSlug, cachedSpecSlug);
        }

        // Show a restored badge in UI
        showRestoredDataBadge(data.timestamp);

        return true;
    } catch (e) {
        console.warn('Error loading top 50 analysis from localStorage:', e);
        return false;
    }
}

function saveSimCAnalysisToStorage() {
    try {
        if (!activeSimCProfile) return;
        const rawText = document.getElementById('simc-text')?.value || '';
        const data = {
            rawText,
            parsedProfile: activeSimCProfile.parsedProfile,
            userStats: activeSimCProfile.userStats,
            userItemsDetails: activeSimCProfile.userItemsDetails,
            top10Players: activeSimCProfile.top10Players,
            lockedSlots: Array.from(activeSimCProfile.lockedSlots || []),
            activePaperdollTab: activeSimCProfile.activePaperdollTab || 'current',
            timestamp: Date.now()
        };
        localStorage.setItem('wow_simc_analysis_cache', JSON.stringify(data));
    } catch (e) {
        console.warn('Could not save SimC analysis to localStorage:', e);
    }
}

function loadSimCAnalysisFromStorage() {
    try {
        const raw = localStorage.getItem('wow_simc_analysis_cache');
        if (!raw) return false;
        const data = JSON.parse(raw);
        if (!data) return false;

        // Restore SimC textarea
        const txtArea = document.getElementById('simc-text');
        if (txtArea && data.rawText) {
            txtArea.value = data.rawText;
        }

        // Use cachedPlayers or stored top10Players to restore full comparison results
        const playersToUse = (cachedPlayers && cachedPlayers.length > 0) ? cachedPlayers : (data.top10Players || []);
        if (playersToUse.length > 0 && data.parsedProfile && data.userItemsDetails) {
            if (!cachedPlayers || cachedPlayers.length === 0) {
                cachedPlayers = playersToUse;
            }
            activeSimCProfile = {
                parsedProfile: data.parsedProfile,
                userStats: data.userStats,
                userItemsDetails: data.userItemsDetails,
                top10Players: playersToUse,
                lockedSlots: new Set(data.lockedSlots || []),
                activePaperdollTab: data.activePaperdollTab || 'current'
            };

            const outputBox = document.getElementById('simc-comparison-box');
            if (outputBox) {
                outputBox.classList.remove('hidden');
            }
            if (typeof renderSimCComparisonResults === 'function') {
                renderSimCComparisonResults();
            }
            return true;
        }
        return false;
    } catch (e) {
        console.warn('Error loading SimC analysis from localStorage:', e);
        return false;
    }
}

function showRestoredDataBadge(timestamp) {
    const badge = document.getElementById('restored-session-badge');
    if (!badge) return;

    let timeStr = '';
    if (timestamp) {
        const diffMinutes = Math.round((Date.now() - timestamp) / 60000);
        if (diffMinutes < 1) {
            timeStr = (typeof t === 'function') ? t('agoMoment') : 'hace un momento';
        } else if (diffMinutes < 60) {
            timeStr = (typeof t === 'function') ? t('agoMin', { n: diffMinutes }) : `hace ${diffMinutes} min`;
        } else {
            const diffHours = Math.round(diffMinutes / 60);
            timeStr = (typeof t === 'function') ? t('agoH', { n: diffHours }) : `hace ${diffHours} h`;
        }
    }

    const diskIcon = (typeof getIcon === 'function') ? getIcon('disk', 'w-3.5 h-3.5 text-cyan-300') : '';
    const badgeText = (typeof t === 'function') ? t('restoredBadge') : 'Último análisis restaurado';
    const deleteText = (typeof t === 'function') ? t('delete') : 'Borrar';

    badge.innerHTML = `
        <span class="flex items-center gap-1.5">${diskIcon} ${badgeText} ${timeStr ? `(${timeStr})` : ''}</span>
        <button type="button" onclick="clearSavedAnalysis()" class="underline hover:text-white text-[10px]" title="${deleteText}">${deleteText}</button>
    `;
    badge.classList.remove('hidden');
}

function clearSavedAnalysis() {
    try {
        localStorage.removeItem('wow_top10_analysis_cache');
        localStorage.removeItem('wow_simc_analysis_cache');
        const badge = document.getElementById('restored-session-badge');
        if (badge) badge.classList.add('hidden');
    } catch (e) {
        console.warn(e);
    }
}
window.clearSavedAnalysis = clearSavedAnalysis;

if (typeof window !== 'undefined') {
    window.saveTop10AnalysisToStorage = saveTop10AnalysisToStorage;
    window.loadTop10AnalysisFromStorage = loadTop10AnalysisFromStorage;
    window.saveSimCAnalysisToStorage = saveSimCAnalysisToStorage;
    window.loadSimCAnalysisFromStorage = loadSimCAnalysisFromStorage;
    window.showRestoredDataBadge = showRestoredDataBadge;
    window.clearSavedAnalysis = clearSavedAnalysis;
}
