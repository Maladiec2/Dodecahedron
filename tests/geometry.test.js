/**
 * Geometry Tests for Quannex Engine
 * Verifies Edge and Vertex Logic
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

async function runGeometryTests() {
    console.log('🚀 Starting Geometry Tests...');

    try {
        // Ensure engine is initialized
        if (!window.quannexEngine || window.quannexEngine.faces.length === 0) {
            await window.quannexEngine.initialize();
        }

        // Test 1: Edge Loading
        assert(window.quannexEngine.edges.length > 0, `Should load edges (Found: ${window.quannexEngine.edges.length})`);

        // Test 2: Vertex Loading
        assert(window.quannexEngine.vertices.length > 0, `Should load vertices (Found: ${window.quannexEngine.vertices.length})`);

        // Test 3: Edge Tension Calculation
        // Pick an edge and two faces
        const edge = window.quannexEngine.edges[0];
        const faceA = window.quannexEngine.faces.find(f => f.id === edge.faceAId);
        const faceB = window.quannexEngine.faces.find(f => f.id === edge.faceBId);

        if (faceA && faceB) {
            // Case A: High Synergy (Both High)
            faceA._faceEnergy = 0.8;
            faceB._faceEnergy = 0.8;
            edge.calculateTension(faceA, faceB);
            assert(edge.tension === 0.9, 'Edge Tension: Should be 0.9 for High Synergy');
            assert(edge.status === 'Synergetic', 'Edge Status: Should be Synergetic');

            // Case B: Depleted (Both Low)
            faceA._faceEnergy = 0.2;
            faceB._faceEnergy = 0.2;
            edge.calculateTension(faceA, faceB);
            assert(edge.tension === 0.2, 'Edge Tension: Should be 0.2 for Depletion');
            assert(edge.status === 'Depleted', 'Edge Status: Should be Depleted');

            // Case C: Dynamic Tension (High Delta)
            faceA._faceEnergy = 0.9;
            faceB._faceEnergy = 0.1;
            edge.calculateTension(faceA, faceB);
            // Delta = 0.8. Tension = 0.5 + 0.4 = 0.9
            assert(edge.tension === 0.9, `Edge Tension: Should be 0.9 for Dynamic Tension (Got ${edge.tension})`);
            assert(edge.status === 'Flowing', 'Edge Status: Should be Flowing');
        } else {
            assert(false, 'Could not find faces for Edge Test');
        }

        // Test 4: Vertex Energy Calculation
        const vertex = window.quannexEngine.vertices[0];
        const faces = vertex.faceIds.map(id => window.quannexEngine.faces.find(f => f.id === id));

        if (faces.length === 3 && faces.every(f => f)) {
            // Case A: Balanced High
            faces[0]._faceEnergy = 0.8;
            faces[1]._faceEnergy = 0.8;
            faces[2]._faceEnergy = 0.8;
            vertex.calculateVortexEnergy(faces);
            // Avg = 0.8, Min = 0.8. Result = 0.8 * sqrt(1) = 0.8
            assert(Math.abs(vertex.vortexEnergy - 0.8) < 0.01, 'Vertex Energy: Should be 0.8 for Balanced High');
            assert(vertex.status === 'Active Flow' || vertex.status === 'Radiant Vortex', 'Vertex Status: Should be Active/Radiant');

            // Case B: One Dead Face (Collapse)
            faces[0]._faceEnergy = 0.8;
            faces[1]._faceEnergy = 0.8;
            faces[2]._faceEnergy = 0.0; // Dead
            vertex.calculateVortexEnergy(faces);
            // Avg = 0.53, Min = 0. Result = 0.53 * sqrt(0) = 0
            assert(vertex.vortexEnergy === 0, 'Vertex Energy: Should collapse to 0 if one face is dead');
        } else {
            assert(false, 'Could not find faces for Vertex Test');
        }

    } catch (error) {
        assert(false, `Exception during geometry tests: ${error.message}`);
        console.error(error);
    }
}

// Run after a delay
setTimeout(runGeometryTests, 1500);
