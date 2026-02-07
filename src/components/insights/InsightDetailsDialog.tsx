import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Download,
  FileText,
  Brain,
  CheckCircle2,
  XCircle,
  Sparkles
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

interface InsightDetailsDialogProps {
  recommendation: AIRecommendation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
  onDownloadReport: (recommendation: AIRecommendation) => void;
  onDownloadAIAnalysis: (recommendation: AIRecommendation) => void;
}

export function InsightDetailsDialog({
  recommendation,
  open,
  onOpenChange,
  onAccept,
  onDismiss,
  onDownloadReport,
  onDownloadAIAnalysis
}: InsightDetailsDialogProps) {
  if (!recommendation) return null;

  const typeInfo = typeLabels[recommendation.type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">{typeInfo.icon}</span>
            <Badge variant="secondary">{typeInfo.label}</Badge>
            <Badge variant="outline" className={cn(priorityColors[recommendation.priority])}>
              {recommendation.priority} priority
            </Badge>
          </div>
          <DialogTitle className="text-xl">{recommendation.title}</DialogTitle>
          <DialogDescription>{recommendation.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-emerald-500/10 text-center">
              <TrendingDown className="h-5 w-5 mx-auto mb-2 text-emerald-600" />
              <p className="text-2xl font-bold text-emerald-600">{recommendation.potentialImpactReduction}%</p>
              <p className="text-xs text-muted-foreground">Potential Impact Reduction</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <DollarSign className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-bold capitalize">{recommendation.implementationCost}</p>
              <p className="text-xs text-muted-foreground">Implementation Cost</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-bold capitalize">{recommendation.implementationTime}</p>
              <p className="text-xs text-muted-foreground">Timeline</p>
            </div>
          </div>

          {/* AI Confidence */}
          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-primary" />
              <h4 className="font-medium">AI Confidence Score</h4>
            </div>
            <div className="flex items-center gap-4">
              <Progress value={recommendation.confidence} className="h-3 flex-1" />
              <span className="text-lg font-bold">{recommendation.confidence}%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This recommendation is based on analysis of historical data, industry benchmarks, and environmental impact models.
            </p>
          </div>

          {/* Implementation Details */}
          <div className="p-4 rounded-lg border border-border">
            <h4 className="font-medium mb-3">Implementation Details</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Review current operational parameters and identify optimization opportunities</p>
              <p>• Conduct feasibility study with engineering team</p>
              <p>• Develop phased implementation plan</p>
              <p>• Monitor and measure impact reduction metrics</p>
              <p>• Document best practices for future reference</p>
            </div>
          </div>

          {/* Expected Outcomes */}
          <div className="p-4 rounded-lg border border-border">
            <h4 className="font-medium mb-3">Expected Outcomes</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Reduced carbon footprint by {recommendation.potentialImpactReduction}%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Improved operational efficiency</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Enhanced sustainability compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Cost savings over implementation period</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Download Options */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onDownloadReport(recommendation)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onDownloadAIAnalysis(recommendation)}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Download AI Analysis
            </Button>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="ghost" onClick={() => onDismiss(recommendation.id)}>
            <XCircle className="h-4 w-4 mr-2" />
            Dismiss
          </Button>
          <Button onClick={() => onAccept(recommendation.id)}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Accept & Implement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
