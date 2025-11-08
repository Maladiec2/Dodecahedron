/**
 * Dodecahedron_Enhanced Class - Complete Mathematical Orchestra
 *
 * This enhanced version orchestrates the full mathematical sophistication:
 * - Pentagram Analysis for all faces
 * - Axis-Informed Energy (shadow integration)
 * - Sensitivity Amplification
 * - Variance Penalties (harmony over power)
 * - Complete calculation pipeline
 *
 * ENHANCEMENTS FROM EXCEL:
 * 1. Full pentagram analysis per face
 * 2. Axis coherence (δ blending with opposite faces)
 * 3. Sensitivity amplifier (κ logistic function)
 * 4. Variance penalties (ρ) for department, octave, and global coherence
 * 5. Harmonic balance metrics
 */

import { KPI } from './KPI_Enhanced.js';
import { Face } from './Face_Enhanced.js';
import { Edge } from './Edge.js';
import { Vertex } from './Vertex.js';
import { SpectralAnalyzer } from './SpectralAnalyzer.js';
import { TuningConstants } from './TuningConstants.js';
import { PentagramAnalyzer } from './PentagramAnalyzer.js';
import { ShadowPenaltyEngine } from './ShadowPenaltyEngine.js';
import { BreathAnalyzer } from './BreathAnalyzer.js';

export class Dodecahedron {
  constructor(tuningConfig = null) {
    this.faces = []; // Array of 12 Face objects
    this.edges = []; // Array of 30 Edge objects
    this.vertices = []; // Array of 20 Vertex objects
    this.kpis = new Map(); // Map of all KPIs by ID for quick lookup

    // Tuning constants - the master control parameters
    this.tuning = tuningConfig ? new TuningConstants(tuningConfig) : TuningConstants.balanced();

    // Analysis engines
    this.spectralAnalyzer = new SpectralAnalyzer();
    this.pentagramAnalyzer = new PentagramAnalyzer(this.tuning);
    this.shadowPenaltyEngine = new ShadowPenaltyEngine(this.tuning);
    this.breathAnalyzer = new BreathAnalyzer(this.tuning);

    // Define the 6 axis pairs (for opposite pole analysis)
    // Each face has a polar opposite that completes its polarity
    this.axisPairs = [
      { face1: 1, face2: 11, name: 'Financial Capital ↔ Funding Pipeline' },
      { face1: 2, face2: 7, name: 'Intellectual Capital ↔ Brand & Reputation' },
      { face1: 3, face2: 8, name: 'Human Capital ↔ Core Operations' },
      { face1: 4, face2: 9, name: 'Structural Capital ↔ Regenerative Flow' },
      { face1: 5, face2: 10, name: 'Market Resonance ↔ Foundational Values' },
      { face1: 6, face2: 12, name: 'Community & Partners ↔ Risk & Resilience' }
    ];

    // Cached global metrics
    this._globalCoherence = null;
    this._globalCoherenceRaw = null; // Before variance penalties
    this._dominantMode = null;
    this._actionPlan = null;
    this._spectralAnalysis = null;
    this._shadowAnalysis = null;
    this._breathAnalysis = null;
    this._harmonicMetrics = null;
  }

  /**
   * Initialize the dodecahedron with faces, edges, and vertices
   */
  initialize(config) {
    // Clear existing data
    this.faces = [];
    this.edges = [];
    this.vertices = [];
    this.kpis = new Map();

    // Initialize from configuration
    if (config.faces) {
      this.faces = config.faces.map(faceData => new Face(faceData));

      // Build KPI map
      this.faces.forEach(face => {
        face.elementalKPIs.forEach(kpi => {
          this.kpis.set(kpi.id, kpi);
        });
      });
    }

    if (config.edges) {
      this.edges = config.edges.map(edgeData => new Edge(edgeData));

      // Add edge KPIs to map
      this.edges.forEach(edge => {
        if (edge.edgeKPI) {
          this.kpis.set(edge.edgeKPI.id, edge.edgeKPI);
        }
      });
    }

    if (config.vertices) {
      this.vertices = config.vertices.map(vertexData => new Vertex(vertexData));
    }

    // Calculate initial state
    this.recalculate();
  }

  /**
   * Get a face by ID
   */
  getFace(faceId) {
    return this.faces.find(f => f.id === faceId);
  }

