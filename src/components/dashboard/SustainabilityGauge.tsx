import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SustainabilityScore } from "@/types/lca";
import { cn } from "@/lib/utils";

interface SustainabilityGaugeProps {
  score: SustainabilityScore;
}

const gradeColors: Record<string, string> = {
  'A': 'bg-emerald-500',
  'B': 'bg-green-500',
  'C': 'bg-yellow-500',
  'D': 'bg-orange-500',
  'F': 'bg-destructive'
};

const gradeLabels: Record<string, string> = {
  'A': 'Excellent',
  'B': 'Good',
  'C': 'Average',
  'D': 'Below Average',
  'F': 'Poor'
};

export function SustainabilityGauge({ score }: SustainabilityGaugeProps) {
  const categories = [
    { name: 'Environmental', value: score.environmental, color: 'bg-emerald-500' },
    { name: 'Economic', value: score.economic, color: 'bg-blue-500' },
    { name: 'Social', value: score.social, color: 'bg-purple-500' },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Sustainability Score</CardTitle>
          <Badge className={cn("text-white", gradeColors[score.grade])}>
            Grade {score.grade}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(score.overall / 100) * 352} 352`}
                className={cn(
                  score.overall >= 80 ? "text-emerald-500" :
                  score.overall >= 60 ? "text-green-500" :
                  score.overall >= 40 ? "text-yellow-500" :
                  "text-destructive"
                )}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{score.overall}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {gradeLabels[score.grade]} Performance
        </p>

        {/* Category Breakdown */}
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{category.name}</span>
                <span className="font-medium">{category.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-500", category.color)}
                  style={{ width: `${category.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
