import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Recycle, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Target
} from "lucide-react";
import { QuickActionsCard } from "@/components/circularity/QuickActionsCard";
import { mockCircularityMetrics, circularityTrendData } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine
} from "recharts";

const materialFlowData = [
  { stage: 'Raw Materials', virgin: 68, recycled: 32 },
  { stage: 'Manufacturing', virgin: 65, recycled: 35 },
  { stage: 'Distribution', virgin: 70, recycled: 30 },
  { stage: 'Use Phase', virgin: 72, recycled: 28 },
  { stage: 'End of Life', virgin: 15, recycled: 85 },
];

const chartConfig = {
  virgin: { label: "Virgin Materials", color: "hsl(var(--chart-4))" },
  recycled: { label: "Recycled Materials", color: "hsl(var(--chart-1))" },
  mci: { label: "MCI", color: "hsl(var(--chart-1))" },
  target: { label: "Target", color: "hsl(var(--chart-3))" },
};

const Circularity = () => {
  const metrics = mockCircularityMetrics;
  const mciPercentage = Math.round(metrics.materialCircularityIndex * 100);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Recycle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Circularity Analysis</h1>
          </div>
          <p className="text-muted-foreground">
            Track and optimize material flows for a circular economy
          </p>
        </div>

        {/* MCI Overview */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Material Circularity Index (MCI)</CardTitle>
              <CardDescription>
                Based on Ellen MacArthur Foundation methodology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                {/* Gauge */}
                <div className="relative shrink-0">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="14"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="14"
                      fill="none"
                      strokeDasharray={`${(mciPercentage / 100) * 440} 440`}
                      className="text-primary"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{mciPercentage}%</span>
                    <span className="text-sm text-muted-foreground">MCI Score</span>
                  </div>
                </div>
                
                {/* Details */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-1">
                        <ArrowUpCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Recycled Input</span>
                      </div>
                      <p className="text-2xl font-bold">{metrics.recycledInputRate}%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-1">
                        <ArrowDownCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Recyclability</span>
                      </div>
                      <p className="text-2xl font-bold">{metrics.recyclabilityRate}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-border/50">
                    <Target className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">2025 Target: 70% MCI</p>
                      <Progress value={(mciPercentage / 70) * 100} className="h-1.5 mt-1" />
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {Math.round((mciPercentage / 70) * 100)}% complete
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <QuickActionsCard />
        </div>

        {/* Charts */}
        <Tabs defaultValue="flow" className="space-y-4">
          <TabsList>
            <TabsTrigger value="flow">Material Flow</TabsTrigger>
            <TabsTrigger value="trend">Historical Trend</TabsTrigger>
          </TabsList>

          <TabsContent value="flow">
            <Card>
              <CardHeader>
                <CardTitle>Material Flow by Lifecycle Stage</CardTitle>
                <CardDescription>
                  Virgin vs recycled material composition across the product lifecycle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={materialFlowData}
                      layout="vertical"
                      margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                      <XAxis 
                        type="number" 
                        domain={[0, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="stage"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        width={90}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="recycled" stackId="a" fill="hsl(var(--chart-1))" name="Recycled" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="virgin" stackId="a" fill="hsl(var(--chart-4))" name="Virgin" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trend">
            <Card>
              <CardHeader>
                <CardTitle>MCI Improvement Over Time</CardTitle>
                <CardDescription>
                  Tracking progress toward circularity goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={circularityTrendData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="year"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[0, 1]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ReferenceLine 
                        y={0.7} 
                        stroke="hsl(var(--chart-3))" 
                        strokeDasharray="5 5" 
                        label={{ value: 'Target', position: 'right', fontSize: 10 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="mci" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2 }}
                        name="MCI"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Strategies */}
        <Card>
          <CardHeader>
            <CardTitle>Circularity Improvement Strategies</CardTitle>
            <CardDescription>
              AI-identified opportunities to enhance material circularity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Increase Scrap Utilization",
                  description: "Boost steel scrap input from 32% to 50% by improving scrap sourcing and quality control",
                  impact: "+12% MCI",
                  effort: "Medium"
                },
                {
                  title: "Slag Valorization Program",
                  description: "Convert blast furnace slag to construction materials instead of landfill disposal",
                  impact: "+8% MCI",
                  effort: "Low"
                },
                {
                  title: "Closed-Loop Water System",
                  description: "Implement ZLD system to recirculate 95% of process water",
                  impact: "+5% MCI",
                  effort: "High"
                }
              ].map((strategy, i) => (
                <div key={i} className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                  <h4 className="font-medium mb-2">{strategy.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-emerald-600 bg-emerald-500/10">
                      {strategy.impact}
                    </Badge>
                    <Badge variant="outline">
                      {strategy.effort} effort
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Circularity;
