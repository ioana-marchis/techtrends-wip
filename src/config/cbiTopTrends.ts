/**
 * Configuration for CBI Top Trends Component
 * 
 * Edit this file to customize the CBI Top Trends behavior:
 * - Change the query to get different insights
 * - Adjust refresh interval (default: 1 hour)
 * - Control how many trends are displayed
 */

export const CBITopTrendsConfig = {
  /**
   * Query sent to CB Insights API
   * 
   * Tips for customizing:
   * - Change "World Economic forum" to any other source
   * - Modify the output format as needed
   * - Keep the format instruction for proper parsing
   * 
   * Examples:
   * - "Get top AI trends from Gartner..."
   * - "Get emerging technologies from McKinsey..."
   * - "Get cybersecurity trends from NIST..."
   */
  query: 'Get an ordered list of the latest top tech trends from the World Economic forum. Show the output in the format: <output>trend priority. name of the trend</output>. Do not display any other characters in the response, not even citations.',
  
  /**
   * Refresh interval in milliseconds
   * 
   * Common values:
   * - 5 minutes: 5 * 60 * 1000
   * - 30 minutes: 30 * 60 * 1000
   * - 1 hour: 60 * 60 * 1000 (default)
   * - 6 hours: 6 * 60 * 60 * 1000
   * - 24 hours: 24 * 60 * 60 * 1000
   */
  refreshInterval: 60 * 60 * 1000, // 1 hour
  
  /**
   * Maximum number of trends to display
   * 
   * Set to null or undefined to show all trends
   */
  maxTrends: 10,
  
  /**
   * Enable/disable automatic refresh
   * 
   * If false, trends will only be fetched on initial load
   * or when manually refreshed
   */
  autoRefresh: true,
  
  /**
   * Component title
   * 
   * The title displayed in the card header
   */
  title: 'CBI Top Trends',
  
  /**
   * Show last update timestamp
   */
  showLastUpdate: true,
};
