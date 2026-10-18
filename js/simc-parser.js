/**
 * simc-parser.js
 * SimulationCraft (/simc export) text parser, automatic class/spec detection, and comparison trigger.
 */

function loadSampleSimC() {
    const txtArea = document.getElementById('simc-text');
    if (txtArea) {
        txtArea.value = SAMPLE_SIMC_STRING.trim();
        // Ensure container is open
        const container = document.getElementById('simc-input-container');
        if (container && container.classList.contains('hidden')) {
            if (typeof toggleCollapse === 'function') {
                toggleCollapse('simc-input-container', 'simc-input-chevron', 'simc-input-status');
            }
        }
    }
}
window.loadSampleSimC = loadSampleSimC;

function parseSimCString(text) {
    if (!text || typeof text !== 'string') return null;

    const result = {
        name: 'Tu Personaje',
        class: null,
        spec: null,
        items: {}
    };

    const lines = text.split('\n');
    for (let rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;

        // Check for class and character name
        for (const [clsSimc, clsSlug] of Object.entries(SIMC_CLASS_MAP)) {
            if (line.toLowerCase().startsWith(clsSimc + '=')) {
                result.class = clsSlug;
                const namePart = line.split('=')[1] || '';
                result.name = namePart.replace(/["']/g, '').trim() || 'Tu Personaje';
                break;
            }
        }

        // Check for spec
        if (line.toLowerCase().startsWith('spec=')) {
            result.spec = line.split('=')[1].trim().toLowerCase();
        }

        // Check equipment slot lines
        const slotMatch = line.match(/^(head|neck|shoulder|back|chest|wrist|hands|waist|legs|feet|finger1|finger2|trinket1|trinket2|main_hand|off_hand|mainhand|offhand)=.*?id=(\d+)/i);
        if (slotMatch) {
            const rawSlot = slotMatch[1].toLowerCase();
            const slot = rawSlot.replace('_', '');
            const itemId = parseInt(slotMatch[2], 10);

            // Extract bonus_id
            const bonusMatch = line.match(/bonus_id=([\d/]+)/i);
            const bonuses = bonusMatch ? bonusMatch[1].split('/').map(b => parseInt(b, 10)).filter(Boolean) : [];

            // Extract gem_id
            const gemMatch = line.match(/gem_id=([\d/]+)/i);
            const gems = gemMatch ? gemMatch[1].split('/').map(g => parseInt(g, 10)).filter(Boolean) : [];

            // Extract enchant_id
            const enchMatch = line.match(/enchant_id=(\d+)/i);
            const enchant = enchMatch ? parseInt(enchMatch[1], 10) : null;

            // Extract item level if present
            const ilvlMatch = line.match(/(?:level|ilvl)=(\d+)/i);
            const itemLevel = ilvlMatch ? parseInt(ilvlMatch[1], 10) : 0;

            result.items[slot] = {
                item_id: itemId,
                bonuses: bonuses,
                gems: gems,
                enchant: enchant,
                ilvl: itemLevel
            };
        }
    }

    return result;
}

function handleSimCTextChange() {
    const rawText = document.getElementById('simc-text')?.value?.trim();
    if (!rawText) return;

    const parsedProfile = parseSimCString(rawText);
    if (!parsedProfile) return;

    // 1. Automatically switch class if detected in SimC text
    if (parsedProfile.class) {
        const classSelect = document.getElementById('class-select');
        if (classSelect && classSelect.value !== parsedProfile.class) {
            classSelect.value = parsedProfile.class;
        }
    }

    // 2. Automatically switch specialization to match SimC profile
    if (parsedProfile.spec) {
        if (typeof updateSpecSelect === 'function') {
            updateSpecSelect(parsedProfile.spec);
        }
    }
}

async function handleSimCCompare() {
    const rawText = document.getElementById('simc-text')?.value?.trim();
    const outputBox = document.getElementById('simc-comparison-box');
    const compareBtn = document.getElementById('analyze-simc-btn');

    if (!rawText) {
        alert('Por favor pega el texto de tu exportación de /simc en el recuadro antes de comparar.');
        return;
    }

    const parsedProfile = parseSimCString(rawText);
    if (!parsedProfile || Object.keys(parsedProfile.items).length === 0) {
        alert('No se detectaron piezas de equipamiento válidas en el texto de SimulationCraft. Asegúrate de copiar todo el texto del comando /simc en el juego.');
        return;
    }

    // Ensure class & spec dropdowns are aligned with the profile
    if (parsedProfile.class) {
        const classSelect = document.getElementById('class-select');
        if (classSelect && classSelect.value !== parsedProfile.class) {
            classSelect.value = parsedProfile.class;
        }
    }
    if (parsedProfile.spec) {
        if (typeof updateSpecSelect === 'function') {
            updateSpecSelect(parsedProfile.spec);
        }
    }

    if (compareBtn) {
        compareBtn.disabled = true;
        compareBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    try {
        if (outputBox) outputBox.classList.remove('hidden');

        // Check if Top 50 has not been analyzed yet, or if class/spec differs
        const currentClass = document.getElementById('class-select')?.value;
        const currentSpec = document.getElementById('spec-select')?.value;

        let needsNewAnalysis = false;
        if (!cachedPlayers || cachedPlayers.length === 0) {
            needsNewAnalysis = true;
        } else if (cachedClassSlug && currentClass && cachedClassSlug !== currentClass) {
            needsNewAnalysis = true;
        } else if (parsedProfile.class && cachedClassSlug && parsedProfile.class !== cachedClassSlug) {
            needsNewAnalysis = true;
        } else if (cachedSpecSlug && currentSpec && cachedSpecSlug !== currentSpec) {
            needsNewAnalysis = true;
        } else if (parsedProfile.spec && cachedSpecSlug && parsedProfile.spec !== cachedSpecSlug) {
            needsNewAnalysis = true;
        } else if (cachedPlayers.some(p => {
            const specObj = WOW_CLASSES[currentClass]?.specs?.find(s => s.slug === currentSpec);
            return p.spec && specObj && p.spec.toLowerCase() !== specObj.name.toLowerCase();
        })) {
            needsNewAnalysis = true;
        }

        if (needsNewAnalysis) {
            const classDisplayName = WOW_CLASSES[currentClass]?.name || currentClass;
            const specObj = WOW_CLASSES[currentClass]?.specs?.find(s => s.slug === currentSpec);
            const specDisplayName = specObj?.name || currentSpec;
            if (outputBox) {
                outputBox.innerHTML = `
                    <div class="py-8 text-center space-y-3">
                        <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-amber-400 border-t-transparent"></div>
                        <div class="text-sm font-bold text-amber-300">Top 50 no analizado aún: Obteniendo automáticamente datos del Top 50 para ${classDisplayName} (${specDisplayName})...</div>
                        <div class="text-xs text-gray-400">Consultando Raider.IO y calculando consenso previo a la comparación de equipamiento...</div>
                    </div>
                `;
            }
            if (typeof startAnalysis === 'function') {
                await startAnalysis();
            }
        }

        if (!cachedPlayers || cachedPlayers.length === 0) {
            throw new Error('No se encontraron datos del Top 50 para realizar la comparativa. Verifica tu conexión a internet o los filtros seleccionados.');
        }

        if (outputBox) {
            outputBox.innerHTML = `
                <div class="py-8 text-center space-y-3">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent"></div>
                    <div class="text-sm font-bold text-cyan-300">Procesando equipamiento de SimulationCraft y consultando Wowhead...</div>
                    <div class="text-xs text-gray-400">Verificando estadísticas secundarias, gemas y enchants...</div>
                </div>
            `;
        }

        // Calculate User Secondary Stats by querying item tooltips
        const userStats = { 'Critical Strike': 0, 'Haste': 0, 'Mastery': 0, 'Versatility': 0 };
        const userItemsDetails = {};

        for (const [slot, it] of Object.entries(parsedProfile.items)) {
            const tt = await fetchItemTooltip(it.item_id, 0, it.bonuses);
            const itemStats = {};

            // Item base stats
            for (const [sName, sVal] of Object.entries(tt.stats || {})) {
                if (userStats[sName] !== undefined) {
                    userStats[sName] += sVal;
                    itemStats[sName] = (itemStats[sName] || 0) + sVal;
                }
            }

            // Gems stats
            for (const gId of it.gems || []) {
                const gtt = await fetchItemTooltip(gId, 0, []);
                for (const [sName, sVal] of Object.entries(gtt.stats || {})) {
                    if (userStats[sName] !== undefined) {
                        userStats[sName] += sVal;
                        itemStats[sName] = (itemStats[sName] || 0) + sVal;
                    }
                }
            }

            userItemsDetails[slot] = {
                ...it,
                name: tt.name || 'Ítem',
                icon: tt.icon,
                ilvl: tt.ilvl || it.ilvl || 0,
                isUse: tt.isUse,
                stats: itemStats
            };
        }

        // Reset activeSimCProfile and render complete comparison & set recommendations
        activeSimCProfile = null;
        if (typeof renderSimCComparisonResults === 'function') {
            renderSimCComparisonResults(parsedProfile, userStats, userItemsDetails, cachedPlayers);
        }

    } catch (err) {
        console.error(err);
        if (outputBox) {
            outputBox.classList.remove('hidden');
            outputBox.innerHTML = `
                <div class="p-4 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs">
                    Error al procesar la comparación: ${err.message}
                </div>
            `;
        }
    } finally {
        if (compareBtn) {
            compareBtn.disabled = false;
            compareBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
}

if (typeof window !== 'undefined') {
    window.loadSampleSimC = loadSampleSimC;
    window.parseSimCString = parseSimCString;
    window.handleSimCTextChange = handleSimCTextChange;
    window.handleSimCCompare = handleSimCCompare;
}
