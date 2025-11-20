/**
 * Face Wizard - Template Selection and Face Definition
 *
 * Handles Stage 1 of the demo: Defining the 12 organizational faces
 */

// Face Templates
const FACE_TEMPLATES = {
    business: {
        name: "Standard Business Model",
        faces: [
            { id: 1, name: "Financial Capital", icon: "💰" },
            { id: 2, name: "Human Capital", icon: "👥" },
            { id: 3, name: "Customer Experience", icon: "❤️" },
            { id: 4, name: "Operations & Execution", icon: "⚙️" },
            { id: 5, name: "Technology & Innovation", icon: "💡" },
            { id: 6, name: "Brand & Reputation", icon: "✨" },
            { id: 7, name: "Leadership & Governance", icon: "👑" },
            { id: 8, name: "Strategy & Vision", icon: "🎯" },
            { id: 9, name: "Partnerships & Ecosystem", icon: "🤝" },
            { id: 10, name: "Risk & Compliance", icon: "🛡️" },
            { id: 11, name: "Learning & Development", icon: "📚" },
            { id: 12, name: "Sustainability & Impact", icon: "🌍" }
        ]
    },

    startup: {
        name: "Startup Framework",
        faces: [
            { id: 1, name: "Product-Market Fit", icon: "🎯" },
            { id: 2, name: "Funding & Runway", icon: "💵" },
            { id: 3, name: "Team & Culture", icon: "👥" },
            { id: 4, name: "Technology Stack", icon: "⚡" },
            { id: 5, name: "Customer Acquisition", icon: "📈" },
            { id: 6, name: "Revenue Model", icon: "💰" },
            { id: 7, name: "Competitive Position", icon: "🏆" },
            { id: 8, name: "Operational Efficiency", icon: "⚙️" },
            { id: 9, name: "Founder Alignment", icon: "🤝" },
            { id: 10, name: "Market Timing", icon: "⏰" },
            { id: 11, name: "Scalability Potential", icon: "🚀" },
            { id: 12, name: "Risk Management", icon: "🛡️" }
        ]
    },

    nonprofit: {
        name: "Non-Profit Model",
        faces: [
            { id: 1, name: "Mission Clarity", icon: "🌟" },
            { id: 2, name: "Impact Measurement", icon: "📊" },
            { id: 3, name: "Community Engagement", icon: "🤝" },
            { id: 4, name: "Funding Diversity", icon: "💰" },
            { id: 5, name: "Volunteer Capacity", icon: "👥" },
            { id: 6, name: "Program Effectiveness", icon: "✅" },
            { id: 7, name: "Board Governance", icon: "👑" },
            { id: 8, name: "Stakeholder Trust", icon: "❤️" },
            { id: 9, name: "Operational Sustainability", icon: "♻️" },
            { id: 10, name: "Advocacy & Influence", icon: "📣" },
            { id: 11, name: "Learning Culture", icon: "📚" },
            { id: 12, name: "Financial Health", icon: "💵" }
        ]
    },

    project: {
        name: "Project Management",
        faces: [
            { id: 1, name: "Scope & Requirements", icon: "📋" },
            { id: 2, name: "Timeline & Milestones", icon: "⏱️" },
            { id: 3, name: "Budget & Resources", icon: "💰" },
            { id: 4, name: "Team Performance", icon: "👥" },
            { id: 5, name: "Stakeholder Engagement", icon: "🗣️" },
            { id: 6, name: "Quality Standards", icon: "⭐" },
            { id: 7, name: "Risk Management", icon: "⚠️" },
            { id: 8, name: "Change Control", icon: "🔄" },
            { id: 9, name: "Dependencies & Integration", icon: "🔗" },
            { id: 10, name: "Technical Delivery", icon: "🔧" },
            { id: 11, name: "Knowledge Transfer", icon: "📖" },
            { id: 12, name: "Value Realization", icon: "🎁" }
        ]
    },

    custom: {
        name: "Custom",
        faces: [
            { id: 1, name: "Face 1", icon: "1️⃣" },
            { id: 2, name: "Face 2", icon: "2️⃣" },
            { id: 3, name: "Face 3", icon: "3️⃣" },
            { id: 4, name: "Face 4", icon: "4️⃣" },
            { id: 5, name: "Face 5", icon: "5️⃣" },
            { id: 6, name: "Face 6", icon: "6️⃣" },
            { id: 7, name: "Face 7", icon: "7️⃣" },
            { id: 8, name: "Face 8", icon: "8️⃣" },
            { id: 9, name: "Face 9", icon: "9️⃣" },
            { id: 10, name: "Face 10", icon: "🔟" },
            { id: 11, name: "Face 11", icon: "1️⃣1️⃣" },
            { id: 12, name: "Face 12", icon: "1️⃣2️⃣" }
        ]
    },

    // AI Story Mode (Placeholder for logic)
    story: {
        name: "AI Story Mode",
        faces: [] // Populated dynamically
    }
};

