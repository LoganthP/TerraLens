import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingDown, Droplets, Zap, Recycle, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLcaProjects } from "@/hooks/useLcaProjects";
import { mockProjects } from "@/lib/mockData";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
} from "recharts";

const chartConfig = {
    value: { label: "Value", color: "hsl(var(--primary))" },
    carbon: { label: "Carbon", color: "hsl(var(--chart-1))" },
    water: { label: "Water", color: "hsl(var(--chart-2))" },
    energy: { label: "Energy", color: "hsl(var(--chart-3))" },
    circularity: { label: "Circularity", color: "hsl(var(--chart-4))" },
};

const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

const ProjectAnalysis = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { data: dbProjects } = useLcaProjects();

    // Find project from database or mock data
    const allProjects = [...(dbProjects || []), ...mockProjects];
    const project = allProjects.find((p) => p.id === projectId);

    if (!project) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <h2 className="text-2xl font-bold">Project Not Found</h2>
                    <Button onClick={() => navigate("/projects")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Projects
                    </Button>
                </div>
            </Layout>
        );
    }

    const impact = project.totalImpact;
    const circularityScore = impact.circularityScore;

    // Prepare data for charts
    const impactData = [
        { name: "Acidification", value: impact.acidificationPotential, unit: "kg SO₂ eq" },
        { name: "Eutrophication", value: impact.eutrophicationPotential, unit: "kg PO₄ eq" },
        { name: "Ozone Depletion", value: impact.ozoneDepletionPotential, unit: "kg CFC-11 eq" },
        { name: "Resource Depletion", value: impact.resourceDepletion, unit: "kg Sb eq" },
        { name: "Human Toxicity", value: impact.humanToxicity, unit: "CTUh" },
        { name: "Ecotoxicity", value: impact.ecotoxicity, unit: "CTUe" },
    ];

    const circularityBreakdown = [
        { name: "Recycled Input", value: Math.round(circularityScore * 0.4) },
        { name: "Recyclability", value: Math.round(circularityScore * 0.5) },
        { name: "Utility Factor", value: Math.round(circularityScore * 0.3) },
    ];

    const radarData = [
        { category: "Carbon", value: Math.min((impact.globalWarmingPotential / 5000) * 100, 100) },
        { category: "Water", value: Math.min((impact.waterFootprint / 200) * 100, 100) },
        { category: "Energy", value: Math.min((impact.energyDemand / 10000) * 100, 100) },
        { category: "Circularity", value: circularityScore },
        { category: "Resource Use", value: Math.max(100 - impact.resourceDepletion * 10, 0) },
    ];

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/projects")}
                            className="mb-2 -ml-2"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Projects
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                        <p className="text-muted-foreground">{project.description}</p>
                    </div>
                    <Badge variant="outline" className="text-sm">
                        {project.systemBoundary.replace("-", " ")}
                    </Badge>
                </div>

                {/* Project Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">Product:</span>
                                <p className="font-medium">{project.productName}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Functional Unit:</span>
                                <p className="font-medium">{project.functionalUnit}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Status:</span>
                                <p className="font-medium capitalize">{project.status.replace("-", " ")}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Created:</span>
                                <p className="font-medium">
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Environmental Impact Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <TrendingDown className="h-4 w-4 text-emerald-500" />
                                Carbon Footprint
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {impact.globalWarmingPotential.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">kg CO₂e</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-blue-500" />
                                Water Footprint
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{impact.waterFootprint}</div>
                            <p className="text-xs text-muted-foreground">m³ water</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                Energy Demand
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{impact.energyDemand}</div>
                            <p className="text-xs text-muted-foreground">MJ energy</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Recycle className="h-4 w-4 text-primary" />
                                Circularity Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{circularityScore}%</div>
                            <Progress
                                value={circularityScore}
                                className={cn(
                                    "h-2 mt-2",
                                    circularityScore >= 70
                                        ? "[&>div]:bg-emerald-500"
                                        : circularityScore >= 50
                                            ? "[&>div]:bg-yellow-500"
                                            : "[&>div]:bg-destructive"
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="impacts">Impact Categories</TabsTrigger>
                        <TabsTrigger value="circularity">Circularity</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <Card>
                            <CardHeader>
                                <CardTitle>Environmental Performance Radar</CardTitle>
                                <CardDescription>
                                    Multi-dimensional view of environmental performance
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={radarData}>
                                            <PolarGrid className="stroke-muted" />
                                            <PolarAngleAxis
                                                dataKey="category"
                                                tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                                            />
                                            <PolarRadiusAxis
                                                angle={90}
                                                domain={[0, 100]}
                                                tick={{ fontSize: 10 }}
                                            />
                                            <Radar
                                                name="Performance"
                                                dataKey="value"
                                                stroke="hsl(var(--primary))"
                                                fill="hsl(var(--primary))"
                                                fillOpacity={0.6}
                                            />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="impacts">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detailed Environmental Impact Categories</CardTitle>
                                <CardDescription>
                                    Breakdown of environmental impacts across different categories
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={impactData}
                                            layout="vertical"
                                            margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                            <XAxis type="number" tick={{ fontSize: 12 }} />
                                            <YAxis
                                                type="category"
                                                dataKey="name"
                                                tick={{ fontSize: 12 }}
                                                width={110}
                                            />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                                {impactData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="circularity">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5 text-primary" />
                                        Circularity Breakdown
                                    </CardTitle>
                                    <CardDescription>
                                        Components contributing to overall circularity score
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={circularityBreakdown}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, value }) => `${name}: ${value}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {circularityBreakdown.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Circularity Performance</CardTitle>
                                    <CardDescription>
                                        Material circularity assessment for {project.productName}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Overall Circularity Score</span>
                                            <span
                                                className={cn(
                                                    "text-lg font-bold",
                                                    circularityScore >= 70
                                                        ? "text-emerald-600"
                                                        : circularityScore >= 50
                                                            ? "text-yellow-600"
                                                            : "text-destructive"
                                                )}
                                            >
                                                {circularityScore}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={circularityScore}
                                            className={cn(
                                                "h-3",
                                                circularityScore >= 70
                                                    ? "[&>div]:bg-emerald-500"
                                                    : circularityScore >= 50
                                                        ? "[&>div]:bg-yellow-500"
                                                        : "[&>div]:bg-destructive"
                                            )}
                                        />
                                        <div className="grid grid-cols-3 gap-4 pt-4">
                                            {circularityBreakdown.map((item, index) => (
                                                <div key={index} className="text-center p-3 rounded-lg bg-muted/50">
                                                    <p className="text-2xl font-bold text-primary">{item.value}%</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{item.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
};

export default ProjectAnalysis;
