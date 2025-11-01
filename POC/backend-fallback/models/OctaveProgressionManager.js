/**
 * OctaveProgressionManager - Manages the 7-octave developmental journey
 * 
 * This class orchestrates the progression through 7 octaves of organizational consciousness,
 * from basic Survival to transcendent Radiance. Each octave represents a developmental stage
 * with its own focus, questions, and elemental KPIs.
 */

export class OctaveProgressionManager {
  constructor() {
    // Define the 7 octaves and their focus
    this.octaves = [
      { id: 1, name: 'Survival', focus: 'Existence', description: 'Do we have it?' },
      { id: 2, name: 'Structure', focus: 'Stability', description: 'Is it organized?' },
      { id: 3, name: 'Relationships', focus: 'Connection', description: 'Are we connected?' },
      { id: 4, name: 'Creativity', focus: 'Possibility', description: 'Can we innovate?' },
      { id: 5, name: 'Expression', focus: 'Clarity', description: 'Are we authentic?' },
      { id: 6, name: 'Vision', focus: 'Direction', description: 'Do we serve a greater purpose?' },
      { id: 7, name: 'Radiance', focus: 'Service', description: 'Are we a gift to the world?' }
    ];

    // Define the 5 elements
    this.elements = ['Earth', 'Water', 'Fire', 'Air', 'Ether'];
    
    // Store octave progression data for each face
    this.faceProgressions = new Map();
    
    // Cache for current octave levels per face
    this.currentOctaveLevels = new Map();
  }

  /**
   * Get octave information by ID
   */
  getOctave(octaveId) {
    return this.octaves.find(o => o.id === octaveId);
  }

  /**
   * Get all octaves
   */
  getAllOctaves() {
    return this.octaves;
  }

  /**
   * Set the octave progression data for a face
   * @param {number} faceId - The face ID (1-12)
   * @param {Array} progressionData - Array of octave data with KPIs for each element
   */
  setFaceProgression(faceId, progressionData) {
    this.faceProgressions.set(faceId, progressionData);
  }

  /**
   * Get the octave progression data for a face
   * @param {number} faceId - The face ID (1-12)
   * @returns {Array} Array of octave data
   */
  getFaceProgression(faceId) {
    return this.faceProgressions.get(faceId) || [];
  }

  /**
   * Get KPIs for a specific face and octave
   * @param {number} faceId - The face ID (1-12)
   * @param {number} octaveId - The octave ID (1-7)
   * @returns {Object} Object containing the ball and 5 pillar KPIs
   */
  getOctaveKPIs(faceId, octaveId) {
    const progression = this.faceProgressions.get(faceId);
    if (!progression) return null;

    const octaveData = progression.find(o => o.octaveId === octaveId);
    if (!octaveData) return null;

    return {
      ball: octaveData.ball,
      pillars: octaveData.pillars || []
    };
  }

  /**
   * Set the current octave level for a face
   * @param {number} faceId - The face ID (1-12)
   * @param {number} octaveLevel - The octave level (1-7)
   */
  setCurrentOctave(faceId, octaveLevel) {
    this.currentOctaveLevels.set(faceId, octaveLevel);
  }

  /**
   * Get the current octave level for a face
   * @param {number} faceId - The face ID (1-12)
   * @returns {number} The current octave level (default: 1)
   */
  getCurrentOctave(faceId) {
    return this.currentOctaveLevels.get(faceId) || 1;
  }

