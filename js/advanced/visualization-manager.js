/**
 * VisualizationManager
 * 
 * Manages the advanced 3D visualization components for the Dodecahedron:
 * - Neon Edge Tubes (Tension)
 * - Vertex Spheres (Vortices)
 * - Feedback Loops
 * - Interaction (Raycasting, Tooltips)
 */
export class VisualizationManager {
    constructor(scene, camera, domElement) {
        this.scene = scene;
        this.camera = camera;
        this.domElement = domElement;

        // State
        this.edgeLines = [];
        this.vertexSpheres = [];
        this.feedbackLoopLines = [];
        this.edgeAnimationRunning = false;
        this.advancedAnalysisResults = null;

        // Tooltips
        this.edgeTooltip = document.getElementById('edgeTooltip');
        this.vertexTooltip = document.getElementById('vertexTooltip');

        // Raycaster
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Bind methods
        this.animateEdges = this.animateEdges.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);

        // Setup interaction
        this.setupInteraction();
    }

    /**
     * Run advanced analysis and render results
     */
    async runAdvancedAnalysis(companyData, faceEnergies) {
        // Dependencies must be loaded globally or passed in. 
        // Assuming they are available in window scope as per current architecture, 
        // or we could import them if this was a module-based app.
        // For now, we'll assume global access to Analyzers as per existing pattern.

        if (typeof SpectralAnalyzer === 'undefined') {
            console.warn('⚠️ Analyzers not loaded');
            return;
        }

        const spectral = new SpectralAnalyzer();
        const edges = new EdgeAnalyzer();
        const vertices = new VertexAnalyzer();
        const shadows = new ShadowDetector();
        const aiInterpreter = new AIEdgeInterpreter();

        // Load CSV data
        console.log('📊 Loading edge tension CSV data...');
        await edges.loadEdgeCSV('./data/CSV_Edge_tension_Map.csv');

        console.log('📊 Loading vertex vortex CSV data...');
        await vertices.loadVertexCSV('./data/CSV_Vortex_Map.csv');

        // Spectral Analysis
        const spectralAnalysis = spectral.analyze(faceEnergies);

        // Backend State (Single Source of Truth)
        const backendState = window.Quannex ? window.Quannex.getState() : null;
        const backendEdges = backendState ? backendState.edges : null;
        const backendVertices = backendState ? backendState.vertices : null;

        if (backendState) {
            console.log('🔗 Connected to Quannex Backend. Using authoritative physics.');
        } else {
            console.warn('⚠️ Quannex Backend not found. Falling back to local calculations.');
        }

        // Edge Analysis
        let edgeAnalysis = edges.calculateAllEdges(companyData.faces, null, backendEdges);

        // AI Interpretation
        console.log('🧠 Running AI Edge Interpreter...');
        edgeAnalysis = edgeAnalysis.map(edge => {
            const face1 = companyData.faces.find(f => f.id === edge.face1Id);
            const face2 = companyData.faces.find(f => f.id === edge.face2Id);

            const csvData = edge.hasCSVData ? {
                archetype: edge.archetype,
                question: edge.question,
                kpiName: edge.kpiName,
                kpiMetric: edge.kpiMetric,
                kpiCalculation: edge.kpiCalculation
            } : null;

            const aiMeta = aiInterpreter.generateEdgeMetadata(face1, face2, edge.element, csvData);

            return {
                ...edge,
                ...aiMeta,
                aiSource: aiMeta.source
            };
        });

        // Vertex Analysis
        const vertexAnalysis = vertices.calculateAllVertices(companyData.faces, backendVertices);

        // Shadow Analysis
        const shadowAnalysis = shadows.analyze(companyData.faces, companyData.kpis);

        this.advancedAnalysisResults = {
            spectral: spectralAnalysis,
            edges: edgeAnalysis,
            vertices: vertexAnalysis,
            shadows: shadowAnalysis
        };

        // Expose globally for compatibility
        window.advancedAnalysisResults = this.advancedAnalysisResults;

        console.log('✅ Advanced analysis complete');

        // Render
        this.renderEdgeTensions();
        this.renderVertexVortices();

        return this.advancedAnalysisResults;
    }

    /**
     * Render edge tensions as NEON TUBES
     */
    renderEdgeTensions() {
        if (!this.advancedAnalysisResults || !this.advancedAnalysisResults.edges) return;

        const edges = this.advancedAnalysisResults.edges;

        // Clear existing
        this.edgeLines.forEach(mesh => this.scene.remove(mesh));
        this.edgeLines = [];

        const edgeAnalyzer = new EdgeAnalyzer();

        console.log(`🎨 Rendering ${edges.length} neon edge tubes...`);

        edges.forEach(edge => {
            // We need findSharedEdgeVertices. It's currently a global function in dodecahedron-3d.html.
            // We should probably pass it in or assume it's global. 
            // For this refactor, let's assume it's global for now, or we move it here.
            // Ideally, we move it here.

            const sharedPositions = window.findSharedEdgeVertices ? window.findSharedEdgeVertices(edge.face1Id, edge.face2Id) : null;

            if (!sharedPositions || sharedPositions.length !== 2) return;

            const vertex1 = sharedPositions[0];
            const vertex2 = sharedPositions[1];

            const narrative = edgeAnalyzer.generateNarrative(edge);
            narrative.kpiSuggestion = edge.kpiName;
            narrative.kpiMetric = edge.kpiMetric;
            narrative.aiSource = edge.aiSource;

            const curve = new THREE.LineCurve3(vertex1, vertex2);
            const tubeRadius = 0.025 + (edge.tension * 0.02);
            const tubeGeometry = new THREE.TubeGeometry(curve, 2, tubeRadius, 8, false);

            const colorValue = new THREE.Color(edge.color || '#00ff88');
            const baseOpacity = 0.9 + (edge.tension * 0.05);
            const pulseSpeed = 1000 / (1 + edge.tension * 3);
            const emissiveIntensity = 0.5 + (edge.tension * 0.4);

            const material = new THREE.MeshPhongMaterial({
                color: colorValue,
                emissive: colorValue,
                emissiveIntensity: emissiveIntensity,
                transparent: true,
                opacity: baseOpacity,
                shininess: 100,
                side: THREE.DoubleSide
            });

            const tubeMesh = new THREE.Mesh(tubeGeometry, material);
            tubeMesh.renderOrder = 10;

            tubeMesh.userData = {
                edgeData: edge,
                edgeName: edge.archetype,
                narrative: narrative,
                face1Name: edge.face1Name,
                face2Name: edge.face2Name,
                isEdge: true,
                animation: {
                    baseOpacity: baseOpacity,
                    baseEmissive: emissiveIntensity,
                    pulseSpeed: pulseSpeed,
                    startTime: Date.now(),
                    pulseAmplitude: 0.1
                }
            };

            this.scene.add(tubeMesh);
            this.edgeLines.push(tubeMesh);
        });

        if (this.edgeLines.length > 0 && !this.edgeAnimationRunning) {
            this.animateEdges();
        }
    }

    /**
     * Render vertex vortices as SPHERES
     */
    renderVertexVortices() {
        if (!this.advancedAnalysisResults || !this.advancedAnalysisResults.vertices) return;

        const vertices = this.advancedAnalysisResults.vertices;

        // Clear existing
        this.vertexSpheres.forEach(mesh => this.scene.remove(mesh));
        this.vertexSpheres = [];

        console.log(`📊 Rendering ${vertices.length} vertices`);

        vertices.forEach(vertex => {
            // Assuming getGeometricVertexIndex and getDodecahedronVertices are global
            const geometricIndex = window.getGeometricVertexIndex(vertex.id);
            const geometricVertices = window.getDodecahedronVertices();
            const position = geometricVertices[geometricIndex];

            const radius = 0.15 + (vertex.vortexStrength * 0.15);
            let color;
            if (vertex.vortexDirection > 0.2) color = new THREE.Color(0x00ffcc);
            else if (vertex.vortexDirection > -0.2) color = new THREE.Color(0xffaa00);
            else color = new THREE.Color(0xff4444);

            const geometry = new THREE.SphereGeometry(radius, 16, 16);
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.5 + (vertex.vortexStrength * 0.5),
                transparent: true,
                opacity: 0.7
            });

            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.copy(position);

            sphere.userData = {
                vertexData: vertex,
                isVertex: true,
                isEdge: false,
                vertexName: vertex.archetype,
                narrative: vertex.narrative
            };

            this.scene.add(sphere);
            this.vertexSpheres.push(sphere);
        });
    }

    /**
     * Render feedback loops
     */
    renderFeedbackLoops() {
        if (!this.advancedAnalysisResults || !this.advancedAnalysisResults.dynamics) return;

        const loops = this.advancedAnalysisResults.dynamics.feedbackLoops.summary.criticalLoops || [];

        this.feedbackLoopLines.forEach(mesh => this.scene.remove(mesh));
        this.feedbackLoopLines = [];

        loops.slice(0, 5).forEach(loop => {
            const points = [];
            loop.cycle.forEach(faceId => {
                // Assuming getFaceCenterPosition is global
                const pos = window.getFaceCenterPosition ? window.getFaceCenterPosition(faceId - 1) : null;
                if (pos) points.push(pos);
            });

            if (points.length > 0) points.push(points[0]);

            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            let color;
            if (loop.direction.includes('Virtuous')) color = new THREE.Color(0x00ff88);
            else if (loop.direction.includes('Vicious')) color = new THREE.Color(0xff4444);
            else color = new THREE.Color(0xffaa00);

            const material = new THREE.LineBasicMaterial({
                color: color,
                linewidth: 3,
                transparent: true,
                opacity: 0.6
            });

            const line = new THREE.Line(geometry, material);
            line.userData.loopData = loop;
            this.scene.add(line);
            this.feedbackLoopLines.push(line);
        });
    }

    /**
     * Animation loop for edges
     */
    animateEdges() {
        this.edgeAnimationRunning = true;

        const pulse = () => {
            const currentTime = Date.now();

            this.edgeLines.forEach(tubeMesh => {
                if (!tubeMesh.userData.animation) return;

                const { baseOpacity, baseEmissive, pulseSpeed, startTime, pulseAmplitude } = tubeMesh.userData.animation;
                const elapsed = currentTime - startTime;
                const phase = (elapsed % pulseSpeed) / pulseSpeed * Math.PI * 2;
                const pulseValue = Math.sin(phase) * pulseAmplitude;

                tubeMesh.material.opacity = baseOpacity + pulseValue;
                tubeMesh.material.emissiveIntensity = baseEmissive + (pulseValue * 0.5);
            });

            if (this.edgeLines.length > 0) {
                requestAnimationFrame(pulse);
            } else {
                this.edgeAnimationRunning = false;
            }
        };

        pulse();
    }

    /**
     * Setup mouse interaction
     */
    setupInteraction() {
        window.addEventListener('mousemove', this.handleMouseMove);
    }

    handleMouseMove(event) {
        if (this.edgeLines.length === 0 && this.vertexSpheres.length === 0) return;

        // Normalized mouse coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.raycaster.params.Line.threshold = 0.1;

        const targets = [...this.edgeLines, ...this.vertexSpheres];
        const intersects = this.raycaster.intersectObjects(targets);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            const data = object.userData;

            if (data.isEdge) {
                this.showEdgeTooltip(event, data, object);
            } else if (data.isVertex) {
                this.showVertexTooltip(event, data, object);
            }
        } else {
            this.hideTooltips();
        }
    }

    showEdgeTooltip(event, data, object) {
        if (this.vertexTooltip) this.vertexTooltip.classList.remove('visible');

        if (this.edgeTooltip) {
            const narrative = data.narrative;
            this.edgeTooltip.innerHTML = `
                <div style="font-weight: bold; color: #00ffcc; margin-bottom: 2px; font-size: 13px;">${data.edgeName}</div>
                <div style="font-size: 9px; color: rgba(255,255,255,0.5); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">
                    ${data.face1Name} ↔ ${data.face2Name}
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; margin-bottom: 8px;">
                    <div style="font-size: 10px; color: #aaa; margin-bottom: 2px;">Strategic Question:</div>
                    <div style="font-size: 11px; font-style: italic; color: #fff;">"${narrative.question}"</div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 4px;">
                    <span>Tension:</span>
                    <span style="color: ${data.edgeData.tension > 0.6 ? '#ff4444' : '#00ff88'}">${(data.edgeData.tension * 100).toFixed(0)}% (${narrative.tensionStatus})</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 8px;">
                    <span>Flow:</span>
                    <span style="color: #00ccff;">${narrative.flow}</span>
                </div>
                <div style="font-size: 11px; line-height: 1.4; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">
                    ${narrative.fullNarrative}
                </div>
                ${narrative.kpiSuggestion ? `
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.1);">
                    <div style="font-size: 9px; color: #00ffcc; text-transform: uppercase;">Recommended KPI</div>
                    <div style="font-size: 11px; font-weight: 600;">${narrative.kpiSuggestion}</div>
                    <div style="font-size: 10px; opacity: 0.7;">${narrative.kpiMetric}</div>
                </div>
                ` : ''}
            `;
            this.edgeTooltip.style.left = (event.clientX + 15) + 'px';
            this.edgeTooltip.style.top = (event.clientY + 15) + 'px';
            this.edgeTooltip.classList.add('visible');
        }

        document.body.style.cursor = 'help';
        object.material.emissiveIntensity = 2.0;
    }

    showVertexTooltip(event, data, object) {
        if (this.edgeTooltip) this.edgeTooltip.classList.remove('visible');

        if (this.vertexTooltip) {
            const vertex = data.vertexData;
            const narrative = data.narrative;
            this.vertexTooltip.innerHTML = `
                <div style="font-weight: bold; color: #ff0066; margin-bottom: 2px; font-size: 13px;">${data.vertexName}</div>
                <div style="font-size: 9px; color: rgba(255,255,255,0.5); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">
                    ${vertex.id} • Vortex Point
                </div>
                <div style="font-size: 10px; margin-bottom: 8px; display: flex; gap: 4px; flex-wrap: wrap;">
                    ${vertex.faceNames.map(name => `<span style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">${name}</span>`).join('')}
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 4px;">
                    <span>Strength:</span>
                    <span style="color: ${vertex.vortexStrength > 0.7 ? '#ff0066' : '#00ffcc'}">${(vertex.vortexStrength * 100).toFixed(0)}% (${vertex.vortexType})</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 8px;">
                    <span>Coherence:</span>
                    <span style="color: ${vertex.coherence > 0.7 ? '#00ffcc' : '#ffaa00'}">${(vertex.coherence * 100).toFixed(0)}%</span>
                </div>
                <div style="background: rgba(255, 0, 100, 0.1); padding: 8px; border-radius: 6px; margin-bottom: 8px; border: 1px solid rgba(255, 0, 100, 0.3);">
                    <div style="font-size: 10px; color: #ff99cc; margin-bottom: 2px;">The Spin:</div>
                    <div style="font-size: 11px; color: #fff; font-style: italic;">"${narrative.spinLabel}"</div>
                    <div style="font-size: 11px; color: rgba(255,255,255,0.8); margin-top: 4px;">${narrative.description}</div>
                </div>
                <div style="font-size: 11px; line-height: 1.4; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">
                    <strong style="color: #ff0066;">Action:</strong> ${narrative.action}
                </div>
            `;
            this.vertexTooltip.style.left = (event.clientX + 15) + 'px';
            this.vertexTooltip.style.top = (event.clientY + 15) + 'px';
            this.vertexTooltip.classList.add('visible');
        }

        document.body.style.cursor = 'help';
        object.material.opacity = 1.0;
        object.scale.setScalar(1.3);
    }

    hideTooltips() {
        if (this.edgeTooltip) this.edgeTooltip.classList.remove('visible');
        if (this.vertexTooltip) this.vertexTooltip.classList.remove('visible');
        document.body.style.cursor = 'default';

        // Reset highlights
        this.edgeLines.forEach(mesh => {
            if (mesh.userData.animation) {
                mesh.material.emissiveIntensity = mesh.userData.animation.baseEmissive;
            }
        });

        this.vertexSpheres.forEach(mesh => {
            mesh.material.opacity = 0.7;
            mesh.scale.setScalar(1.0);
        });
    }

    clear() {
        this.edgeLines.forEach(mesh => this.scene.remove(mesh));
        this.edgeLines = [];

        this.vertexSpheres.forEach(mesh => this.scene.remove(mesh));
        this.vertexSpheres = [];

        this.feedbackLoopLines.forEach(mesh => this.scene.remove(mesh));
        this.feedbackLoopLines = [];

        this.hideTooltips();
    }
}

// Export to window for global access (since we are not using modules yet in main HTML)
if (typeof window !== 'undefined') {
    window.VisualizationManager = VisualizationManager;
}
