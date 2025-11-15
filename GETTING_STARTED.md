# 🚀 GETTING STARTED WITH QUANNEX
**The Fastest Path from Zero to Demo**

---

## 📋 Prerequisites

**You need:**
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Basic file navigation skills
- 5 minutes

**You don NOT need:**
- Node.js or npm (optional for development)
- A backend server
- Database setup
- Build tools
- Any coding experience

---

## ⚡ FASTEST START (30 Seconds)

### Method 1: Just Open the File

1. Navigate to the POC folder:
   ```
   Dodecahedron Code/POC/
   ```

2. **Double-click** `DEMO.html`

3. **That's it!** The demo opens in your browser.

**Note:** Some features (like loading company data from CSV) may require Method 2 below.

---

## 🌐 RECOMMENDED START (GitHub Pages Style)

This method mimics how it will work on GitHub Pages.

### Method 2: Local Web Server

**Option A: Simple Python Server** (if you have Python)
```bash
cd "Dodecahedron Code/POC"
python -m http.server 8080
```

Then open: `http://localhost:8080/DEMO.html`

**Option B: Simple HTTP Server** (if you have npm)
```bash
cd "Dodecahedron Code/POC"
npx http-server -p 8080 -c-1
```

Then open: `http://localhost:8080/DEMO.html`

**Option C: VS Code Live Server**
1. Install "Live Server" extension in VS Code
2. Right-click `POC/DEMO.html`
3. Select "Open with Live Server"

---

## 🎯 WHAT TO EXPLORE

Once the demo loads, you'll see the main navigation. Here's what each view does:

### 1. Dashboard ([POC/index.html](POC/index.html))
- **What it shows:** Global coherence score + 12 face cards
- **Try this:** Look for red/yellow faces (struggling domains)
- **Learn:** Each face has 5 elemental KPIs with pentagram geometry

### 2. 3D Dodecahedron ([POC/dodecahedron-3d.html](POC/dodecahedron-3d.html))
- **What it shows:** Interactive 3D sacred geometry
- **Try this:** Click on faces to deep-dive into specific domains
- **Learn:** Face color = energy level (red → yellow → green)

### 3. DNA Helix ([POC/octave-dna.html](POC/octave-dna.html))
- **What it shows:** 6 double helices (breath axes) across 7 octaves
- **Try this:** Toggle pentagram overlay on/off
- **Learn:** Each helix shows Reception ↔ Projection balance

### 4. Data Wizard ([POC/demo-orchestrator.html](POC/demo-orchestrator.html))
- **What it shows:** Step-by-step company setup
- **Try this:** Create your own company data
- **Learn:** Choose face templates, enter KPIs, export CSV

### 5. Simulator ([POC/simulator.html](POC/simulator.html)) ⚠️
- **Status:** UI mockup only (Week 2 feature, not yet connected)
- **Future:** Will allow "what-if" scenarios with live sliders

---

## 📊 DEMO COMPANIES

The POC includes 4 sample companies at different octave stages:

### 1. Quannex (Survival Mode: O1-O2)
- **File:** `POC/companies/quannex/`
- **Story:** Early-stage startup, struggling with funding and market fit
- **Coherence:** ~45% (Dimming/Struggling)
- **Key Issue:** Over-exhaling on Being/Doing axis (burnout risk)

### 2. Nova Tech (Growth Stage: O3-O4)
- **File:** `POC/companies/nova-tech/`
- **Story:** Growing company, building relationships and creativity
- **Coherence:** ~65% (Moderate/Healthy)
- **Key Issue:** Balancing growth with sustainability

### 3. Apex Industries (Mature: O5-O6)
- **File:** `POC/companies/apex-industries/`
- **Story:** Established organization, strong expression and vision
- **Coherence:** ~80% (Excellent)
- **Strength:** Well-balanced across all domains

### 4. Zenith Solutions (Radiant: O7)
- **File:** `POC/companies/zenith-solutions/`
- **Story:** The ideal - conscious, coherent, thriving
- **Coherence:** ~95% (Exceptional/Radiant)
- **Example:** What to aspire to

---

## 🎬 YOUR FIRST DEMO WALKTHROUGH

Follow this script for a powerful 10-minute demo:

### Step 1: Start with the Story (2 min)
1. Open `DEMO.html`
2. Say: "This is Quannex - we map organizational health onto sacred geometry"
3. Explain the dodecahedron: 12 faces = 12 domains

### Step 2: Show the Crisis (3 min)
1. Load **Quannex** company data
2. Open Dashboard: "See the global coherence? 45% - Dimming"
3. Point out red faces: "Market Resonance (12%), Funding Pipeline (23%)"
4. Open DNA Helix: "Notice the Being/Doing axis? We're over-exhaling - burnout!"

### Step 3: Show the Math (3 min)
1. Open 3D Dodecahedron
2. Click on a struggling face (e.g., Face 5: Market Resonance)
3. Say: "Each face has 5 elemental KPIs analyzed through pentagram geometry"
4. Explain harmonic resonance: "When elements work together, energy increases"

