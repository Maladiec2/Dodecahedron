/**
 * VertexAnalyzer - Browser-Compatible Edition
 *
 * Analyzes the 20 vertices (convergence points) of the dodecahedron
 *
 * Each vertex is where three faces meet - a point of transformation potential.
 * Vertices can form vortices (upward or downward spirals) based on energy patterns.
 *
 * USAGE:
 * const analyzer = new VertexAnalyzer();
 * const vertices = analyzer.calculateAllVertices(facesData);
 * const leveragePoints = analyzer.getLeveragePoints(vertices);
 *
 * @author Deimantas Butrimas & Claude
 * @version 2.0 (Browser Edition)
 */

export class VertexAnalyzer {
  constructor() {
    this.csvData = null; // Will hold loaded CSV vertex data
    // Define the 20 vertices of a dodecahedron
    // Each vertex is where 3 faces meet
    this.vertexDefinitions = [
      { id: 1, faces: [1, 2, 6], archetype: 'Foundation Nexus' },
      { id: 2, faces: [1, 5, 6], archetype: 'Resource Core' },
      { id: 3, faces: [1, 5, 8], archetype: 'Action Point' },
      { id: 4, faces: [1, 8, 9], archetype: 'Growth Catalyst' },
      { id: 5, faces: [1, 2, 9], archetype: 'Development Hub' },
      { id: 6, faces: [2, 3, 6], archetype: 'Social Nexus' },
      { id: 7, faces: [2, 3, 10], archetype: 'Values Junction' },
      { id: 8, faces: [2, 9, 10], archetype: 'Integrity Point' },
      { id: 9, faces: [3, 4, 6], archetype: 'Structure Convergence' },
      { id: 10, faces: [3, 4, 11], archetype: 'Market-Structure Link' },
      { id: 11, faces: [3, 10, 11], archetype: 'Truth Gateway' },
      { id: 12, faces: [4, 5, 6], archetype: 'Community Anchor' },
      { id: 13, faces: [4, 5, 7], archetype: 'Brand-System Nexus' },
      { id: 14, faces: [4, 7, 11], archetype: 'Story Amplifier' },
      { id: 15, faces: [5, 7, 8], archetype: 'Expression Vortex' },
      { id: 16, faces: [5, 8, 10], archetype: 'Value-Action Bridge' },
      { id: 17, faces: [7, 8, 12], archetype: 'Resilience Forge' },
      { id: 18, faces: [8, 9, 12], archetype: 'Regeneration Core' },
      { id: 19, faces: [9, 10, 12], archetype: 'Protection Hub' },
      { id: 20, faces: [10, 11, 12], archetype: 'Wisdom Center' }
    ];
  }

  /**
   * Load vertex data from CSV file
   *
   * @param {string} csvPath - Path to CSV_Vortex_Map.csv
   * @returns {Promise<Object>} Map of vertex ID to CSV data
   */
  async loadVertexCSV(csvPath = './data/CSV_Vortex_Map.csv') {
    try {
      const response = await fetch(csvPath);
      if (!response.ok) {
        throw new Error(`Failed to load CSV: ${response.statusText}`);
      }

      const csvText = await response.text();
      this.csvData = this.parseVertexCSV(csvText);

      console.log(`✅ Loaded ${Object.keys(this.csvData).length} vertices from CSV`);
      return this.csvData;
    } catch (error) {
      console.error('❌ Error loading vertex CSV:', error);
      this.csvData = null;
      return null;
    }
  }

  /**
   * Parse CSV text into structured vertex data
   *
   * @param {string} csvText - Raw CSV file content
   * @returns {Object} Map of vertex ID to vertex data object
   */
  parseVertexCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    // Skip header row (line 0)
    const vertexMap = {};

    // Process data rows
    // Note: The CSV has 21 rows of data (V1..V20 + one extra?) then text blocks
    // We strictly look for lines starting with "V" followed by a number
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      // Simple split by comma, but handle quotes if necessary (though this CSV seems simple)
      // Using a regex to handle quoted fields would be safer
      const values = this.parseCSVLine(line);

      const vertexId = values[0] ? values[0].trim() : null;

      if (!vertexId || !vertexId.startsWith('V')) continue;

      // Map CSV columns to properties
      // Col 0: Vertex_ID (V1)
      // Col 15: Departments/Archetype ("Financial Capital , Intellectual Capital...")
      // We can also extract the detailed text descriptions from the bottom if we want, 
      // but for now let's map the main table.

