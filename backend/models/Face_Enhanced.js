/**
 * Face_Enhanced Class - Full Integration of Pentagram Analysis & Axis Coherence
 *
 * This enhanced version integrates the sophisticated mathematical engine from Excel:
 * - Full Pentagram Analysis (Star Pairs, Intersection Nodes, Center Composite)
 * - Axis-Informed Energy (δ blending with polar opposite face)
 * - Sensitivity Amplifier (κ logistic function)
 * - Variance Penalties for harmonic balance
 *
 * MATHEMATICAL FLOW:
 * 1. Base Energy: Weighted average of elemental KPIs
 * 2. Pentagram Analysis: Star pairs → Intersections → Center → Local Coherence
 * 3. Axis Coherence: Blend with opposing face energy (δ)
 * 4. Sensitivity Amplification: Apply logistic function (κ)
 * 5. Final Face Energy: Complete synthesis
 */

export class Face {
  /**
   * @param {number} id - Face ID (1-12)
   * @param {string} name - Name of this organizational domain
   * @param {Array<KPI>} elementalKPIs - The 5 elemental KPIs for this face
   * @param {string} archetype - The archetypal energy of this face
   * @param {number} currentOctave - Current octave level (1-7)
   * @param {Object} octaveProgressions - Octave-specific KPI configurations
   * @param {KPI} ballKPI - Primary "Ball" KPI (optional, for octave progression)
   * @param {Array<KPI>} pillarKPIs - 5 "Pillar" edge KPIs (optional, for transition architecture)
   */
  constructor({
    id,
    name = '',
    elementalKPIs = [],
    archetype = '',
    color = '#ffffff',
    currentOctave = 1,
    octaveProgressions = {},
    ballKPI = null,
    pillarKPIs = []
  }) {
    this.id = id;
    this.name = name;
    this.elementalKPIs = elementalKPIs; // Array of 5 elemental KPIs
    this.archetype = archetype;
    this.color = color;
    this.currentOctave = currentOctave;
    this.octaveProgressions = octaveProgressions;

    // Ball and Pillars structure (for compatibility with transition architecture)
    this.ballKPI = ballKPI;
    this.pillarKPIs = pillarKPIs;

    // Pentagram indices - how the 5 elements interact in star pattern
    this.pentagramConnections = [
      [0, 2, 4], // Element 0 connects to 2 and 4
      [1, 3, 0], // Element 1 connects to 3 and 0
      [2, 4, 1], // Element 2 connects to 4 and 1
      [3, 0, 2], // Element 3 connects to 0 and 2
      [4, 1, 3]  // Element 4 connects to 1 and 3
    ];

    // Cache for calculated values
    this._baseEnergy = null;
    this._pentagramAnalysis = null;
    this._localCoherence = null;
    this._axisInformedEnergy = null;
    this._finalFaceEnergy = null;
    this._octaveCoherence = null;
  }

  /**
   * Get all KPIs for this face
   */
  get kpis() {
    return this.elementalKPIs;
  }

