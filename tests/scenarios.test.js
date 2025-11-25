/**
 * Scenario Tests for Quannex Engine
 * Verifies "Intelligence" and Diagnostic Capabilities
 */

const resultsDiv = document.getElementById('results');

function assert(condition, message) {
    const div = document.createElement('div');
    div.className = `test-result ${condition ? 'pass' : 'fail'}`;
    div.textContent = `${condition ? '✅ PASS' : '❌ FAIL'}: ${message}`;
    resultsDiv.appendChild(div);
    if (!condition) {
        console.error(`FAIL: ${message}`);
    }
}

async function runScenarioTests() {
    console.log('🚀 Starting Scenario Tests...');

    // Ensure engine is initialized
    if (!window.quannexEngine || window.quannexEngine.faces.length === 0) {
        await window.quannexEngine.initialize();
    }

    try {
        // SCENARIO 1: The "Burnout" Pattern
        // High Action (Projection), Low Being (Reception)
        console.log('🧪 Testing "Burnout" Scenario...');

        // Manually set face energies to simulate burnout
        // Projection Faces (Action): 1, 3, 5, 7, 9, 11 -> High Energy (0.9)
        // Reception Faces (Being): 2, 4, 6, 8, 10, 12 -> Low Energy (0.2)

        const projectionFaces = [1, 3, 5, 7, 9, 11];
        const receptionFaces = [2, 4, 6, 8, 10, 12];

        window.quannexEngine.faces.forEach(face => {
            if (projectionFaces.includes(face.id)) {
                face._faceEnergy = 0.9; // Force high energy
            } else {
                face._faceEnergy = 0.2; // Force low energy
            }
        });

        // Run Analysis
        const breathAnalysis = window.quannexEngine.breathAnalyzer.analyze(window.quannexEngine.faces);

        // Verify Diagnosis
        // BAB Score = Reception / Projection = 0.2 / 0.9 = ~0.22 (22%)
        // Should be "Over-Exhaling" (< 80%)
        const babPercentage = breathAnalysis.overall.babScore.percentage;
        assert(babPercentage < 80, `Burnout: BAB Percentage (${babPercentage.toFixed(1)}%) should be < 80%`);
        assert(breathAnalysis.overall.babScore.interpretation.includes('Over-Exhaling'), 'Burnout: Should detect "Over-Exhaling"');


        // SCENARIO 2: The "Stagnation" Pattern
        // Low Action, High Being
        console.log('🧪 Testing "Stagnation" Scenario...');

        window.quannexEngine.faces.forEach(face => {
            if (projectionFaces.includes(face.id)) {
                face._faceEnergy = 0.2; // Low Action
            } else {
                face._faceEnergy = 0.9; // High Being
            }
        });

        const stagnationAnalysis = window.quannexEngine.breathAnalyzer.analyze(window.quannexEngine.faces);

        // BAB Score = 0.9 / 0.2 = 4.5 (450%)
        // Should be "Over-Inhaling" (> 120%)
        const stagBab = stagnationAnalysis.overall.babScore.percentage;
        assert(stagBab > 120, `Stagnation: BAB Percentage (${stagBab.toFixed(1)}%) should be > 120%`);
        assert(stagnationAnalysis.overall.babScore.interpretation.includes('Over-Inhaling'), 'Stagnation: Should detect "Over-Inhaling"');

    } catch (error) {
        assert(false, `Exception during scenario tests: ${error.message}`);
        console.error(error);
    }
}

// Run after a delay
setTimeout(runScenarioTests, 1000);
