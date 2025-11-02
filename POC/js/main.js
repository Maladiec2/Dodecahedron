/**
 * ========================================
 * QUANNEX - Serverless POC Edition
 * ========================================
 *
 * A self-contained, browser-based organizational coherence engine.
 * No backend server required - all processing happens in the browser.
 *
 * Architecture:
 * - CSV Parser: Loads and parses CSV data files
 * - Data Models: KPI, Face, Edge, Vertex classes
 * - Math Engine: Coherence calculations
 * - API Interface: Simple methods for UI to call
 */

// ========================================
// UTILITY: CSV Parser
// ========================================

/**
 * Parse CSV text into array of objects
 * @param {string} csvText - Raw CSV content
 * @returns {Array<Object>} Parsed data with headers as keys
 */
function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    data.push(row);
  }

  return data;
}

/**
 * Load CSV file from data folder
 * @param {string} filename - Name of CSV file
 * @returns {Promise<Array<Object>>} Parsed CSV data
 */
async function loadCSV(filename) {
  try {
    const response = await fetch(`./data/${filename}`);
    const text = await response.text();
    return parseCSV(text);
  } catch (error) {
    console.error(`Failed to load ${filename}:`, error);
    return [];
  }
}

// ========================================
// MODEL: KPI (Key Performance Indicator)
// ========================================

/**
 * Represents a single KPI with normalization and scoring logic
 */
class KPI {
  constructor(config) {
    this.id = config.id || '';
    this.name = config.name || '';
    this.value = parseFloat(config.value) || 0;
    this.weight = parseFloat(config.weight) || 1.0;
    this.direction = config.direction || '↑'; // ↑, ↓, or Band

    // Normalization parameters
    this.targetMin = parseFloat(config.targetMin) || 0;
    this.targetIdeal = parseFloat(config.targetIdeal) || 100;
    this.healthyMin = parseFloat(config.healthyMin) || this.targetMin;
    this.healthyMax = parseFloat(config.healthyMax) || this.targetIdeal;
    this.absoluteMax = parseFloat(config.absoluteMax) || this.targetIdeal * 2;

    // Metadata
    this.faceId = config.faceId || null;
    this.element = config.element || null; // Earth, Water, Fire, Air, Ether
  }

  /**
   * Calculate normalized score (0 to 1) based on KPI direction
   */
  get normalizedScore() {
    switch (this.direction) {
      case '↑':
        return this.normalizeUp();
      case '↓':
        return this.normalizeDown();
      case 'Band':
        return this.normalizeBand();
      default:
        return this.normalizeUp();
    }
  }

  /**
   * ↑ (Up is Better): More is better - linear increase
   */
  normalizeUp() {
    if (this.value >= this.targetIdeal) return 1.0;
    if (this.value <= this.targetMin) return 0.0;
    return (this.value - this.targetMin) / (this.targetIdeal - this.targetMin);
  }

  /**
   * ↓ (Down is Better): Less is better - linear decrease
   */
  normalizeDown() {
    if (this.value <= this.targetMin) return 1.0;
    if (this.value >= this.absoluteMax) return 0.0;
    return 1 - ((this.value - this.targetMin) / (this.absoluteMax - this.targetMin));
  }

  /**
   * Band (Plateau): Sweet spot between healthyMin and healthyMax
   */
  normalizeBand() {
    // Perfect plateau: within healthy range
    if (this.value >= this.healthyMin && this.value <= this.healthyMax) {
      return 1.0;
    }

    // Below plateau: linear rise from targetMin to healthyMin
    if (this.value < this.healthyMin) {
      if (this.value <= this.targetMin) return 0.0;
      return (this.value - this.targetMin) / (this.healthyMin - this.targetMin);
    }

    // Above plateau: linear decline from healthyMax to absoluteMax
    if (this.value >= this.absoluteMax) return 0.0;
    return 1 - ((this.value - this.healthyMax) / (this.absoluteMax - this.healthyMax));
  }

  /**
   * Get weighted score (normalized score × weight)
   */
  get weightedScore() {
    return this.normalizedScore * this.weight;
  }
}

// ========================================
// MODEL: Face (Organizational Domain)
// ========================================

/**
 * Represents one of the 12 faces of the dodecahedron
 * Each face is an organizational domain (e.g., Financial Capital, Human Capital)
 */
