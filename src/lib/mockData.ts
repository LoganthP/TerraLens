import type {
  LCAProject,
  EnvironmentalImpact,
  CircularityMetrics,
  SustainabilityScore,
  AIRecommendation,
  Material,
  MiningOperation
} from "@/types/lca";

export const mockMaterials: Material[] = [
  {
    id: "mat-1",
    name: "Iron Ore (Hematite)",
    category: "ore",
    composition: { Fe: 62, O: 27, Si: 8, Al: 3 },
    carbonFootprint: 0.03,
    waterUsage: 1.2,
    energyConsumption: 0.15,
    recyclability: 0
  },
  {
    id: "mat-2",
    name: "Pig Iron",
    category: "metal",
    composition: { Fe: 93, C: 4, Si: 2, Mn: 1 },
    carbonFootprint: 1.8,
    waterUsage: 28,
    energyConsumption: 12.5,
    recyclability: 95
  },
  {
    id: "mat-3",
    name: "Steel (Carbon)",
    category: "alloy",
    composition: { Fe: 98.5, C: 1.0, Mn: 0.5 },
    carbonFootprint: 2.1,
    waterUsage: 52,
    energyConsumption: 18.5,
    recyclability: 98
  },
  {
    id: "mat-4",
    name: "Recycled Steel Scrap",
    category: "recycled",
    composition: { Fe: 97, C: 1.5, impurities: 1.5 },
    carbonFootprint: 0.4,
    waterUsage: 8,
    energyConsumption: 6.2,
    recyclability: 95
  },
  {
    id: "mat-5",
    name: "Copper Concentrate",
    category: "concentrate",
    composition: { Cu: 30, Fe: 25, S: 30, SiO2: 10, others: 5 },
    carbonFootprint: 0.8,
    waterUsage: 45,
    energyConsumption: 8.5,
    recyclability: 0
  },
  {
    id: "mat-6",
    name: "Refined Copper",
    category: "metal",
    composition: { Cu: 99.99 },
    carbonFootprint: 3.5,
    waterUsage: 130,
    energyConsumption: 45,
    recyclability: 100
  }
];

export const mockProjects: LCAProject[] = [
  {
    id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    name: "Steel Production LCA - Mumbai Plant",
    description: "Complete life cycle assessment for carbon steel production using BF-BOF route",
    productName: "Hot Rolled Steel Coil",
    functionalUnit: "1 tonne of HR Steel Coil",
    systemBoundary: "cradle-to-gate",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-02-01T14:22:00Z",
    status: "in-progress",
    processes: [],
    totalImpact: {
      globalWarmingPotential: 2100,
      acidificationPotential: 8.5,
      eutrophicationPotential: 1.2,
      ozoneDepletionPotential: 0.00001,
      waterFootprint: 52,
      energyDemand: 25000,
      resourceDepletion: 15.5,
      humanToxicity: 0.0025,
      ecotoxicity: 450,
      circularityScore: 42
    }
  },
  {
    id: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
    name: "Copper Smelting Assessment",
    description: "Environmental impact assessment for copper smelting operations in Karnataka",
    productName: "Copper Cathode",
    functionalUnit: "1 tonne of LME Grade A Copper",
    systemBoundary: "gate-to-gate",
    createdAt: "2025-01-20T09:00:00Z",
    updatedAt: "2025-01-28T16:45:00Z",
    status: "completed",
    processes: [],
    totalImpact: {
      globalWarmingPotential: 3500,
      acidificationPotential: 45,
      eutrophicationPotential: 2.8,
      ozoneDepletionPotential: 0.00003,
      waterFootprint: 130,
      energyDemand: 48000,
      resourceDepletion: 28.5,
      humanToxicity: 0.0085,
      ecotoxicity: 1200,
      circularityScore: 35
    }
  },
  {
    id: "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
    name: "Aluminum Recycling Circularity Study",
    description: "Circularity assessment for secondary aluminum production from scrap",
    productName: "Secondary Aluminum Ingot",
    functionalUnit: "1 tonne of A380 Aluminum Alloy",
    systemBoundary: "cradle-to-grave",
    createdAt: "2025-02-01T08:15:00Z",
    updatedAt: "2025-02-04T11:30:00Z",
    status: "draft",
    processes: [],
    totalImpact: {
      globalWarmingPotential: 450,
      acidificationPotential: 2.1,
      eutrophicationPotential: 0.35,
      ozoneDepletionPotential: 0.000002,
      waterFootprint: 18,
      energyDemand: 5500,
      resourceDepletion: 3.2,
      humanToxicity: 0.0008,
      ecotoxicity: 85,
      circularityScore: 78
    }
  }
];


export const mockCircularityMetrics: CircularityMetrics = {
  recycledInputRate: 32,
  recyclabilityRate: 85,
  resourceEfficiency: 68,
  wasteReductionRate: 45,
  materialCircularityIndex: 0.58,
  byproductUtilization: 72
};

