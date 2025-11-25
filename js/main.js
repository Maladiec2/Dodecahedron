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

// ========================================
// CONFIGURATION: Tuning Constants
// ========================================

/**
 * The "Conductor's Settings" - Tuning constants from Reference Models
 */
class TuningConfig {
  constructor() {
    // α (Alpha): The Synergy Blend
    // Blends arithmetic and multiplicative synergy for Star Pairs
    // 0.6 = "We believe in synergy, but ground it in reality"
    this.ALPHA = 0.6;

    // β (Beta): The Intersection Blend
    // Balances influence of adjacent star-pairs on intersection nodes
    // 0.5 = Perfect symmetry (default)
    this.BETA = 0.5;

    // γ (Gamma): The "Ball and Pillars" Blend
    // Balances internal health (Ball) vs relational health (Pillars)
    // 0.7 = "A department is 70% responsible for itself, 30% influenced by connections"
    this.GAMMA = 0.7;

    // δ (Delta): The Axis Coherence Factor
    // Blends local health with the health of the polar opposite (shadow)
    // 0.9 = "We focus primarily on local reality, but acknowledge the shadow"
    this.DELTA = 0.9;

    // κ (Kappa): Sensitivity Amplifier
    // Controls the "emotional responsiveness" of the final score
    // 2.0 = Balanced responsiveness (Reference model suggests 2.0, logic sometimes uses 4.0)
    this.KAPPA = 2.0;
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
  constructor(config, tuningConfig) {
    this.id = config.id || 0;
    this.name = config.name || '';
    this.elementalKPIs = config.elementalKPIs || []; // 5 KPIs (one per element)
    this.ballKPI = config.ballKPI || null; // Primary/headline KPI
    this.tuning = tuningConfig || new TuningConfig();

    // Geometric State
    this.starPairs = []; // s values
    this.intersectionNodes = []; // p values
    this.centerComposite = 0; // C value
    this.pillarSymmetry = 0; // S_f

    // Energy States
    this._localCoherence = null; // Before axis check
    this._faceEnergy = null; // Final axis-informed energy
  }

  /**
   * 1. Calculate Star Pair Values (s)
   * Formula: s = α * average(k1, k2) + (1-α) * (k1 * k2)
   * Connects non-adjacent elements (The pentagram lines)
   */
  calculateStarPairs() {
    if (this.elementalKPIs.length < 5) return [];

    // Pentagram connections: 0-2, 1-3, 2-4, 3-0, 4-1
    const connections = [
      [0, 2], [1, 3], [2, 4], [3, 0], [4, 1]
    ];

    this.starPairs = connections.map(([i1, i2]) => {
      const k1 = this.elementalKPIs[i1].normalizedScore;
      const k2 = this.elementalKPIs[i2].normalizedScore;

      // The Synergy Blend (Alpha)
      const arithmeticMean = (k1 + k2) / 2;
      const geometricSynergy = k1 * k2; // Simplified product synergy

      return (this.tuning.ALPHA * arithmeticMean) + ((1 - this.tuning.ALPHA) * geometricSynergy);
    });

    return this.starPairs;
  }

  /**
   * 2. Calculate Intersection Nodes (p)
   * Formula: p = β * s_prev + (1-β) * s_next
   * Where star pairs cross
   */
  calculateIntersectionNodes() {
    if (this.starPairs.length < 5) return [];

    // Intersections follow the cycle of star pairs
    // p0 is between s4 and s0, p1 between s0 and s1...
    // Simplified adjacency for loop: p[i] blends s[i] and s[i-1] (wrapping)

    this.intersectionNodes = this.starPairs.map((s, i) => {
      const s_prev = this.starPairs[(i - 1 + 5) % 5];
      const s_curr = s;

      return (this.tuning.BETA * s_prev) + ((1 - this.tuning.BETA) * s_curr);
    });

    return this.intersectionNodes;
  }

  /**
   * 3. Calculate Center Composite (C)
   * The harmonic core - average of intersection nodes
   */
  calculateCenterComposite() {
    if (this.intersectionNodes.length === 0) return 0;
    const sum = this.intersectionNodes.reduce((a, b) => a + b, 0);
    this.centerComposite = sum / this.intersectionNodes.length;
    return this.centerComposite;
  }

  /**
   * 4. Calculate Pillar Symmetry (S_f)
   * Measures variance between pillars (1.0 = perfect symmetry, 0.0 = chaos)
   */
  calculatePillarSymmetry() {
    if (this.elementalKPIs.length === 0) return 0;

    // Standard deviation of normalized scores
    const scores = this.elementalKPIs.map(k => k.normalizedScore);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    // Convert to 0-1 score (inverted deviation)
    // Assuming max meaningful deviation is around 0.5
    this.pillarSymmetry = Math.max(0, 1 - (stdDev * 2));
    return this.pillarSymmetry;
  }

  /**
   * 5. Calculate Local Coherence Score (E_local)
   * Blends the Ball (Primary KPI) with the Pillars (Relational Health)
   * Formula: E_local = γ * Ball + (1-γ) * Pillars_Avg
   */
  calculateLocalCoherence() {
    // Ensure prerequisites
    this.calculateStarPairs();
    this.calculateIntersectionNodes();
    this.calculateCenterComposite();
    this.calculatePillarSymmetry();

    const ballScore = this.ballKPI ? this.ballKPI.normalizedScore : 0;

    // "Nuanced Avg Pillar Health" - we'll use CenterComposite as the robust pillar metric
    // or a blend of raw average and geometric integrity
    const rawPillarAvg = this.elementalKPIs.reduce((s, k) => s + k.normalizedScore, 0) / 5;

    // Blend Ball and Pillars using Gamma
    this._localCoherence = (this.tuning.GAMMA * ballScore) + ((1 - this.tuning.GAMMA) * rawPillarAvg);

    return this._localCoherence;
  }

  /**
   * 6. Calculate Final Axis-Informed Energy (E_f)
   * The "Grand Synthesis" - blends local score with opposing face
   * Formula: E_f = δ * E_local + (1-δ) * E_opposing
   */
  calculateAxisInformedEnergy(opposingFaceEnergy) {
    if (this._localCoherence === null) this.calculateLocalCoherence();

    const local = this._localCoherence;
    const opposing = opposingFaceEnergy || 0; // If no opposing face (rare), assume 0 impact or handle gracefully

    // The Axis Coherence Factor (Delta)
    // If Delta is 0.9, we are 90% local, 10% shadow
    this._faceEnergy = (this.tuning.DELTA * local) + ((1 - this.tuning.DELTA) * opposing);

    return this._faceEnergy;
  }

  /**
   * Get face energy (returns final axis-informed if available, else local)
   */
  get faceEnergy() {
    if (this._faceEnergy !== null) return this._faceEnergy;
    if (this._localCoherence !== null) return this._localCoherence;
    return this.calculateLocalCoherence();
  }

  /**
   * Invalidate cache when KPIs change
   */
  invalidateCache() {
    this._localCoherence = null;
    this._faceEnergy = null;
    this.starPairs = [];
    this.intersectionNodes = [];
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
// MODEL: Edge (Narrative Tension)
// ========================================

/**
 * Represents a connection between two faces
 * Models the "Narrative Tension" or relationship archetype
 */
class Edge {
  constructor(config) {
    this.id = config.id || '';
    this.faceAId = parseInt(config.faceAId) || 0;
    this.faceBId = parseInt(config.faceBId) || 0;
    this.archetype = config.archetype || '';
    this.description = config.description || '';

    // State
    this.tension = 0; // 0 (Dissonance) to 1 (Resonance)
    this.status = 'Neutral';
    this.breathRatio = 0;
    this.flowDirection = 'balanced';
    this.element = config.element || 'Ether';
  }

  /**
   * Calculate tension based on the energy of connected faces
   * @param {Face} faceA 
   * @param {Face} faceB 
   */
  calculateTension(faceA, faceB) {
    if (!faceA || !faceB) return 0;

    const e1 = faceA.faceEnergy;
    const e2 = faceB.faceEnergy;

    // 1. Energy Delta (Difference)
    const delta = Math.abs(e1 - e2);

    // 2. Breath Ratio (Flow Direction)
    // Positive = expansion (A to B), Negative = contraction (B to A)
    // Normalized to -1 to +1 range
    this.breathRatio = Math.max(-1.0, Math.min(1.0, (e2 - e1) * 2));

    if (Math.abs(this.breathRatio) < 0.1) this.flowDirection = 'balanced';
    else this.flowDirection = this.breathRatio > 0 ? 'expansion' : 'contraction';

    // 3. Elemental Multiplier
    const multipliers = {
      'Fire': 1.3,    // Fire amplifies tension and flow
      'Water': 0.9,   // Water smooths and dampens
      'Earth': 0.8,   // Earth stabilizes and grounds
      'Air': 1.1,     // Air accelerates flow
      'Ether': 1.0    // Ether is neutral/balanced
    };
    const multiplier = multipliers[this.element] || 1.0;

    // 4. Harmonic Resonance (Similarity)
    if (e1 > 0.6 && e2 > 0.6) {
      this.tension = 0.9; // High Synergy
      this.status = 'Synergetic';
    } else if (e1 < 0.4 && e2 < 0.4) {
      this.tension = 0.2; // Depleted
      this.status = 'Depleted';
    } else {
      // Base tension from delta, modulated by element
      const baseTension = 0.5 + (delta / 2);
      this.tension = Math.min(1.0, Math.max(0.0, baseTension * multiplier));
      this.status = delta > 0.4 ? 'Flowing' : 'Stable';
    }

    return this.tension;
  }
}

// ========================================
// MODEL: Vertex (Triadic Synergy)
// ========================================

/**
 * Represents the intersection of three faces (The Vortex)
 * Models the synergy where three domains meet
 */
class Vertex {
  constructor(config) {
    this.id = config.id || '';
    this.faceIds = config.faceIds || []; // Array of 3 face IDs
    this.name = config.name || '';

    // State
    this.vortexEnergy = 0;
    this.status = 'Dormant';
    this.vortexDirection = 0; // -1 (Down) to +1 (Up)
    this.coherence = 0; // 0 (Chaotic) to 1 (Coherent)
    this.isLeveragePoint = false;
  }

  /**
   * Calculate Vortex Energy (Triadic Synergy)
   * @param {Array<Face>} faces - Array of 3 Face objects
   */
  calculateVortexEnergy(faces) {
    if (!faces || faces.length !== 3) return 0;

    const energies = faces.map(f => f.faceEnergy);

    // 1. The Triad Average
    const avg = energies.reduce((a, b) => a + b, 0) / 3;

    // 2. The Weakest Link (Limiting Factor)
    const min = Math.min(...energies);

    // 3. Vortex Logic:
    // A vortex requires ALL THREE to be active to spin.
    // If one is dead (0), the vortex collapses.
    // Formula: Average * (Min / Average)^0.5
    // This penalizes imbalance. If all are equal, it equals the average.

    if (avg === 0) {
      this.vortexEnergy = 0;
    } else {
      this.vortexEnergy = avg * Math.sqrt(min / avg);
    }

    // 4. Vortex Direction (Upward/Downward Spiral)
    // Positive = upward spiral (generative), Negative = downward spiral (degenerative)
    this.vortexDirection = Math.max(-1.0, Math.min(1.0, (avg - 0.5) * 2));

    // 5. Coherence (Balance)
    // High coherence = faces are well-balanced
    // Low coherence = faces are very different
    const [f1, f2, f3] = energies;
    const diff12 = Math.abs(f1 - f2);
    const diff23 = Math.abs(f2 - f3);
    const diff31 = Math.abs(f3 - f1);
    const avgDiff = (diff12 + diff23 + diff31) / 3;
    // Maximum possible average difference is ~0.667
    this.coherence = Math.max(0.0, Math.min(1.0, 1.0 - (avgDiff / 0.667)));

    // 6. Leverage Point
    // High strength + low coherence = opportunity for transformation
    this.isLeveragePoint = this.vortexEnergy > 0.7 && this.coherence < 0.5;

    // Status
    if (this.vortexEnergy > 0.8) this.status = 'Radiant Vortex';
    else if (this.vortexEnergy > 0.5) this.status = 'Active Flow';
    else if (this.vortexEnergy > 0.3) this.status = 'Weak Swirl';
    else this.status = 'Stagnant';

    return this.vortexEnergy;
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
    this.tuning = new TuningConfig(); // Load tuning constants
    this.breathAnalyzer = new BreathAnalyzer(); // Breath analysis
    this.spectralAnalyzer = new SpectralAnalyzer(); // Spectral analysis
    this.breathAnalysis = null; // Cached breath analysis
    this.spectralAnalysis = null; // Cached spectral analysis
  }

  /**
   * Load CSV file from data folder
   * @param {string} filename - Name of CSV file
   * @returns {Promise<Array<Object>>} Parsed CSV data
   */
  async loadCSV(filename) {
    try {
      const response = await fetch(`./data/${filename}`);
      const text = await response.text();
      return parseCSV(text);
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      return [];
    }
  }

  /**
   * Initialize system from CSV data
   */
  async initialize() {
    console.log('🌟 Initializing Quannex Coherence Engine...');

    // Load CSV data
    const kpiData = await this.loadCSV('CSV_KPI_DATABASE.csv');
    const faceData = await this.loadCSV('CSV_FACE_MODELS.csv');
    const edgeData = await this.loadCSV('CSV_Edge_tension_Map.csv');
    const vertexData = await this.loadCSV('CSV_Vortex_Map.csv');

    // Create KPIs
    this.createKPIs(kpiData);

    // Create Faces (simplified for POC)
    this.createFaces();

    // Create Edges and Vertices
    this.createEdges(edgeData);
    this.createVertices(vertexData);

    // Calculate initial state
    this.recalculate();

    console.log('✅ System initialized');
    console.log(`📊 Loaded ${this.faces.length} faces, ${this.kpis.size} KPIs`);
    console.log(`🔷 Loaded ${this.edges.length} edges, ${this.vertices.length} vertices`);
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

    // Create Faces (use custom face config if provided)
    this.createFaces(company.faceConfig);

    // Calculate initial state
    this.recalculate();

    console.log('✅ Company loaded');
    console.log(`📊 ${company.name}: ${this.faces.length} faces, ${this.kpis.size} KPIs`);
    console.log(`🎯 Global Coherence: ${(this.getGlobalCoherence() * 100).toFixed(1)}%`);
  }

  /**
   * Create KPI objects from data (supports both CSV format and UI format)
   */
  createKPIs(data) {
    console.log(`📊 Creating ${data.length} KPIs...`);
    let csvFormat = 0;
    let uiFormat = 0;

    data.forEach(row => {
      // 🔧 FIX: Support both CSV format (KPI_ID) and UI format (id)
      const kpiId = row.KPI_ID || row.id;
      if (!kpiId) return;

      // Track which format we're using
      if (row.KPI_ID) csvFormat++;
      if (row.id && !row.KPI_ID) uiFormat++;

      const kpi = new KPI({
        // Support both formats
        id: kpiId,
        name: row.KPI_Name || row.name || kpiId,
        value: parseFloat(row.Value !== undefined ? row.Value : row.value) || 0,
        weight: parseFloat(row.Weight !== undefined ? row.Weight : row.weight) || 1.0,
        direction: row.Direction || row.direction || '↑',
        targetMin: parseFloat(row.Target_Min !== undefined ? row.Target_Min : row.targetMin) || 0,
        targetIdeal: parseFloat(row.Target_Ideal !== undefined ? row.Target_Ideal : row.targetIdeal) || 100,
        healthyMin: parseFloat(row.Healthy_Min !== undefined ? row.Healthy_Min : row.healthyMin),
        healthyMax: parseFloat(row.Healthy_Max !== undefined ? row.Healthy_Max : row.healthyMax),
        absoluteMax: parseFloat(row.Absolute_Max !== undefined ? row.Absolute_Max : row.absoluteMax),
        faceId: parseInt(row.Face_ID !== undefined ? row.Face_ID : row.faceId) || null,
        element: row.Element || row.element || 'Earth'
      });

      this.kpis.set(kpi.id, kpi);
    });

    console.log(`✅ Created ${this.kpis.size} KPIs (CSV format: ${csvFormat}, UI format: ${uiFormat})`);
  }

  /**
   * Create Face objects
   */
  createFaces(faceConfig = null) {
    let faceNames;

    if (faceConfig && faceConfig.faces && Array.isArray(faceConfig.faces) && faceConfig.faces.length === 12) {
      faceNames = faceConfig.faces.map(f => f.name);
      console.log('✅ Using custom face configuration:', faceConfig.templateName || 'Custom');
    } else {
      faceNames = [
        'Financial Capital', 'Intellectual Capital', 'Human Capital', 'Structural Capital',
        'Market Resonance', 'Community & Partners', 'Brand & Reputation', 'Core Operations',
        'Regenerative Flow', 'Foundational Values', 'Funding Pipeline', 'Risk & Resilience'
      ];
      console.log('ℹ️ Using default face names');
    }

    faceNames.forEach((name, index) => {
      const faceId = index + 1;
      const faceKPIs = Array.from(this.kpis.values())
        .filter(kpi => kpi.faceId === faceId)
        .slice(0, 5);

      const face = new Face({
        id: faceId,
        name: name,
        elementalKPIs: faceKPIs,
        ballKPI: faceKPIs[0] || null
      }, this.tuning); // Pass global tuning to each face

      this.faces.push(face);
    });
  }

  /**
   * Create Edge objects from CSV data
   */
  createEdges(edgeData) {
    if (!edgeData) return;
    console.log(`🔗 Creating Edges from ${edgeData.length} rows...`);

    edgeData.forEach(row => {
      // CSV columns: Edge_ID, Face_A_ID, Face_B_ID, Edge Archytype, Description
      // Note: Face IDs in CSV might be "Face 1", "Face 2" etc. or just numbers.
      // We need to parse them.

      const parseFaceId = (val) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return parseInt(val.replace('Face ', '')) || 0;
        return 0;
      };

      const edge = new Edge({
        id: row.Edge_ID || row.id,
        faceAId: parseFaceId(row.Face_A_ID || row.faceA),
        faceBId: parseFaceId(row.Face_B_ID || row.faceB),
        archetype: row['Edge Archytype'] || row.archetype,
        description: row.Description || row.description
      });

      if (edge.faceAId && edge.faceBId) {
        this.edges.push(edge);
      }
    });
  }

  /**
   * Create Vertex objects from CSV data
   */
  createVertices(vertexData) {
    if (!vertexData) return;
    console.log(`🌀 Creating Vertices from ${vertexData.length} rows...`);

    vertexData.forEach(row => {
      // CSV columns: Vertex_ID, Face_1_ID, Face_2_ID, Face_3_ID

      const parseFaceId = (val) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return parseInt(val.replace('Face ', '')) || 0;
        return 0;
      };

      const f1 = parseFaceId(row.Face_1_ID);
      const f2 = parseFaceId(row.Face_2_ID);
      const f3 = parseFaceId(row.Face_3_ID);

      const vertex = new Vertex({
        id: row.Vertex_ID || row.id,
        faceIds: [f1, f2, f3],
        name: row.Name || `Vortex ${row.Vertex_ID}`
      });

      if (f1 && f2 && f3) {
        this.vertices.push(vertex);
      }
    });
  }

  /**
   * Recalculate entire system state
   * NOW WITH AXIS-INFORMED FEEDBACK LOOP
   */
  recalculate() {
    // 1. Invalidate all caches
    this.faces.forEach(face => face.invalidateCache());

    // 2. PASS 1: Calculate Local Coherence for all faces
    // This happens automatically when calculateAxisInformedEnergy calls calculateLocalCoherence
    // But we explicitly calculate it here to ensure base states are ready
    this.faces.forEach(face => face.calculateLocalCoherence());

    // 3. PASS 2: Calculate Axis-Informed Energy (The Feedback Loop)
    // We need the Axis Map (Polar Opposites)
    const axisMap = {
      1: 11, 11: 1,
      2: 7, 7: 2,
      3: 8, 8: 3,
      4: 9, 9: 4,
      5: 10, 10: 5,
      6: 12, 12: 6
    };

    this.faces.forEach(face => {
      const opposingId = axisMap[face.id];
      let opposingEnergy = 0;

      if (opposingId) {
        // Find the opposing face object
        const opposingFace = this.faces.find(f => f.id === opposingId);
        if (opposingFace) {
          // Use the opposing face's LOCAL coherence (to avoid infinite recursion)
          // or use its previous state. For simplicity/stability, we use its fresh local coherence.
          opposingEnergy = opposingFace._localCoherence;
        }
      }

      face.calculateAxisInformedEnergy(opposingEnergy);
    });

    // 4. Run Global Analyzers
    if (this.faces.length === 12) {
      this.breathAnalysis = this.breathAnalyzer.analyze(this.faces);

      if (this.spectralAnalyzer) {
        const faceEnergies = this.faces.map(f => f.faceEnergy);
        this.spectralAnalysis = this.spectralAnalyzer.analyze(faceEnergies);
      }
    }

    // 5. Update Edges
    this.edges.forEach(edge => {
      const faceA = this.faces.find(f => f.id === edge.faceAId);
      const faceB = this.faces.find(f => f.id === edge.faceBId);
      edge.calculateTension(faceA, faceB);
    });

    // 6. Update Vertices
    this.vertices.forEach(vertex => {
      const faces = vertex.faceIds.map(id => this.faces.find(f => f.id === id)).filter(f => f);
      vertex.calculateVortexEnergy(faces);
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
   * Get system state (for UI)
   */
  getState() {
    return {
      globalCoherence: this.getGlobalCoherence(),
      coherenceStatus: this.getCoherenceStatus(this.getGlobalCoherence()),
      tuning: this.tuning, // Expose tuning to UI
      faces: this.faces.map(face => ({
        id: face.id,
        name: face.name,
        faceEnergy: face.faceEnergy, // Final energy
        localCoherence: face._localCoherence, // Raw local energy (for debug/UI)
        status: face.healthStatus,
        color: face.getEnergyColor(),
        elementalKPIs: face.elementalKPIs.map(kpi => ({
          id: kpi.id,
          name: kpi.name,
          value: kpi.value,
          normalizedScore: kpi.normalizedScore,
          element: kpi.element,
          healthStatus: kpi.healthStatus
        }))
      })),
      edges: this.edges.map(e => ({
        id: e.id,
        tension: e.tension,
        status: e.status,
        archetype: e.archetype,
        faceAId: e.faceAId,
        faceBId: e.faceBId,
        breathRatio: e.breathRatio,
        flowDirection: e.flowDirection,
        element: e.element
      })),
      vertices: this.vertices.map(v => ({
        id: v.id,
        energy: v.vortexEnergy,
        status: v.status,
        faceIds: v.faceIds,
        vortexDirection: v.vortexDirection,
        coherence: v.coherence,
        isLeveragePoint: v.isLeveragePoint
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

  /**
   * Update Tuning Configuration
   */
  updateTuning(key, value) {
    if (this.tuning.hasOwnProperty(key)) {
      this.tuning[key] = parseFloat(value);
      console.log(`🎛️ Tuning Updated: ${key} = ${value}`);
      this.recalculate();
      return true;
    }
    return false;
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
   * Update a Tuning Parameter
   */
  updateTuning(key, value) {
    return quannexEngine.updateTuning(key, value);
  },

  /**
   * Get all faces
   */
  getFaces() {
    return quannexEngine.faces.map(face => ({
      id: face.id,
      name: face.name,
      energy: face.faceEnergy,
      localEnergy: face._localCoherence,
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
  },

  /**
   * Get breath analysis (6 breath axes)
   */
  getBreathAnalysis() {
    return quannexEngine.breathAnalysis;
  },

  /**
   * Get spectral analysis (eigenvectors)
   */
  getSpectralAnalysis() {
    return quannexEngine.spectralAnalysis;
  }
};

// Also expose quannexEngine directly for advanced integrations (like 3D viz)
window.quannexEngine = quannexEngine;

console.log('🌟 Quannex Serverless Engine Loaded');
console.log('💡 Use window.Quannex API to interact with the system');
