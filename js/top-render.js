/**
 * top-render.js
 * Visual presentation for Top 50 consensus, popular items, crafted gear, gems/enchants, raid bosses, and player comparison table.
 */

// Top 50 Gear Tab Switching
let currentTop10GearTab = 'slots';

function switchTop10GearTab(tabKey) {
    currentTop10GearTab = tabKey || 'slots';

    const panes = {
        slots: document.getElementById('top10-pane-slots'),
        crafted: document.getElementById('top10-pane-crafted')
    };

    const buttons = {
        slots: document.getElementById('top10-tab-btn-slots'),
        crafted: document.getElementById('top10-tab-btn-crafted')
    };

    const titleEl = document.getElementById('top10-tabs-title');
    const badgeEl = document.getElementById('top10-tabs-badge');
    const subtitleEl = document.getElementById('top10-tabs-subtitle');
    const iconEl = document.getElementById('top10-tabs-icon');
    const iconWrap = document.getElementById('top10-tabs-icon-wrap');

    // Make sure container is unfolded if tab is switched
    const bodyEl = document.getElementById('top10-gear-body');
    if (bodyEl && bodyEl.classList.contains('hidden')) {
        if (typeof toggleCollapse === 'function') {
            toggleCollapse('top10-gear-body', 'top10-gear-chevron', 'top10-gear-status');
        }
    }

    // Toggle panes
    Object.keys(panes).forEach(k => {
        if (panes[k]) {
            if (k === currentTop10GearTab) {
                panes[k].classList.remove('hidden');
            } else {
                panes[k].classList.add('hidden');
            }
        }
    });

    // Tab configurations
    const tabConfigs = {
        slots: {
            title: (typeof t === 'function') ? t('tabSlotsTitle') : 'Ítems Más Elegidos por Ranura',
            badge: (typeof t === 'function') ? t('top50BuildsBadge') : 'Top 50 Builds',
            badgeClass: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
            subtitle: (typeof t === 'function') ? t('tabSlotsSubtitle') : 'Abalorios, armas y anillos más populares del Top 50',
            icon: (typeof getIcon === 'function') ? getIcon('shield', 'w-4 h-4 text-yellow-400') : '',
            iconWrapClass: 'w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shrink-0',
            activeBtnClass: 'bg-yellow-600 text-white shadow-md'
        },
        crafted: {
            title: (typeof t === 'function') ? t('tabCraftedTitle') : 'Ítems Crafteados Más Utilizados',
            badge: (typeof t === 'function') ? t('professionsBadge') : 'Profesiones & Embellishments',
            badgeClass: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
            subtitle: (typeof t === 'function') ? t('tabCraftedSubtitle') : 'Piezas fabricadas con chispas o profesiones elegidas en lugar de drops de mazmorra o banda',
            icon: (typeof getIcon === 'function') ? getIcon('hammer', 'w-4 h-4 text-blue-400') : '',
            iconWrapClass: 'w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0',
            activeBtnClass: 'bg-blue-600 text-white shadow-md'
        }
    };

    const currentConfig = tabConfigs[currentTop10GearTab] || tabConfigs.slots;

    if (titleEl) titleEl.textContent = currentConfig.title;
    if (subtitleEl) subtitleEl.textContent = currentConfig.subtitle;
    if (badgeEl) {
        badgeEl.textContent = currentConfig.badge;
        badgeEl.className = `text-[10px] font-bold px-2 py-0.5 rounded-full ${currentConfig.badgeClass}`;
    }
    if (iconEl) iconEl.innerHTML = currentConfig.icon;
    if (iconWrap) iconWrap.className = currentConfig.iconWrapClass;

    Object.keys(buttons).forEach(k => {
        const btn = buttons[k];
        if (!btn) return;
        const baseClasses = 'px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5';
        if (k === currentTop10GearTab) {
            btn.className = `${baseClasses} ${currentConfig.activeBtnClass}`;
        } else {
            btn.className = `${baseClasses} text-gray-400 hover:text-white hover:bg-gray-800/60`;
        }
    });

    if (window.$WowheadPower && typeof window.$WowheadPower.refreshLinks === 'function') {
        window.$WowheadPower.refreshLinks();
    }
}
window.switchTop10GearTab = switchTop10GearTab;

// Render Results to UI
function renderResults(players, classSlug, specSlug = null) {
    cachedPlayers = players;
    cachedClassSlug = classSlug;
    if (specSlug) cachedSpecSlug = specSlug;

    const resultsSection = document.getElementById('results-section');
    if (resultsSection) resultsSection.classList.remove('hidden');

    const exclude344 = document.getElementById('exclude-344-check')?.checked || false;
    const badge = document.getElementById('filter-active-badge');
    const subtitle = document.getElementById('consensus-subtitle');

    if (exclude344) {
        if (badge) badge.classList.remove('hidden');
        if (subtitle) subtitle.textContent = (typeof t === 'function') ? t('consensusSubtitleExclude') : 'Promedio y distribución recalculados excluyendo piezas ilvl 344';
    } else {
        if (badge) badge.classList.add('hidden');
        if (subtitle) subtitle.textContent = (typeof t === 'function') ? t('consensusSubtitle', { n: players.length || 50 }) : `Promedio y distribución de estadísticas de los ${players.length || 50} mejores clasificados`;
    }

    renderConsensus(players, classSlug, exclude344);
    renderPopularItems(players);
    renderCraftedItems(players);
    renderPlayerTable(players, exclude344);

    switchTop10GearTab(currentTop10GearTab);

    // Refresh Wowhead tooltips for all generated links
    if (window.$WowheadPower && typeof window.$WowheadPower.refreshLinks === 'function') {
        window.$WowheadPower.refreshLinks();
    }
}

