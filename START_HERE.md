# 🚀 How to Start Quannex

## Quick Start (2 steps)

### Step 1: Start the Backend
Open PowerShell in the project folder and run:
```powershell
cd backend
node server.js
```

You should see:
```
🌟 QUANNEX COHERENCE ENGINE 🌟
✨ Server running on http://localhost:3001
```

**Keep this window open!**

### Step 2: Start the Frontend Server
Open a **NEW PowerShell window** in the project folder and run:
```powershell
http-server -p 8080 -c-1
```

Then open your browser to:
```
http://localhost:8080
```

**Keep this window open too!**

> **Note:** You need `http-server` because JavaScript modules require a web server. 
> If you don't have it, install with: `npm install -g http-server`

---

## ✅ How to Know It's Working

### In the Browser:
You should see:
- A **3D rotating dodecahedron** in the center
- **Control panels** on the left with metrics
- **Dropdown menu** to select KPIs
- **Update KPI button**

### If Something's Wrong:

#### Problem: Black screen or "Cannot read properties"
**Solution:** 
1. Make sure backend is running (check Step 1)
2. Refresh the page (F5)
3. Check browser console (F12) for errors

#### Problem: "Failed to fetch" error
**Solution:**
1. Verify backend is running:
   ```powershell
   curl http://localhost:3001/api/health
   ```
2. If not running, start it (Step 1)

#### Problem: 3D model not showing
**Solution:**
- Make sure you have internet connection (Three.js loads from CDN)
- Try a different browser (Chrome works best)

---

## 🎮 Quick Test

Once it loads:
1. Select a KPI from dropdown (e.g., "F1.1: Months of Runway")
2. Change value to `8`
3. Click "Update KPI"
4. Watch the 3D model and metrics update!

---

## 📊 What You Should See

### Main Panels:

1. **🌟 Organizational Coherence**
   - Global Coherence: ~57%
   - System Status
   - Pattern

2. **🎯 Action Plan**
   - Recommended actions

3. **🎵 Spectral Analysis**
   - Dominant Mode
   - Being-Action Balance
   - Dissonance Index

4. **👁️ Shadow Analysis**
   - System Integrity: 100%
   - Shadow Patterns: None

5. **🌊 Breath Analysis**
   - Breath Health: ~64%
   - Balanced Axes: 2/6
   - Tendency: Over-exhaling

---

## 🛑 How to Stop

1. Close the browser tab
2. In the PowerShell window, press `Ctrl+C`

---

## 🆘 Still Not Working?

### Check These:

1. **Is Node.js installed?**
   ```powershell
   node --version
   ```
   Should show v16 or higher.

2. **Are dependencies installed?**
   ```powershell
   cd backend
   npm install
   ```

3. **Is port 3001 free?**
   ```powershell
   netstat -ano | findstr :3001
   ```
   If something's using it, close that application.

4. **Try a different port:**
   Edit `backend/server.js`:
   Change `const PORT = 3001;` to `const PORT = 3002;`
   
   Then edit `main.js`:
   Change `const API_URL = 'http://localhost:3001/api';` to `const API_URL = 'http://localhost:3002/api';`

---

## 💡 Pro Tips

- **Keep backend window open** while using the app
- **Use Chrome or Edge** for best compatibility
- **Check browser console (F12)** if something doesn't work
- **Refresh page (F5)** after updating backend

---

## 🎉 You're Ready!

Once you see the dodecahedron spinning and metrics loading, you're all set!

Try updating different KPIs and watch the system respond in real-time.

**The Living Geometric Oracle is alive!** 🔮✨

