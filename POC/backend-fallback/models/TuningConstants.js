/**
 * TuningConstants - The Dials of Coherence
 * 
 * These are the master tuning parameters that control the behavior of the entire
 * coherence engine. They represent fundamental philosophical choices about how
 * the system measures and weighs different aspects of organizational health.
 * 
 * Think of these as the "tuning forks" of the instrument - adjusting them changes
 * the fundamental frequency and responsiveness of the entire system.
 */

export class TuningConstants {
  constructor(config = {}) {
    /**
     * α (Alpha): The Synergy Blend
     * Range: 0.0 to 1.0
     * Default: 0.6
     * 
     * Controls the balance between arithmetic mean and multiplicative synergy
     * when calculating Star Pair Values in the pentagram.
     * 
     * Philosophy:
     * - High α (e.g., 0.8): Pragmatic, cautious - trusts simple averages
     * - Low α (e.g., 0.3): Believes in non-linear synergy - 1+1=3
     * - Balanced α (0.6): "We believe in synergy, but ground it in reality"
     */
    this.alpha = config.alpha ?? 0.6;

    /**
     * β (Beta): The Intersection Blend
     * Range: 0.0 to 1.0
     * Default: 0.5
     * 
     * Controls how adjacent "star pairs" influence each other in the pentagram.
     * A value of 0.5 gives equal influence (perfect symmetry).
     * 
     * Philosophy:
     * - β = 0.5: All influences are symmetrical - no bias in flow
     * - β ≠ 0.5: Would represent asymmetric influence patterns
     */
    this.beta = config.beta ?? 0.5;

    /**
     * γ (Gamma): The "Ball and Pillars" Blend
     * Range: 0.0 to 1.0
     * Default: 0.7
     * 
     * Controls the balance between a face's internal state (the "Ball" - its primary KPI)
     * and its relational health (the "Pillars" - its edge KPIs).
     * 
     * Philosophy:
     * - High γ (e.g., 0.9): "Radical internal accountability" - own your state
     * - Low γ (e.g., 0.2): "Nothing without relationships" - context is everything
     * - Balanced γ (0.7): "Primarily responsible for self (70%), significantly influenced by relationships (30%)"
     */
    this.gamma = config.gamma ?? 0.7;

    /**
     * δ (Delta): The Axis Coherence Factor
     * Range: 0.0 to 1.0
     * Default: 0.9
     * 
     * Controls how much a face's energy is influenced by its polar opposite on the
     * axis (e.g., how much "Financial Capital" is influenced by "Funding Pipeline").
     * 
     * Philosophy:
     * - High δ (e.g., 0.9): "Focus on local reality" - 90% local, 10% shadow
     * - Low δ (e.g., 0.2): "Profoundly linked to shadow" - deep non-duality
     * - Balanced δ (0.5): Perfect 50/50 non-dual awareness
     */
    this.delta = config.delta ?? 0.9;

    /**
     * κ (Kappa): The Sensitivity Amplifier
     * Range: 1.0 to 10.0
     * Default: 4.0
     * 
     * Controls the "emotional responsiveness" of the system - how steeply
     * the S-curve responds to changes in face energy.
     * 
     * Philosophy:
     * - Low κ (e.g., 1.0): Gentle, forgiving, high inertia
     * - High κ (e.g., 5.0): Highly sensitive, "high-strung"
     * - Balanced κ (4.0): Good responsiveness without volatility
     * 
     * Technical: Uses logistic function: 1 / (1 + e^(-κ*(x-0.5)))
     */
    this.kappa = config.kappa ?? 4.0;

    /**
     * Shadow Penalty Weights
     * These control how severely the system penalizes incoherent patterns
     */
    this.shadowPenalties = {
      brittleProfit: config.brittleProfit ?? 0.25,      // High finance + Low resilience
      extractiveGrowth: config.extractiveGrowth ?? 0.30, // High finance + Low regeneration
      experienceGap: config.experienceGap ?? 0.35,      // High brand + Low operations
      burnoutEngine: config.burnoutEngine ?? 0.40,      // High operations + Low human
      hollowGovernance: config.hollowGovernance ?? 0.20, // High structure + Low values
      lonelyHero: config.lonelyHero ?? 0.30             // High IP + Bus factor = 1
    };

    /**
     * Breath Ratio Thresholds
     * Define what counts as "balanced" breathing
     */
    this.breathRatio = {
      minBalanced: config.breathMinBalanced ?? 0.8,  // Below this = over-exhaling
      maxBalanced: config.breathMaxBalanced ?? 1.2   // Above this = over-inhaling
    };

    /**
     * Variance Penalties (from SYSTEM_COHERENCE)
     * Control how much the system values harmony over raw power
     */
    this.variancePenalties = {
      department: config.deptPenalty ?? 0.30,  // ρ_dept
      octave: config.octavePenalty ?? 0.25,    // ρ_oct
      global: config.globalPenalty ?? 0.25     // ρ_global
    };
  }