export const mockSustainabilityScore: SustainabilityScore = {
  environmental: 62,
  economic: 78,
  social: 71,
  overall: 70,
  grade: 'B'
};

export const mockRecommendations: AIRecommendation[] = [
  {
    id: "rec-1",
    type: "process-optimization",
    title: "Optimize Blast Furnace Operations",
    description: "Implement AI-based process control to optimize blast furnace parameters, reducing coke consumption by 8-12% while maintaining iron quality.",
    potentialImpactReduction: 15,
    implementationCost: "medium",
    implementationTime: "medium",
    priority: "high",
    confidence: 87
  },
  {
    id: "rec-2",
    type: "material-substitution",
    title: "Increase Scrap Steel Usage",
    description: "Replace 25% of iron ore input with recycled steel scrap in the BOF process. This can reduce GWP by up to 400 kg CO2e per tonne of steel.",
    potentialImpactReduction: 22,
    implementationCost: "low",
    implementationTime: "short",
    priority: "high",
    confidence: 92
  },
  {
    id: "rec-3",
    type: "energy-efficiency",
    title: "Waste Heat Recovery System",
    description: "Install waste heat recovery from slag cooling and hot exhaust gases for electricity generation. Potential to recover 15-20% of process heat.",
    potentialImpactReduction: 12,
    implementationCost: "high",
    implementationTime: "long",
    priority: "medium",
    confidence: 78
  },
  {
    id: "rec-4",
    type: "circularity",
    title: "Slag Valorization Program",
    description: "Implement comprehensive slag processing for cement and road construction applications, converting 90% of blast furnace slag to saleable byproducts.",
    potentialImpactReduction: 8,
    implementationCost: "medium",
    implementationTime: "medium",
    priority: "medium",
    confidence: 85
  },
  {
    id: "rec-5",
    type: "waste-reduction",
    title: "Closed-Loop Water System",
    description: "Implement zero liquid discharge system with advanced treatment and recycling of process water, reducing freshwater intake by 70%.",
    potentialImpactReduction: 18,
    implementationCost: "high",
    implementationTime: "long",
    priority: "high",
    confidence: 81
  }
];

export const mockMiningOperations: MiningOperation[] = [
  {
    id: "mine-1",
    name: "Jharkhand Iron Ore Complex",
    location: { lat: 22.8046, lng: 86.2029, country: "India", region: "Jharkhand" },
    type: "open-pit",
    primaryOre: "Iron Ore (Hematite)",
    annualProduction: 12000000,
    operationalSince: "1978",
    employees: 2500
  },
  {
    id: "mine-2",
    name: "Karnataka Copper Mine",
    location: { lat: 15.3173, lng: 75.7139, country: "India", region: "Karnataka" },
    type: "underground",
    primaryOre: "Copper Ore",
    annualProduction: 850000,
    operationalSince: "1992",
    employees: 1200
  },
  {
    id: "mine-3",
    name: "Odisha Bauxite Operation",
    location: { lat: 20.2961, lng: 85.8245, country: "India", region: "Odisha" },
    type: "open-pit",
    primaryOre: "Bauxite",
    annualProduction: 4500000,
    operationalSince: "2005",
    employees: 800
  }
];

export const monthlyEmissionsData = [
  { month: "Jan", co2: 1850, target: 2000 },
  { month: "Feb", co2: 1920, target: 1950 },
  { month: "Mar", co2: 1780, target: 1900 },
  { month: "Apr", co2: 1650, target: 1850 },
  { month: "May", co2: 1720, target: 1800 },
  { month: "Jun", co2: 1580, target: 1750 },
  { month: "Jul", co2: 1490, target: 1700 },
  { month: "Aug", co2: 1420, target: 1650 },
  { month: "Sep", co2: 1380, target: 1600 },
  { month: "Oct", co2: 1290, target: 1550 },
  { month: "Nov", co2: 1210, target: 1500 },
  { month: "Dec", co2: 1150, target: 1450 }
];

export const impactBreakdownData = [
  { name: "Mining & Extraction", value: 18, color: "hsl(var(--chart-1))" },
  { name: "Transportation", value: 8, color: "hsl(var(--chart-2))" },
  { name: "Beneficiation", value: 12, color: "hsl(var(--chart-3))" },
  { name: "Smelting & Refining", value: 45, color: "hsl(var(--chart-4))" },
  { name: "Manufacturing", value: 14, color: "hsl(var(--chart-5))" },
  { name: "End of Life", value: 3, color: "hsl(var(--chart-1))" }
];

export const circularityTrendData = [
  { year: "2020", mci: 0.32, target: 0.35 },
  { year: "2021", mci: 0.38, target: 0.42 },
  { year: "2022", mci: 0.45, target: 0.48 },
  { year: "2023", mci: 0.52, target: 0.55 },
  { year: "2024", mci: 0.58, target: 0.62 },
  { year: "2025", mci: 0.65, target: 0.70 }
];
