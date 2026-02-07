import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

export interface ProjectFilters {
  status: string[];
  boundary: string[];
}

interface Props {
  filters: ProjectFilters;
  onChange: (f: ProjectFilters) => void;
}

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

const boundaryOptions = [
  { value: "cradle-to-gate", label: "Cradle to Gate" },
  { value: "cradle-to-grave", label: "Cradle to Grave" },
  { value: "gate-to-gate", label: "Gate to Gate" },
];

export function ProjectFiltersSheet({ filters, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<ProjectFilters>(filters);

  const toggleStatus = (val: string) => {
    setLocal((prev) => ({
      ...prev,
      status: prev.status.includes(val)
        ? prev.status.filter((s) => s !== val)
        : [...prev.status, val],
    }));
  };

  const toggleBoundary = (val: string) => {
    setLocal((prev) => ({
      ...prev,
      boundary: prev.boundary.includes(val)
        ? prev.boundary.filter((b) => b !== val)
        : [...prev.boundary, val],
    }));
  };

  const handleApply = () => {
    onChange(local);
    setOpen(false);
  };

  const handleClear = () => {
    const cleared = { status: [], boundary: [] };
    setLocal(cleared);
    onChange(cleared);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {(filters.status.length > 0 || filters.boundary.length > 0) && (
            <span className="ml-1 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
              {filters.status.length + filters.boundary.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Projects</SheetTitle>
          <SheetDescription>Narrow down the project list</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Status */}
          <div>
            <h4 className="mb-3 font-medium text-sm">Status</h4>
            <div className="space-y-2">
              {statusOptions.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`status-${opt.value}`}
                    checked={local.status.includes(opt.value)}
                    onCheckedChange={() => toggleStatus(opt.value)}
                  />
                  <Label htmlFor={`status-${opt.value}`}>{opt.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* System Boundary */}
          <div>
            <h4 className="mb-3 font-medium text-sm">System Boundary</h4>
            <div className="space-y-2">
              {boundaryOptions.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`bound-${opt.value}`}
                    checked={local.boundary.includes(opt.value)}
                    onCheckedChange={() => toggleBoundary(opt.value)}
                  />
                  <Label htmlFor={`bound-${opt.value}`}>{opt.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
