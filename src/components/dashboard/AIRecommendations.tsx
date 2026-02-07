import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lightbulb, TrendingDown, Clock, DollarSign, ArrowRight, CheckCircle2 } from "lucide-react";
import { mockRecommendations } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import type { AIRecommendation } from "@/types/lca";

const typeIcons = {
  'process-optimization': '⚙️',
  'material-substitution': '🔄',
  'energy-efficiency': '⚡',
  'waste-reduction': '♻️',
  'circularity': '🔁'
};

const priorityColors = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  low: 'bg-muted text-muted-foreground border-border'
};

function RecommendationCard({ 
  recommendation, 
  onDetails 
}: { 
  recommendation: AIRecommendation;
  onDetails: (rec: AIRecommendation) => void;
}) {
  return (
    <div className="group p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-accent/50 transition-all">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{typeIcons[recommendation.type]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-medium text-sm leading-tight">{recommendation.title}</h4>
            <Badge 
              variant="outline" 
              className={cn("shrink-0 text-[10px]", priorityColors[recommendation.priority])}
            >
              {recommendation.priority}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {recommendation.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-emerald-500" />
              {recommendation.potentialImpactReduction}% reduction
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {recommendation.implementationCost}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {recommendation.implementationTime}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-[10px] text-muted-foreground">Confidence:</span>
              <Progress value={recommendation.confidence} className="h-1.5 flex-1 max-w-[100px]" />
              <span className="text-[10px] font-medium">{recommendation.confidence}%</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDetails(recommendation)}
            >
              Details <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AIRecommendations() {
  const navigate = useNavigate();
  const [selectedRec, setSelectedRec] = useState<AIRecommendation | null>(null);

  const topRecommendations = mockRecommendations
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 4);

  const handleViewAll = () => {
    navigate("/insights");
  };

  return (
    <>
      <Card className="col-span-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <CardTitle>AI-Powered Recommendations</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={handleViewAll}>
              View All
            </Button>
          </div>
          <CardDescription>
            Machine learning insights for reducing environmental impact and improving circularity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {topRecommendations.map((rec) => (
              <RecommendationCard 
                key={rec.id} 
                recommendation={rec} 
                onDetails={setSelectedRec}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={!!selectedRec} onOpenChange={(open) => !open && setSelectedRec(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRec && <span className="text-xl">{typeIcons[selectedRec.type]}</span>}
              {selectedRec?.title}
            </DialogTitle>
            <DialogDescription>
              AI-generated recommendation for environmental impact reduction
            </DialogDescription>
          </DialogHeader>
          {selectedRec && (
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">{selectedRec.description}</p>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <TrendingDown className="h-4 w-4 mx-auto text-emerald-500 mb-1" />
                  <p className="text-lg font-bold">{selectedRec.potentialImpactReduction}%</p>
                  <p className="text-[10px] text-muted-foreground">Impact Reduction</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <DollarSign className="h-4 w-4 mx-auto mb-1" />
                  <p className="text-lg font-bold capitalize">{selectedRec.implementationCost}</p>
                  <p className="text-[10px] text-muted-foreground">Cost</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <Clock className="h-4 w-4 mx-auto mb-1" />
                  <p className="text-lg font-bold capitalize">{selectedRec.implementationTime}</p>
                  <p className="text-[10px] text-muted-foreground">Timeline</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Confidence Score</span>
                  <span className="font-medium">{selectedRec.confidence}%</span>
                </div>
                <Progress value={selectedRec.confidence} className="h-2" />
              </div>

              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Expected Outcome</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Implementing this recommendation could reduce environmental impact by approximately{" "}
                  {selectedRec.potentialImpactReduction}% within {selectedRec.implementationTime}.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