class Face {
  constructor(config) {
    this.id = config.id || 0;
    this.name = config.name || '';
    this.elementalKPIs = config.elementalKPIs || []; // 5 KPIs (one per element)
    this.ballKPI = config.ballKPI || null; // Primary/headline KPI

    // Cached values
    this._faceEnergy = null;
    this._harmonicResonance = null;
  }

  /**
   * Calculate base face energy (weighted average of KPI scores)
   */
  calculateBaseFaceEnergy() {
    if (this.elementalKPIs.length === 0) return 0;

    const totalWeight = this.elementalKPIs.reduce((sum, kpi) => sum + kpi.weight, 0);
    const weightedSum = this.elementalKPIs.reduce((sum, kpi) => sum + kpi.weightedScore, 0);

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Calculate harmonic resonance (how well the 5 elements work together)
   * Uses pentagram geometry: each element connects to 2 non-adjacent elements
   */
  calculateHarmonicResonance() {
    if (this.elementalKPIs.length < 5) return 0;

    // Pentagram connections (0-indexed)
    const connections = [
      [0, 2, 4], // Element 0 connects to 2 and 4
      [1, 3, 0], // Element 1 connects to 3 and 0
      [2, 4, 1], // Element 2 connects to 4 and 1
      [3, 0, 2], // Element 3 connects to 0 and 2
      [4, 1, 3]  // Element 4 connects to 1 and 3
    ];

    let totalResonance = 0;

    for (let i = 0; i < 5; i++) {
      const element = this.elementalKPIs[i];
      const [conn1, conn2] = connections[i];

      // Calculate resonance with each connected element
      const connected1 = this.elementalKPIs[conn1];
      const connected2 = this.elementalKPIs[conn2];

      // Resonance is higher when values are similar (harmony)
      const diff1 = Math.abs(element.normalizedScore - connected1.normalizedScore);
      const diff2 = Math.abs(element.normalizedScore - connected2.normalizedScore);

      totalResonance += (1.0 - diff1) + (1.0 - diff2);
    }

    // Average across all 10 connections in pentagram
    return totalResonance / 10;
  }

  /**
   * Calculate final face energy with harmonic boost
   * Formula: E_f = E_base × (1 + 0.3 × R_harmonic)
   */
  calculateFinalFaceEnergy() {
    const baseEnergy = this.calculateBaseFaceEnergy();
    const resonance = this.calculateHarmonicResonance();

    // Harmonic resonance can boost energy by up to 30%
    return baseEnergy * (1.0 + (0.3 * resonance));
  }

  /**
   * Get face energy (with caching)
   */
  get faceEnergy() {
    if (this._faceEnergy === null) {
      this._faceEnergy = this.calculateFinalFaceEnergy();
    }
    return this._faceEnergy;
  }

  /**
   * Invalidate cache when KPIs change
   */
  invalidateCache() {
    this._faceEnergy = null;
    this._harmonicResonance = null;
  }

  /**
   * Get health status as string
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
   * Get color based on energy level (for visualization)
   */
  getEnergyColor() {
    const energy = this.faceEnergy;

    if (energy >= 0.7) {
      // Green zone: interpolate from light green to bright green
      const t = (energy - 0.7) / 0.3;
      return this.interpolateColor('#66ff66', '#00ff00', t);
    } else if (energy >= 0.4) {
      // Yellow zone: interpolate from yellow to light green
      const t = (energy - 0.4) / 0.3;
      return this.interpolateColor('#ffff00', '#66ff66', t);
    } else {
      // Red zone: interpolate from red to yellow
      const t = energy / 0.4;
      return this.interpolateColor('#ff0000', '#ffff00', t);
    }
  }

  /**
   * Helper: Interpolate between two hex colors
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
}

// ========================================
// MODEL: Edge (Relationship between Faces)
// ========================================

/**
 * Represents an edge connecting two faces
 * Measures the relationship quality/tension between two domains
 */
class Edge {
  constructor(config) {
    this.id = config.id || '';
    this.faceA = config.faceA || null;
    this.faceB = config.faceB || null;
    this.element = config.element || 'Ether'; // Earth, Water, Fire, Air, Ether
  }

  /**
   * Calculate edge tension (difference in face energies)
   */
  calculateTension() {
    if (!this.faceA || !this.faceB) return 0;
    return Math.abs(this.faceA.faceEnergy - this.faceB.faceEnergy);
  }

  /**
   * Get elemental multiplier (affects how tension flows)
   */
  getElementalMultiplier() {
    const multipliers = {
      'Fire': 1.3,   // Amplifies tension and flow
      'Air': 1.1,    // Accelerates flow
      'Ether': 1.0,  // Neutral/balanced
      'Water': 0.9,  // Smooths and dampens
      'Earth': 0.8   // Stabilizes and grounds
    };
    return multipliers[this.element] || 1.0;
  }

  /**
   * Calculate final modulated tension
   */
  get tension() {
    return this.calculateTension() * this.getElementalMultiplier();
  }

  /**
   * Calculate health (inverse of tension)
   */
  get health() {
    return 1.0 - this.tension;
  }
}

// ========================================
// MODEL: Vertex (Convergence Point)
// ========================================

/**
 * Represents a vertex where 3 faces meet
 * Shows transformation potential and vortex dynamics
 */
class Vertex {
  constructor(config) {
    this.id = config.id || 0;
    this.faces = config.faces || []; // Array of 3 Face objects
  }

  /**
   * Calculate V-Mean (average energy of 3 converging faces)
   */
  get vMean() {
    if (this.faces.length !== 3) return 0;
    return this.faces.reduce((sum, face) => sum + face.faceEnergy, 0) / 3;
  }

  /**
   * Calculate Vortex Strength (variance in energies = dissonance)
   */
  get vortexStrength() {
    if (this.faces.length !== 3) return 0;

    const mean = this.vMean;
    const differences = this.faces.map(face => Math.abs(face.faceEnergy - mean));

    return differences.reduce((sum, diff) => sum + diff, 0) / 3;
  }

  /**
   * Get vortex status
   */
  get vortexStatus() {
    const strength = this.vortexStrength;
    if (strength < 0.1) return 'Harmonious';
    if (strength < 0.3) return 'Balanced';
    if (strength < 0.5) return 'Turbulent';
    return 'Critical';
  }
}

// ========================================
// ENGINE: Dodecahedron System
// ========================================

/**
 * Main coherence engine orchestrating all 12 faces, 30 edges, 20 vertices
 */
class DodecahedronEngine {
  constructor() {
    this.faces = [];
    this.edges = [];
    this.vertices = [];
    this.kpis = new Map(); // id -> KPI object
  }

  /**
   * Initialize system from CSV data
   */
  async initialize() {
    console.log('🌟 Initializing Quannex Coherence Engine...');

    // Load CSV data
    const kpiData = await loadCSV('CSV_KPI_Database.csv');
    const faceData = await loadCSV('CSV_Face_Models.csv');

    // Create KPIs
    this.createKPIs(kpiData);

    // Create Faces (simplified for POC)
    this.createFaces();

    // Calculate initial state
    this.recalculate();

    console.log('✅ System initialized');
    console.log(`📊 Loaded ${this.faces.length} faces, ${this.kpis.size} KPIs`);
    console.log(`🎯 Global Coherence: ${(this.getGlobalCoherence() * 100).toFixed(1)}%`);
  }

  /**
   * Initialize system with company-specific data
   */
  async initializeWithCompany(company) {
    console.log(`🌟 Initializing with company: ${company.name}`);

    // Clear existing data
    this.faces = [];
    this.edges = [];
    this.vertices = [];
    this.kpis = new Map();

    // Create KPIs from company data
    this.createKPIs(company.kpis);

    // Create Faces
    this.createFaces();

    // Calculate initial state
    this.recalculate();

    console.log('✅ Company loaded');
    console.log(`📊 ${company.name}: ${this.faces.length} faces, ${this.kpis.size} KPIs`);
    console.log(`🎯 Global Coherence: ${(this.getGlobalCoherence() * 100).toFixed(1)}%`);
  }

  /**
   * Create KPI objects from CSV data
   */
  createKPIs(data) {
    data.forEach(row => {
      if (!row.KPI_ID) return;

      const kpi = new KPI({
        id: row.KPI_ID,
        name: row.KPI_Name || row.KPI_ID,
        value: parseFloat(row.Value) || 0,
        weight: parseFloat(row.Weight) || 1.0,
        direction: row.Direction || '↑',
        targetMin: parseFloat(row.Target_Min) || 0,
        targetIdeal: parseFloat(row.Target_Ideal) || 100,
        healthyMin: parseFloat(row.Healthy_Min),
        healthyMax: parseFloat(row.Healthy_Max),
        absoluteMax: parseFloat(row.Absolute_Max),
        faceId: parseInt(row.Face_ID) || null
      });

      this.kpis.set(kpi.id, kpi);
    });
  }

  /**
   * Create Face objects (simplified for POC - uses sample data)
   */
  createFaces() {
    const faceNames = [
      'Financial Capital',
      'Intellectual Capital',
      'Human Capital',
      'Structural Capital',
      'Market Resonance',
      'Community & Partners',
      'Brand & Reputation',
      'Core Operations',
      'Regenerative Flow',
      'Foundational Values',
      'Funding Pipeline',
      'Risk & Resilience'
    ];

    faceNames.forEach((name, index) => {
      const faceId = index + 1;

      // Get KPIs for this face
      const faceKPIs = Array.from(this.kpis.values())
        .filter(kpi => kpi.faceId === faceId)
        .slice(0, 5); // Take first 5 for elemental KPIs

      const face = new Face({
        id: faceId,
        name: name,
        elementalKPIs: faceKPIs,
        ballKPI: faceKPIs[0] || null // First KPI is the ball
      });

      this.faces.push(face);
    });
  }

  /**
   * Recalculate entire system state
   */
  recalculate() {
    // Invalidate all caches
    this.faces.forEach(face => face.invalidateCache());

    // Recalculate face energies (happens automatically via getters)
    this.faces.forEach(face => {
      const energy = face.faceEnergy; // Trigger calculation
    });
  }

  /**
   * Get global coherence score
   */
  getGlobalCoherence() {
    if (this.faces.length === 0) return 0;

    const totalEnergy = this.faces.reduce((sum, face) => sum + face.faceEnergy, 0);
    return totalEnergy / this.faces.length;
  }

  /**
   * Get system state (for UI)
   */
  getState() {
    return {
      globalCoherence: this.getGlobalCoherence(),
      faces: this.faces.map(face => ({
        id: face.id,
        name: face.name,
        energy: face.faceEnergy,
        status: face.healthStatus,
        color: face.getEnergyColor()
      })),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Update a KPI value
   */
  updateKPI(kpiId, newValue) {
    const kpi = this.kpis.get(kpiId);
    if (!kpi) {
      console.error(`KPI ${kpiId} not found`);
      return false;
    }

    kpi.value = newValue;
    this.recalculate();

    console.log(`✅ Updated ${kpi.name} to ${newValue}`);
    console.log(`🎯 New Global Coherence: ${(this.getGlobalCoherence() * 100).toFixed(1)}%`);

    return true;
  }
}

// ========================================
// API: Global Interface
// ========================================

// Create global engine instance
const quannexEngine = new DodecahedronEngine();

// Expose API for HTML to use
window.Quannex = {
  /**
   * Initialize the engine
   */
  async init() {
    await quannexEngine.initialize();
    return quannexEngine.getState();
  },

  /**
   * Initialize the engine with company-specific data
   */
  async initWithCompany(company) {
    await quannexEngine.initializeWithCompany(company);
    return quannexEngine.getState();
  },

  /**
   * Get current system state
   */
  getState() {
    return quannexEngine.getState();
  },

  /**
   * Update a KPI value
   */
  updateKPI(kpiId, newValue) {
    return quannexEngine.updateKPI(kpiId, newValue);
  },

  /**
   * Get all faces
   */
  getFaces() {
    return quannexEngine.faces.map(face => ({
      id: face.id,
      name: face.name,
      energy: face.faceEnergy,
      status: face.healthStatus,
      color: face.getEnergyColor(),
      kpis: face.elementalKPIs.map(kpi => ({
        id: kpi.id,
        name: kpi.name,
        value: kpi.value,
        normalizedScore: kpi.normalizedScore
      }))
    }));
  },

  /**
   * Get all KPIs
   */
  getKPIs() {
    return Array.from(quannexEngine.kpis.values()).map(kpi => ({
      id: kpi.id,
      name: kpi.name,
      value: kpi.value,
      normalizedScore: kpi.normalizedScore,
      faceId: kpi.faceId
    }));
  }
};

console.log('🌟 Quannex Serverless Engine Loaded');
console.log('💡 Use window.Quannex API to interact with the system');
