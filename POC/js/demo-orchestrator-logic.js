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
 * Generate Quick Mode HTML (12 KPIs) - ENHANCED with better layout
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

                <!-- Main KPI input row -->
                <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; margin-bottom: 12px;">
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
                            oninput="this.setAttribute('data-current-value', this.value)"
                        />
                        <datalist id="${datalistId}">
                            ${suggestions.map(s => `<option value="${s.name}" data-unit="${s.unit}" data-min="${s.targetMin}" data-ideal="${s.targetIdeal}">${s.description}</option>`).join('')}
                        </datalist>
                    </div>
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Current Value
                        </label>
                        <input
                            type="number"
                            class="face-input"
                            placeholder="0"
                            data-face-id="${face.id}"
                            data-field="value"
                            step="any"
                            oninput="calculateLiveNormalization(${face.id})"
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
                </div>

                <!-- Target ranges row -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Target Min
                        </label>
                        <input
                            type="number"
                            class="face-input"
                            placeholder="0"
                            data-face-id="${face.id}"
                            data-field="targetMin"
                            step="any"
                            oninput="calculateLiveNormalization(${face.id})"
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
                            oninput="calculateLiveNormalization(${face.id})"
                        />
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
                            onchange="calculateLiveNormalization(${face.id})"
                        >
                            <option value="↑">↑ Higher</option>
                            <option value="↓">↓ Lower</option>
                            <option value="Band">⊟ Sweet spot</option>
                        </select>
                    </div>
                </div>

                <!-- Live normalization preview -->
                <div id="normalization-preview-${face.id}" style="margin-top: 12px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 6px; font-size: 11px; color: rgba(255, 255, 255, 0.7); display: none;">
                    <span style="color: rgba(0, 255, 204, 0.8);">→ Normalized:</span>
                    <span id="norm-value-${face.id}" style="font-weight: 600; color: #00ffcc;">--</span>
                    <span style="opacity: 0.6;">(This value goes to calculation)</span>
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
    const kpiName = inputElement.value.trim();
    const datalistOptions = inputElement.list?.options;

    console.log(`🔧 Autofill triggered for Face ${faceId}, KPI name: "${kpiName}"`);

    if (!kpiName) {
        console.log(`   ⚠️ No KPI name entered`);
        return;
    }

    if (!datalistOptions) {
        console.log(`   ⚠️ No datalist options found`);
        return;
    }

    // Ensure the input value is set (sometimes datalist doesn't persist)
    inputElement.value = kpiName;
    inputElement.setAttribute('value', kpiName);

    // Find matching option
    let matched = false;
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

            matched = true;
            console.log(`✅ Autofilled KPI: ${kpiName}`);
            break;
        }
    }

    if (!matched) {
        console.log(`   ℹ️ No matching suggestion found (custom KPI: "${kpiName}")`);
    }

    // Trigger live normalization after autofill
    setTimeout(() => calculateLiveNormalization(faceId), 100);
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
 * Calculate live normalization for a KPI (Quick Mode)
 */
function calculateLiveNormalization(faceId) {
    // Get all inputs for this face
    const inputs = document.querySelectorAll(`[data-face-id="${faceId}"]`);
    const kpiData = {};

    inputs.forEach(input => {
        const field = input.getAttribute('data-field');
        kpiData[field] = input.value;
    });

    // Get values
    const value = parseFloat(kpiData.value);
    const targetMin = parseFloat(kpiData.targetMin);
    const targetIdeal = parseFloat(kpiData.targetIdeal);
    const direction = kpiData.direction || '↑';

    // Show/hide preview
    const previewDiv = document.getElementById(`normalization-preview-${faceId}`);
    const normValueSpan = document.getElementById(`norm-value-${faceId}`);

    // Only show if we have all required values
    if (isNaN(value) || isNaN(targetMin) || isNaN(targetIdeal)) {
        previewDiv.style.display = 'none';
        return;
    }

    // Calculate normalized score based on direction
    let normalized = 0;

    if (direction === '↑') {
        // Higher is better
        normalized = (value - targetMin) / (targetIdeal - targetMin);
    } else if (direction === '↓') {
        // Lower is better
        normalized = (targetMin - value) / (targetMin - targetIdeal);
    } else if (direction === 'Band') {
        // Sweet spot (band target)
        const midpoint = (targetMin + targetIdeal) / 2;
        const range = Math.abs(targetIdeal - targetMin) / 2;
        const distance = Math.abs(value - midpoint);
        normalized = Math.max(0, 1 - (distance / range));
    }

    // Clamp between 0 and 1
    normalized = Math.max(0, Math.min(1, normalized));

    // Display
    const percentage = (normalized * 100).toFixed(1);
    normValueSpan.textContent = `${percentage}%`;

    // Color code
    if (normalized >= 0.7) {
        normValueSpan.style.color = '#00ff88';
    } else if (normalized >= 0.4) {
        normValueSpan.style.color = '#ffcc00';
    } else {
        normValueSpan.style.color = '#ff6666';
    }

    previewDiv.style.display = 'block';
}

