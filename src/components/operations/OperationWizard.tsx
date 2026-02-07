import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, MapPin } from "lucide-react";
import type { MiningOperation } from "@/types/lca";
import { geocodeLocation } from "@/services/geocoding";
import { useToast } from "@/hooks/use-toast";

interface OperationWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onComplete: (operation: Partial<MiningOperation>) => void;
    initialOperation?: MiningOperation | null;
}

type OperationType = 'open-pit' | 'underground' | 'placer' | 'in-situ';

export function OperationWizard({ open, onOpenChange, onComplete, initialOperation }: OperationWizardProps) {
    const { toast } = useToast();
    const isEditMode = !!initialOperation;

    const [name, setName] = useState(initialOperation?.name || "");
    const [locationQuery, setLocationQuery] = useState(initialOperation?.location.region || "");
    const [country, setCountry] = useState(initialOperation?.location.country || "India");
    const [type, setType] = useState<OperationType>(initialOperation?.type || "open-pit");
    const [primaryOre, setPrimaryOre] = useState(initialOperation?.primaryOre || "");
    const [annualProduction, setAnnualProduction] = useState(initialOperation?.annualProduction || 0);
    const [operationalSince, setOperationalSince] = useState(initialOperation?.operationalSince || "");
    const [employees, setEmployees] = useState(initialOperation?.employees || 0);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [geocodedLocation, setGeocodedLocation] = useState<{ lat: number; lng: number } | null>(
        initialOperation?.location ? { lat: initialOperation.location.lat, lng: initialOperation.location.lng } : null
    );

    useEffect(() => {
        if (initialOperation) {
            setName(initialOperation.name);
            setLocationQuery(initialOperation.location.region);
            setCountry(initialOperation.location.country);
            setType(initialOperation.type);
            setPrimaryOre(initialOperation.primaryOre);
            setAnnualProduction(initialOperation.annualProduction);
            setOperationalSince(initialOperation.operationalSince);
            setEmployees(initialOperation.employees);
            setGeocodedLocation({ lat: initialOperation.location.lat, lng: initialOperation.location.lng });
        } else {
            resetForm();
        }
    }, [initialOperation]);

    const resetForm = () => {
        setName("");
        setLocationQuery("");
        setCountry("India");
        setType("open-pit");
        setPrimaryOre("");
        setAnnualProduction(0);
        setOperationalSince("");
        setEmployees(0);
        setGeocodedLocation(null);
    };

    const handleGeocode = async () => {
        if (!locationQuery) {
            toast({
                title: "Location Required",
                description: "Please enter a location to geocode",
                variant: "destructive",
            });
            return;
        }

        setIsGeocoding(true);
        const result = await geocodeLocation(locationQuery, country);
        setIsGeocoding(false);

        if (result) {
            setGeocodedLocation({ lat: result.lat, lng: result.lng });
            toast({
                title: "Location Found",
                description: `Coordinates: ${result.lat.toFixed(4)}, ${result.lng.toFixed(4)}`,
            });
        } else {
            toast({
                title: "Location Not Found",
                description: "Could not find coordinates for this location. Please try a different query.",
                variant: "destructive",
            });
        }
    };

    const handleSubmit = () => {
        if (!name || !locationQuery || !primaryOre || !operationalSince || !geocodedLocation) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields and geocode the location",
                variant: "destructive",
            });
            return;
        }

        const operation: Partial<MiningOperation> = {
            ...(isEditMode && { id: initialOperation.id }),
            name,
            location: {
                lat: geocodedLocation.lat,
                lng: geocodedLocation.lng,
                region: locationQuery,
                country,
            },
            type,
            primaryOre,
            annualProduction,
            operationalSince,
            employees,
        };

        onComplete(operation);
        resetForm();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Operation" : "Create New Operation"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Operation Name *</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Jharkhand Iron Ore Complex"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location/Region *</Label>
                            <Input
                                id="location"
                                placeholder="e.g., Jharkhand"
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGeocode}
                            disabled={isGeocoding}
                            className="w-full"
                        >
                            {isGeocoding ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Geocoding...
                                </>
                            ) : (
                                <>
                                    <MapPin className="mr-2 h-4 w-4" />
                                    Get Coordinates
                                </>
                            )}
                        </Button>
                    </div>

                    {geocodedLocation && (
                        <div className="p-3 bg-muted rounded-md text-sm">
                            <p className="font-medium">Coordinates:</p>
                            <p>Latitude: {geocodedLocation.lat.toFixed(6)}</p>
                            <p>Longitude: {geocodedLocation.lng.toFixed(6)}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Operation Type *</Label>
                        <RadioGroup value={type} onValueChange={(v) => setType(v as OperationType)}>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="open-pit" id="open-pit" />
                                    <Label htmlFor="open-pit" className="font-normal cursor-pointer">Open Pit</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="underground" id="underground" />
                                    <Label htmlFor="underground" className="font-normal cursor-pointer">Underground</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="placer" id="placer" />
                                    <Label htmlFor="placer" className="font-normal cursor-pointer">Placer</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="in-situ" id="in-situ" />
                                    <Label htmlFor="in-situ" className="font-normal cursor-pointer">In-Situ</Label>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ore">Primary Ore *</Label>
                        <Input
                            id="ore"
                            placeholder="e.g., Iron Ore (Hematite)"
                            value={primaryOre}
                            onChange={(e) => setPrimaryOre(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="production">Annual Production (tonnes)</Label>
                            <Input
                                id="production"
                                type="number"
                                placeholder="e.g., 12000000"
                                value={annualProduction}
                                onChange={(e) => setAnnualProduction(Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="employees">Employees</Label>
                            <Input
                                id="employees"
                                type="number"
                                placeholder="e.g., 2500"
                                value={employees}
                                onChange={(e) => setEmployees(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="year">Operational Since *</Label>
                        <Input
                            id="year"
                            placeholder="e.g., 1978"
                            value={operationalSince}
                            onChange={(e) => setOperationalSince(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        {isEditMode ? "Update Operation" : "Create Operation"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
