import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", ai: 4000, cloud: 2400, security: 2400 },
  { month: "Feb", ai: 3000, cloud: 1398, security: 2210 },
  { month: "Mar", ai: 2000, cloud: 9800, security: 2290 },
  { month: "Apr", ai: 2780, cloud: 3908, security: 2000 },
  { month: "May", ai: 1890, cloud: 4800, security: 2181 },
  { month: "Jun", ai: 2390, cloud: 3800, security: 2500 },
  { month: "Jul", ai: 3490, cloud: 4300, security: 2100 },
  { month: "Aug", ai: 4200, cloud: 4100, security: 2800 },
  { month: "Sep", ai: 5100, cloud: 4500, security: 3100 },
  { month: "Oct", ai: 6200, cloud: 5200, security: 3400 },
  { month: "Nov", ai: 7500, cloud: 5800, security: 3900 },
  { month: "Dec", ai: 8900, cloud: 6100, security: 4200 },
];

const TrendChart = () => {
  return (
    <Card className="border-0 shadow-md col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Trend Growth Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCloud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSecurity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" stroke="hsl(220, 10%, 46%)" fontSize={12} />
              <YAxis stroke="hsl(220, 10%, 46%)" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(0, 0%, 100%)", 
                  border: "none", 
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }} 
              />
              <Area
                type="monotone"
                dataKey="ai"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAi)"
                name="AI & ML"
              />
              <Area
                type="monotone"
                dataKey="cloud"
                stroke="hsl(262, 83%, 58%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCloud)"
                name="Cloud"
              />
              <Area
                type="monotone"
                dataKey="security"
                stroke="hsl(160, 84%, 39%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSecurity)"
                name="Security"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">AI & ML</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-accent" />
            <span className="text-sm text-muted-foreground">Cloud</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(160_84%_39%)]" />
            <span className="text-sm text-muted-foreground">Security</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendChart;