      // The CSV structure is complex with text blocks at the bottom.
      // We'll focus on the main table rows first.

      vertexMap[vertexId] = {
        id: vertexId,
        archetype: values[15] ? values[15].trim().replace(/^"|"$/g, '') : "Unknown Convergence",
        // We can add more fields here if needed
      };
    }

    // Extract Rich Metadata from the bottom text blocks (V-Mean, Vortex Strength, etc.)
    // This is "hardcoded" or "pattern matched" from the specific CSV structure provided
    // The user wants "The Spin", "Ambient Temperature", "Action"
    // These are generic descriptions in the CSV, not per-vertex.
    // However, the prompt implies we want to see info *about* the vertices.
    // The CSV *does* have specific columns:
    // Col 8: Macro Vortex Strength (?)
    // Col 13: Overall Vertex Coherence

    return vertexMap;
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

    result.push(current);
    return result;
  }

  /**
   * Calculate vortex strength based on energy variance at convergence point
   *
   * Higher variance = stronger vortex (more dynamic transformation potential)
   *
   * @param {Array<Object>} faces - The 3 faces meeting at this vertex
   * @returns {number} Vortex strength between 0 (stagnant) and 1 (highly dynamic)
   */
  calculateVortexStrength(faces) {
    if (faces.length !== 3) {
      console.warn(`Vertex doesn't have exactly 3 faces`);
      return 0;
    }

    // Get the three face energies
    const [f1, f2, f3] = faces.map(f => f.faceEnergy);

    // Calculate variance (spread) of the three energies
    const mean = (f1 + f2 + f3) / 3;
    const variance = ((f1 - mean) ** 2 + (f2 - mean) ** 2 + (f3 - mean) ** 2) / 3;
    const stdDev = Math.sqrt(variance);

    // Vortex strength is proportional to:
    // 1. The standard deviation (difference creates vortex motion)
    // 2. The mean energy level (higher energy = more potential)

    // Normalize standard deviation (max possible is ~0.577 for values 0-1)
    const normalizedVariance = stdDev / 0.577;

    // Combined strength: 70% variance, 30% mean energy
    const strength = (0.7 * normalizedVariance) + (0.3 * mean);

    return Math.min(1.0, Math.max(0.0, strength));
  }

  /**
   * Calculate vortex direction (upward/downward spiral)
   *
   * Positive = upward spiral (generative)
   * Negative = downward spiral (degenerative)
   *
   * @param {Array<Object>} faces - The 3 faces meeting at this vertex
   * @returns {number} Direction between -1 (downward) and +1 (upward)
   */
  calculateVortexDirection(faces) {
    if (faces.length !== 3) return 0;

    // Average energy of the three faces
    const avgEnergy = faces.reduce((sum, f) => sum + f.faceEnergy, 0) / 3;

    // Direction is based on whether energy is above or below balanced (0.5)
    // and how far from balanced it is
    const direction = (avgEnergy - 0.5) * 2;

    return Math.max(-1.0, Math.min(1.0, direction));
  }

  /**
   * Calculate coherence at this vertex
   *
   * High coherence = faces are well-balanced
   * Low coherence = faces are very different
   *
   * @param {Array<Object>} faces - The 3 faces meeting at this vertex
   * @returns {number} Coherence between 0 (chaotic) and 1 (coherent)
   */
  calculateCoherence(faces) {
    if (faces.length !== 3) return 0;

    const [f1, f2, f3] = faces.map(f => f.faceEnergy);

    // Calculate pairwise differences
    const diff12 = Math.abs(f1 - f2);
    const diff23 = Math.abs(f2 - f3);
    const diff31 = Math.abs(f3 - f1);

    // Average difference
    const avgDiff = (diff12 + diff23 + diff31) / 3;

    // Coherence is inverse of difference
    // Maximum possible average difference is ~0.667 (when one is 0, one is 1, one is 0.5)
    const coherence = 1.0 - (avgDiff / 0.667);

    return Math.max(0.0, Math.min(1.0, coherence));
  }

  /**
   * Get vortex type description
   */
  getVortexType(strength, direction) {
    if (strength < 0.3) return 'Dormant';

    if (direction > 0.3) {
      return strength > 0.7 ? 'Powerful Ascent' : 'Rising';
    } else if (direction < -0.3) {
      return strength > 0.7 ? 'Critical Descent' : 'Declining';
    } else {
      return 'Turbulent';
    }
  }

  /**
   * Get health status based on coherence
   */
  getHealthStatus(coherence) {
    if (coherence >= 0.8) return 'Harmonious';
    if (coherence >= 0.6) return 'Balanced';
    if (coherence >= 0.4) return 'Unstable';
    if (coherence >= 0.2) return 'Chaotic';
    return 'Critical';
  }

  /**
   * Get color based on vortex characteristics
   */
  getVortexColor(strength, direction, coherence) {
    // Determine base color from direction
    if (direction > 0.2) {
      // Upward spiral - green/cyan
      const t = Math.min(1.0, strength);
      return this.interpolateColor('#88ff88', '#00ffff', t);
    } else if (direction < -0.2) {
      // Downward spiral - red/orange
      const t = Math.min(1.0, strength);
      return this.interpolateColor('#ffaa00', '#ff0000', t);
    } else {
      // Neutral/turbulent - yellow/white based on coherence
      const t = coherence;
      return this.interpolateColor('#ffff00', '#ffffff', t);
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
   * Check if this is a high-leverage point
   * (high strength + low coherence = opportunity for transformation)
   */
  isLeveragePoint(strength, coherence) {
    return strength > 0.7 && coherence < 0.5;
  }

  /**
   * Calculate all 20 vertices for the dodecahedron
   *
   * @param {Array<Object>} faces - Array of 12 face objects
   * @param {Array<Object>} backendVertices - Optional array of vertices from Quannex.getState()
   * @returns {Array<Object>} Array of vertex analyses
   */
  calculateAllVertices(faces, backendVertices = null) {
    const vertexAnalyses = [];

    // Create a map for faster lookup if backend vertices are provided
    const backendMap = new Map();
    if (backendVertices) {
      backendVertices.forEach(v => backendMap.set(v.id, v));
    }

    this.vertexDefinitions.forEach(vertexDef => {
      // Get the 3 faces that meet at this vertex
      const convergingFaces = vertexDef.faces.map(faceId =>
        faces.find(f => f.id === faceId)
      ).filter(f => f !== undefined);

      if (convergingFaces.length !== 3) {
        console.warn(`Missing face data for vertex ${vertexDef.id}`);
        return;
      }

      // Check for backend data
      const backendVertex = backendMap.get(vertexDef.id); // Note: backend uses numeric ID for vertices? Let's check main.js
      // In main.js Vertex class: this.id = config.id || '';
      // In createVertices: id: row.Vertex_ID || row.id
      // The CSV uses "V1", "V2".
      // Let's assume backend ID matches the definition ID or we might need to handle "V" prefix.
      // Wait, vertexDef.id is number (1, 2, 3). Backend might be string "V1" or number 1.
      // Let's try both lookups just in case.
      const backendVertexV = backendMap.get(`V${vertexDef.id}`);
      const backendVertexNum = backendMap.get(vertexDef.id);
      const activeBackendVertex = backendVertexV || backendVertexNum;

      let strength, direction, coherence, vortexType, healthStatus, color, isLeverage;

      if (activeBackendVertex) {
        // Use backend physics
        strength = activeBackendVertex.energy; // Mapped from vortexEnergy
        direction = activeBackendVertex.vortexDirection;
        coherence = activeBackendVertex.coherence;
        isLeverage = activeBackendVertex.isLeveragePoint;

        // Re-derive presentation
        vortexType = this.getVortexType(strength, direction);
        healthStatus = this.getHealthStatus(coherence);
        color = this.getVortexColor(strength, direction, coherence);
      } else {
        // Fallback to local calculation
        strength = this.calculateVortexStrength(convergingFaces);
        direction = this.calculateVortexDirection(convergingFaces);
        coherence = this.calculateCoherence(convergingFaces);
        vortexType = this.getVortexType(strength, direction);
        healthStatus = this.getHealthStatus(coherence);
        color = this.getVortexColor(strength, direction, coherence);
        isLeverage = this.isLeveragePoint(strength, coherence);
      }

      // Merge CSV Data if available
      let csvInfo = null;
      // Map numeric ID (1) to CSV ID (V1)
      const csvId = `V${vertexDef.id}`;
      if (this.csvData && this.csvData[csvId]) {
        csvInfo = this.csvData[csvId];
      }

      vertexAnalyses.push({
        id: vertexDef.id,
        csvId: csvId,
        archetype: csvInfo ? csvInfo.archetype : vertexDef.archetype,
        faceIds: vertexDef.faces,
        faceNames: convergingFaces.map(f => f.name || `Face ${f.id}`),
        faceEnergies: convergingFaces.map(f => f.faceEnergy),
        vortexStrength: strength,
        vortexDirection: direction,
        coherence: coherence,
        vortexType: vortexType,
        healthStatus: healthStatus,
        isLeveragePoint: isLeverage,
        color: color,
        // Add narrative elements
        narrative: this.generateVertexNarrative(strength, direction, coherence, csvInfo ? csvInfo.archetype : vertexDef.archetype),
        // Flag source
        source: activeBackendVertex ? 'backend' : 'frontend'
      });
    });

    return vertexAnalyses;
  }

  /**
   * Generate narrative for the vertex
   */
  generateVertexNarrative(strength, direction, coherence, archetype) {
    let description = "";

    if (strength > 0.7) {
      description = "This is a high-intensity vortex. The forces here are spinning rapidly, creating significant transformation pressure.";
    } else if (strength < 0.3) {
      description = "This is a calm, stable junction. The energies are balanced and dormant.";
    } else {
      description = "Active circulation. There is healthy movement and exchange between these domains.";
    }

    let action = "";
    if (coherence < 0.4) {
      action = "High dissonance detected. Requires immediate alignment of the three converging domains.";
    } else if (coherence > 0.8) {
      action = "High resonance. A potential hub for scaling best practices.";
    } else {
      action = "Monitor for potential friction or synergy opportunities.";
    }

    return {
      description: description,
      action: action,
      spinLabel: strength > 0.5 ? (direction > 0 ? "Ascending Spiral" : "Descending Spiral") : "Neutral Flow"
    };
  }

  /**
   * Get leverage points (high impact, low coherence)
   */
  getLeveragePoints(vertices) {
    return vertices
      .filter(v => v.isLeveragePoint)
      .sort((a, b) => b.vortexStrength - a.vortexStrength);
  }

  /**
   * Get vortex statistics
   */
  getVortexStats(vertices) {
    const strengths = vertices.map(v => v.vortexStrength);
    const avgStrength = strengths.reduce((sum, s) => sum + s, 0) / strengths.length;

    const upward = vertices.filter(v => v.vortexDirection > 0.2).length;
    const downward = vertices.filter(v => v.vortexDirection < -0.2).length;
    const neutral = vertices.length - upward - downward;

    const leverageCount = vertices.filter(v => v.isLeveragePoint).length;

    let dominantDirection;
    if (upward > downward + 3) {
      dominantDirection = 'System-wide upward momentum';
    } else if (downward > upward + 3) {
      dominantDirection = 'System-wide downward pressure';
    } else {
      dominantDirection = 'Mixed vortex patterns';
    }

    return {
      averageStrength: avgStrength,
      upwardCount: upward,
      downwardCount: downward,
      neutralCount: neutral,
      leveragePointCount: leverageCount,
      dominantDirection: dominantDirection
    };
  }

  /**
   * Get critical vertices (strongest vortices)
   */
  getCriticalVertices(vertices, topN = 5) {
    return [...vertices]
      .sort((a, b) => b.vortexStrength - a.vortexStrength)
      .slice(0, topN);
  }

  /**
   * Get transformation recommendations
   */
  getTransformationRecommendations(vertices) {
    const leveragePoints = this.getLeveragePoints(vertices);
    const recommendations = [];

    leveragePoints.forEach(vertex => {
      const direction = vertex.vortexDirection > 0 ? 'upward' : 'downward';
      const momentum = vertex.vortexDirection > 0 ? 'positive' : 'negative';

      recommendations.push({
        vertexId: vertex.id,
        archetype: vertex.archetype,
        priority: vertex.vortexStrength,
        direction: direction,
        message: `High leverage at "${vertex.archetype}" (Vertex ${vertex.id}). ` +
          `Strong ${momentum} momentum with low coherence across ${vertex.faceNames.join(', ')}. ` +
          `Small interventions here will cascade through connected faces.`
      });
    });

    return recommendations.sort((a, b) => b.priority - a.priority);
  }
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.VertexAnalyzer = VertexAnalyzer;
}
