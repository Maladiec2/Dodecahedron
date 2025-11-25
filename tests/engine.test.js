/**
 * Simple Test Runner
 */
const resultsDiv = document.getElementById('results');

// Capture console errors/warns to UI
const originalError = console.error;
const originalWarn = console.warn;
console.error = function (...args) {
    const div = document.createElement('div');
    div.style.color = 'red';
    div.style.whiteSpace = 'pre-wrap';
    div.style.border = '1px solid red';
    div.style.padding = '5px';
    div.style.margin = '5px 0';
    div.textContent = 'ERROR: ' + args.join(' ');
    resultsDiv.appendChild(div);
    originalError.apply(console, args);
};
console.warn = function (...args) {
    const div = document.createElement('div');
    div.style.color = 'orange';
    div.textContent = 'WARN: ' + args.join(' ');
    resultsDiv.appendChild(div);
    originalWarn.apply(console, args);
};

function assert(condition, message) {
    const div = document.createElement('div');
    div.className = `test-result ${condition ? 'pass' : 'fail'}`;
    div.textContent = `${condition ? '✅ PASS' : '❌ FAIL'}: ${message}`;
    resultsDiv.appendChild(div);
    if (!condition) {
        console.error(`FAIL: ${message}`);
    }
}

async function runTests() {
    console.log('🚀 Starting Tests...');

    try {
        // Test 1: Initialization
        assert(window.quannexEngine, 'Engine instance should exist');

        // Mock loadCSV before initialization
        window.quannexEngine.loadCSV = async function (filename) {
            console.log(`🧪 Test loading CSV: ${filename}`);
            try {
                // Note: In test environment, data is in ../data/
                const response = await fetch(`../data/${filename}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const text = await response.text();

                if (typeof window.parseCSV === 'function') {
                    return window.parseCSV(text);
                } else {
                    console.error('❌ parseCSV is not defined on window');
                    return [];
                }
            } catch (error) {
                console.error(`Failed to load CSV in test: ${error.message}`);
                return [];
            }
        };

        await window.quannexEngine.initialize();
        assert(window.quannexEngine.faces.length === 12, 'Should initialize 12 faces');
        assert(window.quannexEngine.kpis.size > 0, 'Should load KPIs');

        // Test 2: KPI Normalization
        const kpi = new KPI({
            id: 'test_kpi',
            value: 50,
            targetMin: 0,
            targetIdeal: 100,
            direction: '↑'
        });
        assert(kpi.normalizedScore === 0.5, 'KPI Normalization (Up) should be correct');

        // Test 3: Face Energy Calculation
        const face = window.quannexEngine.faces[0];
        assert(face.faceEnergy !== null, 'Face energy should be calculated');
        assert(face.healthStatus, 'Face should have a health status');

        // Test 4: Global Coherence
        const globalCoherence = window.quannexEngine.getGlobalCoherence();
        assert(globalCoherence >= 0 && globalCoherence <= 1, 'Global coherence should be between 0 and 1');

        // Test 5: KPI Update
        const testKpiId = window.quannexEngine.kpis.keys().next().value;
        const originalValue = window.quannexEngine.kpis.get(testKpiId).value;
        const newValue = originalValue + 10;

        window.quannexEngine.updateKPI(testKpiId, newValue);
        assert(window.quannexEngine.kpis.get(testKpiId).value === newValue, 'KPI update should persist');

    } catch (error) {
        assert(false, `Exception during tests: ${error.message}`);
        console.error(error);
    }
}

// Run tests after a short delay to ensure scripts are loaded
setTimeout(runTests, 500);
