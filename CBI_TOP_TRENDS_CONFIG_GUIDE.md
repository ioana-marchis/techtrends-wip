# CBI Top Trends Configuration Guide

This guide explains how to customize the CBI Top Trends component by editing the configuration file.

## Configuration File Location

📁 **`src/config/cbiTopTrends.ts`**  
📁 **`.env.local`** (for query customization)

## Available Configuration Options

### 1. Query (Most Important!)

**🆕 Now configurable via environment variable!**

The query is now stored in `.env.local` as `VITE_CBI_TOP_TRENDS_QUERY`.

#### To Customize the Query:

1. Open `.env.local`
2. Find the line starting with `VITE_CBI_TOP_TRENDS_QUERY=`
3. Change the query text
4. Restart the dev server

**Example in `.env.local`:**
```bash
VITE_CBI_TOP_TRENDS_QUERY="Get an ordered list of the latest top tech trends from the World Economic forum. Show the output in the format: <output>trend priority. name of the trend</output>. Do not display any other characters in the response, not even citations."
```

#### Current Default:
```
Get an ordered list of the latest top tech trends from the World Economic forum. 
Show the output in the format: <output>trend priority. name of the trend</output>. 
Do not display any other characters in the response, not even citations.
```

#### Example Queries to Put in `.env.local`:

**Get AI Trends:**
```bash
VITE_CBI_TOP_TRENDS_QUERY="Get an ordered list of the top 10 AI trends from leading tech companies. Show the output in the format: <output>priority. trend name</output>. Do not display any other characters in the response, not even citations."
```

**Get Cybersecurity Trends:**
```bash
VITE_CBI_TOP_TRENDS_QUERY="Get an ordered list of the latest cybersecurity threats and trends from NIST and cybersecurity experts. Show the output in the format: <output>priority. threat name</output>. Do not display any other characters in the response, not even citations."
```

**Get FinTech Trends:**
```bash
VITE_CBI_TOP_TRENDS_QUERY="Get an ordered list of emerging financial technology trends from McKinsey and Deloitte. Show the output in the format: <output>priority. fintech trend</output>. Do not display any other characters in the response, not even citations."
```

**Get Healthcare Tech Trends:**
```bash
VITE_CBI_TOP_TRENDS_QUERY="Get an ordered list of healthcare technology innovations from WHO and healthcare tech leaders. Show the output in the format: <output>priority. innovation name</output>. Do not display any other characters in the response, not even citations."
```

#### Important Notes:
- Always keep the output format instruction: `<output>priority. trend name</output>`
- Add "Do not display any other characters in the response, not even citations" to get clean output
- The component expects format: `1. Trend Name` or `1 Trend Name`

---

### 2. Refresh Interval

```typescript
refreshInterval: 60 * 60 * 1000  // milliseconds
```

How often the trends are automatically refreshed.

#### Common Values:
```typescript
refreshInterval: 5 * 60 * 1000,      // 5 minutes
refreshInterval: 30 * 60 * 1000,     // 30 minutes
refreshInterval: 60 * 60 * 1000,     // 1 hour (default)
refreshInterval: 6 * 60 * 60 * 1000, // 6 hours
refreshInterval: 24 * 60 * 60 * 1000, // 24 hours
```

---

### 3. Maximum Trends to Display

```typescript
maxTrends: 10
```

Limits how many trends are shown in the component.

#### Options:
```typescript
maxTrends: 5,     // Show only top 5
maxTrends: 10,    // Show top 10 (default)
maxTrends: 20,    // Show top 20
maxTrends: null,  // Show all trends (no limit)
```

---

### 4. Auto-Refresh Toggle

```typescript
autoRefresh: true
```

Enable or disable automatic refresh.

#### Options:
```typescript
autoRefresh: true,   // Auto-refresh enabled (default)
autoRefresh: false,  // Only fetch on initial load or manual refresh
```

---

### 5. Component Title

```typescript
title: 'CBI Top Trends'
```

The title displayed in the card header.

#### Examples:
```typescript
title: 'CBI Top Trends'           // Default
title: 'Top AI Trends'            // If focused on AI
title: 'Cybersecurity Threats'    // If focused on security
title: 'FinTech Innovations'      // If focused on fintech
```

---

### 6. Show Last Update

```typescript
showLastUpdate: true
```

Show/hide the "last updated" timestamp.

#### Options:
```typescript
showLastUpdate: true,   // Show timestamp (default)
showLastUpdate: false,  // Hide timestamp
```

---

