# 🗺️ Quannex POC - Complete File Structure Map

## 📁 Directory Overview

```
POC/
├── 🌐 HTML Pages (User-facing)
├── 🧠 JavaScript Modules (Logic)
├── 📊 Data Files (Sample data)
├── 🏢 Companies (Multi-company support)
├── 🔧 Backend Fallback (Calculation engine)
└── 📄 Documentation
```

---

## 🌐 HTML Pages - What Opens What

### **Entry Points** (Where users start)

#### 1. **demo.html** ⭐ MAIN DEMO (Recommended)
**Purpose:** Master landing page with company selection
**What it does:**
- Beautiful welcome screen
- Company selection modal (Quannex, Nova Tech, etc.)
- Hosts 4 visualization views as iframes:
  - Dashboard (index.html)
  - 3D Dodecahedron (dodecahedron-3d.html)
  - DNA Helix (octave-dna.html)
  - Simulator (simulator.html)
- Tab navigation between views
- Keyboard shortcuts (1-4, arrows)

**When to use:**
- Video demos
- Presentations
- Investor pitches
- Thesis defense

**URL:** `http://localhost:8000/demo.html`

---

#### 2. **demo-orchestrator.html** ⭐ DATA INPUT WIZARD
**Purpose:** Step-by-step wizard for custom data entry
**What it does:**
- Step 1: Define 12 organizational faces (templates available)
- Step 2: Map KPIs (Quick: 12 KPIs, Full: 60 KPIs)
- Step 3: Calculate coherence
- Step 4: View results + export

**When to use:**
- Entering your own company data
- Client onboarding sessions
- Custom analysis demos
- Showing extensibility

**URL:** `http://localhost:8000/demo-orchestrator.html`

**Key feature:** Has data transformation layer built in!

---

#### 3. **index.html** - Dashboard View
**Purpose:** Main results dashboard (usually embedded in demo.html)
**What it does:**
- Shows global coherence score
- Displays all 12 faces with energy levels
- Face-by-face KPI breakdown
- Color-coded health status
- Loads data from CSV or company-loader

**When to use:**
- As standalone dashboard
- Embedded in demo.html (primary use)

**URL:** `http://localhost:8000/index.html`

---

### **Visualization Pages** (Usually embedded in demo.html)

#### 4. **dodecahedron-3d.html** - Interactive 3D Geometry
**Purpose:** Rotating 3D dodecahedron visualization
**What it does:**
- Three.js 3D rendering
- Face coloring by energy level
- Interactive rotation (mouse/touch)
- Real-time updates
- Sacred geometry representation

**Best for:** Visual impact, presentations, "wow factor"

---

#### 5. **octave-dna.html** - DNA Helix Visualization
**Purpose:** Shows organizational evolution through 7 octaves
**What it does:**
- Double helix animation
- Maps 7 developmental stages (O1-O7)
- Shows current octave position
- Visualizes aspiration vs actuality
- Animated transitions

**Best for:** Explaining organizational maturity, evolution path

---

#### 6. **simulator.html** - Coherence Simulator
**Purpose:** Interactive "what-if" analysis
**What it does:**
- Adjust KPI sliders
- See real-time coherence changes
- Test interventions
- Scenario planning

**Status:** Coming soon / partially implemented

---

## 🧠 JavaScript Modules - The Brain

### **Core Engine**

#### `js/main.js` ⭐ CALCULATION ENGINE
**The mathematical heart of Quannex**
```javascript
Contains:
- KPI class (normalization logic)
- Face class (pentagram analysis, harmonic resonance)
- Edge class (tension calculation)
- Vertex class (vortex dynamics)
- DodecahedronEngine (orchestrator)
- window.Quannex API (public interface)
```

**What it does:**
1. Loads CSV or JSON data
2. Creates 12 Face objects with 60 KPIs
3. Calculates face energies (pentagram harmonics)
4. Computes global coherence
5. Analyzes breath dynamics
6. Exposes results via `window.Quannex.getState()`

**Used by:** index.html, demo.html (in iframes)

---

### **Data Management**

#### `js/company-loader.js` - Multi-Company Support
**What it does:**
- Loads company profiles from `/companies/` folder
- Manages 4 sample companies:
  - Quannex
  - Nova Tech
  - Zenith Solutions
  - Apex Industries
- Parses `company.json` + `kpis.csv`
- Switches between datasets
- Exposes `window.CompanyLoader` API

**Used by:** demo.html (company selection modal)

---

#### `js/data-transformer.js` ⭐ NEW!
**The bridge between UI and Engine**
```javascript
Transforms:
  UI format (demo-orchestrator)
    ↓
  Engine format (main.js)
```

**What it does:**
- Converts property names (faceId → Face_ID)
- Validates data structure
- Ensures type safety
- Provides error messages
- Reverse transforms results for display

