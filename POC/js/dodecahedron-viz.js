/**
 * 🔷 Dodecahedron 3D Visualization Engine
 *
 * Interactive 3D visualization that maps organizational data onto dodecahedral geometry.
 * Features:
 * - 12 faces colored by face energy (organizational domains)
 * - 30 edges colored by relationship tension
 * - Clickable faces with detailed KPI panels
 * - Real-time company data integration
 * - Pentagram analysis integration
 *
 * Note: Requires THREE.js and OrbitControls to be loaded as global scripts
 */

// Wait for DOM and THREE.js to be ready
document.addEventListener('DOMContentLoaded', () => {
    initDodecahedron();
});

function initDodecahedron() {
    // Check if THREE is available
    if (typeof THREE === 'undefined') {
        console.error('❌ THREE.js not loaded');
        document.getElementById('loading').innerHTML = '<div class="loading-text">⚠️ THREE.js failed to load</div>';
        return;
    }

// ========================================
// INITIALIZATION
// ========================================

// Check if running in iframe
const isInIframe = window.self !== window.top;
if (isInIframe) {
    const header = document.getElementById('pageHeader');
    if (header) header.classList.add('hidden');
}

// Scene, Camera, Renderer
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Pure black to match DNA helix
scene.fog = new THREE.Fog(0x000000, 15, 50); // Atmospheric depth

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 4, 4);

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 2;
controls.maxDistance = 15;
controls.enablePan = false;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xffffff, 0.8);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00ffcc, 0.3);
pointLight2.position.set(-5, -5, -5);
scene.add(pointLight2);

// ========================================
// DATA MANAGEMENT
// ========================================

let currentCompany = 'quannex';
let companyData = null;
let faceMeshes = [];
let edgeLines = [];
let autoRotate = true;

// Load Quannex engine (expects it to be globally available from main.js)
const loadQuannexEngine = async () => {
    try {
        // Wait for quannexEngine and CompanyLoader to be available
        let attempts = 0;
        while ((!window.quannexEngine || !window.CompanyLoader) && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        if (!window.quannexEngine) {
            throw new Error('Quannex engine not available after timeout');
        }

        if (!window.CompanyLoader) {
            throw new Error('Company loader not available after timeout');
        }

        // Load default company (Quannex)
        await window.CompanyLoader.loadCompany('quannex');

        companyData = window.quannexEngine.getState();
        console.log('✅ Quannex Engine loaded:', companyData);
        return true;
    } catch (error) {
        console.error('❌ Error loading Quannex engine:', error);
        return false;
    }
};

// Switch company
const switchCompany = async (companyId) => {
    try {
        if (!window.CompanyLoader) {
            throw new Error('Company loader not available');
        }

        await window.CompanyLoader.switchCompany(companyId);
        companyData = window.quannexEngine.getState();
        currentCompany = companyId;

        updateVisualization();
        updateStats();

        console.log(`✅ Switched to ${companyId}`);
    } catch (error) {
        console.error(`❌ Error switching to ${companyId}:`, error);
    }
};

// ========================================
// GEOMETRY CREATION
// ========================================

// Create dodecahedron with 12 separate face meshes
const createDodecahedron = () => {
    // Clear existing geometry
    faceMeshes.forEach(mesh => scene.remove(mesh));
    edgeLines.forEach(line => scene.remove(line));
    faceMeshes = [];
    edgeLines = [];

    // Create base dodecahedron to extract face geometry
    const baseGeometry = new THREE.DodecahedronGeometry(2);
    const positions = baseGeometry.attributes.position.array;
    const indices = baseGeometry.index ? baseGeometry.index.array : null;

    // Dodecahedron has 12 pentagonal faces
    // Each face has 5 vertices (triangulated as 3 triangles in Three.js)
    const facesCount = 12;
    const trianglesPerFace = 3; // Each pentagon is triangulated into 3 triangles
    const triangleCount = indices ? indices.length / 3 : positions.length / 9;

    // Group triangles into faces
    const faceGroups = [];

    // Map of face centers to group triangles
    const faceMap = new Map();

    for (let i = 0; i < triangleCount; i++) {
        const i0 = indices ? indices[i * 3] : i * 3;
        const i1 = indices ? indices[i * 3 + 1] : i * 3 + 1;
        const i2 = indices ? indices[i * 3 + 2] : i * 3 + 2;

        const v0 = new THREE.Vector3(positions[i0 * 3], positions[i0 * 3 + 1], positions[i0 * 3 + 2]);
        const v1 = new THREE.Vector3(positions[i1 * 3], positions[i1 * 3 + 1], positions[i1 * 3 + 2]);
        const v2 = new THREE.Vector3(positions[i2 * 3], positions[i2 * 3 + 1], positions[i2 * 3 + 2]);

        // Calculate triangle center
        const center = new THREE.Vector3()
            .add(v0)
            .add(v1)
            .add(v2)
            .divideScalar(3);

        // Find or create face group based on proximity to center
        const centerKey = `${center.x.toFixed(1)}_${center.y.toFixed(1)}_${center.z.toFixed(1)}`;

        if (!faceMap.has(centerKey)) {
            faceMap.set(centerKey, []);
        }
        faceMap.get(centerKey).push({ v0, v1, v2, center });
    }

    // Create mesh for each face
    let faceIndex = 0;
    faceMap.forEach((triangles, key) => {
        if (faceIndex >= facesCount) return;

        const faceGeometry = new THREE.BufferGeometry();
        const vertices = [];

        triangles.forEach(tri => {
            vertices.push(tri.v0.x, tri.v0.y, tri.v0.z);
            vertices.push(tri.v1.x, tri.v1.y, tri.v1.z);
            vertices.push(tri.v2.x, tri.v2.y, tri.v2.z);
        });

        faceGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        faceGeometry.computeVertexNormals();

        // Create material with default color (fully opaque for visibility)
        const faceMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffcc,
            emissive: 0x002222,
            emissiveIntensity: 0.3,
            shininess: 40,
            transparent: false, // Changed to fully opaque
            opacity: 1.0,
            side: THREE.DoubleSide
        });

        const faceMesh = new THREE.Mesh(faceGeometry, faceMaterial);
        faceMesh.userData.faceId = faceIndex + 1; // Face IDs are 1-12
        faceMesh.userData.faceIndex = faceIndex;

        scene.add(faceMesh);
        faceMeshes.push(faceMesh);

        faceIndex++;
    });

    // Create edges with enhanced visibility
    const edgesGeometry = new THREE.EdgesGeometry(baseGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffcc,
        linewidth: 2,
        transparent: true,
        opacity: 0.4 // Subtle edges that enhance depth with fog
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    scene.add(edges);
    edgeLines.push(edges);

    console.log(`✅ Created dodecahedron with ${faceMeshes.length} faces`);
};

