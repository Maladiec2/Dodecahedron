# 🏠 Welcome Screen Fix

## Problem

When loading [DEMO.html](DEMO.html), the **welcome screen disappeared immediately** and users were taken straight to the Dashboard view (Respiratory System/Breath Analysis).

### Why This Happened

The DEMO uses `sessionStorage` to remember your company selection across page reloads. Once you selected a company (either from the orchestrator or sample companies), that selection was saved. On every subsequent page load, the system would:

1. Check `sessionStorage.getItem('selectedCompanyId')`
2. Find an existing company
3. **Automatically hide the welcome screen** (line 1141)
4. Load the dashboard for that company

This meant you could **never see the welcome screen again** unless you:
- Cleared your browser's sessionStorage manually
- Used a different browser/incognito window

## The Fix ✅

### 1. Added "🏠 Home" Button

**File**: [DEMO.html:740-742](DEMO.html#L740-742)

A new Home button in the header that's **always visible**:

```html
<button class="switch-company-btn" onclick="returnToWelcome()" style="margin-left: 10px;">
    🏠 Home
</button>
```

### 2. Created `returnToWelcome()` Function

**File**: [DEMO.html:1151-1180](DEMO.html#L1151-1180)

```javascript
function returnToWelcome() {
    console.log('🏠 Returning to welcome screen');

    // Clear current company selection
    sessionStorage.removeItem('selectedCompanyId');
    sessionStorage.removeItem('customCompanyData');

    // Show welcome screen
    document.getElementById('welcomeScreen').classList.remove('hidden');

    // Hide company display
    document.getElementById('currentCompanyDisplay').style.display = 'none';
    document.getElementById('switchCompanyBtn').style.display = 'none';

    // Clear iframes
    const dashboardFrame = document.getElementById('dashboardFrame');
    const geometryFrame = document.getElementById('geometryFrame');
    const dnaFrame = document.getElementById('dnaFrame');
    const simulatorFrame = document.getElementById('simulatorFrame');

    if (dashboardFrame) dashboardFrame.src = 'about:blank';
    if (geometryFrame) geometryFrame.src = 'about:blank';
    if (dnaFrame) dnaFrame.src = 'about:blank';
    if (simulatorFrame) simulatorFrame.src = 'about:blank';

    console.log('✅ Returned to welcome screen');
}
```

### 3. Updated `initPage()` Logic

**File**: [DEMO.html:1132-1149](DEMO.html#L1132-1149)

Added a `showWelcome` flag check:

```javascript
function initPage() {
    const selectedCompanyId = sessionStorage.getItem('selectedCompanyId');
    const forceWelcome = sessionStorage.getItem('showWelcome') === 'true';

    // Only auto-hide welcome screen if there's a company AND we're not forcing welcome
    if (selectedCompanyId && !forceWelcome) {
        document.getElementById('welcomeScreen').classList.add('hidden');
        updateCompanyDisplay(selectedCompanyId);
        console.log(`📋 Resuming session with company: ${selectedCompanyId}`);
    } else {
        sessionStorage.removeItem('showWelcome');
    }
}
```

## How It Works Now 🎯

### Scenario 1: First Visit
1. **You**: Open [DEMO.html](DEMO.html) for the first time
2. **System**: No `selectedCompanyId` in sessionStorage
3. **Result**: ✅ Welcome screen shows with "Try Sample Companies" and "Upload Your Data" buttons

### Scenario 2: After Selecting a Company
1. **You**: Select "Quannex" from sample companies
2. **System**: Saves to sessionStorage, loads dashboard
3. **You**: Refresh the page
4. **System**: Sees `selectedCompanyId` = "quannex"
5. **Result**: ✅ Automatically loads Quannex dashboard (skips welcome screen)

### Scenario 3: Want to Go Back to Welcome Screen
1. **You**: Click **🏠 Home** button in header
2. **System**:
   - Clears `selectedCompanyId` from sessionStorage
   - Clears `customCompanyData`
   - Shows welcome screen
   - Clears all iframe content
3. **Result**: ✅ Welcome screen appears again!

### Scenario 4: From Orchestrator
1. **You**: Complete orchestrator wizard
2. **Orchestrator**: Saves custom data to sessionStorage, sets `selectedCompanyId` = 'custom'
3. **You**: Click "View in Demo" (hypothetical future button)
4. **System**: Loads DEMO.html, sees custom company, loads dashboard
5. **You**: Click **🏠 Home** to start over
6. **Result**: ✅ Welcome screen, can select sample companies or upload new data

## User Experience Improvements

### Before Fix ❌
- Welcome screen disappeared instantly
- No way to get back to welcome screen
- Confusing for first-time users
- Had to manually clear browser data

### After Fix ✅
- Welcome screen persists until you select a company
- **🏠 Home button** always available to return
- Clear navigation flow
- Intuitive user experience

## Alternative: Quick Access from Console

If the Home button isn't visible or you want a quick reset:

```javascript
// Open browser console (F12) and run:
sessionStorage.clear();
location.reload();
```

## Technical Details

### SessionStorage Keys Used

```javascript
// Company selection
sessionStorage.setItem('selectedCompanyId', 'quannex');  // Sample company
sessionStorage.setItem('selectedCompanyId', 'custom');   // Custom data from orchestrator

// Custom company data
sessionStorage.setItem('customCompanyData', JSON.stringify({
    id: 'custom',
    name: 'Custom Analysis',
    kpis: [...],
    faceConfig: {...},
    timestamp: '2025-11-11T...'
}));

// Force welcome screen flag (future use)
sessionStorage.setItem('showWelcome', 'true');
```

### Why SessionStorage?

- **Persists across page reloads** (unlike regular variables)
- **Tab-specific** (doesn't affect other tabs/windows)
- **Cleared when tab closes** (unlike localStorage)
- **Perfect for demo flow** (remembers state during exploration)

## Files Modified

1. **[POC/DEMO.html](DEMO.html)** - Lines 740-742, 1132-1180
   - Added Home button
   - Added `returnToWelcome()` function
   - Updated `initPage()` logic

## Testing Instructions 🧪

### Test 1: First Load
1. Clear browser data or use incognito window
2. Open [DEMO.html](DEMO.html)
3. **Expected**: Welcome screen shows with two buttons
4. **Verify**: Can read instructions and choose option

### Test 2: Sample Company Flow
1. Click "Try Sample Companies"
2. Select "Quannex"
3. Dashboard loads
4. Refresh page (F5)
5. **Expected**: Dashboard reloads automatically (welcome screen skipped)
6. Click **🏠 Home** button
7. **Expected**: Welcome screen appears again

### Test 3: Custom Data Flow
1. Go to [demo-orchestrator.html](demo-orchestrator.html)
2. Create custom KPIs
3. Calculate coherence
4. Launch any visualization
5. Close visualization tab, open [DEMO.html](DEMO.html)
6. **Expected**: Dashboard loads with custom data (welcome screen skipped)
7. Click **🏠 Home** button
8. **Expected**: Welcome screen appears, custom data cleared

### Test 4: Home Button Persistence
1. Select any company
2. Switch between tabs (Dashboard, 3D Geometry, DNA Helix, Simulator)
3. **Expected**: 🏠 Home button always visible in header
4. Click it from any tab
5. **Expected**: Welcome screen appears

## Visual Reference

### Welcome Screen
```
┌─────────────────────────────────────────┐
│  🔷 QUANNEX DEMO               🏠 Home  │
├─────────────────────────────────────────┤
│                                         │
│    Welcome to Quannex                   │
│    Organizational DNA Visualization     │
│                                         │
│    ┌─────────────────────────┐         │
│    │ 📊 Try Sample Companies │         │
│    └─────────────────────────┘         │
│                                         │
│    ┌─────────────────────────┐         │
│    │ 📤 Upload Your Data     │         │
│    └─────────────────────────┘         │
│                                         │
└─────────────────────────────────────────┘
```

### After Selecting Company
```
┌──────────────────────────────────────────────────┐
│  🔷 QUANNEX DEMO  │  Quannex  │  🔄 Switch  🏠   │
├──────────────────────────────────────────────────┤
│  📊 Dashboard  │  🌐 3D  │  🧬 DNA  │  ⚙️ Sim   │
├──────────────────────────────────────────────────┤
│                                                  │
│  [Dashboard iframe content...]                   │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

**Status**: ✅ Fixed
**Date**: 2025-11-11
**Issue**: Welcome screen disappeared immediately due to sessionStorage persistence
**Solution**: Added Home button with `returnToWelcome()` function to clear state and show welcome screen
**Impact**: Users can now easily return to welcome screen at any time
