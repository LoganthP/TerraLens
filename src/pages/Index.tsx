import { Layout } from "@/components/layout/Layout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SustainabilityGauge } from "@/components/dashboard/SustainabilityGauge";
import { EmissionsChart } from "@/components/dashboard/EmissionsChart";
import { ImpactBreakdown } from "@/components/dashboard/ImpactBreakdown";
import { CircularityChart } from "@/components/dashboard/CircularityChart";
import { AIRecommendations } from "@/components/dashboard/AIRecommendations";
import { ProjectsList } from "@/components/dashboard/ProjectsList";
import { CircularityMetricsCard } from "@/components/dashboard/CircularityMetrics";
import { mockSustainabilityScore, mockProjects } from "@/lib/mockData";
import { 
  Factory, 
  Leaf, 
  Droplets, 
  Zap, 
  Recycle 
} from "lucide-react";

const Index = () => {
  // Calculate aggregate stats from mock projects
  const totalEmissions = mockProjects.reduce(
    (sum, p) => sum + p.totalImpact.globalWarmingPotential, 
    0
  );
  const avgCircularity = Math.round(
    mockProjects.reduce((sum, p) => sum + p.totalImpact.circularityScore, 0) / mockProjects.length
  );
  const totalWater = mockProjects.reduce(
    (sum, p) => sum + p.totalImpact.waterFootprint, 
    0
  );
  const totalEnergy = mockProjects.reduce(
    (sum, p) => sum + p.totalImpact.energyDemand, 
    0
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Life Cycle Assessment Dashboard
          </h1>
          <p className="text-muted-foreground">
            AI-driven environmental impact analysis for metallurgy and mining operations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total CO₂ Emissions"
            value={(totalEmissions / 1000).toFixed(1)}
            unit="tonnes"
            change={12}
            changeLabel="reduction YTD"
            trend="down"
            icon={<Factory className="h-5 w-5" />}
          />
          <StatsCard
            title="Circularity Index"
            value={avgCircularity}
            unit="%"
            change={8}
            changeLabel="improvement"
            trend="down"
            icon={<Recycle className="h-5 w-5" />}
          />
          <StatsCard
            title="Water Footprint"
            value={totalWater}
            unit="m³"
            change={5}
            changeLabel="reduction"
            trend="down"
            icon={<Droplets className="h-5 w-5" />}
          />
          <StatsCard
            title="Energy Demand"
            value={(totalEnergy / 1000).toFixed(1)}
            unit="GJ"
            change={3}
            changeLabel="increase"
            trend="up"
            icon={<Zap className="h-5 w-5" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-3">
          <EmissionsChart />
          <SustainabilityGauge score={mockSustainabilityScore} />
        </div>

        {/* Impact & Circularity */}
        <div className="grid gap-4 md:grid-cols-2">
          <ImpactBreakdown />
          <CircularityChart />
        </div>

        {/* Circularity Metrics */}
        <CircularityMetricsCard />

        {/* AI Recommendations */}
        <AIRecommendations />

        {/* Projects */}
        <ProjectsList />
      </div>
    </Layout>
  );
};

export default Index;
