import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { circularityTrendData } from "@/lib/mockData";

const chartConfig = {
  mci: {
    label: "Material Circularity Index",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "Target",
    color: "hsl(var(--chart-3))",
  },
};

export function CircularityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Circularity Progress</CardTitle>
        <CardDescription>Material Circularity Index (MCI) over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={circularityTrendData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis 
                dataKey="year" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                domain={[0, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`${(value * 100).toFixed(0)}%`, 'MCI']}
              />
              <ReferenceLine 
                y={0.7} 
                stroke="hsl(var(--chart-3))" 
                strokeDasharray="5 5" 
                label={{ value: '2025 Target', position: 'right', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Bar 
                dataKey="mci" 
                fill="hsl(var(--chart-1))" 
                radius={[4, 4, 0, 0]}
                name="MCI"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
