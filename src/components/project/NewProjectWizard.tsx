import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  FileText,
  Target,
  Workflow,
  Layers,
  Sparkles,
  Plus,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LCAProject } from "@/types/lca";

interface NewProjectWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (project: Partial<LCAProject>) => void;
  initialProject?: LCAProject | null;
}

type SystemBoundary = 'cradle-to-gate' | 'cradle-to-grave' | 'gate-to-gate';

interface ProcessInput {
  name: string;
  type: string;
}

interface MaterialInput {
  name: string;
  category: string;
  quantity: string;
}

const steps = [
  { id: 1, title: "Basic Info", icon: FileText, description: "Project details" },
  { id: 2, title: "System Boundary", icon: Target, description: "Assessment scope" },
  { id: 3, title: "Processes", icon: Workflow, description: "Define operations" },
  { id: 4, title: "Materials", icon: Layers, description: "Material flows" },
  { id: 5, title: "Environmental Impact", icon: Sparkles, description: "Impact metrics" },
  { id: 6, title: "Review", icon: Check, description: "Confirm & create" },
];

const systemBoundaryOptions: { value: SystemBoundary; label: string; description: string }[] = [
  {
    value: "cradle-to-gate",
    label: "Cradle to Gate",
    description: "From raw material extraction through manufacturing, ending at the factory gate"
  },
  {
    value: "cradle-to-grave",
    label: "Cradle to Grave",
    description: "Complete lifecycle including use phase and end-of-life disposal/recycling"
  },
  {
    value: "gate-to-gate",
    label: "Gate to Gate",
    description: "Limited to specific manufacturing or processing operations only"
  }
];

const processTypes = [
  "extraction",
  "beneficiation",
  "smelting",
  "refining",
  "manufacturing",
  "recycling",
  "disposal"
];

const materialCategories = [
  "ore",
  "concentrate",
  "metal",
  "alloy",
  "waste",
  "recycled"
];