  /**
   * Get the opposing face on an axis
   */
  getOpposingFace(faceId) {
    for (const axis of this.axisPairs) {
      if (axis.face1 === faceId) {
        return this.getFace(axis.face2);
      }
      if (axis.face2 === faceId) {
        return this.getFace(axis.face1);
      }
    }
    return null; // No opposing face found
  }

  /**
   * Get an edge by ID
   */
  getEdge(edgeId) {
    return this.edges.find(e => e.id === edgeId);
  }

  /**
   * Get a vertex by ID
   */
  getVertex(vertexId) {
    return this.vertices.find(v => v.id === vertexId);
  }

  /**
   * Get a KPI by ID
   */
  getKPI(kpiId) {
    return this.kpis.get(kpiId);
  }

  /**
   * Update a KPI value and recalculate the entire system
   */
  updateKPI(kpiId, newValue) {
    const kpi = this.getKPI(kpiId);
    if (!kpi) {
      throw new Error(`KPI with ID ${kpiId} not found`);
    }

    // Update the value
    kpi.setValue(newValue);

    // Invalidate caches on the face that contains this KPI
    const face = this.getFace(kpi.faceId);
    if (face) {
      face.invalidateCache();
    }

    // Recalculate the entire system
    this.recalculate();

    return this.getState();
  }

  /**
   * Recalculate all metrics across the entire dodecahedron
   * ENHANCED: Full mathematical pipeline with pentagram, axis, and amplifier
   */
  recalculate() {
    // Step 1: Invalidate all face caches
    this.faces.forEach(face => face.invalidateCache());

    // Step 2: Calculate complete face energies (NEW PIPELINE!)
    // This is the core enhancement - orchestrate the full calculation
    this.calculateAllFaceEnergies();

    // Step 3: Calculate edge tensions (with elemental modulation)
    this.edges.forEach(edge => {
      const face1 = this.getFace(edge.face1Id);
      const face2 = this.getFace(edge.face2Id);
      if (face1 && face2) {
        edge.updateMetrics(face1, face2);
      }
    });

    // Step 4: Calculate vertex vortices
    this.vertices.forEach(vertex => {
      const faces = vertex.faceIds.map(faceId => this.getFace(faceId)).filter(f => f);
      if (faces.length === 3) {
        vertex.updateMetrics(faces);
      }
    });

    // Step 5: Perform shadow analysis and apply penalties
    this._shadowAnalysis = this.performShadowAnalysis();

    // Step 6: Calculate harmonic metrics (NEW!)
    this._harmonicMetrics = this.calculateHarmonicMetrics();

    // Step 7: Calculate global coherence (ENHANCED with variance penalties!)
    this._globalCoherence = this.calculateGlobalCoherence();

    // Step 8: Calculate dominant mode
    this._dominantMode = this.calculateDominantMode();

    // Step 9: Calculate action plan
    this._actionPlan = this.calculateActionPlan();

    // Step 10: Perform spectral analysis
    this._spectralAnalysis = this.performSpectralAnalysis();

    // Step 11: Perform breath analysis
    this._breathAnalysis = this.performBreathAnalysis();
  }

  /**
   * Calculate all face energies using the complete mathematical pipeline
   * This orchestrates: Base → Pentagram → Axis → Amplifier → Final
   *
   * NEW: This is the integration point for all enhancements!
   */
  calculateAllFaceEnergies() {
    // For each face, calculate complete energy with full pipeline
    this.faces.forEach(face => {
      // Get the opposing face for this face
      const opposingFace = this.getOpposingFace(face.id);

      // Calculate complete energy using the enhanced pipeline
      face.calculateCompleteEnergy(
        this.pentagramAnalyzer,  // Pentagram engine
        opposingFace,            // Opposing face (for δ blending)
        this.tuning              // Tuning constants (for α, β, γ, δ, κ)
      );
    });
  }

