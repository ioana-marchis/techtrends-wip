import { ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrendCardProps {
  title: string;
  category: string;
  description: string;
  growth: number;
  mentions: string;
  sentiment: "positive" | "negative" | "neutral";
  url?: string;
}

const TrendCard = ({ title, category, description, growth, mentions, sentiment, url }: TrendCardProps) => {
  const isPositive = growth >= 0;
  
  const categoryColors: Record<string, string> = {
    "AI & ML": "bg-primary/10 text-primary",
    "Cloud": "bg-accent/10 text-accent",
    "Security": "bg-destructive/10 text-destructive",
    "DevOps": "bg-[hsl(160_84%_39%)]/10 text-[hsl(160_84%_39%)]",
    "Web3": "bg-[hsl(38_92%_50%)]/10 text-[hsl(38_92%_50%)]",
    "Other": "bg-muted-foreground/10 text-muted-foreground",
  };

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Badge className={`${categoryColors[category] || "bg-secondary text-secondary-foreground"} border-0 font-medium`}>
            {category}
          </Badge>
          <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-[hsl(160_84%_39%)]" : "text-destructive"}`}>
            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {Math.abs(growth)}%
          </div>
        </div>
        
        {url ? (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors hover:underline flex items-start gap-2">
              <span className="flex-1">{title}</span>
              <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-60 group-hover:opacity-100" />
            </h3>
          </a>
        ) : (
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        )}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">{mentions} mentions</span>
          <div className="flex items-center gap-1">
            <div className={`h-2 w-2 rounded-full ${
              sentiment === "positive" ? "bg-[hsl(160_84%_39%)]" : 
              sentiment === "negative" ? "bg-destructive" : "bg-muted-foreground"
            }`} />
            <span className="text-xs text-muted-foreground capitalize">{sentiment}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendCard;
