import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LCAProject, EnvironmentalImpact } from "@/types/lca";

interface DbLcaProject {
  id: string;
  name: string;
  description: string;
  product_name: string;
  functional_unit: string;
  system_boundary: string;
  status: string;
  total_impact: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

function mapDbToProject(row: DbLcaProject): LCAProject {
  const impact = row.total_impact as Partial<EnvironmentalImpact>;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    productName: row.product_name,
    functionalUnit: row.functional_unit,
    systemBoundary: row.system_boundary as LCAProject["systemBoundary"],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status as LCAProject["status"],
    processes: [],
    totalImpact: {
      globalWarmingPotential: (impact.globalWarmingPotential as number) ?? 0,
      acidificationPotential: (impact.acidificationPotential as number) ?? 0,
      eutrophicationPotential: (impact.eutrophicationPotential as number) ?? 0,
      ozoneDepletionPotential: (impact.ozoneDepletionPotential as number) ?? 0,
      waterFootprint: (impact.waterFootprint as number) ?? 0,
      energyDemand: (impact.energyDemand as number) ?? 0,
      resourceDepletion: (impact.resourceDepletion as number) ?? 0,
      humanToxicity: (impact.humanToxicity as number) ?? 0,
      ecotoxicity: (impact.ecotoxicity as number) ?? 0,
      circularityScore: (impact.circularityScore as number) ?? 0,
    },
  };
}

function mapProjectToDb(project: Partial<LCAProject>) {
  return {
    name: project.name ?? "Untitled",
    description: project.description ?? "",
    product_name: project.productName ?? "",
    functional_unit: project.functionalUnit ?? "",
    system_boundary: project.systemBoundary ?? "cradle-to-gate",
    status: project.status ?? "draft",
    total_impact: project.totalImpact ?? {},
  };
}

export function useLcaProjects() {
  return useQuery({
    queryKey: ["lca_projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lca_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as DbLcaProject[]).map(mapDbToProject);
    },
  });
}

export function useCreateLcaProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Partial<LCAProject>) => {
      const row = mapProjectToDb(project);
      const { data, error } = await supabase
        .from("lca_projects")
        .insert(row)
        .select()
        .single();

      if (error) throw error;
      return mapDbToProject(data as DbLcaProject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lca_projects"] });
    },
  });
}

export function useUpdateLcaProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Partial<LCAProject> & { id: string }) => {
      const { id, ...updates } = project;
      const row = mapProjectToDb(updates);
      const { data, error } = await supabase
        .from("lca_projects")
        .update(row)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return mapDbToProject(data as DbLcaProject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lca_projects"] });
    },
  });
}

export function useDeleteLcaProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from("lca_projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;
      return projectId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lca_projects"] });
    },
  });
}