  /**
   * Calculate harmonic metrics
   * NEW: Measures variance and harmony across different levels
   */
  calculateHarmonicMetrics() {
    // Department-level variance (across faces)
    const faceEnergies = this.faces.map(f => f.faceEnergy);
    const faceMean = faceEnergies.reduce((sum, e) => sum + e, 0) / faceEnergies.length;
    const faceVariance = faceEnergies.reduce((sum, e) => {
      const diff = e - faceMean;
      return sum + (diff * diff);
    }, 0) / faceEnergies.length;

    // Octave-level variance (if octave data exists)
    const octaveEnergies = new Array(7).fill(null).map(() => []);
    this.faces.forEach(face => {
      if (face.currentOctave && face.currentOctave >= 1 && face.currentOctave <= 7) {
        octaveEnergies[face.currentOctave - 1].push(face.faceEnergy);
      }
    });

    const octaveVariances = octaveEnergies.map(energies => {
      if (energies.length === 0) return 0;
      const mean = energies.reduce((sum, e) => sum + e, 0) / energies.length;
      return energies.reduce((sum, e) => {
        const diff = e - mean;
        return sum + (diff * diff);
      }, 0) / energies.length;
    });

    const avgOctaveVariance = octaveVariances.reduce((sum, v) => sum + v, 0) / octaveVariances.filter(v => v > 0).length || 0;

    return {
      departmentMean: faceMean,
      departmentVariance: faceVariance,
      departmentStdDev: Math.sqrt(faceVariance),
      octaveVariances: octaveVariances,
      avgOctaveVariance: avgOctaveVariance,
      harmonicBalance: 1 - faceVariance, // Higher when variance is low
      dissonanceIndex: faceVariance
    };
  }

  /**
   * Calculate global coherence score
   * ENHANCED: Now applies variance penalties (ρ) for harmony
   *
   * Formula (from Excel):
   * C_raw = 0.4 × AvgFaceEnergy + 0.3 × AvgEdgeHealth + 0.3 × AvgVertexCoherence
   * C_final = C_raw × (1 - ρ_global × σ²_global)
   */
  calculateGlobalCoherence() {
    // Raw coherence (before penalties)
    const avgFaceEnergy = this.faces.reduce((sum, f) => sum + f.faceEnergy, 0) / this.faces.length;
    const avgEdgeHealth = this.edges.reduce((sum, e) => sum + (1 - e.tension), 0) / this.edges.length;
    const avgVertexCoherence = this.vertices.reduce((sum, v) => sum + v.coherence, 0) / this.vertices.length;

    const rawCoherence = (0.4 * avgFaceEnergy) + (0.3 * avgEdgeHealth) + (0.3 * avgVertexCoherence);
    this._globalCoherenceRaw = rawCoherence;

    // Apply variance penalty (NEW!)
    // This is the "harmony over power" principle from Excel
    const variance = this._harmonicMetrics?.departmentVariance || 0;
    const variancePenalty = this.tuning.variancePenalties.global;

    // Penalized coherence
    const penalizedCoherence = rawCoherence * (1 - variancePenalty * variance);

    return Math.max(0, Math.min(1, penalizedCoherence));
  }

  /**
   * Calculate the dominant mode
   */
  calculateDominantMode() {
    // Find the face with the lowest energy (most critical)
    const criticalFace = this.faces.reduce((lowest, face) =>
      face.faceEnergy < lowest.faceEnergy ? face : lowest
    );

    // Find the vertex with highest vortex strength (most dynamic)
    const dynamicVertex = this.vertices.reduce((highest, vertex) =>
      vertex.vortexStrength > highest.vortexStrength ? vertex : highest
    );

    // Find the edge with highest tension (most strained)
    const strainedEdge = this.edges.reduce((highest, edge) =>
      edge.tension > highest.tension ? edge : highest
    );

    return {
      criticalFace: {
        id: criticalFace.id,
        name: criticalFace.name,
        energy: criticalFace.faceEnergy,
        baseEnergy: criticalFace.baseEnergy,
        localCoherence: criticalFace.localCoherence,
        axisInformedEnergy: criticalFace.axisInformedEnergy
      },
      dynamicVertex: {
        id: dynamicVertex.id,
        name: dynamicVertex.name,
        strength: dynamicVertex.vortexStrength,
        type: dynamicVertex.vortexType
      },
      strainedEdge: {
        id: strainedEdge.id,
        name: strainedEdge.name,
        tension: strainedEdge.tension
      },
      pattern: this.identifySystemPattern()
    };
  }

  /**
   * Identify the overall system pattern
   */
  identifySystemPattern() {
    const coherence = this._globalCoherence || this.calculateGlobalCoherence();
    const avgVortexDirection = this.vertices.reduce((sum, v) => sum + v.vortexDirection, 0) / this.vertices.length;

    if (coherence >= 0.8) {
      return avgVortexDirection > 0 ? 'Ascending Harmony' : 'Stable Excellence';
    } else if (coherence >= 0.6) {
      return avgVortexDirection > 0.3 ? 'Growth Phase' : avgVortexDirection < -0.3 ? 'Contraction Phase' : 'Dynamic Balance';
    } else if (coherence >= 0.4) {
      return avgVortexDirection > 0 ? 'Turbulent Growth' : 'Stressed System';
    } else {
      return avgVortexDirection < 0 ? 'Critical Descent' : 'Chaotic Emergence';
    }
  }

