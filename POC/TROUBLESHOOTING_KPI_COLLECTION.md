# 🔧 KPI Collection Troubleshooting Guide

## Issue: "Only 1 KPI collected instead of 12"

### What You're Seeing
```
📊 Total KPIs collected: 1
   Face 1 (Financial Capital): ✅ Added KPI
   Face 2 (Human Capital): ⚠️ Skipped (no KPI name)
   Face 3 (Customer Experience): ⚠️ Skipped (no KPI name)
   ...
```

Result: All faces show **0.0%** except the first one.

---

## Root Causes & Solutions

### 1. **Only One Face Actually Filled** ✅ Most Common

**What's happening**: You may have only filled in Face 1, not all 12 faces.

**How to verify**:
- Scroll through Step 2 - you should see **12 separate sections**
- Each section = 1 face
- You need to fill at least the **KPI Name** for each face you want to include

**Solution**:
```
For EACH of the 12 faces:
1. Click in the "KPI Name" field
2. Start typing (e.g., "Rev...") to see suggestions
3. Select a suggestion OR type your own name
4. The form will auto-fill Unit, Min, and Ideal
5. Enter the Current Value
6. Move to next face

Repeat 12 times (or skip faces you don't want to measure)
```

---

### 2. **Datalist Not Saving Values** (Fixed in V2.1.1)

**What was happening**: When you select from dropdown, the value wasn't being persisted.

**Fixed by**:
- Added `oninput` handler to save value as you type
- Enhanced `autofillKPISuggestion()` to explicitly persist the value
- Collection now checks both `input.value` and `data-current-value`

**How to verify it's working**:
1. Open Console (F12)
2. Select a KPI from dropdown
3. You should see: `🔧 Autofill triggered for Face X, KPI name: "Your KPI"`
4. Then see: `✅ Autofilled KPI: Your KPI`

If you see `⚠️ No KPI name entered`, the field is empty.

---

### 3. **Testing the Fix**

#### Step-by-Step Test:

**Clear test** (start fresh):
1. Refresh the page
2. Step 1: Select "Standard Business Model"
3. Step 2: Choose "Quick Mode"

**Fill in Face 1**:
```
Face 1: Financial Capital
  KPI Name: Revenue Growth    (type and select from dropdown)
  Value: 15
  Unit: % (should auto-fill)
  Min: 0 (should auto-fill)
  Ideal: 25 (should auto-fill)
  Direction: ↑ Higher
```

Watch for:
- Normalized preview should appear: `→ Normalized: 60.0%`

**Fill in Face 2**:
```
Face 2: Human Capital
  KPI Name: Total Headcount
  Value: 42
  Unit: count
  Min: 1
  Ideal: 100
  Direction: ↑ Higher
```

**Repeat for remaining faces** (or skip if you only want to test a few)

**When done, click "Next: Calculate"**

**Expected Console Output**:
```
📊 Collecting KPI data...
   Mode: quick
   Faces: 12

   Face 1 (Financial Capital):
      🔍 Input value: "Revenue Growth", data-current-value: "Revenue Growth"
      {kpiName: "Revenue Growth", value: "15", unit: "percentage", ...}
      ✅ Added KPI: {faceId: 1, name: "Revenue Growth", value: 15, ...}

   Face 2 (Human Capital):
      🔍 Input value: "Total Headcount", data-current-value: "Total Headcount"
      {kpiName: "Total Headcount", value: "42", unit: "count", ...}
      ✅ Added KPI: {faceId: 2, name: "Total Headcount", value: 42, ...}

   Face 3 (Customer Experience):
      🔍 Input value: "", data-current-value: "null"
      {kpiName: "", value: "", unit: "number", ...}
      ⚠️ Skipped (no KPI name entered for this face)

   ...

📊 Total KPIs collected: 2  <-- Should match # of faces you filled
```

---

## Enhanced Debug Output (New in V2.1.1)

You'll now see much more detailed logging:

### When you type/select a KPI:
```
🔧 Autofill triggered for Face 1, KPI name: "Revenue Growth"
✅ Autofilled KPI: Revenue Growth
```

### When collection happens:
```
📊 Collecting KPI data...
   Mode: quick
   Faces: 12
   Face 1 (Financial Capital):
      🔍 Input value: "Revenue Growth", data-current-value: "Revenue Growth"
      {kpiName: "Revenue Growth", value: "15", ...}
      ✅ Added KPI: {faceId: 1, name: "Revenue Growth", ...}
```

