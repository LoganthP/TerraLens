import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Recycle, ArrowUpCircle, Package, Trash2, CircleDot, Factory } from "lucide-react";
import { mockCircularityMetrics } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import type { CircularityMetrics as CircularityMetricsType } from "@/types/lca";

interface MetricItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  description: string;
}

function MetricItem({ icon, label, value, suffix = '%', description }: MetricItemProps) {
  const getColorClass = (val: number) => {
    if (val >= 70) return 'text-emerald-600 [&>div]:bg-emerald-500';
    if (val >= 50) return 'text-yellow-600 [&>div]:bg-yellow-500';
    return 'text-destructive [&>div]:bg-destructive';
  };

  return (
    <div className="space-y-2 p-3 rounded-lg bg-muted/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-[10px] text-muted-foreground">{description}</p>
          </div>
        </div>
        <span className={cn("text-lg font-bold", getColorClass(value))}>
          {suffix === 'x' ? value.toFixed(2) : value}{suffix}
        </span>
      </div>
      <Progress 
        value={suffix === 'x' ? value * 100 : value} 
        className={cn("h-1.5", getColorClass(value))}
      />
    </div>
  );
}

export function CircularityMetricsCard() {
  const metrics = mockCircularityMetrics;
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Recycle className="h-5 w-5 text-primary" />
          <CardTitle>Circularity Performance Metrics</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <MetricItem
            icon={<ArrowUpCircle className="h-4 w-4" />}
            label="Recycled Input Rate"
            value={metrics.recycledInputRate}
            description="% of input materials from recycled sources"
          />
          <MetricItem
            icon={<Recycle className="h-4 w-4" />}
            label="Recyclability Rate"
            value={metrics.recyclabilityRate}
            description="% of output that can be recycled"
          />
          <MetricItem
            icon={<Package className="h-4 w-4" />}
            label="Resource Efficiency"
            value={metrics.resourceEfficiency}
            description="Material utilization effectiveness"
          />
          <MetricItem
            icon={<Trash2 className="h-4 w-4" />}
            label="Waste Reduction"
            value={metrics.wasteReductionRate}
            description="Waste diverted from landfill"
          />
          <MetricItem
            icon={<CircleDot className="h-4 w-4" />}
            label="Material Circularity Index"
            value={metrics.materialCircularityIndex}
            suffix="x"
            description="Ellen MacArthur Foundation MCI"
          />
          <MetricItem
            icon={<Factory className="h-4 w-4" />}
            label="Byproduct Utilization"
            value={metrics.byproductUtilization}
            description="Industrial byproducts recovered"
          />
        </div>
      </CardContent>
    </Card>
  );
}
