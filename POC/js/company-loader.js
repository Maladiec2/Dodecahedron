/**
 * ========================================
 * COMPANY DATA LOADER
 * ========================================
 *
 * Manages loading different company datasets
 * Supports switching between multiple business cases
 */

/**
 * Available companies with metadata
 */
const COMPANIES = [
    {
        id: 'nova-tech',
        name: 'Nova Tech',
        tagline: 'AI-Powered Marketing Platform',
        stage: 'Seed Stage Startup',
        color: '#ff6b6b',
        octaveRange: 'O1-O2',
        description: 'Struggling startup in survival mode'
    },
    {
        id: 'zenith-solutions',
        name: 'Zenith Solutions',
        tagline: 'Cloud Infrastructure Automation',
        stage: 'Series A Growth',
        color: '#4ecdc4',
        octaveRange: 'O3-O4',
        description: 'Scaling company with growing pains'
    },
    {
        id: 'apex-industries',
        name: 'Apex Industries',
        tagline: 'Sustainable Manufacturing Excellence',
        stage: 'Public Company',
        color: '#00ff88',
        octaveRange: 'O6-O7',
        description: 'Mature enterprise radiating excellence'
    }
];

/**
 * Current loaded company
 */
let currentCompany = null;

/**
 * Load company profile from JSON
 */
async function loadCompanyProfile(companyId) {
    try {
        const response = await fetch(`./companies/${companyId}/company.json`);
        const profile = await response.json();
        return profile;
    } catch (error) {
        console.error(`Failed to load company profile for ${companyId}:`, error);
        return null;
    }
}

/**
 * Load company KPI data from CSV
 */
async function loadCompanyKPIs(companyId) {
    try {
        const response = await fetch(`./companies/${companyId}/kpis.csv`);
        const csvText = await response.text();

        // Parse CSV (reuse parseCSV from main.js if available)
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length === 0) return [];

        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};

            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });

            data.push(row);
        }

        return data;
    } catch (error) {
        console.error(`Failed to load KPIs for ${companyId}:`, error);
        return [];
    }
}

/**
 * Load complete company dataset
 */
async function loadCompany(companyId) {
    console.log(`📦 Loading company: ${companyId}`);

    const [profile, kpis] = await Promise.all([
        loadCompanyProfile(companyId),
        loadCompanyKPIs(companyId)
    ]);

    if (!profile || !kpis) {
        console.error('Failed to load company data');
        return null;
    }

    currentCompany = {
        ...profile,
        kpis: kpis,
        metadata: COMPANIES.find(c => c.id === companyId)
    };

    console.log(`✅ Loaded ${currentCompany.name}`);
    console.log(`   ${currentCompany.employees} employees`);
    console.log(`   ${kpis.length} KPIs`);
    console.log(`   Octaves: ${currentCompany.octaveProfile.dominant}`);

    return currentCompany;
}

/**
 * Get list of available companies
 */
function getAvailableCompanies() {
    return COMPANIES;
}

/**
 * Get current company
 */
function getCurrentCompany() {
    return currentCompany;
}

/**
 * Switch to different company
 */
async function switchCompany(companyId) {
    const company = await loadCompany(companyId);

    if (company && window.Quannex) {
        // Reinitialize Quannex with new company data
        await window.Quannex.initWithCompany(company);
    }

    return company;
}

// Export for use in other modules
window.CompanyLoader = {
    COMPANIES,
    loadCompany,
    switchCompany,
    getAvailableCompanies,
    getCurrentCompany
};

console.log('📦 Company Loader ready');