### When calculation runs:
```
🔬 Running calculation...
   Company name: Standard Business Model
   KPIs count: 12
   ⚠️ Quannex Engine not loaded - using fallback calculation

🧮 Starting simple coherence calculation...
   Input KPIs: 12
   KPI: Revenue Growth = 15 → 60.0%
   KPI: Total Headcount = 42 → 41.0%
   ...
   Face 1 (Financial Capital): 1 KPI → 60.0%
   Face 2 (Human Capital): 1 KPI → 41.0%
   ...
🧮 Calculation complete:
   Global Coherence: 45.8%
   Status: Concerning
```

---

## Common Mistakes

### ❌ Mistake 1: Only filling first face
**Symptom**: "I filled in all the KPIs but only 1 is captured"
**Reality**: User only scrolled through and filled Face 1, didn't realize there are 12 sections
**Solution**: Scroll down! You should see 12 separate boxes.

### ❌ Mistake 2: Not waiting for autofill
**Symptom**: KPI name disappears after selection
**Reality**: Clicking "Next" too fast before autofill completes
**Solution**: Wait 1 second after selecting from dropdown, watch for `✅ Autofilled KPI` message

### ❌ Mistake 3: Expecting all 12 to auto-populate
**Symptom**: "Why do I have to enter KPIs manually?"
**Reality**: The system provides *suggestions*, but you need to actively select them for each face
**Solution**: This is by design - you choose which faces to measure

---

## Quick Checklist

Before clicking "Next: Calculate":

- [ ] I've scrolled through all 12 face sections
- [ ] I've filled in **at least the KPI Name** for faces I want to measure
- [ ] I see the normalized preview (green/yellow/red) for filled faces
- [ ] Console shows autofill confirmations
- [ ] I'm okay with unmeasured faces showing as 0% (crisis)

---

## If Still Not Working

### Diagnostic Steps:

1. **Open Console** (F12)
2. **Clear Console** (trash icon)
3. **Fill ONE face completely**:
   - KPI Name: Cash Reserves
   - Value: 6
   - Unit: months
   - Min: 1
   - Ideal: 6
   - Direction: ↑
4. **Check Console** - should see:
   ```
   🔧 Autofill triggered for Face 1, KPI name: "Cash Reserves"
   ✅ Autofilled KPI: Cash Reserves
   ```
5. **Click "Next: Calculate"**
6. **Check Console** - should see:
   ```
   📊 Collecting KPI data...
      🔍 Input value: "Cash Reserves", data-current-value: "Cash Reserves"
      ✅ Added KPI: {faceId: 1, name: "Cash Reserves", value: 6, ...}
   📊 Total KPIs collected: 1
   ```

If you see `Input value: "", data-current-value: "null"` → the field is actually empty.

---

## What Changed in V2.1.1

### Enhanced KPI Name Persistence
- Added `oninput` handler to save value as you type
- Autofill function now explicitly sets `inputElement.value` AND `inputElement.setAttribute('value')`
- Collection checks both sources: `input.value` OR `data-current-value`

### Enhanced Logging
- Shows exact input values during collection
- Tracks autofill trigger and completion
- Distinguishes between "skipped (empty)" vs "autofilled successfully"

### Auto-trigger Normalization
- After autofill completes, automatically calculates and shows normalized score
- No need to manually enter values to see preview

---

## Expected Behavior (Correct)

### Scenario A: Fill 3 faces, skip 9
```
📊 Total KPIs collected: 3

Result:
  Face 1: 65.0%  ✅
  Face 2: 48.0%  ⚠️
  Face 3: 72.0%  ✅
  Face 4-12: 0.0%  ❌ (skipped)

Global Coherence: 21.6% (Crisis)
```

This is CORRECT - unmeasured faces = 0% = crisis.

### Scenario B: Fill all 12 faces
```
📊 Total KPIs collected: 12

Result:
  All 12 faces show calculated percentages

Global Coherence: 67.3% (Moderate)
```

This is CORRECT - all faces measured.

---

## Remember

**Empty faces = 0% = Critical failure**

This is by design (Option A: Mathematical Purity). If you haven't measured a face, it's treated as non-existent (0%), which is philosophically accurate.

If you want to measure all 12 faces, you MUST fill in all 12 forms in Step 2.

---

**Status**: Enhanced in V2.1.1
**Last Updated**: 2025-11-10
**Issue**: Data collection reliability
**Solution**: Better persistence + comprehensive debugging
