/**
 * EdgeAnalyzer - Browser-Compatible Edition with CSV Integration
 *
 * Analyzes the 30 edges (connections) of the dodecahedron
 *
 * Each edge represents the relationship and flow between two organizational domains (Faces).
 * Edges carry tension (energy difference), breath ratio (flow direction), and elemental nature.
 *
 * USAGE:
 * const analyzer = new EdgeAnalyzer();
 * await analyzer.loadEdgeCSV('./data/CSV_Edge_tension_Map.csv');
 * const edges = analyzer.calculateAllEdges(facesData);
 * const tensionMap = analyzer.getTensionMap(edges);
 *
 * @author Deimantas Butrimas & Claude
 * @version 3.0 (CSV-Integrated Edition)
 */

export class EdgeAnalyzer {
  constructor() {
    this.csvData = null; // Will hold loaded CSV edge data
    // Define the 30 edges of a dodecahedron
    // Each edge connects two faces (pentagon faces)
    this.edgeDefinitions = [
      // Face 1 connections (5 edges) - CORRECTED TO MATCH GEOMETRIC TOPOLOGY
      { id: 'E1-2', face1: 1, face2: 2, element: 'Water' },
      { id: 'E1-6', face1: 1, face2: 6, element: 'Earth' },
      { id: 'E1-7', face1: 1, face2: 7, element: 'Air' },
      { id: 'E1-8', face1: 1, face2: 8, element: 'Air' },
      { id: 'E1-10', face1: 1, face2: 10, element: 'Ether' },

      // Face 2 connections (4 more - 1 already counted)
      { id: 'E2-3', face1: 2, face2: 3, element: 'Earth' },
      { id: 'E2-6', face1: 2, face2: 6, element: 'Air' },
      { id: 'E2-10', face1: 2, face2: 10, element: 'Ether' },
      { id: 'E2-11', face1: 2, face2: 11, element: 'Ether' },

      // Face 3 connections (4 more)
      { id: 'E3-4', face1: 3, face2: 4, element: 'Fire' },
      { id: 'E3-6', face1: 3, face2: 6, element: 'Ether' },
      { id: 'E3-9', face1: 3, face2: 9, element: 'Ether' },
      { id: 'E3-11', face1: 3, face2: 11, element: 'Water' },

      // Face 4 connections (4 more)
      { id: 'E4-5', face1: 4, face2: 5, element: 'Air' },
      { id: 'E4-6', face1: 4, face2: 6, element: 'Water' },
      { id: 'E4-7', face1: 4, face2: 7, element: 'Ether' },
      { id: 'E4-9', face1: 4, face2: 9, element: 'Fire' },

      // Face 5 connections (4 more)
      { id: 'E5-7', face1: 5, face2: 7, element: 'Water' },
      { id: 'E5-8', face1: 5, face2: 8, element: 'Ether' },
      { id: 'E5-9', face1: 5, face2: 9, element: 'Water' },
      { id: 'E5-12', face1: 5, face2: 12, element: 'Water' },

      // Face 6 connections (1 more)
      { id: 'E6-7', face1: 6, face2: 7, element: 'Air' },

      // Face 7 connections (1 more)
      { id: 'E7-8', face1: 7, face2: 8, element: 'Air' },

      // Face 8 connections (2 more)
      { id: 'E8-10', face1: 8, face2: 10, element: 'Water' },
      { id: 'E8-12', face1: 8, face2: 12, element: 'Fire' },

      // Face 9 connections (2 more)
      { id: 'E9-11', face1: 9, face2: 11, element: 'Earth' },
      { id: 'E9-12', face1: 9, face2: 12, element: 'Ether' },

      // Face 10 connections (2 more)
      { id: 'E10-11', face1: 10, face2: 11, element: 'Fire' },
      { id: 'E10-12', face1: 10, face2: 12, element: 'Water' },

      // Face 11 connections (1 more)
      { id: 'E11-12', face1: 11, face2: 12, element: 'Air' },

      // Face 12 connections (0 more - all counted)
    ];

    // Elemental multipliers (affect how tension manifests)
    this.elementalMultipliers = {
      'Fire': 1.3,    // Fire amplifies tension and flow
      'Water': 0.9,   // Water smooths and dampens
      'Earth': 0.8,   // Earth stabilizes and grounds
      'Air': 1.1,     // Air accelerates flow
      'Ether': 1.0    // Ether is neutral/balanced
    };
  }

