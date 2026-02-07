import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingDown, 
  Clock, 
  DollarSign, 
  ArrowRight,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIRecommendation } from "@/types/lca";

const typeLabels = {
  'process-optimization': { label: 'Process Optimization', icon: '⚙️' },
  'material-substitution': { label: 'Material Substitution', icon: '🔄' },
  'energy-efficiency': { label: 'Energy Efficiency', icon: '⚡' },
  'waste-reduction': { label: 'Waste Reduction', icon: '♻️' },
  'circularity': { label: 'Circularity', icon: '🔁' }
};

const priorityColors = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  low: 'bg-muted text-muted-foreground border-border'
};

interface InsightCardProps {
  recommendation: AIRecommendation;
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
  onDetails: (recommendation: AIRecommendation) => void;
}

export function InsightCard({ recommendation, onAccept, onDismiss, onDetails }: InsightCardProps) {
  const typeInfo = typeLabels[recommendation.type];
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{typeInfo.icon}</span>
            <Badge variant="secondary">{typeInfo.label}</Badge>
          </div>
          <Badge variant="outline" className={cn(priorityColors[recommendation.priority])}>
            {recommendation.priority} priority
          </Badge>
        </div>
        <CardTitle className="text-lg mt-2">{recommendation.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{recommendation.description}</p>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-center">
            <TrendingDown className="h-4 w-4 mx-auto mb-1 text-emerald-600" />
            <p className="text-lg font-bold text-emerald-600">{recommendation.potentialImpactReduction}%</p>
            <p className="text-[10px] text-muted-foreground">Impact Reduction</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <DollarSign className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold capitalize">{recommendation.implementationCost}</p>
            <p className="text-[10px] text-muted-foreground">Cost</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold capitalize">{recommendation.implementationTime}</p>
            <p className="text-[10px] text-muted-foreground">Timeline</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">AI Confidence:</span>
            <Progress value={recommendation.confidence} className="h-2 w-24" />
            <span className="text-xs font-medium">{recommendation.confidence}%</span>
          </div>
        </div>

        <div className="pt-3 border-t border-border/50 flex items-center justify-between">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onAccept(recommendation.id)}>
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Accept
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDismiss(recommendation.id)}>
              <XCircle className="h-3 w-3 mr-1" />
              Dismiss
            </Button>
          </div>
          <Button size="sm" onClick={() => onDetails(recommendation)}>
            Details <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
