import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// API Configuration
const API_BASE = 'http://localhost:3001/api';

// Renderer setup
const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Scene + camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(3, 3, 3);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Enhanced lighting for better face visibility
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
const point1 = new THREE.PointLight(0xffffff, 0.8);
const point2 = new THREE.PointLight(0xffffff, 0.6);
point1.position.set(5, 5, 5);
point2.position.set(-5, -5, -5);
scene.add(ambient, point1, point2);

// Dodecahedron geometry
const geometry = new THREE.DodecahedronGeometry(1);

// Create face meshes for individual coloring
const faceMeshes = [];
const faceLabels = [];
const faceGeometry = geometry.clone();
const faces = faceGeometry.getAttribute('position');

// Create 12 face materials (one for each face)
for (let i = 0; i < 12; i++) {
  const faceMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x333333,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  });
  
  // Create geometry for individual face
  const singleFaceGeometry = new THREE.BufferGeometry();
  const faceVertices = [];
  const faceIndices = [];
  
  // Extract vertices for this face (each face has 5 vertices in a pentagon)
  const startIndex = i * 15; // 5 vertices * 3 coordinates per triangle * 1 triangle per face section
  for (let j = 0; j < 15; j++) {
    faceVertices.push(faces.array[startIndex + j]);
  }
  
  singleFaceGeometry.setAttribute('position', new THREE.Float32BufferAttribute(faceVertices, 3));
  singleFaceGeometry.computeVertexNormals();
  
  const faceMesh = new THREE.Mesh(singleFaceGeometry, faceMaterial);
  faceMesh.userData = { faceId: i + 1, faceName: `Face ${i + 1}` };
  faceMeshes.push(faceMesh);
  scene.add(faceMesh);
}

// Create wireframe for edges
const edges = new THREE.EdgesGeometry(geometry);
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x00ffcc, linewidth: 2 });
const wireframe = new THREE.LineSegments(edges, edgeMaterial);
scene.add(wireframe);

// Create vertex spheres
const vertexSpheres = [];
const vertexGeometry = new THREE.SphereGeometry(0.05, 8, 8);

// Get vertex positions from dodecahedron
const positions = geometry.getAttribute('position').array;
const uniqueVertices = [];
const vertexMap = new Map();

// Extract unique vertices
for (let i = 0; i < positions.length; i += 3) {
  const x = positions[i];
  const y = positions[i + 1];
  const z = positions[i + 2];
  const key = `${x.toFixed(6)},${y.toFixed(6)},${z.toFixed(6)}`;
  
  if (!vertexMap.has(key)) {
    vertexMap.set(key, { x, y, z });
    uniqueVertices.push({ x, y, z });
  }
}

// Create vertex spheres
uniqueVertices.forEach((vertex, index) => {
  const vertexMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const sphere = new THREE.Mesh(vertexGeometry, vertexMaterial);
  sphere.position.set(vertex.x, vertex.y, vertex.z);
  vertexSpheres.push(sphere);
  scene.add(sphere);
});

// System state
let systemState = null;
let isRotating = true;
let rotationSpeed = 0.003;

