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

// Orbit Controls - Optimized for natural soccer ball-like rotation
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05; // Reduced for more responsive feel
controls.rotateSpeed = 1.2; // Increased for easier rotation
controls.minDistance = 2;
controls.maxDistance = 15;
controls.enablePan = false;
controls.autoRotateSpeed = 1.0; // Smooth auto-rotation speed
controls.zoomSpeed = 1.2; // Comfortable zoom speed

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
let autoRotate = false; // Start with manual control
let isUserInteracting = false;
let interactionTimeout = null;

// Load Quannex engine (expects it to be globally available from main.js)
const loadQuannexEngine = async () => {
    try {
        // Wait for Quannex (capital Q - the correct API) or quannexEngine (legacy)
        let attempts = 0;
        while ((!window.Quannex && !window.quannexEngine) && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        // Use Quannex if available (new API), fallback to quannexEngine (legacy)
        const engine = window.Quannex || window.quannexEngine;

        if (!engine) {
            throw new Error('Quannex engine not available after timeout');
        }

        // Store reference to whichever engine is available
        window.quannexEngine = engine;

        // If CompanyLoader available, load default company
        if (window.CompanyLoader) {
            await window.CompanyLoader.loadCompany('quannex');
        }

        companyData = engine.getState();
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

        console.log(`🔄 Switching to company: ${companyId}`);

        await window.CompanyLoader.switchCompany(companyId);

        // Get fresh state from whichever engine is available
        const engine = window.Quannex || window.quannexEngine;
        if (engine) {
            companyData = engine.getState();
        }

        updateVisualization();
        updateStats();

        console.log(`✅ Switched to ${companyId} - ${companyData?.faces?.length || 0} faces loaded`);
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

    const radius = 2;

    // Use a single dodecahedron but assign material index per face
    const baseGeometry = new THREE.DodecahedronGeometry(radius);
    const position = baseGeometry.attributes.position;
    const index = baseGeometry.index;

    // Create 12 materials (one per face)
    const materials = [];
    for (let i = 0; i < 12; i++) {
        materials.push(new THREE.MeshPhongMaterial({
            color: 0x00ffcc,
            emissive: 0x002222,
            emissiveIntensity: 0.3,
            shininess: 40,
            transparent: false,
            opacity: 1.0,
            side: THREE.DoubleSide
        }));
    }

    // Assign material groups (each pentagonal face = 3 triangles)
    baseGeometry.clearGroups();
    for (let i = 0; i < 12; i++) {
        const start = i * 9; // 3 triangles × 3 vertices
        const count = 9;
        baseGeometry.addGroup(start, count, i);
    }

    // Create the main mesh with multiple materials
    const dodecahedron = new THREE.Mesh(baseGeometry, materials);
    scene.add(dodecahedron);

    // Store reference for raycasting - we'll detect which material was hit
    // Create invisible face meshes for click detection
    for (let faceIndex = 0; faceIndex < 12; faceIndex++) {
        // Extract vertices for this face (3 triangles = 9 vertices)
        const start = faceIndex * 9;
        const faceVertices = [];

        // Check if geometry has index buffer
        if (index) {
            // Indexed geometry - use indices to access vertices
            for (let i = 0; i < 9; i++) {
                const idx = index.getX(start + i);
                faceVertices.push(
                    position.getX(idx),
                    position.getY(idx),
                    position.getZ(idx)
                );
            }
        } else {
            // Non-indexed geometry - access vertices directly
            for (let i = 0; i < 9; i++) {
                const vertexIndex = start + i;
                faceVertices.push(
                    position.getX(vertexIndex),
                    position.getY(vertexIndex),
                    position.getZ(vertexIndex)
                );
            }
        }

        // Create a geometry for this face
        const faceGeometry = new THREE.BufferGeometry();
        faceGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(faceVertices), 3));
        faceGeometry.setIndex([0,1,2, 3,4,5, 6,7,8]); // Three triangles
        faceGeometry.computeVertexNormals();

        // Create an invisible mesh just for raycasting
        const invisibleMaterial = new THREE.MeshBasicMaterial({
            visible: false,
            side: THREE.DoubleSide
        });

        const clickMesh = new THREE.Mesh(faceGeometry, invisibleMaterial);

        // Scale up significantly to ensure no gaps, especially when zoomed in
        clickMesh.scale.set(1.35, 1.35, 1.35);

        clickMesh.userData.faceId = faceIndex + 1;
        clickMesh.userData.faceIndex = faceIndex;
        clickMesh.userData.materialIndex = faceIndex;
        clickMesh.userData.material = materials[faceIndex];

        scene.add(clickMesh);
        faceMeshes.push(clickMesh);
    }

    // Store the main dodecahedron for updates
    window.mainDodecahedron = dodecahedron;
    window.dodecahedronMaterials = materials;

    // Create edges
    const edgesGeometry = new THREE.EdgesGeometry(baseGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffcc,
        linewidth: 2,
        transparent: true,
        opacity: 0.4
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    scene.add(edges);
    edgeLines.push(edges);

    console.log(`✅ Created dodecahedron with ${materials.length} materials and ${faceMeshes.length} clickable faces`);
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

    // Get the materials array
    const materials = window.dodecahedronMaterials;
    if (!materials) {
        console.warn('⚠️ Materials not available yet');
        return;
    }

    // Update each material's color based on face energy
    companyData.faces.forEach((face, index) => {
        if (index < materials.length) {
            const energy = face.faceEnergy || 0;
            const color = getEnergyColor(energy);

            // Update material properties
            materials[index].color = color;

            // Add emissive glow - stronger for critical faces
            let emissiveIntensity;
            if (energy < 0.1) {
                emissiveIntensity = 0.6; // Very low energy = strong glow (visible warning)
            } else if (energy < 0.4) {
                emissiveIntensity = 0.5; // Critical = strong glow
            } else {
                emissiveIntensity = 0.3; // Healthy = moderate glow
            }

            materials[index].emissive = color.clone().multiplyScalar(0.3);
            materials[index].emissiveIntensity = emissiveIntensity;

            // Store face data in the clickable mesh
            if (faceMeshes[index]) {
                faceMeshes[index].userData.faceData = face;
            }
        }
    });

    // Force material updates
    materials.forEach(mat => mat.needsUpdate = true);

    console.log('✅ Visualization updated with', companyData.faces.length, 'face colors');
};

// ========================================
// INTERACTION
// ========================================

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedFace = null;
let hoveredFace = null;
let isCameraAnimating = false;

// ========================================
// CAMERA ANIMATION
// ========================================

/**
 * Smooth camera animation to target position
 * Uses easeInOutCubic for natural motion
 */
const animateCameraTo = (targetPosition, lookAtTarget, duration = 1200) => {
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const startTime = Date.now();

    isCameraAnimating = true;

    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth easing (ease-in-out cubic)
        const eased = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        // Interpolate camera position and target
        camera.position.lerpVectors(startPosition, targetPosition, eased);
        controls.target.lerpVectors(startTarget, lookAtTarget, eased);
        controls.update();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isCameraAnimating = false;
        }
    };

    animate();
};

