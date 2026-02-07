import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { MiningOperation } from "@/types/lca";
import { Leaf, Droplet, Zap, Wind, Factory, Recycle } from "lucide-react";

interface LCADataDialogProps {
    operation: MiningOperation | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LCADataDialog({ operation, open, onOpenChange }: LCADataDialogProps) {
    if (!operation) return null;

    // Calculate estimated environmental impact based on operation type and production
    const getEstimatedImpact = () => {
        const baseImpact = operation.annualProduction / 1000000; // Convert to millions of tonnes

        const multipliers = {
            'open-pit': 1.5,
            'underground': 1.2,
            'placer': 0.8,
            'in-situ': 1.0,
        };

        const multiplier = multipliers[operation.type];

        return {
            co2: (baseImpact * 2100 * multiplier).toFixed(0),
            water: (baseImpact * 15000 * multiplier).toFixed(0),
            energy: (baseImpact * 3500 * multiplier).toFixed(0),
            waste: (baseImpact * 450 * multiplier).toFixed(0),
            so2: (baseImpact * 8.5 * multiplier).toFixed(1),
            nox: (baseImpact * 3.2 * multiplier).toFixed(1),
        };
    };

    const impact = getEstimatedImpact();

    const metrics = [
        {
            icon: Wind,
            label: "CO₂ Emissions",
            value: impact.co2,
            unit: "tonnes/year",
            color: "text-red-500",
            bgColor: "bg-red-500/10",
        },
        {
            icon: Droplet,
            label: "Water Usage",
            value: impact.water,
            unit: "m³/year",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            icon: Zap,
            label: "Energy Consumption",
            value: impact.energy,
            unit: "MWh/year",
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
        },
        {
            icon: Factory,
            label: "Waste Generated",
            value: impact.waste,
            unit: "tonnes/year",
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
        },
        {
            icon: Wind,
            label: "SO₂ Emissions",
            value: impact.so2,
            unit: "tonnes/year",
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
        },
        {
            icon: Leaf,
            label: "NOₓ Emissions",
            value: impact.nox,
            unit: "tonnes/year",
            color: "text-green-500",
            bgColor: "bg-green-500/10",
        },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Life Cycle Assessment Data</DialogTitle>
                    <DialogDescription>
                        Environmental impact analysis for {operation.name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Operation Info */}
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                            <h3 className="font-semibold text-lg">{operation.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {operation.location.region}, {operation.location.country}
                            </p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                            {operation.type.replace("-", " ")}
                        </Badge>
                    </div>

                    {/* Production Info */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-muted/30 rounded-lg">
                            <p className="text-sm text-muted-foreground">Annual Production</p>
                            <p className="text-xl font-bold">
                                {(operation.annualProduction / 1000000).toFixed(2)}M
                            </p>
                            <p className="text-xs text-muted-foreground">tonnes/year</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                            <p className="text-sm text-muted-foreground">Primary Ore</p>
                            <p className="text-xl font-bold">{operation.primaryOre}</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                            <p className="text-sm text-muted-foreground">Employees</p>
                            <p className="text-xl font-bold">{operation.employees.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Environmental Impact Metrics */}
                    <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <Recycle className="h-5 w-5 text-green-600" />
                            Environmental Impact Metrics
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            {metrics.map((metric) => {
                                const Icon = metric.icon;
                                return (
                                    <div
                                        key={metric.label}
                                        className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                                                <Icon className={`h-5 w-5 ${metric.color}`} />
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                                        <p className="text-2xl font-bold">{metric.value}</p>
                                        <p className="text-xs text-muted-foreground">{metric.unit}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Note */}
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            <strong>Note:</strong> These are estimated values based on operation type, production
                            volume, and industry averages. Actual values may vary based on specific processes,
                            technology, and environmental controls in place.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
