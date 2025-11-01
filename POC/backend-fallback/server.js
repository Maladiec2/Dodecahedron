/**
 * Quannex Coherence Engine API Server
 * 
 * This server exposes the dodecahedron state and allows real-time updates
 */

import express from 'express';
import cors from 'cors';
import { Dodecahedron } from './models/Dodecahedron.js';
import { getSampleData } from './data/sampleData.js';
import { OctaveProgressionManager } from './models/OctaveProgressionManager.js';
import { OctaveCSVParser } from './utils/OctaveCSVParser.js';
import { OctaveHelixVisualizer } from './models/OctaveHelixVisualizer.js';

const app = express();
// Port 1618 represents the Golden Ratio (φ = 1.618...) - the mathematical heart of the dodecahedron
const PORT = process.env.PORT || 1618;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize the global dodecahedron instance
const dodecahedron = new Dodecahedron();
dodecahedron.initialize(getSampleData());

// Initialize the octave progression manager
const octaveManager = new OctaveProgressionManager();

// Populate octave manager with KPI data from CSV or fallback
async function initializeOctaveProgressions() {
  try {
    // Try to load from CSV file
    console.log('📖 Attempting to load octave progressions from CSV...');
    const csvData = OctaveCSVParser.loadFromFile('CSV_Refrence_Models.csv');
    
    if (csvData && csvData.faceProgressions) {
      // Use CSV data
      Object.entries(csvData.faceProgressions).forEach(([faceId, progression]) => {
        octaveManager.setFaceProgression(parseInt(faceId), progression);
        octaveManager.setCurrentOctave(parseInt(faceId), 1);
      });
      
      console.log('✅ Loaded complete octave progressions from CSV');
      console.log(`   📊 ${Object.keys(csvData.faceProgressions).length} faces × 7 octaves loaded`);
      
      return;
    }
  } catch (error) {
    console.log('⚠️  Could not load CSV, using fallback initialization:', error.message);
  }
  
  // Fallback: Use existing face KPIs
  console.log('🔄 Using fallback: cycling through existing KPIs...');
  dodecahedron.faces.forEach(face => {
    const progression = [];
    
    // Create progression data for all 7 octaves
    for (let octaveId = 1; octaveId <= 7; octaveId++) {
      const octaveData = {
        octaveId,
        ball: null,
        pillars: []
      };
      
      // Get all KPIs for this face from the face's elementalKPIs array
      const faceKPIs = face.elementalKPIs || [];
      
      if (faceKPIs.length > 0) {
        // Ball KPI (cycle through the available KPIs for each octave)
        const ballIndex = (octaveId - 1) % faceKPIs.length;
        octaveData.ball = faceKPIs[ballIndex];
        
        // Pillar KPIs (all 5 elemental KPIs, or as many as available)
        octaveData.pillars = faceKPIs.slice(0, 5);
        
        // If we have fewer than 5 KPIs, repeat them to fill all 5 pillars
        while (octaveData.pillars.length < 5 && faceKPIs.length > 0) {
          const nextIndex = octaveData.pillars.length % faceKPIs.length;
          octaveData.pillars.push(faceKPIs[nextIndex]);
        }
      }
      
      progression.push(octaveData);
    }
    
    // Set the progression for this face
    octaveManager.setFaceProgression(face.id, progression);
    // Set default current octave to 1
    octaveManager.setCurrentOctave(face.id, 1);
  });
  
  console.log('🧬 Octave progressions initialized (fallback mode)');
}

// Initialize octave progressions
initializeOctaveProgressions();

// Initialize the octave helix visualizer
const helixVisualizer = new OctaveHelixVisualizer(octaveManager, dodecahedron);

console.log('🌟 Quannex Coherence Engine initialized');
console.log(`📊 System loaded with ${dodecahedron.faces.length} faces, ${dodecahedron.edges.length} edges, ${dodecahedron.vertices.length} vertices`);
console.log(`🎯 Initial Global Coherence: ${(dodecahedron._globalCoherence * 100).toFixed(1)}%`);