// 1. Consensus Summary (Averages & Stat Priority)
function renderConsensus(players, classSlug, exclude344 = false) {
    const count = players.length;
    const totals = { 'Critical Strike': 0, 'Haste': 0, 'Mastery': 0, 'Versatility': 0 };
    let sumAllSecondary = 0;
    let totalExcludedCount = 0;

    players.forEach(p => {
        const { stats, excludedItems } = getPlayerSecondaryStats(p, exclude344);
        totalExcludedCount += excludedItems;
        for (const [st, val] of Object.entries(stats)) {
            totals[st] += val;
            sumAllSecondary += val;
        }
    });

    if (exclude344) {
        const badge = document.getElementById('filter-active-badge');
        if (badge) {
            badge.textContent = `Sin ilvl 344 (${totalExcludedCount} piezas omitidas)`;
        }
    }

    const averages = {};
    const percentages = {};
    for (const [st, sumVal] of Object.entries(totals)) {
        averages[st] = Math.round(sumVal / count);
        percentages[st] = sumAllSecondary > 0 ? ((sumVal / sumAllSecondary) * 100).toFixed(1) : 0;
    }

    // Sort stats by average descending
    const sortedStats = Object.keys(averages).sort((a, b) => averages[b] - averages[a]);

    // Render Priority Text
    const priorityText = sortedStats.map(s => `${(typeof getStatName === 'function') ? getStatName(s, true) : STAT_COLORS[s].name} (${percentages[s]}%)`).join(' > ');
    const priorityEl = document.getElementById('stat-priority-text');
    if (priorityEl) {
        priorityEl.textContent = priorityText;
    }

    // Render Visual Distribution Bar
    const distBar = document.getElementById('stat-distribution-bar');
    if (distBar) {
        distBar.innerHTML = '';
        sortedStats.forEach(st => {
            const pct = percentages[st];
            if (pct > 0) {
                const sName = (typeof getStatName === 'function') ? getStatName(st, true) : STAT_COLORS[st].name;
                const seg = document.createElement('div');
                seg.style.width = `${pct}%`;
                seg.style.backgroundColor = STAT_COLORS[st].color;
                seg.className = 'h-full transition-all duration-500 relative group flex items-center justify-center text-xs font-bold text-black';
                seg.title = `${sName}: ${pct}% (${(typeof t === 'function') ? t('top50Avg') : 'Promedio'}: ${averages[st]})`;
                if (parseFloat(pct) >= 3) {
                    seg.textContent = `${pct}%`;
                }
                distBar.appendChild(seg);
            }
        });
    }

    // Render Average Cards
    const avgCardsContainer = document.getElementById('stat-average-cards');
    if (avgCardsContainer) {
        avgCardsContainer.innerHTML = '';
        sortedStats.forEach(st => {
            const cardName = (typeof getStatName === 'function') ? getStatName(st) : STAT_COLORS[st].name;
            const card = document.createElement('div');
            card.className = 'bg-gray-800/80 border border-gray-700/60 rounded-xl p-4 flex flex-col justify-between';
            card.style.borderTop = `3px solid ${STAT_COLORS[st].color}`;

            card.innerHTML = `
                <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-gray-300">${cardName}</span>
                    <span class="text-xs px-2 py-0.5 rounded-full font-bold" style="background-color: ${STAT_COLORS[st].bg}; color: ${STAT_COLORS[st].color}">${percentages[st]}%</span>
                </div>
                <div class="mt-2 text-2xl font-black text-white">${averages[st].toLocaleString()}</div>
                <div class="mt-1 text-xs text-gray-400">${typeof t === 'function' ? t('top50Avg') : 'Promedio Top ' + count} ${exclude344 ? '(sin ilvl 344)' : ''}</div>
            `;
            avgCardsContainer.appendChild(card);
        });
    }
}