  /**
   * Calculate tension for a single edge
   *
   * Tension is based on:
   * 1. Energy difference between faces (60%)
   * 2. Edge KPI health if available (40%)
   * 3. Modulated by elemental nature
   *
   * @param {Object} face1 - First face object with faceEnergy property
   * @param {Object} face2 - Second face object with faceEnergy property
   * @param {string} element - Elemental nature of this edge
   * @param {Object} edgeKPI - Optional edge KPI (if it exists)
   * @returns {number} Tension value between 0 (harmonious) and 1 (highly tense)
   */
  calculateTension(face1, face2, element, edgeKPI = null) {
    // Energy difference between the two faces
    const energyDifference = Math.abs(face1.faceEnergy - face2.faceEnergy);

    // Edge KPI health (inverted - low health = high tension)
    const edgeHealth = edgeKPI && edgeKPI.normalizedScore !== undefined
      ? edgeKPI.normalizedScore
      : 0.5;
    const edgeTension = 1.0 - edgeHealth;

    // Combined tension: weighted average
    // 60% from energy difference, 40% from edge KPI health
    const baseTension = (0.6 * energyDifference) + (0.4 * edgeTension);

    // Apply elemental multiplier
    const multiplier = this.elementalMultipliers[element] || 1.0;
    const modulatedTension = baseTension * multiplier;

    return Math.min(1.0, Math.max(0.0, modulatedTension));
  }

  /**
   * Calculate breath ratio (flow direction) across an edge
   *
   * Positive = expansion (flow from face1 to face2)
   * Negative = contraction (flow from face2 to face1)
   *
   * @param {Object} face1
   * @param {Object} face2
   * @returns {number} Breath ratio between -1 and +1
   */
  calculateBreathRatio(face1, face2) {
    const energyDelta = face2.faceEnergy - face1.faceEnergy;

    // Normalize to -1 to +1 range
    // Larger energy difference = stronger breath
    return Math.max(-1.0, Math.min(1.0, energyDelta * 2));
  }

  /**
   * Get flow direction category
   */
  getFlowDirection(breathRatio) {
    if (Math.abs(breathRatio) < 0.1) return 'balanced';
    return breathRatio > 0 ? 'expansion' : 'contraction';
  }

  /**
   * Get health status based on tension
   */
  getHealthStatus(tension) {
    if (tension <= 0.2) return 'Flowing';
    if (tension <= 0.4) return 'Stable';
    if (tension <= 0.6) return 'Stressed';
    if (tension <= 0.8) return 'Strained';
    return 'Breaking';
  }

  /**
   * Get color based on tension level (green → yellow → red)
   */
  getTensionColor(tension) {
    if (tension <= 0.3) {
      // Green zone (low tension - good!)
      const t = tension / 0.3;
      return this.interpolateColor('#00ff00', '#66ff00', t);
    } else if (tension <= 0.6) {
      // Yellow zone (medium tension)
      const t = (tension - 0.3) / 0.3;
      return this.interpolateColor('#66ff00', '#ffaa00', t);
    } else {
      // Red zone (high tension - bad!)
      const t = (tension - 0.6) / 0.4;
      return this.interpolateColor('#ffaa00', '#ff0000', t);
    }
  }

