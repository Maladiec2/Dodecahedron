# ⚡ QUANNEX MATH - QUICK REFERENCE
**Fast lookup for common formulas**

For detailed explanations, see [POC/MATH_REFERENCE.md](POC/MATH_REFERENCE.md)

---

## CORE FORMULAS

### 1. KPI Normalization

**↑ Up Direction (Higher is Better)**
```
Score = (Value - Min) / (Ideal - Min)
Range: 0 to 1
```

**↓ Down Direction (Lower is Better)**
```
Score = 1 - ((Value - Min) / (Max - Min))
Range: 0 to 1
```

**Band Direction (Sweet Spot)**
```
IF Value in [HealthyMin, HealthyMax]: Score = 1.0
ELSE IF Value < HealthyMin: Score = (Value - Min) / (HealthyMin - Min)
ELSE: Score = 1 - ((Value - HealthyMax) / (Max - HealthyMax))
Range: 0 to 1
```

---

### 2. Face Energy

**Base Energy**
```
E_base = Σ(KPI_score × KPI_weight) / Σ(KPI_weight)

Average of 5 elemental KPI scores (weighted)
```

**Harmonic Resonance** (Pentagram Geometry)
```
R_harmonic = Σ(1 - |KPI_i - KPI_connected|) / 10

Measures how similar connected elements are
10 connections in pentagram (5 elements × 2 connections each)
```

**Final Face Energy**
```
E_face = E_base × (1 + 0.3 × R_harmonic)

Harmonic boost: Up to 30% increase when elements align
Range: 0 to 1.3 (theoretically)
```

---

### 3. Global Coherence

**Simple Average (Current POC Implementation)**
```
C_global = Σ(E_face) / 12

Average energy across all 12 faces
Range: 0 to 1
```

**Advanced Weighted (Backend Only)**
```
C_global = 0.4 × Avg(E_face) + 0.3 × Avg(E_edge) + 0.3 × Avg(V_coherence)

Weights: 40% faces, 30% edges, 30% vertices
```

---

### 4. Breath Analysis

**Breath Ratio**
```
R_breath = E_projection / E_reception

For each of 6 axes:
- Projection face = Exhale (doing, expressing)
- Reception face = Inhale (being, receiving)
```

**Balance Thresholds**
```
Balanced:      0.8 ≤ R ≤ 1.2
Over-exhaling: R > 1.2  (burnout risk)
Over-inhaling: R < 0.8  (stagnation)
```

**Example:**
```
Axis 3: Being & Doing
- F3 (Human Capital) = 0.65 (Reception/Inhale)
- F8 (Operations) = 0.90 (Projection/Exhale)
- R_breath = 0.90 / 0.65 = 1.38  → Over-exhaling (burnout!)
```

---

### 5. Pentagram Connections

**Element Connections** (0-indexed)
```
Element 0: connects to 2 and 4
Element 1: connects to 3 and 0
Element 2: connects to 4 and 1
Element 3: connects to 0 and 2
Element 4: connects to 1 and 3
```

**Resonance Calculation**
```
For element i:
  diff1 = |score_i - score_connected1|
  diff2 = |score_i - score_connected2|
  resonance_i = (1 - diff1) + (1 - diff2)

Total resonance = Σ(resonance_i) / 10
```

---

### 6. Edge Tension (Backend Only)

**Raw Tension**
```
T_raw = |E_faceA - E_faceB|

Absolute difference in face energies
```

**Elemental Multiplier**
```
Fire:  1.3 (amplifies)
Air:   1.1 (accelerates)
Ether: 1.0 (neutral)
Water: 0.9 (dampens)
Earth: 0.8 (stabilizes)
```

**Final Tension**
```
T_edge = T_raw × multiplier

Higher tension = weaker relationship
```

---

### 7. Vertex Vortex (Backend Only)

**V-Mean** (Average Energy)
```
V_mean = (E_face1 + E_face2 + E_face3) / 3

Average of 3 converging faces
```

**Vortex Strength** (Variance/Dissonance)
```
V_strength = Σ|E_face - V_mean| / 3

Lower strength = more harmonious
Higher strength = more turbulent
```

---

### 8. Health Status Thresholds

**Face Energy → Status**
```
≥ 0.9: Radiant
≥ 0.7: Healthy
≥ 0.5: Dimming
≥ 0.3: Struggling
< 0.3: Critical
```

**Global Coherence → Status**
```
≥ 0.9: Exceptional
≥ 0.8: Excellent
≥ 0.7: Healthy
≥ 0.6: Moderate
≥ 0.5: Fair
≥ 0.4: Concerning
≥ 0.3: Critical
< 0.3: Crisis
```

