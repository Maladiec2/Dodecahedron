/**
 * QuannexCSVParser - Parses real Quannex data from CSV files
 *
 * Loads actual startup data from CSV_KPI_DATABASE and CSV_FACE_MODELS
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { KPI } from '../models/KPI.js';

export class QuannexCSVParser {
  /**
   * Load Quannex face data from CSV_FACE_MODELS.csv
   */
  static loadQuannexData() {
    try {
      const kpiDbPath = join(process.cwd(), '..', 'POC', 'data', 'CSV_KPI_DATABASE.csv');
      const faceModelsPath = join(process.cwd(), '..', 'POC', 'data', 'CSV_FACE_MODELS.csv');

      console.log('📖 Loading Quannex data from POC/data CSV files...');

      // Parse KPI Database for primary KPI values
      const kpiData = this.parseKPIDatabase(kpiDbPath);

      // Parse Face Models for complete face structure
      const faceData = this.parseFaceModels(faceModelsPath, kpiData);

      console.log(`✅ Loaded ${faceData.faces.length} faces with real Quannex data`);

      return faceData;
    } catch (error) {
      console.error('❌ Error loading Quannex CSV data:', error.message);
      throw error;
    }
  }

  /**
   * Parse CSV_KPI_DATABASE.csv for primary KPI values
   */
  static parseKPIDatabase(filePath) {
    const csvContent = readFileSync(filePath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());

    const kpiMap = {};

    // Skip header (line 0), parse data lines
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim() || line.startsWith('This worksheet')) break;

      const parts = line.split(',');
      if (parts.length < 13) continue;

      const kpiId = parts[0];
      if (!kpiId || kpiId.trim() === '') continue;

      kpiMap[kpiId] = {
        id: kpiId,
        name: parts[1],
        responsible: parts[2],
        faceId: parts[3].replace('Face ', '').trim(),
        primaryOctave: parts[4],
        direction: parts[5],
        weight: parseFloat(parts[6]) || 1.0,
        unit: parts[7],
        value: parseFloat(parts[8]) || 0,
        targetIdeal: parseFloat(parts[9]) || 100,
        targetMin: parseFloat(parts[10]) || 0,
        normalized: parseFloat(parts[11]) || 0,
        faceEnergy: parseFloat(parts[12]) || 0
      };
    }

    console.log(`  ✓ Parsed ${Object.keys(kpiMap).length} primary KPIs from database`);
    return kpiMap;
  }

  /**
   * Parse CSV_FACE_MODELS.csv for face structure and elemental KPIs
   */
  static parseFaceModels(filePath, kpiDatabase) {
    const csvContent = readFileSync(filePath, 'utf-8');
    const lines = csvContent.split('\n');

    const faces = [];
    const faceNames = [
      'Financial Capital',
      'Intellectual Capital',
      'Human Capital',
      'Structural Capital',
      'Communicative Capital',
      'Strategic Capital',
      'Brand & Reputation',
      'Operational Excellence',
      'Environmental & Social Capital',
      'Ethical & Values Capital',
      'Funding Pipeline',
      'Resilience & Adaptability'
    ];

    const faceColors = [
      '#9b59b6', '#3498db', '#e74c3c', '#f39c12',
      '#1abc9c', '#34495e', '#e67e22', '#16a085',
      '#27ae60', '#8e44ad', '#c0392b', '#2c3e50'
    ];

    // Parse each face section
    for (let faceId = 1; faceId <= 12; faceId++) {
      const faceStartPattern = `Face ${faceId},`;
      let faceStartLine = -1;

      // Find the start of this face's section
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(faceStartPattern)) {
          faceStartLine = i;
          break;
        }
      }

      if (faceStartLine === -1) {
        console.warn(`  ⚠️  Could not find Face ${faceId} in CSV`);
        continue;
      }

      // Extract data from the face section
      const ballKpiLine = lines[faceStartLine + 2]; // Line with primary KPI
      const ballParts = ballKpiLine ? ballKpiLine.split(',') : [];
      const ballKpiId = ballParts[1] || '';
      const ballKpiValue = parseFloat(ballParts[2]) || 0;

      // Get primary KPI details from database
      const primaryKPI = kpiDatabase[ballKpiId] || {};

      // Extract the 5 elemental pillars
      const elementalKPIs = [];
      const elements = ['Earth', 'Water', 'Fire', 'Air', 'Ether'];

      for (let j = 0; j < 5; j++) {
        const pillarLine = lines[faceStartLine + 4 + j]; // Pillar lines start at +4
        if (!pillarLine) continue;

        const parts = pillarLine.split(',');
        const pillarName = parts[0] || `${elements[j]} KPI`;
        const element = parts[1] || elements[j];
        const coherence = parseFloat(parts[2]) || 0;
        const weight = parseFloat(parts[3]) || 0.2;

        elementalKPIs.push(new KPI({
          id: `F${faceId}_${element}`,
          name: pillarName,
          direction: '↑',
          healthyMin: 0,
          healthyMax: 1,
          value: coherence, // Already normalized 0-1, not percentage
          weight: weight,
          faceId: faceId,
          element: element,
          primaryOctave: 'O1'
        }));
      }

      // Calculate face energy from the CSV (line with "FINAL, AXIS-INFORMED FACE ENERGY")
      let faceEnergy = ballKpiValue; // Default to ball KPI value
      for (let i = faceStartLine; i < faceStartLine + 35 && i < lines.length; i++) {
        const line = lines[i];
        if (line && line.includes('FINAL, AXIS-INFORMED FACE ENERGY')) {
          // Line format: "FINAL, AXIS-INFORMED FACE ENERGY (E_f):	",0.239612252
          const energyParts = line.split(',');
          if (energyParts.length >= 2) {
            // The value is in the second column
            const energyStr = energyParts[1].trim();
            const parsed = parseFloat(energyStr);
            if (!isNaN(parsed)) {
              faceEnergy = parsed;
              break;
            }
          }
        }
      }

      faces.push({
        id: faceId,
        name: faceNames[faceId - 1],
        archetype: primaryKPI.name || faceNames[faceId - 1],
        color: faceColors[faceId - 1],
        energy: faceEnergy, // Use the calculated face energy from CSV
        elementalKPIs: elementalKPIs
      });
    }

    console.log(`  ✓ Parsed ${faces.length} faces with elemental KPIs`);

    return {
      faces: faces,
      edges: this.generateDefaultEdges(),
      vertices: this.generateDefaultVertices()
    };
  }

  /**
   * Generate default edges (30 edges of dodecahedron)
   */
  static generateDefaultEdges() {
    const edges = [];
    const edgeConnections = [
      [1, 2], [1, 5], [1, 6],
      [2, 3], [2, 7], [3, 4],
      [3, 8], [4, 5], [4, 9],
      [5, 10], [6, 7], [6, 11],
      [7, 8], [8, 9], [9, 10],
      [10, 11], [11, 12], [12, 1],
      [2, 12], [3, 12], [4, 11],
      [5, 11], [6, 10], [7, 9],
      [8, 10], [9, 11], [1, 12],
      [2, 11], [3, 10], [4, 12]
    ];

    edgeConnections.forEach(([face1, face2], index) => {
      edges.push({
        id: index + 1,
        face1Id: face1,
        face2Id: face2,
        element: ['Fire', 'Water', 'Earth', 'Air', 'Ether'][index % 5],
        kpi: {
          id: `E${index + 1}`,
          name: `Edge ${index + 1}`,
          value: 0.5,
          normalized: 0.5
        }
      });
    });

    return edges;
  }

  /**
   * Generate default vertices (20 vertices of dodecahedron)
   */
  static generateDefaultVertices() {
    const vertices = [];

    for (let i = 1; i <= 20; i++) {
      vertices.push({
        id: i,
        name: `Vertex ${i}`,
        connectedFaces: [], // Will be calculated by the Dodecahedron class
        vortexStrength: 0.5,
        transformationPotential: 0.5
      });
    }

    return vertices;
  }
}
