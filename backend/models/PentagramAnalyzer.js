/**
 * PentagramAnalyzer - The Geometric Heart of Face Energy
 * 
 * This implements the sophisticated pentagram analysis from the Excel engine.
 * Each face has:
 * - "The Ball" (primary face KPI)
 * - "The 5 Pillars" (edge KPIs connecting to this face)
 * 
 * The pentagram geometry creates harmonics through:
 * - Star Pair Values (s₁-s₅): Direct connections
 * - Intersection Nodes (p₁-p₅): Secondary harmonics
 * - Center Composite (C): The coherent core
 */

export class PentagramAnalyzer {
  constructor(tuningConstants) {
    this.tuning = tuningConstants;
  }

  /**
   * Perform complete pentagram analysis on a face
   * 
   * @param {number} ballValue - The primary "Ball" KPI value (0-1)
   * @param {Array<number>} pillarValues - The 5 "Pillar" edge KPI values (0-1)
   * @param {Array<number>} pillarWeights - Weights for the 5 pillars (default: 0.2 each)
   * @returns {Object} Complete pentagram analysis
   */
  analyze(ballValue, pillarValues, pillarWeights = [0.2, 0.2, 0.2, 0.2, 0.2]) {
    // Validate inputs
    if (pillarValues.length !== 5) {
      throw new Error('Pentagram requires exactly 5 pillar values');
    }

    // Step 1: Calculate Star Pair Values (s₁ through s₅)
    // These represent the direct pentagram connections
    const starPairs = this.calculateStarPairs(pillarValues);

    // Step 2: Calculate Intersection Nodes (p₁ through p₅)
    // These are where adjacent star pairs meet
    const intersectionNodes = this.calculateIntersectionNodes(starPairs);

    // Step 3: Calculate Center Composite (C)
    // This is the harmonic average of all intersection nodes
    const centerComposite = this.calculateCenterComposite(intersectionNodes);

    // Step 4: Calculate weighted average of pillars (K̄)
    const weightedAvgPillars = this.calculateWeightedAverage(pillarValues, pillarWeights);

    // Step 5: Calculate Nuanced Average Pillar Health
    // This blends the weighted average with the center composite
    const nuancedAvgPillarHealth = this.blendPillarMetrics(
      weightedAvgPillars,
      centerComposite
    );

    // Step 6: Calculate Pillar Symmetry Score (S_f)
    // Measures how evenly distributed the pillar energies are
    const pillarSymmetry = this.calculateSymmetry(pillarValues);

    // Step 7: Calculate Local Coherence Score (E_f)
    // Blends Ball and Pillars using gamma (γ)
    const localCoherence = this.tuning.blendBallAndPillars(
      ballValue,
      nuancedAvgPillarHealth
    );

    return {
      // Raw inputs
      ballValue: ballValue,
      pillarValues: pillarValues,
      
      // Pentagram geometry
      starPairs: starPairs,
      intersectionNodes: intersectionNodes,
      centerComposite: centerComposite,
      
      // Pillar analysis
      weightedAvgPillars: weightedAvgPillars,
      nuancedAvgPillarHealth: nuancedAvgPillarHealth,
      pillarSymmetry: pillarSymmetry,
      
      // Final synthesis
      selfCoherence: ballValue,
      relationalCoherence: nuancedAvgPillarHealth,
      structuralIntegrity: pillarSymmetry,
      localCoherence: localCoherence
    };
  }

  /**
   * Calculate Star Pair Values (s₁ through s₅)
   * Each pair represents the resonance between two pentagram-connected elements
   * 
   * In a pentagram, the connections are:
   * s₁ = f(k₁, k₃)  [element 0 + element 2]
   * s₂ = f(k₂, k₄)  [element 1 + element 3]
   * s₃ = f(k₃, k₅)  [element 2 + element 4]
   * s₄ = f(k₄, k₁)  [element 3 + element 0]
   * s₅ = f(k₅, k₂)  [element 4 + element 1]
   */
  calculateStarPairs(pillarValues) {
    return [
      this.tuning.calculateStarPairValue(pillarValues[0], pillarValues[2]), // s₁
      this.tuning.calculateStarPairValue(pillarValues[1], pillarValues[3]), // s₂
      this.tuning.calculateStarPairValue(pillarValues[2], pillarValues[4]), // s₃
      this.tuning.calculateStarPairValue(pillarValues[3], pillarValues[0]), // s₄
      this.tuning.calculateStarPairValue(pillarValues[4], pillarValues[1])  // s₅
    ];
  }

