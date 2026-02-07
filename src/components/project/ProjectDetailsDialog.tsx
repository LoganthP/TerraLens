import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileText, Calendar, TrendingDown, Droplets, Zap, Edit, Trash2, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { LCAProject } from "@/types/lca";
import { useState } from "react";
import { toast } from "sonner";

const statusColors = {
  draft: "bg-muted text-muted-foreground",
  "in-progress": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  archived: "bg-muted text-muted-foreground",
};

const boundaryLabels = {
  "cradle-to-gate": "Cradle to Gate",
  "cradle-to-grave": "Cradle to Grave",
  "gate-to-gate": "Gate to Gate",
};

interface Props {
  project: LCAProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (project: LCAProject) => void;
  onDelete?: (projectId: string) => void;
  onViewAnalysis?: (project: LCAProject) => void;
}

export function ProjectDetailsDialog({
  project,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onViewAnalysis
}: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!project) return null;

  const circ = project.totalImpact.circularityScore;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(project);
      onOpenChange(false);
    } else {
      toast.info("Edit functionality coming soon!");
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(project.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      toast.success(`Project "${project.name}" deleted successfully.`);
    } else {
      toast.info("Delete functionality coming soon!");
      setShowDeleteConfirm(false);
    }
  };

  const handleViewAnalysis = () => {
    if (onViewAnalysis) {
      onViewAnalysis(project);
      onOpenChange(false);
    } else {
      toast.info("Analysis view coming soon!");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {project.name}
            </DialogTitle>
            <DialogDescription>{project.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Status & Boundary */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={cn(statusColors[project.status])}>
                {project.status.replace("-", " ")}
              </Badge>
              <Badge variant="secondary">{boundaryLabels[project.systemBoundary]}</Badge>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Product:</span>{" "}
                <span className="font-medium">{project.productName || "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Functional Unit:</span>{" "}
                <span className="font-medium">{project.functionalUnit || "—"}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Created {format(new Date(project.createdAt), "MMM d, yyyy")}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Updated {format(new Date(project.updatedAt), "MMM d, yyyy")}
              </div>
            </div>

            {/* Circularity */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Circularity Score</span>
                <span
                  className={cn(
                    "font-medium",
                    circ >= 70 ? "text-emerald-600" : circ >= 50 ? "text-yellow-600" : "text-destructive"
                  )}
                >
                  {circ}%
                </span>
              </div>
              <Progress
                value={circ}
                className={cn(
                  "h-2",
                  circ >= 70 ? "[&>div]:bg-emerald-500" : circ >= 50 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-destructive"
                )}
              />
            </div>

            {/* Impact Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <TrendingDown className="h-4 w-4 mx-auto text-emerald-500 mb-1" />
                <p className="text-lg font-bold">
                  {project.totalImpact.globalWarmingPotential.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground">kg CO₂e</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <Droplets className="h-4 w-4 mx-auto text-blue-500 mb-1" />
                <p className="text-lg font-bold">{project.totalImpact.waterFootprint}</p>
                <p className="text-[10px] text-muted-foreground">m³ water</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <Zap className="h-4 w-4 mx-auto text-yellow-500 mb-1" />
                <p className="text-lg font-bold">{project.totalImpact.energyDemand}</p>
                <p className="text-[10px] text-muted-foreground">MJ energy</p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleDelete}
              className="sm:flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={handleEdit}
              className="sm:flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={handleViewAnalysis}
              className="sm:flex-1"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analysis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project "{project.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
