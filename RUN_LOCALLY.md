# 🚀 Run NoPaper Locally - Step by Step Guide

## ✅ Prerequisites Check

Before starting, make sure:
- ✅ MySQL Server is running (check: `Get-Service MySQL80`)
- ✅ Python virtual environment is set up
- ✅ Frontend dependencies installed (`npm install` in frontend folder)

---

## 🎯 Quick Start (Easiest Method)

### Option 1: Double-Click Script (Windows)

1. **Double-click** `start-all.bat` in the root folder
   - This opens two command windows
   - Backend in one window, Frontend in another
   - Wait 10-30 seconds for both to start

2. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Option 2: PowerShell Script

1. **Right-click** `start-all.ps1` → "Run with PowerShell"
   - Or open PowerShell and run: `.\start-all.ps1`

2. **Wait for servers to start** (10-30 seconds)

3. **Open browser** to http://localhost:3000

---

## 📋 Manual Start (If Scripts Don't Work)

### Step 1: Start Backend

Open PowerShell/Terminal:

```powershell
# Navigate to backend folder
cd backend

# Activate virtual environment
..\venv\Scripts\Activate.ps1

# Start backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**Backend URL:** http://localhost:8000  
**API Docs:** http://localhost:8000/docs

### Step 2: Start Frontend (New Terminal)

Open a **NEW** PowerShell/Terminal window:

```powershell
# Navigate to frontend folder
cd frontend

# Start frontend server
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view frontend in the browser.
  Local:            http://localhost:3000
```

**Frontend URL:** http://localhost:3000

The browser should automatically open. If not, manually go to http://localhost:3000

---

## 🔧 Troubleshooting

### Backend Won't Start

**Error: "ModuleNotFoundError: No module named 'db'"**
- Solution: Make sure you're in the `backend` folder when running uvicorn
- Or run: `cd backend` first

**Error: "Can't connect to MySQL"**
- Check MySQL is running: `Get-Service MySQL80`
- Verify credentials in `backend/db.py` match your MySQL setup
- Default: user=`root`, password=`lijo`, database=`online_bookshop`

**Error: "Port 8000 already in use"**
- Change port: `uvicorn main:app --reload --port 8001`
- Update frontend `config.js` to use new port

### Frontend Won't Start

**Error: "Port 3000 already in use"**
- React will automatically try 3001, 3002, etc.
- Or set: `$env:PORT=3001` then `npm start`

**Error: "Cannot find module"**
- Run: `cd frontend` then `npm install`

**Error: "Cannot connect to backend"**
- Verify backend is running on http://localhost:8000
- Check browser console for CORS errors
- Ensure backend CORS allows http://localhost:3000

### Database Issues

**Create database if it doesn't exist:**
```sql
CREATE DATABASE online_bookshop;
```

**Check MySQL connection:**
```powershell
cd backend
..\venv\Scripts\python.exe -c "from db import engine; print('Database OK')"
```

---

## 🌐 Access URLs

Once running:
- **Frontend App**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

---

## 🛑 Stop Servers

- Press `Ctrl+C` in each terminal window
- Or close the terminal windows

---

## ✅ Verification Checklist

- [ ] MySQL service is running
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can access http://localhost:8000/docs
- [ ] Can access http://localhost:3000
- [ ] Can register a new user
- [ ] Can login with registered user

---

## 📝 First Time Setup

If you haven't set up the project yet:

1. **Install Python dependencies:**
   ```powershell
   cd backend
   ..\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

2. **Install Frontend dependencies:**
   ```powershell
   cd frontend
   npm install
   ```

3. **Create MySQL database:**
   ```sql
   CREATE DATABASE online_bookshop;
   ```

4. **Verify MySQL credentials** in `backend/db.py`:
   - Default: user=`root`, password=`lijo`
   - Update if your MySQL uses different credentials

---

**Your app should now be running locally! 🎉**

If you encounter any issues, check the error messages in the terminal windows for specific problems.

