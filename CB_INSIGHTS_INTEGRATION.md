# CB Insights Integration

This directory contains the TypeScript implementation of the CB Insights API client for the TechTrends application.

## 📁 Files

- **`src/lib/cbinsights.ts`** - Core API client with authentication and ChatCBI functionality
- **`src/hooks/useChatCBI.ts`** - React hook for easy integration in components
- **`src/components/dashboard/CBInsightsChat.tsx`** - Example component demonstrating usage
- **`cbinsights.py`** - Original Python implementation (reference)

## 🚀 Features

- ✅ **Token Caching** - Automatically caches authentication tokens (1 hour expiration)
- ✅ **Auto-refresh** - Refreshes tokens when they expire
- ✅ **Error Handling** - Comprehensive error handling with helpful messages
- ✅ **TypeScript Support** - Full type definitions for API responses
- ✅ **React Hook** - Easy-to-use hook for React components

## 🔧 Setup

### 1. Environment Variables

The following environment variables must be set in your `.env` file:

```env
VITE_CBI_CLIENT_ID=your-client-id
VITE_CBI_CLIENT_SECRET=your-client-secret
```

⚠️ **Note**: Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client.

### 2. API Configuration

By default, the client connects to:
```
https://api.cbinsights.com/v2
```

For EU region, update the `BASE` constant in `src/lib/cbinsights.ts`:
```typescript
const BASE = "https://eu-api.cbinsights.com/v2";
```

## 📖 Usage

### Direct API Usage

```typescript
import { chatCBI } from "@/lib/cbinsights";

// Ask a question
const response = await chatCBI("What are the latest AI trends in fintech?");

if (response.status === "success") {
  console.log("Answer:", response.answer);
  console.log("Citations:", response.citations);
} else {
  console.error("Error:", response.msg);
}
```

### Using the React Hook

```typescript
import { useChatCBI } from "@/hooks/useChatCBI";

function MyComponent() {
  const { answer, citations, isLoading, error, askQuestion } = useChatCBI();

  const handleSubmit = () => {
    askQuestion("What are emerging AI trends?");
  };

  return (
    <div>
      <button onClick={handleSubmit} disabled={isLoading}>
        Ask Question
      </button>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {answer && <p>Answer: {answer}</p>}
    </div>
  );
}
```

### Using the Example Component

```typescript
import CBInsightsChat from "@/components/dashboard/CBInsightsChat";

function Dashboard() {
  return (
    <div>
      <h1>Market Intelligence</h1>
      <CBInsightsChat />
    </div>
  );
}
```

## 🔑 API Response Format

### Success Response
```typescript
{
  status: "success",
  answer: "The answer to your question...",
  citations: [
    {
      title: "Source Title",
      url: "https://example.com",
      snippet: "Relevant excerpt..."
    }
  ]
}
```

### Error Response
```typescript
{
  status: "error",
  code: 401,
  msg: "Authentication failed"
}
```

## 🛡️ Security Best Practices

1. **Never commit credentials** - Always use `.env` files (already in `.gitignore`)
2. **Rotate credentials regularly** - Update API keys periodically
3. **Use environment-specific credentials** - Different keys for dev/staging/prod
4. **Monitor API usage** - Track authentication failures

## 🐛 Troubleshooting

### "Authentication failed"
- Check that `VITE_CBI_CLIENT_ID` and `VITE_CBI_CLIENT_SECRET` are set correctly
- Verify you're using the correct API region (US vs EU)
- Ensure credentials are not expired

### "Token request failed"
- Check network connectivity
- Verify API endpoint is accessible
- Check for rate limiting

### Environment variables not loading
- Ensure variables are prefixed with `VITE_`
- Restart the development server after changing `.env`
- Variables are loaded at build time, not runtime

## 📊 Integration with TechTrends

To integrate CB Insights data into your TechTrends dashboard:

1. **Add to navigation** - Create a new route for CB Insights
2. **Combine data sources** - Merge HackerNews + CB Insights trends
3. **Create visualizations** - Chart market intelligence data
4. **Add filters** - Filter by industry, company stage, etc.

## 🔄 Migration from Python

Key differences from `cbinsights.py`:

- Uses `fetch` API instead of `requests`
- Token cache uses milliseconds instead of seconds
- Environment variables prefixed with `VITE_`
- Async/await pattern throughout
- TypeScript types for better developer experience

## 📚 Additional Resources

- [CB Insights API Documentation](https://api.cbinsights.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [React Query (for better data fetching)](https://tanstack.com/query)

## 🤝 Contributing

When extending this integration:

1. Update TypeScript types for new endpoints
2. Add error handling for edge cases
3. Update this README with new features
4. Add unit tests for new functionality
