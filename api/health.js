/**
 * Health check endpoint for Vercel
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  return res.status(200).json({ 
    status: 'ok', 
    message: 'CB Insights proxy server is running on Vercel',
    timestamp: new Date().toISOString()
  });
}
