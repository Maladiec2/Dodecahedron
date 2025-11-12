/**
 * ========================================
 * DATA TRANSFORMATION LAYER
 * ========================================
 *
 * Transforms data between UI format and Calculation Engine format
 * Provides validation, normalization, and error handling
 *
 * This is the critical "adapter" layer that bridges:
 * - Demo Orchestrator UI → Quannex Engine
 * - User input format → Mathematical calculation format
 */

/**
 * Data Transformation Schema
 * --------------------------
 * UI Format (from demo-orchestrator) → Engine Format (for main.js)
 */
class DataTransformer {
    constructor() {
        this.validationErrors = [];
    }

    /**
     * Transform demo data to engine format
     *
     * @param {Object} demoData - Data from demo orchestrator
     * @param {string} demoData.faceConfig - Face configuration
     * @param {string} demoData.kpiMode - "quick" or "full"
     * @param {Array} demoData.kpiData - KPI data from UI
     * @returns {Object} - Engine-compatible company data
     */
    transformDemoToEngine(demoData) {
        console.log('🔄 DATA TRANSFORMER: Starting transformation...');
        console.log('   Input:', {
            faceConfig: demoData.faceConfig?.templateName,
            kpiMode: demoData.kpiMode,
            kpiCount: demoData.kpiData?.length
        });

        this.validationErrors = [];

        // Validate input
        if (!this.validateInput(demoData)) {
            console.error('❌ Validation failed:', this.validationErrors);
            throw new Error(`Validation failed: ${this.validationErrors.join(', ')}`);
        }

        // Transform KPIs to engine format
        const transformedKPIs = this.transformKPIs(demoData.kpiData);

        // Build company object
        const companyData = {
            name: demoData.faceConfig.templateName || 'Demo Company',
            kpis: transformedKPIs,
            faceConfig: demoData.faceConfig, // ✅ Pass face configuration for custom names
            mode: demoData.kpiMode,
            timestamp: new Date().toISOString()
        };

        console.log('✅ DATA TRANSFORMER: Transformation complete');
        console.log('   Output KPIs:', transformedKPIs.length);
        console.log('   Sample:', transformedKPIs[0]);

        return companyData;
    }

    /**
     * Validate input data
     */
    validateInput(demoData) {
        let valid = true;

        if (!demoData) {
            this.validationErrors.push('demoData is null or undefined');
            return false;
        }

        if (!demoData.faceConfig) {
            this.validationErrors.push('faceConfig is missing');
            valid = false;
        }

        if (!demoData.kpiData || !Array.isArray(demoData.kpiData)) {
            this.validationErrors.push('kpiData is missing or not an array');
            valid = false;
        }

        if (demoData.kpiData && demoData.kpiData.length === 0) {
            this.validationErrors.push('kpiData is empty - no KPIs to process');
            valid = false;
        }

        return valid;
    }

    /**
     * Transform KPI array from UI format to Engine format
     *
     * UI Format:
     * {
     *   faceId: 1,
     *   faceName: "Financial Capital",
     *   id: "F1_K1",
     *   name: "Revenue Growth",
     *   value: 15,
     *   unit: "percentage",
     *   direction: "↑",
     *   targetMin: 0,
     *   targetIdeal: 100,
     *   element: "Earth"
     * }
     *
     * Engine Format:
     * {
     *   KPI_ID: "F1_E1",
     *   KPI_Name: "Revenue Growth",
     *   Value: 15,
     *   Weight: 1.0,
     *   Direction: "↑",
     *   Target_Min: 0,
     *   Target_Ideal: 100,
     *   Healthy_Min: undefined,
     *   Healthy_Max: undefined,
     *   Absolute_Max: undefined,
     *   Face_ID: 1,
     *   Element: "Earth"
     * }
     */
    transformKPIs(kpiArray) {
        return kpiArray.map((uiKPI, index) => {
            // Map UI properties to Engine properties
            const engineKPI = {
                // Required fields
                KPI_ID: uiKPI.id || `KPI_${index + 1}`,
                KPI_Name: uiKPI.name || 'Unnamed KPI',
                Value: parseFloat(uiKPI.value) || 0,
                Weight: parseFloat(uiKPI.weight) || 1.0,
                Direction: uiKPI.direction || '↑',

                // Target ranges
                Target_Min: parseFloat(uiKPI.targetMin) || 0,
                Target_Ideal: parseFloat(uiKPI.targetIdeal) || 100,

                // Optional advanced ranges (for Band direction)
                Healthy_Min: parseFloat(uiKPI.healthyMin) || undefined,
                Healthy_Max: parseFloat(uiKPI.healthyMax) || undefined,
                Absolute_Max: parseFloat(uiKPI.absoluteMax) || undefined,

                // Organizational context
                Face_ID: parseInt(uiKPI.faceId) || null,
                Element: uiKPI.element || 'Earth',

                // Metadata (optional, for debugging)
                faceName: uiKPI.faceName,
                unit: uiKPI.unit
            };

            // Log transformation for debugging
            console.log(`   📋 KPI ${index + 1}:`, {
                from: `${uiKPI.name} = ${uiKPI.value}`,
                to: `${engineKPI.KPI_Name} = ${engineKPI.Value}`,
                face: engineKPI.Face_ID,
                element: engineKPI.Element
            });

            return engineKPI;
        });
    }

