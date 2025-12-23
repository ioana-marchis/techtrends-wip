# CBI Top Trends Component

A new module that displays the latest top tech trends from CB Insights with automatic refresh functionality.

## Features

✅ **Auto-refresh** - Fetches trends every hour automatically  
✅ **Manual refresh** - Click the refresh button to update immediately  
✅ **Configurable query** - Customize the query via config file  
✅ **Modern design** - Clean list format with priority indicators  
✅ **Error handling** - Graceful error states and loading indicators  
✅ **Last update timestamp** - Shows when trends were last fetched  

## Location

The component is displayed **above** the CB Insights AI widget in the right sidebar of the dashboard.

## Configuration

Edit the configuration file: **`src/config/cbiTopTrends.ts`**

```typescript
export const CBITopTrendsConfig = {
  // Query to fetch top trends
  query: 'Get an ordered list of the latest top tech trends from the World Economic forum. Show the output in the format: <output>trend priority. name of the trend</output>. Do not display any other characters in the response, not even citations.',
  
  // Refresh interval in milliseconds (default: 1 hour)
  refreshInterval: 60 * 60 * 1000,
  
  // Maximum number of trends to display
  maxTrends: 10,
  
  // Enable/disable auto-refresh
  autoRefresh: true,
};
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `query` | string | WEF tech trends query | The query sent to CB Insights API |
| `refreshInterval` | number | 3600000 (1 hour) | Auto-refresh interval in milliseconds |
| `maxTrends` | number | 10 | Maximum number of trends to display |
| `autoRefresh` | boolean | true | Enable/disable automatic refresh |

## Customizing the Query

To change what trends are fetched, edit the `query` property in the config file:

```typescript
// Example: Get AI-specific trends
query: 'Get an ordered list of the latest AI trends. Show the output in the format: <output>trend priority. name of the trend</output>. Do not display any other characters in the response, not even citations.',

// Example: Get healthcare tech trends
query: 'Get an ordered list of the latest healthcare technology trends. Show the output in the format: <output>trend priority. name of the trend</output>. Do not display any other characters in the response, not even citations.',
```

## Changing Refresh Interval

```typescript
// Refresh every 30 minutes
refreshInterval: 30 * 60 * 1000,

// Refresh every 2 hours
refreshInterval: 2 * 60 * 60 * 1000,

// Refresh every 15 minutes
refreshInterval: 15 * 60 * 1000,
```

## Disabling Auto-Refresh

```typescript
// Manual refresh only
autoRefresh: false,
```

## Output Format

The component expects the CB Insights API to return trends in this format:

```
1. Artificial Intelligence
2. Quantum Computing
3. Blockchain Technology
4. 5G Networks
5. Cybersecurity
```

The parser handles both formats:
- `1. Trend Name`
- `1 Trend Name`

## Component Structure

```
src/
  components/
    dashboard/
      CBITopTrends.tsx       # Main component
  config/
    cbiTopTrends.ts          # Configuration file
```

## Usage

The component is automatically included in the main dashboard at `src/pages/Index.tsx`:

```tsx
import CBITopTrends from "@/components/dashboard/CBITopTrends";

// ...
<CBITopTrends />
```

## Manual Refresh

Users can manually refresh trends by:
1. Clicking the refresh icon (🔄) in the component header
2. The button shows a spinning animation during refresh
3. Timestamp updates to show when trends were last fetched

## Error Handling

The component gracefully handles:
- **Proxy connection errors** - Shows helpful message about needing the proxy server
- **API errors** - Displays error message from CB Insights
- **Network errors** - Shows connection error message
- **Empty results** - Shows "No trends available" message

## Dependencies

- CB Insights proxy server must be running (local or deployed to Vercel)
- `chatCBI` function from `@/lib/cbinsights`
- UI components from `@/components/ui`

## Troubleshooting

### Trends not loading

**Check:**
1. Is the proxy server running? (`npm run proxy`)
2. Are CB Insights credentials set in `.env.local`?
3. Check browser console for error messages
4. Verify `VITE_PROXY_URL` is set correctly

### Auto-refresh not working

**Check:**
1. Is `autoRefresh` enabled in config?
2. Check browser console for errors
3. Refresh interval might be too long - try shorter interval for testing

### Query not returning expected format

**Solution:**
Make sure your query includes the format specification:
```
Show the output in the format: <output>trend priority. name of the trend</output>
```

## Performance

- Initial load happens on component mount
- Auto-refresh runs in background
- Uses React `useEffect` cleanup to prevent memory leaks
- Minimal re-renders with proper state management

## Future Enhancements

Potential improvements:
- [ ] Add trend categories/tags
- [ ] Link to detailed trend information
- [ ] Historical trend comparison
- [ ] Export trends to CSV
- [ ] Customizable display options (compact/expanded)
- [ ] Trend sentiment indicators

---

**Created**: December 2025  
**Component**: `CBITopTrends`  
**Config**: `src/config/cbiTopTrends.ts`