**Used by:** demo-orchestrator.html

---

### **UI Components**

#### `js/face-wizard.js` - Template System
**What it does:**
- Provides pre-built organizational templates:
  - Standard Business Model
  - Startup Framework
  - Non-Profit Model
- Manages face name selection
- Face customization UI

**Used by:** demo-orchestrator.html (Step 1)

---

#### `js/kpi-library.js` - KPI Suggestions
**What it does:**
- 100+ pre-defined KPI suggestions
- Organized by face type + element
- Auto-fill targets (min, ideal)
- Unit suggestions (%, $, count)
- Elemental wisdom (Earth, Water, Fire, Air, Ether)

**Used by:** demo-orchestrator.html (Step 2)

---

#### `js/demo-orchestrator-logic.js` - Wizard Logic
**What it does:**
- Step navigation (1→2→3→4)
- Progress tracking
- Form validation
- Data collection
- Calls data-transformer
- Calls calculation engine
- Results display

**Used by:** demo-orchestrator.html

---

### **Analysis Modules**

#### `js/breath-analyzer.js` - Breath Dynamics
**What it does:**
- Analyzes 6 polarity axes:
  1. Financial ↔ Funding
  2. Intellectual ↔ Brand
  3. Human ↔ Operations
  4. Regenerative ↔ Structural
  5. Values ↔ Market
  6. Risk ↔ Community
- Detects over-inhaling (receiving)
- Detects under-exhaling (giving)
- Calculates being-action balance

**Used by:** main.js (automatic analysis)

---

## 📊 Data Files

### **Sample Data (CSV)**

#### `data/CSV_KPI_DATABASE.csv`
- Master KPI definitions
- Default values for testing
- Used by index.html when no company selected

#### `data/CSV_FACE_MODELS.csv`
- Face definitions
- Edge mappings
- Vertex configurations

#### Other CSV files:
- `CSV_BREATH_RATIOS.csv` - Breath analysis config
- `CSV_EDGE_TENSION_MAP.csv` - Edge definitions
- `CSV_VORTEX_MAP.csv` - Vertex (20 points)
- `CSV_SYSTEM_COHERENCE.csv` - Global coherence thresholds

---

### **Company Data (JSON + CSV)**

```
companies/
├── quannex/
│   ├── company.json       (Profile, story, challenges)
│   └── kpis.csv           (60 KPI values)
├── nova-tech/
│   ├── company.json
│   └── kpis.csv
├── zenith-solutions/
│   ├── company.json
│   └── kpis.csv
└── apex-industries/
    ├── company.json
    └── kpis.csv
```

**Format:**
```json
// company.json
{
  "id": "quannex",
  "name": "Quannex",
  "tagline": "...",
  "stage": "Pre-Seed",
  "octaveProfile": { ... },
  "challenges": [ ... ],
  "strengths": [ ... ]
}
```

```csv
# kpis.csv
KPI_ID,KPI_Name,Value,Weight,Direction,Target_Min,Target_Ideal,...
F1_E1,Monthly Runway,5.3,1.0,↑,3,6,...
```

---

## 🔧 Backend Fallback

**Purpose:** Node.js calculation engine (alternative to browser-based main.js)

```
backend-fallback/
├── models/
│   ├── Dodecahedron.js      (Main orchestrator)
│   ├── Face.js              (Face logic)
│   ├── KPI.js               (KPI normalization)
│   ├── Edge.js              (Edge tension)
│   ├── Vertex.js            (Vortex dynamics)
│   ├── PentagramAnalyzer.js (Harmonic resonance)
│   ├── ShadowPenaltyEngine.js (Ethical patterns)
│   ├── BreathAnalyzer.js    (Breath dynamics)
│   └── SpectralAnalyzer.js  (Eigenvalue analysis)
├── data/
│   └── sampleData.js        (Test data)
└── utils/
    └── OctaveCSVParser.js   (CSV parsing)
```

**Used by:** Could be used for server-side processing (not currently active)

---

## 📄 Documentation

### Core Docs
- `MATH_REFERENCE.md` ⭐ - Complete mathematical framework (2,400+ lines)
- `README.md` - Project overview
- `ENHANCEMENTS_V2.1.md` - Recent improvements
- `TROUBLESHOOTING_KPI_COLLECTION.md` - Debug guide
- `DATA_FLOW_ARCHITECTURE.md` ⭐ NEW - Data pipeline explanation
- `DEMO_UPGRADE_GUIDE.md` ⭐ NEW - Demo usage guide
- `FILE_STRUCTURE_MAP.md` ⭐ THIS FILE

---

## 🎯 Which File to Use When

### **For Video Demos**
→ `demo.html` (company selection → instant visualization)

### **For Custom Data Entry**
→ `demo-orchestrator.html` (wizard interface)