// 2. Popular Items Consensus (Trinkets, Weapons, Rings)
function renderPopularItems(players) {
    const container = document.getElementById('popular-items-grid');
    if (!container) return;
    container.innerHTML = '';

    const count = players.length;

    // Count items by slot categories
    const categories = [
        { title: (typeof t === 'function') ? t('topTrinkets') : 'Abalorios Más Elegidos (Trinkets)', slots: ['trinket1', 'trinket2'], maxItems: 3 },
        { title: (typeof t === 'function') ? t('topWeapons') : 'Armas Más Elegidas (Weapons)', slots: ['mainhand', 'offhand'], maxItems: 2 },
        { title: (typeof t === 'function') ? t('topRings') : 'Anillos Más Elegidos (Rings)', slots: ['finger1', 'finger2'], maxItems: 3 }
    ];

    categories.forEach(cat => {
        const itemFrequency = new Map();

        players.forEach(p => {
            cat.slots.forEach(slot => {
                const it = p.itemDetails[slot];
                if (it && it.item_id) {
                    const key = it.item_id;
                    if (!itemFrequency.has(key)) {
                        itemFrequency.set(key, {
                            item_id: it.item_id,
                            name: it.name,
                            icon: it.icon,
                            bonuses: it.bonuses,
                            ilvl: it.ilvl,
                            count: 0
                        });
                    }
                    itemFrequency.get(key).count++;
                }
            });
        });

        const sortedItems = Array.from(itemFrequency.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, cat.maxItems);

        const catBox = document.createElement('div');
        catBox.className = 'bg-gray-800/80 border border-gray-700/60 rounded-xl p-4 flex flex-col';

        let itemsHtml = '';
        sortedItems.forEach(it => {
            const pct = Math.round((it.count / count) * 100);
            const bonusStr = (it.bonuses || []).join(':');
            const iconUrl = it.icon ? `https://wow.zamimg.com/images/wow/icons/medium/${it.icon}.jpg` : 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';

            itemsHtml += `
                <div class="flex items-center justify-between py-2 border-b border-gray-700/40 last:border-0">
                    <div class="flex items-center space-x-3 overflow-hidden">
                        <img src="${iconUrl}" class="w-9 h-9 rounded-lg border border-yellow-600/40 shrink-0" alt="${it.name}">
                        <div class="truncate">
                            <a href="https://www.wowhead.com/item=${it.item_id}" 
                               data-wowhead="item=${it.item_id}&ilvl=${it.ilvl}&bonus=${bonusStr}" 
                               class="text-sm font-bold text-yellow-400 hover:underline truncate block">
                                ${it.name}
                            </a>
                            <span class="text-xs text-gray-400">ilvl ${it.ilvl}</span>
                        </div>
                    </div>
                    <div class="text-right shrink-0 ml-3">
                        <span class="text-sm font-bold text-white">${pct}%</span>
                        <div class="text-xs text-gray-400">${it.count}/${count}</div>
                    </div>
                </div>
            `;
        });

        catBox.innerHTML = `
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">${cat.title}</h4>
            <div class="space-y-1 flex-1">
                ${itemsHtml || '<p class="text-sm text-gray-500">Sin datos</p>'}
            </div>
        `;
        container.appendChild(catBox);
    });
}

// 2b. Render Crafted Items (Spark & Profession Gear)
function renderCraftedItems(players) {
    const container = document.getElementById('crafted-items-grid');
    if (!container) return;
    container.innerHTML = '';

    const count = players.length;
    const craftedMap = new Map();

    players.forEach(p => {
        const playerSeenItems = new Set();

        Object.entries(p.itemDetails || {}).forEach(([slot, it]) => {
            if (!it || !it.item_id || !Array.isArray(it.bonuses)) return;

            const isCrafted = it.bonuses.some(b => CRAFTED_BONUS_SET.has(b));
            if (!isCrafted) return;

            const key = it.item_id;
            const slotName = SLOT_NAMES_ES[slot] || slot;

            if (!craftedMap.has(key)) {
                craftedMap.set(key, {
                    item_id: it.item_id,
                    name: it.name,
                    icon: it.icon,
                    bonuses: it.bonuses,
                    ilvl: it.ilvl,
                    slots: new Set(),
                    playerCount: 0
                });
            }

            const entry = craftedMap.get(key);
            entry.slots.add(slotName);
            if (it.ilvl > entry.ilvl) {
                entry.ilvl = it.ilvl;
                entry.bonuses = it.bonuses;
            }

            if (!playerSeenItems.has(key)) {
                playerSeenItems.add(key);
                entry.playerCount++;
            }
        });
    });

    const sortedCrafted = Array.from(craftedMap.values())
        .sort((a, b) => b.playerCount - a.playerCount || b.ilvl - a.ilvl);

    if (sortedCrafted.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-8 text-center text-sm text-gray-500 bg-gray-900/40 rounded-xl border border-gray-800">
                No se detectaron piezas fabricadas por profesiones o con chispa en este Top ${count}.
            </div>
        `;
        return;
    }

    sortedCrafted.forEach(it => {
        const pct = Math.round((it.playerCount / count) * 100);
        const bonusStr = (it.bonuses || []).join(':');
        const iconUrl = it.icon
            ? `https://wow.zamimg.com/images/wow/icons/medium/${it.icon}.jpg`
            : 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
        const slotsStr = Array.from(it.slots).join(' / ');

        const card = document.createElement('div');
        card.className = 'bg-gray-800/80 border border-blue-500/30 hover:border-blue-500/60 transition-all rounded-xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group';

        card.innerHTML = `
            <div>
                <div class="flex items-start justify-between gap-3 mb-2.5">
                    <div class="flex items-center space-x-3 overflow-hidden">
                        <div class="relative shrink-0">
                            <img src="${iconUrl}" class="w-10 h-10 rounded-lg border-2 border-blue-400/60 shadow-md group-hover:scale-105 transition-transform" alt="${it.name}">
                            <span class="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                            </span>
                        </div>
                        <div class="truncate">
                            <a href="https://www.wowhead.com/item=${it.item_id}"
                               data-wowhead="item=${it.item_id}&ilvl=${it.ilvl}&bonus=${bonusStr}"
                               class="text-sm font-bold text-blue-300 hover:text-blue-200 hover:underline truncate block"
                               target="_blank">
                                ${it.name}
                            </a>
                            <div class="flex items-center gap-1.5 mt-0.5">
                                <span class="text-[11px] font-semibold text-blue-400/90 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">${slotsStr}</span>
                                <span class="text-[11px] text-gray-400 font-mono">ilvl ${it.ilvl}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-3 pt-2.5 border-t border-gray-700/60 flex items-center justify-between text-xs">
                <span class="text-gray-400">Adopción Top ${count}:</span>
                <div class="flex items-center gap-2">
                    <span class="font-extrabold text-white text-sm">${pct}%</span>
                    <span class="text-xs text-blue-400 font-medium">(${it.playerCount}/${count})</span>
                </div>
            </div>
            <div class="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden mt-1.5 border border-gray-700/40">
                <div class="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style="width: ${pct}%"></div>
            </div>
        `;
        container.appendChild(card);
    });
}

