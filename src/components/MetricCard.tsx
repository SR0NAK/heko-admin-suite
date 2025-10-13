import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "primary" | "secondary" | "accent";
  className?: string;
}

const variantClasses = {
  default: "bg-[hsl(var(--metric-bg-1))]",
  primary: "bg-[hsl(var(--metric-bg-2))]",
  secondary: "bg-[hsl(var(--metric-bg-3))]",
  accent: "bg-[hsl(var(--metric-bg-4))]",
};

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardContent className={cn("p-6", variantClasses[variant])}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground">
                <span
                  className={cn(
                    "font-semibold",
                    trend.value >= 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.value >= 0 ? "+" : ""}
                  {trend.value}%
                </span>{" "}
                {trend.label}
              </p>
            )}
          </div>
          <div className="p-3 rounded-lg bg-white/50">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
