/**
 * CBI Top Trends Component
 * Displays top tech trends from CB Insights with auto-refresh
 */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp } from "lucide-react";
import { chatCBI } from "@/lib/cbinsights";
import { CBITopTrendsConfig } from "@/config/cbiTopTrends";

interface Trend {
  priority: number;
  name: string;
}

export default function CBITopTrends() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const parseTrends = (text: string): Trend[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const parsed: Trend[] = [];

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
  };

  const fetchTrends = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('[CBI Top Trends] Fetching trends...');
      
      // Try to fetch from local proxy first (for development)
      try {
        const response = await chatCBI(CBITopTrendsConfig.query);

        if (response.status === 'success' && response.answer) {
          const parsedTrends = parseTrends(response.answer);
          const limited = CBITopTrendsConfig.maxTrends 
            ? parsedTrends.slice(0, CBITopTrendsConfig.maxTrends)
            : parsedTrends;
          setTrends(limited);
          setLastUpdate(new Date());
          console.log('[CBI Top Trends] Fetched', limited.length, 'trends from proxy');
          return;
        }
      } catch (proxyErr) {
        console.log('[CBI Top Trends] Proxy unavailable, trying static data...');
      }

      // Fallback to static JSON data (for production/GitHub Pages)
      const staticResponse = await fetch('/techtrends-wip/data/cbi-trends.json');
      if (staticResponse.ok) {
        const data = await staticResponse.json();
        const limited = CBITopTrendsConfig.maxTrends 
          ? data.trends.slice(0, CBITopTrendsConfig.maxTrends)
          : data.trends;
        setTrends(limited);
        setLastUpdate(new Date(data.lastUpdate));
        console.log('[CBI Top Trends] Loaded', limited.length, 'trends from static data');
      } else {
        setError('Unable to load trends data');
      }
    } catch (err) {
      console.error('[CBI Top Trends] Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchTrends();

    // Set up interval for auto-refresh if enabled
    if (!CBITopTrendsConfig.autoRefresh) return;

    const interval = setInterval(fetchTrends, CBITopTrendsConfig.refreshInterval);

    return () => clearInterval(interval);
  }, []);

  const formatLastUpdate = () => {
    if (!lastUpdate) return '';
    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-bold">{CBITopTrendsConfig.title}</CardTitle>
        </div>
        {CBITopTrendsConfig.showLastUpdate && lastUpdate && (
          <span className="text-xs text-muted-foreground">
            {formatLastUpdate()}
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Loading State */}
        {isLoading && trends.length === 0 && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="ml-2 text-xs text-muted-foreground">
              Loading trends...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-xs bg-destructive/10 rounded-lg p-3 space-y-2">
            <p className="text-destructive font-medium">Unable to load trends</p>
            <p className="text-muted-foreground">
              {error.includes("proxy server") 
                ? "CB Insights requires a backend proxy server. This feature is available in local development mode."
                : error
              }
            </p>
          </div>
        )}

        {/* Trends List */}
        {!error && trends.length > 0 && (
          <div className="space-y-2">
            {trends.map((trend) => (
              <div
                key={trend.priority}
                className="flex items-start gap-3 p-3 rounded-lg border border-border"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {trend.priority}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {trend.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && trends.length === 0 && (
          <div className="text-center py-6 text-xs text-muted-foreground">
            No trends available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