// 2c. Render Common Gems & Enchants
function renderGemsAndEnchants(players) {
    const count = players.length;

    // --- A. Aggregate Gems ---
    const gemMap = new Map();
    let totalGemsCount = 0;

    players.forEach(p => {
        Object.values(p.itemDetails || {}).forEach(it => {
            const gems = it.gems || [];
            gems.forEach(g => {
                if (!g || !g.name) return;
                const cleanName = (typeof cleanWoWString === 'function') ? cleanWoWString(g.name) : g.name;
                if (!cleanName) return;
                totalGemsCount++;
                const key = cleanName;
                if (!gemMap.has(key)) {
                    gemMap.set(key, {
                        name: cleanName,
                        icon: g.icon,
                        id: g.id,
                        count: 0,
                        players: new Set()
                    });
                }
                const entry = gemMap.get(key);
                entry.count++;
                entry.players.add(p.name);
            });
        });
    });

    const gemsContainer = document.getElementById('popular-gems-container');
    if (gemsContainer) {
        gemsContainer.innerHTML = '';
        const sortedGems = Array.from(gemMap.values()).sort((a, b) => b.count - a.count);
        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');

        if (sortedGems.length === 0) {
            gemsContainer.innerHTML = `<p class="text-xs text-gray-500 py-3 text-center">${isEn ? 'No socketed gems found.' : 'No se encontraron ranuras con gemas engarzadas.'}</p>`;
        } else {
            sortedGems.slice(0, 6).forEach(g => {
                const pctShare = totalGemsCount > 0 ? Math.round((g.count / totalGemsCount) * 100) : 0;
                const playerPct = Math.round((g.players.size / count) * 100);
                const iconUrl = g.icon ? `https://wow.zamimg.com/images/wow/icons/medium/${g.icon}.jpg` : 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
                const usageText = isEn
                    ? `Used by ${g.players.size} of ${count} players (${playerPct}%)`
                    : `Usada por ${g.players.size} de ${count} jugadores (${playerPct}%)`;
                const socketBadge = isEn ? `${g.count} sockets` : `${g.count} engarces`;
                const shareText = isEn ? `${pctShare}% of total` : `${pctShare}% del total`;

                const gemEl = document.createElement('div');
                gemEl.className = 'flex items-center justify-between p-2.5 bg-gray-900/60 border border-gray-700/50 rounded-xl hover:border-emerald-500/40 transition-colors';
                gemEl.innerHTML = `
                    <div class="flex items-center space-x-3 overflow-hidden">
                        <img src="${iconUrl}" class="w-8 h-8 rounded-lg border border-emerald-500/40 shrink-0" alt="${g.name}">
                        <div class="truncate">
                            <span class="text-xs font-bold text-emerald-300 block truncate">${g.name}</span>
                            <span class="text-[11px] text-gray-400">${usageText}</span>
                        </div>
                    </div>
                    <div class="text-right shrink-0 ml-3">
                        <span class="text-xs font-extrabold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">${socketBadge}</span>
                        <div class="text-[10px] text-gray-400 mt-0.5">${shareText}</div>
                    </div>
                `;
                gemsContainer.appendChild(gemEl);
            });
        }
    }

    // --- B. Aggregate Enchants by Slot Category ---
    const ENCHANT_CATEGORIES = [
        { label: 'chest', slots: ['chest'] },
        { label: 'legs', slots: ['legs'] },
        { label: 'head', slots: ['head'] },
        { label: 'feet', slots: ['feet'] },
        { label: 'shoulder', slots: ['shoulder'] },
        { label: 'finger', slots: ['finger1', 'finger2'] },
        { label: 'mainhand', slots: ['mainhand', 'offhand'] },
        { label: 'wrist', slots: ['wrist'] },
        { label: 'back', slots: ['back'] }
    ];

    const enchantsContainer = document.getElementById('popular-enchants-container');
    if (enchantsContainer) {
        enchantsContainer.innerHTML = '';
        let totalEnchantedSlots = 0;
        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');

        ENCHANT_CATEGORIES.forEach(cat => {
            const enchMap = new Map();

            players.forEach(p => {
                cat.slots.forEach(slot => {
                    const it = p.itemDetails ? p.itemDetails[slot] : null;
                    if (!it) return;
                    const enchants = it.enchants || [];
                    enchants.forEach(e => {
                        if (!e || !e.name) return;
                        const cleanName = (typeof cleanWoWString === 'function') ? cleanWoWString(e.name) : e.name;
                        if (!cleanName) return;
                        const key = cleanName;
                        if (!enchMap.has(key)) {
                            enchMap.set(key, {
                                name: cleanName,
                                icon: e.icon,
                                id: e.id,
                                count: 0,
                                players: new Set()
                            });
                        }
                        const entry = enchMap.get(key);
                        entry.count++;
                        entry.players.add(p.name);
                    });
                });
            });

            if (enchMap.size === 0) return;
            totalEnchantedSlots++;

            const sortedEnchs = Array.from(enchMap.values()).sort((a, b) => b.players.size - a.players.size || b.count - a.count);
            const topEnch = sortedEnchs[0];
            const playerPct = Math.round((topEnch.players.size / count) * 100);
            const iconUrl = topEnch.icon ? `https://wow.zamimg.com/images/wow/icons/medium/${topEnch.icon}.jpg` : 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
            const catLabel = (typeof getSlotName === 'function') ? getSlotName(cat.label) : cat.label;
            const playerSuffix = isEn ? 'players' : 'jug.';

            const row = document.createElement('div');
            row.className = 'flex items-center justify-between p-2.5 bg-gray-900/60 border border-gray-700/50 rounded-xl hover:border-purple-500/40 transition-colors';

            let runnerUpText = '';
            if (sortedEnchs.length > 1 && sortedEnchs[1].players.size >= 2) {
                const runnerUp = sortedEnchs[1];
                runnerUpText = `<span class="text-[10px] text-gray-500 block truncate">Alt: ${runnerUp.name} (${runnerUp.players.size}/${count})</span>`;
            }

            row.innerHTML = `
                <div class="flex items-center space-x-3 overflow-hidden">
                    <img src="${iconUrl}" class="w-8 h-8 rounded-lg border border-purple-500/40 shrink-0" alt="${topEnch.name}">
                    <div class="truncate">
                        <div class="flex items-center gap-1.5">
                            <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">${catLabel}</span>
                            <span class="text-xs font-bold text-gray-200 truncate">${topEnch.name}</span>
                        </div>
                        ${runnerUpText}
                    </div>
                </div>
                <div class="text-right shrink-0 ml-3">
                    <span class="text-xs font-extrabold text-purple-300 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-full">${playerPct}%</span>
                    <div class="text-[10px] text-gray-400 mt-0.5">${topEnch.players.size}/${count} ${playerSuffix}</div>
                </div>
            `;
            enchantsContainer.appendChild(row);
        });

        if (totalEnchantedSlots === 0) {
            enchantsContainer.innerHTML = `<p class="text-xs text-gray-500 py-3 text-center">${isEn ? 'No active enchantments detected on analyzed gear.' : 'No se detectaron encantamientos activos en las piezas analizadas.'}</p>`;
        }
    }
}

