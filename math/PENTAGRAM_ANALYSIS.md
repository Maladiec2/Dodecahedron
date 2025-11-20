# ⭐ Pentagram Harmonic Analysis

**Deep Dive: How We Measure Elemental Harmony**

*This is the mathematical heart of Quannex - where sacred geometry becomes actionable intelligence*

---

## Prerequisites

Before reading this, make sure you understand:
- KPI normalization (covered in [MATH_OVERVIEW.md](MATH_OVERVIEW.md))
- Why we use 5 elements per face (pentagon geometry)

**After this document:**
Continue to [BREATH_DYNAMICS.md](BREATH_DYNAMICS.md) for flow analysis.

---

## The Central Question

**Given 5 elemental KPIs for a face, how well do they work together?**

Traditional approach: Average them →  `(k₁ + k₂ + k₃ + k₄ + k₅) / 5`

**Problem:** This treats them as independent. Missing: **relational harmony**.

**Quannex approach:** Use pentagram geometry to reveal harmonic relationships, then **boost or penalize** based on how well elements support each other.

---

## The Pentagram Structure

Each face is a **pentagon** (5-sided polygon). Drawing all internal diagonals creates a **pentagram star**:

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
          (Air)
```

**Pentagram connections (star pairs):**
- 1 ↔ 3 (Earth ↔ Fire)
- 2 ↔ 4 (Water ↔ Air)
- 3 ↔ 5 (Fire ↔ Ether)
- 4 ↔ 1 (Air ↔ Earth)
- 5 ↔ 2 (Ether ↔ Water)

**Key insight:** These pairs are NOT arbitrary - they follow golden ratio proportions in the pentagon's geometry.

---

## The 4-Step Analysis

### Step 1: Calculate Star Pair Values

**Purpose:** Measure resonance between pentagram-connected elements.

**Formula:**
```
s_i = √(k_a × k_b)   [geometric mean]
```

**Why geometric mean?**
- **Penalizes imbalance:** If one element is 0, pair value is 0 (even if other is perfect)
- **Rewards harmony:** Both elements strong → pair strong
- **Non-linear:** 0.8 × 0.8 = 0.64 (perfect balance better than 0.5 × 1.0)

**Calculations:**
```
s₁ = √(k₁ × k₃)   [Earth-Fire connection]
s₂ = √(k₂ × k₄)   [Water-Air connection]
s₃ = √(k₃ × k₅)   [Fire-Ether connection]
s₄ = √(k₄ × k₁)   [Air-Earth connection]
s₅ = √(k₅ × k₂)   [Ether-Water connection]
```

**Example:**
```javascript
// Financial Capital Face KPIs (normalized 0-1)
k₁ = 0.60  // Earth: Cash Reserves
k₂ = 0.75  // Water: Revenue Growth
k₃ = 0.80  // Fire: Profit Margin
k₄ = 0.50  // Air: Investment Velocity
k₅ = 0.70  // Ether: Strategic Alignment

