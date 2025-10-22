/**
 * KPI Class - The Fundamental Unit of Organizational Measurement
 * 
 * Each KPI represents a single measurable aspect of organizational health.
 * It carries its own wisdom about what "healthy" means and calculates its
 * normalized contribution to the greater whole.
 */

export class KPI {
  /**
   * @param {string} id - Unique identifier
   * @param {string} name - Human-readable name
   * @param {string} direction - Direction of health: '↑' (higher is better), '↓' (lower is better), 'Band' (optimal range)
   * @param {number} targetMin - Minimum target value
   * @param {number} healthyMin - Minimum healthy value
   * @param {number} healthyMax - Maximum healthy value
   * @param {number} absoluteMax - Absolute maximum value
   * @param {number} value - Current value
   * @param {number} weight - Importance weight (0-1)
   * @param {number} faceId - Which face (1-12) this KPI belongs to
   * @param {string} primaryOctave - The harmonic octave this KPI resonates with
   * @param {number} octaveLevel - The octave level (1-7) for octave progression
   * @param {string} element - The elemental type (Earth, Water, Fire, Air, Ether)
   * @param {string} question - The elemental question this KPI answers
   * @param {string} rationale - The philosophy/rationale behind this KPI
   * @param {string} kpiType - Type of KPI: 'ball' (primary) or 'pillar' (edge)
   */
  constructor({
    id,
    name,
    direction = '↑',
    targetMin = 0,
    healthyMin = 0,
    healthyMax = 100,
    absoluteMax = 100,
    value = 0,
    weight = 1.0,
    faceId = null,
    primaryOctave = 'Base',
    octaveLevel = null,
    element = null,
    question = null,
    rationale = null,
    kpiType = 'pillar'
  }) {
    this.id = id;
    this.name = name;
    this.direction = direction;
    this.targetMin = targetMin;
    this.healthyMin = healthyMin;
    this.healthyMax = healthyMax;
    this.absoluteMax = absoluteMax;
    this.value = value;
    this.weight = weight;
    this.faceId = faceId;
    this.primaryOctave = primaryOctave;
    
    // Octave progression attributes
    this.octaveLevel = octaveLevel;
    this.element = element;
    this.question = question;
    this.rationale = rationale;
    this.kpiType = kpiType;
    
    // Cache for normalized score
    this._normalizedScore = null;
  }

  /**
   * Calculate K_Normalized score based on direction and current value
   * Returns a value between 0 (worst) and 1 (optimal)
   */
  calculateNormalizedScore() {
    const v = this.value;
    
    switch (this.direction) {
      case '↑': // Higher is better
        if (v >= this.healthyMax) return 1.0;
        if (v <= this.healthyMin) return 0.0;
        // Linear interpolation in healthy range
        return (v - this.healthyMin) / (this.healthyMax - this.healthyMin);
      
      case '↓': // Lower is better
        if (v <= this.healthyMin) return 1.0;
        if (v >= this.healthyMax) return 0.0;
        // Inverse linear interpolation
        return 1.0 - ((v - this.healthyMin) / (this.healthyMax - this.healthyMin));
      
      case 'Band': // Optimal range (band)
        const optimalMid = (this.healthyMin + this.healthyMax) / 2;
        const optimalRange = this.healthyMax - this.healthyMin;
        
        // Distance from optimal center
        const distance = Math.abs(v - optimalMid);
        
        if (distance === 0) return 1.0;
        if (distance >= optimalRange / 2) return 0.0;
        
        // Gaussian-like falloff from center
        return 1.0 - (distance / (optimalRange / 2));
      
      default:
        console.warn(`Unknown direction: ${this.direction}`);
        return 0.5;
    }
  }

  /**
   * Get the normalized score (cached)
   */
  get normalizedScore() {
    if (this._normalizedScore === null) {
      this._normalizedScore = this.calculateNormalizedScore();
    }
    return this._normalizedScore;
  }

  /**
   * Update the value and invalidate cache
   */
  setValue(newValue) {
    this.value = newValue;
    this._normalizedScore = null; // Invalidate cache
  }

  /**
   * Get weighted contribution
   */
  get weightedScore() {
    return this.normalizedScore * this.weight;
  }

  /**
   * Check if KPI is in healthy range
   */
  get isHealthy() {
    return this.normalizedScore >= 0.7; // 70% threshold for "healthy"
  }

  /**
   * Get health status as string
   */
  get healthStatus() {
    const score = this.normalizedScore;
    if (score >= 0.9) return 'Optimal';
    if (score >= 0.7) return 'Healthy';
    if (score >= 0.5) return 'Warning';
    if (score >= 0.3) return 'Critical';
    return 'Crisis';
  }

  /**
   * Export to JSON
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      direction: this.direction,
      targetMin: this.targetMin,
      healthyMin: this.healthyMin,
      healthyMax: this.healthyMax,
      absoluteMax: this.absoluteMax,
      value: this.value,
      weight: this.weight,
      faceId: this.faceId,
      primaryOctave: this.primaryOctave,
      octaveLevel: this.octaveLevel,
      element: this.element,
      question: this.question,
      rationale: this.rationale,
      kpiType: this.kpiType,
      normalizedScore: this.normalizedScore,
      weightedScore: this.weightedScore,
      isHealthy: this.isHealthy,
      healthStatus: this.healthStatus
    };
  }
}

