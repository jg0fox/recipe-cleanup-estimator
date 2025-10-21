# Deployment Guide - Recipe Cleanup Time Estimator

This guide will walk you through deploying the app to production using Railway (backend) and Vercel (frontend).

## Prerequisites

- GitHub account (for both Railway and Vercel)
- Git installed locally

## Part 1: Push Code to GitHub

### 1. Initialize Git Repository

```bash
cd /Users/jfox/Documents/realtime
git init
git add .
git commit -m "Initial commit - Recipe Cleanup Time Estimator"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Name it `recipe-cleanup-estimator`
3. Don't initialize with README (we already have one)
4. Click "Create repository"

### 3. Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/recipe-cleanup-estimator.git
git branch -M main
git push -u origin main
```

## Part 2: Deploy Backend to Railway

### 1. Sign Up for Railway

1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign in with GitHub

### 2. Deploy Backend

1. Click "New Project" → "Deploy from GitHub repo"
2. Select your `recipe-cleanup-estimator` repository
3. Railway will ask which folder to deploy
   - Click "Add variables" or "Settings"
   - Set **Root Directory**: `backend`

### 3. Configure Environment

Railway should auto-detect Node.js. If needed, add these settings:

**Environment Variables** (Settings → Variables):
```
NODE_ENV=production
PORT=3000
```

**Build Command**: (should auto-detect, but if needed)
```
npm install
```

**Start Command**: (should auto-detect, but if needed)
```
npm start
```

### 4. Get Backend URL

1. Once deployed, Railway will give you a public URL like:
   `https://your-app-name.up.railway.app`
2. **Copy this URL** - you'll need it for the frontend!

### 5. Test Backend

Visit: `https://your-app-name.up.railway.app`

You should see:
```json
{
  "message": "Recipe Cleanup Time Estimator API",
  "version": "1.0.0",
  "status": "running"
}
```

## Part 3: Deploy Frontend to Vercel

### 1. Sign Up for Vercel

1. Go to https://vercel.com
2. Click "Start Deploying"
3. Sign up with GitHub

### 2. Import Project

1. Click "Add New..." → "Project"
2. Import your `recipe-cleanup-estimator` repository
3. Configure the project:

**Framework Preset**: Vite

**Root Directory**: `frontend`

**Build Command**: `npm run build` (should auto-fill)

**Output Directory**: `dist` (should auto-fill)

**Install Command**: `npm install` (should auto-fill)

### 3. Add Environment Variable

⚠️ **IMPORTANT**: Before clicking "Deploy", add this environment variable:

**Key**: `VITE_API_URL`
**Value**: `https://your-backend-url.up.railway.app` (from Step 2.4)

Example:
```
VITE_API_URL=https://recipe-cleanup-production.up.railway.app
```

### 4. Deploy

Click "Deploy"

Vercel will build and deploy your frontend in ~2 minutes.

### 5. Get Frontend URL

Once deployed, Vercel gives you a URL like:
`https://recipe-cleanup-estimator.vercel.app`

## Part 4: Update CORS Settings

### 1. Update Backend CORS

The backend needs to allow requests from your Vercel frontend.

**Option A: Via Railway Dashboard**
1. Go to your Railway project
2. Click "Variables"
3. Add:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```

**Option B: Update server.js** (recommended)

Edit `backend/server.js`:
```javascript
// Update the cors configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

Then commit and push:
```bash
git add backend/server.js
git commit -m "Update CORS for production"
git push
```

Railway will auto-redeploy.

## Part 5: Test Production Deployment

### 1. Visit Your App

Go to: `https://your-app.vercel.app`

### 2. Test Full Flow

1. Paste a recipe URL: `https://www.allrecipes.com/recipe/16354/easy-meatloaf/`
2. Click "Analyze Recipe"
3. Verify you get cleanup time results
4. Try submitting feedback

### 3. Check for Errors

If something doesn't work:

**Frontend Errors:**
- Open browser DevTools (F12) → Console tab
- Look for network errors or API errors

**Backend Errors:**
- Go to Railway dashboard → Your project → "Deployments" → "View Logs"

## Common Issues & Solutions

### Issue: Frontend can't reach backend

**Solution:**
1. Check VITE_API_URL in Vercel is correct
2. Check CORS is configured in backend
3. Verify backend is running on Railway

### Issue: "Network Error" when analyzing recipe

**Solution:**
1. Open browser DevTools → Network tab
2. Try analyzing again
3. Check the failing request
4. Verify the URL includes your Railway backend URL

### Issue: Backend keeps restarting

**Solution:**
1. Check Railway logs for errors
2. Verify all dependencies are in package.json
3. Ensure PORT environment variable is set

### Issue: Database errors in production

**Solution:**
Railway's filesystem is ephemeral. For production, you should:
1. Add Railway's PostgreSQL database
2. Update database.js to use PostgreSQL
3. OR: Use Railway's persistent volumes

## Environment Variables Summary

### Backend (Railway)
```
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.up.railway.app
```

## Update Your Deployed App

Whenever you make changes:

```bash
git add .
git commit -m "Your update message"
git push
```

Both Railway and Vercel will automatically redeploy!

## Custom Domains (Optional)

### For Frontend (Vercel):
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration steps

### For Backend (Railway):
1. Go to Project Settings → Domains
2. Add custom domain
3. Update VITE_API_URL in Vercel to new domain

## Monitoring & Logs

### Railway (Backend)
- Dashboard → Your Project → "Deployments"
- Click "View Logs" to see real-time logs
- Monitor resource usage

### Vercel (Frontend)
- Dashboard → Your Project → "Deployments"
- Click deployment → "Logs" to see build logs
- Analytics tab shows usage stats

## Cost Estimates

- **Railway Free Tier**: $5 free credit monthly, ~500 hours
- **Vercel Free Tier**: Unlimited personal projects
- **Total**: **$0/month** for personal use

## Next Steps After Deployment

1. ✅ Share the Vercel URL with your friend
2. 📊 Monitor usage in Railway/Vercel dashboards
3. 🐛 Check logs if users report issues
4. 🔄 Push updates and they'll auto-deploy
5. 💾 Consider adding PostgreSQL if you get lots of traffic

## Support

If you run into issues:
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Check the logs first!

---

**Your Production URLs:**
- Frontend: `https://[your-app].vercel.app`
- Backend: `https://[your-app].up.railway.app`

Share the frontend URL with your friends to test! 🚀
