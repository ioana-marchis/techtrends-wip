# GitHub Actions - CBI Top Trends Fetcher

This document explains how the automated CBI Top Trends fetching works via GitHub Actions.

## 📊 Overview

Instead of requiring a backend proxy server in production, this solution uses GitHub Actions to:
1. **Fetch trends every hour** from CB Insights API
2. **Save results** to `public/data/cbi-trends.json`
3. **Commit and push** the updated file to the repository
4. **GitHub Pages automatically serves** the updated JSON file

## 🔄 How It Works

### Local Development (with Proxy)
```
Browser → CBITopTrends Component → Local Proxy (port 3001) → CB Insights API
```

### Production/GitHub Pages (Static JSON)
```
GitHub Action (hourly) → CB Insights API → public/data/cbi-trends.json
                                                    ↓
Browser → CBITopTrends Component → Fetch static JSON file
```

## 🛠️ Setup Instructions

### 1. Add GitHub Secrets

Go to your GitHub repository settings and add these secrets:

**Settings → Secrets and variables → Actions → New repository secret**

Add three secrets:

| Secret Name | Value |
|------------|-------|
| `CBI_CLIENT_ID` | Your CB Insights Client ID |
| `CBI_CLIENT_SECRET` | Your CB Insights Client Secret |
| `CBI_TOP_TRENDS_QUERY` | Your custom query (optional) |

**Example Query for `CBI_TOP_TRENDS_QUERY`:**
```
Get an ordered list of the latest top tech trends from the World Economic forum. Show the output in the format: <output>trend priority. name of the trend</output>. Do not display any other characters in the response, not even citations.
```

### 2. Enable GitHub Actions

1. Go to **Settings → Actions → General**
2. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
3. Click **Save**

### 3. Commit and Push the Workflow

The workflow file is at `.github/workflows/fetch-cbi-trends.yml`

```bash
git add .github/workflows/fetch-cbi-trends.yml
git add scripts/fetch-cbi-trends.js
git add public/data/cbi-trends.json
git commit -m "Add automated CBI Top Trends fetching"
git push
```

## ⏰ Automatic Execution

The GitHub Action runs:

1. **Every hour** (at minute 0: `0 * * * *`)
2. **On manual trigger** (from Actions tab)
3. **On push to main** (for testing)

## 🎯 Manual Trigger

To manually run the workflow:

1. Go to **Actions** tab in GitHub
2. Select **Fetch CBI Top Trends** workflow
3. Click **Run workflow** button
4. Select branch (usually `main`)
5. Click **Run workflow**

## 📁 Output File

The workflow creates/updates:

```
public/data/cbi-trends.json
```

**Example Structure:**
```json
{
  "lastUpdate": "2025-12-23T14:00:00.000Z",
  "query": "Get an ordered list...",
  "trends": [
    {
      "priority": 1,
      "name": "Quantum Computing"
    },
    {
      "priority": 2,
      "name": "AI Governance"
    }
  ],
  "rawResponse": "1. Quantum Computing\n2. AI Governance",
  "sources": []
}
```

## 🔍 Monitoring

### View Workflow Runs

1. Go to **Actions** tab
2. Click on **Fetch CBI Top Trends**
3. View recent runs and logs

### Check Latest Data

View the latest trends data:
```
https://ioana-marchis.github.io/techtrends-wip/data/cbi-trends.json
```

## 🚀 Component Behavior

The `CBITopTrends` component automatically:

1. **Tries local proxy first** (for development)
   - If available: Uses real-time CB Insights API
   - Shows "Just now" as last update time

2. **Falls back to static JSON** (if proxy unavailable)
   - Loads from `/techtrends-wip/data/cbi-trends.json`
   - Shows actual last update time from GitHub Action

## 🧪 Testing Locally

### Test the Fetch Script

```bash
# Make sure .env.local has credentials
node scripts/fetch-cbi-trends.js
```

This will:
- Fetch trends from CB Insights
- Save to `public/data/cbi-trends.json`
- Show output in console

### Test the Component

1. **Stop the proxy server** (to simulate production)
2. **Start dev server:** `npm run dev`
3. **Open browser** and check CBI Top Trends widget
4. Should load from `public/data/cbi-trends.json`

## 📊 Workflow Schedule

The cron schedule `0 * * * *` means:

```
┌───────────── minute (0)
│ ┌───────────── hour (*)
│ │ ┌───────────── day of month (*)
│ │ │ ┌───────────── month (*)
│ │ │ │ ┌───────────── day of week (*)
│ │ │ │ │
* * * * *

0 * * * * = Every hour at minute 0
```

### Common Schedules

Change the cron in `.github/workflows/fetch-cbi-trends.yml`:

```yaml
# Every 30 minutes
schedule:
  - cron: '0,30 * * * *'

# Every 2 hours
schedule:
  - cron: '0 */2 * * *'

# Every 6 hours
schedule:
  - cron: '0 */6 * * *'

# Once a day at midnight
schedule:
  - cron: '0 0 * * *'
```

## 🔒 Security

✅ **Secure:**
- API credentials stored as GitHub Secrets (encrypted)
- Never exposed in logs or code
- Only accessible to GitHub Actions

✅ **Best Practices:**
- Secrets are masked in workflow logs
- Write access limited to specific file
- Automated commits clearly labeled

## 🐛 Troubleshooting

### Workflow Fails

**Check the logs:**
1. Go to Actions tab
2. Click on failed run
3. View detailed logs

**Common issues:**
- Missing secrets: Add `CBI_CLIENT_ID` and `CBI_CLIENT_SECRET`
- Wrong permissions: Enable write permissions in repo settings
- Invalid credentials: Verify CB Insights API credentials

### Component Shows Error

**"Unable to load trends data"**
- Check if `public/data/cbi-trends.json` exists
- View the file in GitHub repository
- Check workflow last run was successful

**"Proxy not available"** (expected in production)
- This is normal - component will load static JSON
- Check browser console for fallback message

## 📈 Benefits

✅ **No Backend Required** - GitHub Pages serves static files  
✅ **Always Up-to-Date** - Refreshes hourly automatically  
✅ **Cost-Free** - No server costs, uses GitHub Actions free tier  
✅ **Reliable** - GitHub's infrastructure handles updates  
✅ **Secure** - Credentials never exposed to frontend  
✅ **Fast** - Static JSON loads instantly  

## 🔗 Related Files

- `.github/workflows/fetch-cbi-trends.yml` - GitHub Action workflow
- `scripts/fetch-cbi-trends.js` - Fetch script
- `public/data/cbi-trends.json` - Output data file
- `src/components/dashboard/CBITopTrends.tsx` - Component with fallback logic
- `src/config/cbiTopTrends.ts` - Component configuration

## 📚 Further Reading

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Cron Schedule Syntax](https://crontab.guru/)

---

**Need Help?** Check the workflow logs in the Actions tab or review the troubleshooting section above.