  /**
   * Get a human-readable explanation of current settings
   */
  getExplanation() {
    return {
      alpha: {
        value: this.alpha,
        meaning: this.alpha > 0.7 ? 'Pragmatic & cautious' : this.alpha < 0.4 ? 'Believes in strong synergy' : 'Balanced',
        impact: 'Controls how Star Pairs blend arithmetic and multiplicative effects'
      },
      beta: {
        value: this.beta,
        meaning: this.beta === 0.5 ? 'Perfectly symmetrical' : 'Asymmetric influence',
        impact: 'Controls how adjacent elements influence each other in pentagram'
      },
      gamma: {
        value: this.gamma,
        meaning: this.gamma > 0.7 ? 'Internal accountability focus' : this.gamma < 0.4 ? 'Relationship focus' : 'Balanced',
        impact: 'Balance between internal state and relational health'
      },
      delta: {
        value: this.delta,
        meaning: this.delta > 0.7 ? 'Local focus' : this.delta < 0.4 ? 'Shadow-aware' : 'Non-dual balance',
        impact: 'Influence of polar opposite face on axis'
      },
      kappa: {
        value: this.kappa,
        meaning: this.kappa > 5 ? 'Highly responsive' : this.kappa < 3 ? 'Gentle & forgiving' : 'Balanced sensitivity',
        impact: 'How steeply system responds to changes'
      }
    };
  }

  /**
   * Apply sensitivity amplifier (logistic function)
   * Transforms a 0-1 score into an amplified response
   */
  applySensitivityAmplifier(score) {
    // Logistic function: 1 / (1 + e^(-κ*(x-0.5)))
    return 1 / (1 + Math.exp(-this.kappa * (score - 0.5)));
  }

  /**
   * Calculate Star Pair Value using alpha blending
   * s = α × mean(k1, k2) + (1-α) × sqrt(k1 × k2)
   */
  calculateStarPairValue(k1, k2) {
    const arithmeticMean = (k1 + k2) / 2;
    const geometricMean = Math.sqrt(k1 * k2);
    return this.alpha * arithmeticMean + (1 - this.alpha) * geometricMean;
  }

  /**
   * Calculate Intersection Node using beta blending
   * p = β × s1 + (1-β) × s2
   */
  calculateIntersectionNode(s1, s2) {
    return this.beta * s1 + (1 - this.beta) * s2;
  }

  /**
   * Blend Ball and Pillars using gamma
   * LocalCoherence = γ × Ball + (1-γ) × Pillars
   */
  blendBallAndPillars(ballHealth, pillarHealth) {
    return this.gamma * ballHealth + (1 - this.gamma) * pillarHealth;
  }

  /**
   * Apply axis coherence factor using delta
   * AxisInformed = δ × Local + (1-δ) × Opposite
   */
  applyAxisCoherence(localEnergy, oppositeEnergy) {
    return this.delta * localEnergy + (1 - this.delta) * oppositeEnergy;
  }

  /**
   * Validate and constrain all constants to valid ranges
   */
  validate() {
    this.alpha = Math.max(0, Math.min(1, this.alpha));
    this.beta = Math.max(0, Math.min(1, this.beta));
    this.gamma = Math.max(0, Math.min(1, this.gamma));
    this.delta = Math.max(0, Math.min(1, this.delta));
    this.kappa = Math.max(1, Math.min(10, this.kappa));
    return this;
  }

  /**
   * Export to JSON
   */
  toJSON() {
    return {
      alpha: this.alpha,
      beta: this.beta,
      gamma: this.gamma,
      delta: this.delta,
      kappa: this.kappa,
      shadowPenalties: this.shadowPenalties,
      breathRatio: this.breathRatio,
      variancePenalties: this.variancePenalties
    };
  }

  /**
   * Create from JSON
   */
  static fromJSON(json) {
    return new TuningConstants(json);
  }

  /**
   * Create default "balanced" configuration
   */
  static balanced() {
    return new TuningConstants({
      alpha: 0.6,
      beta: 0.5,
      gamma: 0.7,
      delta: 0.9,
      kappa: 4.0
    });
  }

  /**
   * Create "gentle" configuration (forgiving, stable)
   */
  static gentle() {
    return new TuningConstants({
      alpha: 0.7,
      beta: 0.5,
      gamma: 0.8,
      delta: 0.9,
      kappa: 2.0
    });
  }

  /**
   * Create "responsive" configuration (sensitive, dynamic)
   */
  static responsive() {
    return new TuningConstants({
      alpha: 0.5,
      beta: 0.5,
      gamma: 0.6,
      delta: 0.7,
      kappa: 6.0
    });
  }

  /**
   * Create "non-dual" configuration (shadow-aware, relational)
   */
  static nonDual() {
    return new TuningConstants({
      alpha: 0.5,
      beta: 0.5,
      gamma: 0.5,
      delta: 0.5,
      kappa: 4.0
    });
  }
}

