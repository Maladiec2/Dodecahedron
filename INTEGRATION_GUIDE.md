# 🔗 Quannex Demo Integration Guide

**How the Demo System Connects to the Existing Codebase**

---

## Quick Start

### Running the Demo

```bash
# From the POC folder
cd POC

# Start a local server (choose one):
python -m http.server 8080
# OR
npx http-server -p 8080

# Open in browser:
http://localhost:8080/demo-orchestrator.html
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  NEW: demo-orchestrator.html                            │
│  Main entry point for guided demo flow                  │
└───────────────┬─────────────────────────────────────────┘
                │
                ├──► js/face-wizard.js (NEW)
                │    └─► Template selection & face definition
                │
                ├──► js/demo-orchestrator-logic.js (NEW)
                │    └─► Navigation & state management
                │
                ├──► js/main.js (EXISTING)
                │    └─► Core Quannex calculation engine
                │
                ├──► js/dodecahedron-viz.js (EXISTING)
                │    └─► 3D visualization
                │
                ├──► js/breath-analyzer.js (EXISTING)
                │    └─► Breath polarity analysis
                │
                └──► js/company-loader.js (EXISTING)
                     └─► Multi-company data management
```

---

## File Relationships

### New Files (Demo System)

| File | Purpose | Dependencies |
|------|---------|--------------|
| `demo-orchestrator.html` | Main demo shell | face-wizard.js, demo-orchestrator-logic.js |
| `js/face-wizard.js` | Face template selection | None (standalone) |
| `js/demo-orchestrator-logic.js` | Navigation & state | face-wizard.js, main.js (optional) |
| `DEMO_GUIDE.md` | User documentation | None |
| `MATH_REFERENCE.md` | Formula documentation | None |
| `INTEGRATION_GUIDE.md` | This file | None |

### Existing Files (Quannex Engine)

| File | Purpose | Used By Demo |
|------|---------|--------------|
| `js/main.js` | Core calculation engine | ✅ Yes (optional fallback) |
| `js/dodecahedron-viz.js` | 3D visualization | ✅ Yes (launched from Step 4) |
| `js/breath-analyzer.js` | Breath analysis | ✅ Yes (via main.js) |
| `js/company-loader.js` | Multi-company loader | ✅ Yes (data structure) |
| `index.html` | Original dashboard | ✅ Yes (launched from Step 4) |
| `octave-dna.html` | DNA helix view | ✅ Yes (launched from Step 4) |
| `demo.html` | Multi-view navigator | ⚠️ Overlapping functionality |

---

## Data Flow

### 1. Face Definition (Step 1)

```javascript
// User selects template
selectTemplate('business')
  ↓
// face-wizard.js loads template
currentFaces = FACE_TEMPLATES['business'].faces
  ↓
// User customizes names (optional)
updateFaceName(1, 'Financial Capital')
  ↓
// Configuration saved to state
demoState.faceConfig = {
  template: 'business',
  faces: [...]
}
```

### 2. KPI Mapping (Step 2)

```javascript
// User selects mode
selectMode('quick') or selectMode('full')
  ↓
// demo-orchestrator-logic.js renders form
generateQuickModeHTML() or generateFullModeHTML()
  ↓
// User enters KPI data
<input data-face-id="1" data-field="kpiName" value="Revenue Growth" />
  ↓
// Data collected on submit
demoState.kpiData = collectKPIData()
  ↓
// Structure:
{
  faceId: 1,
  name: 'Revenue Growth',
  value: 15,
  direction: '↑',
  targetMin: 0,
  targetIdeal: 25,
  element: 'Earth'
}
```

### 3. Calculation (Step 3)

```javascript
// runCalculation() triggered
companyData = {
  name: demoState.faceConfig.templateName,
  kpis: demoState.kpiData
}
  ↓
// Check if Quannex engine loaded
if (window.quannexEngine) {
  // Use real engine
  await window.quannexEngine.initializeWithCompany(companyData)
  results = window.quannexEngine.getState()
} else {
  // Fallback to simple calculation
  results = calculateSimpleCoherence(kpis)
}
  ↓
// Results stored
demoState.coherenceResults = {
  globalCoherence: 0.67,
  coherenceStatus: 'Moderate',
  faces: [...]
}
```