  /**
   * Perform spectral analysis
   */
  performSpectralAnalysis() {
    const faceEnergies = this.faces.map(face => face.faceEnergy);
    const analysis = this.spectralAnalyzer.analyze(faceEnergies);

    // Enrich with face names
    analysis.correctiveActions.addEnergy = analysis.correctiveActions.addEnergy.map(action => ({
      ...action,
      faceName: this.getFace(action.faceId)?.name || `Face ${action.faceId}`,
      criticalKPI: this.getFace(action.faceId)?.criticalKPI
    }));

    analysis.correctiveActions.reduceEnergy = analysis.correctiveActions.reduceEnergy.map(action => ({
      ...action,
      faceName: this.getFace(action.faceId)?.name || `Face ${action.faceId}`
    }));

    return analysis;
  }

  /**
   * Perform shadow analysis
   */
  performShadowAnalysis() {
    const analysis = this.shadowPenaltyEngine.analyze(this.faces, this.kpis);

    analysis.detectedPatterns = analysis.detectedPatterns.map(pattern => ({
      ...pattern,
      affectedFaceNames: pattern.affectedFaces.map(faceId =>
        this.getFace(faceId)?.name || `Face ${faceId}`
      )
    }));

    analysis.recommendations = this.shadowPenaltyEngine.generateRecommendations(analysis.detectedPatterns);

    return analysis;
  }

  /**
   * Perform breath analysis
   */
  performBreathAnalysis() {
    const analysis = this.breathAnalyzer.analyze(this.faces);

    analysis.axes = analysis.axes.map(axis => ({
      ...axis,
      receptionFaceName: this.getFace(axis.receptionFace)?.name || `Face ${axis.receptionFace}`,
      projectionFaceName: this.getFace(axis.projectionFace)?.name || `Face ${axis.projectionFace}`
    }));

    return analysis;
  }

  /**
   * Calculate action plan
   */
  calculateActionPlan() {
    let criticalKPI = null;
    let lowestScore = 1.0;

    this.kpis.forEach(kpi => {
      if (kpi.normalizedScore < lowestScore) {
        lowestScore = kpi.normalizedScore;
        criticalKPI = kpi;
      }
    });

    if (!criticalKPI) {
      return {
        recommendation: 'System is optimally balanced',
        targetKPI: null,
        currentValue: null,
        targetValue: null,
        expectedImpact: 0
      };
    }

    const targetValue = this.calculateTargetValue(criticalKPI);
    const impact = this.estimateImpact(criticalKPI, targetValue);

    return {
      recommendation: `Focus on improving ${criticalKPI.name}`,
      targetKPI: {
        id: criticalKPI.id,
        name: criticalKPI.name,
        currentValue: criticalKPI.value,
        currentScore: criticalKPI.normalizedScore,
        healthStatus: criticalKPI.healthStatus
      },
      targetValue: targetValue,
      expectedImpact: impact,
      reasoning: this.generateReasoning(criticalKPI)
    };
  }

  /**
   * Calculate target value for a KPI
   */
  calculateTargetValue(kpi) {
    switch (kpi.direction) {
      case '↑':
        return kpi.healthyMax;
      case '↓':
        return kpi.healthyMin;
      case 'Band':
        return (kpi.healthyMin + kpi.healthyMax) / 2;
      default:
        return kpi.value;
    }
  }

  /**
   * Estimate impact of improving a KPI
   */
  estimateImpact(kpi, targetValue) {
    const currentValue = kpi.value;
    const currentCoherence = this._globalCoherence;

    kpi.setValue(targetValue);
    const face = this.getFace(kpi.faceId);
    if (face) face.invalidateCache();

    const simulatedCoherence = this.calculateGlobalCoherence();

    kpi.setValue(currentValue);
    if (face) face.invalidateCache();

    return simulatedCoherence - currentCoherence;
  }

