# 🚀 Quick Deployment Guide

## Fastest Way to Go Live (5 minutes)

### Step 1: Deploy Backend to Railway

1. Go to https://railway.app and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `NoPaper` repository
4. Click on the service → Settings → Root Directory → Set to `backend`
5. Add MySQL database: Click "New" → "Database" → "MySQL"
6. Go to Variables tab and add:
   ```
   MYSQL_USER=${{MySQL.MYSQLUSER}}
   MYSQL_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   MYSQL_HOST=${{MySQL.MYSQLHOST}}
   MYSQL_PORT=${{MySQL.MYSQLPORT}}
   MYSQL_DB=${{MySQL.MYSQLDATABASE}}
   SECRET_KEY=<generate-random-string-here>
   CORS_ORIGINS=http://localhost:3000
   ```
7. Copy your backend URL (e.g., `https://your-app.up.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New" → "Project"
3. Import your `NoPaper` repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
5. Add Environment Variable:
   ```
   REACT_APP_API_URL=<your-railway-backend-url>
   ```
6. Click "Deploy"
7. Copy your frontend URL (e.g., `https://your-app.vercel.app`)

### Step 3: Update Backend CORS

1. Go back to Railway → Your backend service → Variables
2. Update `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=https://your-app.vercel.app,http://localhost:3000
   ```
3. Railway will automatically redeploy

### Step 4: Test Your App

1. Visit your frontend URL
2. Register a new account
3. Test the application!

---

## 🎯 That's it! Your app is now live!

**Backend URL**: `https://your-app.up.railway.app`  
**Frontend URL**: `https://your-app.vercel.app`

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

