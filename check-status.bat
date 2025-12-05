@echo off
echo.
echo ========================================
echo   NoPaper Application Status Check
echo ========================================
echo.

echo Checking Backend Server...
curl -s http://localhost:8000 >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Backend: ONLINE
) else (
    echo [FAIL] Backend: OFFLINE
)

echo.
echo Checking Frontend Server...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Frontend: ONLINE
) else (
    echo [FAIL] Frontend: OFFLINE
)

echo.
echo ========================================
echo   Application Links
echo ========================================
echo.
echo Frontend Application:
echo   http://localhost:3000
echo.
echo Backend API:
echo   http://localhost:8000
echo.
echo API Documentation:
echo   http://localhost:8000/docs
echo   http://localhost:8000/redoc
echo.
echo ========================================
echo.
pause