  /**
   * Interpolate between two hex colors
   */
  interpolateColor(color1, color2, t) {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);

    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Calculate all 30 edges for the dodecahedron
   * Merges CSV data (if loaded) with live calculations
   *
   * @param {Array<Object>} faces - Array of 12 face objects
   * @param {Map<string, Object>} edgeKPIs - Optional map of edge KPIs
   * @param {Array<Object>} backendEdges - Optional array of edges from Quannex.getState()
   * @returns {Array<Object>} Array of edge analyses with full CSV metadata
   */
  calculateAllEdges(faces, edgeKPIs = null, backendEdges = null) {
    const edgeAnalyses = [];

    // Create a map for faster lookup if backend edges are provided
    const backendMap = new Map();
    if (backendEdges) {
      backendEdges.forEach(e => backendMap.set(e.id, e));
    }

    this.edgeDefinitions.forEach(edgeDef => {
      const face1 = faces.find(f => f.id === edgeDef.face1);
      const face2 = faces.find(f => f.id === edgeDef.face2);

      if (!face1 || !face2) {
        console.warn(`Missing face data for edge ${edgeDef.id}`);
        return;
      }

      // Get CSV data for this edge (if available)
      const csvData = this.getCSVData(edgeDef.id);

      // Use CSV element if available, otherwise fallback to hardcoded
      const element = csvData ? csvData.element : edgeDef.element;

      const edgeKPI = edgeKPIs ? edgeKPIs.get(edgeDef.id) : null;

      // Check for backend data
      const backendEdge = backendMap.get(edgeDef.id);

      let tension, breathRatio, flowDirection, healthStatus, color;

      if (backendEdge) {
        // Use backend physics (Single Source of Truth)
        tension = backendEdge.tension;
        breathRatio = backendEdge.breathRatio;
        flowDirection = backendEdge.flowDirection;
        // Re-derive presentation values from the authoritative physics
        healthStatus = this.getHealthStatus(tension);
        color = this.getTensionColor(tension);
      } else {
        // Fallback to local calculation
        tension = this.calculateTension(face1, face2, element, edgeKPI);
        breathRatio = this.calculateBreathRatio(face1, face2);
        flowDirection = this.getFlowDirection(breathRatio);
        healthStatus = this.getHealthStatus(tension);
        color = this.getTensionColor(tension);
      }

      // Build comprehensive edge object with CSV data merged in
      const edgeData = {
        // Core identification
        id: edgeDef.id,
        face1Id: edgeDef.face1,
        face2Id: edgeDef.face2,
        face1Name: face1.name || `Face ${edgeDef.face1}`,
        face2Name: face2.name || `Face ${edgeDef.face2}`,

        // Calculated properties
        element: element,
        tension: tension,
        breathRatio: breathRatio,
        flowDirection: flowDirection,
        healthStatus: healthStatus,
        color: color,
        face1Energy: face1.faceEnergy,
        face2Energy: face2.faceEnergy,
        elementalMultiplier: this.elementalMultipliers[element],

        // CSV metadata (if available)
        archetype: csvData ? csvData.archetype : null,
        kpiName: csvData ? csvData.kpiName : null,
        kpiCoherence: csvData ? csvData.kpiCoherence : 0.5,
        kpiMetric: csvData ? csvData.kpiMetric : null,
        kpiCalculation: csvData ? csvData.kpiCalculation : null,
        kpiValue: csvData ? csvData.kpiValue : 0,
        question: csvData ? csvData.question : null,
        csvTension: csvData ? csvData.csvTension : null,
        csvBreathRatio: csvData ? csvData.csvBreathRatio : null,
        hasCSVData: csvData !== null,

        // Flag source
        source: backendEdge ? 'backend' : 'frontend'
      };

      edgeAnalyses.push(edgeData);
    });

    return edgeAnalyses;
  }

  /**
   * Get tension statistics
   */
  getTensionStats(edges) {
    const tensions = edges.map(e => e.tension);
    const avgTension = tensions.reduce((sum, t) => sum + t, 0) / tensions.length;
    const maxTension = Math.max(...tensions);
    const minTension = Math.min(...tensions);

    const highTension = edges.filter(e => e.tension > 0.6).length;
    const mediumTension = edges.filter(e => e.tension > 0.3 && e.tension <= 0.6).length;
    const lowTension = edges.filter(e => e.tension <= 0.3).length;

    return {
      average: avgTension,
      max: maxTension,
      min: minTension,
      highCount: highTension,
      mediumCount: mediumTension,
      lowCount: lowTension,
      systemHealth: 1.0 - avgTension
    };
  }

  /**
   * Get the most critical edges (highest tension)
   */
  getCriticalEdges(edges, topN = 5) {
    return [...edges]
      .sort((a, b) => b.tension - a.tension)
      .slice(0, topN);
  }

  /**
   * Get breath flow patterns
   */
  getBreathFlowPatterns(edges) {
    const expanding = edges.filter(e => e.flowDirection === 'expansion').length;
    const contracting = edges.filter(e => e.flowDirection === 'contraction').length;
    const balanced = edges.filter(e => e.flowDirection === 'balanced').length;

    let dominantFlow;
    if (expanding > contracting + 5) {
      dominantFlow = 'System-wide expansion';
    } else if (contracting > expanding + 5) {
      dominantFlow = 'System-wide contraction';
    } else {
      dominantFlow = 'Mixed flow patterns';
    }

    return {
      expanding: expanding,
      contracting: contracting,
      balanced: balanced,
      total: edges.length,
      dominantFlow: dominantFlow
    };
  }

