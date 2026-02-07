import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  ArrowRight,
  FileText,
  Calendar,
  TrendingDown
} from "lucide-react";
import { mockProjects } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { NewProjectWizard } from "@/components/project/NewProjectWizard";
import { ProjectDetailsDialog } from "@/components/project/ProjectDetailsDialog";
import { ProjectFiltersSheet, type ProjectFilters } from "@/components/project/ProjectFiltersSheet";
import { toast } from "@/hooks/use-toast";
import { useLcaProjects, useCreateLcaProject, useUpdateLcaProject, useDeleteLcaProject } from "@/hooks/useLcaProjects";
import type { LCAProject } from "@/types/lca";
import { useNavigate } from "react-router-dom";

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

function ProjectRow({
  project,
  onClick,
}: {
  project: LCAProject;
  onClick: () => void;
}) {
  const circularityScore = project.totalImpact.circularityScore;

  return (
    <div
      className="group flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-accent/30 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <FileText className="h-6 w-6 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold truncate">{project.name}</h3>
          <Badge variant="outline" className={cn("shrink-0", statusColors[project.status])}>
            {project.status.replace("-", " ")}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(project.createdAt), "MMM d, yyyy")}
          </span>
          <span>Product: {project.productName || "—"}</span>
          <Badge variant="secondary" className="text-[10px]">
            {boundaryLabels[project.systemBoundary]}
          </Badge>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end gap-1 w-32">
        <div className="flex items-center gap-1 text-sm">
          <TrendingDown className="h-3 w-3 text-muted-foreground" />
          <span className="font-medium">
            {project.totalImpact.globalWarmingPotential.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">kg CO₂e</span>
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">Circularity</span>
            <span
              className={cn(
                "text-xs font-medium",
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
              "h-1",
              circularityScore >= 70
                ? "[&>div]:bg-emerald-500"
                : circularityScore >= 50
                  ? "[&>div]:bg-yellow-500"
                  : "[&>div]:bg-destructive"
            )}
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

const Projects = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<LCAProject | null>(null);
  const [editProject, setEditProject] = useState<LCAProject | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ProjectFilters>({ status: [], boundary: [] });

  const { data: dbProjects, isLoading } = useLcaProjects();
  const createProject = useCreateLcaProject();
  const updateProject = useUpdateLcaProject();
  const deleteProject = useDeleteLcaProject();

  // Merge backend projects with mock (for demo purposes)
  const allProjects = useMemo(() => {
    const backend = dbProjects ?? [];
    // Avoid duplicates by id
    const mockIds = new Set(mockProjects.map((p) => p.id));
    return [...backend.filter((p) => !mockIds.has(p.id)), ...mockProjects];
  }, [dbProjects]);

  // Handle query params (new wizard / open project)
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setWizardOpen(true);
      searchParams.delete("new");
      setSearchParams(searchParams, { replace: true });
    }
    const id = searchParams.get("id");
    if (id) {
      const proj = allProjects.find((p) => p.id === id);
      if (proj) setSelectedProject(proj);
      searchParams.delete("id");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, allProjects, setSearchParams]);

  // Filter and search
  const filteredProjects = useMemo(() => {
    let list = allProjects;

    if (filters.status.length > 0) {
      list = list.filter((p) => filters.status.includes(p.status));
    }
    if (filters.boundary.length > 0) {
      list = list.filter((p) => filters.boundary.includes(p.systemBoundary));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.productName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allProjects, filters, search]);

  const handleProjectCreate = (project: Partial<LCAProject>) => {
    createProject.mutate(project, {
      onSuccess: (created) => {
        toast({
          title: "Project Created",
          description: `${created.name} has been created successfully.`,
        });
      },
      onError: (err: Error) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleEdit = (project: LCAProject) => {
    setEditProject(project);
  };

  const handleDelete = (projectId: string) => {
    // For mock projects, just show a success message (they can't actually be deleted from DB)
    const isDbProject = dbProjects?.some((p) => p.id === projectId);

    if (!isDbProject) {
      toast({
        title: "Demo Project",
        description: "This is a demo project and cannot be permanently deleted.",
      });
      return;
    }

    deleteProject.mutate(projectId, {
      onSuccess: () => {
        toast({
          title: "Project Deleted",
          description: "The project has been removed successfully.",
        });
      },
      onError: (err: Error) => {
        toast({
          title: "Error",
          description: err.message || "Failed to delete project.",
          variant: "destructive",
        });
      },
    });
  };

  const handleViewAnalysis = (project: LCAProject) => {
    // Navigate to project-specific analysis page
    navigate(`/projects/${project.id}/analysis`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">LCA Projects</h1>
            <p className="text-muted-foreground">Manage and analyze life cycle assessment studies</p>
          </div>
          <Button onClick={() => setWizardOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>

        {/* Search & Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects by name, product, or description..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <ProjectFiltersSheet filters={filters} onChange={setFilters} />
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>
              {filteredProjects.length} assessment{filteredProjects.length !== 1 ? "s" : ""} in your
              organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))
            ) : filteredProjects.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No projects match your criteria.
              </p>
            ) : (
              filteredProjects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* New Project Wizard */}
        <NewProjectWizard
          open={wizardOpen}
          onOpenChange={setWizardOpen}
          onComplete={handleProjectCreate}
        />

        {/* Edit Project Wizard */}
        <NewProjectWizard
          open={!!editProject}
          onOpenChange={(open) => !open && setEditProject(null)}
          onComplete={(updated) => {
            // Check if this is a database project
            const isDbProject = dbProjects?.some((p) => p.id === updated.id);

            if (!isDbProject) {
              // Mock project - just show success message
              toast({
                title: "Demo Project Updated",
                description: "Changes to demo projects are not saved permanently.",
              });
              setEditProject(null);
              return;
            }

            // Database project - actually update
            updateProject.mutate(updated as LCAProject & { id: string }, {
              onSuccess: () => {
                toast({
                  title: "Project Updated",
                  description: `${updated.name} has been updated successfully.`,
                });
                setEditProject(null);
              },
              onError: (err: Error) => {
                toast({
                  title: "Error",
                  description: err.message || "Failed to update project.",
                  variant: "destructive",
                });
              },
            });
          }}
          initialProject={editProject}
        />

        {/* Project Details Dialog */}
        <ProjectDetailsDialog
          project={selectedProject}
          open={!!selectedProject}
          onOpenChange={(open) => !open && setSelectedProject(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewAnalysis={handleViewAnalysis}
        />
      </div>
    </Layout>
  );
};

export default Projects;
