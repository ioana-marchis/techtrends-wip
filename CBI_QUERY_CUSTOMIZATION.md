# CBI Top Trends Query Customization

The CBI Top Trends query is now configurable via environment variable for easy customization without touching code files.

## 📍 Location

**File:** `.env.local`  
**Variable:** `VITE_CBI_TOP_TRENDS_QUERY`

## 🔧 How to Change the Query

1. Open `.env.local` in your project root
2. Find the line starting with `VITE_CBI_TOP_TRENDS_QUERY=`
3. Update the query text between the quotes
4. Save the file
5. Restart the dev server: `npm run dev`

## 📝 Current Default Query

```bash
VITE_CBI_TOP_TRENDS_QUERY="Get an ordered list of the latest top tech trends from the World Economic forum. Show the output in the format: <output>trend priority. name of the trend</output>. Do not display any other characters in the response, not even citations."
```

## 🎯 Example Custom Queries

### AI & Machine Learning Trends
```bash
VITE_CBI_TOP_TRENDS_QUERY="Get an ordered list of the top 10 AI and machine learning trends from Gartner, IDC, and leading tech companies. Show the output in the format: <output>priority. trend name</output>. Do not display any other characters in the response, not even citations."
```

### Cybersecurity Trends
```bash
VITE_CBI_TOP_TRENDS_QUERY="Get an ordered list of the latest cybersecurity threats and trends from NIST, CISA, and leading cybersecurity firms. Show the output in the format: <output>priority. threat name</output>. Do not display any other characters in the response, not even citations."
```

### FinTech Innovations
```bash
VITE_CBI_TOP_TRENDS_QUERY="Get an ordered list of emerging financial technology trends and innovations from McKinsey, Deloitte, and leading fintech companies. Show the output in the format: <output>priority. fintech trend</output>. Do not display any other characters in the response, not even citations."
```

### Healthcare Technology
```bash
VITE_CBI_TOP_TRENDS_QUERY="Get an ordered list of healthcare technology innovations from WHO, FDA, and healthcare tech leaders. Show the output in the format: <output>priority. innovation name</output>. Do not display any other characters in the response, not even citations."
```

### Sustainability & Green Tech
```bash
VITE_CBI_TOP_TRENDS_QUERY="Get an ordered list of sustainability and green technology trends from UN, EPA, and environmental organizations. Show the output in the format: <output>priority. technology name</output>. Do not display any other characters in the response, not even citations."
```

### Emerging Technologies (Multiple Sources)
```bash
VITE_CBI_TOP_TRENDS_QUERY="Get an ordered list of emerging technologies from Gartner Hype Cycle, MIT Technology Review, and Forrester Research. Show the output in the format: <output>priority. technology name</output>. Do not display any other characters in the response, not even citations."
```

## ⚙️ Important Requirements

### ✅ Always Include These:

1. **Output Format Instruction:**
   ```
   Show the output in the format: <output>priority. trend name</output>
   ```

2. **Citation Suppression:**
   ```
   Do not display any other characters in the response, not even citations.
   ```

3. **Expected Format:** The component parses responses like:
   ```
   1. Quantum Computing
   2. AI Governance
   3. Green Technology
   ```

### ❌ Don't Forget:

- Keep the quotes around the entire query
- Don't use line breaks inside the query (keep it as one line)
- Maintain the numbered list format instruction

## 🔄 Quick Test

After changing the query:

1. **Restart dev server:**
   ```bash
   # Stop: Ctrl+C in terminal
   npm run dev
   ```

2. **Check browser console** for the query being sent:
   ```
   [CBI Top Trends] Fetching trends...
   ```

3. **Click the refresh button** in the CBI Top Trends widget to test immediately

## 📚 Related Configuration

Other CBI Top Trends settings are still in `src/config/cbiTopTrends.ts`:
- `refreshInterval`: How often to auto-refresh (default: 1 hour)
- `maxTrends`: Maximum trends to display (default: 10)
- `autoRefresh`: Enable/disable auto-refresh (default: true)
- `title`: Widget title (default: "CBI Top Trends")
- `showLastUpdate`: Show/hide timestamp (default: true)

See `CBI_TOP_TRENDS_CONFIG_GUIDE.md` for full configuration options.

## 🚀 For Production/Vercel

When deploying, add `VITE_CBI_TOP_TRENDS_QUERY` to your environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add new variable:
   - **Name:** `VITE_CBI_TOP_TRENDS_QUERY`
   - **Value:** Your custom query
3. Redeploy your application

---

**Need Help?** See:
- `CBI_TOP_TRENDS_CONFIG_GUIDE.md` - Full configuration guide
- `ENV_SETUP.md` - Environment variables setup
- `PROXY_DEPLOYMENT_GUIDE.md` - Proxy server deployment