// API Functions
async function fetchSystemState() {
  try {
    const response = await fetch(`${API_BASE}/state`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch system state:', error);
    return null;
  }
}

async function updateKPI(kpiId, value) {
  try {
    const response = await fetch(`${API_BASE}/update_kpi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ kpiId, value })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to update KPI:', error);
    return null;
  }
}

// Visualization update functions
function updateVisualization(state) {
  if (!state) return;
  
  systemState = state;
  
  // Update faces based on face energy
  state.faces.forEach((face, index) => {
    if (index < faceMeshes.length) {
      const color = new THREE.Color(face.color);
      faceMeshes[index].material.color = color;
      
      // Adjust opacity based on energy level
      const opacity = 0.3 + (face.faceEnergy * 0.5);
      faceMeshes[index].material.opacity = opacity;
      
      // Update face name in userData
      faceMeshes[index].userData.faceName = face.name;
      faceMeshes[index].userData.faceEnergy = face.faceEnergy;
      faceMeshes[index].userData.healthStatus = face.healthStatus;
    }
  });
  
  // Update vertices based on vortex strength and type
  state.vertices.forEach((vertex, index) => {
    if (index < vertexSpheres.length) {
      const color = new THREE.Color(vertex.color);
      vertexSpheres[index].material.color = color;
      
      // Scale based on vortex strength
      const scale = 0.5 + (vertex.vortexStrength * 1.5);
      vertexSpheres[index].scale.setScalar(scale);
    }
  });
  
  // Update wireframe color based on overall system health
  const coherence = state.globalMetrics.coherence;
  let wireframeColor;
  if (coherence >= 0.8) {
    wireframeColor = 0x00ff00; // Green - excellent
  } else if (coherence >= 0.6) {
    wireframeColor = 0x00ffcc; // Cyan - good
  } else if (coherence >= 0.4) {
    wireframeColor = 0xffff00; // Yellow - warning
  } else {
    wireframeColor = 0xff0000; // Red - critical
  }
  wireframe.material.color.setHex(wireframeColor);
  
  // Update UI metrics
  updateUIMetrics(state);
}

function updateUIMetrics(state) {
  // Update coherence metrics
  const coherenceElement = document.getElementById('m-coherence');
  if (coherenceElement) {
    coherenceElement.textContent = `${(state.globalMetrics.coherence * 100).toFixed(1)}%`;
  }
  
  const statusElement = document.getElementById('m-status');
  if (statusElement) {
    statusElement.textContent = state.globalMetrics.coherenceStatus;
  }
  
  const patternElement = document.getElementById('m-pattern');
  if (patternElement) {
    patternElement.textContent = state.globalMetrics.pattern;
  }
  
  // Update action plan
  const actionElement = document.getElementById('m-action');
  if (actionElement && state.actionPlan) {
    actionElement.textContent = state.actionPlan.recommendation;
  }
  
  // Update spectral analysis metrics
  if (state.spectralAnalysis) {
    const dominantModeEl = document.getElementById('m-dominant-mode');
    if (dominantModeEl) {
      dominantModeEl.textContent = `Mode ${state.spectralAnalysis.dominantMode.mode} (λ=${state.spectralAnalysis.dominantMode.eigenvalue})`;
    }
    
    const modalAmplitudeEl = document.getElementById('m-modal-amplitude');
    if (modalAmplitudeEl) {
      modalAmplitudeEl.textContent = state.spectralAnalysis.dominantMode.amplitude.toFixed(3);
    }
    
    const babScoreEl = document.getElementById('m-bab-score');
    if (babScoreEl) {
      const bab = state.spectralAnalysis.diagnostics.beingActionBalance;
      babScoreEl.textContent = `${bab.percentage.toFixed(1)}%`;
      // Color code based on balance
      if (bab.percentage > 120) {
        babScoreEl.style.color = '#ffaa00'; // Orange - over-inhaling
      } else if (bab.percentage < 80) {
        babScoreEl.style.color = '#ff6b6b'; // Red - over-exhaling
      } else {
        babScoreEl.style.color = '#00ff88'; // Green - balanced
      }
    }
    
    const dissonanceEl = document.getElementById('m-dissonance');
    if (dissonanceEl) {
      const dissonance = state.spectralAnalysis.diagnostics.dissonanceIndex;
      dissonanceEl.textContent = `${dissonance.percentage.toFixed(1)}%`;
      // Color code based on dissonance level
      if (dissonance.percentage > 30) {
        dissonanceEl.style.color = '#ff0000'; // Red - high dissonance
      } else if (dissonance.percentage > 15) {
        dissonanceEl.style.color = '#ffaa00'; // Orange - moderate
      } else {
        dissonanceEl.style.color = '#00ff88'; // Green - low dissonance
      }
    }
    
    const systemicPatternEl = document.getElementById('m-systemic-pattern');
    if (systemicPatternEl) {
      systemicPatternEl.textContent = state.spectralAnalysis.summary.pattern;
    }
  }
  
  // Update shadow analysis metrics
  if (state.shadowAnalysis) {
    const integrityEl = document.getElementById('m-integrity');
    if (integrityEl) {
      const integrity = state.shadowAnalysis.systemIntegrity;
      integrityEl.textContent = `${(integrity.score * 100).toFixed(1)}%`;
      // Color code based on integrity level
      if (integrity.score < 0.6) {
        integrityEl.style.color = '#ff0000'; // Red - critical
      } else if (integrity.score < 0.8) {
        integrityEl.style.color = '#ffaa00'; // Orange - concerning
      } else {
        integrityEl.style.color = '#00ff88'; // Green - good
      }
    }
    
    const shadowCountEl = document.getElementById('m-shadow-count');
    if (shadowCountEl) {
      const count = state.shadowAnalysis.totalPatternsDetected;
      shadowCountEl.textContent = count > 0 ? `${count} detected` : 'None';
      shadowCountEl.style.color = count > 0 ? '#ffaa00' : '#00ff88';
    }
    
    const integrityStatusEl = document.getElementById('m-integrity-status');
    if (integrityStatusEl) {
      integrityStatusEl.textContent = state.shadowAnalysis.systemIntegrity.status;
    }
  }
  
  // Update breath analysis metrics
  if (state.breathAnalysis) {
    const breathHealthEl = document.getElementById('m-breath-health');
    if (breathHealthEl) {
      const health = state.breathAnalysis.overall.breathHealth;
      breathHealthEl.textContent = `${(health * 100).toFixed(1)}%`;
      // Color code based on breath health
      if (health < 0.4) {
        breathHealthEl.style.color = '#ff0000'; // Red - critical
      } else if (health < 0.6) {
        breathHealthEl.style.color = '#ffaa00'; // Orange - concerning
      } else if (health < 0.8) {
        breathHealthEl.style.color = '#ffdd00'; // Yellow - good
      } else {
        breathHealthEl.style.color = '#00ff88'; // Green - excellent
      }
    }
    
    const balancedAxesEl = document.getElementById('m-balanced-axes');
    if (balancedAxesEl) {
      const total = state.breathAnalysis.axes.length;
      const balanced = state.breathAnalysis.overall.balancedAxes;
      balancedAxesEl.textContent = `${balanced}/${total}`;
    }
    
    const breathTendencyEl = document.getElementById('m-breath-tendency');
    if (breathTendencyEl) {
      const tendency = state.breathAnalysis.overall.dominantTendency;
      let displayText = tendency;
      if (tendency === 'over-exhaling') {
        displayText = '⬆️ Over-exhaling';
        breathTendencyEl.style.color = '#ff6b6b';
      } else if (tendency === 'over-inhaling') {
        displayText = '⬇️ Over-inhaling';
        breathTendencyEl.style.color = '#4ecdc4';
      } else {
        displayText = '⚖️ Mixed/Balanced';
        breathTendencyEl.style.color = '#00ff88';
      }
      breathTendencyEl.textContent = displayText;
    }
  }
  
  // Update existing metrics
  const mVerts = document.getElementById("m-verts");
  const mEdges = document.getElementById("m-edges");
  const mFaces = document.getElementById("m-faces");
  
  if (mVerts) mVerts.textContent = state.vertices.length.toString();
  if (mEdges) mEdges.textContent = state.edges.length.toString();
  if (mFaces) mFaces.textContent = state.faces.length.toString();
}

// Animation functions
function animateToNewState(newState) {
  // Smooth transition to new colors and scales
  const duration = 1000; // 1 second transition
  const startTime = Date.now();
  
  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-in-out function
    const easeProgress = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      updateVisualization(newState);
    }
  }
  
  animate();
}

// Control functions
export function setRotationSpeed(speed) {
  rotationSpeed = speed;
}

export function toggleRotation() {
  isRotating = !isRotating;
  return isRotating;
}

export function refreshData() {
  loadSystemState();
}

// System initialization
async function loadSystemState() {
  console.log('🌟 Loading Quannex System State...');
  const state = await fetchSystemState();
  if (state) {
    console.log('✅ System state loaded successfully');
    console.log(`📊 Global Coherence: ${(state.globalMetrics.coherence * 100).toFixed(1)}%`);
    console.log(`🎯 System Pattern: ${state.globalMetrics.pattern}`);
    updateVisualization(state);
  } else {
    console.error('❌ Failed to load system state - running in offline mode');
    showOfflineMode();
  }
}

function showOfflineMode() {
  // Show a message that we're in offline mode
  const statusElement = document.getElementById('m-status');
  if (statusElement) {
    statusElement.textContent = 'Offline Mode';
    statusElement.style.color = '#ff6b6b';
  }
}

// KPI Update Interface
let selectedKPI = null;
let kpiUpdateMode = false;

function createKPIInterface() {
  if (!systemState) return;
  
  // Create KPI selection dropdown
  const kpiSelect = document.createElement('select');
  kpiSelect.id = 'kpi-select';
  kpiSelect.innerHTML = '<option value="">Select KPI to update...</option>';
  
  // Add all KPIs to dropdown
  systemState.faces.forEach(face => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = face.name;
    
    face.elementalKPIs.forEach(kpi => {
      const option = document.createElement('option');
      option.value = kpi.id;
      option.textContent = `${kpi.name} (${kpi.value.toFixed(1)})`;
      optgroup.appendChild(option);
    });
    
    kpiSelect.appendChild(optgroup);
  });
  
  // Create value input
  const valueInput = document.createElement('input');
  valueInput.type = 'number';
  valueInput.id = 'kpi-value';
  valueInput.placeholder = 'New value';
  valueInput.step = '0.1';
  
  // Create update button
  const updateBtn = document.createElement('button');
  updateBtn.textContent = 'Update KPI';
  updateBtn.onclick = handleKPIUpdate;
  
  // Add to UI
  const ui = document.getElementById('ui');
  const kpiSection = document.createElement('div');
  kpiSection.innerHTML = '<hr><div class="ui-row"><label>KPI Updates</label></div>';
  
  const selectRow = document.createElement('div');
  selectRow.className = 'ui-row';
  selectRow.appendChild(kpiSelect);
  
  const inputRow = document.createElement('div');
  inputRow.className = 'ui-row';
  inputRow.appendChild(valueInput);
  inputRow.appendChild(updateBtn);
  
  kpiSection.appendChild(selectRow);
  kpiSection.appendChild(inputRow);
  ui.appendChild(kpiSection);
}

async function handleKPIUpdate() {
  const kpiSelect = document.getElementById('kpi-select');
  const valueInput = document.getElementById('kpi-value');
  
  const kpiId = kpiSelect.value;
  const newValue = parseFloat(valueInput.value);
  
  if (!kpiId || isNaN(newValue)) {
    alert('Please select a KPI and enter a valid value');
    return;
  }
  
  console.log(`🔄 Updating KPI ${kpiId} to ${newValue}`);
  
  const newState = await updateKPI(kpiId, newValue);
  if (newState) {
    console.log('✅ KPI updated successfully');
    animateToNewState(newState);
    
    // Update the dropdown to show new value
    const option = kpiSelect.querySelector(`option[value="${kpiId}"]`);
    if (option) {
      const kpiName = option.textContent.split(' (')[0];
      option.textContent = `${kpiName} (${newValue.toFixed(1)})`;
    }
    
    // Clear input
    valueInput.value = '';
  } else {
    alert('Failed to update KPI. Please check the console for errors.');
  }
}

// UI bindings
const speedInput = document.getElementById("speed");
const toggleBtn = document.getElementById("toggle-ui");
const playPauseBtn = document.getElementById("play-pause");
const refreshBtn = document.getElementById("refresh-data");

// Basic controls
if (speedInput) {
  speedInput.addEventListener("input", (e) => {
    const value = parseFloat(e.target.value);
    if (!Number.isNaN(value)) {
      setRotationSpeed(value);
    }
  });
}

if (playPauseBtn) {
  playPauseBtn.addEventListener("click", () => {
    const rotating = toggleRotation();
    playPauseBtn.textContent = rotating ? "⏸ Pause" : "▶ Play";
  });
}

if (refreshBtn) {
  refreshBtn.addEventListener("click", () => {
    refreshData();
  });
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const ui = document.getElementById("ui");
    if (!ui) return;
    ui.classList.toggle("collapsed");
    toggleBtn.textContent = ui.classList.contains("collapsed") ? "Show" : "Hide";
  });
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  switch (e.key.toLowerCase()) {
    case " ": // Space to toggle rotation
      e.preventDefault();
      const rotating = toggleRotation();
      if (playPauseBtn) playPauseBtn.textContent = rotating ? "⏸ Pause" : "▶ Play";
      break;
    case "r": // R to refresh data
      e.preventDefault();
      refreshData();
      break;
    case "h": // H to hide/show UI
      if (toggleBtn) toggleBtn.click();
      break;
    case "+":
    case "=": // Increase speed
      rotationSpeed = Math.min(rotationSpeed + 0.001, 0.02);
      if (speedInput) speedInput.value = String(rotationSpeed);
      break;
    case "-":
    case "_": // Decrease speed
      rotationSpeed = Math.max(rotationSpeed - 0.001, 0);
      if (speedInput) speedInput.value = String(rotationSpeed);
      break;
  }
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate the entire dodecahedron
  if (isRotating) {
    const rotationGroup = new THREE.Group();
    faceMeshes.forEach(mesh => {
      mesh.rotation.y += rotationSpeed;
    });
    wireframe.rotation.y += rotationSpeed;
    vertexSpheres.forEach(sphere => {
      sphere.rotation.y += rotationSpeed;
    });
  }
  
  controls.update();
  renderer.render(scene, camera);
}

// Initialize the system
async function initialize() {
  console.log('🌟 Initializing Quannex Living Geometric Oracle...');
  
  // Start animation loop
animate();

  // Load system state
  await loadSystemState();
  
  // Create KPI interface after state is loaded
  if (systemState) {
    createKPIInterface();
  }
  
  // Set up periodic refresh (every 30 seconds)
  setInterval(() => {
    if (systemState) {
      loadSystemState();
    }
  }, 30000);
  
  console.log('✨ Quannex Oracle is now alive and ready!');
}

// Mouse interaction for face information
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredFace = null;

// Create tooltip element
const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
tooltip.style.color = '#00ffcc';
tooltip.style.padding = '8px 12px';
tooltip.style.borderRadius = '4px';
tooltip.style.fontSize = '12px';
tooltip.style.pointerEvents = 'none';
tooltip.style.zIndex = '1000';
tooltip.style.display = 'none';
tooltip.style.border = '1px solid rgba(0, 255, 204, 0.3)';
document.body.appendChild(tooltip);

function onMouseMove(event) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // Update raycaster
  raycaster.setFromCamera(mouse, camera);
  
  // Check for intersections with face meshes
  const intersects = raycaster.intersectObjects(faceMeshes);
  
  if (intersects.length > 0) {
    const intersectedFace = intersects[0].object;
    
    if (hoveredFace !== intersectedFace) {
      hoveredFace = intersectedFace;
      
      // Show tooltip with face information
      const faceData = intersectedFace.userData;
      tooltip.innerHTML = `
        <strong>${faceData.faceName}</strong><br>
        Energy: ${(faceData.faceEnergy * 100).toFixed(1)}%<br>
        Status: ${faceData.healthStatus}
      `;
      tooltip.style.display = 'block';
    }
    
    // Update tooltip position
    tooltip.style.left = event.clientX + 10 + 'px';
    tooltip.style.top = event.clientY - 10 + 'px';
    
    // Change cursor
    canvas.style.cursor = 'pointer';
  } else {
    // Hide tooltip
    if (hoveredFace) {
      hoveredFace = null;
      tooltip.style.display = 'none';
      canvas.style.cursor = 'default';
    }
  }
}

// Add mouse event listeners
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mouseleave', () => {
  if (hoveredFace) {
    hoveredFace = null;
    tooltip.style.display = 'none';
    canvas.style.cursor = 'default';
  }
});

// Resize handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the system
initialize();