// Calculate star pairs
s₁ = √(0.60 × 0.80) = √0.48 = 0.693
s₂ = √(0.75 × 0.50) = √0.375 = 0.612
s₃ = √(0.80 × 0.70) = √0.56 = 0.748
s₄ = √(0.50 × 0.60) = √0.30 = 0.548
s₅ = √(0.70 × 0.75) = √0.525 = 0.725
```

**Interpretation:**
- `s₃ = 0.748` (highest) → Fire-Ether synergy is strong
- `s₄ = 0.548` (lowest) → Air-Earth connection is weak (low investment + low cash)

---

### Step 2: Calculate Intersection Nodes

**Purpose:** Where two star pairs meet, they create **nodes** - points where harmonic energies blend.

**Formula:**
```
p_i = (s_a + s_b) / 2   [arithmetic mean of adjacent pairs]
```

**The 5 nodes:**
```
p₁ = (s₁ + s₂) / 2   [Where s₁ and s₂ intersect]
p₂ = (s₂ + s₃) / 2
p₃ = (s₃ + s₄) / 2
p₄ = (s₄ + s₅) / 2
p₅ = (s₅ + s₁) / 2
```

**Continuing example:**
```javascript
p₁ = (0.693 + 0.612) / 2 = 0.653
p₂ = (0.612 + 0.748) / 2 = 0.680
p₃ = (0.748 + 0.548) / 2 = 0.648
p₄ = (0.548 + 0.725) / 2 = 0.637
p₅ = (0.725 + 0.693) / 2 = 0.709
```

**Visualization:**
```
Each node represents a harmonic blend point:
- High node value = strong energy convergence
- Low node value = weak/conflicting energies
```

---

### Step 3: Calculate Center Composite

**Purpose:** The harmonic core - overall pentagram coherence.

**Formula:**
```
C = (p₁ + p₂ + p₃ + p₄ + p₅) / 5
```

**Continuing example:**
```javascript
C = (0.653 + 0.680 + 0.648 + 0.637 + 0.709) / 5
C = 3.327 / 5
C = 0.665
```

**Interpretation Scale:**
- `C > 0.80` → **Excellent harmony** - all elements thriving together
- `0.65 < C ≤ 0.80` → **Good alignment** - mostly working well
- `0.50 < C ≤ 0.65` → **Moderate tension** - some conflicts
- `C ≤ 0.50` → **Significant dissonance** - major imbalances

**Our example: C = 0.665 → Good alignment, room for improvement**

---

### Step 4: Calculate Harmonic Resonance Score

**Purpose:** How much should this harmony **boost or penalize** the face energy?

**Formula:**
```
R_harmonic = 1 - (variance_penalty)

Where variance_penalty is calculated from standard deviation of the 5 KPIs
```

**Alternative formula (currently implemented in POC):**
```javascript
// Calculate variance from simple average
E_base = (k₁ + k₂ + k₃ + k₄ + k₅) / 5
variance = (C - E_base) / E_base × sensitivity

// Sensitivity controls max boost/penalty
sensitivity = 0.3  // Max ±30%
```

**Constraints:**
```
if (R_harmonic > 0.30) R_harmonic = 0.30   // Cap boost at +30%
if (R_harmonic < -0.20) R_harmonic = -0.20 // Cap penalty at -20%
```

**Continuing example:**
```javascript
E_base = (0.60 + 0.75 + 0.80 + 0.50 + 0.70) / 5 = 0.670
C = 0.665

variance = (0.665 - 0.670) / 0.670 × 0.3
variance = -0.0075 × 0.3
variance = -0.0022

R_harmonic = 1 - variance_penalty
R_harmonic ≈ -0.0022 → ~0.22% penalty (negligible)
```

**What does this mean?**
- Center composite (0.665) is slightly below simple average (0.670)
- Pentagram reveals minor disharmony
- Small penalty applied (-0.22%) to account for imbalance

---

## Face Energy: Putting It All Together

### Complete Formula

```javascript
// Step 1: Base energy (weighted average)
E_base = Σ(k_i × weight_i) / Σ(weight_i)

// Step 2: Pentagram harmonic resonance
R_harmonic = pentagram_analysis(k₁, k₂, k₃, k₄, k₅)

// Step 3: Final face energy
E_face = E_base × (1 + R_harmonic)
```

### Full Worked Example

**Face: Human Capital (People & Culture)**

**Raw KPIs:**
```
Earth (Stability): Employee Retention = 85%
  → Target: 90%, so normalized = 0.85/0.90 = 0.944
  → Weight: 1.2

Water (Flow): Team Collaboration Score = 7.2/10
  → Normalized = 0.72
  → Weight: 1.0

Fire (Energy): Employee Engagement = 65%
  → Normalized = 0.65
  → Weight: 1.5 (critical metric)

Air (Movement): Learning Velocity = 3 courses/quarter
  → Target: 4, so normalized = 0.75
  → Weight: 0.8

Ether (Purpose): Values Alignment = 8/10
  → Normalized = 0.80
  → Weight: 1.0
