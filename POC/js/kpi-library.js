/**
 * KPI Library - Smart Suggestions and Elemental Wisdom
 *
 * Provides:
 * - KPI name suggestions based on face type
 * - Elemental explanations (Earth, Water, Fire, Air, Ether)
 * - Common unit types
 * - Default values and ranges
 */

// ========================================
// ELEMENTAL EXPLANATIONS
// ========================================

const ELEMENTAL_WISDOM = {
    Earth: {
        name: 'Earth',
        subtitle: 'Stability & Structure',
        icon: '🌍',
        color: '#8B4513',
        description: 'The foundation. Measures resources, infrastructure, and grounding forces. Earth KPIs represent what you can count on, what\'s solid and dependable.',
        qualities: 'Stable, Reliable, Tangible, Material, Foundational',
        examples: 'Cash reserves, physical assets, team size, inventory, infrastructure'
    },

    Water: {
        name: 'Water',
        subtitle: 'Flow & Adaptability',
        icon: '💧',
        color: '#1E90FF',
        description: 'The flow. Measures movement, growth, and adaptability. Water KPIs represent how things change, flow, and evolve over time.',
        qualities: 'Flowing, Adaptive, Growing, Cyclical, Emotional',
        examples: 'Revenue growth, customer acquisition, market expansion, cash flow, relationship quality'
    },

    Fire: {
        name: 'Fire',
        subtitle: 'Energy & Transformation',
        icon: '🔥',
        color: '#FF4500',
        description: 'The energy. Measures intensity, productivity, and transformation. Fire KPIs represent how much energy is being generated and directed.',
        qualities: 'Energetic, Productive, Transformative, Intense, Active',
        examples: 'Profit margin, productivity, conversion rates, innovation output, competitive advantage'
    },

    Air: {
        name: 'Air',
        subtitle: 'Communication & Movement',
        icon: '🌬️',
        color: '#87CEEB',
        description: 'The movement. Measures communication, speed, and connection. Air KPIs represent how quickly things move and how well information flows.',
        qualities: 'Fast, Communicative, Connected, Distributed, Mental',
        examples: 'Response time, velocity, information sharing, network effects, agility'
    },

    Ether: {
        name: 'Ether',
        subtitle: 'Vision & Purpose',
        icon: '✨',
        color: '#8A2BE2',
        description: 'The vision. Measures alignment with purpose, strategic clarity, and higher-order coherence. Ether KPIs represent "why" and "what for."',
        qualities: 'Visionary, Purposeful, Aligned, Strategic, Transcendent',
        examples: 'Mission alignment, strategic clarity, brand strength, cultural coherence, impact'
    }
};

// ========================================
// UNIT TYPES
// ========================================

const UNIT_TYPES = [
    { value: 'number', label: 'Number', symbol: '', example: '42' },
    { value: 'percentage', label: 'Percentage', symbol: '%', example: '15%' },
    { value: 'currency_usd', label: 'US Dollars', symbol: '$', example: '$1.5M' },
    { value: 'currency_eur', label: 'Euros', symbol: '€', example: '€1.2M' },
    { value: 'months', label: 'Months', symbol: 'mo', example: '6 months' },
    { value: 'days', label: 'Days', symbol: 'd', example: '30 days' },
    { value: 'score', label: 'Score (1-10)', symbol: '/10', example: '7/10' },
    { value: 'ratio', label: 'Ratio', symbol: '', example: '1.5:1' },
    { value: 'hours', label: 'Hours', symbol: 'h', example: '40h' },
    { value: 'count', label: 'Count', symbol: '', example: '150 people' },
    { value: 'custom', label: 'Custom', symbol: '', example: 'custom' }
];

// ========================================
// KPI SUGGESTIONS BY FACE
// ========================================

