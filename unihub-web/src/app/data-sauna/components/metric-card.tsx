import { Card, CardContent } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  icon: React.ElementType
}

export function MetricCard({ title, value, change, icon: Icon }: MetricCardProps) {
  const isPositive = change >= 0
  return (
    <Card className="border border-border/80 bg-card shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {typeof value === "number" ? value.toLocaleString() : value}
              {title === "Conversion rate" && "%"}
            </p>
            <p
              className={`mt-1 text-xs font-medium ${
                isPositive ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {change}% from last month
            </p>
          </div>
          <div className="rounded-lg bg-muted/80 p-2.5">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