/**
 * Calculate optimal camera position for viewing a face
 * Zooms camera closer while maintaining rotation center at origin
 */
const getCameraPositionForFace = (faceIndex) => {
    // Get face position from the clickable mesh
    const clickMesh = faceMeshes[faceIndex];
    if (!clickMesh) return null;

    // Calculate face center from geometry
    const geometry = clickMesh.geometry;
    const position = geometry.attributes.position;

    // Get average position of all vertices (face center)
    let centerX = 0, centerY = 0, centerZ = 0;
    const vertexCount = position.count;

    for (let i = 0; i < vertexCount; i++) {
        centerX += position.getX(i);
        centerY += position.getY(i);
        centerZ += position.getZ(i);
    }

    centerX /= vertexCount;
    centerY /= vertexCount;
    centerZ /= vertexCount;

    const faceCenter = new THREE.Vector3(centerX, centerY, centerZ);

    // Calculate direction from origin to face
    const direction = faceCenter.clone().normalize();

    // Position camera closer along this direction, but not too close
    const cameraDistance = 4.5; // Closer for better view
    const cameraPos = direction.clone().multiplyScalar(cameraDistance);

    // Keep rotation center at origin for consistent rotation feel
    return {
        position: cameraPos,
        lookAt: new THREE.Vector3(0, 0, 0) // Always rotate around center
    };
};

