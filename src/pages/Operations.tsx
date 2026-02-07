import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Factory,
  Users,
  Calendar,
  TrendingUp,
  ExternalLink,
  Mountain,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OperationsMap } from "@/components/map/OperationsMap";
import type { MiningOperation } from "@/types/lca";
import { useToast } from "@/hooks/use-toast";
import { OperationWizard } from "@/components/operations/OperationWizard";
import { LCADataDialog } from "@/components/operations/LCADataDialog";
import {
  useMiningOperations,
  useCreateMiningOperation,
  useUpdateMiningOperation,
  useDeleteMiningOperation
} from "@/hooks/useMiningOperations";
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

const typeColors = {
  'open-pit': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'underground': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'placer': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'in-situ': 'bg-purple-500/10 text-purple-600 border-purple-500/20'
};

interface OperationCardProps {
  operation: MiningOperation;
  onEdit: (operation: MiningOperation) => void;
  onDelete: (operationId: string) => void;
  onViewLCA: (operation: MiningOperation) => void;
}

function OperationCard({ operation, onEdit, onDelete, onViewLCA }: OperationCardProps) {
  const { toast } = useToast();



  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mountain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{operation.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {operation.location.region}, {operation.location.country}
              </div>
            </div>
          </div>
          <Badge variant="outline" className={cn(typeColors[operation.type])}>
            {operation.type.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Factory className="h-3 w-3" />
              Primary Ore
            </div>
            <p className="font-medium">{operation.primaryOre}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" />
              Annual Output
            </div>
            <p className="font-medium">{(operation.annualProduction / 1000000).toFixed(1)}M tonnes</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {operation.employees.toLocaleString()} employees
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Since {operation.operationalSince}
          </span>
        </div>

        <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
          <Button variant="outline" size="sm" onClick={() => onViewLCA(operation)} className="flex-1">
            View LCA Data
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(operation)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(operation.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const Operations = () => {
  const { toast } = useToast();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editOperation, setEditOperation] = useState<MiningOperation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [lcaOperation, setLcaOperation] = useState<MiningOperation | null>(null);
  const [lcaDialogOpen, setLcaDialogOpen] = useState(false);

  const { data: operations = [], isLoading } = useMiningOperations();
  const createOperation = useCreateMiningOperation();
  const updateOperation = useUpdateMiningOperation();
  const deleteOperation = useDeleteMiningOperation();

  const handleCreate = () => {
    setEditOperation(null);
    setWizardOpen(true);
  };

  const handleEdit = (operation: MiningOperation) => {
    // Check if this is a mock operation (IDs start with "mine-")
    // User-created operations start with "user-" and can be edited
    if (operation.id.startsWith("mine-")) {
      toast({
        title: "Demo Operation",
        description: "This is a demo operation. Create your own operations to edit them!",
        variant: "default",
      });
      return;
    }
    setEditOperation(operation);
    setWizardOpen(true);
  };

  const handleDelete = (operationId: string) => {
    // Check if this is a mock operation
    if (operationId.startsWith("mine-")) {
      toast({
        title: "Demo Operation",
        description: "Demo operations cannot be deleted. Only your created operations can be deleted.",
        variant: "default",
      });
      return;
    }
    setDeleteId(operationId);
  };

  const handleViewLCA = (operation: MiningOperation) => {
    setLcaOperation(operation);
    setLcaDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteOperation.mutate(deleteId, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Operation deleted successfully",
          });
          setDeleteId(null);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to delete operation",
            variant: "destructive",
          });
          setDeleteId(null);
        },
      });
    }
  };

  const handleWizardComplete = (operation: Partial<MiningOperation>) => {
    if (editOperation) {
      updateOperation.mutate(
        { ...operation, id: editOperation.id } as any,
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Operation updated successfully",
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: error instanceof Error ? error.message : "Failed to update operation",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createOperation.mutate(operation, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Operation created successfully! Your data is saved locally.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to create operation",
            variant: "destructive",
          });
        },
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Mining Operations</h1>
            <p className="text-muted-foreground">
              Monitor and assess environmental impact across all operational sites
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Operation
          </Button>
        </div>

        {/* Interactive Map */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Operations Map</CardTitle>
            <CardDescription>
              Interactive visualization of mining operations across regions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <OperationsMap operations={operations} className="h-[350px]" />
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Operations</p>
              <p className="text-3xl font-bold">{operations.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Production</p>
              <p className="text-3xl font-bold">
                {(operations.reduce((sum, op) => sum + op.annualProduction, 0) / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-muted-foreground">tonnes/year</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Workforce</p>
              <p className="text-3xl font-bold">
                {operations.reduce((sum, op) => sum + op.employees, 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Avg Circularity</p>
              <p className="text-3xl font-bold">52%</p>
            </CardContent>
          </Card>
        </div>

        {/* Operations Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">All Operations</h2>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading operations...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {operations.map((operation) => (
                <OperationCard
                  key={operation.id}
                  operation={operation}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewLCA={handleViewLCA}
                />
              ))}
            </div>
          )}
        </div>

        {/* Operation Wizard */}
        <OperationWizard
          open={wizardOpen}
          onOpenChange={setWizardOpen}
          onComplete={handleWizardComplete}
          initialOperation={editOperation}
        />

        {/* LCA Data Dialog */}
        <LCADataDialog
          operation={lcaOperation}
          open={lcaDialogOpen}
          onOpenChange={setLcaDialogOpen}
        />

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Operation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this operation? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default Operations;