    /**
     * Transform engine results back to UI format
     * (For displaying calculation results in the demo)
     */
    transformEngineToUI(engineState) {
        console.log('🔄 DATA TRANSFORMER: Transforming results to UI format...');

        return {
            globalCoherence: engineState.globalCoherence,
            coherenceStatus: engineState.coherenceStatus,
            faces: engineState.faces.map(face => ({
                id: face.id,
                name: face.name,
                energy: face.faceEnergy || face.energy || 0,
                status: face.status,
                color: face.color,
                kpis: face.elementalKPIs || []
            })),
            timestamp: engineState.timestamp
        };
    }

    /**
     * Validate KPI data quality
     * Returns array of warnings (non-fatal issues)
     */
    validateKPIQuality(kpiArray) {
        const warnings = [];

        kpiArray.forEach((kpi, index) => {
            // Check for missing values
            if (!kpi.name || kpi.name.trim() === '') {
                warnings.push(`KPI ${index + 1}: Missing name`);
            }

            // Check for invalid ranges
            if (kpi.targetMin >= kpi.targetIdeal) {
                warnings.push(`KPI ${index + 1} (${kpi.name}): Target Min (${kpi.targetMin}) >= Target Ideal (${kpi.targetIdeal})`);
            }

            // Check for extreme values
            if (kpi.value < 0) {
                warnings.push(`KPI ${index + 1} (${kpi.name}): Negative value (${kpi.value})`);
            }

            // Check for missing face assignment
            if (!kpi.faceId) {
                warnings.push(`KPI ${index + 1} (${kpi.name}): No face assigned`);
            }
        });

        return warnings;
    }

    /**
     * Get validation summary
     */
    getValidationSummary(kpiArray) {
        const warnings = this.validateKPIQuality(kpiArray);

        return {
            valid: this.validationErrors.length === 0,
            errors: this.validationErrors,
            warnings: warnings,
            kpiCount: kpiArray.length,
            summary: this.validationErrors.length === 0
                ? '✅ Data is valid and ready for calculation'
                : `❌ ${this.validationErrors.length} error(s), ${warnings.length} warning(s)`
        };
    }
}

/**
 * Create global singleton instance
 */
const dataTransformer = new DataTransformer();

/**
 * Expose to window for use in demo-orchestrator
 */
window.DataTransformer = {
    /**
     * Transform demo data to engine format
     */
    transform: (demoData) => dataTransformer.transformDemoToEngine(demoData),

    /**
     * Transform engine results to UI format
     */
    transformResults: (engineState) => dataTransformer.transformEngineToUI(engineState),

    /**
     * Validate KPI data
     */
    validate: (demoData) => dataTransformer.getValidationSummary(demoData.kpiData),

    /**
     * Get direct access to transformer instance (for advanced use)
     */
    getInstance: () => dataTransformer
};

console.log('✅ Data Transformation Layer loaded');
console.log('💡 Use window.DataTransformer.transform(demoData) to convert UI data to Engine format');
