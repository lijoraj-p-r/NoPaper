# How to Run NoPaper - Quick Start Guide

## 🚀 Quick Start (Easiest Method)

### Option 1: Using Scripts (Recommended)

**Windows PowerShell:**
```powershell
.\start-all.ps1
```

**Windows Command Prompt:**
```cmd
start-all.bat
```

This will automatically start both backend and frontend servers!

---

## 📝 Manual Start (Step by Step)

### Step 1: Start Backend Server

1. Open a terminal/command prompt
2. Navigate to backend directory:
   ```bash
   cd backend
   ```

3. Activate virtual environment:
   ```powershell
   # PowerShell
   ..\venv\Scripts\Activate.ps1
   
   # OR Command Prompt
   ..\venv\Scripts\activate.bat
   ```

4. Start the server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   ✅ Backend will be running at: `http://localhost:8000`

### Step 2: Start Frontend Server

1. Open a **NEW** terminal/command prompt
2. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

3. Start the React app:
   ```bash
   npm start
   ```

   ✅ Frontend will automatically open at: `http://localhost:3000`

---

## 🌐 Access the Application

Once both servers are running:

- **Frontend (Main App)**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## ⚠️ Important Notes

### First Time Setup (Only Once)

If this is your first time running the project:

1. **Install Backend Dependencies:**
   ```bash
   cd backend
   ..\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Setup Database:**
   - Make sure MySQL is running
   - Create database: `CREATE DATABASE online_bookshop;`
   - Update credentials in `backend/db.py` if needed

### Prerequisites

- ✅ Python 3.14+ installed
- ✅ Node.js 14+ and npm installed
- ✅ MySQL server running
- ✅ Virtual environment created (in `venv/` folder)

### Troubleshooting

**Backend not starting?**
- Check if MySQL is running
- Verify database credentials in `backend/db.py`
- Make sure virtual environment is activated

**Frontend not starting?**
- Run `npm install` in the frontend folder
- Check if port 3000 is available

**Port already in use?**
- Backend: Change port in command: `--port 8001`
- Frontend: It will ask to use a different port automatically

---

## 📌 Quick Commands Reference

```bash
# Start both servers (PowerShell)
.\start-all.ps1

# Start both servers (Command Prompt)
start-all.bat

# Start backend only
.\start-backend.ps1
# OR
start-backend.bat

# Start frontend only
.\start-frontend.ps1
# OR
start-frontend.bat
```

---

**That's it! Happy coding! 🎉**