```

**Step 1: Weighted Base Energy**
```javascript
numerator = (0.944 × 1.2) + (0.72 × 1.0) + (0.65 × 1.5) + (0.75 × 0.8) + (0.80 × 1.0)
numerator = 1.133 + 0.72 + 0.975 + 0.60 + 0.80
numerator = 4.228

denominator = 1.2 + 1.0 + 1.5 + 0.8 + 1.0 = 5.5

E_base = 4.228 / 5.5 = 0.769 → 76.9%
```

**Step 2: Pentagram Analysis**
```javascript
k₁ = 0.944, k₂ = 0.72, k₃ = 0.65, k₄ = 0.75, k₅ = 0.80

// Star pairs
s₁ = √(0.944 × 0.65) = 0.783
s₂ = √(0.72 × 0.75) = 0.735
s₃ = √(0.65 × 0.80) = 0.721
s₄ = √(0.75 × 0.944) = 0.841
s₅ = √(0.80 × 0.72) = 0.759

// Intersection nodes
p₁ = (0.783 + 0.735) / 2 = 0.759
p₂ = (0.735 + 0.721) / 2 = 0.728
p₃ = (0.721 + 0.841) / 2 = 0.781
p₄ = (0.841 + 0.759) / 2 = 0.800
p₅ = (0.759 + 0.783) / 2 = 0.771

// Center composite
C = (0.759 + 0.728 + 0.781 + 0.800 + 0.771) / 5 = 0.768

// Harmonic resonance
R_harmonic = (0.768 - 0.769) / 0.769 × 0.3
R_harmonic = -0.0004 → ~0% (negligible)
```

**Step 3: Final Face Energy**
```javascript
E_face = 0.769 × (1 + 0.000)
E_face = 0.769 → 76.9%
```

**Interpretation:**
- **Good health** (76.9% - in "Healthy" range)
- **Excellent harmony** - pentagram shows balanced growth across all elements
- **No penalty or boost** - elements already well-aligned
- **Strength**: Earth (Retention) is exceptional
- **Weakness**: Fire (Engagement) at 65% needs attention
- **Recommendation**: Focus on engagement without destabilizing retention

---

## Why This Matters: Real-World Scenarios

### Scenario 1: One Dominant Element

**Case: Marketing-Driven Startup**
```
k₁ (Earth - Operations) = 0.40  ← Weak!
k₂ (Water - Product) = 0.50
k₃ (Fire - Marketing) = 0.95    ← Dominant!
k₄ (Air - Sales) = 0.45
k₅ (Ether - Vision) = 0.55

Simple Average = 0.57 (57%)
```

**Pentagram Analysis:**
```
s₁ = √(0.40 × 0.95) = 0.616  (Earth-Fire weak due to Earth)
s₂ = √(0.50 × 0.45) = 0.474  (Water-Air weak)
s₃ = √(0.95 × 0.55) = 0.723  (Fire-Ether OK)
s₄ = √(0.45 × 0.40) = 0.424  (Air-Earth very weak!)
s₅ = √(0.55 × 0.50) = 0.524  (Ether-Water weak)

C = 0.552

R_harmonic = (0.552 - 0.570) / 0.570 × 0.3 = -0.009 → -0.9% penalty

E_face = 0.570 × (1 - 0.009) = 0.565 → 56.5%
```

**Diagnosis:**
- Marketing (Fire) is blazing at 95%
- Operations (Earth) is struggling at 40%
- **Pentagram reveals**: This creates **instability** across all pairs
- **Penalty applied**: -0.9% reflects unsustainable imbalance
- **Prescription**: Strengthen operations before scaling marketing further

---

### Scenario 2: Balanced Excellence

**Case: Mature Company**
```
k₁ = 0.85
k₂ = 0.82
k₃ = 0.88
k₄ = 0.84
k₅ = 0.86

Simple Average = 0.85 (85%)
```

**Pentagram Analysis:**
```
All star pairs ≈ 0.85-0.86
All nodes ≈ 0.85-0.86
C = 0.852

R_harmonic = (0.852 - 0.850) / 0.850 × 0.3 = +0.0007 → +0.07% boost