  /**
   * Calculate the base face energy (average of weighted KPI scores)
   * This is E_base in the Excel formulas
   */
  calculateBaseFaceEnergy() {
    if (this.elementalKPIs.length === 0) return 0;

    const totalWeight = this.elementalKPIs.reduce((sum, kpi) => sum + kpi.weight, 0);
    const weightedSum = this.elementalKPIs.reduce((sum, kpi) => sum + kpi.weightedScore, 0);

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Calculate full pentagram analysis using PentagramAnalyzer
   * This is the sophisticated Excel engine: Star Pairs, Intersection Nodes, Center Composite
   *
   * @param {PentagramAnalyzer} pentagramAnalyzer - The pentagram engine (injected)
   * @returns {Object} Complete pentagram analysis
   */
  calculatePentagramAnalysis(pentagramAnalyzer) {
    if (this.elementalKPIs.length < 5) {
      console.warn(`Face ${this.id} has fewer than 5 elemental KPIs. Cannot perform pentagram analysis.`);
      return null;
    }

    // Extract normalized scores and weights
    const pillarValues = this.elementalKPIs.map(kpi => kpi.normalizedScore);
    const pillarWeights = this.elementalKPIs.map(kpi => kpi.weight);

    // For now, use base energy as "ball" value (can be enhanced with dedicated ball KPI)
    const ballValue = this.ballKPI ? this.ballKPI.normalizedScore : this.calculateBaseFaceEnergy();

    // Perform full pentagram analysis
    const analysis = pentagramAnalyzer.analyze(ballValue, pillarValues, pillarWeights);

    return analysis;
  }

  /**
   * Calculate local coherence from pentagram analysis
   * This is E_f_local in Excel formulas
   *
   * @param {PentagramAnalyzer} pentagramAnalyzer - The pentagram engine
   * @returns {number} Local coherence score (0-1)
   */
  calculateLocalCoherence(pentagramAnalyzer) {
    const analysis = this.calculatePentagramAnalysis(pentagramAnalyzer);

    if (!analysis) {
      // Fallback to simple base energy
      return this.calculateBaseFaceEnergy();
    }

    // Store the full analysis for inspection
    this._pentagramAnalysis = analysis;

    // Return local coherence (blend of ball and pillars via γ)
    return analysis.localCoherence;
  }

  /**
   * Apply axis-informed energy (δ blending with opposing face)
   * This is the "shadow integration" - recognizing that complementary opposites
   * form polarities that define each other
   *
   * Formula: E_axis = δ × E_local + (1-δ) × E_opposite
   *
   * @param {number} localEnergy - This face's local coherence
   * @param {Face} opposingFace - The polar opposite face on the dodecahedral axis
   * @param {TuningConstants} tuningConstants - System tuning parameters
   * @returns {number} Axis-informed energy (0-1)
   */
  calculateAxisInformedEnergy(localEnergy, opposingFace, tuningConstants) {
    if (!opposingFace) {
      // No opposite face defined - return local energy
      return localEnergy;
    }

    // Get opposite face's local coherence
    // Note: We use _localCoherence if cached, otherwise use faceEnergy
    const oppositeEnergy = opposingFace._localCoherence || opposingFace.calculateBaseFaceEnergy();

    // Apply δ (delta) blending
    const axisInformed = tuningConstants.applyAxisCoherence(localEnergy, oppositeEnergy);

    return axisInformed;
  }

  /**
   * Calculate final face energy with sensitivity amplifier
   * This applies the κ (kappa) logistic function for non-linear response
   *
   * Formula: E_final = 1 / (1 + e^(-κ*(E_axis - 0.5)))
   *
   * @param {number} axisInformedEnergy - Energy after axis blending
   * @param {TuningConstants} tuningConstants - System tuning parameters
   * @returns {number} Final amplified energy (0-1)
   */
  calculateFinalFaceEnergy(axisInformedEnergy, tuningConstants) {
    // Apply sensitivity amplifier (κ logistic function)
    const amplified = tuningConstants.applySensitivityAmplifier(axisInformedEnergy);

    return amplified;
  }

  /**
   * Complete calculation pipeline with full mathematical sophistication
   * This orchestrates all the enhancements:
   * Base → Pentagram → Axis → Amplifier → Final
   *
   * @param {PentagramAnalyzer} pentagramAnalyzer - Pentagram engine
   * @param {Face} opposingFace - Opposite face on axis (optional)
   * @param {TuningConstants} tuningConstants - Tuning parameters
   * @returns {number} Final face energy (0-1)
   */
  calculateCompleteEnergy(pentagramAnalyzer, opposingFace, tuningConstants) {
    // Step 1: Calculate base energy
    this._baseEnergy = this.calculateBaseFaceEnergy();

    // Step 2: Calculate local coherence via pentagram analysis
    this._localCoherence = this.calculateLocalCoherence(pentagramAnalyzer);

    // Step 3: Apply axis coherence (shadow integration)
    this._axisInformedEnergy = this.calculateAxisInformedEnergy(
      this._localCoherence,
      opposingFace,
      tuningConstants
    );

    // Step 4: Apply sensitivity amplifier
    this._finalFaceEnergy = this.calculateFinalFaceEnergy(
      this._axisInformedEnergy,
      tuningConstants
    );

    return this._finalFaceEnergy;
  }

  /**
   * Get face energy (cached)
   * This is the main accessor for face energy
   */
  get faceEnergy() {
    if (this._finalFaceEnergy === null) {
      // If not calculated via complete pipeline, fallback to base energy
      return this.calculateBaseFaceEnergy();
    }
    return this._finalFaceEnergy;
  }

  /**
   * Get base energy (cached)
   */
  get baseEnergy() {
    if (this._baseEnergy === null) {
      this._baseEnergy = this.calculateBaseFaceEnergy();
    }
    return this._baseEnergy;
  }

  /**
   * Get local coherence (cached)
   */
  get localCoherence() {
    return this._localCoherence || this.calculateBaseFaceEnergy();
  }

  /**
   * Get axis-informed energy (cached)
   */
  get axisInformedEnergy() {
    return this._axisInformedEnergy || this.localCoherence;
  }

  /**
   * Get pentagram analysis results (cached)
   */
  get pentagramAnalysis() {
    return this._pentagramAnalysis;
  }

  /**
   * Invalidate caches when KPIs change
   */
  invalidateCache() {
    this._baseEnergy = null;
    this._pentagramAnalysis = null;
    this._localCoherence = null;
    this._axisInformedEnergy = null;
    this._finalFaceEnergy = null;
    this._octaveCoherence = null;
  }

  /**
   * Get the most critical (lowest scoring) KPI on this face
   */
  get criticalKPI() {
    if (this.elementalKPIs.length === 0) return null;

    return this.elementalKPIs.reduce((lowest, kpi) =>
      kpi.normalizedScore < lowest.normalizedScore ? kpi : lowest
    );
  }

  /**
   * Get health status
   */
  get healthStatus() {
    const energy = this.faceEnergy;
    if (energy >= 0.9) return 'Radiant';
    if (energy >= 0.7) return 'Healthy';
    if (energy >= 0.5) return 'Dimming';
    if (energy >= 0.3) return 'Struggling';
    return 'Critical';
  }

  /**
   * Get color based on energy level
   */
  getEnergyColor() {
    const energy = this.faceEnergy;

    // Color gradient from red (0) to yellow (0.5) to green (1.0)
    if (energy >= 0.7) {
      // Green zone
      const t = (energy - 0.7) / 0.3;
      return this.interpolateColor('#66ff66', '#00ff00', t);
    } else if (energy >= 0.4) {
      // Yellow zone
      const t = (energy - 0.4) / 0.3;
      return this.interpolateColor('#ffff00', '#66ff66', t);
    } else {
      // Red zone
      const t = energy / 0.4;
      return this.interpolateColor('#ff0000', '#ffff00', t);
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
   * Set the current octave level and update KPIs accordingly
   * @param {number} octaveLevel - The octave level (1-7)
   */
  setOctaveLevel(octaveLevel) {
    if (octaveLevel < 1 || octaveLevel > 7) {
      throw new Error('Octave level must be between 1 and 7');
    }

    this.currentOctave = octaveLevel;
    this.invalidateCache();

    // If we have octave progressions, update the ball and pillar KPIs
    if (this.octaveProgressions[octaveLevel]) {
      this.updateKPIsForOctave(octaveLevel);
    }
  }

  /**
   * Update KPIs based on octave progression data
   * @param {number} octaveLevel - The octave level
   */
  updateKPIsForOctave(octaveLevel) {
    const octaveData = this.octaveProgressions[octaveLevel];
    if (!octaveData) return;

    // Set ball KPI
    if (octaveData.ball) {
      this.ballKPI = octaveData.ball;
      this.ballKPI.kpiType = 'ball';
      this.ballKPI.weight = 1.5; // Ball has higher weight
    }

    // Set pillar KPIs
    if (octaveData.pillars && octaveData.pillars.length > 0) {
      this.pillarKPIs = octaveData.pillars.map((pillar, index) => {
        pillar.kpiType = 'pillar';
        pillar.weight = 1.0;
        return pillar;
      });
    }

    // Update elemental KPIs to include ball and pillars
    this.elementalKPIs = [this.ballKPI, ...this.pillarKPIs].filter(kpi => kpi !== null);
  }

  /**
   * Calculate octave coherence - how well the face aligns with its current octave
   * @returns {number} Coherence score (0-1)
   */
  calculateOctaveCoherence() {
    if (!this.ballKPI || this.pillarKPIs.length === 0) {
      return 0;
    }

    // Ball contributes 40%, pillars contribute 60%
    const ballWeight = 0.4;
    const pillarWeight = 0.6;

    // Ball coherence
    const ballScore = this.ballKPI.normalizedScore || 0;

    // Average pillar coherence
    const pillarScores = this.pillarKPIs.map(kpi => kpi.normalizedScore || 0);
    const avgPillarScore = pillarScores.reduce((sum, score) => sum + score, 0) / pillarScores.length;

    // Combined coherence
    const coherence = (ballScore * ballWeight) + (avgPillarScore * pillarWeight);

    // Apply octave progression penalty (higher octaves require higher coherence)
    const octavePenalty = 1 - (0.05 * (this.currentOctave - 1)); // 5% penalty per octave

    return coherence * octavePenalty;
  }

  /**
   * Get octave coherence (cached)
   */
  get octaveCoherence() {
    if (this._octaveCoherence === null) {
      this._octaveCoherence = this.calculateOctaveCoherence();
    }
    return this._octaveCoherence;
  }

  /**
   * Check if ready for next octave
   * @returns {boolean} True if ready to progress
   */
  isReadyForNextOctave() {
    // Need at least 80% coherence to progress
    return this.octaveCoherence >= 0.8 && this.currentOctave < 7;
  }

  /**
   * Get octave progression status
   * @returns {Object} Status information
   */
  getOctaveStatus() {
    const octaveNames = [
      'Survival', 'Structure', 'Relationships', 'Creativity',
      'Expression', 'Vision', 'Radiance'
    ];

    return {
      currentOctave: this.currentOctave,
      octaveName: octaveNames[this.currentOctave - 1],
      coherence: this.octaveCoherence,
      readyForNext: this.isReadyForNextOctave(),
      nextOctave: this.currentOctave < 7 ? octaveNames[this.currentOctave] : null
    };
  }

  /**
   * Export to JSON with full mathematical breakdown
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      archetype: this.archetype,

      // Energy levels (complete pipeline)
      baseEnergy: this.baseEnergy,
      localCoherence: this.localCoherence,
      axisInformedEnergy: this.axisInformedEnergy,
      faceEnergy: this.faceEnergy, // Final energy after all transformations

      // Pentagram analysis
      pentagramAnalysis: this._pentagramAnalysis,

      // Status
      healthStatus: this.healthStatus,
      color: this.getEnergyColor(),

      // KPIs
      elementalKPIs: this.elementalKPIs.map(kpi => kpi.toJSON()),
      criticalKPI: this.criticalKPI ? this.criticalKPI.id : null,

      // Octave progression
      currentOctave: this.currentOctave,
      octaveCoherence: this.octaveCoherence,
      octaveStatus: this.getOctaveStatus(),
      ballKPI: this.ballKPI ? this.ballKPI.toJSON() : null,
      pillarKPIs: this.pillarKPIs.map(kpi => kpi.toJSON())
    };
  }
}
