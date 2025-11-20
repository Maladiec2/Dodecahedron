/**
 * Gemini API Client for Quannex
 * 
 * Handles communication with Google's Gemini API.
 * Supports "Bring Your Own Key" (BYOK) for immediate prototyping.
 * 
 * USAGE:
 * const ai = new GeminiClient(apiKey);
 * const result = await ai.analyzeStory(storyText);
 */

export class GeminiClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
        this.model = "gemini-pro"; // Text-only model
    }

    /**
     * Analyze an organizational story and map it to the 12 faces
     * @param {string} storyText - User's narrative
     * @returns {Promise<Object>} JSON configuration for the Dodecahedron
     */
    async analyzeStory(storyText) {
        if (!this.apiKey) {
            throw new Error("API Key is missing");
        }

        const prompt = this.constructPrompt(storyText);
        
        try {
            const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.2, // Low temperature for consistent JSON
                        maxOutputTokens: 1000,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const textResponse = data.candidates[0].content.parts[0].text;
            
            return this.parseJSONResponse(textResponse);

        } catch (error) {
            console.error("❌ Gemini Analysis Failed:", error);
            throw error;
        }
    }

    /**
     * Construct the prompt with Dodecahedron context
     */
    constructPrompt(storyText) {
        return `
You are the Quannex Organizational Architect, an expert system based on Sacred Geometry.
Your task is to map the user's organizational story to a 12-Face Dodecahedron model.

THE 12 FACES (Standard Model):
1. Financial Capital (Foundation)
2. Human Capital (Team/Culture)
3. Customer Experience (Relationships)
4. Operations & Execution (Structure)
5. Technology & Innovation (Tools)
6. Brand & Reputation (Identity)
7. Leadership & Governance (Direction)
8. Strategy & Vision (Purpose)
9. Partnerships & Ecosystem (Connection)
10. Risk & Compliance (Protection)
11. Learning & Development (Evolution)
12. Sustainability & Impact (Regeneration)

INSTRUCTIONS:
1. Analyze the user's story below.
2. Determine the organization type (Business, Startup, Non-Profit, Project, or Community).
3. Rename the 12 Faces to fit their specific context (e.g., "Donors" instead of "Customers" for Non-Profit).
4. Estimate a "sentiment/health" score (0.0 - 1.0) for each face based on the text. (0.5 is neutral).
5. Identify the "Primary Focus" of their story.

USER STORY:
"${storyText}"

OUTPUT FORMAT:
Return ONLY valid JSON. No markdown, no explanation.
{
    "type": "Startup/Business/etc",
    "focus": "Short summary of focus",
    "faces": [
        { "id": 1, "name": "Contextual Name", "icon": "Emoji", "sentiment": 0.8 },
        ... (all 12 faces)
    ]
}
`;
    }

    /**
     * Parse and validate JSON from AI response
     */
    parseJSONResponse(text) {
        try {
            // Clean markdown code blocks if present
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const json = JSON.parse(cleanText);
            
            // Basic validation
            if (!json.faces || json.faces.length !== 12) {
                throw new Error("AI returned invalid face count (must be 12)");
            }

            return json;
        } catch (e) {
            console.error("Failed to parse AI JSON:", text);
            throw new Error("Failed to parse AI response structure");
        }
    }
}

