# 🚀 Quick Start: Deploy Proxy to Vercel

Your project is now ready to deploy the proxy server to Vercel! Here's the fastest way:

## ⚡ Quick Deploy (2 minutes)

### Step 1: Go to Vercel
Visit: **https://vercel.com/new**

### Step 2: Import Repository
- Click **"Import Git Repository"**
- Select: **`ioana-marchis/techtrends-wip`**
- Click **"Import"**

### Step 3: Add Environment Variables
On the configuration screen, add these **2 variables**:

| Name | Value |
|------|-------|
| `CBI_CLIENT_ID` | Your CB Insights Client ID |
| `CBI_CLIENT_SECRET` | Your CB Insights Client Secret |

### Step 4: Deploy
Click **"Deploy"** button and wait ~1 minute

### Step 5: Get Your URL
You'll get a URL like: `https://techtrends-wip.vercel.app`

Your proxy endpoints:
- 🏥 Health: `https://techtrends-wip.vercel.app/api/health`
- 💬 ChatCBI: `https://techtrends-wip.vercel.app/api/chatcbi`

---

## ✅ Test Your Deployment

```bash
# Test health endpoint
curl https://YOUR-PROJECT.vercel.app/api/health

# Test ChatCBI
curl -X POST https://YOUR-PROJECT.vercel.app/api/chatcbi \
  -H "Content-Type: application/json" \
  -d '{"message": "What are AI trends in 2025?"}'
```

---

## 🔗 Connect to Your Frontend

You have **2 options**:

### Option A: Keep using GitHub Pages
Update `.github/workflows/deploy.yml`:

```yaml
- name: Build
  env:
    VITE_PROXY_URL: https://YOUR-PROJECT.vercel.app
  run: npm run build
```

### Option B: Use Vercel for everything (Recommended!)
Just use: `https://YOUR-PROJECT.vercel.app`

Vercel will automatically deploy both:
- ✅ Your React frontend
- ✅ Your API proxy

No need for GitHub Pages!

---

## 📚 Detailed Guides

- **Full Vercel Guide**: See `VERCEL_DEPLOYMENT.md`
- **Alternative Options**: See `PROXY_DEPLOYMENT_GUIDE.md`

---

## 🆘 Need Help?

**Can't find your CB Insights credentials?**
- Check your CB Insights account settings
- Or contact CB Insights support

**Deployment failed?**
- Check the Vercel deployment logs
- Make sure both environment variables are set

**Still getting proxy errors?**
- Verify the proxy URL is correct
- Check Vercel function logs at: https://vercel.com/dashboard

---

## 🎉 That's It!

Once deployed, your app will have full CB Insights integration working on GitHub Pages (or Vercel)!