  /**
   * Get elemental analysis
   */
  getElementalAnalysis(edges) {
    const elements = ['Fire', 'Water', 'Earth', 'Air', 'Ether'];
    const analysis = {};

    elements.forEach(element => {
      const elementEdges = edges.filter(e => e.element === element);
      const avgTension = elementEdges.reduce((sum, e) => sum + e.tension, 0) / elementEdges.length;

      analysis[element] = {
        count: elementEdges.length,
        averageTension: avgTension,
        health: 1.0 - avgTension
      };
    });

    return analysis;
  }

  /**
   * Load edge tension data from CSV file
   *
   * @param {string} csvPath - Path to CSV_Edge_tension_Map.csv
   * @returns {Promise<Object>} Map of edge ID to CSV data
   */
  async loadEdgeCSV(csvPath = './data/CSV_Edge_tension_Map.csv') {
    try {
      const response = await fetch(csvPath);
      if (!response.ok) {
        throw new Error(`Failed to load CSV: ${response.statusText}`);
      }

      const csvText = await response.text();
      this.csvData = this.parseEdgeCSV(csvText);

      console.log(`✅ Loaded ${Object.keys(this.csvData).length} edges from CSV`);
      return this.csvData;
    } catch (error) {
      console.error('❌ Error loading edge CSV:', error);
      this.csvData = null;
      return null;
    }
  }

  /**
   * Parse CSV text into structured edge data
   *
   * @param {string} csvText - Raw CSV file content
   * @returns {Object} Map of edge ID to edge data object
   */
  parseEdgeCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    const edgeMap = {};

    // Process data rows (skip header and any empty rows at end)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      // Skip empty lines or footer notes
      if (!line.trim() || line.startsWith('edge tension to be') || line.startsWith('"What are')) {
        continue;
      }

      // Parse CSV line (handle quoted fields with commas)
      const values = this.parseCSVLine(line);

      if (values.length < 15 || !values[0]) {
        continue; // Skip incomplete rows
      }

      const edgeId = values[0].trim();

