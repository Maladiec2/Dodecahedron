/**
 * Demo Orchestrator Logic
 *
 * Main navigation and state management for the demo flow
 */

// Global state
const demoState = {
    currentStep: 1,
    totalSteps: 4,
    faceConfig: null,
    kpiMode: null, // 'quick' or 'full'
    kpiData: null,
    coherenceResults: null,
    completedSteps: []
};

/**
 * Initialize demo
 */
function initializeDemo() {
    console.log('🌟 Quannex Demo Orchestrator initialized');
    updateProgress();
}

/**
 * Navigate to step
 */
function goToStep(stepNumber) {
    // Validate step is accessible
    if (stepNumber > 1 && !demoState.completedSteps.includes(stepNumber - 1)) {
        alert(`Please complete Step ${stepNumber - 1} first`);
        return;
    }

    // Hide all steps
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });

    // Show target step
    document.getElementById(`step${stepNumber}`).classList.add('active');

    // Update navigation
    document.querySelectorAll('.step-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');

    // Update state
    demoState.currentStep = stepNumber;
    updateProgress();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.log(`📍 Navigated to Step ${stepNumber}`);
}

/**
 * Update progress bar
 */
function updateProgress() {
    const progressPercent = ((demoState.currentStep - 1) / (demoState.totalSteps - 1)) * 100;
    document.getElementById('progressBar').style.width = `${progressPercent}%`;
}

/**
 * Mark step as completed
 */
function markStepCompleted(stepNumber) {
    if (!demoState.completedSteps.includes(stepNumber)) {
        demoState.completedSteps.push(stepNumber);
    }

    // Update UI
    const stepButton = document.querySelector(`[data-step="${stepNumber}"]`);
    if (stepButton) {
        stepButton.classList.add('completed');
    }
}

/**
 * Complete Step 1: Face Definition
 */
function completeStep1() {
    // Validate faces
    const validation = validateFaces();

    if (!validation.valid) {
        alert(validation.message);
        return;
    }

    // Save configuration
    demoState.faceConfig = getFaceConfiguration();

    // Mark completed
    markStepCompleted(1);

    // Show success
    console.log('✅ Step 1 completed:', demoState.faceConfig);

    // Go to next step
    goToStep(2);
}

/**
 * Select KPI mode
 */
function selectMode(mode) {
    demoState.kpiMode = mode;

    // Update UI
    document.getElementById('modeQuick').classList.remove('btn-primary');
    document.getElementById('modeFull').classList.remove('btn-primary');
    document.getElementById('modeQuick').classList.add('btn-secondary');
    document.getElementById('modeFull').classList.add('btn-secondary');

    if (mode === 'quick') {
        document.getElementById('modeQuick').classList.remove('btn-secondary');
        document.getElementById('modeQuick').classList.add('btn-primary');
    } else {
        document.getElementById('modeFull').classList.remove('btn-secondary');
        document.getElementById('modeFull').classList.add('btn-primary');
    }

    // Load KPI mapper
    loadKPIMapper(mode);

    // Enable next button
    document.getElementById('step2NextBtn').disabled = false;

    console.log(`✅ KPI mode selected: ${mode}`);
}

/**
 * Load KPI mapper interface
 */
function loadKPIMapper(mode) {
    const section = document.getElementById('kpiMapperSection');
    section.style.display = 'block';

    if (mode === 'quick') {
        section.innerHTML = generateQuickModeHTML();
    } else {
        section.innerHTML = generateFullModeHTML();
    }
}

/**
 * Generate Quick Mode HTML (12 KPIs) - ENHANCED with units and suggestions
 */
