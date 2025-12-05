@echo off
echo ========================================
echo   Starting NoPaper Application
echo ========================================
echo.
echo Opening Backend Server...
start "NoPaper Backend" cmd /k "cd /d %~dp0 && start-backend.bat"
timeout /t 3 /nobreak >nul
echo.
echo Opening Frontend Server...
start "NoPaper Frontend" cmd /k "cd /d %~dp0 && start-frontend.bat"
echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Both servers are starting in separate windows...
echo Press any key to exit this window (servers will keep running)
pause >nul

