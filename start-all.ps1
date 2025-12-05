# Start Both Backend and Frontend Servers
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Starting NoPaper Application" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Get the script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Stop any existing servers first
Write-Host "Checking for running servers..." -ForegroundColor Yellow
$pythonProcesses = Get-Process | Where-Object {$_.ProcessName -like "*python*"} -ErrorAction SilentlyContinue
$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -like "*node*"} -ErrorAction SilentlyContinue

if ($pythonProcesses -or $nodeProcesses) {
    Write-Host "Stopping existing servers..." -ForegroundColor Yellow
    if ($pythonProcesses) {
        $pythonProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    }
    if ($nodeProcesses) {
        $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

# Start Backend in new window
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-File", "$scriptPath\start-backend.ps1"

# Wait a bit for backend to start
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Frontend in new window
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-File", "$scriptPath\start-frontend.ps1"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Servers Starting..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Both servers are starting in separate windows..." -ForegroundColor Yellow
Write-Host "Please wait 10-30 seconds for servers to fully start." -ForegroundColor Yellow
Write-Host ""