/**
 * Collect KPI data from form - ENHANCED with units and default to 0 for empty values
 */
function collectKPIData() {
    const kpis = [];

    console.log('📊 Collecting KPI data...');
    console.log('   Mode:', demoState.kpiMode);
    console.log('   Faces:', demoState.faceConfig.faces.length);

    if (demoState.kpiMode === 'quick') {
        // Collect 12 KPIs (one per face)
        demoState.faceConfig.faces.forEach(face => {
            const inputs = document.querySelectorAll(`[data-face-id="${face.id}"]`);
            const kpiData = {};

            inputs.forEach(input => {
                const field = input.getAttribute('data-field');
                // Check both value and data-current-value (in case of datalist issues)
                const currentValue = input.getAttribute('data-current-value') || input.value;
                kpiData[field] = field === 'kpiName' ? currentValue.trim() : input.value;

                // Debug: Show what we're capturing
                if (field === 'kpiName') {
                    console.log(`      🔍 Input value: "${input.value}", data-current-value: "${input.getAttribute('data-current-value')}"`);
                }
            });

            console.log(`   Face ${face.id} (${face.name}):`, kpiData);

            // Only require kpiName - value defaults to 0 if empty
            if (kpiData.kpiName && kpiData.kpiName.length > 0) {
                const kpiEntry = {
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
                };
                kpis.push(kpiEntry);
                console.log(`      ✅ Added KPI:`, kpiEntry);
            } else {
                console.log(`      ⚠️ Skipped (no KPI name entered for this face)`);
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
                    const kpiEntry = {
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
                    };
                    kpis.push(kpiEntry);
                    console.log(`      ✅ Added ${element} KPI:`, kpiEntry);
                }
            });
        });
    }

    console.log(`📊 Total KPIs collected: ${kpis.length}`);
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
        console.log('🔬 Running calculation...');

        // ========================================
        // 🔄 TRANSFORMATION LAYER
        // ========================================
        // Transform UI data to Engine format using DataTransformer
        let companyData;

        if (typeof window.DataTransformer !== 'undefined') {
            console.log('   🔄 Using Data Transformation Layer');

            // Prepare data for transformation
            const demoData = {
                faceConfig: demoState.faceConfig,
                kpiMode: demoState.kpiMode,
                kpiData: demoState.kpiData
            };

            // Validate before transforming
            const validation = window.DataTransformer.validate(demoData);
            console.log('   📋 Validation:', validation);

            if (!validation.valid) {
                throw new Error(`Data validation failed: ${validation.errors.join(', ')}`);
            }

            if (validation.warnings.length > 0) {
                console.warn('   ⚠️ Warnings:', validation.warnings);
            }

            // Transform to engine format
            companyData = window.DataTransformer.transform(demoData);
            console.log('   ✅ Data transformed successfully');
        } else {
            console.warn('   ⚠️ DataTransformer not loaded - using raw format');

            // Fallback: Use raw format (may cause issues)
            companyData = {
                name: demoState.faceConfig.templateName,
                kpis: demoState.kpiData
            };
        }

        console.log('   Company name:', companyData.name);
        console.log('   KPIs count:', companyData.kpis.length);
        console.log('   Sample KPI:', companyData.kpis[0]);

        // ========================================
        // 🧮 CALCULATION ENGINE
        // ========================================
        // Check if Quannex engine is loaded
        if (typeof window.quannexEngine !== 'undefined') {
            console.log('   ✅ Using Quannex Engine');

            // Use real engine
            await window.quannexEngine.initializeWithCompany(companyData);
            const engineState = window.quannexEngine.getState();

            console.log('   ✅ Engine calculation complete');

            // Transform results back to UI format
            if (typeof window.DataTransformer !== 'undefined') {
                demoState.coherenceResults = window.DataTransformer.transformResults(engineState);
            } else {
                demoState.coherenceResults = engineState;
            }

            console.log('   ✅ Results ready for display:', demoState.coherenceResults);
        } else {
            console.log('   ⚠️ Quannex Engine not loaded - using fallback calculation');

            // Fallback: Simple calculation (works with UI format)
            demoState.coherenceResults = calculateSimpleCoherence(demoState.kpiData);

            console.log('   ✅ Fallback calculation completed:', demoState.coherenceResults);
        }

        // Display results
        displayCalculationResults();

        hideLoading();
    } catch (error) {
        console.error('❌ Calculation failed:', error);
        console.error('   Error details:', error.message);
        console.error('   Stack:', error.stack);
        hideLoading();
        alert(`Calculation failed: ${error.message}\n\nPlease check console for details.`);
    }
}

