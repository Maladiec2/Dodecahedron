/**
 * KPI_Enhanced Class - Advanced Normalization with Curvature Parameters
 *
 * This enhanced version adds non-linear value curves to recognize that different
 * metrics have different "moral geometries" - some have diminishing returns,
 * others have compounding effects.
 *
 * ENHANCEMENTS:
 * - Curvature parameter (κ_curve) for non-linear transformations
 * - Logarithmic scaling for survival metrics
 * - Exponential scaling for growth metrics
 * - Smooth plateau transitions for Band metrics
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
   * @param {number} curvature - Curvature parameter κ_curve for non-linear scaling (default: 1.0 = linear)
   *                            κ < 1.0: Concave (diminishing returns, e.g., survival metrics)
   *                            κ = 1.0: Linear (proportional value, e.g., completion metrics)
   *                            κ > 1.0: Convex (compounding returns, e.g., growth metrics)
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
    kpiType = 'pillar',
    curvature = 1.0  // NEW: Curvature parameter
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

    // NEW: Curvature parameter for non-linear value transformation
    this.curvature = curvature;

    // Cache for normalized score
    this._normalizedScore = null;
  }

  /**
   * Calculate K_Normalized score based on direction and current value
   * Returns a value between 0 (worst) and 1 (optimal)
   *
   * ENHANCED: Now applies curvature transformation for non-linear scaling
   */
  calculateNormalizedScore() {
    const v = this.value;
    let linearScore = 0;

    switch (this.direction) {
      case '↑': // Higher is better
        if (v >= this.healthyMax) {
          linearScore = 1.0;
        } else if (v <= this.healthyMin) {
          linearScore = 0.0;
        } else {
          // Linear interpolation in healthy range
          linearScore = (v - this.healthyMin) / (this.healthyMax - this.healthyMin);
        }
        break;

      case '↓': // Lower is better
        if (v <= this.healthyMin) {
          linearScore = 1.0;
        } else if (v >= this.healthyMax) {
          linearScore = 0.0;
        } else {
          // Inverse linear interpolation
          linearScore = 1.0 - ((v - this.healthyMin) / (this.healthyMax - this.healthyMin));
        }
        break;

      case 'Band': // Optimal range (band)
        linearScore = this.calculateBandScore(v);
        break;

      default:
        console.warn(`Unknown direction: ${this.direction}`);
        return 0.5;
    }

    // Apply curvature transformation
    return this.applyCurvature(linearScore);
  }

  /**
   * Calculate score for Band (plateau) metrics
   * ENHANCED: Smooth sigmoid transitions instead of linear falloff
   */
  calculateBandScore(v) {
    const optimalMid = (this.healthyMin + this.healthyMax) / 2;
    const optimalRange = this.healthyMax - this.healthyMin;

    // If within optimal band, return 1.0
    if (v >= this.healthyMin && v <= this.healthyMax) {
      return 1.0;
    }

    // If below minimum
    if (v < this.healthyMin) {
      if (v <= this.targetMin) return 0.0;
      // Smooth transition from targetMin to healthyMin
      const range = this.healthyMin - this.targetMin;
      const progress = (v - this.targetMin) / range;
      // Use sigmoid for smooth entry into plateau
      return this.smoothStep(progress);
    }

    // If above maximum
    if (v > this.healthyMax) {
      if (v >= this.absoluteMax) return 0.0;
      // Smooth transition from healthyMax to absoluteMax
      const range = this.absoluteMax - this.healthyMax;
      const progress = (v - this.healthyMax) / range;
      // Use inverse sigmoid for smooth exit from plateau
      return 1.0 - this.smoothStep(progress);
    }

    return 0.5; // Fallback
  }

  /**
   * Smooth step function (sigmoid-like)
   * Provides smooth transitions at plateau boundaries
   */
  smoothStep(x) {
    // Clamp to [0, 1]
    x = Math.max(0, Math.min(1, x));
    // Hermite interpolation: 3x² - 2x³
    return x * x * (3 - 2 * x);
  }

  /**
   * Apply curvature transformation
   *
   * κ < 1.0: Concave (diminishing returns)
   *   Example: Runway months - going from 3→6 months is more critical than 9→12
   *
   * κ = 1.0: Linear (proportional value)
   *   Example: % completion - each percentage point has equal value
   *
   * κ > 1.0: Convex (compounding returns)
   *   Example: Market share - exponential benefits from network effects
   */
  applyCurvature(linearScore) {
    if (this.curvature === 1.0) {
      return linearScore; // No transformation
    }

    // Power transformation: score^κ
    return Math.pow(linearScore, this.curvature);
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
   * Get curvature interpretation
   */
  get curvatureType() {
    if (this.curvature < 0.8) return 'Logarithmic (Survival)';
    if (this.curvature < 1.2) return 'Linear (Proportional)';
    return 'Exponential (Growth)';
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
      curvature: this.curvature,
      curvatureType: this.curvatureType,
      normalizedScore: this.normalizedScore,
      weightedScore: this.weightedScore,
      isHealthy: this.isHealthy,
      healthStatus: this.healthStatus
    };
  }
}
