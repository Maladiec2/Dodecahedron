# 🔷 Dodecahedron 3D View - Polishing Roadmap

**Priority:** HIGH (Thesis Visual Centerpiece)
**Current State:** Basic 3D geometry renders, but doesn't reflect company data dynamically
**Goal:** Make dodecahedron faces change color/glow based on organizational health data

---

## 🎯 Target Experience

**What we want users to see:**
1. Open 3D view → Dodecahedron spins slowly
2. Each of 12 faces has a different color:
   - 🟢 **Green** = Healthy (energy 70-100%)
   - 🟡 **Yellow** = Moderate (energy 40-69%)
   - 🔴 **Red** = Critical (energy 0-39%)
3. Click a face → Popup shows:
   - Face name (e.g., "Financial Capital")
   - Energy percentage (e.g., "45%")
   - 5 elemental KPIs with values
   - Pentagram harmony score
4. Faces with low energy pulse/glow to draw attention
5. Global coherence score updates in stats panel

---

## 📋 Implementation Tasks

### Phase 1: Dynamic Face Colors (Core Feature)
**Estimated Time:** 2-3 hours

#### Task 1.1: Read Quannex Face Data
**File:** `dodecahedron-3d.html` or new `js/dodecahedron-viz.js`

**Current Issue:**
- Dodecahedron renders with uniform cyan color
- No connection to Quannex face energy data

**Fix:**
```javascript
// After Quannex engine loads
const faces = window.Quannex.getFaces();

// Map face IDs to dodecahedron geometry faces
// Dodecahedron has 12 faces → matches 12 organizational faces!
faces.forEach((face, index) => {
  const faceGeometry = dodecahedronMeshes[index]; // Get corresponding 3D face
  const color = getFaceColor(face.energy);
  faceGeometry.material.color.setHex(color);
});
```

**Function to add:**
```javascript
function getFaceColor(energy) {
  if (energy >= 0.7) return 0x00ff88; // Healthy green
  if (energy >= 0.4) return 0xffcc00; // Warning yellow
  return 0xff4444; // Critical red
}
```

#### Task 1.2: Update Color Mapping
**Challenge:** Three.js dodecahedron face indices may not match Face_ID order

**Solution:**
```javascript
// Create explicit mapping
const faceMapping = {
  0: 1,  // 3D face 0 → Quannex Face 1 (Financial Capital)
  1: 2,  // 3D face 1 → Quannex Face 2 (Intellectual Capital)
  // ... etc for all 12 faces
};
```

**How to find mapping:**
- Look at `js/dodecahedron-viz.js` to see how faces are created
- Check Three.js dodecahedron face order documentation
- Or: Label each face temporarily to identify visually

#### Task 1.3: Add Material Properties
**Enhancement:** Use emissive materials for glow effect

```javascript
const material = new THREE.MeshPhongMaterial({
  color: color,
  emissive: color,
  emissiveIntensity: energy * 0.5, // Brighter = higher energy
  shininess: 100,
  transparent: false,
  opacity: 1.0
});
```

---

### Phase 2: Face Click Detection (Interactivity)
**Estimated Time:** 2 hours

#### Task 2.1: Add Raycasting
**File:** `dodecahedron-3d.html`

```javascript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the ray
  const intersects = raycaster.intersectObjects(dodecahedronMeshes);

  if (intersects.length > 0) {
    const clickedFace = intersects[0].object;
    const faceIndex = clickedFace.userData.faceId;
    showFaceDetail(faceIndex);
  }
}

canvas.addEventListener('click', onMouseClick);
```

#### Task 2.2: Face Detail Popup
**Already exists!** There's a `.face-detail-panel` in the HTML (lines 147-489)

**Update it:**
```javascript
function showFaceDetail(faceIndex) {
  const face = window.Quannex.getFaces()[faceIndex];

  document.getElementById('faceDetailTitle').textContent = face.name;
  document.getElementById('faceEnergyDisplay').textContent =
    (face.energy * 100).toFixed(1) + '%';

  // Populate KPI grid
  const kpiGrid = document.getElementById('kpiGrid');
  kpiGrid.innerHTML = face.kpis.map(kpi => `
    <div class="kpi-item">
      <div class="kpi-item-header">
        <span class="kpi-name">${kpi.name}</span>
        <span class="kpi-element ${kpi.element.toLowerCase()}">${kpi.element}</span>
      </div>
      <div class="kpi-value-bar">
        <div class="kpi-value-fill ${getHealthClass(kpi.normalizedScore)}"
             style="width: ${kpi.normalizedScore * 100}%"></div>
      </div>
    </div>
  `).join('');

  // Show panel
  document.getElementById('faceDetailPanel').classList.add('visible');
}
```

---