## Complete Example Configurations

### Example 1: AI-Focused Dashboard

```typescript
export const CBITopTrendsConfig = {
  query: 'Get an ordered list of the top 10 AI and machine learning trends from leading tech companies and research institutions. Show the output in the format: <output>priority. AI trend name</output>. Do not display any other characters in the response, not even citations.',
  refreshInterval: 6 * 60 * 60 * 1000, // 6 hours
  maxTrends: 10,
  autoRefresh: true,
  title: 'Top AI Trends',
  showLastUpdate: true,
};
```

### Example 2: Cybersecurity Dashboard

```typescript
export const CBITopTrendsConfig = {
  query: 'Get an ordered list of the latest cybersecurity threats and security trends from NIST, CISA, and leading cybersecurity firms. Show the output in the format: <output>priority. threat/trend name</output>. Do not display any other characters in the response, not even citations.',
  refreshInterval: 60 * 60 * 1000, // 1 hour (threats change frequently)
  maxTrends: 15,
  autoRefresh: true,
  title: 'Security Threats & Trends',
  showLastUpdate: true,
};
```

### Example 3: FinTech Dashboard

```typescript
export const CBITopTrendsConfig = {
  query: 'Get an ordered list of emerging financial technology trends and innovations from McKinsey, Deloitte, and leading fintech companies. Show the output in the format: <output>priority. fintech trend</output>. Do not display any other characters in the response, not even citations.',
  refreshInterval: 24 * 60 * 60 * 1000, // 24 hours (slower-moving trends)
  maxTrends: 8,
  autoRefresh: true,
  title: 'FinTech Innovations',
  showLastUpdate: true,
};
```

---

## How to Apply Changes

### Changing the Query:

1. **Edit `.env.local`:**
   ```bash
   nano .env.local
   # Find VITE_CBI_TOP_TRENDS_QUERY and change the value
   ```

2. **Save the file**

3. **Restart the development server:**
   ```bash
   # Stop the dev server (Ctrl+C)
   npm run dev
   ```

### Changing Other Settings (refresh interval, max trends, etc.):

1. **Edit the configuration file:**
   ```bash
   nano src/config/cbiTopTrends.ts
   ```

2. **Save the file**

3. **Restart the development server:**
   ```bash
   # Stop the dev server (Ctrl+C)
   npm run dev
   ```

4. **View changes in browser:**
   - The component will automatically fetch new data with your updated query
   - Manual refresh button is also available

---

## Testing Your Configuration

1. **Start both servers:**
   ```bash
   # Terminal 1: Proxy server
   npm run proxy
   
   # Terminal 2: Dev server
   npm run dev
   ```

2. **Open the app:**
   - Visit http://localhost:8080/techtrends-wip/

3. **Check the CBI Top Trends widget:**
   - Should show your custom title
   - Click refresh to test the query
   - Check browser console for any errors

---

## Troubleshooting

### Issue: No trends showing
**Solution:** 
- Check that the output format instruction is included in the query
- Verify the proxy server is running (`npm run proxy`)
- Check browser console for errors

### Issue: Wrong data format
**Solution:**
- Ensure query includes: `Show the output in the format: <output>priority. trend name</output>`
- The component expects numbered list format: `1. Trend Name`

### Issue: Too many/few trends
**Solution:**
- Adjust `maxTrends` value
- Or modify the query to request specific number: "Get top 5..." instead of "Get a list..."

### Issue: Updates too frequent/infrequent
**Solution:**
- Adjust `refreshInterval` value
- Or disable auto-refresh: `autoRefresh: false`

---

## Advanced Tips

### 1. Multiple Sources
You can request data from multiple sources in one query:
```typescript
query: 'Get top tech trends from Gartner, IDC, and Forrester Research...'
```

### 2. Time-Specific Queries
```typescript
query: 'Get the latest emerging technology trends from 2024-2025...'
```

### 3. Industry-Specific
```typescript
query: 'Get healthcare technology trends specifically for hospitals and clinics...'
```

### 4. Geographic Focus
```typescript
query: 'Get technology trends in Europe and Asia from regional tech reports...'
```

---

## Need Help?

- **CB Insights API Issues:** Check `CORS_FIX_README.md` and `CB_INSIGHTS_INTEGRATION.md`
- **Proxy Server:** See `PROXY_DEPLOYMENT_GUIDE.md`
- **General Setup:** See `ENV_SETUP.md`

---

**Remember:** After changing the configuration, the component will use the new query on the next refresh (automatic or manual).