### 4. Visualization (Step 4)

```javascript
// User clicks visualization button
launchView('dodecahedron')
  ↓
// Opens existing visualization in new tab
window.open('dodecahedron-3d.html', '_blank')
  ↓
// Visualization loads demo data
// (requires integration - see below)
```

---

## Integration Points

### Option A: Standalone Mode (Current)

**Status**: ✅ Fully functional

The demo orchestrator works independently with a fallback calculation engine.

**Pros**:
- No dependencies on backend
- Works offline
- Fast and simple

**Cons**:
- Doesn't use full Quannex engine features
- Separate from existing visualizations

**Use case**: Quick demos, initial presentations

---

### Option B: Integrated Mode (Recommended)

**Status**: ⚠️ Requires connection layer

Connect the demo to existing Quannex engine and visualizations.

**Implementation**:

#### 1. Load Quannex Engine

In `demo-orchestrator.html`, add before closing `</body>`:

```html
<!-- Load Quannex Engine -->
<script src="js/breath-analyzer.js"></script>
<script type="module" src="js/main.js"></script>
<script type="module" src="js/company-loader.js"></script>
```

#### 2. Wait for Engine to Load

In `demo-orchestrator-logic.js`, update `runCalculation()`:

```javascript
async function runCalculation() {
    showLoading('Calculating coherence...');

    // Wait for Quannex engine to be ready
    let attempts = 0;
    while (!window.quannexEngine && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }

    if (!window.quannexEngine) {
        console.warn('⚠️ Quannex engine not loaded, using fallback');
        demoState.coherenceResults = calculateSimpleCoherence(demoState.kpiData);
    } else {
        // Use real engine
        const companyData = {
            name: demoState.faceConfig.templateName,
            kpis: demoState.kpiData
        };

        await window.quannexEngine.initializeWithCompany(companyData);
        demoState.coherenceResults = window.quannexEngine.getState();
    }

    displayCalculationResults();
    hideLoading();
}
```

#### 3. Pass Data to Visualizations

Create a shared data layer using `localStorage`:

```javascript
// In demo-orchestrator-logic.js
function saveToSharedState() {
    localStorage.setItem('quannexDemoData', JSON.stringify({
        faceConfig: demoState.faceConfig,
        kpiData: demoState.kpiData,
        coherenceResults: demoState.coherenceResults,
        timestamp: Date.now()
    }));
}

// Call before launching views
function launchView(viewName) {
    saveToSharedState();
    const url = viewUrls[viewName];
    window.open(url, '_blank');
}
```

Then in `dodecahedron-viz.js`, `index.html`, etc.:

```javascript
// Check for demo data
const demoData = localStorage.getItem('quannexDemoData');
if (demoData) {
    const parsed = JSON.parse(demoData);
    // Use parsed.coherenceResults to populate visualization
    loadDemoData(parsed);
}
```

---

## Migration Path

### Phase 1: Standalone Demo (Current State)
✅ **Completed**
- Demo orchestrator works independently
- Fallback calculations
- Manual navigation to visualizations

### Phase 2: Engine Integration
🔨 **Recommended Next**
- Load existing Quannex engine
- Use real pentagram analysis
- Pass data to visualizations via localStorage

**Effort**: 2-3 hours

### Phase 3: Seamless Navigation
🚀 **Future Enhancement**
- Embed visualizations in demo (iframes or components)
- Real-time updates across views
- Unified state management

**Effort**: 1-2 days

### Phase 4: Full Feature Parity
✨ **Long-term Goal**
- All features from `index.html`, `octave-dna.html`, etc. available in demo
- Unified navigation
- Single source of truth

**Effort**: 1 week

---

## Configuration Files

### Face Templates

Templates are defined in `js/face-wizard.js`:

