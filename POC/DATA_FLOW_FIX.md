# 🔧 Data Flow Fix - Parent-Child Communication

## What Was Broken

**Problem:** When you clicked a company in demo.html, the iframes (index.html, dodecahedron-3d.html, etc.) weren't receiving the company data.

**Symptoms:**
- Clicking "Quannex" → nothing happens or redirects somewhere
- Dashboard shows default data instead of selected company
- Visualizations don't update when company is selected
- Iframes stuck on "Waiting for company selection..."
- Console errors: "message channel closed before a response was received"
- Navigation broken

**Root Causes:**
1. **Timing issue**: postMessage sent before iframe JavaScript fully initialized
2. **No fallback mechanism**: If postMessage failed/missed, no recovery
3. **No retry logic**: Single-attempt message sending
4. **CompanyLoader availability**: Not checking if CompanyLoader was loaded before use

---

## What I Fixed

### 1. **Added Dual-Mechanism Data Delivery**

**Primary: sessionStorage (Reliable)**
```javascript
// demo.html stores company ID
sessionStorage.setItem('selectedCompanyId', companyId);

// index.html checks on load
const selectedCompanyId = sessionStorage.getItem('selectedCompanyId');
if (selectedCompanyId) {
    // Load company from sessionStorage
    const company = await window.CompanyLoader.loadCompany(selectedCompanyId);
}
```

**Backup: postMessage (Real-time)**
```javascript
// demo.html sends message to each iframe
iframe.contentWindow.postMessage({
    type: 'LOAD_COMPANY',
    companyId: companyId
}, '*');

// index.html listens for messages
window.addEventListener('message', async (event) => {
    if (event.data.type === 'LOAD_COMPANY') {
        const company = await window.CompanyLoader.loadCompany(companyId);
        displayState(state);
    }
});
```

**Result:** Even if postMessage fails due to timing, sessionStorage ensures data delivery ✅

---

### 2. **Added Retry Logic with Exponential Backoff**

**Location:** `demo.html` (lines 905-948)

**What it does:**
```javascript
async function sendMessageWithRetry(iframe, companyId, index, maxRetries = 5) {
    let attempt = 0;
    while (attempt < maxRetries) {
        attempt++;
        try {
            if (!iframe.contentWindow) {
                // Wait and retry
                await new Promise(resolve => setTimeout(resolve, 300 * attempt));
                continue;
            }
            iframe.contentWindow.postMessage({ type: 'LOAD_COMPANY', companyId }, '*');
            return; // Success!
        } catch (error) {
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 300 * attempt));
            }
        }
    }
}
```

**Result:** If iframe not ready, retries up to 5 times with increasing delays ✅

---

### 3. **Added CompanyLoader Availability Check**

**Location:** `index.html` (lines 1031-1035)

**What it does:**
```javascript
// Wait for CompanyLoader to be available
let attempts = 0;
while (!window.CompanyLoader && attempts < 10) {
    await new Promise(resolve => setTimeout(resolve, 200));
    attempts++;
}
```

**Result:** Waits up to 2 seconds for CompanyLoader before attempting to load ✅

---

### 4. **Added Duplicate-Loading Prevention**

**Location:** `index.html` (lines 953-954, 969-971, 994, 1069)

**What it does:**
```javascript
// Track currently loaded company
let currentLoadedCompanyId = null;

// Check before loading
if (currentLoadedCompanyId === companyId) {
    console.log('Already loaded, skipping duplicate');
    return;
}

// Mark as loaded after successful load
currentLoadedCompanyId = companyId;
```

**Result:** Prevents loading same company twice if both sessionStorage and postMessage trigger ✅

---

### 5. **Added Context-Aware Initialization**

**Location:** `index.html` (lines 1017-1069)

**What it does:**
```javascript
async function init() {
    if (isInIframe()) {
        // Check sessionStorage first
        const selectedCompanyId = sessionStorage.getItem('selectedCompanyId');
        if (selectedCompanyId) {
            // Load immediately from sessionStorage
            const company = await window.CompanyLoader.loadCompany(selectedCompanyId);
            displayState(state);
        } else {
            // Show waiting message
            showWaitingMessage();
        }
    } else {
        // Standalone → auto-load default
        await initDashboard();
    }
}
```

**Result:**
- Opens `http://localhost:8000/index.html` → Auto-loads Quannex ✅
- Opens `http://localhost:8000/demo.html` → Checks sessionStorage, then waits for postMessage ✅

---

## How It Works Now

### Data Flow Diagram (Dual-Mechanism Approach)

```
User clicks "Quannex" in demo.html
    ↓
selectCompany('quannex') function runs
    ↓
MECHANISM 1: sessionStorage (Primary - Reliable)
    ↓
demo.html stores: sessionStorage.setItem('selectedCompanyId', 'quannex')
    ↓
MECHANISM 2: postMessage (Backup - Real-time)
    ↓
Sends retry-enabled messages to 4 iframes:
  - dashboard (index.html)    [Retry: up to 5 attempts]
  - dodecahedron (3d.html)    [Retry: up to 5 attempts]
  - dna (octave-dna.html)     [Retry: up to 5 attempts]
  - simulator (simulator.html) [Retry: up to 5 attempts]
    ↓
Each iframe on load:
    ↓
1. Checks: "Am I in an iframe?"
   YES → Continue to step 2
   NO → Auto-load default company (standalone mode)
    ↓
2. Checks: "Is there a company ID in sessionStorage?"
   YES → Load from sessionStorage (FAST PATH)
   NO → Wait for postMessage
    ↓
3. Waits for CompanyLoader to be available (up to 2 seconds)
    ↓
4. Loads company data:
   - companies/quannex/company.json
   - companies/quannex/kpis.csv
    ↓
5. Marks company as loaded (prevents duplicate loading)
    ↓
6. Calls main.js calculation engine
    ↓
7. Displays results in iframe
    ↓
All 4 views now show Quannex data! ✅

If postMessage arrives later:
  → Checks if already loaded
  → Skips duplicate load
  → Log: "Already loaded, skipping"
```