// 2d. Season Raid Bosses & Loot Priority
function renderRaidBossLoot(players, seasonSlug, classSlug) {
    const container = document.getElementById('raid-bosses-container');
    if (!container) return;
    container.innerHTML = '';

    const count = players.length;
    if (count === 0) return;

    // 1. Gather all unique items equipped by players
    const equippedItemsMap = new Map();

    players.forEach(p => {
        const playerSeenIds = new Set();
        Object.entries(p.itemDetails || {}).forEach(([slot, it]) => {
            if (!it || !it.item_id || !it.name) return;
            if (slot === 'shirt' || slot === 'tabard') return;

            const key = it.item_id;
            if (!equippedItemsMap.has(key)) {
                equippedItemsMap.set(key, {
                    item_id: it.item_id,
                    name: it.name,
                    slot: slot,
                    icon: it.icon,
                    ilvl: it.ilvl,
                    bonuses: it.bonuses || [],
                    isCrafted: (it.bonuses || []).some(b => CRAFTED_BONUS_SET.has(b)),
                    playerCount: 0
                });
            }
            if (!playerSeenIds.has(key)) {
                playerSeenIds.add(key);
                equippedItemsMap.get(key).playerCount++;
            }
        });
    });

    // 2. Select raids for the current season
    const raids = SEASON_RAID_DATA[seasonSlug] || SEASON_RAID_DATA['season-mn-2'];

    // Update section badge
    const badgeEl = document.getElementById('raid-bosses-badge');
    if (badgeEl) {
        badgeEl.textContent = seasonSlug.toUpperCase();
    }

    raids.forEach(raid => {
        const raidWrapper = document.createElement('div');
        raidWrapper.className = 'bg-gray-900/60 border border-gray-800 rounded-2xl p-5 space-y-4';

        // Raid header
        const raidHeader = document.createElement('div');
        raidHeader.className = 'flex items-center justify-between border-b border-gray-800/80 pb-3';
        raidHeader.innerHTML = `
            <div>
                <h4 class="text-base font-black text-white flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    ${raid.raidName}
                </h4>
                <p class="text-xs text-gray-400 mt-0.5">${raid.raidDesc}</p>
            </div>
            <span class="text-xs font-mono text-gray-400 bg-gray-800/80 px-2.5 py-1 rounded-lg border border-gray-700/60">${raid.bosses.length} Jefes</span>
        `;
        raidWrapper.appendChild(raidHeader);

        // Bosses Grid
        const bossesGrid = document.createElement('div');
        bossesGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';

        raid.bosses.forEach(boss => {
            // Find items that match this boss
            const matchedItems = [];
            const seenItemIds = new Set();

            equippedItemsMap.forEach(it => {
                let isMatch = false;
                let tierTag = '';

                // A. Direct or pattern match
                if (boss.patterns && boss.patterns.some(pat => it.name.toLowerCase().includes(pat.toLowerCase()))) {
                    isMatch = true;
                }

                // B. Tier token match (non-crafted items worn in the boss's tier slot)
                if (!isMatch && boss.tierSlot && boss.tierSlot === it.slot && !it.isCrafted) {
                    isMatch = true;
                    tierTag = boss.tierToken || 'Token Tier';
                }

                if (isMatch && !seenItemIds.has(it.item_id)) {
                    seenItemIds.add(it.item_id);
                    matchedItems.push({
                        ...it,
                        tierTag: tierTag
                    });
                }
            });

            // Sort matched items by playerCount descending
            matchedItems.sort((a, b) => b.playerCount - a.playerCount || b.ilvl - a.ilvl);

            const bossCard = document.createElement('div');
            const hasItems = matchedItems.length > 0;
            bossCard.className = `bg-gray-800/50 border ${hasItems ? 'border-gray-700/80 hover:border-red-500/40' : 'border-gray-800/60 opacity-80'} rounded-xl p-4 flex flex-col justify-between transition-colors space-y-3`;

            let itemsListHtml = '';
            if (hasItems) {
                matchedItems.forEach(it => {
                    const pct = Math.round((it.playerCount / count) * 100);
                    const bonusStr = (it.bonuses || []).join(':');
                    const iconUrl = it.icon
                        ? `https://wow.zamimg.com/images/wow/icons/medium/${it.icon}.jpg`
                        : 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
                    const slotName = (typeof getSlotName === 'function') ? getSlotName(it.slot) : (SLOT_NAMES_ES[it.slot] || it.slot);

                    let priorityBadge = '';
                    let itemBoxClass = '';

                    if (pct >= 50) {
                        const flameIcon = (typeof getIcon === 'function') ? getIcon('flame', 'w-3 h-3 text-red-300') : '';
                        priorityBadge = `<span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">${flameIcon}<span>BiS (${pct}%)</span></span>`;
                        itemBoxClass = 'bg-red-950/20 border-red-500/30';
                    } else if (pct >= 30) {
                        const starIcon = (typeof getIcon === 'function') ? getIcon('star', 'w-3 h-3 text-amber-300') : '';
                        priorityBadge = `<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">${starIcon}<span>Alta (${pct}%)</span></span>`;
                        itemBoxClass = 'bg-amber-950/20 border-amber-500/30';
                    } else {
                        priorityBadge = `<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">${pct}%</span>`;
                        itemBoxClass = 'bg-gray-900/60 border-gray-700/50';
                    }

                    const tierBadgeHtml = it.tierTag
                        ? `<span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">${it.tierTag}</span>`
                        : '';

                    itemsListHtml += `
                        <div class="flex items-center justify-between p-2 rounded-lg border ${itemBoxClass} hover:brightness-110 transition">
                            <div class="flex items-center space-x-2.5 overflow-hidden">
                                <img src="${iconUrl}" class="w-8 h-8 rounded-lg border border-yellow-600/40 shrink-0" alt="${it.name}">
                                <div class="truncate">
                                    <a href="https://www.wowhead.com/item=${it.item_id}"
                                       data-wowhead="item=${it.item_id}&ilvl=${it.ilvl}&bonus=${bonusStr}"
                                       class="text-xs font-bold text-yellow-400 hover:underline truncate block"
                                       target="_blank">
                                        ${it.name}
                                    </a>
                                    <div class="flex items-center gap-1.5 mt-0.5">
                                        <span class="text-[10px] text-gray-400 font-medium">${slotName}</span>
                                        <span class="text-[10px] text-gray-500 font-mono">ilvl ${it.ilvl}</span>
                                        ${tierBadgeHtml}
                                    </div>
                                </div>
                            </div>
                            <div class="text-right shrink-0 ml-3">
                                ${priorityBadge}
                                <div class="text-[10px] text-gray-400 mt-0.5">${it.playerCount}/${count} jug.</div>
                            </div>
                        </div>
                    `;
                });
            } else {
                itemsListHtml = `
                    <div class="py-3 px-3 rounded-lg bg-gray-900/40 border border-gray-800 text-center text-xs text-gray-500 italic">
                        Sin piezas prioritarias para esta clase en el Top 50
                    </div>
                `;
            }

            bossCard.innerHTML = `
                <div>
                    <div class="flex items-center justify-between border-b border-gray-700/50 pb-2.5">
                        <div class="overflow-hidden">
                            <div class="flex items-center gap-2">
                                <span class="w-2.5 h-2.5 rounded-full ${hasItems ? 'bg-red-400' : 'bg-gray-500'} shrink-0"></span>
                                <h5 class="text-sm font-black text-white truncate">${boss.name}</h5>
                            </div>
                            <span class="text-[11px] text-gray-400 mt-0.5 block truncate">${boss.title || 'Jefe de Banda'}</span>
                        </div>
                        <span class="text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${hasItems ? 'bg-red-500/10 text-red-300 border border-red-500/20' : 'bg-gray-800 text-gray-500'}">
                            ${matchedItems.length} ${matchedItems.length === 1 ? 'prioridad' : 'prioridades'}
                        </span>
                    </div>
                    <div class="space-y-1.5 mt-2.5">
                        ${itemsListHtml}
                    </div>
                </div>
            `;
            bossesGrid.appendChild(bossCard);
        });

        raidWrapper.appendChild(bossesGrid);
        container.appendChild(raidWrapper);
    });
}

