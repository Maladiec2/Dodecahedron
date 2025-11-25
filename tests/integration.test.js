
import { DodecahedronEngine } from '../js/main.js';

// Mock window.parseCSV if not present (it should be from main.js but just in case)
if (!window.parseCSV) {
    window.parseCSV = (csv) => {
        // Simple mock parser
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        return lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, i) => {
                obj[header.trim()] = values[i] ? values[i].trim() : '';
                return obj;
            }, {});
        });
    };
}

export default async function runIntegrationTests() {
    console.log('🔗 Running Integration Tests...');
    const results = [];

    const assert = (condition, message) => {
        if (condition) {
            console.log(`✅ ${message}`);
            results.push({ passed: true, message });
        } else {
            console.error(`❌ ${message}`);
            results.push({ passed: false, message });
        }
    };

    // 1. Initialize Engine
    const engine = new DodecahedronEngine();

    // Mock loadCSV to return dummy data
    engine.loadCSV = async (filename) => {
        if (filename.includes('Edge')) {
            return [
                { Edge_ID: 'E1', Face_A_ID: '1', Face_B_ID: '2', 'Edge Archytype': 'Test Edge' }
            ];
        }
        if (filename.includes('Vortex')) {
            return [
                { Vertex_ID: 'V1', Face_1_ID: '1', Face_2_ID: '2', Face_3_ID: '3', Name: 'Test Vertex' }
            ];
        }
        return [];
    };

    await engine.initialize();

    // 2. Check getState() structure
    const state = engine.getState();

    // Check Edges
    if (state.edges.length > 0) {
        const edge = state.edges[0];
        assert(edge.faceAId !== undefined, 'Edge should have faceAId');
        assert(edge.faceBId !== undefined, 'Edge should have faceBId');
        assert(edge.breathRatio !== undefined, 'Edge should have breathRatio');
        assert(edge.flowDirection !== undefined, 'Edge should have flowDirection');
        assert(edge.element !== undefined, 'Edge should have element');
    } else {
        assert(false, 'No edges found in state');
    }

    // Check Vertices
    if (state.vertices.length > 0) {
        const vertex = state.vertices[0];
        assert(vertex.faceIds !== undefined, 'Vertex should have faceIds');
        assert(vertex.vortexDirection !== undefined, 'Vertex should have vortexDirection');
        assert(vertex.coherence !== undefined, 'Vertex should have coherence');
        assert(vertex.isLeveragePoint !== undefined, 'Vertex should have isLeveragePoint');
    } else {
        assert(false, 'No vertices found in state');
    }

    return results;
}

// Expose to window for test runner
window.runIntegrationTests = runIntegrationTests;
