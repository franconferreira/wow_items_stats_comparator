/**
 * main.js
 * Application entry point, form setup, UI dropdown handlers, and DOM lifecycle initialization.
 */

function populateClassSelect() {
    const classSelect = document.getElementById('class-select');
    if (!classSelect) return;
    classSelect.innerHTML = '';
    for (const [slug, data] of Object.entries(WOW_CLASSES)) {
        const opt = document.createElement('option');
        opt.value = slug;
        opt.textContent = data.name;
        classSelect.appendChild(opt);
    }
    classSelect.value = 'death-knight';
}
window.populateClassSelect = populateClassSelect;

function updateSpecSelect(preferredSpec = null) {
    const classSelect = document.getElementById('class-select');
    const specSelect = document.getElementById('spec-select');
    if (!classSelect || !specSelect) return;

    const classSlug = classSelect.value;
    const classData = WOW_CLASSES[classSlug];
    
    specSelect.innerHTML = '';
    if (classData && classData.specs && classData.specs.length > 0) {
        classData.specs.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.slug;
            opt.textContent = `${s.name} (${s.role.toUpperCase()})`;
            specSelect.appendChild(opt);
        });

        // Automatically select specialization: either preferredSpec if valid, or the first spec of the class
        if (preferredSpec && classData.specs.some(s => s.slug === preferredSpec)) {
            specSelect.value = preferredSpec;
        } else {
            specSelect.value = classData.specs[0].slug;
        }
    }
}
window.updateSpecSelect = updateSpecSelect;

function setupEventListeners() {
    const classSelect = document.getElementById('class-select');
    if (classSelect) {
        classSelect.addEventListener('change', () => {
            updateSpecSelect();
        });
    }

    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', startAnalysis);
    }

    // Instant recalculation when toggling the 344 filter
    const exclude344Check = document.getElementById('exclude-344-check');
    if (exclude344Check) {
        exclude344Check.addEventListener('change', () => {
            if (cachedPlayers && cachedPlayers.length > 0) {
                renderResults(cachedPlayers, cachedClassSlug, cachedSpecSlug);
                saveTop10AnalysisToStorage(cachedPlayers, cachedClassSlug, cachedSpecSlug);
            }
        });
    }

    // SimulationCraft handlers
    const simcTextEl = document.getElementById('simc-text');
    if (simcTextEl) {
        simcTextEl.addEventListener('input', handleSimCTextChange);
        simcTextEl.addEventListener('paste', () => {
            setTimeout(handleSimCTextChange, 50);
        });
    }

    const loadSampleBtn = document.getElementById('load-sample-simc-btn');
    if (loadSampleBtn) {
        loadSampleBtn.addEventListener('click', () => {
            loadSampleSimC();
            handleSimCTextChange();
        });
    }

    const analyzeSimcBtn = document.getElementById('analyze-simc-btn');
    if (analyzeSimcBtn) {
        analyzeSimcBtn.addEventListener('click', handleSimCCompare);
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    populateClassSelect();
    setupEventListeners();

    // Try to restore previous sessions (Top 50 analysis and SimC comparison)
    const top10Restored = (typeof loadTop10AnalysisFromStorage === 'function') ? loadTop10AnalysisFromStorage() : false;
    if (!top10Restored) {
        updateSpecSelect(); // Automatically selects the first spec of default class
    }
    if (typeof loadSimCAnalysisFromStorage === 'function') {
        loadSimCAnalysisFromStorage();
    }
});