/**
 * Reset camera to default view
 */
const resetCameraView = () => {
    const defaultPosition = new THREE.Vector3(4, 4, 4);
    const defaultTarget = new THREE.Vector3(0, 0, 0);
    animateCameraTo(defaultPosition, defaultTarget, 1000);
};

// Handle mouse move (hover effect)
const onMouseMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(faceMeshes);

    const tooltip = document.getElementById('faceTooltip');
    const tooltipFaceName = document.getElementById('tooltipFaceName');
    const tooltipEnergyValue = document.getElementById('tooltipEnergyValue');

    // Reset previous hover - brighten the material slightly
    if (hoveredFace && hoveredFace !== selectedFace) {
        const material = hoveredFace.userData.material;
        if (material) {
            // Reset to normal brightness
            material.emissiveIntensity = material.userData.baseIntensity || 0.3;
        }
    }

    // Apply hover effect
    if (intersects.length > 0) {
        const hoveredMesh = intersects[0].object;
        hoveredFace = hoveredMesh;

        const material = hoveredMesh.userData.material;
        if (material) {
            // Store base intensity if not already stored
            if (!material.userData.baseIntensity) {
                material.userData.baseIntensity = material.emissiveIntensity;
            }
            // Brighten on hover
            material.emissiveIntensity = Math.min(material.userData.baseIntensity * 1.5, 1.0);
        }

        // Show tooltip with face data
        const faceData = hoveredMesh.userData.faceData;
        if (faceData && tooltip && tooltipFaceName && tooltipEnergyValue) {
            tooltipFaceName.textContent = faceData.name || `Face ${hoveredMesh.userData.faceId}`;

            const energy = faceData.faceEnergy || 0;
            const energyPercent = Math.round(energy * 100);
            tooltipEnergyValue.textContent = `${energyPercent}%`;

            // Set energy value color class
            tooltipEnergyValue.className = 'tooltip-energy-value';
            if (energy >= 0.7) {
                tooltipEnergyValue.classList.add('healthy');
            } else if (energy >= 0.4) {
                tooltipEnergyValue.classList.add('warning');
            } else {
                tooltipEnergyValue.classList.add('critical');
            }

            // Position tooltip near mouse
            const tooltipOffset = 20;
            tooltip.style.left = (event.clientX + tooltipOffset) + 'px';
            tooltip.style.top = (event.clientY + tooltipOffset) + 'px';

            // Show tooltip
            tooltip.classList.add('visible');
        }

        canvas.style.cursor = 'pointer';
    } else {
        hoveredFace = null;
        canvas.style.cursor = 'default';

        // Hide tooltip
        if (tooltip) {
            tooltip.classList.remove('visible');
        }
    }
};

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
        const faceIndex = clickedMesh.userData.faceIndex;

        if (selectedFace) {
            // Animate camera to focus on this face
            const cameraTarget = getCameraPositionForFace(faceIndex);
            if (cameraTarget) {
                // Temporarily disable auto-rotation during camera animation
                const wasAutoRotating = autoRotate;
                autoRotate = false;

                animateCameraTo(cameraTarget.position, cameraTarget.lookAt, 1200);

                // Re-enable auto-rotation after animation completes (if it was on)
                setTimeout(() => {
                    autoRotate = wasAutoRotating;
                }, 1200);
            }

            // Show face detail panel
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

    // Also hide tooltip when closing panel
    const tooltip = document.getElementById('faceTooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
    }

    // Smoothly return to default view for better UX
    // Check if camera is close (zoomed in from clicking a face)
    const currentDistance = camera.position.length();
    if (currentDistance < 5) {
        resetCameraView();
    }
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
    const coherencePercent = Math.round(coherence * 100);

    // Calculate status with color
    let status, statusColor;
    if (coherence >= 0.7) {
        status = 'Healthy ✅';
        statusColor = '#00ff88';
    } else if (coherence >= 0.5) {
        status = 'Moderate ⚠️';
        statusColor = '#ffcc00';
    } else if (coherence >= 0.3) {
        status = 'Concerning 🔴';
        statusColor = '#ff6666';
    } else {
        status = 'Critical 🚨';
        statusColor = '#ff0000';
    }

    document.getElementById('statCoherence').textContent = `${coherencePercent}%`;
    const statusEl = document.getElementById('statStatus');
    statusEl.textContent = status;
    statusEl.style.color = statusColor;

    // Count faces by health
    if (companyData.faces) {
        const healthy = companyData.faces.filter(f => (f.faceEnergy || 0) >= 0.7).length;
        const moderate = companyData.faces.filter(f => {
            const energy = f.faceEnergy || 0;
            return energy >= 0.4 && energy < 0.7;
        }).length;
        const critical = companyData.faces.filter(f => (f.faceEnergy || 0) < 0.4).length;

        // Update face count stats (if elements exist)
        const statFacesEl = document.getElementById('statFaces');
        if (statFacesEl) {
            statFacesEl.textContent = `12 (🟢${healthy} 🟡${moderate} 🔴${critical})`;
        }
    }
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

// Mouse handlers
canvas.addEventListener('click', onMouseClick);
canvas.addEventListener('mousemove', onMouseMove);

// Pause auto-rotation during user interaction
canvas.addEventListener('mousedown', () => {
    isUserInteracting = true;
    if (interactionTimeout) clearTimeout(interactionTimeout);
});

canvas.addEventListener('mouseup', () => {
    isUserInteracting = false;
    // Resume after 2 seconds of no interaction
    if (interactionTimeout) clearTimeout(interactionTimeout);
    interactionTimeout = setTimeout(() => {
        isUserInteracting = false;
    }, 2000);
});

canvas.addEventListener('wheel', () => {
    isUserInteracting = true;
    if (interactionTimeout) clearTimeout(interactionTimeout);
    interactionTimeout = setTimeout(() => {
        isUserInteracting = false;
    }, 2000);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeFaceDetail();
    }

    // 'R' key - Reset camera view
    if (e.key === 'r' || e.key === 'R') {
        resetCameraView();
    }

    // 'Space' - Toggle auto-rotation
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault(); // Prevent page scroll
        autoRotate = !autoRotate;
        const toggleBtn = document.getElementById('toggleRotation');
        if (toggleBtn) {
            toggleBtn.textContent = `Auto-Rotate: ${autoRotate ? 'ON' : 'OFF'}`;
            toggleBtn.classList.toggle('active', autoRotate);
        }
    }
});