### Step 4: Show the Solution (2 min)
1. Compare to **Zenith Solutions** (95% coherence)
2. Open their Dashboard: "All faces balanced, breath rhythms healthy"
3. Say: "This is what coherence looks like - and it's measurable"

### Step 5: Invite Interaction (Optional)
1. Open Data Wizard: "Want to analyze YOUR organization?"
2. Walk through creating custom company data
3. Show instant calculations

---

## 🔧 TROUBLESHOOTING

### Problem: "DEMO.html won't load"
**Solution:** Use Method 2 (web server) instead of double-clicking

### Problem: "Company data doesn't load"
**Solution:**
1. Check that you're in the POC directory
2. Use a web server (Method 2), not file:// protocol
3. Check browser console (F12) for errors

### Problem: "3D dodecahedron is black/blank"
**Solution:**
1. Check browser console for Three.js errors
2. Make sure you have internet (Three.js loads from CDN)
3. Try a different browser (Chrome recommended)

### Problem: "Numbers don't make sense"
**Solution:**
1. Check KPI direction (↑ Up, ↓ Down, or Band)
2. Verify target ranges (targetMin, targetIdeal, etc.)
3. See [POC/MATH_REFERENCE.md](POC/MATH_REFERENCE.md) for formulas

---

## 📖 UNDERSTANDING THE MATH

### Face Energy Formula
```
E_face = E_base × (1 + 0.3 × R_harmonic)
```

Where:
- `E_base` = Weighted average of 5 elemental KPI scores
- `R_harmonic` = How well the 5 elements resonate (pentagram geometry)
- Harmonic boost = Up to 30% increase when elements align

### Global Coherence
```
C_global = Σ(E_face) / 12
```

Simple average of all 12 face energies.

### Breath Ratio
```
R_breath = E_projection / E_reception
```

For each of 6 axes:
- `0.8 ≤ R ≤ 1.2` = Balanced breathing
- `R > 1.2` = Over-exhaling (burnout risk)
- `R < 0.8` = Over-inhaling (stagnation)

**For detailed formulas:** See [POC/MATH_REFERENCE.md](POC/MATH_REFERENCE.md)

---

## 🚀 DEPLOYING TO GITHUB PAGES

### Step 1: Push to GitHub
```bash
cd "Dodecahedron Code"
git add POC/
git commit -m "Prepare POC for GitHub Pages deployment"
git push origin main
```

### Step 2: Enable GitHub Pages
1. Go to your repo on GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: `main` → Folder: `/POC`
5. Save

### Step 3: Access Your Demo
Your demo will be live at:
```
https://[your-username].github.io/[repo-name]/DEMO.html
```

**Note:** It may take 1-2 minutes for changes to appear.

---

## 🎯 CUSTOMIZING FOR YOUR DEMO CALL

### Before the Call
1. **Pick the best demo company** for your audience:
   - Startup founders → Show Quannex (struggling, relatable)
   - Business schools → Show Nova Tech (growth dynamics)
   - Consultants → Show Apex vs. Zenith (transformation journey)

2. **Prepare your story:**
   - What's broken in traditional metrics?
   - Why sacred geometry?
   - What does coherence actually mean?

3. **Test everything:**
   - Open all views, make sure they load
   - Practice the walkthrough (time yourself)
   - Have backup browser open

### During the Call
1. **Share your screen** with DEMO.html already loaded
2. **Start with the crisis** (emotional hook)
3. **Show the math** (credibility)
4. **End with the vision** (Zenith Solutions - what's possible)

### After the Call
1. Send them the GitHub Pages link
2. Offer to analyze their company (use Data Wizard)
3. Share academic paper (when ready)

---

## 📚 NEXT STEPS

### Learn More
- **Project Overview:** [README.md](README.md)
- **Current Status:** [PROJECT_STATUS.md](PROJECT_STATUS.md)
- **Feature Details:** [POC/DEMO_GUIDE.md](POC/DEMO_GUIDE.md)
- **Math Details:** [POC/MATH_REFERENCE.md](POC/MATH_REFERENCE.md)
- **Latest Updates:** [SESSION_HANDOFF.md](SESSION_HANDOFF.md)

### Contribute
- See [POC/FILE_STRUCTURE_MAP.md](POC/FILE_STRUCTURE_MAP.md) for code organization
- See [POC/DATA_FLOW_ARCHITECTURE.md](POC/DATA_FLOW_ARCHITECTURE.md) for data flow
- (CONTRIBUTING.md coming soon)

### Get Help
- Check browser console (F12) for errors
- See [POC/TESTING_CHECKLIST.md](POC/TESTING_CHECKLIST.md)
- File an issue on GitHub

---

## 🌟 PHILOSOPHY

> "Organizations are living systems, not machines. They breathe, resonate, evolve. Quannex makes this visible through the timeless beauty of sacred geometry."

Every feature serves this vision:
- **Dodecahedron:** The most complex Platonic solid (12 faces = completeness)
- **Pentagram:** Golden ratio (φ) in nature (5 elements = harmony)
- **Breath:** Universal rhythm (reception ↔ projection = life)
- **Octaves:** Consciousness evolution (7 stages = growth)

**This isn't just software. It's a new way of seeing.**

---

**Ready to show the world? Let's go! 🚀**
