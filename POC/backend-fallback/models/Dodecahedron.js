/**
 * Dodecahedron Class - The Living Geometric Oracle
 * 
 * This is the master container that holds the complete state of the organizational universe.
 * It contains all 12 Faces, 30 Edges, and 20 Vertices, and orchestrates their interactions.
 * 
 * Enhanced with advanced Excel engine capabilities:
 * - Pentagram Analysis (Star Pairs, Intersection Nodes)
 * - Shadow Penalty System (Ethical Conscience)
 * - Breath Analysis (6 Harmonic Axes)
 * - Tuning Constants (Master Control Parameters)
 * - Spectral Analysis (Modal Decomposition)
 */

import { KPI } from './KPI.js';
import { Face } from './Face.js';
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
    this.axisPairs = {
      1: { reception: 1, projection: 11 },   // Financial Capital ↔ Funding Pipeline
      2: { reception: 2, projection: 7 },    // Intellectual Capital ↔ Brand & Reputation
      3: { reception: 3, projection: 8 },    // Human Capital ↔ Core Operations
      4: { reception: 9, projection: 4 },    // Regenerative Flow ↔ Structural Capital
      5: { reception: 10, projection: 5 },   // Foundational Values ↔ Market Resonance
      6: { reception: 12, projection: 6 }    // Risk & Resilience ↔ Community & Partners
    };
    
    // Cached global metrics
    this._globalCoherence = null;
    this._dominantMode = null;
    this._actionPlan = null;
    this._spectralAnalysis = null;
    this._shadowAnalysis = null;
    this._breathAnalysis = null;
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
   */
  recalculate() {
    // Step 1: Calculate face energies (already done via cached properties)
    // Just invalidate caches to ensure fresh calculation
    this.faces.forEach(face => face.invalidateCache());
    
    // Step 2: Calculate edge tensions (with elemental modulation)
    this.edges.forEach(edge => {
      const face1 = this.getFace(edge.face1Id);
      const face2 = this.getFace(edge.face2Id);
      if (face1 && face2) {
        edge.updateMetrics(face1, face2);
      }
    });
    
    // Step 3: Calculate vertex vortices
    this.vertices.forEach(vertex => {
      const faces = vertex.faceIds.map(faceId => this.getFace(faceId)).filter(f => f);
      if (faces.length === 3) {
        vertex.updateMetrics(faces);
      }
    });
    
    // Step 4: Perform shadow analysis and apply penalties
    this._shadowAnalysis = this.performShadowAnalysis();
    
    // Step 5: Calculate global metrics
    this._globalCoherence = this.calculateGlobalCoherence();
    this._dominantMode = this.calculateDominantMode();
    this._actionPlan = this.calculateActionPlan();
    
    // Step 6: Perform spectral analysis
    this._spectralAnalysis = this.performSpectralAnalysis();
    
    // Step 7: Perform breath analysis
    this._breathAnalysis = this.performBreathAnalysis();
  }

  /**
   * Calculate global coherence score
   * This is the overall "health" of the entire organization
   */
  calculateGlobalCoherence() {
    // Global coherence is a weighted combination of:
    // 1. Average face energy (40%)
    // 2. Average edge health (inverted tension) (30%)
    // 3. Average vertex coherence (30%)
    
    const avgFaceEnergy = this.faces.reduce((sum, f) => sum + f.faceEnergy, 0) / this.faces.length;
    
    const avgEdgeHealth = this.edges.reduce((sum, e) => sum + (1 - e.tension), 0) / this.edges.length;
    
    const avgVertexCoherence = this.vertices.reduce((sum, v) => sum + v.coherence, 0) / this.vertices.length;
    
    const globalCoherence = (0.4 * avgFaceEnergy) + (0.3 * avgEdgeHealth) + (0.3 * avgVertexCoherence);
    
    return globalCoherence;
  }

  /**
   * Calculate the dominant mode
   * This identifies the primary pattern or archetype currently expressing in the system
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
        energy: criticalFace.faceEnergy
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
   * Perform spectral analysis on the dodecahedron
   * This uses graph theory and eigenvalue decomposition to reveal deep systemic patterns
   */
  performSpectralAnalysis() {
    // Extract face energies in order
    const faceEnergies = this.faces.map(face => face.faceEnergy);
    
    // Perform the spectral analysis
    const analysis = this.spectralAnalyzer.analyze(faceEnergies);
    
    // Enrich the corrective actions with face names
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
   * Perform shadow analysis - detect archetypal patterns of incoherence
   * This is the "ethical conscience" of the system
   */
  performShadowAnalysis() {
    const analysis = this.shadowPenaltyEngine.analyze(this.faces, this.kpis);
    
    // Enrich detected patterns with face names
    analysis.detectedPatterns = analysis.detectedPatterns.map(pattern => ({
      ...pattern,
      affectedFaceNames: pattern.affectedFaces.map(faceId => 
        this.getFace(faceId)?.name || `Face ${faceId}`
      )
    }));
    
    // Add recommendations
    analysis.recommendations = this.shadowPenaltyEngine.generateRecommendations(analysis.detectedPatterns);
    
    return analysis;
  }

  /**
   * Perform breath analysis - analyze the 6 harmonic axes
   * This reveals the "respiratory rhythm" of the organization
   */
  performBreathAnalysis() {
    const analysis = this.breathAnalyzer.analyze(this.faces);
    
    // Enrich axes with face names
    analysis.axes = analysis.axes.map(axis => ({
      ...axis,
      receptionFaceName: this.getFace(axis.receptionFace)?.name || `Face ${axis.receptionFace}`,
      projectionFaceName: this.getFace(axis.projectionFace)?.name || `Face ${axis.projectionFace}`
    }));
    
    return analysis;
  }

  /**
   * Calculate the Coherence Action Plan
   * This identifies the single highest-leverage action to increase coherence
   */
  calculateActionPlan() {
    // Find the most critical KPI (lowest normalized score)
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
    
    // Calculate target value for this KPI
    const targetValue = this.calculateTargetValue(criticalKPI);
    
    // Estimate impact of fixing this KPI
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
   * Estimate the impact of improving a KPI
   */
  estimateImpact(kpi, targetValue) {
    // Store current state
    const currentValue = kpi.value;
    const currentCoherence = this._globalCoherence;
    
    // Simulate the change
    kpi.setValue(targetValue);
    const face = this.getFace(kpi.faceId);
    if (face) face.invalidateCache();
    
    const simulatedCoherence = this.calculateGlobalCoherence();
    
    // Restore original value
    kpi.setValue(currentValue);
    if (face) face.invalidateCache();
    
    // Return the expected improvement
    return simulatedCoherence - currentCoherence;
  }

  /**
   * Generate reasoning for why this KPI is critical
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
   */
  getState() {
    return {
      timestamp: new Date().toISOString(),
      globalMetrics: {
        coherence: this._globalCoherence,
        coherenceStatus: this.getCoherenceStatus(this._globalCoherence),
        pattern: this._dominantMode?.pattern,
        systemIntegrity: this._shadowAnalysis?.systemIntegrity?.score,
        breathHealth: this._breathAnalysis?.overall?.breathHealth
      },
      dominantMode: this._dominantMode,
      actionPlan: this._actionPlan,
      spectralAnalysis: this._spectralAnalysis,
      shadowAnalysis: this._shadowAnalysis,
      breathAnalysis: this._breathAnalysis,
      tuningConstants: this.tuning.toJSON(),
      faces: this.faces.map(f => f.toJSON()),
      edges: this.edges.map(e => e.toJSON()),
      vertices: this.vertices.map(v => v.toJSON()),
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
   * Export configuration (for saving/loading)
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

