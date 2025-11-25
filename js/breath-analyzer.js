/**
 * ========================================
 * BREATH ANALYZER - Organizational Respiration
 * ========================================
 *
 * The 6 Breath Axes represent fundamental polarities:
 * - Reception (Inhale): Being, receiving, gathering energy
 * - Projection (Exhale): Doing, expressing, releasing energy
 *
 * A healthy organization breathes in balanced rhythm.
 * Over-exhaling = burnout, depletion
 * Over-inhaling = stagnation, unexpressed potential
 */

class BreathAnalyzer {
  constructor() {
    /**
     * The 6 Harmonic Breath Axes
     * Each connects two opposite faces on the dodecahedron
     */
    this.axes = [
      {
        id: 1,
        name: 'Resource Flow',
        projection: 11,  // F11: Funding Pipeline (Exhale: Pursuing, Spending)
        reception: 1,    // F1: Financial Capital (Inhale: Earning, Accumulating)
        archetype: 'The breath of money',
        story: 'Inhale = money coming in. Exhale = money flowing out to fuel growth.',
        emoji: '💰'
      },
      {
        id: 2,
        name: 'Substance & Story',
        projection: 7,   // F7: Brand & Reputation (Exhale: Expressing identity)
        reception: 2,    // F2: Intellectual Capital (Inhale: Building substance)
        archetype: 'The breath of knowledge',
        story: 'Inhale = building real IP and expertise. Exhale = communicating value to world.',
        emoji: '📚'
      },
      {
        id: 3,
        name: 'Being & Doing',
        projection: 8,   // F8: Core Operations (Exhale: Executing, Producing)
        reception: 3,    // F3: Human Capital (Inhale: Growing people, Building capacity)
        archetype: 'The breath of work',
        story: 'Inhale = team development, skill building. Exhale = productive work, delivery.',
        emoji: '⚖️'
      },
      {
        id: 4,
        name: 'Form & Integrity',
        projection: 4,   // F4: Structural Capital (Exhale: Building systems)
        reception: 9,    // F9: Regenerative Flow (Inhale: Renewing foundations)
        archetype: 'The breath of structure',
        story: 'Inhale = ecological renewal, healing. Exhale = creating stable systems.',
        emoji: '🌱'
      },
      {
        id: 5,
        name: 'Perception & Truth',
        projection: 5,   // F5: Market Resonance (Exhale: Seeking validation)
        reception: 10,   // F10: Foundational Values (Inhale: Grounding in truth)
        archetype: 'The breath of integrity',
        story: 'Inhale = staying true to core values. Exhale = testing fit with market.',
        emoji: '🎯'
      },
      {
        id: 6,
        name: 'Network & Fortress',
        projection: 6,   // F6: Community & Partners (Exhale: Building relationships)
        reception: 12,   // F12: Risk & Resilience (Inhale: Protecting boundaries)
        archetype: 'The breath of boundaries',
        story: 'Inhale = building resilience, protecting what matters. Exhale = collaborating, opening.',
        emoji: '🛡️'
      }
    ];

    // Breath ratio thresholds
    this.minBalanced = 0.8;
    this.maxBalanced = 1.2;

    // Golden Ratio constants
    this.PHI = 1.618033988749895;
    this.PHI_INVERSE = 0.618033988749895;
    this.mode = 'normal'; // 'normal' or 'golden'
  }

  /**
   * Set analysis mode
   * @param {string} mode - 'normal' or 'golden'
   */
  setMode(mode) {
    if (mode === 'golden') {
      this.mode = 'golden';
      this.minBalanced = this.PHI_INVERSE; // 0.618
      this.maxBalanced = this.PHI;         // 1.618
      console.log(`✨ Breath Analysis switched to Golden Ratio Mode (φ): [${this.minBalanced.toFixed(3)}, ${this.maxBalanced.toFixed(3)}]`);
    } else {
      this.mode = 'normal';
      this.minBalanced = 0.8;
      this.maxBalanced = 1.2;
      console.log(`📊 Breath Analysis switched to Normal Mode: [${this.minBalanced}, ${this.maxBalanced}]`);
    }
  }

