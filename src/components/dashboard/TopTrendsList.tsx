import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Flame, ExternalLink } from "lucide-react";
import { useHackerNewsTopTrends } from "@/hooks/useHackerNews";
import { Skeleton } from "@/components/ui/skeleton";

const categoryColors: Record<string, string> = {
  "AI & ML": "text-primary",
  "Cloud": "text-accent",
  "Security": "text-destructive",
  "DevOps": "text-[hsl(160_84%_39%)]",
  "Web3": "text-[hsl(38_92%_50%)]",
  "Other": "text-muted-foreground",
};

const TopTrendsList = () => {
  const { data: trends, isLoading } = useHackerNewsTopTrends();

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold">Top Trending</CardTitle>
        <span className="text-xs text-muted-foreground">Live</span>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))
        ) : (
          trends?.map((trend) => {
            const content = (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
                  {trend.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {trend.name}
                    </p>
                    {trend.hot && <Flame className="h-4 w-4 text-[hsl(38_92%_50%)] fill-[hsl(38_92%_50%)]" />}
                    {trend.url && <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />}
                  </div>
                  <p className={`text-xs ${categoryColors[trend.category] || "text-muted-foreground"}`}>
                    {trend.category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{trend.score}</span>
                  <ArrowUpRight className="h-4 w-4 text-[hsl(160_84%_39%)]" />
                </div>
              </>
            );

            return trend.url ? (
              <a
                key={trend.rank}
                href={trend.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
              >
                {content}
              </a>
            ) : (
              <div
                key={trend.rank}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
              >
                {content}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default TopTrendsList;