  /**
   * Calculate octave progression score for a face
   * This measures how well the face is fulfilling its current octave requirements
   * @param {number} faceId - The face ID
   * @param {Array<KPI>} currentKPIs - Current KPI values
   * @returns {Object} Progression metrics
   */
  calculateProgressionScore(faceId, currentKPIs) {
    const currentOctave = this.getCurrentOctave(faceId);
    const octaveKPIs = this.getOctaveKPIs(faceId, currentOctave);
    
    if (!octaveKPIs) {
      return {
        score: 0,
        readyForNext: false,
        message: 'No octave data available'
      };
    }

    // Calculate average normalized score for current octave
    let totalScore = 0;
    let kpiCount = 0;

    // Check ball KPI
    if (octaveKPIs.ball) {
      const matchingKPI = currentKPIs.find(k => k.id === octaveKPIs.ball.id);
      if (matchingKPI) {
        totalScore += matchingKPI.normalizedScore;
        kpiCount++;
      }
    }

    // Check pillar KPIs
    octaveKPIs.pillars.forEach(pillar => {
      const matchingKPI = currentKPIs.find(k => k.id === pillar.id);
      if (matchingKPI) {
        totalScore += matchingKPI.normalizedScore;
        kpiCount++;
      }
    });

    const averageScore = kpiCount > 0 ? totalScore / kpiCount : 0;
    
    // Ready for next octave if current average is above 0.8
    const readyForNext = averageScore >= 0.8 && currentOctave < 7;
    
    return {
      score: averageScore,
      currentOctave,
      readyForNext,
      message: this.getProgressionMessage(currentOctave, averageScore, readyForNext)
    };
  }

  /**
   * Get a meaningful message about progression status
   */
  getProgressionMessage(octave, score, readyForNext) {
    const octaveInfo = this.getOctave(octave);
    
    if (score < 0.3) {
      return `Struggling with ${octaveInfo.name} (${octaveInfo.focus}). Focus on basic stability.`;
    } else if (score < 0.6) {
      return `Building foundation in ${octaveInfo.name}. Continue strengthening ${octaveInfo.focus.toLowerCase()}.`;
    } else if (score < 0.8) {
      return `Strong progress in ${octaveInfo.name}. Nearly ready for next stage.`;
    } else if (readyForNext) {
      const nextOctave = this.getOctave(octave + 1);
      return `Mastered ${octaveInfo.name}! Ready to explore ${nextOctave.name} (${nextOctave.focus}).`;
    } else if (octave === 7) {
      return `Achieved Radiance! Operating at highest level of service and consciousness.`;
    }
    
    return `Excellent performance in ${octaveInfo.name}.`;
  }

  /**
   * Create KPI structure from octave template
   * @param {Object} octaveTemplate - Template with KPI definitions
   * @param {number} faceId - Face ID
   * @param {number} octaveId - Octave ID
   * @returns {Object} Ball and pillars KPI structure
   */
  createKPIsFromTemplate(octaveTemplate, faceId, octaveId) {
    const { ball, pillars } = octaveTemplate;
    
    // Create ball KPI
    const ballKPI = {
      id: `F${faceId}_O${octaveId}_BALL`,
      name: ball.name,
      direction: ball.direction,
      targetMin: ball.targetMin,
      healthyMin: ball.healthyMin,
      healthyMax: ball.healthyMax,
      absoluteMax: ball.absoluteMax,
      value: ball.value || 0.5,
      weight: 1.5, // Ball has higher weight
      faceId,
      octave: octaveId,
      element: ball.element,
      question: ball.question,
      rationale: ball.rationale
    };

    // Create pillar KPIs
    const pillarKPIs = pillars.map((pillar, index) => ({
      id: `F${faceId}_O${octaveId}_P${index + 1}`,
      name: pillar.name,
      direction: pillar.direction,
      targetMin: pillar.targetMin,
      healthyMin: pillar.healthyMin,
      healthyMax: pillar.healthyMax,
      absoluteMax: pillar.absoluteMax,
      value: pillar.value || 0.5,
      weight: 1.0,
      faceId,
      octave: octaveId,
      element: this.elements[index],
      question: pillar.question,
      rationale: pillar.rationale
    }));

    return {
      ball: ballKPI,
      pillars: pillarKPIs
    };
  }

  /**
   * Export octave progression state
   */
  toJSON() {
    return {
      octaves: this.octaves,
      elements: this.elements,
      currentOctaveLevels: Object.fromEntries(this.currentOctaveLevels),
      progressions: Object.fromEntries(this.faceProgressions)
    };
  }
}




