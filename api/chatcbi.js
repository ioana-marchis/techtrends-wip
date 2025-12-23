/**
 * Vercel Serverless Function for CB Insights API Proxy
 * Handles authentication and requests to avoid CORS issues
 */

const BASE_URL = 'https://api.cbinsights.com/v2';
const CID = process.env.CBI_CLIENT_ID;
const CSEC = process.env.CBI_CLIENT_SECRET;

// Token cache (Note: This is per-instance, Vercel may create multiple instances)
let tokenCache = {
  token: '',
  expiration: 0
};

// Get authentication token
async function getToken() {
  // Return cached token if still valid (>60 seconds until expiry)
  if (tokenCache.expiration - Date.now() > 60000) {
    return tokenCache.token;
  }

  if (!CID || !CSEC) {
    throw new Error('Missing CB Insights credentials. Set CBI_CLIENT_ID and CBI_CLIENT_SECRET environment variables.');
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

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      status: 'error',
      msg: 'Method not allowed' 
    });
  }

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
    
    return res.status(200).json({
      status: 'success',
      ...data,
    });
  } catch (error) {
    console.error('[CBI Proxy] Error:', error);
    return res.status(500).json({
      status: 'error',
      code: 500,
      msg: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
