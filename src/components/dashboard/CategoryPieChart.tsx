import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "AI & ML", value: 35 },
  { name: "Cloud", value: 25 },
  { name: "Security", value: 18 },
  { name: "DevOps", value: 12 },
  { name: "Web3", value: 10 },
];

const COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(262, 83%, 58%)",
  "hsl(160, 84%, 39%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 84%, 60%)",
];

const CategoryPieChart = () => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(0, 0%, 100%)", 
                  border: "none", 
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
                formatter={(value: number) => [`${value}%`, "Share"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: COLORS[index] }} 
              />
              <span className="text-xs text-muted-foreground">{item.name}</span>
              <span className="text-xs font-semibold text-foreground ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;