### **For Development/Testing**
→ `index.html` (standalone dashboard)

### **For 3D Showcase**
→ `dodecahedron-3d.html` (standalone 3D)

### **For Academic Presentation**
→ `demo.html` + `MATH_REFERENCE.md` (visual + theory)

---

## 🔄 Data Flow Paths

### **Path 1: Pre-loaded Company Demo**
```
User opens demo.html
  ↓
Clicks "Try Sample Companies"
  ↓
Selects "Quannex"
  ↓
company-loader.js loads:
  - companies/quannex/company.json
  - companies/quannex/kpis.csv
  ↓
Passes to main.js (in iframe)
  ↓
main.js creates DodecahedronEngine
  ↓
Calculates coherence
  ↓
Renders in index.html (dashboard iframe)
  ↓
User can switch tabs to see:
  - 3D view (dodecahedron-3d.html)
  - DNA helix (octave-dna.html)
```

### **Path 2: Custom Data Wizard**
```
User opens demo-orchestrator.html
  ↓
Step 1: Defines 12 faces (from template or custom)
  ↓
Step 2: Enters KPI values (12 or 60)
  ↓
Clicks "Calculate"
  ↓
demo-orchestrator-logic.js collects data
  ↓
data-transformer.js validates + converts format
  ↓
main.js (loaded in page) runs calculation
  ↓
Step 3: Shows coherence score + breakdown
  ↓
Step 4: Links to visualizations
```

### **Path 3: Direct Dashboard (Legacy)**
```
User opens index.html directly
  ↓
main.js loads data/CSV_KPI_DATABASE.csv
  ↓
Creates default company
  ↓
Shows dashboard
```

---

## 🎨 Naming Convention

### Why so many "index" and "demo" files?

**Historical context:**
1. `index.html` - Originally the only page (now dashboard component)
2. `demo.html` - Added later as landing page wrapper
3. `demo-orchestrator.html` - Added for guided data entry

**Better naming would be:**
- `index.html` → `dashboard.html` ❌ (but index is web convention)
- `demo.html` → `landing.html` or `main.html`
- `demo-orchestrator.html` → `wizard.html`

**Why we keep current names:**
- `index.html` is web standard for default page
- Changing breaks existing bookmarks/links
- Internal consistency maintained

---

## 🚀 Recommended Entry Points by Use Case

| Use Case | File | Why |
|----------|------|-----|
| **Quick Demo** | demo.html | Pre-loaded companies, one-click |
| **Thesis Defense** | demo.html | Professional, visual, complete |
| **Investor Pitch** | demo.html → Quannex | Shows real data + vision |
| **Client Onboarding** | demo-orchestrator.html | Guided input process |
| **Development** | index.html | Fast iteration, direct access |
| **Academic Paper** | MATH_REFERENCE.md | Full theory |
| **Code Review** | js/main.js | Core algorithms |

---

## 🎓 For Your Thesis

**Include this architecture diagram:**

```
┌─────────────────────────────────────────────┐
│         User Interface Layer                │
│  (demo.html, demo-orchestrator.html)       │
└──────────────┬──────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────┐
│      Data Transformation Layer              │
│       (data-transformer.js)                 │
└──────────────┬──────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────┐
│       Calculation Engine Layer              │
│  (main.js: Dodecahedron, Faces, KPIs)      │
└──────────────┬──────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────┐
│      Visualization Layer                    │
│  (index.html, dodecahedron-3d.html, etc.)  │
└─────────────────────────────────────────────┘
```

---

## 🔑 Key Files Cheat Sheet

**Must understand:**
1. `demo.html` - Main entry point
2. `demo-orchestrator.html` - Data input wizard
3. `js/main.js` - All calculations happen here
4. `js/data-transformer.js` - Bridges UI ↔ Engine
5. `companies/*/` - Sample data

**Nice to know:**
6. `js/company-loader.js` - Loads samples
7. `js/kpi-library.js` - Suggestions library
8. `MATH_REFERENCE.md` - Theory

**Can ignore for now:**
9. `backend-fallback/` - Alternative engine
10. Most CSV files in `data/` - Legacy

---

## 📋 Summary

**3 Main Entry Points:**
1. **demo.html** - For presentations (USE THIS!)
2. **demo-orchestrator.html** - For data entry
3. **index.html** - For development

**Core Engine:**
- **js/main.js** - All math happens here

**Bridge:**
- **js/data-transformer.js** - Connects UI to engine

**Visualizations:**
- **index.html** (dashboard)
- **dodecahedron-3d.html** (3D)
- **octave-dna.html** (DNA)

**Everything else:** Supporting files, data, docs

---

**Created:** 2025-11-10
**For:** Thesis defense & demo preparation
**Status:** Complete reference guide