  /**
   * Analyze all 6 breath ratios
   * @param {Array<Object>} faces - Array of face objects with { id, faceEnergy }
   * @returns {Object} Complete breath analysis
   */
  analyze(faces) {
    try {
      // Create face energy lookup
      const faceEnergies = {};
      faces.forEach(face => {
        faceEnergies[face.id] = face.faceEnergy || 0;
      });

      // Calculate breath ratios for all axes
      const breathRatios = this.axes.map(axis => {
        return this.calculateAxisBreath(axis, faceEnergies);
      });

      // Calculate overall breath health
      const overallBreath = this.calculateOverallBreath(breathRatios);

      // Generate insights
      const insights = this.generateInsights(breathRatios, overallBreath);

      return {
        axes: breathRatios,
        overall: overallBreath,
        insights: insights
      };
    } catch (error) {
      console.error('❌ Error in BreathAnalyzer.analyze:', error);
      console.error(error.stack);
      throw error;
    }
  }

  /**
   * Calculate breath ratio for a single axis
   *
   * Breath Ratio (BR) = Reception Energy / Projection Energy
   *
   * Interpretation:
   * - BR < 0.8: Over-exhaling (too much action, not enough regeneration)
   * - BR > 1.2: Over-inhaling (too much reception, not enough expression)
   * - 0.8 ≤ BR ≤ 1.2: Balanced breath
   */
  calculateAxisBreath(axis, faceEnergies) {
    const receptionEnergy = faceEnergies[axis.reception] || 0;
    const projectionEnergy = faceEnergies[axis.projection] || 0;

    // Avoid division by zero
    let breathRatio;
    if (projectionEnergy > 0) {
      breathRatio = receptionEnergy / projectionEnergy;
    } else {
      breathRatio = receptionEnergy > 0 ? 999 : 1; // Very high or neutral
    }

    // Determine breath status
    let status, direction, severity;

    if (breathRatio < this.minBalanced) {
      direction = 'over-exhaling';
      severity = breathRatio < 0.5 ? 'critical' : 'moderate';
      status = 'unbalanced';
    } else if (breathRatio > this.maxBalanced) {
      direction = 'over-inhaling';
      severity = breathRatio > 2.0 ? 'critical' : 'moderate';
      status = 'unbalanced';
    } else {
      direction = 'balanced';
      severity = 'none';
      status = 'healthy';
    }

    // Calculate breath tension (distance from ideal)
    const idealRatio = 1.0;
    const breathTension = Math.abs(breathRatio - idealRatio);

    return {
      axis: axis.name,
      emoji: axis.emoji,
      archetype: axis.archetype,
      story: axis.story,
      receptionFace: axis.reception,
      projectionFace: axis.projection,
      receptionEnergy: receptionEnergy,
      projectionEnergy: projectionEnergy,
      breathRatio: breathRatio,
      breathPercentage: breathRatio * 100,
      status: status,
      direction: direction,
      severity: severity,
      tension: breathTension,
      recommendation: this.getRecommendation(axis, direction, severity)
    };
  }

  /**
   * Calculate overall breath health across all axes
   */
  calculateOverallBreath(breathRatios) {
    const totalAxes = breathRatios.length;
    const balancedAxes = breathRatios.filter(br => br.status === 'healthy').length;
    const overExhaling = breathRatios.filter(br => br.direction === 'over-exhaling').length;
    const overInhaling = breathRatios.filter(br => br.direction === 'over-inhaling').length;
    const criticalAxes = breathRatios.filter(br => br.severity === 'critical').length;

    // Average tension across all axes
    const averageTension = breathRatios.reduce((sum, br) => sum + br.tension, 0) / totalAxes;
    const breathHealth = 1.0 - Math.min(averageTension, 1.0);

    // Determine dominant tendency
    let dominantTendency;
    if (overExhaling > overInhaling + 1) {
      dominantTendency = 'over-exhaling';
    } else if (overInhaling > overExhaling + 1) {
      dominantTendency = 'over-inhaling';
    } else {
      dominantTendency = 'mixed';
    }

    // Overall status and message
    let overallStatus, message;
    if (breathHealth >= 0.8) {
      overallStatus = 'Excellent';
      message = 'Organization breathes with healthy rhythm. Reception and projection are well-balanced.';
    } else if (breathHealth >= 0.6) {
      overallStatus = 'Good';
      message = 'Some breath imbalances detected, but overall health is maintained.';
    } else if (breathHealth >= 0.4) {
      overallStatus = 'Concerning';
      message = 'Significant breath imbalances. Organization may be overextending or under-utilizing itself.';
    } else {
      overallStatus = 'Critical';
      message = 'Severe breath imbalances detected. Risk of burnout or stagnation is high.';
    }

    return {
      breathHealth: breathHealth,
      breathHealthPercentage: breathHealth * 100,
      status: overallStatus,
      message: message,
      dominantTendency: dominantTendency,
      balancedAxes: balancedAxes,
      overExhalingCount: overExhaling,
      overInhalingCount: overInhaling,
      criticalCount: criticalAxes,
      averageTension: averageTension
    };
  }