export function NewProjectWizard({ open, onOpenChange, onComplete, initialProject }: NewProjectWizardProps) {
  const isEditMode = !!initialProject;
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Basic Info
  const [projectName, setProjectName] = useState(initialProject?.name || "");
  const [description, setDescription] = useState(initialProject?.description || "");
  const [productName, setProductName] = useState(initialProject?.productName || "");
  const [functionalUnit, setFunctionalUnit] = useState(initialProject?.functionalUnit || "");

  // Step 2: System Boundary
  const [systemBoundary, setSystemBoundary] = useState<SystemBoundary>(initialProject?.systemBoundary || "cradle-to-gate");

  // Step 3: Processes
  const [processes, setProcesses] = useState<ProcessInput[]>([
    { name: "", type: "extraction" }
  ]);

  // Step 4: Materials
  const [materials, setMaterials] = useState<MaterialInput[]>([
    { name: "", category: "ore", quantity: "" }
  ]);

  // Step 5: Environmental Impact
  const [globalWarmingPotential, setGlobalWarmingPotential] = useState(initialProject?.totalImpact?.globalWarmingPotential || 0);
  const [waterFootprint, setWaterFootprint] = useState(initialProject?.totalImpact?.waterFootprint || 0);
  const [energyDemand, setEnergyDemand] = useState(initialProject?.totalImpact?.energyDemand || 0);
  const [circularityScore, setCircularityScore] = useState(initialProject?.totalImpact?.circularityScore || 0);
  const [acidificationPotential, setAcidificationPotential] = useState(initialProject?.totalImpact?.acidificationPotential || 0);
  const [eutrophicationPotential, setEutrophicationPotential] = useState(initialProject?.totalImpact?.eutrophicationPotential || 0);
  const [ozoneDepletionPotential, setOzoneDepletionPotential] = useState(initialProject?.totalImpact?.ozoneDepletionPotential || 0);
  const [resourceDepletion, setResourceDepletion] = useState(initialProject?.totalImpact?.resourceDepletion || 0);
  const [humanToxicity, setHumanToxicity] = useState(initialProject?.totalImpact?.humanToxicity || 0);
  const [ecotoxicity, setEcotoxicity] = useState(initialProject?.totalImpact?.ecotoxicity || 0);

  // Update form when initialProject changes (for edit mode)
  useEffect(() => {
    if (initialProject) {
      setProjectName(initialProject.name || "");
      setDescription(initialProject.description || "");
      setProductName(initialProject.productName || "");
      setFunctionalUnit(initialProject.functionalUnit || "");
      setSystemBoundary(initialProject.systemBoundary || "cradle-to-gate");

      // Update impact metrics
      if (initialProject.totalImpact) {
        setGlobalWarmingPotential(initialProject.totalImpact.globalWarmingPotential || 0);
        setWaterFootprint(initialProject.totalImpact.waterFootprint || 0);
        setEnergyDemand(initialProject.totalImpact.energyDemand || 0);
        setCircularityScore(initialProject.totalImpact.circularityScore || 0);
        setAcidificationPotential(initialProject.totalImpact.acidificationPotential || 0);
        setEutrophicationPotential(initialProject.totalImpact.eutrophicationPotential || 0);
        setOzoneDepletionPotential(initialProject.totalImpact.ozoneDepletionPotential || 0);
        setResourceDepletion(initialProject.totalImpact.resourceDepletion || 0);
        setHumanToxicity(initialProject.totalImpact.humanToxicity || 0);
        setEcotoxicity(initialProject.totalImpact.ecotoxicity || 0);
      }
    } else {
      // Reset to empty when creating new project
      resetForm();
    }
  }, [initialProject]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const project: Partial<LCAProject> = {
      ...(isEditMode && { id: initialProject.id }),
      name: projectName,
      description,
      productName,
      functionalUnit,
      systemBoundary,
      status: initialProject?.status || "draft",
      createdAt: initialProject?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalImpact: {
        globalWarmingPotential,
        waterFootprint,
        energyDemand,
        circularityScore,
        acidificationPotential,
        eutrophicationPotential,
        ozoneDepletionPotential,
        resourceDepletion,
        humanToxicity,
        ecotoxicity,
      },
    };
    onComplete(project);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setProjectName("");
    setDescription("");
    setProductName("");
    setFunctionalUnit("");
    setSystemBoundary("cradle-to-gate");
    setProcesses([{ name: "", type: "extraction" }]);
    setMaterials([{ name: "", category: "ore", quantity: "" }]);

    // Reset impact metrics
    setGlobalWarmingPotential(0);
    setWaterFootprint(0);
    setEnergyDemand(0);
    setCircularityScore(0);
    setAcidificationPotential(0);
    setEutrophicationPotential(0);
    setOzoneDepletionPotential(0);
    setResourceDepletion(0);
    setHumanToxicity(0);
    setEcotoxicity(0);
  };

  const addProcess = () => {
    setProcesses([...processes, { name: "", type: "extraction" }]);
  };

  const removeProcess = (index: number) => {
    if (processes.length > 1) {
      setProcesses(processes.filter((_, i) => i !== index));
    }
  };

  const updateProcess = (index: number, field: keyof ProcessInput, value: string) => {
    const updated = [...processes];
    updated[index][field] = value;
    setProcesses(updated);
  };

  const addMaterial = () => {
    setMaterials([...materials, { name: "", category: "ore", quantity: "" }]);
  };

  const removeMaterial = (index: number) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((_, i) => i !== index));
    }
  };

  const updateMaterial = (index: number, field: keyof MaterialInput, value: string) => {
    const updated = [...materials];
    updated[index][field] = value;
    setMaterials(updated);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return projectName.trim() !== "" && productName.trim() !== "" && functionalUnit.trim() !== "";
      case 2:
        return systemBoundary !== undefined;
      case 3:
        return processes.some(p => p.name.trim() !== "");
      case 4:
        return materials.some(m => m.name.trim() !== "" && m.quantity.trim() !== "");
      case 5:
        return true;
      default:
        return false;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditMode ? "Edit LCA Project" : "Create New LCA Project"}
          </DialogTitle>
          <DialogDescription>
            Step-by-step wizard to define your life cycle assessment
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="py-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-3">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors",
                      isActive && "border-primary bg-primary text-primary-foreground",
                      isCompleted && "border-primary bg-primary/10 text-primary",
                      !isActive && !isCompleted && "border-muted-foreground/30 text-muted-foreground/50"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <StepIcon className="h-4 w-4" />
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-medium hidden sm:block",
                    isActive && "text-primary",
                    !isActive && "text-muted-foreground"
                  )}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="py-4 min-h-[300px]">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Project Details</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="project-name">Project Name *</Label>
                  <Input
                    id="project-name"
                    placeholder="e.g., Steel Production LCA - Mumbai Plant"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the assessment scope and objectives..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="product-name">Product Name *</Label>
                  <Input
                    id="product-name"
                    placeholder="e.g., Hot Rolled Steel Coil"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="functional-unit">Functional Unit *</Label>
                  <Input
                    id="functional-unit"
                    placeholder="e.g., 1 tonne of HR Steel Coil"
                    value={functionalUnit}
                    onChange={(e) => setFunctionalUnit(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The reference unit for comparing environmental impacts
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">System Boundary</h3>
              <p className="text-sm text-muted-foreground">
                Define the scope of your life cycle assessment
              </p>
              <RadioGroup
                value={systemBoundary}
                onValueChange={(value) => setSystemBoundary(value as SystemBoundary)}
                className="space-y-3"
              >
                {systemBoundaryOptions.map((option) => (
                  <Card
                    key={option.value}
                    className={cn(
                      "cursor-pointer transition-all",
                      systemBoundary === option.value && "border-primary ring-1 ring-primary"
                    )}
                    onClick={() => setSystemBoundary(option.value)}
                  >
                    <CardContent className="p-4 flex items-start gap-3">
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={option.value} className="font-medium cursor-pointer">
                          {option.label}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Process Definition</h3>
                  <p className="text-sm text-muted-foreground">
                    Define the processes in your production chain
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={addProcess}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Process
                </Button>
              </div>
              <div className="space-y-3">
                {processes.map((process, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid gap-3 sm:grid-cols-2">
                          <div>
                            <Label>Process Name</Label>
                            <Input
                              placeholder="e.g., Blast Furnace Operation"
                              value={process.name}
                              onChange={(e) => updateProcess(index, "name", e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Process Type</Label>
                            <select
                              value={process.type}
                              onChange={(e) => updateProcess(index, "type", e.target.value)}
                              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {processTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {processes.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProcess(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Material Flows</h3>
                  <p className="text-sm text-muted-foreground">
                    Define input materials and their quantities
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={addMaterial}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Material
                </Button>
              </div>
              <div className="space-y-3">
                {materials.map((material, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid gap-3 sm:grid-cols-3">
                          <div>
                            <Label>Material Name</Label>
                            <Input
                              placeholder="e.g., Iron Ore"
                              value={material.name}
                              onChange={(e) => updateMaterial(index, "name", e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Category</Label>
                            <select
                              value={material.category}
                              onChange={(e) => updateMaterial(index, "category", e.target.value)}
                              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {materialCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label>Quantity (kg)</Label>
                            <Input
                              type="number"
                              placeholder="1000"
                              value={material.quantity}
                              onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        {materials.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMaterial(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Environmental Impact Metrics</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the environmental impact data for analysis
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Global Warming Potential (kg CO₂e)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 2100"
                    value={globalWarmingPotential}
                    onChange={(e) => setGlobalWarmingPotential(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Water Footprint (m³)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 52"
                    value={waterFootprint}
                    onChange={(e) => setWaterFootprint(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Energy Demand (MJ)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 25000"
                    value={energyDemand}
                    onChange={(e) => setEnergyDemand(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Circularity Score (%)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 42"
                    min="0"
                    max="100"
                    value={circularityScore}
                    onChange={(e) => setCircularityScore(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Acidification Potential (kg SO₂ eq)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 8.5"
                    value={acidificationPotential}
                    onChange={(e) => setAcidificationPotential(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Eutrophication Potential (kg PO₄ eq)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 1.2"
                    value={eutrophicationPotential}
                    onChange={(e) => setEutrophicationPotential(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Ozone Depletion Potential (kg CFC-11 eq)</Label>
                  <Input
                    type="number"
                    step="0.00001"
                    placeholder="e.g., 0.00001"
                    value={ozoneDepletionPotential}
                    onChange={(e) => setOzoneDepletionPotential(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Resource Depletion (kg Sb eq)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 15.5"
                    value={resourceDepletion}
                    onChange={(e) => setResourceDepletion(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Human Toxicity (kg 1,4-DB eq)</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    placeholder="e.g., 0.0025"
                    value={humanToxicity}
                    onChange={(e) => setHumanToxicity(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Ecotoxicity (CTUe)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 450"
                    value={ecotoxicity}
                    onChange={(e) => setEcotoxicity(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Review & Create</h3>
              <p className="text-sm text-muted-foreground">
                Review your project configuration before creating
              </p>

              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Basic Information
                    </h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Project Name:</span>
                        <span className="font-medium">{projectName || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Product:</span>
                        <span className="font-medium">{productName || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Functional Unit:</span>
                        <span className="font-medium">{functionalUnit || "-"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      System Boundary
                    </h4>
                    <Badge variant="secondary" className="text-sm">
                      {systemBoundaryOptions.find(o => o.value === systemBoundary)?.label}
                    </Badge>
                  </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Workflow className="h-4 w-4 text-primary" />
                        Processes ({processes.filter(p => p.name).length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {processes.filter(p => p.name).map((p, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {p.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" />
                        Materials ({materials.filter(m => m.name).length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {materials.filter(m => m.name).map((m, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {m.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          {currentStep < steps.length ? (
            <Button onClick={handleNext} disabled={!isStepValid()}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleComplete}>
              <Sparkles className="h-4 w-4 mr-1" />
              Create Project
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