function generateQuickModeHTML() {
    const units = window.KPILibrary ? window.KPILibrary.getUnitTypes() : [];

    let html = '<div style="margin: 30px 0;">';
    html += '<h3 style="font-size: 16px; margin-bottom: 20px; color: rgba(255, 255, 255, 0.8);">Quick Mode: 1 KPI per Face</h3>';
    html += '<div style="display: grid; gap: 20px;">';

    demoState.faceConfig.faces.forEach(face => {
        // Get KPI suggestions for this face (Earth element by default for quick mode)
        const suggestions = window.KPILibrary ? window.KPILibrary.getKPISuggestions(face.name, 'Earth') : [];
        const datalistId = `kpi-suggestions-${face.id}`;

        html += `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 20px;">
                <div style="font-size: 14px; font-weight: 600; margin-bottom: 15px; color: #00ffcc;">
                    Face ${face.id}: ${face.name}
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 15px; margin-bottom: 10px;">
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            KPI Name
                        </label>
                        <input
                            type="text"
                            class="face-input"
                            list="${datalistId}"
                            placeholder="Start typing..."
                            data-face-id="${face.id}"
                            data-field="kpiName"
                            onchange="autofillKPISuggestion(this, ${face.id})"
                        />
                        <datalist id="${datalistId}">
                            ${suggestions.map(s => `<option value="${s.name}" data-unit="${s.unit}" data-min="${s.targetMin}" data-ideal="${s.targetIdeal}">${s.description}</option>`).join('')}
                        </datalist>
                    </div>
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Value
                        </label>
                        <input
                            type="number"
                            class="face-input"
                            placeholder="0"
                            data-face-id="${face.id}"
                            data-field="value"
                            step="any"
                        />
                    </div>
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Unit
                        </label>
                        <select
                            class="face-input"
                            data-face-id="${face.id}"
                            data-field="unit"
                            style="cursor: pointer; font-size: 12px;"
                        >
                            ${units.map(u => `<option value="${u.value}">${u.symbol || u.label}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Direction
                        </label>
                        <select
                            class="face-input"
                            data-face-id="${face.id}"
                            data-field="direction"
                            style="cursor: pointer; font-size: 12px;"
                        >
                            <option value="↑">↑ Higher</option>
                            <option value="↓">↓ Lower</option>
                            <option value="Band">⊟ Sweet spot</option>
                        </select>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Target Minimum
                        </label>
                        <input
                            type="number"
                            class="face-input"
                            placeholder="0"
                            data-face-id="${face.id}"
                            data-field="targetMin"
                            step="any"
                        />
                    </div>
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Target Ideal
                        </label>
                        <input
                            type="number"
                            class="face-input"
                            placeholder="100"
                            data-face-id="${face.id}"
                            data-field="targetIdeal"
                            step="any"
                        />
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div></div>';
    return html;
}

/**
 * Generate Full Mode HTML (60 KPIs) - ENHANCED with tooltips, units, and suggestions
 */
function generateFullModeHTML() {
    const elements = ['Earth', 'Water', 'Fire', 'Air', 'Ether'];
    const units = window.KPILibrary ? window.KPILibrary.getUnitTypes() : [];

    let html = '<div style="margin: 30px 0;">';
    html += '<h3 style="font-size: 16px; margin-bottom: 20px; color: rgba(255, 255, 255, 0.8);">Full Mode: 5 Elemental KPIs per Face</h3>';

    demoState.faceConfig.faces.forEach(face => {
        html += `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #00ffcc;">
                    Face ${face.id}: ${face.name}
                </div>
        `;

        elements.forEach(element => {
            // Get elemental wisdom
            const wisdom = window.KPILibrary ? window.KPILibrary.getElementalWisdom(element) : { icon: '✨', subtitle: element, description: '' };

            // Get KPI suggestions for this element
            const suggestions = window.KPILibrary ? window.KPILibrary.getKPISuggestions(face.name, element) : [];
            const datalistId = `kpi-suggestions-${face.id}-${element}`;

            html += `
                <div style="background: rgba(0, 0, 0, 0.2); border-radius: 6px; padding: 15px; margin-bottom: 15px; position: relative;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                        <span style="font-size: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9);">
                            ${wisdom.icon} ${element}
                        </span>
                        <span style="font-size: 10px; color: rgba(255, 255, 255, 0.6);">
                            (${wisdom.subtitle})
                        </span>
                        <span class="elemental-tooltip" style="cursor: help; font-size: 11px; color: rgba(0, 255, 204, 0.7);" title="${wisdom.description}">ℹ️</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 10px;">
                        <input
                            type="text"
                            class="face-input"
                            list="${datalistId}"
                            placeholder="KPI name"
                            data-face-id="${face.id}"
                            data-element="${element}"
                            data-field="kpiName"
                            style="font-size: 12px;"
                            onchange="autofillElementalKPI(this, ${face.id}, '${element}')"
                        />
                        <datalist id="${datalistId}">
                            ${suggestions.map(s => `<option value="${s.name}" data-unit="${s.unit}" data-min="${s.targetMin}" data-ideal="${s.targetIdeal}">${s.description}</option>`).join('')}
                        </datalist>

                        <input
                            type="number"
                            class="face-input"
                            placeholder="Value"
                            data-face-id="${face.id}"
                            data-element="${element}"
                            data-field="value"
                            style="font-size: 12px;"
                            step="any"
                        />

                        <select
                            class="face-input"
                            data-face-id="${face.id}"
                            data-element="${element}"
                            data-field="unit"
                            style="cursor: pointer; font-size: 11px;"
                        >
                            ${units.map(u => `<option value="${u.value}">${u.symbol || u.label.substring(0, 8)}</option>`).join('')}
                        </select>

                        <input
                            type="number"
                            class="face-input"
                            placeholder="Min"
                            data-face-id="${face.id}"
                            data-element="${element}"
                            data-field="targetMin"
                            style="font-size: 12px;"
                            step="any"
                        />

                        <input
                            type="number"
                            class="face-input"
                            placeholder="Ideal"
                            data-face-id="${face.id}"
                            data-element="${element}"
                            data-field="targetIdeal"
                            style="font-size: 12px;"
                            step="any"
                        />
                    </div>
                </div>
            `;
        });

        html += '</div>';
    });

    html += '</div>';
    return html;
}

/**
 * Complete Step 2: KPI Mapping
 */
function completeStep2() {
    // Collect KPI data from form
    demoState.kpiData = collectKPIData();

    // Validate
    if (!demoState.kpiData || demoState.kpiData.length === 0) {
        alert('Please enter at least one KPI');
        return;
    }

    // Mark completed
    markStepCompleted(2);

    console.log('✅ Step 2 completed:', demoState.kpiData);

    // Go to calculation
    goToStep(3);

    // Auto-run calculation
    runCalculation();
}

/**
 * Autofill KPI suggestion (Quick Mode)
 */
function autofillKPISuggestion(inputElement, faceId) {
    const kpiName = inputElement.value;
    const datalistOptions = inputElement.list?.options;

    if (!datalistOptions) return;

    // Find matching option
    for (let option of datalistOptions) {
        if (option.value === kpiName) {
            // Autofill unit, min, and ideal if available
            const faceInputs = document.querySelectorAll(`[data-face-id="${faceId}"]`);

            faceInputs.forEach(input => {
                const field = input.getAttribute('data-field');

                if (field === 'unit' && option.dataset.unit) {
                    input.value = option.dataset.unit;
                }
                if (field === 'targetMin' && option.dataset.min && !input.value) {
                    input.value = option.dataset.min;
                }
                if (field === 'targetIdeal' && option.dataset.ideal && !input.value) {
                    input.value = option.dataset.ideal;
                }
            });

            console.log(`✅ Autofilled KPI: ${kpiName}`);
            break;
        }
    }
}

/**
 * Autofill elemental KPI suggestion (Full Mode)
 */
function autofillElementalKPI(inputElement, faceId, element) {
    const kpiName = inputElement.value;
    const datalistOptions = inputElement.list?.options;

    if (!datalistOptions) return;

    // Find matching option
    for (let option of datalistOptions) {
        if (option.value === kpiName) {
            // Autofill unit, min, and ideal if available
            const faceInputs = document.querySelectorAll(`[data-face-id="${faceId}"][data-element="${element}"]`);

            faceInputs.forEach(input => {
                const field = input.getAttribute('data-field');

                if (field === 'unit' && option.dataset.unit) {
                    input.value = option.dataset.unit;
                }
                if (field === 'targetMin' && option.dataset.min && !input.value) {
                    input.value = option.dataset.min;
                }
                if (field === 'targetIdeal' && option.dataset.ideal && !input.value) {
                    input.value = option.dataset.ideal;
                }
            });

            console.log(`✅ Autofilled ${element} KPI: ${kpiName}`);
            break;
        }
    }
}

/**
 * Collect KPI data from form - ENHANCED with units and default to 0 for empty values
 */
function collectKPIData() {
    const kpis = [];

    if (demoState.kpiMode === 'quick') {
        // Collect 12 KPIs (one per face)
        demoState.faceConfig.faces.forEach(face => {
            const inputs = document.querySelectorAll(`[data-face-id="${face.id}"]`);
            const kpiData = {};

            inputs.forEach(input => {
                const field = input.getAttribute('data-field');
                kpiData[field] = input.value;
            });

            // Only require kpiName - value defaults to 0 if empty
            if (kpiData.kpiName) {
                kpis.push({
                    faceId: face.id,
                    faceName: face.name,
                    id: `F${face.id}_K1`,
                    name: kpiData.kpiName,
                    value: parseFloat(kpiData.value) || 0, // ✅ Default to 0
                    unit: kpiData.unit || 'number',
                    direction: kpiData.direction || '↑',
                    targetMin: parseFloat(kpiData.targetMin) || 0,
                    targetIdeal: parseFloat(kpiData.targetIdeal) || 100,
                    element: 'Earth' // Default for quick mode
                });
            }
        });
    } else {
        // Collect 60 KPIs (5 per face)
        const elements = ['Earth', 'Water', 'Fire', 'Air', 'Ether'];

        demoState.faceConfig.faces.forEach(face => {
            elements.forEach((element, eIndex) => {
                const inputs = document.querySelectorAll(`[data-face-id="${face.id}"][data-element="${element}"]`);
                const kpiData = {};

                inputs.forEach(input => {
                    const field = input.getAttribute('data-field');
                    kpiData[field] = input.value;
                });

                // Only require kpiName - value defaults to 0 if empty
                if (kpiData.kpiName) {
                    kpis.push({
                        faceId: face.id,
                        faceName: face.name,
                        id: `F${face.id}_K${eIndex + 1}`,
                        name: kpiData.kpiName,
                        value: parseFloat(kpiData.value) || 0, // ✅ Default to 0
                        unit: kpiData.unit || 'number',
                        direction: '↑',
                        targetMin: parseFloat(kpiData.targetMin) || 0,
                        targetIdeal: parseFloat(kpiData.targetIdeal) || 100,
                        element: element
                    });
                }
            });
        });
    }

    return kpis;
}

/**
 * Run coherence calculation
 */
async function runCalculation() {
    showLoading('Calculating coherence...');

    // Simulate calculation delay for UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
        // Build company data structure
        const companyData = {
            name: demoState.faceConfig.templateName,
            kpis: demoState.kpiData
        };

        // Check if Quannex engine is loaded
        if (typeof window.quannexEngine !== 'undefined') {
            // Use real engine
            await window.quannexEngine.initializeWithCompany(companyData);
            demoState.coherenceResults = window.quannexEngine.getState();
        } else {
            // Fallback: Simple calculation
            demoState.coherenceResults = calculateSimpleCoherence(demoState.kpiData);
        }

        // Display results
        displayCalculationResults();

        hideLoading();
    } catch (error) {
        console.error('❌ Calculation failed:', error);
        hideLoading();
        alert('Calculation failed. Please check console for details.');
    }
}

/**
 * Simple coherence calculation (fallback)
 */
function calculateSimpleCoherence(kpis) {
    const faceEnergies = {};

    // Group KPIs by face
    kpis.forEach(kpi => {
        if (!faceEnergies[kpi.faceId]) {
            faceEnergies[kpi.faceId] = {
                id: kpi.faceId,
                name: kpi.faceName,
                kpis: [],
                energy: 0
            };
        }

        // Normalize KPI
        const normalized = (kpi.value - kpi.targetMin) / (kpi.targetIdeal - kpi.targetMin);
        const score = Math.max(0, Math.min(1, normalized));

        faceEnergies[kpi.faceId].kpis.push({
            ...kpi,
            normalizedScore: score
        });
    });

    // Calculate face energies
    Object.values(faceEnergies).forEach(face => {
        const avgScore = face.kpis.reduce((sum, kpi) => sum + kpi.normalizedScore, 0) / face.kpis.length;
        face.energy = avgScore;
    });

    // Calculate global coherence
    const faces = Object.values(faceEnergies);
    const globalCoherence = faces.reduce((sum, face) => sum + face.energy, 0) / faces.length;

    return {
        globalCoherence: globalCoherence,
        coherenceStatus: getCoherenceStatus(globalCoherence),
        faces: faces
    };
}

/**
 * Get coherence status label
 */
function getCoherenceStatus(coherence) {
    if (coherence >= 0.9) return 'Radiant';
    if (coherence >= 0.8) return 'Excellent';
    if (coherence >= 0.7) return 'Healthy';
    if (coherence >= 0.6) return 'Moderate';
    if (coherence >= 0.5) return 'Fair';
    if (coherence >= 0.4) return 'Concerning';
    if (coherence >= 0.3) return 'Critical';
    return 'Crisis';
}

/**
 * Display calculation results
 */
function displayCalculationResults() {
    const resultDiv = document.getElementById('calculationResult');
    const scoreDiv = document.getElementById('coherenceScore');

    const coherence = demoState.coherenceResults.globalCoherence;
    const status = demoState.coherenceResults.coherenceStatus;

    scoreDiv.textContent = `Global Coherence: ${(coherence * 100).toFixed(1)}% (${status})`;
    resultDiv.style.display = 'block';

    // Show calculation breakdown
    displayCalculationTransparency();

    // Identify nervous endpoints
    identifyNervousEndpoints();
}

/**
 * Display calculation transparency
 */
function displayCalculationTransparency() {
    const section = document.getElementById('calculationTransparency');

    let html = '<div style="margin-top: 30px;">';
    html += '<h3 style="font-size: 16px; margin-bottom: 20px; color: rgba(255, 255, 255, 0.8);">Calculation Breakdown</h3>';

    demoState.coherenceResults.faces.forEach(face => {
        const energy = face.energy || face.faceEnergy || 0;
        const percentage = (energy * 100).toFixed(1);
        const color = energy >= 0.7 ? '#00ff88' : energy >= 0.4 ? '#ffcc00' : '#ff6666';

        html += `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 14px; font-weight: 600; color: #fff;">Face ${face.id}: ${face.name}</div>
                        <div style="font-size: 11px; color: rgba(255, 255, 255, 0.6); margin-top: 5px;">
                            ${face.kpis ? face.kpis.length : 0} KPIs analyzed
                        </div>
                    </div>
                    <div style="font-size: 24px; font-weight: 600; color: ${color};">
                        ${percentage}%
                    </div>
                </div>
                <div style="margin-top: 10px; height: 6px; background: rgba(0, 0, 0, 0.3); border-radius: 3px; overflow: hidden;">
                    <div style="width: ${percentage}%; height: 100%; background: ${color}; transition: width 0.5s ease;"></div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    section.innerHTML = html;
}

/**
 * Complete Step 3: Calculation
 */
function completeStep3() {
    markStepCompleted(3);
    goToStep(4);
}

/**
 * Identify nervous endpoints
 */
function identifyNervousEndpoints() {
    const section = document.getElementById('nervousEndpoints');

    // Find faces with energy < 0.5
    const criticalFaces = demoState.coherenceResults.faces
        .filter(face => (face.energy || face.faceEnergy || 0) < 0.5)
        .sort((a, b) => (a.energy || a.faceEnergy) - (b.energy || b.faceEnergy));

    if (criticalFaces.length === 0) {
        section.innerHTML = '<p style="color: rgba(255, 255, 255, 0.6); text-align: center;">✅ No critical issues detected. All faces are healthy!</p>';
        return;
    }

    let html = '<div style="display: grid; gap: 15px;">';

    criticalFaces.forEach(face => {
        const energy = face.energy || face.faceEnergy || 0;
        const percentage = (energy * 100).toFixed(1);

        html += `
            <div style="background: rgba(255, 102, 102, 0.1); border: 1px solid rgba(255, 102, 102, 0.3); border-radius: 8px; padding: 15px;">
                <div style="font-size: 14px; font-weight: 600; color: #ff6666; margin-bottom: 8px;">
                    ⚠️ Face ${face.id}: ${face.name}
                </div>
                <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">
                    Energy: ${percentage}% - Requires immediate attention
                </div>
            </div>
        `;
    });

    html += '</div>';
    section.innerHTML = html;
}

/**
 * Launch visualization view
 */
function launchView(viewName) {
    const viewUrls = {
        'dodecahedron': 'dodecahedron-3d.html',
        'calculations': 'index.html',
        'breath': 'index.html#breath',
        'dna': 'octave-dna.html'
    };

    const url = viewUrls[viewName];
    if (url) {
        window.open(url, '_blank');
        console.log(`🚀 Launched view: ${viewName}`);
    }
}

/**
 * Export report
 */
function exportReport() {
    alert('PDF export feature coming soon!\n\nFor now, you can:\n• Screenshot the visualizations\n• Save the configuration JSON\n• Copy the coherence data');
}

/**
 * Save configuration
 */
function saveConfiguration() {
    const fullConfig = {
        faceConfig: demoState.faceConfig,
        kpiMode: demoState.kpiMode,
        kpiData: demoState.kpiData,
        coherenceResults: demoState.coherenceResults,
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(fullConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `quannex-demo-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);
    console.log('✅ Configuration saved');
}

/**
 * Start over
 */
function startOver() {
    if (confirm('Start a new analysis? This will clear all current data.')) {
        location.reload();
    }
}

/**
 * Show help
 */
function showHelp() {
    window.open('DEMO_GUIDE.md', '_blank');
}

/**
 * Show loading overlay
 */
function showLoading(message = 'Processing...') {
    document.getElementById('loadingText').textContent = message;
    document.getElementById('loadingOverlay').classList.add('active');
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

// Expose to window
window.goToStep = goToStep;
window.completeStep1 = completeStep1;
window.selectMode = selectMode;
window.completeStep2 = completeStep2;
window.completeStep3 = completeStep3;
window.launchView = launchView;
window.exportReport = exportReport;
window.saveConfiguration = saveConfiguration;
window.startOver = startOver;
window.showHelp = showHelp;
window.autofillKPISuggestion = autofillKPISuggestion;
window.autofillElementalKPI = autofillElementalKPI;

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeDemo);

console.log('✅ Demo Orchestrator Logic loaded');
