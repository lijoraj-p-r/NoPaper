<img width="1366" height="768" alt="Screenshot (742)" src="https://github.com/user-attachments/assets/9cfba626-f730-4b10-b13e-490d7b65067e" />

# NoPaper - Digital Book Marketplace

A modern full-stack digital book marketplace application that allows users to browse, purchase, and download PDF books. Features include UPI payment integration, email notifications, dark/light mode, and a comprehensive admin dashboard.

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
- [Authentication](#authentication)
- [Payment Integration](#payment-integration)
- [UI/UX Features](#uiux-features)

## 🎯 Project Overview

NoPaper is a digital book marketplace built with modern technologies. The application provides:

- **Public Book Browsing**: Anyone can view available books without login
- **User Portal**: Browse books, make purchases via UPI, and download purchased PDFs
- **Admin Portal**: Upload new books, manage inventory, view statistics and orders
- **Authentication**: Simple email/password authentication with role-based access
- **Payment System**: UPI payment integration with email notifications
- **Modern UI**: Dark/light mode toggle, responsive design, luxury theme

## 🛠 Technology Stack

### Backend
- **Python 3.14+**
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** (< 2.0) - ORM for database operations
- **PyMySQL** - MySQL database connector
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **Python-multipart** - File upload handling
- **smtplib** - Email notifications

### Frontend
- **React 19.2.1** - UI library
- **React Router DOM 7.10.0** - Client-side routing
- **Axios 1.13.2** - HTTP client for API calls
- **React Context API** - State management (Auth, Theme)
- **React Scripts 5.0.1** - Build tooling

### Database
- **MySQL** - Relational database management system

## 📁 Project Structure

```
NoPaper/
├── backend/                    # Python FastAPI backend
│   ├── __init__.py            # Python package marker
│   ├── db.py                  # Database configuration and session management
│   ├── main.py                # FastAPI application and API endpoints
│   ├── models.py              # SQLAlchemy database models
│   ├── requirements.txt       # Python dependencies
│   └── uploads/               # Uploaded PDF files storage
│       └── pdfs/              # PDF book files directory
│
├── frontend/                   # React frontend application
│   ├── public/                # Static public files
│   │   ├── index.html         # HTML template
│   │   └── ...
│   ├── src/                   # React source code
│   │   ├── App.js             # Main app component with routing
│   │   ├── App.css            # App styles
│   │   ├── index.js           # React entry point
│   │   ├── index.css          # Global styles
│   │   ├── config.js          # API configuration
│   │   ├── AuthContext.js     # Authentication context provider
│   │   ├── ThemeContext.js    # Theme context provider
│   │   ├── pages/             # Page components
│   │   │   ├── LoginPage.js   # Login/Registration page
│   │   │   ├── LoginPage.css
│   │   │   ├── UserDashboard.js    # User portal
│   │   │   ├── UserDashboard.css
│   │   │   ├── AdminDashboard.js   # Admin portal
│   │   │   ├── AdminDashboard.css
│   │   │   ├── AboutUs.js          # About Us page
│   │   │   └── AboutUs.css
│   │   └── components/        # Reusable components
│   │       ├── Footer.js      # Footer component
│   │       ├── Footer.css
│   │       ├── PaymentModal.js # Payment modal component
│   │       └── PaymentModal.css
│   ├── package.json           # Node.js dependencies and scripts
│   └── package-lock.json      # Dependency lock file
│
├── venv/                      # Python virtual environment
├── start-backend.ps1          # PowerShell script to start backend
├── start-frontend.ps1         # PowerShell script to start frontend
├── start-all.ps1              # PowerShell script to start both servers
├── start-backend.bat           # Batch script to start backend
├── start-frontend.bat          # Batch script to start frontend
├── start-all.bat               # Batch script to start both servers
└── README.md                  # This file
```

## ✨ Features

### User Features
- **Public Book Browsing**: View all available books without login
- **User Registration & Authentication**: Simple email/password authentication
- **Book Purchase**: Purchase books via UPI payment integration
- **Payment Flow**: 
  - UPI deep link generation
  - Payment verification
  - Automatic email notifications on successful payment
- **Download Purchased Books**: Download PDF files for purchased books
- **Dark/Light Mode**: Toggle between themes
- **About Us Page**: Learn about the company and contact information

### Admin Features
- **Admin Authentication**: Role-based access control
- **Book Management**: 
  - Upload new books with PDF files
  - Set book details (title, author, price, description)
  - View all books with purchase statistics
- **Order Management**: 
  - View all purchases
  - Track order status (pending, paid, failed)
  - View order details (user, books, amount, date)
- **Dashboard Statistics**: 
  - Total books count
  - Total users count
  - Total orders count
  - Total revenue
  - Recent purchases table
- **Dark/Light Mode**: Toggle between themes

### UI/UX Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Universal theme toggle on all pages
- **Modern Luxury Theme**: Clean, elegant design
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: User-friendly error messages
- **Payment Modal**: Intuitive payment flow with UPI integration
- **Footer**: Copyright notice on all pages

### Security Features
- **Simple Authentication**: Email/password based authentication
- **Role-Based Access Control**: User and admin roles
- **Protected API Endpoints**: Authentication required for purchases and downloads
- **Secure File Downloads**: Only purchased books can be downloaded

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

5. Configure database connection in `backend/db.py`:
   ```python
   MYSQL_USER = os.getenv("MYSQL_USER", "root")
   MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "your_password")
   MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
   MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
   MYSQL_DB = os.getenv("MYSQL_DB", "online_bookshop")
   ```

6. Configure email settings in `backend/main.py` (for payment notifications):
   ```python
   SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
   SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
   EMAIL_USER = os.getenv("EMAIL_USER", "your_email@gmail.com")
   EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "your_app_password")
   ADMIN_EMAIL = "your_email@gmail.com"
   UPI_ID = "your_upi_id@okaxis"
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

3. Configure API URL in `frontend/src/config.js` (optional):
   ```javascript
   export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
   ```

## ▶️ Running the Application

### Option 1: Using Scripts (Recommended)

**Windows PowerShell:**
```powershell
# Start both servers
.\start-all.ps1

# Or start individually
.\start-backend.ps1
.\start-frontend.ps1
```

**Windows Command Prompt:**
```cmd
# Start both servers
start-all.bat

# Or start individually
start-backend.bat
start-frontend.bat
```

### Option 2: Manual Start

**Start the Backend Server:**

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Activate the virtual environment:
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
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The backend API will be available at: `http://localhost:8000`
   - API documentation: `http://localhost:8000/docs` (Swagger UI)
   - Alternative docs: `http://localhost:8000/redoc`

**Start the Frontend Development Server:**

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
  - Returns: User role

- `POST /login` - Login user
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Returns: User role

### Books
- `GET /books` - List all available books (public, no auth required)
  - Returns: Array of book objects

- `GET /books/{book_id}/download` - Download purchased book PDF
  - Headers: `email: user@example.com`, `password: password123`
  - Returns: PDF file

### Purchases
- `POST /buy` - Purchase a book
  - Headers: `email: user@example.com`, `password: password123`
  - Body: `{ "book_id": 1 }`
  - Returns: Order details with UPI payment URL

- `POST /payment/verify` - Verify payment completion
  - Headers: `email: user@example.com`, `password: password123`
  - Query: `order_id=1&status=success`
  - Returns: Updated order status
  - Triggers: Email notification to admin

### Admin
- `GET /admin/books` - Get all books with statistics (admin only)
  - Headers: `email: admin@example.com`, `password: admin_password`

- `POST /admin/books` - Upload a new book (admin only)
  - Headers: `email: admin@example.com`, `password: admin_password`
  - Body: Form data with `title`, `author`, `price`, `description`, `pdf` (file)

- `GET /admin/orders` - Get all orders (admin only)
  - Headers: `email: admin@example.com`, `password: admin_password`

- `GET /admin/stats` - Get dashboard statistics (admin only)
  - Headers: `email: admin@example.com`, `password: admin_password`
  - Returns: Total books, users, orders, revenue

## 🗄️ Database Schema

### Users Table
- `id` (Integer, Primary Key)
- `email` (String, Unique, Indexed)
- `password_hash` (String) - Plain text password (as per requirements)
- `role` (String) - 'user' or 'admin'
- `created_at` (DateTime)

### Books Table
- `id` (Integer, Primary Key)
- `title` (String)
- `author` (String)
- `price` (Numeric)
- `description` (Text, Optional)
- `pdf_path` (String) - Path to PDF file
- `created_at` (DateTime)

### Orders Table
- `id` (Integer, Primary Key)
- `user_id` (Integer, Foreign Key → users.id)
- `total` (Numeric)
- `status` (String) - 'pending', 'paid', or 'failed'
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

**Email Configuration** (`backend/main.py`):
- SMTP Server: `smtp.gmail.com`
- SMTP Port: `587`
- Email User: Your Gmail address
- Email Password: Gmail App Password (not regular password)
- Admin Email: Email to receive payment notifications
- UPI ID: Your UPI ID for payments

**CORS Configuration**:
- Allowed origin: `http://localhost:3000`
- Update for production deployment

**File Upload Configuration**:
- Upload directory: `backend/uploads/pdfs/`
- Allowed file type: PDF only

### Frontend Configuration

**API Configuration** (`frontend/src/config.js`):
- API URL: `http://localhost:8000`
- Default port: `3000`

**Environment Variables** (optional):
- `REACT_APP_API_URL`: Backend API URL (defaults to `http://localhost:8000`)

## 🔐 Authentication

The application uses simple email/password authentication:

1. **Registration**: Users can register with email and password (minimum 7 characters)
2. **Login**: Users login with email and password
3. **Authentication**: Email and password are sent in request headers for protected endpoints
4. **Roles**: 
   - `user`: Can browse, purchase, and download books
   - `admin`: Can upload books, view statistics, and manage orders

**Creating an Admin User:**

Run this SQL query in your MySQL database:
```sql
INSERT INTO users (email, password_hash, role, created_at)
VALUES ('admin@example.com', 'your_password', 'admin', NOW());
```

## 💳 Payment Integration

### UPI Payment Flow

1. User clicks "Buy Now" on a book
2. System creates a pending order
3. UPI deep link is generated with payment details
4. User is redirected to UPI app for payment
5. After payment, user clicks "Payment Completed"
6. System verifies payment and updates order status
7. Email notification is sent to admin with payment details
8. User can now download the purchased book

### Email Notifications

When a payment is successfully verified, an email is automatically sent to the admin email with:
- Order ID
- User email
- Book title
- Amount paid
- Payment time
- Payment status

## 🎨 UI/UX Features

### Dark/Light Mode
- Universal theme toggle button on all pages
- Theme preference is saved in localStorage
- Smooth transitions between themes
- Theme variables for consistent styling

### Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Adaptive layouts for different devices

### User Experience
- Loading states for async operations
- Error messages with clear instructions
- Confirmation dialogs for important actions
- Smooth navigation between pages

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
- Change port: `uvicorn main:app --reload --host 0.0.0.0 --port 8001`

**Email Not Sending:**
- Verify SMTP credentials
- For Gmail, use App Password (not regular password)
- Check firewall settings

### Frontend Issues

**Cannot Connect to API:**
- Verify backend server is running on `http://localhost:8000`
- Check CORS configuration in `backend/main.py`
- Verify API_URL in `frontend/src/config.js`

**npm Install Fails:**
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

**Theme Not Working:**
- Clear browser cache
- Check browser console for errors
- Verify ThemeContext is properly wrapped in App.js

## 📝 Notes

- The database tables are automatically created on first run via SQLAlchemy's `Base.metadata.create_all()`
- Default user role is 'user' - admin accounts must be created manually in the database
- PDF files are stored with timestamp prefixes to avoid naming conflicts
- The application uses email/password in headers for authentication
- Passwords are stored as plain text (as per requirements)
- UPI payment requires manual verification by the user
- Email notifications require proper SMTP configuration

## 📄 License

This project is provided as-is for educational and development purposes.

---

**Happy Reading! 📚**
