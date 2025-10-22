# Quannex Startup Script
# This starts the backend server and opens the frontend

Write-Host "🌟 Starting Quannex Coherence Engine..." -ForegroundColor Cyan
Write-Host ""

# Start the backend server
Write-Host "Starting backend server..." -ForegroundColor Yellow
$backend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; node server.js" -PassThru

# Wait for server to initialize
Write-Host "Waiting for server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Test if server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Backend server is running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📡 API available at: http://localhost:3001/api" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "❌ Server failed to start. Check for errors in the backend window." -ForegroundColor Red
    exit 1
}

# Open the frontend in default browser
Write-Host "Opening frontend..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "index.html"
Start-Process $frontendPath

Write-Host ""
Write-Host "🎉 Quannex is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: Open in your browser (should open automatically)" -ForegroundColor White
Write-Host "Backend:  http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Available endpoints:" -ForegroundColor Cyan
Write-Host "  GET  /api/state              - Complete system state" -ForegroundColor White
Write-Host "  GET  /api/shadow-analysis    - Shadow patterns" -ForegroundColor White
Write-Host "  GET  /api/breath-analysis    - Breath ratios" -ForegroundColor White
Write-Host "  GET  /api/spectral-analysis  - Modal decomposition" -ForegroundColor White
Write-Host "  GET  /api/tuning-constants   - View/adjust tuning" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in the backend window to stop the server." -ForegroundColor Yellow
Write-Host ""

