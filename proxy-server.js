/**
 * CB Insights API Proxy Server
 * Handles authentication and requests to avoid CORS issues
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Load .env.local first (for local development), then .env as fallback
dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = 3001;

const BASE_URL = 'https://api.cbinsights.com/v2';
const CID = process.env.CBI_CLIENT_ID;
const CSEC = process.env.CBI_CLIENT_SECRET;

// Token cache
let tokenCache = {
  token: '',
  expiration: 0
};

app.use(cors());
app.use(express.json());

// Get authentication token
async function getToken() {
  // Return cached token if still valid (>60 seconds until expiry)
  if (tokenCache.expiration - Date.now() > 60000) {
    return tokenCache.token;
  }

  if (!CID || !CSEC) {
    throw new Error('Missing CB Insights credentials. Check .env file.');
  }

  console.log('[CBI Proxy] Requesting new authentication token...');

  const response = await fetch(`${BASE_URL}/authorize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clientId: CID,
      clientSecret: CSEC,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Authentication failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  tokenCache = {
    token: data.token,
    expiration: Date.now() + 3600000, // 1 hour
  };

  console.log('[CBI Proxy] Authentication successful ✓');
  return tokenCache.token;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CB Insights proxy server is running' });
});

// ChatCBI endpoint
app.post('/api/chatcbi', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ 
        status: 'error', 
        msg: 'Message is required' 
      });
    }

    console.log('[CBI Proxy] Received question:', message);

    const token = await getToken();

    console.log('[CBI Proxy] Making ChatCBI request...');
    const response = await fetch(`${BASE_URL}/chatcbi`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[CBI Proxy] ChatCBI request failed:', response.status, errorText);
      return res.status(response.status).json({
        status: 'error',
        code: response.status,
        msg: `Request failed: ${errorText}`,
      });
    }

    const data = await response.json();
    console.log('[CBI Proxy] ChatCBI response received ✓');
    
    res.json({
      status: 'success',
      ...data,
    });
  } catch (error) {
    console.error('[CBI Proxy] Error:', error);
    res.status(500).json({
      status: 'error',
      code: 500,
      msg: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 CB Insights Proxy Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 ChatCBI endpoint: http://localhost:${PORT}/api/chatcbi\n`);
  
  if (!CID || !CSEC) {
    console.error('⚠️  WARNING: CB Insights credentials not found in .env file!');
    console.error('   Make sure CBI_CLIENT_ID and CBI_CLIENT_SECRET are set.\n');
  }
});
