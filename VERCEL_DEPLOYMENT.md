# 🚀 Deploy Proxy to Vercel - Step by Step

This guide will help you deploy the CB Insights proxy server to Vercel (free tier).

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com - free)
- CB Insights API credentials (CLIENT_ID and CLIENT_SECRET)

---

## Method 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Push to GitHub

Make sure all changes are committed and pushed:

```bash
cd /Users/marchisi/Documents/GitHub/techtrends-wip
git add .
git commit -m "Add Vercel serverless functions for proxy"
git push origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your repository: **`ioana-marchis/techtrends-wip`**
5. Click **"Import"**

### Step 3: Configure Project

On the project configuration screen:

**Framework Preset**: Select **"Other"** or **"Vite"**

**Root Directory**: Leave as **"./"** (root)

**Build Command**: Leave empty or set to `npm run build` (optional)

**Output Directory**: Leave as **"dist"** (optional)

**Install Command**: `npm install`

### Step 4: Add Environment Variables

Still on the configuration screen, expand **"Environment Variables"** section:

Add these two variables:

1. **Name**: `CBI_CLIENT_ID`
   **Value**: `your-client-id-here`

2. **Name**: `CBI_CLIENT_SECRET`
   **Value**: `your-client-secret-here`

### Step 5: Deploy

Click **"Deploy"** button

Wait for deployment to complete (usually 1-2 minutes)

### Step 6: Get Your Proxy URL

Once deployed, you'll get a URL like:
```
https://techtrends-wip.vercel.app
```

Your proxy endpoints will be:
- Health: `https://techtrends-wip.vercel.app/api/health`
- ChatCBI: `https://techtrends-wip.vercel.app/api/chatcbi`

### Step 7: Test Your Proxy

```bash
curl https://techtrends-wip.vercel.app/api/health
```

Should return:
```json
{"status":"ok","message":"CB Insights proxy server is running on Vercel"}
```

Test ChatCBI:
```bash
curl -X POST https://techtrends-wip.vercel.app/api/chatcbi \
  -H "Content-Type: application/json" \
  -d '{"message": "What are AI trends in 2025?"}'
```

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Deploy

```bash
cd /Users/marchisi/Documents/GitHub/techtrends-wip
vercel
```

Answer the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? **techtrends-wip** (or any name)
- In which directory is your code located? **./**
- Want to modify settings? **N**

### Step 4: Add Environment Variables

```bash
vercel env add CBI_CLIENT_ID
# Paste your client ID and press Enter

vercel env add CBI_CLIENT_SECRET
# Paste your client secret and press Enter
```

Select **Production** when prompted.

### Step 5: Deploy to Production

```bash
vercel --prod
```

You'll get your production URL!

---

## Step 8: Update GitHub Pages to Use Vercel Proxy

### Option A: Update GitHub Actions Workflow

Edit `.github/workflows/deploy.yml`:

```yaml
- name: Build
  env:
    VITE_PROXY_URL: https://techtrends-wip.vercel.app
  run: npm run build
```

Or use GitHub Secrets (more secure):

1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Name: `VITE_PROXY_URL`
4. Value: `https://techtrends-wip.vercel.app`
5. Click **"Add secret"**

Then update workflow:

```yaml
- name: Build
  env:
    VITE_PROXY_URL: ${{ secrets.VITE_PROXY_URL }}
  run: npm run build
```

### Option B: Just Rebuild and Push

Since your Vercel deployment includes both the proxy AND the frontend, you might want to use Vercel for everything:

```bash
# Just use Vercel URL for everything
# Your site will be at: https://techtrends-wip.vercel.app
```

---

## Troubleshooting

### Issue: "Missing CB Insights credentials"

**Solution**: Make sure you added both environment variables in Vercel:
- `CBI_CLIENT_ID`
- `CBI_CLIENT_SECRET`

Check them at: https://vercel.com/your-username/techtrends-wip/settings/environment-variables

### Issue: CORS errors

**Solution**: The serverless functions already have CORS enabled. Make sure you're using the correct URL.

### Issue: 404 on /api/chatcbi

**Solution**: Make sure `vercel.json` is in the root of your repo and properly configured.

### Issue: Function timeout

**Solution**: Vercel free tier has 10s timeout. If CB Insights API is slow, you might hit this. Consider upgrading or optimizing.

---

## Next Steps

1. ✅ Deploy proxy to Vercel
2. ✅ Test proxy endpoints
3. ✅ Update GitHub Actions with `VITE_PROXY_URL`
4. ✅ Rebuild and deploy to GitHub Pages
5. 🎉 Your app is fully functional!

---

## Alternative: Use Vercel for Everything

Instead of GitHub Pages, you can host everything on Vercel:

**Benefits:**
- Single deployment
- Proxy and frontend together
- No need for GitHub Actions
- Preview deployments for PRs
- Better performance

**To do this:**
1. Your proxy is already deployed ✅
2. Vercel will automatically build and deploy your frontend too!
3. Just use: `https://techtrends-wip.vercel.app`

Your choice! Both approaches work fine.

---

## Quick Reference

| Service | Purpose | URL |
|---------|---------|-----|
| Vercel | Proxy Server | `https://techtrends-wip.vercel.app/api/chatcbi` |
| GitHub Pages | Static Frontend | `https://ioana-marchis.github.io/techtrends-wip/` |

Choose one or use both! 🚀
