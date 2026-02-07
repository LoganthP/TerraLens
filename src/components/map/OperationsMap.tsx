import { useEffect, useState } from "react";
import type { MiningOperation } from "@/types/lca";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const typeColors = {
  "open-pit": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  underground: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  placer: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "in-situ": "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

interface OperationsMapProps {
  operations: MiningOperation[];
  className?: string;
}

// Lazy loaded map component to avoid SSR issues
function MapContent({ operations }: { operations: MiningOperation[] }) {
  const [mapReady, setMapReady] = useState(false);
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [leafletModules, setLeafletModules] = useState<{
    MapContainer: any;
    TileLayer: any;
    Marker: any;
    Popup: any;
    useMap: any;
    L: any;
  } | null>(null);

  useEffect(() => {
    // Dynamically import leaflet modules
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([reactLeaflet, L]) => {
      // Fix for default marker icons
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      setLeafletModules({
        MapContainer: reactLeaflet.MapContainer,
        TileLayer: reactLeaflet.TileLayer,
        Marker: reactLeaflet.Marker,
        Popup: reactLeaflet.Popup,
        useMap: reactLeaflet.useMap,
        L: L.default,
      });
      setMapReady(true);
    });
  }, []);

  if (!mapReady || !leafletModules) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/50 animate-pulse">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, L } = leafletModules;

  // Custom marker icon for mining operations
  const createCustomIcon = (type: MiningOperation["type"]) => {
    const colors = {
      "open-pit": "#f59e0b",
      underground: "#3b82f6",
      placer: "#10b981",
      "in-situ": "#8b5cf6",
    };

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background-color: ${colors[type]};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  // Default center (India)
  const defaultCenter: [number, number] = [20.5937, 78.9629];

  // Tile layer URLs
  const tileUrls = {
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  };

  const attributions = {
    street: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    satellite: '&copy; <a href="https://www.esri.com/">Esri</a>',
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution={attributions[mapType]}
          url={tileUrls[mapType]}
        />
        {operations.map((operation) => (
          <Marker
            key={operation.id}
            position={[operation.location.lat, operation.location.lng]}
            icon={createCustomIcon(operation.type)}
          >
            <Popup className="custom-popup">
              <div className="min-w-[200px] p-1">
                <h3 className="font-semibold text-foreground mb-1">{operation.name}</h3>
                <Badge
                  variant="outline"
                  className={cn("mb-2", typeColors[operation.type])}
                >
                  {operation.type.replace("-", " ")}
                </Badge>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Ore:</span> {operation.primaryOre}
                  </p>
                  <p>
                    <span className="font-medium">Production:</span>{" "}
                    {(operation.annualProduction / 1000000).toFixed(1)}M tonnes/year
                  </p>
                  <p>
                    <span className="font-medium">Employees:</span>{" "}
                    {operation.employees.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {operation.location.region}, {operation.location.country}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Type Toggle */}
      <div className="absolute top-2 right-2 z-[1000] flex gap-1 bg-background/95 backdrop-blur rounded-md shadow-lg border border-border p-1">
        <Button
          variant={mapType === 'street' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMapType('street')}
          className="h-8 px-3 text-xs"
        >
          Street
        </Button>
        <Button
          variant={mapType === 'satellite' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMapType('satellite')}
          className="h-8 px-3 text-xs"
        >
          Satellite
        </Button>
      </div>
    </div>
  );
}

export function OperationsMap({ operations, className }: OperationsMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={cn("h-[400px] w-full rounded-lg overflow-hidden border border-border bg-muted/50", className)}>
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-muted-foreground">Initializing map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-[400px] w-full rounded-lg overflow-hidden border border-border", className)}>
      <MapContent operations={operations} />
    </div>
  );
}