// Current configuration
let currentTemplate = null;
let currentFaces = [];
let geminiApiKey = localStorage.getItem('gemini_api_key'); // Load stored key

// Import Gemini Client (Dynamic Import in analyzeStory)

/**
 * Select a template
 */
function selectTemplate(templateKey) {
    // Update UI
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.getElementById(`template-${templateKey}`).classList.add('selected');

    currentTemplate = templateKey;

    // Handle Story Mode separately
    if (templateKey === 'story') {
        document.getElementById('storyModeSection').style.display = 'block';
        document.getElementById('faceEditorSection').style.display = 'none';
        document.getElementById('step1NextBtn').disabled = true;
        
        // Show API Key input if missing
        if (!geminiApiKey) {
            document.getElementById('apiKeySection').style.display = 'block';
        } else {
            document.getElementById('apiKeySection').style.display = 'none';
        }
        
        return;
    }

    // Hide AI sections
    document.getElementById('storyModeSection').style.display = 'none';
    document.getElementById('apiKeySection').style.display = 'none';

    // Standard Templates
    currentFaces = JSON.parse(JSON.stringify(FACE_TEMPLATES[templateKey].faces));

    // Show face editor
    document.getElementById('faceEditorSection').style.display = 'block';
    renderFaceEditor();

    // Enable next button
    document.getElementById('step1NextBtn').disabled = false;

    console.log(`✅ Template selected: ${FACE_TEMPLATES[templateKey].name}`);
}

/**
 * Save Gemini API Key
 */
function saveGeminiKey() {
    const key = document.getElementById('geminiKeyInput').value.trim();
    if (key.length > 10) {
        localStorage.setItem('gemini_api_key', key);
        geminiApiKey = key;
        document.getElementById('apiKeySection').style.display = 'none';
        alert('✅ API Key Saved! You can now use AI Story Mode.');
    } else {
        alert('❌ Invalid API Key');
    }
}

/**
 * Analyze Story (Hybrid: Gemini > Local Expert)
 */
async function analyzeStory() {
    const text = document.getElementById('storyInput').value;
    if (!text || text.trim().length < 10) {
        alert("Please enter a longer story or description.");
        return;
    }

    const btn = document.querySelector('#storyModeSection .btn-primary');
    const originalText = btn.innerHTML;
    btn.disabled = true;

    // 1. Try Gemini if Key Exists
    if (geminiApiKey) {
        btn.innerHTML = '🧠 Gemini Thinking...';
        try {
            // Dynamically import to avoid module errors in non-module script
            const { GeminiClient } = await import('./gemini-client.js');
            const ai = new GeminiClient(geminiApiKey);
            
            const result = await ai.analyzeStory(text);
            
            // Success! Apply AI results
            currentFaces = result.faces;
            
            // Update UI
            document.getElementById('faceEditorSection').style.display = 'block';
            renderFaceEditor();
            document.getElementById('step1NextBtn').disabled = false;
            
            alert(`✨ Gemini Analysis Complete!\n\nFocus: ${result.focus}\n\nWe have mapped your story to the geometry.`);
            
        } catch (error) {
            console.error("Gemini Error:", error);
            alert(`⚠️ Gemini API Error: ${error.message}\n\nFalling back to local expert system.`);
            runLocalFallback(text);
        }
    } else {
        // 2. Fallback to Local System
        btn.innerHTML = 'Analyzing Semantics...';
        setTimeout(() => runLocalFallback(text), 1000);
    }

    // Restore button
    btn.innerHTML = originalText;
    btn.disabled = false;
}

/**
 * Local Fallback (The "Mini-Expert" Engine)
 */
function runLocalFallback(text) {
    const results = runSemanticAnalysis(text);
    currentFaces = results.faces;
    
    document.getElementById('faceEditorSection').style.display = 'block';
    renderFaceEditor();
    document.getElementById('step1NextBtn').disabled = false;
    
    alert(`✨ Analysis Complete (Local Mode)\n\nDetected Pattern: ${results.type}\n\nWe've mapped your story to the 12 faces.`);
}

/**
 * Run Semantic Analysis (Mini Expert System)
 */
