# IMMEDIATE PRIORITY - Mathematical Precision Audit

**Date**: October 31, 2025
**Status**: ACTIVE
**Context**: University lectorate network opportunity (thesis case studies)

---

## SITUATION

**What Changed:**
- Monaco crypto job: DELAYED (not cancelled, still possible)
- **NEW**: University wants to pilot Quannex with their lectorate network
- This = multiple organizations = perfect thesis validation
- Priority shifted from demo polish → mathematical rigor

**Why This Matters:**
- University pilots need academically sound math
- Thesis defense will scrutinize calculations
- Multiple organizations means results must be reproducible
- Sacred Grammar framework must be mathematically provable

---

## PRIMARY TASK

**Audit Mathematical Precision in POC**

### Files to Examine:

**Backend Math (Node.js):**
- `/POC/backend-fallback/server.js`
- `/POC/backend-fallback/models/Face.js` (pentagram harmonic analysis)
- `/POC/backend-fallback/models/SpectralAnalyzer.js` (eigenvector decomposition)
- `/POC/backend-fallback/models/BreathAnalyzer.js` (breath ratio calculations)
- `/POC/backend-fallback/models/TuningConstants.js` (golden ratio mode)

**Frontend Math (JavaScript):**
- `/POC/js/main.js` (18KB - coherence calculation engine)
- `/POC/js/company-loader.js` (data loading)

**Data Structure:**
- `/POC/companies/*/company.json` (company profiles)
- `/POC/companies/*/kpis.csv` (60 KPIs per company)

---

## MATHEMATICAL VALIDATION CHECKLIST

### ✅ 1. Pentagram Harmonic Analysis (Face Energy)

**Formula** (from Sacred Grammar):
```
E_f = (1/5) × Σ(KPI_i_normalized × weight_i) for i=1 to 5

Where:
- Each face has 5 elemental KPIs (Earth, Water, Fire, Air, Ether)
- Normalization: KPI value → [0, 1] based on healthy range
- Default weight = 1.0 (equal weighting)
```

**Check:**
- [ ] Are all 5 elements being used per face?
- [ ] Is normalization correct (min/max → [0,1])?
- [ ] Are weights applied correctly?
- [ ] Does E_f output range [0, 1]?

**Files**: `Face.js`, `main.js`

---

### ✅ 2. Breath Ratio Calculations (6 Harmonic Axes)

**Formula**:
```
Breath Ratio (BR) = Reception Energy / Projection Energy

Healthy Range (Normal Mode): 0.8 ≤ BR ≤ 1.2
Healthy Range (Golden Mode): 0.618 ≤ BR ≤ 1.618 (φ-aligned)

Axes:
- Axis 1: F11 (Projection) ↔ F1 (Reception) - Resource Flow
- Axis 2: F7 (Projection) ↔ F2 (Reception) - Story & Substance
- Axis 3: F8 (Projection) ↔ F3 (Reception) - Doing & Being
- Axis 4: F4 (Projection) ↔ F9 (Reception) - Form & Integrity
- Axis 5: F5 (Projection) ↔ F10 (Reception) - Perception & Truth
- Axis 6: F6 (Projection) ↔ F12 (Reception) - Network & Fortress
```

**Check:**
- [ ] Are axes correctly paired?
- [ ] Is projection/reception orientation correct?
- [ ] Division by zero protection (if projection = 0)?
- [ ] Golden ratio mode toggle works?
- [ ] Status labels correct ("balanced", "over-exhaling", "over-inhaling")?

**Files**: `BreathAnalyzer.js`, `main.js`

---

### ✅ 3. Global Coherence Calculation

**Formula** (simplest version):
```
Global Coherence = Average of all 12 face energies
GC = (Σ E_f) / 12  for f=1 to 12
```

**Advanced version** (weighted by tensions):
```
GC = Σ(E_f × (1 - tension_penalty_f)) / 12

Where tension_penalty considers edge tensions
```

**Check:**
- [ ] Which formula is being used?
- [ ] Are all 12 faces included?
- [ ] Is output percentage (0-100%) or decimal (0-1)?
- [ ] Does it match manual calculation?

**Files**: `main.js`

---

### ✅ 4. Eigenvector Analysis (Spectral Decomposition)

**Theory**:
```
Given adjacency matrix A (30×30 for edges):
- Compute eigenvalues λ and eigenvectors v
- Dominant mode = eigenvector with largest |λ|
- Reveals primary systemic imbalance pattern
```

**Check:**
- [ ] Is adjacency matrix correctly constructed?
- [ ] Are edge weights (tensions) included?
- [ ] Eigenvalue solver: Which library? (numeric.js? math.js?)
- [ ] Is dominant eigenvector correctly identified?
- [ ] Does it map to meaningful face relationships?

**Files**: `SpectralAnalyzer.js`

**Note**: This is computationally complex. Verify library implementation is correct.

---

### ✅ 5. Golden Ratio Tuning (φ = 1.618033988749895)

**Constants to check**:
```javascript
const PHI = 1.618033988749895;
const PHI_INVERSE = 0.618033988749895; // 1/φ

// Tuning parameters (when golden mode enabled):
alpha_golden = α × φ
beta_golden = β × φ
gamma_golden = γ × φ
delta_golden = δ × φ
kappa_golden = κ × φ
```

