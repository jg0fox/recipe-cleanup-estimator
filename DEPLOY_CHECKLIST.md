# 🚀 Quick Deployment Checklist

Follow these steps to deploy your app to production in ~15 minutes.

## ✅ Step 1: Push to GitHub (5 minutes)

### 1.1 Create GitHub Repository
- Go to https://github.com/new
- Repository name: `recipe-cleanup-estimator`
- Make it **Public**
- **Don't** initialize with README
- Click "Create repository"

### 1.2 Push Your Code
```bash
# Already done: git init, git add ., git commit

# Add your GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/recipe-cleanup-estimator.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ Verify: Visit your GitHub repo and see all files

---

## ✅ Step 2: Deploy Backend to Railway (5 minutes)

### 2.1 Sign Up
- Go to https://railway.app
- Click "Login" → Sign in with GitHub
- Authorize Railway

### 2.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `recipe-cleanup-estimator`
4. Railway will start deploying - **WAIT, we need to configure first!**

### 2.3 Configure Root Directory
1. Click on the deployment
2. Go to "Settings" tab
3. Under "Build & Deploy" find "Root Directory"
4. Set to: `backend`
5. Click "Save"

### 2.4 Redeploy
- Go to "Deployments" tab
- Click "Deploy" to redeploy with correct settings

### 2.5 Get Your Backend URL
- Once deployed (green checkmark), click "Settings"
- Find "Domains" section
- Click "Generate Domain"
- Copy the URL: `https://your-app-name.up.railway.app`

### 2.6 Test Backend
Visit: `https://your-app-name.up.railway.app`

Should see:
```json
{
  "message": "Recipe Cleanup Time Estimator API",
  "version": "1.0.0",
  "status": "running"
}
```

**✅ SAVE THIS URL - You need it for Step 3!**

---

## ✅ Step 3: Deploy Frontend to Vercel (5 minutes)

### 3.1 Sign Up
- Go to https://vercel.com
- Click "Start Deploying"
- Sign up with GitHub

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Find and import `recipe-cleanup-estimator`
3. **STOP before clicking Deploy!**

### 3.3 Configure Project

**Framework Preset**: Vite ✅ (should auto-detect)

**Root Directory**: Click "Edit" → Select `frontend`

**Environment Variables**: ⚠️ **CRITICAL**
- Click "Environment Variables"
- Add variable:
  - **Name**: `VITE_API_URL`
  - **Value**: Your Railway URL from Step 2.5
  - Example: `https://recipe-cleanup-production.up.railway.app`

### 3.4 Deploy!
- Click "Deploy"
- Wait ~2 minutes for build

### 3.5 Get Your Frontend URL
- Once deployed, Vercel shows:
  `https://recipe-cleanup-estimator.vercel.app`
- **This is your production URL!**

---

## ✅ Step 4: Test Your Production App

### 4.1 Visit Your App
Open: `https://your-app.vercel.app`

### 4.2 Test Full Flow
1. Paste recipe URL: `https://www.allrecipes.com/recipe/16354/easy-meatloaf/`
2. Click "Analyze Recipe"
3. ✅ Should see cleanup time estimate!

### 4.3 If It Doesn't Work

**Check Browser Console (F12)**:
- Look for red errors
- Common: "Failed to fetch" → Wrong VITE_API_URL

**Check Railway Logs**:
- Railway dashboard → Your project → "Deployments" → "View Logs"
- Look for errors

**Common Fixes**:
1. Wrong `VITE_API_URL` → Redeploy frontend with correct URL
2. CORS errors → Backend needs to allow your Vercel domain
3. Backend not running → Check Railway logs

---

## 📝 Your Production URLs

After completing all steps, save these:

```
Frontend: https://[your-app].vercel.app
Backend:  https://[your-app].up.railway.app
```

**Share the frontend URL with your friend!** 🎉

---

## 🔄 Making Updates

Anytime you make changes:

```bash
git add .
git commit -m "Describe your changes"
git push
```

Both Railway and Vercel will **automatically redeploy**!

---

## 🆘 Need Help?

1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed troubleshooting
2. Railway Docs: https://docs.railway.app
3. Vercel Docs: https://vercel.com/docs
4. Check deployment logs first!

---

## 💰 Cost

- **Railway**: $5 free credit/month (~500 hours)
- **Vercel**: Unlimited for personal projects
- **Total**: **FREE** for your use case

---

**You're all set! Go deploy! 🚀**
