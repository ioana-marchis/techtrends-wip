import { useState, useMemo } from "react";
import { TrendingUp, Zap, Globe, RefreshCw } from "lucide-react";
import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import TrendCard from "@/components/dashboard/TrendCard";
import TrendChart from "@/components/dashboard/TrendChart";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import TopTrendsList from "@/components/dashboard/TopTrendsList";
import CBInsightsWidget from "@/components/dashboard/CBInsightsWidget";
import CBInsightsDebug from "@/components/dashboard/CBInsightsDebug";
import { useHackerNewsTrends } from "@/hooks/useHackerNews";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const { data: trends, isLoading, error, refetch, isFetching } = useHackerNewsTrends();

  const filteredTrends = useMemo(() => {
    if (!trends || !searchQuery.trim()) return trends;
    const query = searchQuery.toLowerCase();
    
    // Create a regex pattern for word boundary matching
    // Special case for "AI" to match as whole word only
    const isAISearch = query === 'ai';
    const searchPattern = isAISearch 
      ? /\bai\b/i  // Word boundary for AI
      : new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); // Escape special chars
    
    return trends.filter(
      (trend) => {
        if (isAISearch) {
          // For AI search, use word boundary matching
          return searchPattern.test(trend.title) || 
                 searchPattern.test(trend.category);
        } else {
          // For other searches, use substring matching
          return trend.title.toLowerCase().includes(query) ||
                 trend.category.toLowerCase().includes(query) ||
                 trend.description.toLowerCase().includes(query);
        }
      }
    );
  }, [trends, searchQuery]);

  const stats = [
    { title: "Stories Tracked", value: trends?.length?.toString() || "0", change: "Live from HackerNews", changeType: "positive" as const, icon: TrendingUp },
    { title: "Data Source", value: "HN API", change: "Real-time updates", changeType: "positive" as const, icon: Zap },
    { title: "Categories", value: "6", change: "AI, Cloud, Security, DevOps, Web3, Other", changeType: "neutral" as const, icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h2>
            <p className="text-muted-foreground">Live technology trends from HackerNews.</p>
          </div>
          <button 
            onClick={() => refetch()} 
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <TrendChart />
          <CategoryPieChart />
        </div>

        {/* Trends Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Trending Technologies</h3>
              <span className="text-sm text-muted-foreground">
                {filteredTrends && trends ? (
                  searchQuery.trim() ? 
                    `${filteredTrends.length} of ${trends.length} stories` : 
                    `${filteredTrends.length} stories`
                ) : 'Loading...'}
              </span>
            </div>
            
            {error && (
              <div className="text-destructive text-center py-8">
                Failed to load trends. Please try again.
              </div>
            )}
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-lg" />
                ))}
              </div>
            ) : filteredTrends && filteredTrends.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTrends.slice(0, 6).map((trend) => (
                  <TrendCard key={trend.title} {...trend} />
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No trends found matching "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No trends available</p>
              </div>
            )}
          </div>
          
          {/* Sidebar with CB Insights and Top Trending */}
          <div className="space-y-6">
            <CBInsightsWidget />
            
            {/* Debug Panel Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <Label htmlFor="debug-mode" className="text-sm font-medium cursor-pointer">
                CBI Debug Panel
              </Label>
              <Switch
                id="debug-mode"
                checked={showDebugPanel}
                onCheckedChange={setShowDebugPanel}
              />
            </div>
            
            {/* Conditionally render Debug Panel */}
            {showDebugPanel && <CBInsightsDebug />}
            
            <TopTrendsList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
