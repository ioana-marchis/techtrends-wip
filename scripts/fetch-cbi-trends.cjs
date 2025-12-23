#!/usr/bin/env node

/**
 * Fetch CBI Top Trends Script
 * 
 * This script fetches trends from CB Insights API and saves them to a JSON file
 * that can be consumed by the frontend without needing a backend proxy.
 * 
 * Usage:
 *   node scripts/fetch-cbi-trends.js
 * 
 * Environment Variables:
 *   CBI_CLIENT_ID - CB Insights Client ID
 *   CBI_CLIENT_SECRET - CB Insights Client Secret
 *   CBI_TOP_TRENDS_QUERY - Query to send to CB Insights (optional)
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Load environment variables if running locally
if (fs.existsSync('.env.local')) {
  require('dotenv').config({ path: '.env.local' });
}

const CBI_CLIENT_ID = process.env.CBI_CLIENT_ID;
const CBI_CLIENT_SECRET = process.env.CBI_CLIENT_SECRET;
const CBI_TOP_TRENDS_QUERY = process.env.CBI_TOP_TRENDS_QUERY || 
  'Get an ordered list of the latest top tech trends from the World Economic forum. Show the output in the format: <output>trend priority. name of the trend</output>. Do not display any other characters in the response, not even citations.';

const CB_INSIGHTS_BASE_URL = 'https://api.cbinsights.com/v2';
const CB_INSIGHTS_AUTH_URL = `${CB_INSIGHTS_BASE_URL}/authorize`;
const CB_INSIGHTS_CHAT_URL = `${CB_INSIGHTS_BASE_URL}/chatcbi`;

/**
 * Get authentication token from CB Insights
 */
async function getAuthToken() {
  console.log('[CBI Fetch] Requesting authentication token...');
  
  const response = await fetch(CB_INSIGHTS_AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clientId: CBI_CLIENT_ID,
      clientSecret: CBI_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Auth failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log('[CBI Fetch] Authentication successful ✓');
  console.log('[CBI Fetch] Response keys:', Object.keys(data));
  const token = data.jwt || data.token || data.access_token;
  console.log('[CBI Fetch] Token received (first 20 chars):', token?.substring(0, 20) + '...');
  return token;
}

/**
 * Query CB Insights ChatCBI API
 */
async function queryChatCBI(token, question) {
  console.log('[CBI Fetch] Querying ChatCBI...');
  console.log('[CBI Fetch] Query:', question);
  
  const response = await fetch(CB_INSIGHTS_CHAT_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: question }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ChatCBI query failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log('[CBI Fetch] Query successful ✓');
  return data;
}

/**
 * Parse trends from CB Insights response
 */
function parseTrends(text) {
  const lines = text.split('\n').filter(line => line.trim());
  const parsed = [];

  for (const line of lines) {
    // Match format: "1. Trend Name" or "1 Trend Name"
    const match = line.match(/^\s*(\d+)[\.\s]+(.+)$/);
    if (match) {
      parsed.push({
        priority: parseInt(match[1]),
        name: match[2].trim(),
      });
    }
  }

  return parsed;
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(50));
  console.log('CBI Top Trends Fetcher');
  console.log('='.repeat(50));

  // Validate environment variables
  if (!CBI_CLIENT_ID || !CBI_CLIENT_SECRET) {
    console.error('❌ Error: Missing CB Insights credentials');
    console.error('Please set CBI_CLIENT_ID and CBI_CLIENT_SECRET environment variables');
    process.exit(1);
  }

  try {
    // Get authentication token
    const token = await getAuthToken();

    // Query ChatCBI
    const response = await queryChatCBI(token, CBI_TOP_TRENDS_QUERY);

    // Parse the response
    const rawAnswer = response.message || response.answer || '';
    const trends = parseTrends(rawAnswer);

    console.log(`[CBI Fetch] Parsed ${trends.length} trends`);

    // Prepare output data
    const output = {
      lastUpdate: new Date().toISOString(),
      query: CBI_TOP_TRENDS_QUERY,
      trends: trends,
      rawResponse: rawAnswer,
      sources: response.sources || [],
    };

    // Ensure output directory exists
    const outputDir = path.join(__dirname, '..', 'public', 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log('[CBI Fetch] Created output directory:', outputDir);
    }

    // Write to file
    const outputPath = path.join(outputDir, 'cbi-trends.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    
    console.log('[CBI Fetch] ✓ Data saved to:', outputPath);
    console.log('[CBI Fetch] ✓ Trends:', trends.map(t => `${t.priority}. ${t.name}`).join(', '));
    console.log('='.repeat(50));
    console.log('✅ Success! CBI Top Trends data updated');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('='.repeat(50));
    console.error('❌ Error fetching CBI Top Trends:');
    console.error(error.message);
    console.error('='.repeat(50));
    process.exit(1);
  }
}

// Run the script
main();