// ========================================
// COLOR MAPPING
// ========================================

// Get color based on energy level (0-1)
const getEnergyColor = (energy) => {
    // Ensure minimum energy for visibility (even 0% faces are visible)
    const minEnergy = 0.05; // Minimum 5% brightness
    const adjustedEnergy = Math.max(energy, minEnergy);

    if (energy >= 0.7) {
        // Healthy: Green gradient
        return new THREE.Color().lerpColors(
            new THREE.Color(0x00ff88),
            new THREE.Color(0x00ffcc),
            (energy - 0.7) / 0.3
        );
    } else if (energy >= 0.4) {
        // Warning: Yellow/Orange gradient
        return new THREE.Color().lerpColors(
            new THREE.Color(0xff6600),
            new THREE.Color(0xffcc00),
            (energy - 0.4) / 0.3
        );
    } else {
        // Critical: Bright red gradient with minimum brightness
        // Map 0-40% to a visible red range (never completely black)
        const minRed = 0x882222; // Minimum visible red (darker but still visible)
        const maxRed = 0xff6666; // Bright red

        return new THREE.Color().lerpColors(
            new THREE.Color(minRed),
            new THREE.Color(maxRed),
            adjustedEnergy / 0.4
        );
    }
};

// Update visualization with current company data
const updateVisualization = () => {
    if (!companyData || !companyData.faces) {
        console.warn('⚠️ No company data available');
        return;
    }

    // Update each face color based on energy
    faceMeshes.forEach((mesh, index) => {
        if (index < companyData.faces.length) {
            const face = companyData.faces[index];
            const energy = face.faceEnergy || 0;
            const color = getEnergyColor(energy);

            mesh.material.color = color;

            // Add emissive glow - stronger for critical faces, minimum for ALL faces
            let emissiveIntensity;
            if (energy < 0.1) {
                emissiveIntensity = 0.6; // Very low energy = strong glow (visible warning)
            } else if (energy < 0.4) {
                emissiveIntensity = 0.5; // Critical = strong glow
            } else {
                emissiveIntensity = 0.3; // Healthy = moderate glow
            }

            mesh.material.emissive = color.clone().multiplyScalar(emissiveIntensity);
            mesh.material.emissiveIntensity = emissiveIntensity;

            // Store face data for click handler
            mesh.userData.faceData = face;
        }
    });

    console.log('✅ Visualization updated');
};

// ========================================
// INTERACTION
// ========================================

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedFace = null;

// Handle mouse click
const onMouseClick = (event) => {
    // Calculate mouse position in normalized device coordinates
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast to find intersections
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(faceMeshes);

    if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        selectedFace = clickedMesh.userData.faceData;

        if (selectedFace) {
            showFaceDetail(selectedFace);
        }
    }
};

// Map elemental names to descriptive names for better UX
const getDescriptiveElementName = (element) => {
    const elementMap = {
        'earth': 'Stability',
        'water': 'Flow',
        'fire': 'Energy',
        'air': 'Communication',
        'ether': 'Vision'
    };
    return elementMap[element.toLowerCase()] || element;
};