function runSemanticAnalysis(text) {
    const lowerText = text.toLowerCase();
    
    // 1. Detect Organization Type
    let type = "business";
    let scores = { business: 0, startup: 0, nonprofit: 0 };
    
    const keywords = {
        business: ['profit', 'revenue', 'market', 'sales', 'customer', 'product', 'company'],
        startup: ['growth', 'scale', 'funding', 'investor', 'product', 'user', 'platform', 'tech'],
        nonprofit: ['mission', 'impact', 'community', 'donor', 'volunteer', 'social', 'change']
    };

    Object.keys(keywords).forEach(key => {
        keywords[key].forEach(word => {
            if (lowerText.includes(word)) scores[key]++;
        });
    });

    // Find winner
    if (scores.nonprofit > scores.business && scores.nonprofit > scores.startup) type = "nonprofit";
    else if (scores.startup > scores.business) type = "startup";
    
    // 2. Get Base Template
    let faces = JSON.parse(JSON.stringify(FACE_TEMPLATES[type].faces));
    
    // 3. Semantic Overrides (Rename faces based on specific keywords)
    // Map keywords to specific Face IDs
    const overrides = [
        { words: ['blockchain', 'web3', 'crypto'], faceId: 5, name: 'Decentralized Tech' },
        { words: ['supply chain', 'logistics'], faceId: 4, name: 'Supply Chain Ops' },
        { words: ['community', 'tribe'], faceId: 9, name: 'Community Ecosystem' },
        { words: ['sustainability', 'green', 'climate'], faceId: 12, name: 'Regenerative Impact' },
        { words: ['brand', 'story', 'narrative'], faceId: 6, name: 'Strategic Narrative' },
        { words: ['culture', 'wellbeing', 'health'], faceId: 2, name: 'Team Wellbeing' }
    ];

    let focus = "General Management";

    overrides.forEach(rule => {
        if (rule.words.some(w => lowerText.includes(w))) {
            const face = faces.find(f => f.id === rule.faceId);
            if (face) {
                face.name = rule.name; // Rename face
                face.icon = "✨"; // Mark as AI enhanced
                focus = rule.name; // Track primary focus
            }
        }
    });

    return {
        faces: faces,
        type: type.charAt(0).toUpperCase() + type.slice(1),
        focus: focus
    };
}

/**
 * Render face editor
 */
function renderFaceEditor() {
    const grid = document.getElementById('faceGrid');
    grid.innerHTML = '';

    currentFaces.forEach((face, index) => {
        const faceItem = document.createElement('div');
        faceItem.className = 'face-item';

        faceItem.innerHTML = `
            <div class="face-number">${face.id}</div>
            <input
                type="text"
                class="face-input"
                value="${face.name}"
                placeholder="Face ${face.id} name"
                data-face-id="${face.id}"
                onchange="updateFaceName(${face.id}, this.value)"
            />
        `;

        grid.appendChild(faceItem);
    });
}

/**
 * Update face name
 */
function updateFaceName(faceId, newName) {
    const face = currentFaces.find(f => f.id === faceId);
    if (face) {
        face.name = newName;
        console.log(`✅ Updated Face ${faceId}: ${newName}`);
    }
}

/**
 * Validate face configuration
 */
function validateFaces() {
    // Check all faces have names
    const emptyFaces = currentFaces.filter(f => !f.name || f.name.trim() === '');
    if (emptyFaces.length > 0) {
        return {
            valid: false,
            message: `Please name all faces. ${emptyFaces.length} face(s) are empty.`
        };
    }

    // Check for duplicate names
    const names = currentFaces.map(f => f.name.toLowerCase().trim());
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
        return {
            valid: false,
            message: `Duplicate face names detected: ${duplicates.join(', ')}`
        };
    }

    return {
        valid: true,
        message: 'All faces are valid'
    };
}

/**
 * Get current face configuration
 */
function getFaceConfiguration() {
    return {
        template: currentTemplate,
        templateName: FACE_TEMPLATES[currentTemplate].name,
        faces: currentFaces,
        timestamp: new Date().toISOString()
    };
}

/**
 * Export configuration as JSON
 */
function exportFaceConfiguration() {
    const config = getFaceConfiguration();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `quannex-faces-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);
    console.log('✅ Configuration exported');
}

/**
 * Import configuration from JSON
 */
function importFaceConfiguration(jsonString) {
    try {
        const config = JSON.parse(jsonString);

        if (!config.faces || config.faces.length !== 12) {
            throw new Error('Invalid configuration: must have 12 faces');
        }

        currentTemplate = config.template || 'custom';
        currentFaces = config.faces;

        // Update UI
        selectTemplate(currentTemplate);

        console.log('✅ Configuration imported');
        return true;
    } catch (error) {
        console.error('❌ Import failed:', error);
        alert('Failed to import configuration: ' + error.message);
        return false;
    }
}

// Expose to window for use in HTML
window.selectTemplate = selectTemplate;
window.updateFaceName = updateFaceName;
window.validateFaces = validateFaces;
window.getFaceConfiguration = getFaceConfiguration;
window.exportFaceConfiguration = exportFaceConfiguration;
window.importFaceConfiguration = importFaceConfiguration;
window.analyzeStory = analyzeStory;
window.saveGeminiKey = saveGeminiKey;

console.log('✅ Face Wizard loaded');
