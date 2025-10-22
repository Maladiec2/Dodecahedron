/**
 * OctaveHelixVisualizer - Generates double helix spiral for octave progression
 * 
 * This class orchestrates the creation of a beautiful double helix visualization
 * that shows organizational evolution through 7 octaves. Two intertwined spirals
 * represent the Ball (primary) and Pillars (elemental) progressions.
 * 
 * The helix metaphor is profound: DNA's structure represents the blueprint of life.
 * Similarly, this helix represents the blueprint of organizational consciousness
 * as it spirals upward through developmental stages.
 */

export class OctaveHelixVisualizer {
  constructor(octaveManager, dodecahedron) {
    this.octaveManager = octaveManager;
    this.dodecahedron = dodecahedron;
    
    // Configuration for helix geometry
    this.config = {
      radius: 2,           // Radius of the main helix
      height: 7,           // Total height (one unit per octave)
      turns: 3.5,          // Number of complete rotations
      ballRadius: 0.15,    // Cross-section radius for ball helix
      pillarRadius: 0.08,  // Cross-section radius for pillar helix
      segments: 200,       // Geometry segments per octave
      elements: ['Earth', 'Water', 'Fire', 'Air', 'Ether']
    };
  }

  /**
   * Generate complete helix data for a face
   * @param {number} faceId - The face ID (1-12)
   * @returns {Object} Complete helix geometry and metadata
   */
  generateOctaveHelix(faceId) {
    const face = this.dodecahedron.faces.find(f => f.id === faceId);
    if (!face) return null;

    const progression = this.octaveManager.getFaceProgression(faceId);
    const currentOctave = this.octaveManager.getCurrentOctave(faceId);

    // Generate the two helices
    const ballHelix = this.generateBallHelix(faceId, progression, currentOctave);
    const pillarHelices = this.generatePillarHelices(faceId, progression, currentOctave);

    return {
      faceId,
      faceName: face.name,
      currentOctave,
      ballHelix,
      pillarHelices,
      metadata: {
        totalHeight: this.config.height,
        totalTurns: this.config.turns,
        octaveCount: 7,
        elementCount: 5
      }
    };
  }

  /**
   * Generate the primary ball helix (represents face coherence through octaves)
   * @private
   */
  generateBallHelix(faceId, progression, currentOctave) {
    const points = [];
    const colors = [];
    const coherenceData = [];

    for (let octaveId = 1; octaveId <= 7; octaveId++) {
      const octaveData = progression.find(o => o.octaveId === octaveId);
      const ballKPI = octaveData?.ball;
      
      if (!ballKPI) {
        console.log(`⚠️  No ball KPI for face ${faceId}, octave ${octaveId}`);
        continue;
      }

      // Calculate normalized score (0-1)
      const minVal = ballKPI.healthyMin || 0;
      const maxVal = ballKPI.healthyMax || 1;
      const normalizedScore = Math.max(0, Math.min(1, (ballKPI.value - minVal) / (maxVal - minVal)));

      // Generate points along helix for this octave
      const pointsPerOctave = this.config.segments;
      const tStart = (octaveId - 1) / 7;
      const tEnd = octaveId / 7;

      for (let i = 0; i <= pointsPerOctave; i++) {
        const t = tStart + (i / pointsPerOctave) * (tEnd - tStart);
        const point = this.getHelixPoint(t, normalizedScore);
        
        points.push(point);
        colors.push(this.getColorForCoherence(normalizedScore, octaveId <= currentOctave));
        coherenceData.push({
          octave: octaveId,
          value: normalizedScore,
          progress: i / pointsPerOctave,
          kpiId: ballKPI.id,
          kpiName: ballKPI.name
        });
      }
    }

    return {
      points,
      colors,
      coherenceData,
      radius: this.config.ballRadius,
      type: 'ball'
    };
  }

  /**
   * Generate 5 pillar helices (represent elemental relationships)
   * @private
   */
  generatePillarHelices(faceId, progression, currentOctave) {
    const pillarHelices = [];

    for (let elementIndex = 0; elementIndex < 5; elementIndex++) {
      const points = [];
      const colors = [];
      const coherenceData = [];

      for (let octaveId = 1; octaveId <= 7; octaveId++) {
        const octaveData = progression.find(o => o.octaveId === octaveId);
        const pillars = octaveData?.pillars || [];
        const pillarKPI = pillars[elementIndex];

        if (!pillarKPI) continue;

        // Calculate normalized score
        const minVal = pillarKPI.healthyMin || 0;
        const maxVal = pillarKPI.healthyMax || 1;
        const normalizedScore = Math.max(0, Math.min(1, (pillarKPI.value - minVal) / (maxVal - minVal)));

        // Generate offset helix for this pillar
        const pointsPerOctave = this.config.segments;
        const tStart = (octaveId - 1) / 7;
        const tEnd = octaveId / 7;
        const angleOffset = (elementIndex / 5) * 2 * Math.PI;

        for (let i = 0; i <= pointsPerOctave; i++) {
          const t = tStart + (i / pointsPerOctave) * (tEnd - tStart);
          const point = this.getOffsetHelixPoint(t, angleOffset, normalizedScore);

          points.push(point);
          colors.push(this.getElementColor(elementIndex, normalizedScore, octaveId <= currentOctave));
          coherenceData.push({
            octave: octaveId,
            value: normalizedScore,
            progress: i / pointsPerOctave,
            element: this.config.elements[elementIndex],
            kpiId: pillarKPI.id,
            kpiName: pillarKPI.name
          });
        }
      }

      pillarHelices.push({
        points,
        colors,
        coherenceData,
        radius: this.config.pillarRadius,
        element: this.config.elements[elementIndex],
        elementIndex,
        type: 'pillar'
      });
    }

    return pillarHelices;
  }

