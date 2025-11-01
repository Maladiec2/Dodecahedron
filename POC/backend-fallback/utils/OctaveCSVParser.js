/**
 * OctaveCSVParser - Enhanced parser for the complete octave progression model
 * 
 * Parses CSV_Refrence_Models.csv containing:
 * - Tuning constants (α, β, γ, δ, κ, ρ)
 * - Complete 7-octave progression for all 12 faces
 * - Ball + 5 Pillars (elements) for each face/octave combination
 */

import { readFileSync } from 'fs';
import { join } from 'path';

export class OctaveCSVParser {
  constructor() {
    this.tuningConstants = {};
    this.faceProgressions = {};
    this.breathAxes = [
      { id: 1, name: 'Resource Flow', projection: 11, reception: 1 },
      { id: 2, name: 'Substance & Story', projection: 7, reception: 2 },
      { id: 3, name: 'Being & Doing', projection: 8, reception: 3 },
      { id: 4, name: 'Form & Integrity', projection: 4, reception: 9 },
      { id: 5, name: 'Perception & Truth', projection: 5, reception: 10 },
      { id: 6, name: 'Network & Fortress', projection: 6, reception: 12 }
    ];
  }

  /**
   * Parse the complete CSV file
   */
  parseCSV(filePath) {
    try {
      const csvContent = readFileSync(filePath, 'utf-8');
      const lines = csvContent.split('\n');
      
      console.log('📖 Parsing CSV_Refrence_Models.csv...');
      
      // Parse tuning constants
      this.parseTuningConstants(lines);
      
      // Parse octave progressions
      this.parseOctaveProgressions(lines);
      
      console.log(`✅ Parsed ${Object.keys(this.faceProgressions).length} faces with complete octave progressions`);
      
      return {
        tuningConstants: this.tuningConstants,
        faceProgressions: this.faceProgressions,
        breathAxes: this.breathAxes
      };
    } catch (error) {
      console.error('❌ Error parsing CSV:', error.message);
      throw error;
    }
  }

  /**
   * Parse tuning constants from the CSV header
   */
  parseTuningConstants(lines) {
    const constants = {};
    
    for (let i = 0; i < Math.min(15, lines.length); i++) {
      const line = lines[i];
      const parts = line.split(',');
      
      if (parts.length < 2) continue;
      
      const key = parts[0].trim();
      const value = parseFloat(parts[1]);
      
      if (isNaN(value)) continue;
      
      // Map CSV keys to our constants
      if (key.includes('ρ_dept') || key.includes('Dept')) {
        constants.ρ_dept = value;
      } else if (key.includes('ρ_oct') || key.includes('Octave Coherence')) {
        constants.ρ_oct = value;
      } else if (key.includes('ρ_global') || key.includes('Global Coherence')) {
        constants.ρ_global = value;
      } else if (key.includes('Alpha') || key.includes('α')) {
        constants.α = value;
      } else if (key.includes('Beta') || key.includes('β')) {
        constants.β = value;
      } else if (key.includes('Gamma') || key.includes('γ')) {
        constants.γ = value;
      } else if (key.includes('Delta') || key.includes('δ')) {
        constants.δ = value;
      } else if (key.includes('Kappa') || key.includes('κ')) {
        constants.κ = value;
      }
    }
    
    this.tuningConstants = constants;
    console.log('  ✓ Tuning constants parsed:', Object.keys(constants).length);
  }