  /**
   * Calculate Intersection Nodes (p₁ through p₅)
   * These are where adjacent star pairs meet and influence each other
   * 
   * p₁ = f(s₁, s₂)
   * p₂ = f(s₂, s₃)
   * p₃ = f(s₃, s₄)
   * p₄ = f(s₄, s₅)
   * p₅ = f(s₅, s₁)
   */
  calculateIntersectionNodes(starPairs) {
    return [
      this.tuning.calculateIntersectionNode(starPairs[0], starPairs[1]), // p₁
      this.tuning.calculateIntersectionNode(starPairs[1], starPairs[2]), // p₂
      this.tuning.calculateIntersectionNode(starPairs[2], starPairs[3]), // p₃
      this.tuning.calculateIntersectionNode(starPairs[3], starPairs[4]), // p₄
      this.tuning.calculateIntersectionNode(starPairs[4], starPairs[0])  // p₅
    ];
  }

  /**
   * Calculate Center Composite (C)
   * The harmonic core - the average of all intersection nodes
   */
  calculateCenterComposite(intersectionNodes) {
    return intersectionNodes.reduce((sum, node) => sum + node, 0) / intersectionNodes.length;
  }

  /**
   * Calculate weighted average of pillar values
   */
  calculateWeightedAverage(pillarValues, pillarWeights) {
    const totalWeight = pillarWeights.reduce((sum, w) => sum + w, 0);
    const weightedSum = pillarValues.reduce((sum, val, i) => sum + (val * pillarWeights[i]), 0);
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Blend the weighted average with the center composite
   * Uses a 70/30 blend (per Excel constant γ = 0.7)
   */
  blendPillarMetrics(weightedAvg, centerComposite) {
    const blendConstant = 0.7; // Could be made configurable
    return blendConstant * weightedAvg + (1 - blendConstant) * centerComposite;
  }

  /**
   * Calculate Pillar Symmetry Score (S_f)
   * Measures how evenly distributed the pillar energies are
   * 
   * Uses coefficient of variation: CV = stdDev / mean
   * Symmetry = 1 - CV (normalized)
   */
  calculateSymmetry(pillarValues) {
    const mean = pillarValues.reduce((sum, val) => sum + val, 0) / pillarValues.length;
    
    if (mean === 0) return 0;
    
    const variance = pillarValues.reduce((sum, val) => {
      const diff = val - mean;
      return sum + (diff * diff);
    }, 0) / pillarValues.length;
    
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / mean;
    
    // Normalize to 0-1 range
    // A perfect symmetry (all values equal) gives CV=0, hence symmetry=1
    // Higher CV means less symmetry
    const maxCV = 1.0; // Theoretical maximum for 0-1 values
    const normalizedCV = Math.min(coefficientOfVariation / maxCV, 1.0);
    
    return 1.0 - normalizedCV;
  }

  /**
   * Calculate variance penalty
   * This penalizes high variance (low harmony) in the face
   */
  calculateVariancePenalty(pillarValues) {
    const mean = pillarValues.reduce((sum, val) => sum + val, 0) / pillarValues.length;
    
    const variance = pillarValues.reduce((sum, val) => {
      const diff = val - mean;
      return sum + (diff * diff);
    }, 0) / pillarValues.length;
    
    // Apply variance penalty (ρ_dept = 0.3 from Excel)
    const rho = this.tuning.variancePenalties.department;
    return 1.0 - (rho * variance);
  }

  /**
   * Generate human-readable analysis
   */
  generateInsights(analysis) {
    const insights = [];

    // Ball health
    if (analysis.ballValue < 0.5) {
      insights.push({
        type: 'critical',
        message: `Primary KPI is weak (${(analysis.ballValue * 100).toFixed(1)}%). This is the core issue.`
      });
    }

    // Pillar symmetry
    if (analysis.pillarSymmetry < 0.7) {
      insights.push({
        type: 'warning',
        message: `Pillars are imbalanced (symmetry: ${(analysis.pillarSymmetry * 100).toFixed(1)}%). Some relationships are much stronger than others.`
      });
    } else if (analysis.pillarSymmetry > 0.9) {
      insights.push({
        type: 'positive',
        message: `Excellent pillar balance (symmetry: ${(analysis.pillarSymmetry * 100).toFixed(1)}%). All relationships are equally strong.`
      });
    }

    // Ball vs Pillars
    if (analysis.ballValue > analysis.nuancedAvgPillarHealth + 0.2) {
      insights.push({
        type: 'insight',
        message: `Strong internal state but weak relationships. Focus on strengthening connections.`
      });
    } else if (analysis.nuancedAvgPillarHealth > analysis.ballValue + 0.2) {
      insights.push({
        type: 'insight',
        message: `Strong relationships but weak core. Focus on the primary metric.`
      });
    }

    return insights;
  }
}

