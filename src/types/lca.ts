// Life Cycle Assessment Types for Metallurgy and Mining

export interface Material {
  id: string;
  name: string;
  category: 'ore' | 'concentrate' | 'metal' | 'alloy' | 'waste' | 'recycled';
  composition: Record<string, number>; // Element -> Percentage
  carbonFootprint: number; // kg CO2e per kg
  waterUsage: number; // liters per kg
  energyConsumption: number; // kWh per kg
  recyclability: number; // 0-100%
}

export interface Process {
  id: string;
  name: string;
  type: 'extraction' | 'beneficiation' | 'smelting' | 'refining' | 'manufacturing' | 'recycling' | 'disposal';
  inputs: MaterialFlow[];
  outputs: MaterialFlow[];
  emissions: EmissionData;
  energyInput: number; // kWh
  duration: number; // hours
  efficiency: number; // 0-100%
}

export interface MaterialFlow {
  materialId: string;
  quantity: number; // kg
  quality: number; // 0-100%
}

export interface EmissionData {
  co2: number; // kg
  so2: number; // kg
  nox: number; // kg
  particulates: number; // kg
  heavyMetals: number; // kg
  wastewater: number; // liters
}

export interface LCAProject {
  id: string;
  name: string;
  description: string;
  productName: string;
  functionalUnit: string;
  systemBoundary: 'cradle-to-gate' | 'cradle-to-grave' | 'gate-to-gate';
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
  processes: Process[];
  totalImpact: EnvironmentalImpact;
}

export interface EnvironmentalImpact {
  globalWarmingPotential: number; // kg CO2e
  acidificationPotential: number; // kg SO2e
  eutrophicationPotential: number; // kg PO4e
  ozoneDepletionPotential: number; // kg CFC-11e
  waterFootprint: number; // m³
  energyDemand: number; // MJ
  resourceDepletion: number; // kg Sb eq
  humanToxicity: number; // CTUh
  ecotoxicity: number; // CTUe
  circularityScore: number; // 0-100%
}

export interface CircularityMetrics {
  recycledInputRate: number; // %
  recyclabilityRate: number; // %
  resourceEfficiency: number; // %
  wasteReductionRate: number; // %
  materialCircularityIndex: number; // 0-1
  byproductUtilization: number; // %
}

export interface SustainabilityScore {
  environmental: number; // 0-100
  economic: number; // 0-100
  social: number; // 0-100
  overall: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface AIRecommendation {
  id: string;
  type: 'process-optimization' | 'material-substitution' | 'energy-efficiency' | 'waste-reduction' | 'circularity';
  title: string;
  description: string;
  potentialImpactReduction: number; // %
  implementationCost: 'low' | 'medium' | 'high';
  implementationTime: 'short' | 'medium' | 'long';
  priority: 'high' | 'medium' | 'low';
  confidence: number; // 0-100%
}

export interface BenchmarkData {
  industryAverage: EnvironmentalImpact;
  bestInClass: EnvironmentalImpact;
  regulatoryLimit: Partial<EnvironmentalImpact>;
}

export interface MiningOperation {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    country: string;
    region: string;
  };
  type: 'open-pit' | 'underground' | 'placer' | 'in-situ';
  primaryOre: string;
  annualProduction: number; // tonnes
  operationalSince: string;
  employees: number;
}