// ========================================
// ANIMATION LOOP
// ========================================

const animate = () => {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001; // Time in seconds

    // Auto-rotate the main dodecahedron and edges (only when not interacting)
    if (autoRotate && !isUserInteracting) {
        if (window.mainDodecahedron) {
            window.mainDodecahedron.rotation.y += 0.003;
        }
        edgeLines.forEach(line => {
            line.rotation.y += 0.003;
        });
    }

    // Pulse critical faces for attention
    const materials = window.dodecahedronMaterials;
    if (materials && faceMeshes) {
        faceMeshes.forEach((mesh, index) => {
            const faceData = mesh.userData.faceData;
            if (faceData && materials[index]) {
                const energy = faceData.faceEnergy || 0;

                // Pulse critical faces (below 40%)
                if (energy < 0.4) {
                    const pulse = Math.sin(time * 2) * 0.2 + 0.8; // Oscillates 0.6-1.0
                    materials[index].emissiveIntensity = 0.5 * pulse;
                }
                // Very slow pulse for very low energy (below 10%)
                else if (energy < 0.1) {
                    const slowPulse = Math.sin(time * 1) * 0.3 + 0.7; // Slow oscillation
                    materials[index].emissiveIntensity = 0.6 * slowPulse;
                }
            }
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

// Export for debugging and external access
window.dodecahedronViz = {
    scene,
    camera,
    faceMeshes,
    companyData,
    switchCompany,
    updateVisualization
};

// Export refreshVisualization globally (used by parent window communication)
window.refreshVisualization = () => {
    updateVisualization();
    updateStats();
    console.log('✅ Visualization refreshed');
};

} // End of initDodecahedron() function