// Show face detail panel
const showFaceDetail = (face) => {
    const panel = document.getElementById('faceDetailPanel');
    const title = document.getElementById('faceDetailTitle');
    const energyDisplay = document.getElementById('faceEnergyDisplay');
    const kpiGrid = document.getElementById('kpiGrid');

    title.textContent = face.name || `Face ${face.id}`;
    energyDisplay.textContent = `${Math.round((face.faceEnergy || 0) * 100)}%`;

    // Build KPI grid
    kpiGrid.innerHTML = '';

    if (face.elementalKPIs && face.elementalKPIs.length > 0) {
        face.elementalKPIs.forEach(kpi => {
            const kpiItem = document.createElement('div');
            kpiItem.className = 'kpi-item';

            const normalizedScore = kpi.normalizedScore || 0;
            const healthClass = normalizedScore >= 0.7 ? 'healthy' : normalizedScore >= 0.4 ? 'warning' : 'critical';
            const element = kpi.element ? kpi.element.toLowerCase() : 'earth';
            const descriptiveName = getDescriptiveElementName(element);

            kpiItem.innerHTML = `
                <div class="kpi-item-header">
                    <span class="kpi-name">${kpi.name || 'Unknown KPI'}</span>
                    <span class="kpi-element ${element}">${descriptiveName}</span>
                </div>
                <div class="kpi-value-bar">
                    <div class="kpi-value-fill ${healthClass}" style="width: ${normalizedScore * 100}%"></div>
                </div>
            `;

            kpiGrid.appendChild(kpiItem);
        });
    } else {
        kpiGrid.innerHTML = '<div style="text-align: center; opacity: 0.5; padding: 20px;">No KPI data available</div>';
    }

    // Show panel
    panel.classList.add('visible');
};

// Close face detail panel
const closeFaceDetail = () => {
    const panel = document.getElementById('faceDetailPanel');
    panel.classList.remove('visible');
    selectedFace = null;
};

// ========================================
// UI CONTROLS
// ========================================

const updateStats = () => {
    if (!companyData) {
        console.warn('⚠️ No company data for stats');
        return;
    }

    const coherence = companyData.globalCoherence || 0;
    const status = companyData.coherenceStatus || 'Unknown';

    document.getElementById('statCoherence').textContent = `${Math.round(coherence * 100)}%`;
    document.getElementById('statStatus').textContent = status;
};

// Toggle rotation
document.getElementById('toggleRotation').addEventListener('click', (e) => {
    autoRotate = !autoRotate;
    e.target.textContent = `Auto-Rotate: ${autoRotate ? 'ON' : 'OFF'}`;
    e.target.classList.toggle('active', autoRotate);
});

// Company selectors
document.getElementById('companyQuannex').addEventListener('click', () => switchCompany('quannex'));
document.getElementById('companyNova').addEventListener('click', () => switchCompany('nova-tech'));
document.getElementById('companyZenith').addEventListener('click', () => switchCompany('zenith-solutions'));
document.getElementById('companyApex').addEventListener('click', () => switchCompany('apex-industries'));

// Close face detail
document.getElementById('closeFaceDetail').addEventListener('click', closeFaceDetail);

// Show pentagram (placeholder)
document.getElementById('showPentagram').addEventListener('click', () => {
    alert('🔮 Pentagram analysis coming soon! This will show the sacred geometry breakdown of the selected face.');
});

// Mouse click handler
canvas.addEventListener('click', onMouseClick);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeFaceDetail();
    }
});

// ========================================
// ANIMATION LOOP
// ========================================

const animate = () => {
    requestAnimationFrame(animate);

    // Auto-rotate
    if (autoRotate) {
        faceMeshes.forEach(mesh => {
            mesh.rotation.y += 0.003;
        });
        edgeLines.forEach(line => {
            line.rotation.y += 0.003;
        });
    }

    controls.update();
    renderer.render(scene, camera);
};

// ========================================
// WINDOW RESIZE
// ========================================

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ========================================
// INITIALIZATION
// ========================================

const init = async () => {
    console.log('🔷 Initializing 3D Dodecahedron Visualization...');

    // Load company data
    const loaded = await loadQuannexEngine();

    if (loaded) {
        // Create geometry
        createDodecahedron();

        // Update visualization
        updateVisualization();
        updateStats();

        // Hide loading
        document.getElementById('loading').style.display = 'none';

        // Start animation
        animate();

        console.log('✅ 3D Dodecahedron initialized successfully!');
    } else {
        document.getElementById('loading').innerHTML = '<div class="loading-text">⚠️ Error loading data</div>';
    }
};

// Start initialization
init();

// Export for debugging
window.dodecahedronViz = {
    scene,
    camera,
    faceMeshes,
    companyData,
    switchCompany,
    updateVisualization
};

} // End of initDodecahedron() function
