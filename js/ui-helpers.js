/**
 * ui-helpers.js
 * Visual progress bars, error notifications, and section collapsible toggles.
 */

// Progress UI helpers
function setProgress(percent, message) {
    const pContainer = document.getElementById('progress-container');
    const pBar = document.getElementById('progress-bar');
    const pText = document.getElementById('progress-text');
    
    if (pContainer) pContainer.classList.remove('hidden');
    if (pBar) pBar.style.width = `${percent}%`;
    if (pText) pText.textContent = message;
}

function hideProgress() {
    const pContainer = document.getElementById('progress-container');
    if (pContainer) pContainer.classList.add('hidden');
}

function showError(msg) {
    const errorBox = document.getElementById('error-box');
    if (errorBox) {
        errorBox.textContent = msg;
        errorBox.classList.remove('hidden');
    }
}

// -------------------------------------------------------------
// Interactive Section Collapsing
// -------------------------------------------------------------
function toggleCollapse(contentId, chevronId, statusId) {
    const content = document.getElementById(contentId);
    const chevron = document.getElementById(chevronId);
    const status = document.getElementById(statusId);
    if (!content) return;

    const isHidden = content.classList.contains('hidden');
    if (isHidden) {
        content.classList.remove('hidden');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
        if (status) status.textContent = 'Plegar';
    } else {
        content.classList.add('hidden');
        if (chevron) chevron.style.transform = 'rotate(-90deg)';
        if (status) status.textContent = 'Desplegar';
    }
}
window.toggleCollapse = toggleCollapse;

function toggleAllSections(collapseAll) {
    const sections = [
        { body: 'top10-gear-body', chevron: 'top10-gear-chevron', status: 'top10-gear-status' },
        { body: 'raid-bosses-body', chevron: 'raid-bosses-chevron', status: 'raid-bosses-status' }
    ];

    sections.forEach(s => {
        const bodyEl = document.getElementById(s.body);
        const chevronEl = document.getElementById(s.chevron);
        const statusEl = document.getElementById(s.status);
        if (!bodyEl) return;

        if (collapseAll) {
            bodyEl.classList.add('hidden');
            if (chevronEl) chevronEl.style.transform = 'rotate(-90deg)';
            if (statusEl) statusEl.textContent = 'Desplegar';
        } else {
            bodyEl.classList.remove('hidden');
            if (chevronEl) chevronEl.style.transform = 'rotate(0deg)';
            if (statusEl) statusEl.textContent = 'Plegar';
        }
    });
}
window.toggleAllSections = toggleAllSections;

if (typeof window !== 'undefined') {
    window.setProgress = setProgress;
    window.hideProgress = hideProgress;
    window.showError = showError;
    window.toggleCollapse = toggleCollapse;
    window.toggleAllSections = toggleAllSections;
}
