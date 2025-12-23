# CB Insights Integration - CORS Fix

## Problem
The CB Insights API blocks direct requests from the browser due to CORS (Cross-Origin Resource Sharing) restrictions.

## Solution
We've created a proxy server that runs locally and handles CB Insights API requests on behalf of the frontend.

## Setup Instructions

### 1. Install Dependencies (Already Done)
```bash
npm install express cors node-fetch dotenv
```

### 2. Start the Proxy Server
Open a NEW terminal window and run:
```bash
cd /Users/marchisi/Documents/GitHub/techtrends-main
npm run proxy
```

You should see:
```
🚀 CB Insights Proxy Server running on http://localhost:3001
📊 Health check: http://localhost:3001/health
💬 ChatCBI endpoint: http://localhost:3001/api/chatcbi
```

### 3. Keep Both Servers Running
You need TWO terminal windows:

**Terminal 1 - Frontend (Vite):**
```bash
npm run dev
```
→ Runs on http://localhost:8080

**Terminal 2 - Proxy Server:**
```bash
npm run proxy
```
→ Runs on http://localhost:3001

## How It Works

```
Browser (localhost:8080)
    ↓ 
    ↓ No CORS! (same machine)
    ↓
Proxy Server (localhost:3001)
    ↓
    ↓ Server-to-server (no CORS)
    ↓
CB Insights API (api.cbinsights.com)
```

## Testing the Setup

1. Go to http://localhost:8080/
2. Find the **yellow "CB Insights Debug Panel"** in the right sidebar
3. Click **"Run Diagnostics"**
4. You should see green checkmarks if everything is working

## Architecture

- **Frontend Code:** `src/lib/cbinsights.ts` - Now calls proxy instead of API directly
- **Proxy Server:** `proxy-server.js` - Handles authentication and API requests
- **Environment:** `.env` - Contains CB Insights credentials (CBI_CLIENT_ID, CBI_CLIENT_SECRET)

## Troubleshooting

### Error: "Cannot connect to proxy server"
- Make sure proxy server is running: `npm run proxy`
- Check that port 3001 is not in use: `lsof -i :3001`

### Error: "Missing CB Insights credentials"
- Check `.env` file contains CBI_CLIENT_ID and CBI_CLIENT_SECRET
- Restart proxy server after changing .env

### Proxy server won't start
- Check for node errors in terminal
- Make sure all dependencies are installed: `npm install`

## Files Modified

- ✅ `proxy-server.js` - NEW proxy server
- ✅ `src/lib/cbinsights.ts` - Updated to use proxy
- ✅ `src/components/dashboard/CBInsightsDebug.tsx` - Updated diagnostics
- ✅ `package.json` - Added `proxy` script
- ✅ `.env` - Contains credentials (not VITE_ prefixed, for proxy only)

## Production Deployment

For production, you would:
1. Deploy proxy server as a backend service
2. Update `VITE_PROXY_URL` environment variable to point to your backend
3. Never expose CB Insights credentials in frontend code
