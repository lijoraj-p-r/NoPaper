# Deployment Guide for NoPaper

This guide will help you deploy the NoPaper application online. We'll deploy the backend and frontend separately for better scalability.

## 🚀 Quick Deployment Options

### Option 1: Railway (Backend) + Vercel (Frontend) - Recommended
- **Backend**: Railway (Free tier available)
- **Frontend**: Vercel (Free tier available)
- **Database**: Railway MySQL or external MySQL service

### Option 2: Render (Full Stack)
- **Backend**: Render Web Service
- **Frontend**: Render Static Site
- **Database**: Render PostgreSQL (or external MySQL)

---

## 📦 Backend Deployment

### Deploy to Railway

1. **Sign up/Login to Railway**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `NoPaper` repository
   - Select the `backend` folder as the root

3. **Add MySQL Database**
   - Click "New" → "Database" → "MySQL"
   - Railway will automatically provide connection variables

4. **Set Environment Variables**
   Go to your service → Variables tab and add:
   ```
   MYSQL_USER=<from Railway MySQL>
   MYSQL_PASSWORD=<from Railway MySQL>
   MYSQL_HOST=<from Railway MySQL>
   MYSQL_PORT=3306
   MYSQL_DB=railway
   SECRET_KEY=<generate a random secret key>
   CORS_ORIGINS=https://your-frontend-url.vercel.app,http://localhost:3000
   PORT=8000
   ```

5. **Deploy**
   - Railway will automatically detect Python and deploy
   - Your backend will be available at: `https://your-app-name.up.railway.app`

### Deploy to Render

1. **Sign up/Login to Render**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch

3. **Configure Service**
   - **Name**: `nopaper-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Add MySQL Database**
   - Click "New" → "PostgreSQL" (or use external MySQL)
   - Note the connection details

5. **Set Environment Variables**
   ```
   MYSQL_USER=<your-mysql-user>
   MYSQL_PASSWORD=<your-mysql-password>
   MYSQL_HOST=<your-mysql-host>
   MYSQL_PORT=3306
   MYSQL_DB=<your-database-name>
   SECRET_KEY=<generate-random-secret>
   CORS_ORIGINS=https://your-frontend-url.vercel.app
   PORT=10000
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - Your backend will be available at: `https://nopaper-backend.onrender.com`

---

## 🎨 Frontend Deployment

### Deploy to Vercel (Recommended)

1. **Sign up/Login to Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```
   (Replace with your actual backend URL)

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your frontend will be available at: `https://your-project.vercel.app`

### Deploy to Netlify

1. **Sign up/Login to Netlify**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Add New Site**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure Build Settings**
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `frontend/build`

4. **Set Environment Variables**
   Go to Site settings → Environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

5. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy automatically
   - Your frontend will be available at: `https://your-site.netlify.app`

---

## 🔧 Post-Deployment Configuration

### 1. Update CORS in Backend

After deploying frontend, update the backend `CORS_ORIGINS` environment variable:
```
CORS_ORIGINS=https://your-frontend-url.vercel.app,https://your-frontend-url.netlify.app,http://localhost:3000
```

### 2. Update Frontend API URL

Make sure your frontend has the correct backend URL in environment variables.

### 3. Create Admin User

You'll need to create an admin user manually in the database:

```sql
-- Connect to your MySQL database
-- Update the password hash (this is a bcrypt hash - use a password hasher tool)
UPDATE users SET role = 'admin' WHERE email = 'your-admin@email.com';
```

Or use Python to create an admin:
```python
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
password_hash = pwd_context.hash("your-admin-password")

# Then insert into database with role='admin'
```

---

## 📝 Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MYSQL_USER` | MySQL username | `root` |
| `MYSQL_PASSWORD` | MySQL password | `your_password` |
| `MYSQL_HOST` | MySQL host | `localhost` or database URL |
| `MYSQL_PORT` | MySQL port | `3306` |
| `MYSQL_DB` | Database name | `online_bookshop` |
| `SECRET_KEY` | JWT secret key | Generate random string |
| `CORS_ORIGINS` | Allowed frontend URLs (comma-separated) | `https://app.vercel.app,http://localhost:3000` |
| `PORT` | Server port (usually auto-set) | `8000` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://backend.railway.app` |

---

## 🔍 Troubleshooting

### Backend Issues

**Database Connection Failed:**
- Verify all MySQL environment variables are set correctly
- Check if database is accessible from your hosting provider
- Some providers use different port numbers

**CORS Errors:**
- Ensure `CORS_ORIGINS` includes your frontend URL
- Check for trailing slashes in URLs
- Verify HTTPS vs HTTP matches

**File Upload Issues:**
- Some platforms have ephemeral file systems
- Consider using cloud storage (AWS S3, Cloudinary) for production

### Frontend Issues

**API Connection Failed:**
- Verify `REACT_APP_API_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend is running and accessible

**Build Failures:**
- Check Node.js version compatibility
- Clear `node_modules` and rebuild
- Verify all dependencies are in `package.json`

---

## 🎯 Quick Start Commands

### Railway (Backend)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

---

## ✅ Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Database connected and tables created
- [ ] Environment variables set correctly
- [ ] CORS configured for frontend URL
- [ ] Frontend deployed and accessible
- [ ] Frontend API URL points to backend
- [ ] Test user registration/login
- [ ] Test admin functionality
- [ ] Test book upload/download
- [ ] HTTPS enabled (automatic on most platforms)

---

**Your app should now be live! 🎉**