**Check:**
- [ ] Is PHI defined to sufficient precision (12+ decimals)?
- [ ] Are tuning constants scaled by φ in golden mode?
- [ ] Does toggling golden mode visibly change calculations?
- [ ] Are breath ratio thresholds adjusted (0.618 / 1.618)?

**Files**: `TuningConstants.js`, `main.js`

---

### ✅ 6. Edge Tension Calculations

**Formula**:
```
Edge Tension = |E_f1 - E_f2| × relationship_weight

Where:
- f1, f2 are connected faces
- relationship_weight depends on edge type (structural vs semantic)
```

**Check:**
- [ ] Are all 30 edges correctly defined?
- [ ] Do edge tensions sum/average correctly?
- [ ] Are high-tension edges identified?
- [ ] Does tension propagate to coherence penalty?

**Files**: `Edge.js`, `main.js`

---

### ✅ 7. Shadow Analysis (Ethical Patterns)

**Theory**:
```
Shadow Pattern = Face energy < threshold AND imbalance detected

Examples:
- Financial shadow: High revenue (F5) but low ethics (F10)
- Structural shadow: Strong rules (F4) but weak regeneration (F9)
```

**Check:**
- [ ] Are shadow thresholds defined?
- [ ] Are shadow patterns correctly identified?
- [ ] Are they surfaced in UI/API?

**Files**: `ShadowAnalyzer.js` (if exists), `main.js`

---

### ✅ 8. Data Normalization & Validation

**KPI Input Validation**:
```
Each KPI has:
- value (raw metric)
- min_healthy (lower bound)
- max_healthy (upper bound)
- direction (↑, ↓, or Band)

Normalization:
- ↑ (higher is better): normalized = (value - min) / (max - min)
- ↓ (lower is better): normalized = (max - value) / (max - min)
- Band (optimal range): normalized = 1 if in range, else distance penalty
```

**Check:**
- [ ] Is direction respected?
- [ ] Are out-of-range values handled gracefully?
- [ ] Division by zero protection (if min = max)?
- [ ] Are weights applied post-normalization?

**Files**: `KPI.js`, `main.js`

---

## TESTING METHODOLOGY

### Unit Tests Needed:

1. **Pentagram Test**:
   ```javascript
   // Given: 5 KPIs with known values
   // Expected: Face energy should match manual calculation
   ```

2. **Breath Ratio Test**:
   ```javascript
   // Given: F11=0.1, F1=0.15
   // Expected: BR = 0.15/0.1 = 1.5 (slightly over-inhaling)
   ```

3. **Global Coherence Test**:
   ```javascript
   // Given: All 12 faces = 0.5
   // Expected: GC = 50%
   ```

4. **Golden Ratio Test**:
   ```javascript
   // Toggle golden mode
   // Expected: Breath thresholds change to [0.618, 1.618]
   ```

### Integration Test:

**Use Nova Tech company as reference**:
- Load `/POC/companies/nova-tech/kpis.csv`
- Calculate coherence manually (spreadsheet)
- Compare to POC output
- Should match within ±1%

---

## SUCCESS CRITERIA

**Math is correct when:**
- [ ] All formulas match Sacred Grammar documentation
- [ ] Manual calculations = POC calculations (±1% tolerance)
- [ ] Golden ratio mode produces φ-aligned outputs
- [ ] Eigenvector analysis reveals interpretable patterns
- [ ] Breath ratios correctly identify over-exhale/inhale
- [ ] No NaN, Infinity, or division-by-zero errors
- [ ] Results are reproducible (same input → same output)

---

## DELIVERABLES

1. **Math Audit Report**: Document comparing backend vs frontend calculations
2. **Test Suite**: Unit tests for each formula
3. **Reference Spreadsheet**: Manual calculation of Nova Tech coherence
4. **Corrections**: List of bugs found + fixes applied
5. **Validation**: Proof that math is thesis-defense-ready

---

## TIMELINE

**This Week** (before university presentation):
- Audit pentagram + breath ratio calculations
- Create Nova Tech manual calculation spreadsheet
- Verify global coherence formula
- Test golden ratio mode

**Next Week** (before onboarding pilots):
- Full eigenvector analysis audit
- Edge tension verification
- Shadow analysis check
- Comprehensive test suite

---

## UNIVERSITY LECTORATE OPPORTUNITY

**Why This Matters:**
- Multiple organizations = statistical significance for thesis
- Academic network = built-in credibility
- Lectorate = potential long-term partnership
- Case studies = publishable research data

**What They Need to See:**
- Mathematically rigorous framework
- Reproducible results
- Clear theoretical foundation (graph theory + spectral analysis)
- Practical application (improved decision-making)

**This math audit ensures we deliver that.**

---

## NEXT STEPS

**Immediate** (start new conversation):
1. Deep dive into `/POC/js/main.js` (18KB math engine)
2. Compare to `/POC/backend-fallback/models/`
3. Create validation test cases
4. Manual calculation spreadsheet for Nova Tech

**Use this command to start fresh:**
```
"Read QUANNEX_BUILD_CONTEXT.md and IMMEDIATE_PRIORITY.md.
We need to audit the mathematical precision of POC calculations.
Start with pentagram harmonic analysis in main.js."
```

---

**Created**: Oct 31, 2025
**Owner**: Deimantas + Ernestas (CTO)
**Reviewer**: Claude (Math Guardian)
**Deadline**: Before university lectorate presentation
**Priority**: CRITICAL (thesis foundation depends on this)