```javascript
const FACE_TEMPLATES = {
    business: { ... },
    startup: { ... },
    nonprofit: { ... },
    custom: { ... }
}
```

**To add a new template**:

1. Edit `js/face-wizard.js`
2. Add to `FACE_TEMPLATES` object:

```javascript
mytemplate: {
    name: "My Custom Template",
    faces: [
        { id: 1, name: "Domain 1", icon: "🔷" },
        { id: 2, name: "Domain 2", icon: "🔶" },
        // ... 12 total
    ]
}
```

3. Add template card to `demo-orchestrator.html`:

```html
<div class="template-card" onclick="selectTemplate('mytemplate')" id="template-mytemplate">
    <div class="template-header">
        <span class="template-icon">🎨</span>
        <span class="template-name">My Custom Template</span>
    </div>
    <div class="template-description">
        Description here
    </div>
    <div class="template-faces">
        Includes: Domain 1, Domain 2, ...
    </div>
</div>
```

---

## Customization Guide

### Changing Colors

Edit `demo-orchestrator.html` `<style>` section:

```css
/* Primary accent color */
--accent-color: #00ffcc; /* Cyan/teal */

/* Change to purple */
--accent-color: #8a2be2;
```

Replace all instances of `#00ffcc` with your color.

### Adding More Steps

1. Update `demoState.totalSteps` in `demo-orchestrator-logic.js`:

```javascript
const demoState = {
    totalSteps: 5, // was 4
    ...
}
```

2. Add step button in `demo-orchestrator.html`:

```html
<button class="step-button" data-step="5" onclick="goToStep(5)">
    <span class="step-number">5</span>
    Export
</button>
```

3. Add step content:

```html
<div class="step-content" id="step5">
    <!-- Your content here -->
</div>
```

4. Add completion function in `demo-orchestrator-logic.js`:

```javascript
function completeStep5() {
    markStepCompleted(5);
    // Your logic
}
```

---

## Troubleshooting

### Issue: "Quannex engine not loaded"

**Cause**: `main.js` not imported correctly

**Fix**: Add to `demo-orchestrator.html`:

```html
<script src="js/breath-analyzer.js"></script>
<script type="module" src="js/main.js"></script>
```

---

### Issue: Calculations don't match Excel

**Cause**: Using fallback calculator instead of real engine

**Fix**: Verify engine loaded:

```javascript
console.log('Engine loaded:', typeof window.quannexEngine !== 'undefined');
```

If false, check script imports.

---

### Issue: Visualizations don't show demo data

**Cause**: Data not passed between pages

**Fix**: Implement `localStorage` bridge (see "Pass Data to Visualizations" above)

---

## Testing Checklist

Before presenting to an organization:

- [ ] All 4 steps navigate correctly
- [ ] Template selection works
- [ ] Face names can be customized
- [ ] KPI forms render correctly
- [ ] Calculations complete without errors
- [ ] Results display properly
- [ ] Visualizations launch
- [ ] Configuration exports as JSON
- [ ] "Start Over" button resets state
- [ ] Help guide opens
- [ ] Progress bar updates
- [ ] Mobile responsive (optional)

---

## Next Steps

1. **Test the standalone demo**: Open `demo-orchestrator.html` and walk through all 4 steps
2. **Integrate with engine**: Follow "Option B: Integrated Mode" above
3. **Customize templates**: Add organization-specific face templates
4. **Add presenter notes**: Create `docs/PRESENTER_SCRIPT.md` with talking points
5. **Record a demo**: Screen capture walkthrough for training

---

## Support

**Documentation**:
- User guide: [DEMO_GUIDE.md](DEMO_GUIDE.md)
- Math reference: [MATH_REFERENCE.md](MATH_REFERENCE.md)
- Main README: [../README.md](../README.md)

**Key Files**:
- Main demo: `demo-orchestrator.html`
- Face wizard: `js/face-wizard.js`
- Orchestrator logic: `js/demo-orchestrator-logic.js`

---

**Built with intention • Documented with care • Ready to transform organizations**

Version: 2.0
Last Updated: 2025-11-09