  /**
   * Generate insights and recommendations
   */
  generateInsights(breathRatios, overallBreath) {
    const insights = [];

    // Overall breath pattern
    if (overallBreath.dominantTendency === 'over-exhaling') {
      insights.push({
        type: 'warning',
        category: 'system',
        message: 'System-wide over-exhaling detected. Organization is projecting more than it is receiving. Risk of depletion and burnout.',
        recommendation: 'Increase investment in foundational capacities: team development, IP building, financial reserves, value clarification.'
      });
    } else if (overallBreath.dominantTendency === 'over-inhaling') {
      insights.push({
        type: 'warning',
        category: 'system',
        message: 'System-wide over-inhaling detected. Organization is receiving more than it is expressing. Risk of stagnation and missed opportunities.',
        recommendation: 'Increase expression and action: accelerate operations, strengthen brand presence, deploy capital, build partnerships.'
      });
    }

    // Critical axes
    const criticalAxes = breathRatios.filter(br => br.severity === 'critical');
    criticalAxes.forEach(axis => {
      insights.push({
        type: 'critical',
        category: 'axis',
        axis: axis.axis,
        message: `Critical imbalance in ${axis.axis}: ${axis.direction}`,
        recommendation: axis.recommendation
      });
    });

    // Highlight best-breathing axis
    const mostBalanced = breathRatios.reduce((best, current) =>
      current.tension < best.tension ? current : best
    );

    if (mostBalanced.status === 'healthy') {
      insights.push({
        type: 'positive',
        category: 'strength',
        message: `Excellent breath rhythm in ${mostBalanced.axis}. This axis can serve as a model for others.`,
        axis: mostBalanced.axis
      });
    }

    return insights;
  }

  /**
   * Get specific recommendation based on axis and imbalance
   */
  getRecommendation(axis, direction, severity) {
    if (direction === 'balanced') {
      return `Maintain healthy rhythm in ${axis.name}. Continue current practices.`;
    }

    const recommendations = {
      'Resource Flow': {
        'over-exhaling': 'Increase revenue streams or reduce burn rate. Financial runway is shrinking.',
        'over-inhaling': 'Deploy more capital into growth initiatives. Money is accumulating but not being used.'
      },
      'Substance & Story': {
        'over-exhaling': 'Invest in real IP development and R&D. Brand is outpacing substance.',
        'over-inhaling': 'Strengthen marketing and brand presence. Hidden brilliance needs visibility.'
      },
      'Being & Doing': {
        'over-exhaling': 'Slow down operations. Invest in team development and well-being. Risk of burnout.',
        'over-inhaling': 'Increase productive output. Team capacity is not being fully utilized.'
      },
      'Form & Integrity': {
        'over-exhaling': 'Invest in regenerative practices. Systems are being built faster than foundations can support.',
        'over-inhaling': 'Consolidate learnings into stable systems and processes. Too much fluidity.'
      },
      'Perception & Truth': {
        'over-exhaling': 'Return to core values and mission. Too much focus on external validation.',
        'over-inhaling': 'Test market fit more actively. Internal conviction needs external validation.'
      },
      'Network & Fortress': {
        'over-exhaling': 'Strengthen boundaries and resilience. Too much openness creates vulnerability.',
        'over-inhaling': 'Open up to partnerships and community. Isolation limits growth.'
      }
    };

    return recommendations[axis.name][direction] || 'Balance this axis by adjusting the opposing energies.';
  }
}

// Expose globally for use in index.html
window.BreathAnalyzer = BreathAnalyzer;

console.log('🫁 Breath Analyzer loaded');
