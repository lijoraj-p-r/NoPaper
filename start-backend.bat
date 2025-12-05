@echo off
echo Starting Backend Server...
cd backend
call ..\venv\Scripts\activate.bat
echo.
echo ========================================
echo   Backend Server Starting...
echo ========================================
echo Backend URL: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo ========================================
echo.
uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause

