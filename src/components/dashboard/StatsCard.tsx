import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

const StatsCard = ({ title, value, change, changeType, icon: Icon }: StatsCardProps) => {
  const changeColor = {
    positive: "text-[hsl(160_84%_39%)]",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            <p className={`text-sm font-medium ${changeColor[changeType]}`}>
              {change}
            </p>
          </div>
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
