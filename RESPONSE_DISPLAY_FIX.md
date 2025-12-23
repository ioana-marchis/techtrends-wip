# CB Insights Integration - Response Display Fix

## Issue
The CB Insights API response was not displaying in the UI.

## Root Cause
The CB Insights API returns different field names than we expected:
- API returns: `message` 
- We expected: `answer`
- API returns: `sources`
- We expected: `citations`

## Fix Applied

### 1. Updated Response Interface (`src/lib/cbinsights.ts`)
```typescript
interface ChatCBIResponse {
  status: "success" | "error";
  message?: string;  // CB Insights uses 'message'
  answer?: string;   // Keep for compatibility
  sources?: Array<...>;  // CB Insights uses 'sources'
  citations?: Array<...>;  // Keep for compatibility
  suggestions?: string[];
  relatedContent?: Array<...>;
  code?: number;
  msg?: string;
}
```

### 2. Normalized Response (`src/lib/cbinsights.ts`)
The `chatCBI` function now normalizes the response:
```typescript
return {
  status: "success",
  answer: data.message || data.answer,  // Map 'message' to 'answer'
  citations: data.sources || data.citations,  // Map 'sources' to 'citations'
  suggestions: data.suggestions,
  relatedContent: data.relatedContent,
};
```

### 3. Added Debug Logging
- Console logs in `chatCBI()` function
- Console logs in `useChatCBI()` hook  
- Console logs in `CBInsightsWidget` component
- Debug info display (development only)

## Testing Instructions

### 1. Open Browser Console
- Press F12 or right-click → Inspect
- Go to Console tab

### 2. Ask a Question
Go to http://localhost:8080/ and:
- Click a quick question button, OR
- Type a question and click send

### 3. Watch Console Logs
You should see:
```
[CBInsightsWidget] Submitting question: <your question>
[CBI] Sending question to proxy: <your question>
[CBI] Response received from proxy ✓
[CBI] Response data: {...}
[useChatCBI] Response received: {...}
[useChatCBI] Answer: <the answer text>
[useChatCBI] Citations: [...]
```

### 4. Check UI
You should see:
- ✅ Loading spinner while querying
- ✅ Answer text displayed in gray box
- ✅ Debug info showing answer length and citation count
- ✅ Citations with clickable links
- ✅ No error messages

## Expected Response Format

### Successful Response:
```json
{
  "status": "success",
  "message": "The answer to your question...",
  "sources": [
    {
      "title": "Source Title",
      "url": "https://...",
      "snippet": "..."
    }
  ],
  "suggestions": ["Related question 1", "..."],
  "relatedContent": [...]
}
```

## Troubleshooting

### No answer displayed
1. Check browser console for logs
2. Look for `[useChatCBI] Answer:` - should show text
3. Check React DevTools - inspect `CBInsightsWidget` state

### Answer is null
1. Check `[CBI] Response data:` in console
2. Verify `message` field exists in response
3. Check if proxy server is returning correct format

### Citations not showing
1. Check if `sources` array exists in response
2. Verify sources have `title` and `url` fields
3. Check console for `[useChatCBI] Citations:`

## Files Modified

- ✅ `src/lib/cbinsights.ts` - Updated interface and normalization
- ✅ `src/hooks/useChatCBI.ts` - Added debug logging
- ✅ `src/components/dashboard/CBInsightsWidget.tsx` - Added debug info and logging

## Next Steps

After confirming it works:
1. Remove debug logging from production code
2. Remove the debug info display box
3. Consider adding suggestions display
4. Consider adding related content display

## Actual CB Insights Response Structure

Based on our test, CB Insights returns:
```json
{
  "status": "success",
  "message": "Hi! I'm ChatCBI...",
  "chatID": "...",
  "title": "Welcome to ChatCBI",
  "suggestions": ["...", "...", "..."],
  "sources": [],
  "relatedContent": [
    {
      "title": "...",
      "url": "...",
      "thumbnailUrl": "...",
      "date": "..."
    }
  ]
}
```

The `sources` array is populated when there are relevant citations for the answer.
