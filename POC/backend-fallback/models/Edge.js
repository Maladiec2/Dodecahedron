/**
 * Edge Class - The 30 Bridges of Connection
 * 
 * Each Edge represents the relationship and flow between two organizational domains (Faces).
 * Edges carry their own KPI and have an elemental nature that governs how energy flows.
 */

export class Edge {
  /**
   * @param {string} id - Edge ID (e.g., 'E1-2')
   * @param {number} face1Id - First face ID
   * @param {number} face2Id - Second face ID
   * @param {KPI} edgeKPI - The single KPI associated with this edge
   * @param {string} elementalNature - The elemental nature ('Fire', 'Water', 'Earth', 'Air', 'Ether')
   */
  constructor({
    id,
    face1Id,
    face2Id,
    edgeKPI = null,
    elementalNature = 'Ether',
    name = ''
  }) {
    this.id = id;
    this.face1Id = face1Id;
    this.face2Id = face2Id;
    this.edgeKPI = edgeKPI;
    this.elementalNature = elementalNature;
    this.name = name || `Edge ${face1Id}-${face2Id}`;
    
    // Cache for calculated values
    this._tension = null;
    this._breathRatio = null;
    this._flowDirection = null;
  }

  /**
   * Calculate edge tension based on the energy difference between connected faces
   * and the health of the edge KPI itself, modulated by elemental nature
   * 
   * @param {Face} face1 - First connected face
   * @param {Face} face2 - Second connected face
   * @returns {number} Tension value between 0 (harmonious) and 1 (highly tense)
   */
  calculateTension(face1, face2) {
    // Energy difference between the two faces
    const energyDifference = Math.abs(face1.faceEnergy - face2.faceEnergy);
    
    // Edge KPI health (inverted - low health = high tension)
    const edgeHealth = this.edgeKPI ? this.edgeKPI.normalizedScore : 0.5;
    const edgeTension = 1.0 - edgeHealth;
    
    // Combined tension: weighted average
    // 60% from energy difference, 40% from edge KPI health
    const baseTension = (0.6 * energyDifference) + (0.4 * edgeTension);
    
    // Apply elemental multiplier
    // Fire and Air amplify tension, Water and Earth dampen it, Ether is neutral
    const modulatedTension = baseTension * this.elementalMultiplier;
    
    return Math.min(1.0, Math.max(0.0, modulatedTension));
  }

  /**
   * Calculate the breath ratio (expansion/contraction) across this edge
   * Positive values indicate expansion (flow from face1 to face2)
   * Negative values indicate contraction (flow from face2 to face1)
   * 
   * @param {Face} face1 - First connected face
   * @param {Face} face2 - Second connected face
   * @returns {number} Breath ratio between -1 (strong contraction) and +1 (strong expansion)
   */
  calculateBreathRatio(face1, face2) {
    const energyDelta = face2.faceEnergy - face1.faceEnergy;
    
    // Normalize to -1 to +1 range
    // Larger energy difference = stronger breath
    return Math.max(-1.0, Math.min(1.0, energyDelta * 2));
  }

  /**
   * Determine flow direction based on breath ratio
   * @returns {string} Flow direction
   */
  getFlowDirection() {
    if (!this._breathRatio) return 'balanced';
    
    if (Math.abs(this._breathRatio) < 0.1) return 'balanced';
    return this._breathRatio > 0 ? 'expansion' : 'contraction';
  }

  /**
   * Calculate elemental multiplier based on nature
   * Different elements have different flow characteristics
   */
  get elementalMultiplier() {
    const multipliers = {
      'Fire': 1.3,    // Fire amplifies tension and flow
      'Water': 0.9,   // Water smooths and dampens
      'Earth': 0.8,   // Earth stabilizes and grounds
      'Air': 1.1,     // Air accelerates flow
      'Ether': 1.0    // Ether is neutral/balanced
    };
    
    return multipliers[this.elementalNature] || 1.0;
  }

  /**
   * Update cached values
   * @param {Face} face1 - First connected face
   * @param {Face} face2 - Second connected face
   */
  updateMetrics(face1, face2) {
    this._tension = this.calculateTension(face1, face2);
    this._breathRatio = this.calculateBreathRatio(face1, face2);
    this._flowDirection = this.getFlowDirection();
  }

  /**
   * Get tension (must be calculated first via updateMetrics)
   */
  get tension() {
    return this._tension !== null ? this._tension : 0;
  }

  /**
   * Get breath ratio (must be calculated first via updateMetrics)
   */
  get breathRatio() {
    return this._breathRatio !== null ? this._breathRatio : 0;
  }

  /**
   * Get flow direction (must be calculated first via updateMetrics)
   */
  get flowDirection() {
    return this._flowDirection || 'balanced';
  }

  /**
   * Get health status
   */
  get healthStatus() {
    const tension = this.tension;
    if (tension <= 0.2) return 'Flowing';
    if (tension <= 0.4) return 'Stable';
    if (tension <= 0.6) return 'Stressed';
    if (tension <= 0.8) return 'Strained';
    return 'Breaking';
  }

  /**
   * Get color based on tension level
   */
  getTensionColor() {
    const tension = this.tension;
    
    // Color gradient from green (low tension) to yellow to red (high tension)
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
   * Helper to interpolate between two hex colors
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
   * Export to JSON
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      face1Id: this.face1Id,
      face2Id: this.face2Id,
      elementalNature: this.elementalNature,
      tension: this.tension,
      breathRatio: this.breathRatio,
      flowDirection: this.flowDirection,
      healthStatus: this.healthStatus,
      color: this.getTensionColor(),
      edgeKPI: this.edgeKPI ? this.edgeKPI.toJSON() : null
    };
  }
}

