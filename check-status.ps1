# Check NoPaper Application Status
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NoPaper Application Status Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Backend
Write-Host "Checking Backend Server..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:8000" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Write-Host "[OK] Backend Status: ONLINE (Status: $($backendResponse.StatusCode))" -ForegroundColor Green
    
    # Check API Docs
    try {
        $docsResponse = Invoke-WebRequest -Uri "http://localhost:8000/docs" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        Write-Host "[OK] API Documentation: ACCESSIBLE" -ForegroundColor Green
    } catch {
        Write-Host "[WARN] API Documentation: Not accessible" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[FAIL] Backend Status: OFFLINE or Not Ready" -ForegroundColor Red
}

Write-Host ""

# Check Frontend
Write-Host "Checking Frontend Server..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Write-Host "[OK] Frontend Status: ONLINE (Status: $($frontendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Frontend Status: OFFLINE or Not Ready" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Application Links" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend Application:" -ForegroundColor White
Write-Host "  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend API:" -ForegroundColor White
Write-Host "  http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "API Documentation:" -ForegroundColor White
Write-Host "  http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  http://localhost:8000/redoc" -ForegroundColor Cyan
Write-Host ""
Write-Host "API Endpoints:" -ForegroundColor White
Write-Host "  http://localhost:8000/books" -ForegroundColor Gray
Write-Host "  http://localhost:8000/register" -ForegroundColor Gray
Write-Host "  http://localhost:8000/login" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if processes are running
Write-Host "Checking Running Processes..." -ForegroundColor Yellow
$pythonProcesses = Get-Process | Where-Object {$_.ProcessName -like "*python*"} | Measure-Object
$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Measure-Object

Write-Host "Python processes: " -NoNewline -ForegroundColor White
if ($pythonProcesses.Count -gt 0) {
    Write-Host "$($pythonProcesses.Count)" -ForegroundColor Green
} else {
    Write-Host "0" -ForegroundColor Red
}

Write-Host "Node processes: " -NoNewline -ForegroundColor White
if ($nodeProcesses.Count -gt 0) {
    Write-Host "$($nodeProcesses.Count)" -ForegroundColor Green
} else {
    Write-Host "0" -ForegroundColor Red
}

Write-Host ""
