/**
 * api.js
 * Network communication layer (Raider.IO & Wowhead) and item tooltip caching.
 */

// Item tooltip cache to avoid re-fetching the same items from Wowhead
const tooltipCache = new Map();

// Universal fetch helper: uses local proxy (/api/proxy) or Vercel proxy, with friendly error handling
async function fetchJson(url) {
    // 1. If running under http: or https:, use our backend/serverless proxy to bypass CORS
    if (window.location.protocol.startsWith('http')) {
        try {
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
            const res = await fetch(proxyUrl);
            if (res.ok) {
                return await res.json();
            }
        } catch (e) {
            console.warn('Proxy request failed, trying direct fetch...', e);
        }
    }

    // 2. Direct fetch attempt
    try {
        const directRes = await fetch(url);
        if (directRes.ok) {
            return await directRes.json();
        }
    } catch (e) {
        console.warn('Direct fetch failed:', e);
    }

    // 3. Informative error if running directly from file://
    if (window.location.protocol === 'file:') {
        throw new Error("Estás abriendo la página directamente como un archivo local (file://). Por seguridad (CORS), los navegadores bloquean las consultas directas a Raider.IO. Por favor, ejecuta 'start.bat' para abrirla con el servidor proxy local, o despliega la carpeta en Vercel/Netlify.");
    }

    throw new Error(`Error de red al consultar ${url}`);
}

// Fetch helper for Wowhead tooltips
async function fetchItemTooltip(itemId, ilvl, bonuses) {
    const bonusStr = (bonuses || []).join(':');
    const cacheKey = `${itemId}_${ilvl}_${bonusStr}`;
    
    if (tooltipCache.has(cacheKey)) {
        return tooltipCache.get(cacheKey);
    }
    
    const url = `https://nether.wowhead.com/tooltip/item/${itemId}?ilvl=${ilvl}&bonus=${bonusStr}`;
    try {
        const data = await fetchJson(url);
        const tooltipHtml = data.tooltip || '';
        
        const stats = {};
        // Regex pattern matching secondary stats from tooltip HTML
        const matches = tooltipHtml.matchAll(/>\+?<!--\w+-->([\d,]+)\s+([^<]+)</g);
        for (const m of matches) {
            const val = parseInt(m[1].replace(/,/g, ''), 10);
            const name = m[2].trim();
            if (STAT_COLORS[name]) {
                stats[name] = val;
            }
        }
        
        // Fallback pattern if comment markers are missing
        if (Object.keys(stats).length === 0) {
            const fallbackMatches = tooltipHtml.matchAll(/\+([\d,]+)\s+(Critical Strike|Haste|Mastery|Versatility)/gi);
            for (const fm of fallbackMatches) {
                const val = parseInt(fm[1].replace(/,/g, ''), 10);
                const statRaw = fm[2].toLowerCase();
                for (const canonical of Object.keys(STAT_COLORS)) {
                    if (canonical.toLowerCase() === statRaw) {
                        stats[canonical] = val;
                    }
                }
            }
        }
        
        const ilvlMatch = tooltipHtml.match(/Item Level\s*(?:<!--ilvl-->)?\s*(\d+)/i);
        const resolvedIlvl = ilvlMatch ? parseInt(ilvlMatch[1], 10) : (parseInt(ilvl, 10) || 0);

        const result = {
            name: data.name,
            icon: data.icon,
            quality: data.quality,
            ilvl: resolvedIlvl,
            stats
        };
        
        tooltipCache.set(cacheKey, result);
        return result;
    } catch (e) {
        console.warn(`Could not load tooltip for item ${itemId}:`, e);
        const fallback = { name: 'Item', stats: {}, ilvl: parseInt(ilvl, 10) || 0 };
        tooltipCache.set(cacheKey, fallback);
        return fallback;
    }
}

// Helper to calculate a player's secondary stats, with optional ilvl 344 exclusion
function getPlayerSecondaryStats(player, exclude344 = false) {
    const stats = {
        'Critical Strike': 0,
        'Haste': 0,
        'Mastery': 0,
        'Versatility': 0
    };
    let excludedItems = 0;

    for (const [slot, it] of Object.entries(player.itemDetails || {})) {
        if (!it || !it.item_id) continue;

        // Skip ilvl 344 items if the filter is active
        if (exclude344 && it.ilvl === 344) {
            excludedItems++;
            continue;
        }

        // Base item secondary stats
        for (const [sName, sVal] of Object.entries(it.stats || {})) {
            if (stats[sName] !== undefined) {
                stats[sName] += sVal;
            }
        }

        // Gems secondary stats from this item
        const gems = it.gems || [];
        for (const g of gems) {
            const gName = g.name || '';
            const mGems = gName.matchAll(/(\d+)\s*(Crit|Vers|Haste|Mastery)/gi);
            const gemStatMap = { 'crit': 'Critical Strike', 'vers': 'Versatility', 'haste': 'Haste', 'mastery': 'Mastery' };
            for (const gm of mGems) {
                const val = parseInt(gm[1], 10);
                const key = gemStatMap[gm[2].toLowerCase()];
                if (key && stats[key] !== undefined) {
                    stats[key] += val;
                }
            }
        }
    }

    return { stats, excludedItems };
}

if (typeof window !== 'undefined') {
    window.tooltipCache = tooltipCache;
    window.fetchJson = fetchJson;
    window.fetchItemTooltip = fetchItemTooltip;
    window.getPlayerSecondaryStats = getPlayerSecondaryStats;
}
