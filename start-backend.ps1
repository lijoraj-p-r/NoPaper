# Start Backend Server
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Starting Backend Server" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
cd backend
..\venv\Scripts\Activate.ps1
Write-Host "Backend URL: http://localhost:8000" -ForegroundColor Green
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server starting..." -ForegroundColor Yellow
Write-Host ""
uvicorn main:app --reload --host 0.0.0.0 --port 8000