  /**
   * Parse octave progressions for all 12 faces
   */
  parseOctaveProgressions(lines) {
    // Find the header row
    let headerIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Face (Domain)') && lines[i].includes('O1 - Survival')) {
        headerIndex = i;
        break;
      }
    }
    
    if (headerIndex === -1) {
      console.log('⚠️  Could not find octave progression header');
      return;
    }
    
    console.log(`  ✓ Found header at line ${headerIndex + 1}`);
    
    // Parse the header to understand column positions
    const headerParts = lines[headerIndex].split(',');
    
    // The structure is complex - we'll parse face by face
    // Each face has 5 rows (one for each element: Earth, Water, Fire, Air, Ether)
    // The first row contains the Ball KPI, the rest are Pillars
    
    const faceMapping = {
      'Financial Capital': 1,
      'Intellectual Capital': 2,
      'Human Capital': 3,
      'Structural Capital': 4,
      'Market Resonance': 5,
      'Community & Partners': 6,
      'Brand & Reputation': 7,
      'Core Operations': 8,
      'Regenerative Flow': 9,
      'Foundational Values': 10,
      'Funding Pipeline': 11,
      'Risk & Resilience': 12
    };
    
    let currentLineIndex = headerIndex + 1;
    
    // Parse each face (12 faces × 5 element rows = 60 data rows)
    for (const [faceName, faceId] of Object.entries(faceMapping)) {
      this.faceProgressions[faceId] = [];
      
      // Initialize 7 octaves for this face
      for (let octaveId = 1; octaveId <= 7; octaveId++) {
        this.faceProgressions[faceId].push({
          octaveId,
          ball: null,
          pillars: []
        });
      }
      
      // Parse 5 element rows for this face
      for (let elementIdx = 0; elementIdx < 5; elementIdx++) {
        if (currentLineIndex >= lines.length) break;
        
        const line = lines[currentLineIndex];
        const parts = line.split(',');
        
        // Skip if this doesn't look like a face row
        if (elementIdx === 0 && !parts[0].includes('(F')) {
          currentLineIndex++;
          continue;
        }
        
        this.parseElementRow(parts, faceId, elementIdx);
        currentLineIndex++;
      }
    }
    
    console.log(`  ✓ Parsed progressions for ${Object.keys(this.faceProgressions).length} faces`);
  }

  /**
   * Parse a single element row (contains data for all 7 octaves)
   */
  parseElementRow(parts, faceId, elementIdx) {
    const elements = ['Earth', 'Water', 'Fire', 'Air', 'Ether'];
    const element = elements[elementIdx];
    
    // The CSV structure for each octave repeats every ~11 columns
    // Pattern: Element, Question, KPI Name, Direction, TargetMin, HealthyMin, HealthyMax, AbsoluteMax, Rationale, Normalized
    
    const octaveColumnStarts = {
      1: 1,   // O1 starts at column 1
      2: 12,  // O2 starts at column 12
      3: 23,  // O3 starts at column 23
      4: 34,  // O4 starts at column 34
      5: 45,  // O5 starts at column 45
      6: 56,  // O6 starts at column 56
      7: 67   // O7 starts at column 67
    };
    
    for (let octaveId = 1; octaveId <= 7; octaveId++) {
      const colStart = octaveColumnStarts[octaveId];
      
      const kpiData = {
        id: `F${faceId}_O${octaveId}_${element}`,
        element: element,
        question: this.cleanValue(parts[colStart + 2]),
        name: this.cleanValue(parts[colStart + 3]),
        direction: this.cleanValue(parts[colStart + 4]) || '↑',
        targetMin: this.parseNumericValue(parts[colStart + 5]),
        healthyMin: this.parseNumericValue(parts[colStart + 6]),
        healthyMax: this.parseNumericValue(parts[colStart + 7]),
        absoluteMax: this.parseNumericValue(parts[colStart + 8]),
        rationale: this.cleanValue(parts[colStart + 9]),
        value: this.parseNumericValue(parts[colStart + 10]) || 0.5, // Default to 0.5 if not specified
        weight: 1.0,
        faceId: faceId,
        octaveLevel: octaveId,
        kpiType: elementIdx === 0 ? 'ball' : 'pillar'
      };
      
      // Skip if no name (empty KPI)
      if (!kpiData.name) continue;
      
      // Add to appropriate position
      const octaveData = this.faceProgressions[faceId][octaveId - 1];
      
      if (elementIdx === 0) {
        // First element row contains the Ball KPI
        octaveData.ball = kpiData;
      } else {
        // Other rows contain Pillar KPIs
        octaveData.pillars.push(kpiData);
      }
    }
  }

  /**
   * Clean a CSV value (remove quotes, trim whitespace)
   */
  cleanValue(value) {
    if (!value) return '';
    return value.replace(/^["']|["']$/g, '').trim();
  }

  /**
   * Parse a numeric value from CSV
   */
  parseNumericValue(value) {
    if (!value) return null;
    
    const cleaned = this.cleanValue(value);
    
    // Handle N/A
    if (cleaned === 'N/A' || cleaned === '') return null;
    
    // Remove currency symbols and commas
    const numeric = cleaned.replace(/[£$€,]/g, '');
    
    // Handle percentages
    if (numeric.includes('%')) {
      return parseFloat(numeric.replace('%', '')) / 100;
    }
    
    // Handle ratios (e.g., "1:5")
    if (numeric.includes(':')) {
      const [num, denom] = numeric.split(':').map(parseFloat);
      return num / denom;
    }
    
    const parsed = parseFloat(numeric);
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Load and parse from default location
   */
  static loadFromFile(filename = 'CSV_Refrence_Models.csv') {
    const parser = new OctaveCSVParser();
    const csvPath = join(process.cwd(), '..', filename);
    return parser.parseCSV(csvPath);
  }
}