/**
 * GET /api/state
 * Returns the complete current state of the dodecahedron
 */
app.get('/api/state', (req, res) => {
  try {
    const state = dodecahedron.getState();
    res.json({
      success: true,
      data: state
    });
  } catch (error) {
    console.error('Error getting state:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/update_kpi
 * Updates a specific KPI value and returns the new system state
 * 
 * Body: { kpiId: string, value: number }
 */
app.post('/api/update_kpi', (req, res) => {
  try {
    const { kpiId, value } = req.body;
    
    if (!kpiId) {
      return res.status(400).json({
        success: false,
        error: 'kpiId is required'
      });
    }
    
    if (value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        error: 'value is required'
      });
    }
    
    // Check if KPI exists
    const kpi = dodecahedron.getKPI(kpiId);
    if (!kpi) {
      return res.status(404).json({
        success: false,
        error: `KPI with ID '${kpiId}' not found`
      });
    }
    
    const oldValue = kpi.value;
    const newState = dodecahedron.updateKPI(kpiId, value);
    
    console.log(`📈 KPI Updated: ${kpi.name} (${kpiId})`);
    console.log(`   Old: ${oldValue.toFixed(2)} → New: ${value.toFixed(2)}`);
    console.log(`   Global Coherence: ${(newState.globalMetrics.coherence * 100).toFixed(1)}%`);
    
    res.json({
      success: true,
      message: `KPI '${kpi.name}' updated successfully`,
      data: newState,
      change: {
        kpiId,
        kpiName: kpi.name,
        oldValue,
        newValue: value,
        oldCoherence: dodecahedron._globalCoherence,
        newCoherence: newState.globalMetrics.coherence
      }
    });
  } catch (error) {
    console.error('Error updating KPI:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/kpis
 * Returns a list of all KPIs
 */
app.get('/api/kpis', (req, res) => {
  try {
    const kpis = Array.from(dodecahedron.kpis.values()).map(kpi => kpi.toJSON());
    res.json({
      success: true,
      data: kpis
    });
  } catch (error) {
    console.error('Error getting KPIs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/faces
 * Returns all faces with their energies
 */
app.get('/api/faces', (req, res) => {
  try {
    const faces = dodecahedron.faces.map(face => face.toJSON());
    res.json({
      success: true,
      data: faces
    });
  } catch (error) {
    console.error('Error getting faces:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/edges
 * Returns all edges with their tensions
 */
app.get('/api/edges', (req, res) => {
  try {
    const edges = dodecahedron.edges.map(edge => edge.toJSON());
    res.json({
      success: true,
      data: edges
    });
  } catch (error) {
    console.error('Error getting edges:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/vertices
 * Returns all vertices with their vortex strengths
 */
app.get('/api/vertices', (req, res) => {
  try {
    const vertices = dodecahedron.vertices.map(vertex => vertex.toJSON());
    res.json({
      success: true,
      data: vertices
    });
  } catch (error) {
    console.error('Error getting vertices:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/action-plan
 * Returns the current coherence action plan
 */
app.get('/api/action-plan', (req, res) => {
  try {
    const actionPlan = dodecahedron._actionPlan;
    res.json({
      success: true,
      data: actionPlan
    });
  } catch (error) {
    console.error('Error getting action plan:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/spectral-analysis
 * Returns the complete spectral analysis of the system
 */
app.get('/api/spectral-analysis', (req, res) => {
  try {
    const spectralAnalysis = dodecahedron._spectralAnalysis;
    res.json({
      success: true,
      data: spectralAnalysis
    });
  } catch (error) {
    console.error('Error getting spectral analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/shadow-analysis
 * Returns the shadow pattern analysis (ethical conscience)
 */
app.get('/api/shadow-analysis', (req, res) => {
  try {
    const shadowAnalysis = dodecahedron._shadowAnalysis;
    res.json({
      success: true,
      data: shadowAnalysis
    });
  } catch (error) {
    console.error('Error getting shadow analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/breath-analysis
 * Returns the breath ratio analysis for 6 harmonic axes
 */
app.get('/api/breath-analysis', (req, res) => {
  try {
    const breathAnalysis = dodecahedron._breathAnalysis;
    res.json({
      success: true,
      data: breathAnalysis
    });
  } catch (error) {
    console.error('Error getting breath analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/tuning-constants
 * Returns the current tuning constants configuration
 */
app.get('/api/tuning-constants', (req, res) => {
  try {
    const tuning = dodecahedron.tuning.toJSON();
    const explanation = dodecahedron.tuning.getExplanation();
    res.json({
      success: true,
      data: {
        values: tuning,
        explanation: explanation
      }
    });
  } catch (error) {
    console.error('Error getting tuning constants:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/tuning-constants
 * Update tuning constants and recalculate
 */
app.post('/api/tuning-constants', (req, res) => {
  try {
    const { alpha, beta, gamma, delta, kappa } = req.body;
    
    // Update tuning constants
    if (alpha !== undefined) dodecahedron.tuning.alpha = alpha;
    if (beta !== undefined) dodecahedron.tuning.beta = beta;
    if (gamma !== undefined) dodecahedron.tuning.gamma = gamma;
    if (delta !== undefined) dodecahedron.tuning.delta = delta;
    if (kappa !== undefined) dodecahedron.tuning.kappa = kappa;
    
    // Validate
    dodecahedron.tuning.validate();
    
    // Recalculate everything with new constants
    dodecahedron.recalculate();
    
    res.json({
      success: true,
      message: 'Tuning constants updated',
      data: dodecahedron.tuning.toJSON()
    });
  } catch (error) {
    console.error('Error updating tuning constants:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/reset
 * Resets the system to initial state
 */
app.post('/api/reset', (req, res) => {
  try {
    dodecahedron.initialize(getSampleData());
    const state = dodecahedron.getState();
    
    console.log('🔄 System reset to initial state');
    
    res.json({
      success: true,
      message: 'System reset successfully',
      data: state
    });
  } catch (error) {
    console.error('Error resetting system:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/configure_faces
 * Configure custom names for faces
 * 
 * Body: { faces: { 1: "Custom Name 1", 2: "Custom Name 2", ... } }
 */
app.post('/api/configure_faces', (req, res) => {
  try {
    const { faces } = req.body;
    
    if (!faces || typeof faces !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'faces object is required'
      });
    }
    
    // Update face names
    let updatedCount = 0;
    Object.entries(faces).forEach(([faceId, faceName]) => {
      const face = dodecahedron.getFace(parseInt(faceId));
      if (face && faceName && faceName.trim()) {
        face.name = faceName.trim();
        updatedCount++;
      }
    });
    
    console.log(`🎨 Face Configuration Updated: ${updatedCount} faces renamed`);
    Object.entries(faces).forEach(([faceId, faceName]) => {
      console.log(`   Face ${faceId}: ${faceName}`);
    });
    
    const state = dodecahedron.getState();
    
    res.json({
      success: true,
      message: `Successfully updated ${updatedCount} face names`,
      data: state,
      updatedFaces: updatedCount
    });
  } catch (error) {
    console.error('Error configuring faces:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/face_configuration
 * Get current face configuration
 */
app.get('/api/face_configuration', (req, res) => {
  try {
    const configuration = {};
    dodecahedron.faces.forEach(face => {
      configuration[face.id] = {
        id: face.id,
        name: face.name,
        archetype: face.archetype,
        color: face.color,
        healthStatus: face.healthStatus,
        faceEnergy: face.faceEnergy
      };
    });
    
    res.json({
      success: true,
      data: configuration
    });
  } catch (error) {
    console.error('Error getting face configuration:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/octave-progression/:faceId
 * Get octave progression data for a specific face
 */
app.get('/api/octave-progression/:faceId', (req, res) => {
  try {
    const faceId = parseInt(req.params.faceId);
    const face = dodecahedron.faces.find(f => f.id === faceId);
    
    if (!face) {
      return res.status(404).json({
        success: false,
        error: 'Face not found'
      });
    }
    
    const progression = octaveManager.getFaceProgression(faceId);
    const currentOctave = octaveManager.getCurrentOctave(faceId);
    const octaveKPIs = octaveManager.getOctaveKPIs(faceId, currentOctave);
    
    // Build octave status safely
    const octaveNames = [
      'Survival', 'Structure', 'Relationships', 'Creativity',
      'Expression', 'Vision', 'Radiance'
    ];
    
    const octaveStatus = {
      currentOctave,
      octaveName: octaveNames[currentOctave - 1],
      coherence: face.octaveCoherence || 0,
      readyForNext: face.isReadyForNextOctave ? face.isReadyForNextOctave() : false,
      nextOctave: currentOctave < 7 ? octaveNames[currentOctave] : null
    };
    
    res.json({
      success: true,
      data: {
        faceId,
        faceName: face.name,
        currentOctave,
        octaveStatus,
        currentKPIs: octaveKPIs,
        allOctaves: octaveManager.getAllOctaves(),
        progression
      }
    });
  } catch (error) {
    console.error('Error getting octave progression:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/octave-progression/:faceId
 * Set the current octave level for a face
 */
app.post('/api/octave-progression/:faceId', (req, res) => {
  try {
    const faceId = parseInt(req.params.faceId);
    const { octaveLevel } = req.body;
    
    if (!octaveLevel || octaveLevel < 1 || octaveLevel > 7) {
      return res.status(400).json({
        success: false,
        error: 'Invalid octave level. Must be between 1 and 7.'
      });
    }
    
    const face = dodecahedron.faces.find(f => f.id === faceId);
    if (!face) {
      return res.status(404).json({
        success: false,
        error: 'Face not found'
      });
    }
    
    // Set octave level
    octaveManager.setCurrentOctave(faceId, octaveLevel);
    face.setOctaveLevel(octaveLevel);
    
    // Recalculate system
    dodecahedron.calculateSystemState();
    
    res.json({
      success: true,
      data: {
        faceId,
        newOctave: octaveLevel,
        octaveStatus: face.getOctaveStatus(),
        globalCoherence: dodecahedron.globalCoherence
      }
    });
  } catch (error) {
    console.error('Error setting octave level:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/import-octave-model
 * Import octave progression model from CSV
 */
app.post('/api/import-octave-model', async (req, res) => {
  try {
    const { csvPath } = req.body;
    const parser = new OctaveCSVParser();
    
    // Use provided path or default
    const filePath = csvPath || '../CSV_Refrence_Models.csv';
    const parsedData = parser.parseCSV(filePath);
    
    // Apply tuning constants if they exist
    if (parsedData.tuningConstants) {
      // Update the existing tuning constants
      const tuning = dodecahedron.tuning;
      if (tuning && parsedData.tuningConstants['α']) tuning.alpha = parsedData.tuningConstants['α'].value;
      if (tuning && parsedData.tuningConstants['β']) tuning.beta = parsedData.tuningConstants['β'].value;
      if (tuning && parsedData.tuningConstants['γ']) tuning.gamma = parsedData.tuningConstants['γ'].value;
      if (tuning && parsedData.tuningConstants['δ']) tuning.delta = parsedData.tuningConstants['δ'].value;
      if (tuning && parsedData.tuningConstants['κ']) tuning.kappa = parsedData.tuningConstants['κ'].value;
      
      // Update variance penalties
      if (tuning && parsedData.tuningConstants['ρ_dept']) tuning.variancePenalties.department = parsedData.tuningConstants['ρ_dept'].value;
      if (tuning && parsedData.tuningConstants['ρ_oct']) tuning.variancePenalties.octave = parsedData.tuningConstants['ρ_oct'].value;
      if (tuning && parsedData.tuningConstants['ρ_global']) tuning.variancePenalties.global = parsedData.tuningConstants['ρ_global'].value;
      
      // Validate the updated constants
      if (tuning) tuning.validate();
    }
    
    // Apply face progressions
    Object.entries(parsedData.faceProgressions).forEach(([faceId, progression]) => {
      octaveManager.setFaceProgression(parseInt(faceId), progression);
    });
    
    res.json({
      success: true,
      message: 'Octave progression model imported successfully',
      data: {
        facesImported: Object.keys(parsedData.faceProgressions).length,
        tuningConstantsUpdated: parsedData.tuningConstants ? true : false
      }
    });
  } catch (error) {
    console.error('Error importing octave model:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/debug/octave-progression/:faceId
 * Debug endpoint to check octave progression data
 */
app.get('/api/debug/octave-progression/:faceId', (req, res) => {
  try {
    const faceId = parseInt(req.params.faceId);
    const progression = octaveManager.getFaceProgression(faceId);
    const face = dodecahedron.faces.find(f => f.id === faceId);
    const allKPIs = face ? face.elementalKPIs : [];
    
    res.json({
      success: true,
      data: {
        faceId,
        progressionLength: progression.length,
        progression: progression.map(p => ({
          octaveId: p.octaveId,
          hasBall: !!p.ball,
          ballId: p.ball?.id,
          ballName: p.ball?.name,
          ballValue: p.ball?.value,
          ballHealthyMin: p.ball?.healthyMin,
          ballHealthyMax: p.ball?.healthyMax,
          pillarCount: p.pillars?.length || 0
        })),
        availableKPIs: allKPIs.map(k => ({ id: k.id, name: k.name, value: k.value }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/octave-helix/:faceId
 * Get octave helix spiral visualization data for a specific face
 */
app.get('/api/octave-helix/:faceId', (req, res) => {
  try {
    const faceId = parseInt(req.params.faceId);
    const face = dodecahedron.faces.find(f => f.id === faceId);
    
    if (!face) {
      return res.status(404).json({
        success: false,
        error: 'Face not found'
      });
    }
    
    // Generate helix visualization data
    const helixData = helixVisualizer.generateOctaveHelix(faceId);
    
    if (!helixData) {
      return res.status(400).json({
        success: false,
        error: 'Unable to generate helix data for this face'
      });
    }
    
    res.json({
      success: true,
      data: helixData
    });
  } catch (error) {
    console.error('Error generating helix data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Quannex Coherence Engine is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  🌟 QUANNEX COHERENCE ENGINE 🌟');
  console.log('  The Living Geometric Oracle');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  ✨ Server running on http://localhost:${PORT}`);
  console.log(`  📡 API ready at http://localhost:${PORT}/api`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /api/health                  - Health check');
  console.log('  GET  /api/state                   - Complete system state');
  console.log('  POST /api/update_kpi              - Update a KPI value');
  console.log('  GET  /api/kpis                    - All KPIs');
  console.log('  GET  /api/faces                   - All faces');
  console.log('  GET  /api/edges                   - All edges');
  console.log('  GET  /api/vertices                - All vertices');
  console.log('  GET  /api/action-plan             - Coherence action plan');
  console.log('  GET  /api/spectral-analysis       - Spectral analysis (Modal decomposition)');
  console.log('  GET  /api/shadow-analysis         - Shadow patterns (Ethical conscience)');
  console.log('  GET  /api/breath-analysis         - Breath ratios (6 harmonic axes)');
  console.log('  GET  /api/tuning-constants        - View tuning constants');
  console.log('  POST /api/tuning-constants        - Update tuning constants');
  console.log('  POST /api/reset                   - Reset to initial state');
  console.log('  POST /api/configure_faces         - Configure face names');
  console.log('  GET  /api/face_configuration      - Get face configuration');
  console.log('  GET  /api/octave-helix/:faceId   - Get octave helix spiral visualization data for a specific face');
  console.log('');
});

export default app;