### Phase 3: Animations & Polish (Visual Impact)
**Estimated Time:** 2 hours

#### Task 3.1: Pulse Effect for Critical Faces
**Add to animation loop:**

```javascript
function animate() {
  requestAnimationFrame(animate);

  // Pulse critical faces
  const time = Date.now() * 0.001; // Time in seconds
  dodecahedronMeshes.forEach((mesh, index) => {
    const face = window.Quannex.getFaces()[index];
    if (face.energy < 0.4) {
      // Pulse critical faces
      const pulse = Math.sin(time * 2) * 0.2 + 0.8; // Oscillates 0.6-1.0
      mesh.material.emissiveIntensity = pulse;
    }
  });

  controls.update();
  renderer.render(scene, camera);
}
```

#### Task 3.2: Hover Effect
**Highlight face on hover:**

```javascript
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(dodecahedronMeshes);

  // Reset previous hover
  dodecahedronMeshes.forEach(mesh => {
    if (!mesh.userData.clicked) {
      mesh.scale.set(1, 1, 1);
    }
  });

  // Highlight hovered face
  if (intersects.length > 0) {
    const hoveredFace = intersects[0].object;
    hoveredFace.scale.set(1.05, 1.05, 1.05); // Slightly enlarge
    canvas.style.cursor = 'pointer';
  } else {
    canvas.style.cursor = 'default';
  }
}

canvas.addEventListener('mousemove', onMouseMove);
```

#### Task 3.3: Smooth Color Transitions
**When company switches:**

```javascript
function updateFaceColors(faces) {
  faces.forEach((face, index) => {
    const mesh = dodecahedronMeshes[index];
    const targetColor = new THREE.Color(getFaceColor(face.energy));

    // Animate color change over 1 second
    animateColor(mesh.material, targetColor, 1000);
  });
}

function animateColor(material, targetColor, duration) {
  const startColor = material.color.clone();
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    material.color.lerpColors(startColor, targetColor, progress);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  update();
}
```

---

### Phase 4: Stats Panel Integration (Context)
**Estimated Time:** 1 hour

#### Task 4.1: Update Stats in Real-Time
**Already partially implemented** (lines 552-560 in dodecahedron-3d.html)

**Enhance:**
```javascript
function updateStatsPanel() {
  const state = window.Quannex.getState();

  // Coherence
  document.getElementById('statCoherence').textContent =
    (state.globalCoherence * 100).toFixed(1) + '%';

  // Status with color
  const status = getStatusText(state.globalCoherence);
  const statusEl = document.getElementById('statStatus');
  statusEl.textContent = status.text;
  statusEl.style.color = status.color;

  // Face count by health
  const faces = window.Quannex.getFaces();
  const healthy = faces.filter(f => f.energy >= 0.7).length;
  const moderate = faces.filter(f => f.energy >= 0.4 && f.energy < 0.7).length;
  const critical = faces.filter(f => f.energy < 0.4).length;

  // Add new stats
  document.getElementById('statHealthy').textContent = healthy;
  document.getElementById('statModerate').textContent = moderate;
  document.getElementById('statCritical').textContent = critical;
}

function getStatusText(coherence) {
  if (coherence >= 0.7) return { text: 'Healthy ✅', color: '#00ff88' };
  if (coherence >= 0.5) return { text: 'Moderate ⚠️', color: '#ffcc00' };
  if (coherence >= 0.3) return { text: 'Concerning 🔴', color: '#ff6666' };
  return { text: 'Critical 🚨', color: '#ff0000' };
}
```

---

### Phase 5: Camera Controls (UX)
**Estimated Time:** 1 hour

#### Task 5.1: Auto-Focus on Clicked Face
**When user clicks a face:**

```javascript
function focusOnFace(mesh) {
  const targetPosition = mesh.position.clone();
  const distance = 10; // Distance from face

  // Calculate camera position (face position + offset)
  const direction = targetPosition.clone().normalize();
  const cameraTarget = direction.multiplyScalar(distance).add(targetPosition);

  // Animate camera movement
  animateCameraTo(cameraTarget, targetPosition, 1000);
}

function animateCameraTo(newPosition, lookAtTarget, duration) {
  const startPosition = camera.position.clone();
  const startTarget = controls.target.clone();
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Smooth easing (ease-in-out)
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    camera.position.lerpVectors(startPosition, newPosition, eased);
    controls.target.lerpVectors(startTarget, lookAtTarget, eased);
    controls.update();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  update();
}
```

#### Task 5.2: Reset View Button
**Already exists!** Button ID: `resetCameraBtn` (line 674)

**Enhance:**
```javascript
document.getElementById('resetCameraBtn').addEventListener('click', () => {
  animateCameraTo(
    new THREE.Vector3(35, 28, 35),
    new THREE.Vector3(0, 0, 0),
    800
  );
});
```