/**
 * Simple coherence calculation (fallback)
 */
function calculateSimpleCoherence(kpis) {
    console.log('🧮 Starting simple coherence calculation...');
    console.log('   Input KPIs:', kpis.length);

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

        // Normalize KPI based on direction
        let normalized = 0;

        if (kpi.direction === '↑') {
            // Higher is better
            normalized = (kpi.value - kpi.targetMin) / (kpi.targetIdeal - kpi.targetMin);
        } else if (kpi.direction === '↓') {
            // Lower is better
            normalized = (kpi.targetMin - kpi.value) / (kpi.targetMin - kpi.targetIdeal);
        } else if (kpi.direction === 'Band') {
            // Sweet spot (band target)
            const midpoint = (kpi.targetMin + kpi.targetIdeal) / 2;
            const range = Math.abs(kpi.targetIdeal - kpi.targetMin) / 2;
            const distance = Math.abs(kpi.value - midpoint);
            normalized = Math.max(0, 1 - (distance / range));
        }

        const score = Math.max(0, Math.min(1, normalized));

        console.log(`   KPI: ${kpi.name} = ${kpi.value} → ${(score * 100).toFixed(1)}%`);

        faceEnergies[kpi.faceId].kpis.push({
            ...kpi,
            normalizedScore: score
        });
    });

    // Calculate face energies
    Object.values(faceEnergies).forEach(face => {
        if (face.kpis.length > 0) {
            const avgScore = face.kpis.reduce((sum, kpi) => sum + kpi.normalizedScore, 0) / face.kpis.length;
            face.energy = avgScore;
            console.log(`   Face ${face.id} (${face.name}): ${face.kpis.length} KPIs → ${(face.energy * 100).toFixed(1)}%`);
        } else {
            face.energy = 0;
            console.log(`   Face ${face.id} (${face.name}): No KPIs → 0%`);
        }
    });

    // Calculate global coherence
    const faces = Object.values(faceEnergies);
    const globalCoherence = faces.length > 0
        ? faces.reduce((sum, face) => sum + face.energy, 0) / faces.length
        : 0;

    console.log(`🧮 Calculation complete:`);
    console.log(`   Global Coherence: ${(globalCoherence * 100).toFixed(1)}%`);
    console.log(`   Status: ${getCoherenceStatus(globalCoherence)}`);

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

    // 🔧 FIX: Update sessionStorage immediately after calculation
    // This allows users to recalculate and see updates in already-open 3D views
    updateSessionStorage();
}

/**
 * Update sessionStorage with latest data
 */
function updateSessionStorage() {
    if (demoState.kpiData && demoState.kpiData.length > 0) {
        const customCompanyData = {
            id: 'custom',
            name: 'Custom Analysis',
            description: 'User-generated data from Orchestrator',
            kpis: demoState.kpiData,
            faceConfig: demoState.faceConfig,
            coherenceResults: demoState.coherenceResults,
            isCustomData: true,
            timestamp: new Date().toISOString() // Fresh timestamp on each update
        };

        sessionStorage.setItem('customCompanyData', JSON.stringify(customCompanyData));
        sessionStorage.setItem('selectedCompanyId', 'custom');
        console.log('💾 Updated sessionStorage with latest data (timestamp:', customCompanyData.timestamp, ')');
    }
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
 * Launch visualization view with custom data
 */
function launchView(viewName) {
    const viewUrls = {
        'dodecahedron': 'dodecahedron-3d.html',
        'calculations': 'calculations.html',
        'breath': 'breath-analysis.html',
        'dna': 'octave-dna.html',
        'simulator': 'simulator.html'
    };

    // 🔧 Always update sessionStorage before launching (ensure fresh data)
    updateSessionStorage();

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
window.calculateLiveNormalization = calculateLiveNormalization;

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeDemo);

console.log('✅ Demo Orchestrator Logic loaded');