---

### 9. Color Coding

**Face Colors (RGB Interpolation)**
```
Energy ≥ 0.7: Green zone (#66ff66 → #00ff00)
0.4 ≤ Energy < 0.7: Yellow zone (#ffff00 → #66ff66)
Energy < 0.4: Red zone (#ff0000 → #ffff00)
```

---

### 10. Golden Ratio Constants (φ Mode)

**φ = 1.618033988749895** (Golden Ratio)

**Breath Thresholds (when φ mode enabled)**
```
Balanced: (1/φ) ≤ R ≤ φ
          0.618 ≤ R ≤ 1.618

Wider range than standard (0.8-1.2)
Aligned with natural harmony
```

---

## QUICK CALCULATION EXAMPLE

**Example Company: Quannex (Struggling Startup)**

### Face 1: Financial Capital

**KPIs:**
1. Monthly Revenue: $15K (Target: $100K, Min: $0) → Score: 0.15
2. Runway Months: 3 (Target: 12, Min: 0) → Score: 0.25
3. Cash Flow: -$5K (Target: $0, Min: -$20K) → Score: 0.75
4. Profit Margin: -20% (Target: 20%, Min: -50%) → Score: 0.43
5. Funding Secured: $50K (Target: $500K, Min: $0) → Score: 0.10

**Base Energy:**
```
E_base = (0.15 + 0.25 + 0.75 + 0.43 + 0.10) / 5 = 0.336
```

**Harmonic Resonance:**
```
Pentagram connections analyze similarity
(Simplified calculation)
R_harmonic ≈ 0.4  (some alignment, not terrible)
```

**Final Energy:**
```
E_face1 = 0.336 × (1 + 0.3 × 0.4)
E_face1 = 0.336 × 1.12
E_face1 = 0.376 → "Struggling" status
```

### Breath Analysis: Being & Doing

**F3 (Human Capital):** 0.65
**F8 (Core Operations):** 0.90
**Ratio:** 0.90 / 0.65 = 1.38

**Interpretation:** Over-exhaling! Doing too much, not enough investment in people. Burnout risk detected.

---

## COMMON QUESTIONS

**Q: Why does harmonic resonance only boost by 30%?**
A: To keep face energy in reasonable range (0-1.3). Prevents extreme values while rewarding alignment.

**Q: Why pentagram geometry?**
A: The 5-pointed star is fundamental to sacred geometry and the golden ratio (φ). Each element connects to 2 non-adjacent elements, creating 10 total connections.

**Q: What if I don't have all 5 elemental KPIs?**
A: System gracefully degrades. Harmonic resonance = 0 if <5 KPIs, and E_face = E_base.

**Q: Can face energy exceed 1.0?**
A: Yes! With perfect harmonic resonance (1.0), E_face can reach 1.3. This represents extraordinary alignment - rare but possible.

**Q: Why 12 faces?**
A: The dodecahedron has exactly 12 pentagonal faces - the most complex Platonic solid, representing completeness.

---

## IMPLEMENTATION NOTES

### In POC (Browser-based)
✅ KPI normalization
✅ Face energy (base + harmonic)
✅ Global coherence (simple average)
✅ Breath analysis (6 axes)
✅ Pentagram resonance
✅ Color interpolation

### In Backend Only
⚠️ Edge tension (30 edges)
⚠️ Vertex vortex (20 vertices)
⚠️ Spectral analysis (eigenvalues)
⚠️ Shadow detection (ethical patterns)
⚠️ Weighted global coherence

---

## VALIDATION CHECKLIST

Use this to verify implementations:

- [ ] KPI scores normalize to 0-1 range
- [ ] Face energy includes harmonic boost
- [ ] Pentagram connects elements correctly (0→2,4 | 1→3,0 | etc.)
- [ ] Breath ratios identify over-exhaling vs over-inhaling
- [ ] Global coherence averages all 12 faces
- [ ] Colors interpolate smoothly (red → yellow → green)
- [ ] Health statuses match thresholds
- [ ] φ mode widens breath balance range

---

**For detailed mathematical proofs, derivations, and advanced topics:**
See [POC/MATH_REFERENCE.md](POC/MATH_REFERENCE.md) (Complete 2,427-line reference)

**For implementation code:**
See [POC/js/main.js](POC/js/main.js) (Core calculation engine)

---

*"The universe is written in the language of mathematics... and sacred geometry is its poetry."*