const KPI_SUGGESTIONS = {
    // Standard Business Model
    'Financial Capital': {
        Earth: [
            { name: 'Cash Reserves', unit: 'months', targetMin: 1, targetIdeal: 6, description: 'Months of runway' },
            { name: 'Total Assets', unit: 'currency_usd', targetMin: 0, targetIdeal: 10000000, description: 'Balance sheet strength' },
            { name: 'Debt-to-Equity Ratio', unit: 'ratio', targetMin: 0, targetIdeal: 0.5, description: 'Financial leverage' }
        ],
        Water: [
            { name: 'Revenue Growth', unit: 'percentage', targetMin: 0, targetIdeal: 25, description: 'YoY growth rate' },
            { name: 'Cash Flow', unit: 'currency_usd', targetMin: 0, targetIdeal: 1000000, description: 'Monthly cash flow' },
            { name: 'Customer Lifetime Value Growth', unit: 'percentage', targetMin: 0, targetIdeal: 20, description: 'CLV increase' }
        ],
        Fire: [
            { name: 'Profit Margin', unit: 'percentage', targetMin: 0, targetIdeal: 25, description: 'Net profit margin' },
            { name: 'ROI', unit: 'percentage', targetMin: 0, targetIdeal: 30, description: 'Return on investment' },
            { name: 'EBITDA Margin', unit: 'percentage', targetMin: 0, targetIdeal: 20, description: 'Operating profitability' }
        ],
        Air: [
            { name: 'Investment Velocity', unit: 'ratio', targetMin: 0, targetIdeal: 1, description: 'Capital deployment speed' },
            { name: 'Days Sales Outstanding', unit: 'days', targetMin: 90, targetIdeal: 30, description: 'Collection speed' },
            { name: 'Payback Period', unit: 'months', targetMin: 24, targetIdeal: 12, description: 'Investment recovery time' }
        ],
        Ether: [
            { name: 'Financial Strategy Clarity', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Strategic alignment score' },
            { name: 'Investor Confidence', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Stakeholder trust' },
            { name: 'Long-term Value Creation', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Sustainable growth focus' }
        ]
    },

    'Human Capital': {
        Earth: [
            { name: 'Total Headcount', unit: 'count', targetMin: 1, targetIdeal: 100, description: 'Number of employees' },
            { name: 'Core Team Stability', unit: 'percentage', targetMin: 60, targetIdeal: 90, description: 'Retention of key staff' },
            { name: 'Salary Competitiveness', unit: 'percentage', targetMin: 80, targetIdeal: 110, description: '% of market rate' }
        ],
        Water: [
            { name: 'Employee Satisfaction', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Happiness survey score' },
            { name: 'Talent Acquisition Rate', unit: 'percentage', targetMin: 0, targetIdeal: 20, description: 'New hire growth' },
            { name: 'Career Progression Rate', unit: 'percentage', targetMin: 0, targetIdeal: 30, description: 'Internal promotions' }
        ],
        Fire: [
            { name: 'Productivity per Employee', unit: 'currency_usd', targetMin: 0, targetIdeal: 200000, description: 'Revenue per FTE' },
            { name: 'Training Investment', unit: 'currency_usd', targetMin: 0, targetIdeal: 5000, description: '$ per employee/year' },
            { name: 'Innovation Output', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Ideas implemented' }
        ],
        Air: [
            { name: 'Communication Quality', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Internal communication rating' },
            { name: 'Collaboration Index', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Cross-team cooperation' },
            { name: 'Time to Fill Position', unit: 'days', targetMin: 90, targetIdeal: 30, description: 'Hiring speed' }
        ],
        Ether: [
            { name: 'Cultural Alignment', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Values coherence' },
            { name: 'Purpose Clarity', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Mission understanding' },
            { name: 'Psychological Safety', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Trust & openness' }
        ]
    },

    'Customer Experience': {
        Earth: [
            { name: 'Customer Base Size', unit: 'count', targetMin: 0, targetIdeal: 10000, description: 'Total customers' },
            { name: 'Customer Retention Rate', unit: 'percentage', targetMin: 60, targetIdeal: 95, description: 'Annual retention' },
            { name: 'Support Infrastructure', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Support capacity' }
        ],
        Water: [
            { name: 'Customer Satisfaction (CSAT)', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Satisfaction score' },
            { name: 'Net Promoter Score (NPS)', unit: 'number', targetMin: -100, targetIdeal: 70, description: 'Recommendation likelihood' },
            { name: 'Customer Engagement', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Active usage rate' }
        ],
        Fire: [
            { name: 'Customer Lifetime Value', unit: 'currency_usd', targetMin: 0, targetIdeal: 10000, description: 'LTV per customer' },
            { name: 'Upsell Rate', unit: 'percentage', targetMin: 0, targetIdeal: 30, description: 'Expansion revenue' },
            { name: 'Customer Success Impact', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Value delivered' }
        ],
        Air: [
            { name: 'Response Time', unit: 'hours', targetMin: 48, targetIdeal: 2, description: 'Average support response' },
            { name: 'Resolution Speed', unit: 'days', targetMin: 14, targetIdeal: 1, description: 'Issue resolution time' },
            { name: 'Feedback Loop Velocity', unit: 'days', targetMin: 30, targetIdeal: 7, description: 'Feedback to action' }
        ],
        Ether: [
            { name: 'Customer-Centricity Score', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Cultural focus on customers' },
            { name: 'Brand Love', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Emotional connection' },
            { name: 'Mission Resonance', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Purpose alignment' }
        ]
    },

    'Operations & Execution': {
        Earth: [
            { name: 'Process Documentation', unit: 'percentage', targetMin: 0, targetIdeal: 90, description: '% of processes documented' },
            { name: 'Infrastructure Stability', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'System reliability' },
            { name: 'Capacity Utilization', unit: 'percentage', targetMin: 40, targetIdeal: 80, description: 'Resource usage' }
        ],
        Water: [
            { name: 'Throughput Growth', unit: 'percentage', targetMin: 0, targetIdeal: 20, description: 'Output increase rate' },
            { name: 'Process Improvement Rate', unit: 'percentage', targetMin: 0, targetIdeal: 15, description: 'Efficiency gains' },
            { name: 'Adaptability Score', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Change readiness' }
        ],
        Fire: [
            { name: 'Operational Efficiency', unit: 'percentage', targetMin: 60, targetIdeal: 95, description: 'Process efficiency' },
            { name: 'Cost per Unit', unit: 'currency_usd', targetMin: 100, targetIdeal: 10, description: 'Unit economics' },
            { name: 'Quality Score', unit: 'percentage', targetMin: 90, targetIdeal: 99, description: 'Output quality' }
        ],
        Air: [
            { name: 'Cycle Time', unit: 'days', targetMin: 30, targetIdeal: 7, description: 'Process completion speed' },
            { name: 'Cross-functional Flow', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Inter-department efficiency' },
            { name: 'Automation Level', unit: 'percentage', targetMin: 0, targetIdeal: 60, description: 'Automated processes' }
        ],
        Ether: [
            { name: 'Strategic Execution Alignment', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Strategy-execution fit' },
            { name: 'Excellence Culture', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Quality mindset' },
            { name: 'Continuous Improvement', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Kaizen culture' }
        ]
    },

    // Generic fallback for any face
    'Generic': {
        Earth: [
            { name: 'Foundation Strength', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Structural stability' },
            { name: 'Resource Availability', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Available capacity' }
        ],
        Water: [
            { name: 'Growth Rate', unit: 'percentage', targetMin: 0, targetIdeal: 20, description: 'Rate of change' },
            { name: 'Adaptability', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Flexibility' }
        ],
        Fire: [
            { name: 'Performance Level', unit: 'percentage', targetMin: 60, targetIdeal: 95, description: 'Output quality' },
            { name: 'Impact', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Effect magnitude' }
        ],
        Air: [
            { name: 'Speed', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Velocity' },
            { name: 'Connectivity', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Integration level' }
        ],
        Ether: [
            { name: 'Strategic Alignment', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Purpose fit' },
            { name: 'Vision Clarity', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Direction understanding' }
        ]
    }
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get elemental description
 */
function getElementalWisdom(element) {
    return ELEMENTAL_WISDOM[element] || ELEMENTAL_WISDOM.Earth;
}

/**
 * Get KPI suggestions for a face and element
 */
function getKPISuggestions(faceName, element) {
    const suggestions = KPI_SUGGESTIONS[faceName] || KPI_SUGGESTIONS['Generic'];
    return suggestions[element] || suggestions.Earth || [];
}

/**
 * Get all unit types
 */
function getUnitTypes() {
    return UNIT_TYPES;
}

/**
 * Format value with unit
 */
function formatValueWithUnit(value, unit) {
    const unitInfo = UNIT_TYPES.find(u => u.value === unit);
    if (!unitInfo) return value;

    switch (unit) {
        case 'percentage':
            return `${value}%`;
        case 'currency_usd':
            return `$${value.toLocaleString()}`;
        case 'currency_eur':
            return `€${value.toLocaleString()}`;
        case 'months':
            return `${value} months`;
        case 'days':
            return `${value} days`;
        case 'score':
            return `${value}/10`;
        case 'hours':
            return `${value}h`;
        default:
            return value;
    }
}

// Expose to window
window.KPILibrary = {
    ELEMENTAL_WISDOM,
    UNIT_TYPES,
    KPI_SUGGESTIONS,
    getElementalWisdom,
    getKPISuggestions,
    getUnitTypes,
    formatValueWithUnit
};

console.log('✅ KPI Library loaded - Elemental wisdom and smart suggestions available');
