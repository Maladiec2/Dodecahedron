# Complete Quannex Startup Script
# Starts both backend API and frontend web server

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     🌟 QUANNEX COHERENCE ENGINE 🌟                  ║" -ForegroundColor Cyan
Write-Host "║     Starting Complete System...                     ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend Server
Write-Host "📡 Starting backend API server..." -ForegroundColor Yellow
$backend = Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$projectRoot\backend'; node server.js"
) -PassThru

Start-Sleep -Seconds 3

# Test backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "   ✅ Backend API running on http://localhost:3001" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend failed to start!" -ForegroundColor Red
    Write-Host "   Check the backend window for errors." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Start Frontend Server
Write-Host "🌐 Starting frontend web server..." -ForegroundColor Yellow
$frontend = Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$projectRoot'; http-server -p 8080 -c-1"
) -PassThru

Start-Sleep -Seconds 2

# Test frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -UseBasicParsing -TimeoutSec 5
    Write-Host "   ✅ Frontend server running on http://localhost:8080" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Frontend server might still be starting..." -ForegroundColor Yellow
}

Write-Host ""

# Open browser
Write-Host "🚀 Opening Quannex in your browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 1
Start-Process "http://localhost:8080"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              🎉 QUANNEX IS READY! 🎉                 ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Application:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:8080" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "📡 API Endpoints:" -ForegroundColor Cyan
Write-Host "   http://localhost:3001/api/state" -ForegroundColor White
Write-Host "   http://localhost:3001/api/shadow-analysis" -ForegroundColor White
Write-Host "   http://localhost:3001/api/breath-analysis" -ForegroundColor White
Write-Host "   http://localhost:3001/api/spectral-analysis" -ForegroundColor White
Write-Host "   http://localhost:3001/api/tuning-constants" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To Stop:" -ForegroundColor Yellow
Write-Host "   Press Ctrl+C in both PowerShell windows" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Keep both PowerShell windows open while using Quannex" -ForegroundColor Cyan
Write-Host ""

