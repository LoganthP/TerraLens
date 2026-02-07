import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, ArrowRight, FileText } from "lucide-react";
import { mockProjects } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { LCAProject } from "@/types/lca";

const statusColors = {
  'draft': 'bg-muted text-muted-foreground',
  'in-progress': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'completed': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'archived': 'bg-muted text-muted-foreground'
};

function ProjectCard({ project, onClick }: { project: LCAProject; onClick: () => void }) {
  const circularityScore = project.totalImpact.circularityScore;
  
  return (
    <div 
      className="group p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <Badge variant="outline" className={cn("text-[10px]", statusColors[project.status])}>
            {project.status.replace('-', ' ')}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
        </span>
      </div>
      
      <h4 className="font-medium text-sm mb-1 line-clamp-1">{project.name}</h4>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{project.productName}</p>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">Circularity Score</span>
        <span className={cn(
          "text-xs font-medium",
          circularityScore >= 70 ? "text-emerald-600" :
          circularityScore >= 50 ? "text-yellow-600" :
          "text-destructive"
        )}>
          {circularityScore}%
        </span>
      </div>
      <Progress 
        value={circularityScore} 
        className={cn(
          "h-1.5",
          circularityScore >= 70 ? "[&>div]:bg-emerald-500" :
          circularityScore >= 50 ? "[&>div]:bg-yellow-500" :
          "[&>div]:bg-destructive"
        )}
      />
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          {project.totalImpact.globalWarmingPotential.toLocaleString()} kg CO₂e
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          Open <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export function ProjectsList() {
  const navigate = useNavigate();

  const handleNewProject = () => {
    navigate("/projects?new=true");
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/projects?id=${projectId}`);
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent LCA Projects</CardTitle>
          <Button size="sm" onClick={handleNewProject}>
            <Plus className="h-4 w-4 mr-1" />
            New Project
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mockProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => handleOpenProject(project.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
