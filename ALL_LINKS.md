# 🔗 NoPaper Application - All Links

## 🌐 Main Application URLs

### Frontend (User Interface)
- **Main Application**: http://localhost:3000
- **Login/Register Page**: http://localhost:3000/login
- **User Dashboard**: http://localhost:3000/user
- **Admin Dashboard**: http://localhost:3000/admin

### Backend API
- **API Base URL**: http://localhost:8000
- **API Root**: http://localhost:8000/
- **Health Check**: http://localhost:8000/ (returns JSON status)

---

## 📚 API Documentation

- **Swagger UI**: http://localhost:8000/docs
  - Interactive API documentation
  - Test endpoints directly from browser
  
- **ReDoc**: http://localhost:8000/redoc
  - Alternative API documentation format
  - Clean, readable documentation

---

## 🔌 API Endpoints

### Authentication Endpoints
- **POST** `/register` - Register a new user
  - URL: http://localhost:8000/register
  - Body: `{"email": "user@example.com", "password": "password123"}`

- **POST** `/login` - Login user
  - URL: http://localhost:8000/login
  - Body: `{"email": "user@example.com", "password": "password123"}`

### Book Endpoints
- **GET** `/books` - List all books (Public)
  - URL: http://localhost:8000/books
  - No authentication required

- **GET** `/books/{book_id}/download` - Download purchased book PDF
  - URL: http://localhost:8000/books/1/download
  - Requires: Bearer token in Authorization header
  - Example: http://localhost:8000/books/1/download

### Purchase Endpoints
- **POST** `/buy` - Purchase a book
  - URL: http://localhost:8000/buy
  - Requires: Bearer token
  - Body: `{"book_id": 1}`

### Admin Endpoints
- **POST** `/admin/books` - Upload a new book (Admin only)
  - URL: http://localhost:8000/admin/books
  - Requires: Admin Bearer token
  - Body: Form data with `title`, `author`, `price`, `description`, `pdf` file

---

## 🧪 Quick Test Links

### Test Backend is Running
```
http://localhost:8000/
```
Expected response: `{"message": "Online Book Shop API running"}`

### Test Books Endpoint
```
http://localhost:8000/books
```
Expected response: JSON array of books (may be empty initially)

### Test API Documentation
```
http://localhost:8000/docs
```
Should show Swagger UI interface

---

## 📱 Access from Other Devices on Same Network

If you want to access from your phone or another computer on the same network:

1. **Find your local IP address:**
   ```powershell
   ipconfig
   ```
   Look for IPv4 Address (e.g., 192.168.1.100)

2. **Access using IP instead of localhost:**
   - Frontend: http://192.168.1.100:3000
   - Backend: http://192.168.1.100:8000
   - API Docs: http://192.168.1.100:8000/docs

**Note:** Make sure Windows Firewall allows connections on ports 3000 and 8000

---

## ✅ Status Check

Run the status check script to verify everything is running:

**PowerShell:**
```powershell
.\check-status.ps1
```

**Command Prompt:**
```cmd
check-status.bat
```

Or manually check:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

---

## 🚀 Quick Start Commands

### Start Both Servers
```powershell
.\start-all.ps1
```
or
```cmd
start-all.bat
```

### Check Status
```powershell
.\check-status.ps1
```

---

## 📝 Notes

- All URLs use `localhost` by default
- Backend runs on port **8000**
- Frontend runs on port **3000**
- If ports are in use, React will automatically try 3001, 3002, etc.
- Backend port can be changed in the startup command

---

**All set! Your application should be accessible at these URLs! 🎉**