      edgeMap[edgeId] = {
        edgeId: edgeId,
        face1Id: this.parseFaceId(values[1]),
        face2Id: this.parseFaceId(values[2]),
        archetype: values[3] ? values[3].trim() : null,
        face1Energy: parseFloat(values[4]) || 0,
        face2Energy: parseFloat(values[5]) || 0,
        csvTension: parseFloat(values[6]) || 0,
        csvBreathRatio: parseFloat(values[7]) || 1.0,
        kpiCoherence: parseFloat(values[8]) || 0.5,
        kpiName: values[9] ? values[9].trim() : null,
        kpiMetric: values[10] ? values[10].trim() : null,
        kpiCalculation: values[11] ? values[11].trim() : null,
        kpiValue: parseFloat(values[12]) || 0,
        element: this.parseElement(values[13]),
        question: values[14] ? values[14].trim() : null
      };
    }

    return edgeMap;
  }

  /**
   * Parse a CSV line handling quoted fields with commas
   */
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current); // Add last field
    return result;
  }

  /**
   * Parse face ID from "Face X" format
   */
  parseFaceId(faceStr) {
    if (!faceStr) return null;
    const match = faceStr.match(/Face (\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  /**
   * Parse element from "Element (Description)" format
   * e.g., "Air (Communication)" -> "Air"
   */
  parseElement(elementStr) {
    if (!elementStr) return 'Ether';
    const match = elementStr.match(/^(\w+)/);
    return match ? match[1].trim() : 'Ether';
  }

  /**
   * Get CSV data for a specific edge
   */
  getCSVData(edgeId) {
    return this.csvData ? this.csvData[edgeId] : null;
  }

  /**
   * Check if CSV data is loaded
   */
  hasCSVData() {
    return this.csvData !== null && Object.keys(this.csvData).length > 0;
  }

  /**
   * Validate edge definitions against geometric topology
   * Uses the authoritative vertex-to-faces mapping to verify all edges exist
   *
   * @param {Object} topology - Vertex-to-faces mapping (vertex ID -> array of face IDs)
   * @returns {Object} Validation result with valid/invalid edges
   */
  validateTopology(topology) {
    const validEdges = [];
    const invalidEdges = [];

    this.edgeDefinitions.forEach(edge => {
      let sharedVertices = 0;

      // Check each vertex (1-20) to see if it connects both faces
      for (let vertexId = 1; vertexId <= 20; vertexId++) {
        const connectedFaces = topology[vertexId];
        if (!connectedFaces) continue;

        if (connectedFaces.includes(edge.face1) && connectedFaces.includes(edge.face2)) {
          sharedVertices++;
        }
      }

      // Two adjacent faces should share exactly 2 vertices
      if (sharedVertices === 2) {
        validEdges.push(edge.id);
      } else {
        invalidEdges.push({
          id: edge.id,
          face1: edge.face1,
          face2: edge.face2,
          sharedVertices: sharedVertices
        });
      }
    });

    return {
      valid: invalidEdges.length === 0,
      totalEdges: this.edgeDefinitions.length,
      validCount: validEdges.length,
      invalidCount: invalidEdges.length,
      validEdges: validEdges,
      invalidEdges: invalidEdges
    };
  }

  /**
   * Generate a dynamic narrative insight for an edge
   * This prepares the data for the AI pipeline or displays a rule-based insight
   * 
   * @param {Object} edge - The calculated edge object
   * @returns {Object} Narrative object { question, status, insight }
   */
  generateNarrative(edge) {
    // 1. The Base Question (from CSV or generic)
    let question = edge.question;
    if (!question) {
      question = `How does ${edge.face1Name} relate to ${edge.face2Name}?`;
    }

    // 2. The Flow Status (Physics)
    let flowDesc = "";
    const magnitude = Math.abs(edge.breathRatio);
    const direction = edge.breathRatio > 0 ? `→ (${edge.face2Name} is pulling)` : `← (${edge.face1Name} is pulling)`;

    if (magnitude < 0.1) flowDesc = "Stagnant / Balanced";
    else if (magnitude < 0.4) flowDesc = `Gentle Flow ${direction}`;
    else if (magnitude < 0.7) flowDesc = `Strong Current ${direction}`;
    else flowDesc = `Rushing Torrent ${direction}`;

    // 3. The Tension Status (Health)
    let tensionDesc = "";
    let insight = "";

    if (edge.tension < 0.3) {
      tensionDesc = "Harmonious";
      insight = `The relationship is healthy. Resources transform efficiently between these domains.`;
    } else if (edge.tension < 0.6) {
      tensionDesc = "Friction";
      insight = `There is resistance here. Energy is being lost during the transfer. Look for bureaucratic bottlenecks.`;
    } else {
      tensionDesc = "Blockage / Rupture";
      insight = `CRITICAL: The connection is breaking. The disparity is too high for the current structure to handle. Immediate intervention required to bridge the gap.`;
    }

    // 4. Elemental Nuance
    let elementalInsight = "";
    switch (edge.element) {
      case 'Fire': elementalInsight = "This is a volatile, high-energy link."; break;
      case 'Water': elementalInsight = "This connection requires emotional trust."; break;
      case 'Earth': elementalInsight = "This relies on solid structures and agreements."; break;
      case 'Air': elementalInsight = "Communication is the key constraint here."; break;
      case 'Ether': elementalInsight = "This is a purpose-driven alignment."; break;
    }

    return {
      archetype: edge.archetype || "Unnamed Axis",
      question: question,
      flow: flowDesc,
      tensionStatus: tensionDesc,
      fullNarrative: `${insight} ${elementalInsight}`,
      prompt: `Analyze the ${edge.tension.toFixed(2)} tension between ${edge.face1Name} and ${edge.face2Name}. Context: ${elementalInsight}`
    };
  }

  /**
   * Log topology validation results to console
   */
  logTopologyValidation(topology) {
    const result = this.validateTopology(topology);

    console.log('\n🔍 EDGE TOPOLOGY VALIDATION');
    console.log('='.repeat(60));
    console.log(`Total edges defined: ${result.totalEdges}`);
    console.log(`✅ Valid geometric edges: ${result.validCount}`);
    console.log(`❌ Invalid geometric edges: ${result.invalidCount}`);

    if (result.invalidEdges.length > 0) {
      console.warn('\n⚠️ INVALID EDGES (do not match dodecahedron topology):');
      result.invalidEdges.forEach(edge => {
        console.warn(`  ${edge.id}: Face ${edge.face1}-${edge.face2} (shares ${edge.sharedVertices} vertices, expected 2)`);
      });
    } else {
      console.log('\n✅ All edges are geometrically valid!');
    }

    console.log('='.repeat(60));
    return result;
  }
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.EdgeAnalyzer = EdgeAnalyzer;
}