  /**
   * Generate reasoning for KPI criticality
   */
  generateReasoning(kpi) {
    const face = this.getFace(kpi.faceId);
    if (!face) return 'This KPI requires attention.';

    const faceHealth = face.healthStatus;
    const kpiHealth = kpi.healthStatus;

    return `The ${face.name} domain is currently ${faceHealth.toLowerCase()}, ` +
           `and ${kpi.name} is in ${kpiHealth.toLowerCase()} status. ` +
           `Improving this metric will create resonance across ${face.elementalKPIs.length} interconnected factors ` +
           `and strengthen the overall coherence of the system.`;
  }

  /**
   * Get the complete state of the system
   * ENHANCED: Now includes full mathematical breakdown
   */
  getState() {
    return {
      timestamp: new Date().toISOString(),
      globalMetrics: {
        coherence: this._globalCoherence,
        coherenceRaw: this._globalCoherenceRaw, // NEW: Before variance penalties
        coherenceStatus: this.getCoherenceStatus(this._globalCoherence),
        pattern: this._dominantMode?.pattern,
        systemIntegrity: this._shadowAnalysis?.systemIntegrity?.score,
        breathHealth: this._breathAnalysis?.overall?.breathHealth,
        // NEW: Harmonic metrics
        harmonicBalance: this._harmonicMetrics?.harmonicBalance,
        dissonanceIndex: this._harmonicMetrics?.dissonanceIndex,
        departmentVariance: this._harmonicMetrics?.departmentVariance
      },
      dominantMode: this._dominantMode,
      actionPlan: this._actionPlan,
      spectralAnalysis: this._spectralAnalysis,
      shadowAnalysis: this._shadowAnalysis,
      breathAnalysis: this._breathAnalysis,
      harmonicMetrics: this._harmonicMetrics, // NEW: Full harmonic breakdown
      tuningConstants: this.tuning.toJSON(),
      faces: this.faces.map(f => f.toJSON()),
      edges: this.edges.map(e => e.toJSON()),
      vertices: this.vertices.map(v => v.toJSON()),
      axisPairs: this.axisPairs, // NEW: Expose axis pairs
      statistics: {
        totalKPIs: this.kpis.size,
        healthyFaces: this.faces.filter(f => f.faceEnergy >= 0.7).length,
        stressedEdges: this.edges.filter(e => e.tension >= 0.6).length,
        leveragePoints: this.vertices.filter(v => v.isLeveragePoint).length,
        shadowPatterns: this._shadowAnalysis?.totalPatternsDetected || 0,
        unbalancedBreathAxes: this._breathAnalysis?.axes?.filter(a => a.status !== 'healthy').length || 0
      }
    };
  }

  /**
   * Get coherence status description
   */
  getCoherenceStatus(coherence) {
    if (coherence >= 0.9) return 'Exceptional';
    if (coherence >= 0.8) return 'Excellent';
    if (coherence >= 0.7) return 'Healthy';
    if (coherence >= 0.6) return 'Moderate';
    if (coherence >= 0.5) return 'Fair';
    if (coherence >= 0.4) return 'Concerning';
    if (coherence >= 0.3) return 'Critical';
    return 'Crisis';
  }

  /**
   * Export configuration
   */
  exportConfig() {
    return {
      faces: this.faces.map(face => ({
        id: face.id,
        name: face.name,
        archetype: face.archetype,
        color: face.color,
        elementalKPIs: face.elementalKPIs.map(kpi => ({
          id: kpi.id,
          name: kpi.name,
          direction: kpi.direction,
          targetMin: kpi.targetMin,
          healthyMin: kpi.healthyMin,
          healthyMax: kpi.healthyMax,
          absoluteMax: kpi.absoluteMax,
          value: kpi.value,
          weight: kpi.weight,
          curvature: kpi.curvature, // NEW
          faceId: kpi.faceId,
          primaryOctave: kpi.primaryOctave
        }))
      })),
      edges: this.edges.map(edge => ({
        id: edge.id,
        name: edge.name,
        face1Id: edge.face1Id,
        face2Id: edge.face2Id,
        elementalNature: edge.elementalNature,
        edgeKPI: edge.edgeKPI ? {
          id: edge.edgeKPI.id,
          name: edge.edgeKPI.name,
          direction: edge.edgeKPI.direction,
          value: edge.edgeKPI.value,
          healthyMin: edge.edgeKPI.healthyMin,
          healthyMax: edge.edgeKPI.healthyMax,
          weight: edge.edgeKPI.weight
        } : null
      })),
      vertices: this.vertices.map(vertex => ({
        id: vertex.id,
        name: vertex.name,
        archetype: vertex.archetype,
        faceIds: vertex.faceIds
      }))
    };
  }
}
