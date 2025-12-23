# CB Insights Proxy Server Deployment Guide

The CB Insights integration requires a backend proxy server to handle API authentication and avoid CORS issues. Here's how to deploy it separately from the GitHub Pages frontend.

## Why a Proxy Server?

- **GitHub Pages** only supports static hosting (HTML, CSS, JS)
- **CB Insights API** requires API key authentication
- **CORS** prevents direct API calls from the browser
- **Solution**: Deploy proxy server to a separate service

---

## Option 1: Deploy to Vercel (Recommended - Free)

### Step 1: Prepare the Proxy Server

Create a new directory for the proxy server:

```bash
mkdir techtrends-proxy
cd techtrends-proxy
```

### Step 2: Create package.json

```json
{
  "name": "techtrends-proxy",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node api/chatcbi.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1"
  }
}
```

### Step 3: Create Vercel Serverless Function

Create `api/chatcbi.js`:

```javascript
import { config } from 'dotenv';
config();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch('https://api.cbinsights.com/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CBI_API_KEY}`,
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('CB Insights API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to query CB Insights',
      details: error.message 
    });
  }
}
```

### Step 4: Create vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

### Step 5: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variable
vercel env add CBI_API_KEY
# Paste your CB Insights API key

# Deploy production
vercel --prod
```

Your proxy will be available at: `https://your-project.vercel.app/api/chatcbi`

---

## Option 2: Deploy to Railway (Free Tier)

### Step 1: Create Railway Project

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

### Step 2: Copy proxy-server.cjs

Copy your existing `proxy-server.cjs` file.

### Step 3: Add Procfile

```
web: node proxy-server.cjs
```

### Step 4: Deploy

```bash
railway up

# Set environment variable
railway variables set CBI_API_KEY=your-api-key-here
```

Your proxy will be available at: `https://your-project.railway.app`

---

## Option 3: Deploy to Render (Free Tier)

### Step 1: Create Web Service on Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo or upload files

### Step 2: Configure Service

- **Build Command**: `npm install`
- **Start Command**: `node proxy-server.cjs`
- **Environment Variables**:
  - `CBI_API_KEY`: your-api-key

### Step 3: Deploy

Render will automatically deploy and give you a URL like:
`https://your-service.onrender.com`

---

## Update GitHub Pages Deployment

Once you have your proxy server URL, update the GitHub Actions workflow:

### Edit `.github/workflows/deploy.yml`

Add environment variable to the build step:

```yaml
- name: Build
  env:
    VITE_PROXY_URL: https://your-proxy-url.vercel.app
  run: npm run build
```

Or add it as a GitHub Secret:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `VITE_PROXY_URL`
4. Value: `https://your-proxy-url.vercel.app`

Then update the workflow:

```yaml
- name: Build
  env:
    VITE_PROXY_URL: ${{ secrets.VITE_PROXY_URL }}
  run: npm run build
```

---

## Alternative: Deploy Everything to Vercel/Netlify

Instead of GitHub Pages, deploy the entire app (frontend + proxy) to Vercel or Netlify:

### Vercel

```bash
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

Both platforms support:
- Serverless functions (for proxy)
- Static hosting (for frontend)
- Environment variables
- Free tier

---

## Testing the Proxy

Once deployed, test your proxy:

```bash
curl -X POST https://your-proxy-url.vercel.app/api/chatcbi \
  -H "Content-Type: application/json" \
  -d '{"message": "What are AI trends in 2025?"}'
```

You should get a JSON response with the answer from CB Insights.

---

## Local Development

For local development, keep using:

```bash
npm run proxy
```

The app will automatically use `http://localhost:3001` when `VITE_PROXY_URL` is not set.

---

## Summary

1. ✅ **Frontend**: Deployed to GitHub Pages (static)
2. ⚠️ **Proxy**: Deploy separately to Vercel/Railway/Render
3. 🔗 **Connect**: Set `VITE_PROXY_URL` in GitHub Actions
4. 🎯 **Result**: Full-stack app with CB Insights integration

Choose **Vercel** for the easiest deployment with serverless functions!
