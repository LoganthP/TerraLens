import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Recycle, Package, Factory, TrendingUp, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ActionType = "assessment" | "flow" | "waste" | "scenarios" | null;

export function QuickActionsCard() {
  const { toast } = useToast();
  const [activeDialog, setActiveDialog] = useState<ActionType>(null);

  const handleRunAssessment = () => {
    toast({
      title: "Circularity Assessment Started",
      description: "Running material circularity analysis across all operations...",
    });
    setActiveDialog("assessment");
  };

  const handleMaterialFlow = () => {
    toast({
      title: "Material Flow Analysis",
      description: "Loading material flow data across lifecycle stages...",
    });
    setActiveDialog("flow");
  };

  const handleWasteMapping = () => {
    toast({
      title: "Waste Stream Mapping",
      description: "Mapping waste streams across all facilities...",
    });
    setActiveDialog("waste");
  };

  const handleScenarios = () => {
    toast({
      title: "Improvement Scenarios",
      description: "Loading circularity improvement scenarios...",
    });
    setActiveDialog("scenarios");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start" variant="outline" onClick={handleRunAssessment}>
            <Recycle className="h-4 w-4 mr-2" />
            Run Circularity Assessment
          </Button>
          <Button className="w-full justify-start" variant="outline" onClick={handleMaterialFlow}>
            <Package className="h-4 w-4 mr-2" />
            Material Flow Analysis
          </Button>
          <Button className="w-full justify-start" variant="outline" onClick={handleWasteMapping}>
            <Factory className="h-4 w-4 mr-2" />
            Waste Stream Mapping
          </Button>
          <Button className="w-full justify-start" variant="outline" onClick={handleScenarios}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Improvement Scenarios
          </Button>
        </CardContent>
      </Card>

      {/* Assessment Dialog */}
      <Dialog open={activeDialog === "assessment"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Recycle className="h-5 w-5 text-primary" />
              Circularity Assessment Results
            </DialogTitle>
            <DialogDescription>
              Material Circularity Index analysis based on Ellen MacArthur Foundation methodology
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall MCI Score</span>
                <span className="font-medium">58%</span>
              </div>
              <Progress value={58} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Recycled Input</span>
                </div>
                <p className="text-xl font-bold">32%</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Recyclability</span>
                </div>
                <p className="text-xl font-bold">85%</p>
              </div>
            </div>
            <div className="p-3 rounded-lg border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Key Finding</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Increasing scrap utilization from 32% to 50% could improve MCI by +12 percentage points.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Material Flow Dialog */}
      <Dialog open={activeDialog === "flow"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Material Flow Analysis
            </DialogTitle>
            <DialogDescription>
              Virgin vs recycled material composition across lifecycle stages
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            {[
              { stage: "Raw Materials", recycled: 32, virgin: 68 },
              { stage: "Manufacturing", recycled: 35, virgin: 65 },
              { stage: "Distribution", recycled: 30, virgin: 70 },
              { stage: "Use Phase", recycled: 28, virgin: 72 },
              { stage: "End of Life", recycled: 85, virgin: 15 },
            ].map((item) => (
              <div key={item.stage} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{item.stage}</span>
                  <span className="text-muted-foreground">
                    {item.recycled}% recycled / {item.virgin}% virgin
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                  <div 
                    className="bg-primary h-full" 
                    style={{ width: `${item.recycled}%` }} 
                  />
                  <div 
                    className="bg-amber-500 h-full" 
                    style={{ width: `${item.virgin}%` }} 
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 pt-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary" />
                <span>Recycled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500" />
                <span>Virgin</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Waste Stream Dialog */}
      <Dialog open={activeDialog === "waste"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              Waste Stream Mapping
            </DialogTitle>
            <DialogDescription>
              Waste generation and disposal pathways across operations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {[
              { name: "Blast Furnace Slag", volume: "2.4M tons", status: "Valorized", color: "emerald" },
              { name: "Steel Scrap", volume: "1.8M tons", status: "Recycled", color: "emerald" },
              { name: "Fly Ash", volume: "890K tons", status: "Partially Used", color: "amber" },
              { name: "Process Water", volume: "12M liters", status: "Treatment Needed", color: "red" },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.volume}/year</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    item.color === "emerald" 
                      ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10" 
                      : item.color === "amber"
                        ? "text-amber-600 border-amber-500/30 bg-amber-500/10"
                        : "text-red-600 border-red-500/30 bg-red-500/10"
                  }
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Improvement Scenarios Dialog */}
      <Dialog open={activeDialog === "scenarios"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Improvement Scenarios
            </DialogTitle>
            <DialogDescription>
              Projected MCI improvements based on different intervention strategies
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {[
              { name: "Baseline (Current)", mci: 58, improvement: null },
              { name: "Scenario A: Increased Scrap", mci: 70, improvement: "+12%" },
              { name: "Scenario B: Slag Valorization", mci: 66, improvement: "+8%" },
              { name: "Scenario C: Combined", mci: 78, improvement: "+20%" },
            ].map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span>{item.mci}% MCI</span>
                    {item.improvement && (
                      <Badge variant="secondary" className="text-emerald-600 bg-emerald-500/10">
                        {item.improvement}
                      </Badge>
                    )}
                  </div>
                </div>
                <Progress value={item.mci} className="h-2" />
              </div>
            ))}
            <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 flex items-start gap-2">
              <Info className="h-4 w-4 text-primary mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Scenario C (Combined approach) would achieve the 2025 target of 70% MCI with an additional 8% buffer.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