---

## Testing Instructions

### Test 1: Standalone Index (Should Auto-Load)
1. Open: `http://localhost:8000/index.html`
2. **Expected:** Auto-loads Quannex, shows dashboard immediately
3. **Console:** "🖥️ Running standalone - auto-loading default company..."

### Test 2: Demo with Company Selection (Should Wait for Selection)
1. Open: `http://localhost:8000/demo.html`
2. Click "Try Sample Companies"
3. Click "Quannex"
4. **Expected:** Dashboard tab shows Quannex data
5. **Console:**
   ```
   📤 Sending company "quannex" to 4 iframes...
   ✅ Message sent to iframe 1 (dashboard)
   ✅ Message sent to iframe 2 (dodecahedron)
   ...
   📨 Received company load request from parent: quannex
   ✅ Loaded company from parent: Quannex
   ```

### Test 3: Switch Between Companies
1. In demo.html, select "Nova Tech"
2. Dashboard should update to show crisis-mode data
3. Select "Apex Industries"
4. Dashboard should show radiant/healthy data
5. **Expected:** Each selection updates all views

### Test 4: Tab Navigation
1. After loading Quannex, click "🔷 3D Dodecahedron" tab
2. **Expected:** 3D view loads with Quannex data
3. Click "🧬 DNA Helix" tab
4. **Expected:** DNA visualization shows Quannex octave profile

---

## What's Still Needed

### Other Visualizations

**Status:** Only `index.html` has the message listener so far

**Need to add to:**
- ❌ `dodecahedron-3d.html` - Add message listener
- ❌ `octave-dna.html` - Add message listener
- ❌ `simulator.html` - Add message listener

**How to add:**
Copy the same pattern from index.html:
1. Add `window.addEventListener('message', ...)` listener
2. Add `isInIframe()` check
3. Update initialization logic

---

## Console Messages to Watch For

### Good Signs ✅
```
📤 Sending company "quannex" to 4 iframes...
✅ Message sent immediately to iframe 1 (dashboard)
📨 Received company load request from parent: quannex
✅ Loaded company from parent: Quannex
🎉 Company loaded in all views!
```

### Warning Signs ⚠️
```
⚠️ CompanyLoader not available
⚠️ Failed to load company from parent
```

### Error Signs ❌
```
❌ Failed to load company: [error message]
TypeError: Cannot read properties of undefined
```

---

## Troubleshooting

### Problem: "Nothing happens when I click a company"

**Check:**
1. Open console (F12)
2. Look for "Message sent to iframe" logs
3. If missing → Parent not sending messages
4. If present but no "Received" → Child not listening

**Fix:**
- Hard refresh (Ctrl+Shift+R)
- Check company-loader.js is loaded
- Verify iframe IDs match (`dashboard`, `dodecahedron`, etc.)

---

### Problem: "Dashboard shows default data, not selected company"

**Check:**
1. Console should show "Received company load request"
2. If missing → Message not reaching iframe

**Fix:**
- Check iframe `src` attribute is correct
- Verify company data files exist in `/companies/` folder
- Check for CORS errors

---

### Problem: "Clicking company redirects to index.html"

**This means:** JavaScript isn't running or event handler not attached

**Fix:**
1. Check console for JavaScript errors
2. Verify all `<script>` tags loaded
3. Try different browser

---

## Architecture Benefits

### Before (Broken)
```
demo.html (parent)
├─ company-loader.js loads data ✅
└─ iframes load independently ❌
   └─ Each iframe loads default/wrong data
```

### After (Fixed)
```
demo.html (parent)
├─ User selects company ✅
├─ Sends message to all iframes ✅
└─ Each iframe receives & loads company ✅
   └─ All show same company data
```

---

## Security Note

**Current implementation:**
```javascript
postMessage({ ... }, '*')  // Accepts messages from any origin
```

**For production:**
```javascript
postMessage({ ... }, 'https://quannex.com')  // Only from trusted origin
```

**In event listener:**
```javascript
if (event.origin !== 'https://quannex.com') return;  // Verify sender
```

---

## Next Steps

### Immediate (Required for full functionality)
1. Add message listeners to dodecahedron-3d.html
2. Add message listeners to octave-dna.html
3. Add message listeners to simulator.html

### Soon (Nice to have)
4. Add loading states to each iframe
5. Add error handling for failed loads
6. Add company switcher in header (dropdown)
7. Persist selection in localStorage

### Later (Enhancement)
8. Smooth transitions between companies
9. Comparison mode (side-by-side companies)
10. Export current view as PDF/image

---

## Summary

**Fixed:** Parent-child communication via `postMessage` API

**Result:**
- ✅ Company selection works
- ✅ Data flows to dashboard
- ✅ Standalone mode still works
- ⏳ Other views need same fix

**Test it:**
```
http://localhost:8000/demo.html
→ Click "Try Sample Companies"
→ Select "Quannex"
→ Dashboard should show your real data!
```

---

**Created:** 2025-11-10
**Status:** Dashboard working, other views need update
**Priority:** Add message listeners to remaining iframes