  /**
   * Calculate a point on the helix curve
   * @private
   */
  getHelixPoint(t, radialIntensity = 1) {
    // t ranges from 0 to 1 (represents progression through all 7 octaves)
    const angle = 2 * Math.PI * this.config.turns * t;
    const r = this.config.radius * radialIntensity;
    const z = this.config.height * t;

    return {
      x: r * Math.cos(angle),
      y: r * Math.sin(angle),
      z: z
    };
  }

  /**
   * Calculate offset helix point (for pillar spirals)
   * @private
   */
  getOffsetHelixPoint(t, angleOffset, radialIntensity = 1) {
    const angle = 2 * Math.PI * this.config.turns * t + angleOffset;
    const basePoint = this.getHelixPoint(t, radialIntensity);
    
    // Offset the radius slightly to avoid collision
    const offsetDistance = 0.5;
    const r = this.config.radius * radialIntensity + offsetDistance;

    return {
      x: r * Math.cos(angle),
      y: r * Math.sin(angle),
      z: basePoint.z
    };
  }

  /**
   * Get color based on coherence value
   * @private
   */
  getColorForCoherence(coherence, isAccessible) {
    if (!isAccessible) {
      // Locked/future octaves appear dimmer
      return {
        hex: this.lerpColor(0x333333, 0x666666, coherence),
        r: 0.2,
        g: 0.2,
        b: 0.2
      };
    }

    // Green for high coherence, red for low
    if (coherence >= 0.8) {
      return { hex: 0x00ff66, r: 0, g: 1, b: 0.4 };
    } else if (coherence >= 0.6) {
      return { hex: 0xffff00, r: 1, g: 1, b: 0 };
    } else if (coherence >= 0.4) {
      return { hex: 0xff9900, r: 1, g: 0.6, b: 0 };
    } else {
      return { hex: 0xff3333, r: 1, g: 0.2, b: 0.2 };
    }
  }

  /**
   * Get element-specific color
   * @private
   */
  getElementColor(elementIndex, coherence, isAccessible) {
    const elementColors = [
      { name: 'Earth', hex: 0x8b6914 },    // Brown
      { name: 'Water', hex: 0x0088ff },    // Blue
      { name: 'Fire', hex: 0xff4400 },     // Orange-red
      { name: 'Air', hex: 0xccccff },      // Light blue
      { name: 'Ether', hex: 0xaa00ff }     // Purple
    ];

    if (!isAccessible) {
      const dim = coherence * 0.3;
      return {
        hex: this.lerpColor(0x333333, elementColors[elementIndex].hex, dim),
        r: dim, g: dim, b: dim
      };
    }

    // Adjust brightness based on coherence
    const element = elementColors[elementIndex];
    const brightness = 0.5 + coherence * 0.5;
    
    return {
      hex: element.hex,
      r: brightness,
      g: brightness * 0.8,
      b: brightness
    };
  }

  /**
   * Lerp between two hex colors
   * @private
   */
  lerpColor(colorA, colorB, t) {
    const aR = (colorA >> 16) & 255;
    const aG = (colorA >> 8) & 255;
    const aB = colorA & 255;

    const bR = (colorB >> 16) & 255;
    const bG = (colorB >> 8) & 255;
    const bB = colorB & 255;

    const r = Math.round(aR + (bR - aR) * t);
    const g = Math.round(aG + (bG - aG) * t);
    const b = Math.round(aB + (bB - aB) * t);

    return (r << 16) | (g << 8) | b;
  }

  /**
   * Get marker points for each octave (visual separators)
   * @private
   */
  getOctaveMarkers() {
    const markers = [];

    for (let octaveId = 1; octaveId <= 7; octaveId++) {
      const t = octaveId / 7;
      const point = this.getHelixPoint(t);

      markers.push({
        octaveId,
        position: point,
        label: `O${octaveId}`
      });
    }

    return markers;
  }

  /**
   * Get annotation text for each octave
   * @private
   */
  getOctaveAnnotations() {
    const octaves = this.octaveManager.getAllOctaves();
    const annotations = [];

    octaves.forEach(octave => {
      const t = octave.id / 7;
      const point = this.getHelixPoint(t, 1.3); // Slightly further out

      annotations.push({
        position: point,
        text: octave.name,
        focus: octave.focus,
        octaveId: octave.id
      });
    });

    return annotations;
  }

  /**
   * Export complete visualization data
   */
  toJSON() {
    return {
      config: this.config,
      octaves: this.octaveManager.getAllOctaves(),
      elements: this.config.elements
    };
  }
}
