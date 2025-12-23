# Environment Variables Setup

This document explains how to set up environment variables for local development.

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Add your credentials:**
   Edit `.env.local` and replace the placeholder values with your actual credentials:
   - `CBI_CLIENT_ID`: Your CB Insights Client ID
   - `CBI_CLIENT_SECRET`: Your CB Insights Client Secret

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

## Environment Variables

### Required for Local Development

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_PROXY_URL` | URL of the proxy server | `http://localhost:3001` |
| `CBI_CLIENT_ID` | CB Insights Client ID (for proxy) | - |
| `CBI_CLIENT_SECRET` | CB Insights Client Secret (for proxy) | - |

### Optional

| Variable | Description |
|----------|-------------|
| `VITE_CBI_CLIENT_ID` | CB Insights Client ID (frontend, if needed) |
| `VITE_CBI_CLIENT_SECRET` | CB Insights Client Secret (frontend, if needed) |

## Files

- **`.env.example`** - Template file with placeholder values (committed to Git)
- **`.env.local`** - Your actual credentials (ignored by Git, not committed)
- **`.env`** - ⚠️ **DO NOT USE** - Use `.env.local` instead

## Security

✅ **Protected files (not committed to Git):**
- `.env`
- `.env.local`
- `.env.*.local`

✅ **Safe to commit:**
- `.env.example` (no real credentials)

## Getting Your CB Insights Credentials

1. Log in to your CB Insights account
2. Go to API settings
3. Create or view your API credentials
4. Copy the Client ID and Client Secret

## For Vercel Deployment

When deploying to Vercel, set these environment variables in the Vercel dashboard:
- `CBI_CLIENT_ID`
- `CBI_CLIENT_SECRET`
- `VITE_PROXY_URL` (optional, for GitHub Pages)

See `VERCEL_DEPLOYMENT.md` for detailed instructions.

## Troubleshooting

### "Cannot connect to proxy server"
- Make sure `.env.local` exists with the correct values
- Restart your dev server: `npm run dev`
- Start the proxy server: `npm run proxy`

### "Missing CB Insights credentials"
- Check that `CBI_CLIENT_ID` and `CBI_CLIENT_SECRET` are set in `.env.local`
- Make sure there are no typos in the variable names
- Verify the credentials are valid in your CB Insights account

### Environment variables not loading
- Make sure the file is named exactly `.env.local` (not `.env`)
- Restart your dev server after adding/changing variables
- Check that the variables start with `VITE_` for frontend access
