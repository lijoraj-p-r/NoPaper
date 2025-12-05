# 🚀 Start NoPaper Locally

## Quick Start

### Option 1: Use the Startup Scripts (Easiest)

1. **Double-click** `start-all.ps1` in the root folder
   - This will open two PowerShell windows
   - One for backend, one for frontend

2. Wait for both servers to start (about 10-30 seconds)

3. Open your browser:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

### Option 2: Manual Start

#### Step 1: Start Backend

1. Open PowerShell in the project root
2. Run:
   ```powershell
   cd backend
   ..\venv\Scripts\Activate.ps1
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Step 2: Start Frontend (New Terminal)

1. Open a **new** PowerShell window
2. Run:
   ```powershell
   cd frontend
   npm start
   ```

3. The browser should automatically open to http://localhost:3000

---

## Prerequisites Check

### ✅ Before Starting:

1. **MySQL Server Running**
   - Make sure MySQL is installed and running
   - Default credentials: `root` / `lijo`
   - Database: `online_bookshop` (will be created automatically)

2. **Python Virtual Environment**
   - Already set up in `venv/` folder
   - Dependencies installed

3. **Node.js Installed**
   - Frontend dependencies need to be installed: `npm install` in `frontend/` folder

---

## Troubleshooting

### Backend Won't Start

**Database Connection Error:**
```
- Check if MySQL is running
- Verify credentials in backend/db.py match your MySQL setup
- Ensure database 'online_bookshop' exists or can be created
```

**Port Already in Use:**
```
- Change port: uvicorn main:app --reload --port 8001
- Update frontend config.js to use new port
```

### Frontend Won't Start

**Port 3000 Already in Use:**
```
- React will automatically try port 3001, 3002, etc.
- Or set PORT environment variable: $env:PORT=3001
```

**Module Not Found:**
```
cd frontend
npm install
```

### Can't Connect Frontend to Backend

- Verify backend is running on http://localhost:8000
- Check browser console for CORS errors
- Ensure CORS_ORIGINS in backend includes http://localhost:3000

---

## Access URLs

Once running:
- **Frontend App**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc

---

## Stop Servers

- Press `Ctrl+C` in each terminal window
- Or close the PowerShell windows

---

## First Time Setup

If this is your first time running:

1. **Create Database** (if not exists):
   ```sql
   CREATE DATABASE online_bookshop;
   ```

2. **Install Frontend Dependencies**:
   ```powershell
   cd frontend
   npm install
   ```

3. **Verify Backend Dependencies**:
   ```powershell
   cd backend
   ..\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

---

**Happy Coding! 🎉**


