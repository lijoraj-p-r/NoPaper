# NoPaper - Online Book Shop

A full-stack digital book marketplace application that allows users to browse, purchase, and download PDF books. Administrators can upload new books to the platform.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Configuration](#configuration)
- [File Paths](#file-paths)

## 🎯 Project Overview

NoPaper is a digital book marketplace built with a modern tech stack. The application provides:
- **User Portal**: Browse books, make purchases, and download purchased PDFs
- **Admin Portal**: Upload new books with PDF files, manage inventory
- **Authentication**: Secure login/registration with role-based access control
- **Order Management**: Track purchases and manage downloads

## 🛠 Technology Stack

### Backend
- **Python 3.14+**
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** (< 2.0) - ORM for database operations
- **PyMySQL** - MySQL database connector
- **Python-JOSE** - JWT token handling
- **Passlib** - Password hashing (bcrypt)
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **Python-multipart** - File upload handling

### Frontend
- **React 19.2.1** - UI library
- **React Router DOM 7.10.0** - Client-side routing
- **Axios 1.13.2** - HTTP client for API calls
- **React Scripts 5.0.1** - Build tooling

### Database
- **MySQL** - Relational database management system

## 📁 Project Structure

```
NoPaper/
├── backend/                    # Python FastAPI backend
│   ├── __pycache__/           # Python cache files
│   ├── db.py                  # Database configuration and session management
│   ├── main.py                # FastAPI application and API endpoints
│   ├── models.py              # SQLAlchemy database models
│   ├── requirements.txt       # Python dependencies
│   └── uploads/               # Uploaded PDF files storage
│       └── pdfs/              # PDF book files directory
│
├── frontend/                   # React frontend application
│   ├── node_modules/          # Node.js dependencies
│   ├── public/                # Static public files
│   │   ├── favicon.ico
│   │   ├── index.html         # HTML template
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/                   # React source code
│   │   ├── App.js             # Main app component with routing
│   │   ├── App.css            # App styles
│   │   ├── index.js           # React entry point
│   │   ├── index.css          # Global styles
│   │   ├── logo.svg
│   │   ├── pages/             # Page components
│   │   │   ├── LoginPage.js   # Login/Registration page
│   │   │   ├── LoginPage.css
│   │   │   ├── UserDashboard.js    # User portal
│   │   │   ├── UserDashboard.css
│   │   │   ├── AdminDashboard.js   # Admin portal
│   │   │   └── AdminDashboard.css
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── package.json           # Node.js dependencies and scripts
│   └── package-lock.json      # Dependency lock file
│
├── venv/                      # Python virtual environment
│   ├── Scripts/               # Virtual environment scripts
│   └── Lib/                   # Installed Python packages
│
└── README.md                  # This file
```

## ✨ Features

### User Features
- User registration and authentication
- Browse available books
- Purchase books
- Download purchased PDF books
- View book details (title, author, price, description)

### Admin Features
- Admin authentication
- Upload new books with PDF files
- Set book details (title, author, price, description)
- Manage book inventory

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (user/admin)
- Protected API endpoints
- Secure file downloads (only for purchased books)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Python 3.14+** - [Download Python](https://www.python.org/downloads/)
2. **Node.js 14+** and **npm** - [Download Node.js](https://nodejs.org/)
3. **MySQL Server** - [Download MySQL](https://dev.mysql.com/downloads/mysql/)
4. **Git** (optional) - For version control

## 🚀 Setup Instructions

### 1. Database Setup

1. Install and start MySQL server
2. Create a new database:
   ```sql
   CREATE DATABASE online_bookshop;
   ```
3. Note your MySQL credentials:
   - Username (default: `root`)
   - Password
   - Host (default: `localhost`)
   - Port (default: `3306`)

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (if not already created):
   ```bash
   # Windows
   python -m venv ../venv
   
   # macOS/Linux
   python3 -m venv ../venv
   ```

3. Activate the virtual environment:
   ```bash
   # Windows PowerShell
   ..\venv\Scripts\Activate.ps1
   
   # Windows Command Prompt
   ..\venv\Scripts\activate.bat
   
   # macOS/Linux
   source ../venv/bin/activate
   ```

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Configure database connection:
   - Option 1: Set environment variables:
     ```bash
     # Windows PowerShell
     $env:MYSQL_USER="root"
     $env:MYSQL_PASSWORD="your_password"
     $env:MYSQL_HOST="localhost"
     $env:MYSQL_PORT="3306"
     $env:MYSQL_DB="online_bookshop"
     
     # macOS/Linux
     export MYSQL_USER="root"
     export MYSQL_PASSWORD="your_password"
     export MYSQL_HOST="localhost"
     export MYSQL_PORT="3306"
     export MYSQL_DB="online_bookshop"
     ```
   
   - Option 2: Edit `backend/db.py` directly (default values are already set):
     ```python
     MYSQL_USER = "root"
     MYSQL_PASSWORD = "your_password"
     MYSQL_HOST = "localhost"
     MYSQL_PORT = "3306"
     MYSQL_DB = "online_bookshop"
     ```

6. Create a `.env` file in the backend directory (optional, for better security):
   ```
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_DB=online_bookshop
   ```

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

## ▶️ Running the Application

### Start the Backend Server

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Activate the virtual environment (if not already activated):
   ```bash
   # Windows PowerShell
   ..\venv\Scripts\Activate.ps1
   
   # Windows Command Prompt
   ..\venv\Scripts\activate.bat
   
   # macOS/Linux
   source ../venv/bin/activate
   ```

3. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

   The backend API will be available at: `http://localhost:8000`
   - API documentation: `http://localhost:8000/docs` (Swagger UI)
   - Alternative docs: `http://localhost:8000/redoc`

### Start the Frontend Development Server

1. Open a **new terminal** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Start the React development server:
   ```bash
   npm start
   ```

   The frontend application will automatically open in your browser at: `http://localhost:3000`

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔌 API Endpoints

### Authentication
- `POST /register` - Register a new user
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Returns: JWT token and user role

- `POST /login` - Login user
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Returns: JWT token and user role

### Books
- `GET /books` - List all available books (public)
  - Returns: Array of book objects

- `GET /books/{book_id}/download` - Download purchased book PDF
  - Headers: `Authorization: Bearer <token>`
  - Returns: PDF file

### Admin
- `POST /admin/books` - Upload a new book (admin only)
  - Headers: `Authorization: Bearer <admin_token>`
  - Body: Form data with `title`, `author`, `price`, `description`, `pdf` (file)

### Purchases
- `POST /buy` - Purchase a book
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "book_id": 1 }`
  - Returns: Purchase confirmation

## 🗄️ Database Schema

### Users Table
- `id` (Integer, Primary Key)
- `email` (String, Unique, Indexed)
- `password_hash` (String)
- `role` (String) - 'user' or 'admin'
- `created_at` (DateTime)

### Books Table
- `id` (Integer, Primary Key)
- `title` (String)
- `author` (String)
- `price` (Numeric)
- `description` (Text, Optional)
- `cover_url` (Text, Optional)
- `pdf_path` (String) - Path to PDF file
- `created_at` (DateTime)

### Orders Table
- `id` (Integer, Primary Key)
- `user_id` (Integer, Foreign Key → users.id)
- `total` (Numeric)
- `status` (String) - Default: 'paid'
- `created_at` (DateTime)

### Order Items Table
- `id` (Integer, Primary Key)
- `order_id` (Integer, Foreign Key → orders.id)
- `book_id` (Integer, Foreign Key → books.id)
- `quantity` (Integer)
- `price_each` (Numeric)

## ⚙️ Configuration

### Backend Configuration

**Database Configuration** (`backend/db.py`):
- Default MySQL user: `root`
- Default MySQL password: `lijo`
- Default MySQL host: `localhost`
- Default MySQL port: `3306`
- Default database: `online_bookshop`

**Security Configuration** (`backend/main.py`):
- JWT Secret Key: `CHANGE_ME_TO_A_RANDOM_SECRET` (⚠️ Change in production!)
- Token expiration: 60 minutes
- CORS allowed origin: `http://localhost:3000`

**File Upload Configuration**:
- Upload directory: `backend/uploads/pdfs/`
- Allowed file type: PDF only

### Frontend Configuration

**API Configuration** (`frontend/src/pages/*.js`):
- API URL: `http://localhost:8000`
- Default port: `3000`

## 📂 File Paths

### Backend Files
- `backend/db.py` - Database connection and session management
- `backend/main.py` - FastAPI application, routes, and business logic
- `backend/models.py` - SQLAlchemy ORM models (User, Book, Order, OrderItem)
- `backend/requirements.txt` - Python package dependencies
- `backend/uploads/pdfs/` - Storage directory for uploaded PDF files

### Frontend Files
- `frontend/src/App.js` - Main React component with routing logic
- `frontend/src/pages/LoginPage.js` - Login and registration page
- `frontend/src/pages/UserDashboard.js` - User portal for browsing and purchasing books
- `frontend/src/pages/AdminDashboard.js` - Admin portal for uploading books
- `frontend/package.json` - Node.js dependencies and scripts
- `frontend/public/index.html` - HTML template

## 🔐 Security Notes

⚠️ **Important Security Considerations:**

1. **Change JWT Secret Key**: Update `SECRET_KEY` in `backend/main.py` before deploying to production
2. **Environment Variables**: Use `.env` files for sensitive configuration (database credentials)
3. **Password Security**: Passwords are hashed using bcrypt before storage
4. **CORS**: Currently configured for `localhost:3000` - update for production deployment
5. **File Upload**: Validate file types and sizes in production
6. **HTTPS**: Use HTTPS in production for secure communication

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error:**
- Verify MySQL server is running
- Check database credentials in `backend/db.py`
- Ensure database `online_bookshop` exists

**Module Not Found Error:**
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again

**Port Already in Use:**
- Change port: `uvicorn main:app --reload --port 8001`

### Frontend Issues

**Cannot Connect to API:**
- Verify backend server is running on `http://localhost:8000`
- Check CORS configuration in `backend/main.py`

**npm Install Fails:**
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

## 📝 Notes

- The database tables are automatically created on first run via SQLAlchemy's `Base.metadata.create_all()`
- Default user role is 'user' - admin accounts must be created manually in the database
- PDF files are stored with timestamp prefixes to avoid naming conflicts
- The application uses JWT tokens stored in localStorage for authentication

## 📄 License

This project is provided as-is for educational and development purposes.

---

**Happy Reading! 📚**

