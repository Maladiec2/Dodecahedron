/**
 * Vertex Class - The 20 Vortices of Transformation
 * 
 * Each Vertex is a meeting point where three Faces (organizational domains) converge.
 * Vertices are points of potential transformation, where energy can spiral up or down.
 * They represent decision points, leverage points, or vortices of change.
 */

export class Vertex {
  /**
   * @param {number} id - Vertex ID (1-20)
   * @param {Array<number>} faceIds - The 3 face IDs that meet at this vertex
   * @param {string} name - Name of this convergence point
   * @param {string} archetype - The archetypal pattern at this vertex
   */
  constructor({
    id,
    faceIds = [],
    name = '',
    archetype = ''
  }) {
    this.id = id;
    this.faceIds = faceIds; // Array of 3 face IDs
    this.name = name || `Vertex ${id}`;
    this.archetype = archetype;
    
    // Cache for calculated values
    this._vortexStrength = null;
    this._vortexDirection = null;
    this._coherence = null;
  }

  /**
   * Calculate vortex strength (ω) based on the energies of the three converging faces
   * Higher strength indicates more dynamic transformation potential
   * 
   * @param {Array<Face>} faces - The three faces that meet at this vertex
   * @returns {number} Vortex strength between 0 (stagnant) and 1 (highly dynamic)
   */
  calculateVortexStrength(faces) {
    if (faces.length !== 3) {
      console.warn(`Vertex ${this.id} doesn't have exactly 3 faces`);
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
   * Positive = upward spiral (generative)
   * Negative = downward spiral (degenerative)
   * 
   * @param {Array<Face>} faces - The three faces that meet at this vertex
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
   * High coherence = faces are well-balanced
   * Low coherence = faces are very different
   * 
   * @param {Array<Face>} faces - The three faces that meet at this vertex
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
   * Update cached values
   * @param {Array<Face>} faces - The three faces that meet at this vertex
   */
  updateMetrics(faces) {
    this._vortexStrength = this.calculateVortexStrength(faces);
    this._vortexDirection = this.calculateVortexDirection(faces);
    this._coherence = this.calculateCoherence(faces);
  }

  /**
   * Get vortex strength (must be calculated first via updateMetrics)
   */
  get vortexStrength() {
    return this._vortexStrength !== null ? this._vortexStrength : 0;
  }

  /**
   * Get vortex direction (must be calculated first via updateMetrics)
   */
  get vortexDirection() {
    return this._vortexDirection !== null ? this._vortexDirection : 0;
  }

  /**
   * Get coherence (must be calculated first via updateMetrics)
   */
  get coherence() {
    return this._coherence !== null ? this._coherence : 0;
  }

  /**
   * Get vortex type description
   */
  get vortexType() {
    const strength = this.vortexStrength;
    const direction = this.vortexDirection;
    
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
   * Get health status
   */
  get healthStatus() {
    const coherence = this.coherence;
    if (coherence >= 0.8) return 'Harmonious';
    if (coherence >= 0.6) return 'Balanced';
    if (coherence >= 0.4) return 'Unstable';
    if (coherence >= 0.2) return 'Chaotic';
    return 'Critical';
  }

  /**
   * Get color based on vortex characteristics
   * Hue based on direction (green=up, red=down)
   * Saturation based on strength
   * Brightness based on coherence
   */
  getVortexColor() {
    const strength = this.vortexStrength;
    const direction = this.vortexDirection;
    const coherence = this.coherence;
    
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
   * Check if this is a high-leverage point
   * (high strength + low coherence = opportunity for transformation)
   */
  get isLeveragePoint() {
    return this.vortexStrength > 0.7 && this.coherence < 0.5;
  }

  /**
   * Export to JSON
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      archetype: this.archetype,
      faceIds: this.faceIds,
      vortexStrength: this.vortexStrength,
      vortexDirection: this.vortexDirection,
      coherence: this.coherence,
      vortexType: this.vortexType,
      healthStatus: this.healthStatus,
      isLeveragePoint: this.isLeveragePoint,
      color: this.getVortexColor()
    };
  }
}