---

## 🧪 Testing Checklist

### Visual Tests:
- [ ] Open 3D view with Quannex data → Faces show different colors
- [ ] Open 3D view with Nova Tech → Colors change
- [ ] Open 3D view with custom data → Colors reflect custom KPI values
- [ ] Critical faces (red) pulse visibly
- [ ] Hovering over face shows scale effect + pointer cursor

### Interaction Tests:
- [ ] Click a green face → Detail panel shows high energy KPIs
- [ ] Click a red face → Detail panel shows low energy KPIs
- [ ] Click pentagram button → Shows pentagram analysis
- [ ] Click close button → Panel disappears
- [ ] Press ESC → Panel closes

### Stats Panel Tests:
- [ ] Coherence % matches calculation
- [ ] Status text updates (Healthy/Moderate/Critical)
- [ ] Face counts correct (healthy/moderate/critical)
- [ ] Stats update when switching companies

### Camera Tests:
- [ ] Click face → Camera focuses on that face
- [ ] Click "Reset View" → Camera returns to default
- [ ] Manual rotation with mouse still works
- [ ] Auto-rotate toggle works

---

## 📁 Files to Modify

### Primary:
1. **dodecahedron-3d.html** (lines 505-667)
   - Add face color mapping
   - Add click detection
   - Integrate with Quannex data

2. **js/dodecahedron-viz.js** (if it exists)
   - Or create it to separate visualization logic
   - Move all Three.js code here

### Secondary:
3. **js/main.js** (may need to expose additional methods)
   - Ensure `Quannex.getFaces()` returns face energy data
   - Ensure `Quannex.getState()` returns global coherence

4. **CSS in dodecahedron-3d.html**
   - Style updates for stats panel
   - Hover effects

---

## 🎨 Visual Design Reference

### Color Palette:
- **Healthy Green:** `#00ff88` → `rgb(0, 255, 136)`
- **Moderate Yellow:** `#ffcc00` → `rgb(255, 204, 0)`
- **Critical Red:** `#ff4444` → `rgb(255, 68, 68)`
- **Accent Cyan:** `#00ffcc` (already used)
- **Background Black:** `#000000`

### Face Energy → Color Formula:
```javascript
function getFaceColor(energy) {
  if (energy >= 0.7) return 0x00ff88;      // Green
  if (energy >= 0.4) return 0xffa500;      // Orange (transitional)
  return 0xff4444;                         // Red
}

// Or: Gradient approach
function getFaceColorGradient(energy) {
  const red = new THREE.Color(0xff4444);
  const yellow = new THREE.Color(0xffcc00);
  const green = new THREE.Color(0x00ff88);

  if (energy < 0.4) {
    return red.clone();
  } else if (energy < 0.7) {
    // Interpolate between red and yellow
    const t = (energy - 0.4) / 0.3;
    return red.clone().lerp(yellow, t);
  } else {
    // Interpolate between yellow and green
    const t = (energy - 0.7) / 0.3;
    return yellow.clone().lerp(green, t);
  }
}
```

---

## 🚀 Quick Start Guide (For Next Session)

1. **Start server:**
   ```bash
   cd POC
   python -m http.server 8000
   ```

2. **Open 3D view:**
   - Standalone: http://localhost:8000/dodecahedron-3d.html
   - Or via demo: http://localhost:8000/demo.html → Select company → Click 3D tab

3. **Open DevTools (F12):**
   - Check console for Quannex engine loaded
   - Verify faces data available: `window.Quannex.getFaces()`
   - Check face structure: `console.log(window.Quannex.getFaces()[0])`

4. **Start with Phase 1, Task 1.1:**
   - Find where dodecahedron is rendered in code
   - Add face color mapping based on Quannex data
   - Test with different companies

5. **Iterate:**
   - Make small changes
   - Refresh browser (Ctrl+Shift+R for hard refresh)
   - Check console for errors
   - Verify visually

---

## 💡 Pro Tips

### Debugging Three.js:
- Use `console.log(scene.children)` to see all objects
- Use `mesh.userData` to store custom data on 3D objects
- Use Three.js Inspector browser extension for visual debugging

### Performance:
- Keep animation loop simple
- Avoid creating new objects in animation loop
- Reuse materials when possible
- Use `requestAnimationFrame` for smooth 60fps

### Git Workflow:
- Commit after each phase completes
- Use descriptive messages: "feat: add dynamic face colors to 3D view"
- Keep dodecahedron changes in separate commits from other features

---

**Ready to make this dodecahedron come alive! 🔷✨**

Start with Phase 1 → Dynamic face colors → Most visual impact!