E_face = 0.850 × (1.0007) = 0.851 → 85.1%
```

**Diagnosis:**
- All elements strong and balanced
- **Pentagram reveals**: True harmony - tiny boost for perfect balance
- **Result**: Already excellent, continue what you're doing

---

## Implementation in Code

### JavaScript (POC/js/main.js)

```javascript
class Face {
  calculatePentagramResonance(kpis) {
    // Step 1: Star pairs (geometric mean)
    const s = [];
    s[0] = Math.sqrt(kpis[0].normalizedScore * kpis[2].normalizedScore); // 1-3
    s[1] = Math.sqrt(kpis[1].normalizedScore * kpis[3].normalizedScore); // 2-4
    s[2] = Math.sqrt(kpis[2].normalizedScore * kpis[4].normalizedScore); // 3-5
    s[3] = Math.sqrt(kpis[3].normalizedScore * kpis[0].normalizedScore); // 4-1
    s[4] = Math.sqrt(kpis[4].normalizedScore * kpis[1].normalizedScore); // 5-2

    // Step 2: Intersection nodes (arithmetic mean)
    const p = [];
    p[0] = (s[0] + s[1]) / 2;
    p[1] = (s[1] + s[2]) / 2;
    p[2] = (s[2] + s[3]) / 2;
    p[3] = (s[3] + s[4]) / 2;
    p[4] = (s[4] + s[0]) / 2;

    // Step 3: Center composite
    const C = (p[0] + p[1] + p[2] + p[3] + p[4]) / 5;

    // Step 4: Resonance score
    const E_base = this.calculateBaseEnergy(kpis);
    let R = (C - E_base) / E_base * 0.3;

    // Constrain
    if (R > 0.30) R = 0.30;
    if (R < -0.20) R = -0.20;

    return R;
  }

  calculateEnergy(kpis) {
    const E_base = this.calculateBaseEnergy(kpis);
    const R = this.calculatePentagramResonance(kpis);
    return E_base * (1 + R);
  }
}
```

---

## Frequently Asked Questions

### Q: Why geometric mean for star pairs?

**A:** Geometric mean **penalizes imbalance** more than arithmetic mean.

Example:
- **Arithmetic:** (0.2 + 1.0) / 2 = 0.6
- **Geometric:** √(0.2 × 1.0) = 0.447

Geometric mean says: "One weak element drags down the pair more than arithmetic suggests." This encodes **"harmony over power"** - you can't compensate for one weak element with one strong one.

---

### Q: Why cap at ±30%/20%?

**A:** Prevents extreme penalties/boosts from distorting overall coherence. The pentagram is a **nudge** toward balance, not a dictator. Even with perfect harmony, you can't turn a struggling domain (50%) into excellent (75%+) - you still need to improve individual KPIs.

---

### Q: What if I only have 3 KPIs per face?

**A:** Pentagram analysis requires 5 elements (pentagon structure). Options:
1. Use **Quick Mode** (1 KPI per face, no pentagram)
2. Duplicate/synthesize to reach 5
3. Accept reduced accuracy

Recommendation: Collect 5 KPIs per face for full analysis.

---

### Q: Can I use different element mappings?

**A:** Yes! The POC uses Earth/Water/Fire/Air/Ether, but you could use:
- Economic / Social / Environmental / Governance / Innovation
- People / Process / Technology / Data / Strategy
- Any 5-factor framework

Just ensure each face has exactly 5 KPIs mapped consistently.

---

## Key Takeaways

1. **Pentagram geometry reveals hidden patterns** traditional averages miss
2. **Geometric mean penalizes imbalance** - encoding "harmony over power"
3. **Harmonic resonance boosts balanced faces** and penalizes unbalanced ones
4. **Non-linear feedback** - extreme imbalance gets exponential penalties
5. **Sacred geometry isn't decorative** - it's functional mathematics

---

**Next:** Continue to [BREATH_DYNAMICS.md](BREATH_DYNAMICS.md) to understand flow between faces.

**Back:** Return to [MATH_OVERVIEW.md](MATH_OVERVIEW.md) for conceptual framework.

---

*Created: 2025-01-16 | Part of Quannex Mathematical Framework*
