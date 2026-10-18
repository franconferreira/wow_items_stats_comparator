/**
 * paperdoll.js
 * WoW Character Screen Replica (Paperdoll layout), dual stat distribution bars,
 * 4 secondary stat diagnostic cards, and tab switcher (Actual, Óptimo, Recomendado, Alternativo).
 */

window.toggleSimCSlotLock = function(slotKey) {
    if (!activeSimCProfile || !activeSimCProfile.lockedSlots) return;
    if (activeSimCProfile.lockedSlots.has(slotKey)) {
        activeSimCProfile.lockedSlots.delete(slotKey);
    } else {
        activeSimCProfile.lockedSlots.add(slotKey);
    }
    renderSimCComparisonResults();
};

window.switchPaperdollTab = function(tabKey) {
    if (!activeSimCProfile) return;
    activeSimCProfile.activePaperdollTab = tabKey;
    renderSimCComparisonResults();
};

function renderSimCComparisonResults(parsedProfile, userStats, userItemsDetails, top10Players) {
    if (parsedProfile && userStats && userItemsDetails && top10Players) {
        if (!activeSimCProfile || activeSimCProfile.parsedProfile !== parsedProfile) {
            activeSimCProfile = {
                parsedProfile,
                userStats,
                userItemsDetails,
                top10Players,
                lockedSlots: new Set(),
                activePaperdollTab: 'current'
            };
            // Initial auto-lock: pieces with ilvl >= 330 are current season
            for (const [slot, it] of Object.entries(userItemsDetails)) {
                if ((it.ilvl || 0) >= 330) {
                    activeSimCProfile.lockedSlots.add(slot);
                }
            }
        }
    }

    if (!activeSimCProfile) return;

    const outputBox = document.getElementById('simc-comparison-box');
    if (!outputBox) return;

    const {
        parsedProfile: profile,
        userStats: uStats,
        userItemsDetails: uItems,
        top10Players: t10Players,
        lockedSlots
    } = activeSimCProfile;

    const count = t10Players.length;
    const exclude344 = document.getElementById('exclude-344-check')?.checked || false;

    // 1. User stats totals and percentages
    const userTotalSec = Object.values(uStats).reduce((a, b) => a + b, 0);
    const userPcts = {};
    for (const [st, val] of Object.entries(uStats)) {
        userPcts[st] = userTotalSec > 0 ? (val / userTotalSec) * 100 : 0;
    }

    // 2. Top 50 averages
    const top10Totals = { 'Critical Strike': 0, 'Haste': 0, 'Mastery': 0, 'Versatility': 0 };
    let top10SumAll = 0;

    t10Players.forEach(p => {
        const { stats } = getPlayerSecondaryStats(p, exclude344);
        for (const [st, val] of Object.entries(stats)) {
            top10Totals[st] += val;
            top10SumAll += val;
        }
    });

    const avgStats = {};
    const avgPcts = {};
    for (const [st, val] of Object.entries(top10Totals)) {
        avgStats[st] = Math.round(val / count);
        avgPcts[st] = top10SumAll > 0 ? (val / top10SumAll) * 100 : 0;
    }

    // 3. Stat Diagnostics & Advice (Crit, Haste, Mastery, Vers)
    const diagnostics = [];
    const statsOrder = ['Critical Strike', 'Haste', 'Mastery', 'Versatility'];

    statsOrder.forEach(st => {
        const userVal = uStats[st] || 0;
        const userPct = userPcts[st] || 0;
        const aVal = avgStats[st] || 0;
        const aPct = avgPcts[st] || 0;
        const diffPct = userPct - aPct;
        const diffPts = userVal - aVal;
        const conf = STAT_COLORS[st];

        let action = 'OPTIMAL';
        let badgeHtml = '';
        let cardBorder = '';

        if (diffPct < 0) {
            // Stat is below average -> Arrow Down
            const arrowSvg = (typeof getIcon === 'function') ? getIcon('arrowDown', 'w-3.5 h-3.5 text-current') : '↓';
            const diffStr = `${Math.abs(diffPct).toFixed(1)}%`;
            if (diffPct < -3.5) {
                action = 'INCREASE';
                badgeHtml = `<span class="px-2.5 py-1 rounded-full text-xs font-black bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 shadow-sm">${arrowSvg}<span>${diffStr}</span></span>`;
                cardBorder = 'border-rose-500/40 bg-rose-950/10';
            } else {
                action = 'OPTIMAL';
                badgeHtml = `<span class="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">${arrowSvg}<span>${diffStr}</span></span>`;
                cardBorder = 'border-emerald-500/40 bg-emerald-950/10';
            }
        } else if (diffPct > 0) {
            // Stat is above average -> Arrow Up
            const arrowSvg = (typeof getIcon === 'function') ? getIcon('arrowUp', 'w-3.5 h-3.5 text-current') : '↑';
            const diffStr = `${Math.abs(diffPct).toFixed(1)}%`;
            if (diffPct > 3.5) {
                action = 'DECREASE';
                badgeHtml = `<span class="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">${arrowSvg}<span>${diffStr}</span></span>`;
                cardBorder = 'border-amber-500/40 bg-amber-950/10';
            } else {
                action = 'OPTIMAL';
                badgeHtml = `<span class="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">${arrowSvg}<span>${diffStr}</span></span>`;
                cardBorder = 'border-emerald-500/40 bg-emerald-950/10';
            }
        } else {
            // Equal
            const arrowSvg = (typeof getIcon === 'function') ? getIcon('arrowEqual', 'w-3.5 h-3.5 text-emerald-400') : '=';
            action = 'OPTIMAL';
            badgeHtml = `<span class="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">${arrowSvg}<span>0.0%</span></span>`;
            cardBorder = 'border-emerald-500/40 bg-emerald-950/10';
        }

        const statDisplayName = (typeof t === 'function' && t(st)) ? t(st) : conf.name;

        diagnostics.push({
            stat: st,
            name: statDisplayName,
            color: conf.color,
            bg: conf.bg,
            userVal,
            userPct,
            aVal,
            aPct,
            diffPct,
            diffPts,
            action,
            badgeHtml,
            cardBorder
        });
    });

    // Build Dual Distribution Bars
    let userBarHtml = '';
    let top10BarHtml = '';

    statsOrder.forEach(st => {
        const uPct = userPcts[st].toFixed(1);
        const aPct = avgPcts[st].toFixed(1);
        const color = STAT_COLORS[st].color;
        const name = (typeof getStatName === 'function') ? getStatName(st, true) : STAT_COLORS[st].name;

        if (parseFloat(uPct) > 0) {
            userBarHtml += `
                <div style="width: ${uPct}%; background-color: ${color};" class="h-full flex items-center justify-center text-[11px] font-bold text-black" title="${typeof t === 'function' ? t('yourCharacter') : 'Tu'} ${name}: ${uPct}% (${uStats[st]})">
                    ${parseFloat(uPct) > 12 ? `${name} ${uPct}%` : ''}
                </div>
            `;
        }
        if (parseFloat(aPct) > 0) {
            top10BarHtml += `
                <div style="width: ${aPct}%; background-color: ${color};" class="h-full flex items-center justify-center text-[11px] font-bold text-black" title="${typeof t === 'function' ? t('top50Avg') : 'Top 50'} ${name}: ${aPct}% (${avgStats[st]})">
                    ${parseFloat(aPct) > 12 ? `${name} ${aPct}%` : ''}
                </div>
            `;
        }
    });

    // Build 4 Stat Cards
    let statCardsHtml = '';
    diagnostics.forEach(d => {
        statCardsHtml += `
            <div class="border ${d.cardBorder} rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-md">
                <div class="flex items-center justify-between border-b border-gray-700/60 pb-2">
                    <span class="text-sm font-bold text-white flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${d.color};"></span>
                        ${d.name}
                    </span>
                    ${d.badgeHtml}
                </div>

                <div class="grid grid-cols-2 gap-2 text-center py-1">
                    <div class="bg-gray-900/80 rounded-lg p-2 border border-gray-700/40">
                        <div class="text-[10px] text-gray-400 uppercase font-semibold">${typeof t === 'function' ? t('yourCharacter') : 'Tu Personaje'}</div>
                        <div class="text-lg font-black text-white mt-0.5">${d.userVal.toLocaleString()}</div>
                        <div class="text-xs font-bold" style="color: ${d.color};">${d.userPct.toFixed(1)}%</div>
                    </div>
                    <div class="bg-gray-900/80 rounded-lg p-2 border border-gray-700/40">
                        <div class="text-[10px] text-gray-400 uppercase font-semibold">${typeof t === 'function' ? t('top50Avg') : 'Promedio Top 50'}</div>
                        <div class="text-lg font-black text-gray-300 mt-0.5">${d.aVal.toLocaleString()}</div>
                        <div class="text-xs font-bold text-gray-400">${d.aPct.toFixed(1)}%</div>
                    </div>
                </div>
            </div>
        `;
    });

    // 4. Run Set Solver (Cached: only recomputed if lockedSlots, items or class change)
    const userClassSlug = profile.class || document.getElementById('class-select')?.value || 'death-knight';
    const currentSeasonSlug = document.getElementById('season-select')?.value || 'season-mn-2';
    const armorType = CLASS_ARMOR_MAP[userClassSlug] || 'plate';
    const solverCacheKey = Array.from(lockedSlots).sort().join(',') + '_' + userClassSlug + '_' + Object.keys(uItems).length + '_' + currentSeasonSlug + '_' + (t10Players ? t10Players.length : 0);

    if (!activeSimCProfile.cachedSolverResult || activeSimCProfile.cachedSolverKey !== solverCacheKey) {
        activeSimCProfile.cachedSolverResult = findOptimalDungeonPackages(uItems, lockedSlots, avgPcts, armorType, t10Players, currentSeasonSlug);
        activeSimCProfile.cachedSolverKey = solverCacheKey;
    }
    const solverResult = activeSimCProfile.cachedSolverResult;
    const consensusEnchants = solverResult?.consensusEnchants || {};
    const topGem = solverResult?.topGem || null;

    // Active Paperdoll Tab state
    let activeTab = activeSimCProfile.activePaperdollTab || 'current';
    if (activeTab === 'optimal' && !solverResult.pkgOptimal) activeTab = 'current';
    if (activeTab === 'pkg1' && !solverResult.pkg1) activeTab = 'current';
    if (activeTab === 'pkg2' && !solverResult.pkg2) activeTab = 'current';
    activeSimCProfile.activePaperdollTab = activeTab;

    const selectedPkg = activeTab === 'optimal' ? solverResult.pkgOptimal : (activeTab === 'pkg2' ? solverResult.pkg2 : (activeTab === 'pkg1' ? solverResult.pkg1 : null));
    const pkgItemsBySlot = {};
    if (selectedPkg && selectedPkg.items) {
        selectedPkg.items.forEach(it => {
            if (it.slotKey) {
                pkgItemsBySlot[it.slotKey] = it;
            }
        });
    }

    // 5. Equipment Inspection & Slot Season Classification (WoW Paperdoll Layout)
    const classData = WOW_CLASSES[userClassSlug];
    const className = (typeof getLocalizedClassName === 'function') ? getLocalizedClassName(userClassSlug) : (classData ? classData.name : 'Clase');
    const classHex = classData ? classData.color : '#00bcd4';
    const classIconUrl = classData && classData.icon ? `https://wow.zamimg.com/images/wow/icons/large/${classData.icon}.jpg` : null;
    const specName = (typeof getLocalizedSpecName === 'function') ? getLocalizedSpecName(userClassSlug, profile.spec) : (profile.spec ? profile.spec.charAt(0).toUpperCase() + profile.spec.slice(1) : '');

    const currentLang = (typeof getLanguage === 'function') ? getLanguage() : 'es';
    const classSpecTitle = currentLang === 'es'
        ? `${className} ${specName}`.trim()
        : `${specName ? specName + ' ' : ''}${className}`.trim();

    const combatSlots = ['head', 'neck', 'shoulder', 'back', 'chest', 'wrist', 'hands', 'waist', 'legs', 'feet', 'finger1', 'finger2', 'trinket1', 'trinket2', 'mainhand', 'offhand'];
    let lockedCount = 0;
    let openCount = 0;
    let totalIlvl = 0;
    let ilvlCount = 0;

    combatSlots.forEach(slotKey => {
        const it = uItems[slotKey];
        if (!it) return;

        const isLocked = lockedSlots.has(slotKey);
        if (isLocked) lockedCount++; else openCount++;

        if (it.ilvl) {
            totalIlvl += it.ilvl;
            ilvlCount++;
        }
    });

    const avgIlvl = ilvlCount > 0 ? (totalIlvl / ilvlCount).toFixed(1) : '—';
    const displayIlvl = activeTab === 'optimal' ? '334.0' : (selectedPkg ? '330.0' : avgIlvl);

    function renderPaperdollSlotCard(slotKey) {
        const it = uItems[slotKey];
        if (!it && !pkgItemsBySlot[slotKey]) return '';

        const slotLabel = (typeof getSlotName === 'function') ? getSlotName(slotKey) : (SLOT_NAMES_ES[slotKey] || slotKey);

        const canonical = (typeof getCanonicalSlot === 'function') ? getCanonicalSlot(slotKey) : slotKey;
        const rawEnch = consensusEnchants ? consensusEnchants[canonical] : null;
        const enchName = rawEnch ? ((typeof cleanWoWString === 'function') ? cleanWoWString(rawEnch.name) : rawEnch.name) : '';
        const slotEnch = rawEnch ? { ...rawEnch, name: enchName } : null;

        const isSocketSlot = canonical === 'finger' || canonical === 'neck';
        const rawGem = (isSocketSlot && topGem) ? topGem : null;
        const gemName = rawGem ? ((typeof cleanWoWString === 'function') ? cleanWoWString(rawGem.name) : rawGem.name) : '';
        const slotGem = rawGem ? { ...rawGem, name: gemName } : null;

        const gemEnchantBadgesHtml = (slotEnch || slotGem) ? `
            <div class="flex items-center gap-1.5 flex-wrap min-h-[18px]">
                ${slotEnch ? `
                    <span class="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-medium truncate" title="Encanto: ${slotEnch.name}">
                        <span class="text-[9px]">📜</span>
                        <span class="truncate max-w-[130px]">${slotEnch.name}</span>
                    </span>
                ` : ''}
                ${slotGem ? `
                    <span class="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-purple-950/70 border border-purple-500/30 text-purple-300 font-medium truncate" title="Gema: ${slotGem.name}">
                        <span class="text-[9px]">💎</span>
                        <span class="truncate max-w-[130px]">${slotGem.name}</span>
                    </span>
                ` : ''}
            </div>
        ` : '';

        // If viewing a package tab and this slot is a recommended dungeon drop / crafted / raid
        if (selectedPkg && pkgItemsBySlot[slotKey]) {
            const dropItem = pkgItemsBySlot[slotKey];
            const dropIlvl = dropItem.ilvl || (activeTab === 'optimal' ? 334 : 330);
            const dropStatSummary = Object.entries(dropItem.stats || {}).map(([s, val]) => `+${val} ${(typeof getStatName === 'function') ? getStatName(s, true) : (STAT_COLORS[s]?.name || s)}`).join(', ') || (typeof t === 'function' ? t('noSecondaryStats') : 'Sin stats secundarios');
            const dropIconUrl = dropItem.icon ? `https://wow.zamimg.com/images/wow/icons/medium/${dropItem.icon}.jpg` : 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
            const dropItemName = (typeof cleanWoWString === 'function') ? cleanWoWString(dropItem.name) : dropItem.name;
            const localizedDungeon = (typeof getLocalizedDungeonName === 'function') ? getLocalizedDungeonName(dropItem.dungeon) : dropItem.dungeon;
            const localizedBoss = (typeof getLocalizedBossName === 'function') ? getLocalizedBossName(dropItem.boss) : dropItem.boss;
            const isOptimal = activeTab === 'optimal';
            const isPkg2 = activeTab === 'pkg2';

            let accentBorder, accentColor, badgeBorder, badgeText, pinBg, pinIcon, pinTitle;

            if (dropItem.itemType === 'crafted') {
                accentBorder = 'border-blue-500/50 bg-blue-950/20 hover:border-blue-400';
                accentColor = 'text-blue-400';
                badgeBorder = 'border-blue-500/40 text-blue-300';
                badgeText = 'CRAFT';
                pinBg = 'border-blue-500/40 bg-blue-950/80 text-blue-300';
                pinIcon = (typeof getIcon === 'function') ? getIcon('hammer', 'w-3.5 h-3.5 text-blue-300') : '';
                pinTitle = `${typeof t === 'function' ? t('sparkCraft') : 'Fabricación con Chispa'} (${localizedDungeon || 'Profesión'})`;
            } else if (dropItem.itemType === 'raid') {
                accentBorder = 'border-red-500/50 bg-red-950/20 hover:border-red-400';
                accentColor = 'text-red-400';
                badgeBorder = 'border-red-500/40 text-red-300';
                badgeText = 'RAID';
                pinBg = 'border-red-500/40 bg-red-950/80 text-red-300';
                pinTitle = `${typeof t === 'function' ? t('raid') : 'Banda'}: ${localizedDungeon} (${typeof t === 'function' ? t('boss') : 'Jefe'}: ${localizedBoss})`;
            } else if (isPkg2) {
                accentBorder = 'border-amber-500/50 bg-amber-950/20 hover:border-amber-400';
                accentColor = 'text-amber-400';
                badgeBorder = 'border-amber-500/40 text-amber-400';
                badgeText = 'DROP';
                pinBg = 'border-amber-500/40 bg-amber-950/80 text-amber-300';
                pinIcon = (typeof getIcon === 'function') ? getIcon('pin', 'w-3.5 h-3.5 text-amber-300') : '';
                pinTitle = `${typeof t === 'function' ? t('dropIn') : 'Dropea en'} ${localizedDungeon} (${typeof t === 'function' ? t('boss') : 'Jefe'}: ${localizedBoss})`;
            } else {
                accentBorder = 'border-cyan-500/50 bg-cyan-950/20 hover:border-cyan-400';
                accentColor = 'text-cyan-400';
                badgeBorder = 'border-cyan-500/40 text-cyan-400';
                badgeText = 'DROP';
                pinBg = 'border-cyan-500/40 bg-cyan-950/80 text-cyan-300';
                pinIcon = (typeof getIcon === 'function') ? getIcon('pin', 'w-3.5 h-3.5 text-cyan-300') : '';
                pinTitle = `${typeof t === 'function' ? t('dropIn') : 'Dropea en'} ${localizedDungeon} (${typeof t === 'function' ? t('boss') : 'Jefe'}: ${localizedBoss})`;
            }

            const imgBorder = dropItem.itemType === 'crafted'
                ? 'border-blue-400/80 shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                : (dropItem.itemType === 'raid'
                    ? 'border-red-400/80 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                    : (isOptimal ? 'border-purple-400/80 shadow-[0_0_8px_rgba(168,85,247,0.3)]' : (isPkg2 ? 'border-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.3)]' : 'border-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.3)]')));

            // Right action element: for raid items, display verified boss portrait with authentic Wowhead popup on hover
            let rightActionHtml = '';
            if (dropItem.itemType === 'raid') {
                const bossNpc = dropItem.bossNpcId;
                const bossSlug = dropItem.bossSlug ? `/${dropItem.bossSlug}` : '';
                const bossHref = bossNpc
                    ? `https://www.wowhead.com/npc=${bossNpc}${bossSlug}`
                    : `https://www.wowhead.com/zone=16915/the-venomous-abyss`;
                const wowheadAttr = bossNpc ? `data-wowhead="npc=${bossNpc}"` : '';
                const bossImgSrc = dropItem.bossImage || (dropItem.bossIcon ? `https://wow.zamimg.com/images/wow/icons/medium/${dropItem.bossIcon}.jpg` : 'https://wow.zamimg.com/images/wow/icons/medium/inv_121_raid_achievement_ulatek.jpg');

                rightActionHtml = `
                    <div class="relative flex items-center shrink-0">
                        <a href="${bossHref}" ${wowheadAttr} target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-lg border border-red-500/50 bg-[#0d1424] p-0.5 flex items-center justify-center shrink-0 shadow-sm overflow-hidden hover:border-red-400 hover:shadow-[0_0_8px_rgba(239,68,68,0.5)] transition cursor-pointer" title="${typeof t === 'function' ? t('boss') : 'Jefe'}: ${localizedBoss} (${localizedDungeon})">
                            <img src="${bossImgSrc}" class="w-full h-full object-cover scale-110 rounded" alt="${localizedBoss}" onerror="this.src='https://wow.zamimg.com/images/wow/icons/medium/inv_121_raid_achievement_ulatek.jpg'">
                        </a>
                    </div>
                `;
            } else {
                rightActionHtml = `
                    <div class="w-8 h-8 rounded-lg border ${pinBg} flex items-center justify-center shrink-0 shadow-sm cursor-help" title="${pinTitle}">
                        <span class="text-xs leading-none">${pinIcon}</span>
                    </div>
                `;
            }

            const badgesLine = gemEnchantBadgesHtml || `
                <div class="flex items-center gap-1.5 truncate min-h-[18px]">
                    <span class="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-gray-800/80 border border-gray-700/50 text-gray-400 font-medium truncate">
                        <span class="w-1.5 h-1.5 rounded-full ${dropItem.itemType === 'raid' ? 'bg-red-400' : (dropItem.itemType === 'crafted' ? 'bg-blue-400' : 'bg-cyan-400')}"></span>
                        <span>${dropItem.itemType === 'raid' ? (typeof t === 'function' ? t('raid') : 'Banda') : (dropItem.itemType === 'crafted' ? (typeof t === 'function' ? t('sparkCraft') : 'Crafteo') : (typeof t === 'function' ? t('dungeonMPlus') : 'Mazmorra M+'))}</span>
                    </span>
                </div>
            `;

            return `
                <div data-slot="${slotLabel}" title="${slotLabel}: ${dropItemName} (ilvl ${dropIlvl}) — ${pinTitle}" class="h-[74px] min-h-[74px] p-2 rounded-xl border ${accentBorder} transition flex items-center justify-between gap-2 shadow-sm">
                    <div class="flex items-center space-x-2.5 min-w-0 flex-1 h-full">
                        <div class="relative shrink-0">
                            <img src="${dropIconUrl}" class="w-9 h-9 rounded-lg border-2 ${imgBorder} bg-black" alt="${dropItemName}">
                            <span class="absolute -bottom-1 -right-1 text-[8px] px-1 rounded bg-black/90 font-bold ${badgeBorder}">
                                ${badgeText}
                            </span>
                        </div>
                        <div class="truncate flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                            <div class="flex items-center gap-1.5 min-w-0">
                                <a href="https://www.wowhead.com/item=${dropItem.id}" data-wowhead="item=${dropItem.id}" target="_blank" class="text-xs font-bold text-white hover:${accentColor} truncate" title="${dropItemName}">
                                    ${dropItemName}
                                </a>
                                <span class="text-[11px] font-mono font-bold shrink-0 ${accentColor}">
                                    ilvl ${dropIlvl}
                                </span>
                            </div>
                            <div class="flex items-center gap-1.5 truncate">
                                <span class="text-[10px] text-gray-300 truncate" title="${dropStatSummary}">${dropStatSummary}</span>
                                <span class="text-[9px] ${accentColor} font-semibold truncate shrink-0">&bull; ${localizedDungeon}</span>
                            </div>
                            ${badgesLine}
                        </div>
                    </div>

                    ${rightActionHtml}
                </div>
            `;
        }

        const ilvl = it ? (it.ilvl || 0) : 0;
        const isCurrentSeason = ilvl >= 330;
        const statSummary = it ? (Object.entries(it.stats || {}).map(([s, val]) => `+${val} ${(typeof getStatName === 'function') ? getStatName(s, true) : (STAT_COLORS[s]?.name || s)}`).join(', ') || (typeof t === 'function' ? t('noSecondaryStats') : 'Sin stats secundarios')) : (typeof t === 'function' ? t('noSecondaryStats') : 'Sin stats');
        const iconUrl = (it && it.icon) ? `https://wow.zamimg.com/images/wow/icons/medium/${it.icon}.jpg` : 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
        const cleanCurrentName = it ? ((typeof cleanWoWString === 'function') ? cleanWoWString(it.name) : it.name) : '';

        // If package is active and slot was not replaced, it is a conserved piece in this set
        if (selectedPkg) {
            const conservedBadgesLine = gemEnchantBadgesHtml || `
                <div class="flex items-center gap-1.5 truncate min-h-[18px]">
                    <span class="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-medium truncate">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>${typeof t === 'function' ? t('keptPiece') : 'Pieza conservada'}</span>
                    </span>
                </div>
            `;

            return `
                <div data-slot="${slotLabel}" title="${slotLabel}: ${cleanCurrentName} (ilvl ${ilvl}) — ${typeof t === 'function' ? t('keptPiece') : 'Pieza conservada en este set'}" class="h-[74px] min-h-[74px] p-2 rounded-xl border border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400/60 transition flex items-center justify-between gap-2 shadow-sm">
                    <div class="flex items-center space-x-2.5 min-w-0 flex-1 h-full">
                        <div class="relative shrink-0">
                            <img src="${iconUrl}" class="w-9 h-9 rounded-lg border-2 border-emerald-400/70 shadow-[0_0_8px_rgba(52,211,153,0.3)] bg-black" alt="${cleanCurrentName}">
                            <span class="absolute -bottom-1 -right-1 text-[8px] px-1 rounded bg-black/90 font-bold text-emerald-400 border border-emerald-500/40">
                                S2
                            </span>
                        </div>
                        <div class="truncate flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                            <div class="flex items-center gap-1.5 min-w-0">
                                <a href="https://www.wowhead.com/item=${it ? it.item_id : ''}" data-wowhead="item=${it ? it.item_id : ''}" target="_blank" class="text-xs font-bold text-white hover:text-emerald-300 truncate" title="${cleanCurrentName}">
                                    ${cleanCurrentName}
                                </a>
                                <span class="text-[11px] font-mono font-bold shrink-0 text-emerald-400">
                                    ilvl ${ilvl || '—'}
                                </span>
                            </div>
                            <span class="text-[10px] text-gray-400 block truncate" title="${statSummary}">${statSummary}</span>
                            ${conservedBadgesLine}
                        </div>
                    </div>

                    <div class="w-8 h-8 rounded-lg border border-emerald-500/40 bg-emerald-950/60 text-emerald-400 flex items-center justify-center shrink-0 select-none" title="${typeof t === 'function' ? t('currentKept') : 'Pieza actual conservada en este set'}">
                        <span class="text-xs leading-none">${typeof getIcon === 'function' ? getIcon('lock', 'w-3.5 h-3.5 text-emerald-400') : ''}</span>
                    </div>
                </div>
            `;
        }

        const isLocked = lockedSlots.has(slotKey);
        const actualSeasonBadge = `
            <div class="flex items-center gap-1.5 truncate min-h-[18px]">
                <span class="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded ${isLocked ? 'bg-emerald-950/70 border border-emerald-500/30 text-emerald-300' : 'bg-amber-950/70 border border-amber-500/30 text-amber-300'} font-medium truncate">
                    <span class="w-1.5 h-1.5 rounded-full ${isLocked ? 'bg-emerald-400' : 'bg-amber-400'}"></span>
                    <span>${isCurrentSeason ? (typeof t === 'function' ? t('season2Piece') : 'Temporada 2 • Actual') : (typeof t === 'function' ? t('season1Piece') : 'Temporada 1 • Previa')}</span>
                </span>
            </div>
        `;

        return `
            <div data-slot="${slotLabel}" title="${slotLabel}: ${cleanCurrentName} (ilvl ${ilvl})" class="h-[74px] min-h-[74px] p-2 rounded-xl border ${isLocked ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-amber-500/40 bg-amber-950/20'} hover:border-cyan-400/50 transition flex items-center justify-between gap-2 shadow-sm">
                <div class="flex items-center space-x-2.5 min-w-0 flex-1 h-full">
                    <div class="relative shrink-0">
                        <img src="${iconUrl}" class="w-9 h-9 rounded-lg border-2 ${isLocked ? 'border-emerald-400/70 shadow-[0_0_8px_rgba(52,211,153,0.3)]' : 'border-amber-400/70 shadow-[0_0_8px_rgba(251,191,36,0.3)]'} bg-black" alt="${cleanCurrentName}">
                        <span class="absolute -bottom-1 -right-1 text-[8px] px-1 rounded bg-black/90 font-bold ${isLocked ? 'text-emerald-400 border border-emerald-500/40' : 'text-amber-400 border border-amber-500/40'}">
                            ${isLocked ? 'S2' : 'S1'}
                        </span>
                    </div>
                    <div class="truncate flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                        <div class="flex items-center gap-1.5 min-w-0">
                            <a href="https://www.wowhead.com/item=${it ? it.item_id : ''}" data-wowhead="item=${it ? it.item_id : ''}" target="_blank" class="text-xs font-bold text-white hover:text-cyan-300 truncate" title="${cleanCurrentName}">
                                ${cleanCurrentName}
                            </a>
                            <span class="text-[11px] font-mono font-bold shrink-0 ${isCurrentSeason ? 'text-emerald-400' : 'text-amber-400'}">
                                ilvl ${ilvl || '—'}
                            </span>
                        </div>
                        <span class="text-[10px] text-gray-400 block truncate" title="${statSummary}">${statSummary}</span>
                        ${actualSeasonBadge}
                    </div>
                </div>

                <button type="button" onclick="toggleSimCSlotLock('${slotKey}')" class="w-8 h-8 rounded-lg border transition shrink-0 flex items-center justify-center ${isLocked ? 'bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-400 border-emerald-500/40 shadow-sm' : 'bg-gray-800/80 hover:bg-gray-700/90 text-amber-400 border-amber-500/30'}" title="${isLocked ? (typeof t === 'function' ? t('lockedTooltip') : 'Conservado (Click para marcar reemplazo)') : (typeof t === 'function' ? t('unlockedTooltip') : 'A Reemplazar (Click para fijar/conservar)')}">
                    <span class="text-xs select-none leading-none">${isLocked ? ((typeof getIcon === 'function') ? getIcon('lock', 'w-3.5 h-3.5 text-emerald-400') : '') : ((typeof getIcon === 'function') ? getIcon('unlock', 'w-3.5 h-3.5 text-amber-400') : '')}</span>
                </button>
            </div>
        `;
    }

    function renderPaperdollOffhandCard() {
        if (pkgItemsBySlot['offhand']) {
            return renderPaperdollSlotCard('offhand');
        }
        if (uItems['offhand']) {
            return renderPaperdollSlotCard('offhand');
        }
        const offhandLabel = (typeof getSlotName === 'function') ? getSlotName('offhand') : 'Mano Secundaria';
        return `
            <div data-slot="${offhandLabel}" title="${offhandLabel}" class="h-[74px] min-h-[74px] p-2 rounded-xl border border-gray-800/80 bg-gray-900/30 opacity-70 flex items-center justify-between gap-2 shadow-sm">
                <div class="flex items-center space-x-2.5 min-w-0 flex-1 h-full">
                    <div class="w-9 h-9 rounded-lg border border-dashed border-gray-700 bg-black/60 flex items-center justify-center text-gray-500 text-sm shrink-0">
                        ${(typeof getIcon === 'function') ? getIcon('shield', 'w-4 h-4 text-gray-500') : ''}
                    </div>
                    <div class="truncate flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                        <div class="flex items-center gap-1.5 min-w-0">
                            <span class="text-xs font-semibold text-gray-400 truncate">${typeof t === 'function' ? t('twoHandWeapon') : 'Arma de 2 Manos'}</span>
                            <span class="text-[10px] font-mono text-gray-500 shrink-0">${typeof t === 'function' ? t('twoHand') : '2 Manos'}</span>
                        </div>
                        <span class="text-[10px] text-gray-500 block truncate">${typeof t === 'function' ? t('freeSlot') : 'Ranura libre / no requerida'}</span>
                        <span class="text-[9px] text-gray-500 italic block truncate">${typeof t === 'function' ? t('covered') : 'Cubierto'}</span>
                    </div>
                </div>
                <div class="w-8 h-8 rounded-lg border border-gray-800 flex items-center justify-center text-gray-600 shrink-0 select-none">
                    -
                </div>
            </div>
        `;
    }

    function renderPaperdollCosmeticCard(slotKey, label, iconHtml) {
        if (pkgItemsBySlot[slotKey]) {
            return renderPaperdollSlotCard(slotKey);
        }
        if (uItems[slotKey]) {
            return renderPaperdollSlotCard(slotKey);
        }
        return `
            <div data-slot="${label}" title="${label}" class="h-[74px] min-h-[74px] p-2 rounded-xl border border-gray-800/60 bg-gray-900/20 opacity-50 flex items-center justify-between gap-2 transition shadow-sm">
                <div class="flex items-center space-x-2.5 min-w-0 flex-1 h-full">
                    <div class="w-9 h-9 rounded-lg border border-dashed border-gray-700 bg-black/50 flex items-center justify-center text-gray-500 text-sm shrink-0">
                        ${iconHtml}
                    </div>
                    <div class="truncate flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                        <span class="text-xs font-semibold text-gray-400 block truncate">${label}</span>
                        <span class="text-[10px] text-gray-500 block truncate">${typeof t === 'function' ? t('emptyCosmetic') : 'Ranura Cosmética'}</span>
                        <span class="text-[9px] text-gray-500 block truncate">${typeof t === 'function' ? t('noSecondaryStats') : 'Sin stats'}</span>
                    </div>
                </div>
                <span class="text-[9px] text-gray-500 bg-gray-800/40 px-1.5 py-0.5 rounded border border-gray-700/40 shrink-0 select-none">-</span>
            </div>
        `;
    }

    const leftCardsHtml = [
        renderPaperdollSlotCard('head'),
        renderPaperdollSlotCard('neck'),
        renderPaperdollSlotCard('shoulder'),
        renderPaperdollSlotCard('back'),
        renderPaperdollSlotCard('chest'),
        renderPaperdollCosmeticCard('shirt', (typeof t === 'function') ? t('shirt') : 'Camisa', (typeof getIcon === 'function') ? getIcon('shirt', 'w-4 h-4 text-gray-500') : ''),
        renderPaperdollCosmeticCard('tabard', (typeof t === 'function') ? t('tabard') : 'Tabardo', (typeof getIcon === 'function') ? getIcon('shield', 'w-4 h-4 text-gray-500') : ''),
        renderPaperdollSlotCard('wrist')
    ].join('');

    const rightCardsHtml = [
        renderPaperdollSlotCard('hands'),
        renderPaperdollSlotCard('waist'),
        renderPaperdollSlotCard('legs'),
        renderPaperdollSlotCard('feet'),
        renderPaperdollSlotCard('finger1'),
        renderPaperdollSlotCard('finger2'),
        renderPaperdollSlotCard('trinket1'),
        renderPaperdollSlotCard('trinket2')
    ].join('');

    const bottomCardsHtml = `
        <div class="space-y-1.5">
            <div class="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 text-center flex items-center justify-center gap-2">
                <span class="h-px bg-gray-800 flex-1"></span>
                <span>${typeof t === 'function' ? t('weaponsSlotHeader') : 'Armas &bull; Ranuras Principales'}</span>
                <span class="h-px bg-gray-800 flex-1"></span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                ${renderPaperdollSlotCard('mainhand')}
                ${renderPaperdollOffhandCard()}
            </div>
        </div>
    `;

    const centerChamberHtml = `
        <div class="rounded-2xl border border-gray-800 bg-gradient-to-b from-[#0b0f19] via-[#0d1424] to-[#080b12] shadow-2xl p-4 flex flex-col justify-center items-center relative overflow-hidden space-y-4">
            <div class="absolute inset-0 pointer-events-none opacity-20" style="background: radial-gradient(circle at 50% 35%, ${classHex} 0%, transparent 70%);"></div>
            ${classIconUrl ? `<img src="${classIconUrl}" class="absolute -right-10 -bottom-10 w-48 h-48 opacity-5 pointer-events-none blur-sm" alt="Crest">` : ''}

            <!-- Character Identity & ilvl Badge -->
            <div class="relative z-10 text-center space-y-1 w-full">
                <h3 class="text-xl font-black text-white tracking-wide flex items-center justify-center gap-2">
                    ${profile.name}
                </h3>
                <div class="text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5" style="color: ${classHex};">
                    ${classIconUrl ? `<img src="${classIconUrl}" class="w-4 h-4 rounded-full border border-gray-700 inline" alt="">` : ''}
                    <span>${classSpecTitle}</span>
                </div>

                <div class="pt-2">
                    <div class="inline-flex flex-col items-center bg-gray-950/80 border ${activeTab === 'optimal' ? 'border-purple-500/40' : (selectedPkg ? (activeTab === 'pkg2' ? 'border-amber-500/40' : 'border-cyan-500/40') : 'border-amber-500/40')} rounded-xl px-4 py-1.5 shadow-lg">
                        <span class="text-[9px] uppercase tracking-widest text-gray-400 font-extrabold">
                            ${selectedPkg ? (typeof t === 'function' ? t('projectedIlvl') : 'Nivel de Objeto Proyectado') : (typeof t === 'function' ? t('avgIlvl') : 'Nivel de Objeto Medio')}
                        </span>
                        <span class="text-2xl font-black ${activeTab === 'optimal' ? 'text-purple-400 glow-purple' : (selectedPkg ? (activeTab === 'pkg2' ? 'text-amber-400 glow-amber' : 'text-cyan-400 glow-cyan') : 'text-amber-400 glow-amber')} font-mono tracking-tight leading-none mt-0.5">${displayIlvl}</span>
                    </div>
                </div>
            </div>

            <!-- Hero Silhouette & Paperdoll Chamber Center -->
            <div class="relative z-10 py-3 flex flex-col items-center justify-center">
                <div class="relative w-36 h-48 flex items-center justify-center">
                    <div class="absolute w-28 h-28 rounded-full blur-md opacity-30" style="background-color: ${classHex};"></div>
                    <svg class="w-full h-full text-gray-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] opacity-75" viewBox="0 0 100 140" fill="currentColor">
                        <path d="M50 8 C44 8 40 12 40 18 C38 15 34 11 32 10 C33 15 36 20 39 23 C39 26 41 29 44 31 L50 33 L56 31 C59 29 61 26 61 23 C64 20 67 15 68 10 C66 11 62 15 60 18 C60 12 56 8 50 8 Z" fill="currentColor"/>
                        <circle cx="50" cy="22" r="7" fill="currentColor"/>
                        <ellipse cx="47.5" cy="21.5" rx="1" ry="0.6" fill="${classHex}"/>
                        <ellipse cx="52.5" cy="21.5" rx="1" ry="0.6" fill="${classHex}"/>
                        <path d="M43 32 L30 35 C23 37 20 44 24 50 L32 52 L36 38 Z" fill="currentColor"/>
                        <path d="M57 32 L70 35 C77 37 80 44 76 50 L68 52 L64 38 Z" fill="currentColor"/>
                        <path d="M36 36 L64 36 L60 68 L40 68 Z" fill="currentColor"/>
                        <rect x="38" y="68" width="24" height="6" rx="1" fill="#4B5563"/>
                        <rect x="47" y="67.5" width="6" height="7" rx="1" fill="${classHex}"/>
                        <path d="M40 74 L48 74 L46 110 L38 110 Z" fill="currentColor"/>
                        <path d="M52 74 L60 74 L62 110 L54 110 Z" fill="currentColor"/>
                        <path d="M37 110 L47 110 L48 126 L34 126 Z" fill="currentColor"/>
                        <path d="M53 110 L63 110 L66 126 L52 126 Z" fill="currentColor"/>
                        <path d="M26 48 L22 72 L27 75 L33 55 Z" fill="currentColor"/>
                        <path d="M74 48 L78 72 L73 75 L67 55 Z" fill="currentColor"/>
                        <path d="M33 38 L25 90 L36 94 L37 40 Z" opacity="0.4" fill="currentColor"/>
                        <path d="M67 38 L75 90 L64 94 L63 40 Z" opacity="0.4" fill="currentColor"/>
                    </svg>
                </div>
            </div>
        </div>
    `;

    // Assemble final output
    outputBox.innerHTML = `
        <!-- Dual Distribution Bars -->
        <div class="space-y-4 bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs font-bold text-gray-300">
                    <span>${typeof t === 'function' ? t('charDistribution') : 'Distribución de Tu Personaje'}:</span>
                    <span class="font-mono text-cyan-400">${userTotalSec.toLocaleString()} pts totales</span>
                </div>
                <div class="h-6 w-full rounded-lg overflow-hidden flex border border-gray-700 bg-gray-950">
                    ${userBarHtml}
                </div>
            </div>

            <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs font-bold text-gray-300">
                    <span>${typeof t === 'function' ? t('top50Distribution') : 'Consenso Promedio del Top 50'}:</span>
                    <span class="font-mono text-amber-400">${top10SumAll > 0 ? Math.round(top10SumAll / count).toLocaleString() : 0} pts promedio</span>
                </div>
                <div class="h-6 w-full rounded-lg overflow-hidden flex border border-gray-700 bg-gray-950">
                    ${top10BarHtml}
                </div>
            </div>
        </div>

        <!-- 4 Stat Diagnostic Cards Grid -->
        <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">${typeof t === 'function' ? t('detailedDiagnostic') : 'Diagnóstico Detallado por Atributo Secundario'}</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                ${statCardsHtml}
            </div>
        </div>

        <!-- Slot Inspection & Season Classification -->
        <div class="bg-gray-900/60 border border-cardborder rounded-2xl p-5 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cardborder pb-3">
                <div>
                    <h4 class="text-base font-black text-white flex items-center gap-2">
                        <span class="text-amber-400">${typeof getIcon === 'function' ? getIcon('shield', 'w-4 h-4') : ''}</span>
                        ${typeof t === 'function' ? t('seasonDetectionTitle') : 'Detección de Temporada e Inspección de Ranuras'}
                    </h4>
                </div>
                <div class="flex items-center gap-1.5 bg-gray-950/90 p-1 rounded-xl border border-gray-700/80 shadow-inner shrink-0 flex-wrap sm:flex-nowrap">
                    <button type="button" onclick="switchPaperdollTab('current')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'current' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800/60'}">
                        <span>${typeof getIcon === 'function' ? getIcon('backpack', 'w-3.5 h-3.5') : ''}</span>
                        <span>${typeof t === 'function' ? t('tabActual') : 'Actual'}</span>
                    </button>
                    <button type="button" onclick="switchPaperdollTab('optimal')" ${!solverResult.pkgOptimal ? 'disabled class="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 opacity-40 cursor-not-allowed"' : `class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'optimal' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800/60'}"`}>
                        <span>${typeof getIcon === 'function' ? getIcon('star', 'w-3.5 h-3.5') : ''}</span>
                        <span>${typeof t === 'function' ? t('tabOptimal') : 'Óptimo'}</span>
                    </button>
                    <button type="button" onclick="switchPaperdollTab('pkg1')" ${!solverResult.pkg1 ? 'disabled class="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 opacity-40 cursor-not-allowed"' : `class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'pkg1' ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800/60'}"`}>
                        <span>${typeof getIcon === 'function' ? getIcon('trophy', 'w-3.5 h-3.5') : ''}</span>
                        <span>${typeof t === 'function' ? t('tabRecommended') : 'Recomendado'}</span>
                    </button>
                    <button type="button" onclick="switchPaperdollTab('pkg2')" ${!solverResult.pkg2 ? 'disabled class="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 opacity-40 cursor-not-allowed"' : `class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'pkg2' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800/60'}"`}>
                        <span>${typeof getIcon === 'function' ? getIcon('medal', 'w-3.5 h-3.5') : ''}</span>
                        <span>${typeof t === 'function' ? t('tabAlternative') : 'Alternativo'}</span>
                    </button>
                </div>
            </div>

            <!-- Paperdoll 3-Column Layout (WoW Character Screen Replica) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <!-- Left Slots (Casco a Brazales) -->
                <div class="order-2 lg:order-1 lg:col-span-4 flex flex-col space-y-2.5">
                    ${leftCardsHtml}
                </div>

                <!-- Center Chamber & Bottom Weapons -->
                <div class="order-1 lg:order-2 lg:col-span-4 flex flex-col space-y-3">
                    ${centerChamberHtml}
                    ${bottomCardsHtml}
                </div>

                <!-- Right Slots (Guantes a Abalorio 2) -->
                <div class="order-3 lg:order-3 lg:col-span-4 flex flex-col space-y-2.5">
                    ${rightCardsHtml}
                </div>
            </div>
        </div>
    `;

    // Refresh Wowhead tooltips
    if (window.$WowheadPower && typeof window.$WowheadPower.refreshLinks === 'function') {
        window.$WowheadPower.refreshLinks();
    }

    // Persist SimC analysis state to localStorage
    if (typeof saveSimCAnalysisToStorage === 'function') {
        saveSimCAnalysisToStorage();
    }
}
window.renderSimCComparisonResults = renderSimCComparisonResults;