// 3. Player Comparison Table
function renderPlayerTable(players, exclude344 = false) {
    const tbody = document.getElementById('players-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    players.forEach((p, idx) => {
        const classColor = WOW_CLASSES[p.classSlug]?.color || '#ffffff';
        const avatarUrl = p.thumbnail || 'https://cdn.raiderio.net/images/site/character-avatar-default.png';
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-800 hover:bg-gray-800/40 transition-colors';

        const { stats, excludedItems } = getPlayerSecondaryStats(p, exclude344);
        const critVal = stats['Critical Strike'] || 0;
        const hasteVal = stats['Haste'] || 0;
        const mastVal = stats['Mastery'] || 0;
        const versVal = stats['Versatility'] || 0;

        row.innerHTML = `
            <td class="py-3 px-4 text-center font-bold text-gray-400">#${p.rank}</td>
            <td class="py-3 px-4">
                <div class="flex items-center space-x-3">
                    <img src="${avatarUrl}" class="w-8 h-8 rounded-full border border-gray-600" alt="${p.name}">
                    <div>
                        <a href="${p.profileUrl}" target="_blank" class="font-bold hover:underline" style="color: ${classColor}">
                            ${p.name}
                        </a>
                        <div class="flex items-center gap-1.5 mt-0.5">
                            <span class="text-xs text-gray-400">${p.realm} (${p.region})</span>
                            ${p.runInfo ? `<span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Equipamiento verificado en Mítica+">+${p.runInfo.level} ${p.runInfo.dungeon}</span>` : ''}
                        </div>
                    </div>
                </div>
            </td>
            <td class="py-3 px-4">
                <span class="font-bold text-orange-400">${p.score != null ? Number(p.score).toFixed(1) : '—'}</span>
            </td>
            <td class="py-3 px-4 text-gray-300 font-medium">${p.ilvl != null ? Number(p.ilvl).toFixed(1) : '—'}</td>
            <td class="py-3 px-4 font-bold" style="color: ${STAT_COLORS['Critical Strike'].color}">${critVal.toLocaleString()}</td>
            <td class="py-3 px-4 font-bold" style="color: ${STAT_COLORS['Haste'].color}">${hasteVal.toLocaleString()}</td>
            <td class="py-3 px-4 font-bold" style="color: ${STAT_COLORS['Mastery'].color}">${mastVal.toLocaleString()}</td>
            <td class="py-3 px-4 font-bold" style="color: ${STAT_COLORS['Versatility'].color}">${versVal.toLocaleString()}</td>
            <td class="py-3 px-4 text-center">
                <button onclick="togglePlayerGear('gear-row-${idx}')" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-xs font-semibold text-white rounded-lg transition-colors">
                    ${typeof t === 'function' ? t('viewGear') : 'Ver Equipo'}
                </button>
            </td>
        `;
        tbody.appendChild(row);

        // Expandable Gear Row
        const gearRow = document.createElement('tr');
        gearRow.id = `gear-row-${idx}`;
        gearRow.className = 'hidden bg-gray-900/90 border-b border-gray-700/60';

        let gearGridHtml = '';
        const slotsOrder = ['head', 'neck', 'shoulder', 'back', 'chest', 'wrist', 'hands', 'waist', 'legs', 'feet', 'finger1', 'finger2', 'trinket1', 'trinket2', 'mainhand', 'offhand'];
        const isEn = (typeof getLanguage === 'function' && getLanguage() === 'en');

        slotsOrder.forEach(slot => {
            const it = p.itemDetails[slot];
            if (!it || !it.item_id) return;
            const iconUrl = it.icon ? `https://wow.zamimg.com/images/wow/icons/small/${it.icon}.jpg` : '';
            const bonusStr = (it.bonuses || []).join(':');
            const cleanItName = (typeof cleanWoWString === 'function') ? cleanWoWString(it.name) : it.name;

            // Format secondary stats
            const statChips = Object.entries(it.stats).map(([sName, sVal]) => {
                const conf = STAT_COLORS[sName];
                const displayName = (typeof getStatName === 'function') ? getStatName(sName, true) : (conf?.name || sName);
                return `<span class="text-[10px] px-1 py-0.5 rounded font-bold" style="background-color: ${conf.bg}; color: ${conf.color}">+${sVal} ${displayName}</span>`;
            }).join(' ');

            const isExcluded = exclude344 && it.ilvl === 344;
            const itemBoxStyle = isExcluded
                ? 'p-1.5 bg-amber-950/20 rounded border border-amber-500/50 opacity-70'
                : 'p-1.5 bg-gray-800/60 rounded border border-gray-700/40';
            const excludedBadge = isExcluded
                ? `<span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">${isEn ? 'Omitted' : 'Omitido'}</span>`
                : '';

            gearGridHtml += `
                <div class="flex items-center space-x-2 ${itemBoxStyle}">
                    <img src="${iconUrl}" class="w-6 h-6 rounded shrink-0 border border-yellow-600/30">
                    <div class="truncate text-xs flex-1">
                        <div class="flex items-center justify-between">
                            <a href="https://www.wowhead.com/item=${it.item_id}" data-wowhead="item=${it.item_id}&ilvl=${it.ilvl}&bonus=${bonusStr}" class="text-yellow-400 hover:underline truncate block font-medium">
                                ${cleanItName}
                            </a>
                            ${excludedBadge}
                        </div>
                        <div class="flex items-center space-x-1 mt-0.5">
                            <span class="text-[10px] text-gray-400 font-mono">${it.ilvl}</span>
                            ${statChips}
                        </div>
                    </div>
                </div>
            `;
        });

        const gearHeading = isEn
            ? `Gear for ${p.name} ${p.runInfo ? `<span class="text-amber-400 font-normal">(Verified snapshot in +${p.runInfo.level} ${(typeof getLocalizedDungeonName === 'function') ? getLocalizedDungeonName(p.runInfo.dungeon) : p.runInfo.dungeon})</span>` : ''}`
            : `Equipamiento de ${p.name} ${p.runInfo ? `<span class="text-amber-400 font-normal">(Snapshot verificado en +${p.runInfo.level} ${(typeof getLocalizedDungeonName === 'function') ? getLocalizedDungeonName(p.runInfo.dungeon) : p.runInfo.dungeon})</span>` : ''}`;
        const excludedNotice = isEn
            ? `${excludedItems} ilvl 344 items excluded from calculation`
            : `${excludedItems} ítems ilvl 344 excluidos del cálculo`;

        gearRow.innerHTML = `
            <td colspan="9" class="p-4">
                <div class="flex items-center justify-between mb-2">
                    <div class="text-xs font-bold uppercase tracking-wider text-gray-400">${gearHeading}</div>
                    ${exclude344 && excludedItems > 0 ? `<span class="text-[11px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">${excludedNotice}</span>` : ''}
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                    ${gearGridHtml}
                </div>
            </td>
        `;
        tbody.appendChild(gearRow);
    });
}

function togglePlayerGear(rowId) {
    const r = document.getElementById(rowId);
    if (r) {
        r.classList.toggle('hidden');
        if (window.$WowheadPower && typeof window.$WowheadPower.refreshLinks === 'function') {
            window.$WowheadPower.refreshLinks();
        }
    }
}
window.togglePlayerGear = togglePlayerGear;

if (typeof window !== 'undefined') {
    window.currentTop10GearTab = currentTop10GearTab;
    window.switchTop10GearTab = switchTop10GearTab;
    window.renderResults = renderResults;
    window.renderConsensus = renderConsensus;
    window.renderPopularItems = renderPopularItems;
    window.renderCraftedItems = renderCraftedItems;
    window.renderGemsAndEnchants = renderGemsAndEnchants;
    window.renderRaidBossLoot = renderRaidBossLoot;
    window.renderPlayerTable = renderPlayerTable;
    window.togglePlayerGear = togglePlayerGear;
}
