# 🔬 Quannex Mathematical Reference

**Complete Formula Documentation**
**Version**: 2.0
**Last Updated**: 2025-11-09

---

## Table of Contents

1. [Foundational Concepts](#foundational-concepts)
2. [KPI Normalization](#kpi-normalization)
3. [Pentagram Harmonic Analysis](#pentagram-harmonic-analysis)
4. [Face Energy Calculation](#face-energy-calculation)
5. [Global Coherence](#global-coherence)
6. [Breath Analysis](#breath-analysis)
7. [Edge Tension](#edge-tension)
8. [Shadow Detection](#shadow-detection)
9. [Tuning Constants](#tuning-constants)

---

## Foundational Concepts

### Why Sacred Geometry?

The dodecahedron is the most complex of the Platonic solids:
- **12 faces**: Organizational domains
- **30 edges**: Relationships between domains
- **20 vertices**: Convergence points (transformation potential)

Each face is a **pentagon** (5 sides), which naturally maps to:
- **5 elements**: Earth, Water, Fire, Air, Ether
- **Pentagram geometry**: Creates harmonic relationships

### Key Insight

Traditional metrics measure **magnitude** (how much?).
Quannex measures **coherence** (how well do parts work together?).

**Formula for coherence**:
```
Coherence = f(Individual_Health, Relational_Harmony, Structural_Integrity)
```

---

## KPI Normalization

### Purpose
Convert raw KPI values (different units, scales, ranges) into normalized 0-1 scale for comparison.

### Types of KPIs

#### 1. ↑ Up is Better (Higher is better)

**Examples**: Revenue growth, customer satisfaction, profit margin

**Formula**:
```
         value - target_min
N(v) = ──────────────────────
        target_ideal - target_min
```

**Constraints**:
- If `value ≥ target_ideal` → `N(v) = 1.0` (capped at perfect)
- If `value ≤ target_min` → `N(v) = 0.0` (minimum threshold)

**Example**:
```
KPI: Revenue Growth
value = 15%
target_min = 0%
target_ideal = 25%

N(15) = (15 - 0) / (25 - 0) = 0.60 → 60% normalized
```

---

#### 2. ↓ Down is Better (Lower is better)

**Examples**: Employee turnover, cost per acquisition, error rate

**Formula**:
```
              value - target_min
N(v) = 1 - ──────────────────────
            absolute_max - target_min
```

**Constraints**:
- If `value ≤ target_min` → `N(v) = 1.0` (ideal)
- If `value ≥ absolute_max` → `N(v) = 0.0` (worst case)

**Example**:
```
KPI: Employee Turnover
value = 12%
target_min = 5% (ideal)
absolute_max = 30% (critical)

N(12) = 1 - ((12 - 5) / (30 - 5)) = 1 - 0.28 = 0.72 → 72% normalized
```

---

#### 3. Band (Sweet Spot / Plateau)

**Examples**: Work-life balance score, inventory turnover, team size

**Formula**:
```
         ⎧ 0.0                                     if value ≤ target_min
         ⎪ (value - target_min) /
N(v) =  ⎨   (healthy_min - target_min)            if target_min < value < healthy_min
         ⎪ 1.0                                     if healthy_min ≤ value ≤ healthy_max
         ⎪ 1 - ((value - healthy_max) /
         ⎩       (absolute_max - healthy_max))     if healthy_max < value < absolute_max
```

**Visual**:
```
Score
1.0 |        ┌─────────────┐  ← Plateau (ideal range)
    |       ╱               ╲
    |      ╱                 ╲
    |     ╱                   ╲
0.0 |────┴─────────────────────┴────
    |  min  h_min      h_max   max
         ↑    ↑          ↑      ↑
      threshold  sweet spot  threshold
```

**Example**:
```
KPI: Team Work-Life Balance Score (1-10)
value = 7
target_min = 3 (burnout zone)
healthy_min = 6 (good balance starts)
healthy_max = 8 (good balance ends)
absolute_max = 10 (over-relaxed)

Since 6 ≤ 7 ≤ 8, N(7) = 1.0 → 100% normalized (in sweet spot)
```

---

## Pentagram Harmonic Analysis

### Purpose
Measure how well the 5 elemental KPIs within a face work together.

### The Pentagram Structure

```
                    1 (Earth)
                   ╱ ╲
                  ╱   ╲
                 ╱     ╲
              5 ●───────● 2 (Water)
               ╱ ╲     ╱ ╲
              ╱   ╲   ╱   ╲
             ╱     ╲ ╱     ╲
            ●───────●───────●
            4      3 (Fire)
          (Air)           (Ether)
```

**Connections** (pentagram star):
- Element 1 connects to 3, 4
- Element 2 connects to 4, 5
- Element 3 connects to 5, 1
- Element 4 connects to 1, 2
- Element 5 connects to 2, 3

### Step 1: Star Pair Values

**Purpose**: Measure resonance between pentagram-connected elements

**Formula**:
```
s_i = √(k_a × k_b)  [geometric mean]
```

**Why geometric mean?**
- Penalizes imbalance (if one element is 0, pair value is 0)
- Rewards harmony (both elements high → pair high)

**Calculations**:
```
s₁ = √(k₁ × k₃)  [Earth-Fire connection]
s₂ = √(k₂ × k₄)  [Water-Air connection]
s₃ = √(k₃ × k₅)  [Fire-Ether connection]
s₄ = √(k₄ × k₁)  [Air-Earth connection]
s₅ = √(k₅ × k₂)  [Ether-Water connection]
```

**Example**:
```
k₁ = 0.60 (Earth KPI at 60%)
k₃ = 0.80 (Fire KPI at 80%)

s₁ = √(0.60 × 0.80) = √0.48 = 0.693
```

---

### Step 2: Intersection Nodes

**Purpose**: Where two star pairs meet and influence each other

**Formula**:
```
p_i = (s_a + s_b) / 2  [arithmetic mean of adjacent pairs]
```

**Calculations**:
```
p₁ = (s₁ + s₂) / 2  [Node where s₁ and s₂ meet]
p₂ = (s₂ + s₃) / 2
p₃ = (s₃ + s₄) / 2
p₄ = (s₄ + s₅) / 2
p₅ = (s₅ + s₁) / 2
```

**Example**:
```
s₁ = 0.693
s₂ = 0.632

p₁ = (0.693 + 0.632) / 2 = 0.663
```

---

### Step 3: Center Composite

**Purpose**: The harmonic core - overall pentagram coherence

**Formula**:
```
C = (p₁ + p₂ + p₃ + p₄ + p₅) / 5  [average of all nodes]
```

**Interpretation**:
- `C > 0.8`: Elements working in harmony
- `0.6 < C ≤ 0.8`: Moderate alignment
- `0.4 < C ≤ 0.6`: Some tension
- `C ≤ 0.4`: Significant dissonance

**Example**:
```
p₁ = 0.663
p₂ = 0.707
p₃ = 0.612
p₄ = 0.671
p₅ = 0.646

C = (0.663 + 0.707 + 0.612 + 0.671 + 0.646) / 5 = 0.660
```

---

### Step 4: Harmonic Resonance Score

**Purpose**: How much the pentagram geometry boosts face energy

**Formula**:
```
R_harmonic = (C - E_base) / E_base × sensitivity

Where:
- C = Center Composite
- E_base = Simple average of 5 KPIs
- sensitivity = 0.3 (max 30% boost)
```

**Constraints**:
- If `R_harmonic > 0.3` → cap at 0.3 (max 30% boost)
- If `R_harmonic < -0.2` → cap at -0.2 (max 20% penalty)

**Example**:
```
C = 0.660 (from pentagram)
E_base = 0.640 (simple average)

R_harmonic = (0.660 - 0.640) / 0.640 × 0.3
           = 0.031 × 0.3
           = 0.0094 → 0.94% boost
```

---

## Face Energy Calculation

### Complete Formula

**Step 1: Calculate base energy** (weighted average)
```
         Σ(KPI_i × weight_i)
E_base = ────────────────────
            Σ(weight_i)
```

**Step 2: Calculate harmonic resonance**
```
R_harmonic = pentagram_analysis(k₁, k₂, k₃, k₄, k₅)
```

**Step 3: Calculate final face energy**
```
E_face = E_base × (1 + R_harmonic)
```

### Full Example

**Face: Financial Capital**

**KPIs**:
```
k₁ (Earth - Stability): Cash Reserves = 6 months
  Normalized: 0.33 (target: 12 months)
  Weight: 1.0

k₂ (Water - Flow): Revenue Growth = 15%
  Normalized: 0.60 (target: 25%)
  Weight: 1.2

k₃ (Fire - Energy): Profit Margin = 22%
  Normalized: 0.88 (target: 25%)
  Weight: 1.5

k₄ (Air - Movement): Investment Velocity = 0.4
  Normalized: 0.40 (target: 1.0)
  Weight: 0.8

k₅ (Ether - Vision): Strategic Alignment = 7/10
  Normalized: 0.70
  Weight: 1.0
```

**Step 1: Base Energy**
```
E_base = (0.33×1.0 + 0.60×1.2 + 0.88×1.5 + 0.40×0.8 + 0.70×1.0) / (1.0 + 1.2 + 1.5 + 0.8 + 1.0)
       = (0.33 + 0.72 + 1.32 + 0.32 + 0.70) / 5.5
       = 3.39 / 5.5
       = 0.616 → 61.6%
```

**Step 2: Pentagram Analysis**
```
Star Pairs:
s₁ = √(0.33 × 0.88) = 0.539
s₂ = √(0.60 × 0.40) = 0.490
s₃ = √(0.88 × 0.70) = 0.785
s₄ = √(0.40 × 0.33) = 0.363
s₅ = √(0.70 × 0.60) = 0.648

Intersection Nodes:
p₁ = (0.539 + 0.490) / 2 = 0.515
p₂ = (0.490 + 0.785) / 2 = 0.638
p₃ = (0.785 + 0.363) / 2 = 0.574
p₄ = (0.363 + 0.648) / 2 = 0.506
p₅ = (0.648 + 0.539) / 2 = 0.594

Center Composite:
C = (0.515 + 0.638 + 0.574 + 0.506 + 0.594) / 5 = 0.565

Harmonic Resonance:
R_harmonic = (0.565 - 0.616) / 0.616 × 0.3 = -0.025 → -2.5% (slight penalty for dissonance)
```

**Step 3: Final Face Energy**
```
E_face = 0.616 × (1 + (-0.025))
       = 0.616 × 0.975
       = 0.601 → 60.1%
```

**Interpretation**:
- Base energy: 61.6% (moderate health)
- Pentagram penalty: -2.5% (elements not working in harmony)
- Final energy: 60.1% (needs attention)
- **Key insight**: Fire (Profit) is strong, but Air (Investment Velocity) is weak, creating imbalance

---

## Global Coherence

### Formula

```
              Σ E_face_i
GC = ────────────────────
                12
```

Simple average of all 12 face energies.

### Interpretation Scale

| Range | Status | Meaning |
|-------|--------|---------|
| 90-100% | Radiant | Organization functioning at highest level |
| 80-89% | Excellent | Strong coherence, minor optimization opportunities |
| 70-79% | Healthy | Good overall health, some domains need attention |
| 60-69% | Moderate | Functional but with notable imbalances |
| 50-59% | Fair | Struggling in multiple domains |
| 40-49% | Concerning | Serious coherence issues |
| 30-39% | Critical | Major intervention needed |
| 0-29% | Crisis | Survival mode |

---

## Breath Analysis

### The 6 Polarity Axes

```
Axis 1: Being ←──────────→ Doing
Axis 2: Receiving ←──────→ Giving
Axis 3: Inner Work ←─────→ Outer Work
Axis 4: Reflection ←─────→ Action
Axis 5: Depth ←──────────→ Breadth
Axis 6: Stability ←──────→ Change
```

### Mapping Faces to Axes

Each face belongs to one pole of one axis:

**Axis 1 (Being/Doing)**:
- Being: Face 10 (Foundational Values), Face 11 (Learning)
- Doing: Face 4 (Operations), Face 8 (Execution)

**Axis 2 (Receiving/Giving)**:
- Receiving: Face 6 (Customer Experience), Face 12 (Risk & Resilience)
- Giving: Face 3 (Human Capital), Face 9 (Regenerative Flow)

... (and so on for 6 axes)

### Breath Ratio Formula

```
           Σ(E_face_positive_pole)
Ratio = ───────────────────────────
         Σ(E_face_negative_pole)
```

### Interpretation

```
Ratio = 1.0  →  Perfect balance ✓
Ratio > 1.3  →  Over-inhaling (too much positive pole)
Ratio < 0.7  →  Over-exhaling (too much negative pole)
```

**Example**:
```
Axis: Being/Doing

Being Faces:
- Face 10 (Values): 0.85
- Face 11 (Learning): 0.72
Total: 1.57

Doing Faces:
- Face 4 (Operations): 0.92
- Face 8 (Execution): 0.88
Total: 1.80

Ratio = 1.57 / 1.80 = 0.872

Interpretation: Slight over-exhaling → Too much doing, not enough being
Recommendation: Strengthen foundational practices, increase learning time
```

---

## Edge Tension

### Formula

```
T_edge = |E_face_A - E_face_B| × elemental_multiplier
```

Where:
- `E_face_A`, `E_face_B` = energies of connected faces
- `elemental_multiplier` = 0.8 to 1.3 based on element

### Elemental Multipliers

```
Fire:  1.3  (amplifies tension - volatile)
Air:   1.1  (accelerates flow)
Ether: 1.0  (neutral)
Water: 0.9  (dampens tension - smooths)
Earth: 0.8  (stabilizes - grounds)
```

### Example

```
Edge: Financial Capital ←→ Human Capital

E_face_1 (Financial) = 0.60
E_face_2 (Human) = 0.75
Element: Water (HR flows nurture finance)

T_edge = |0.60 - 0.75| × 0.9
       = 0.15 × 0.9
       = 0.135 → 13.5% tension

Interpretation: Moderate imbalance - Human Capital stronger than Financial
Insight: Team is ready to grow, but funding is constraint
```

---

## Shadow Detection

### Formula

```
Shadow_Score = |Face_Espoused - Face_Enacted| / Face_Espoused
```

Where:
- `Face_Espoused` = What we claim (e.g., "We value learning")
- `Face_Enacted` = What we actually do (measured by KPIs)

### Threshold for Hypocrisy

```
Shadow_Score > 0.3  →  "Shadow Engine Detected"
```

### Example

```
Face: Human Capital
Espoused Values Score: 0.90 (survey says "we deeply value people")
Enacted KPIs Average: 0.55 (turnover high, training budget low, burnout present)

Shadow_Score = |0.90 - 0.55| / 0.90
             = 0.35 / 0.90
             = 0.39 → 39% shadow

Alert: "SHADOW ENGINE: Human Capital"
Interpretation: Saying we value people, but actions don't match
Recommendation: Increase training budget, reduce workload, improve work-life balance
```

---

## Tuning Constants

### γ (Gamma) - Ball/Pillar Blend

```
γ = 0.7  (70% weight to "The Ball", 30% to "The 5 Pillars")
```

**Formula**:
```
E_face = γ × Ball_KPI + (1 - γ) × Avg(Pillar_KPIs)
       = 0.7 × Ball + 0.3 × Pillars
```

### α (Alpha) - Harmonic Sensitivity

```
α = 0.3  (max 30% boost from pentagram harmony)
```

### β (Beta) - Variance Penalty

```
β = 0.5  (sensitivity to KPI imbalance within a face)
```

**Formula**:
```
Penalty = β × σ²  (where σ = standard deviation of 5 KPIs)
```

### τ (Tau) - Temporal Damping

```
τ = 0.1  (smoothing factor for time-series changes)
```

Prevents wild swings when KPIs update.

---

## Summary: The Complete Calculation Pipeline

```
Raw KPI Values
      ↓
[Normalization] → Normalized Scores (0-1)
      ↓
[Pentagram Analysis] → Star Pairs → Nodes → Center Composite
      ↓
[Face Energy] → E_base × (1 + R_harmonic) → E_face
      ↓
[Global Coherence] → Average of 12 faces → GC
      ↓
[Breath Analysis] → 6 ratios → Balance/Imbalance
      ↓
[Edge Tension] → 30 relationships → Nervous endpoints
      ↓
[Shadow Detection] → Espoused vs Enacted → Hypocrisy engines
      ↓
Insights + Recommendations
```

---

## References & Academic Foundations

1. **Graph Theory**: Laplacian matrix spectral analysis
2. **Sacred Geometry**: Platonic solids, pentagram proportions
3. **Systems Theory**: Coherence as emergent property (Senge, 1990)
4. **Integral Theory**: Developmental stages (Wilber, 2000)
5. **Organizational Science**: Balanced Scorecard evolution (Kaplan & Norton)

---

**Version**: 2.0
**Last Verified**: 2025-11-09
**Status**: Production-Ready Mathematics
