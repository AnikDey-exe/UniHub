"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MOCK_CAPACITY_FILL_BY_EVENT } from "./mock-data"

export function CapacityFillChart() {
  return (
    <Card className="border border-border/80 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Capacity fill rate by event</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={MOCK_CAPACITY_FILL_BY_EVENT}
              layout="vertical"
              margin={{ left: 8, right: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={140}
                tick={{ fontSize: 11, fill: "var(--foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value: number, _name: string, props: { payload: { capacity: number } }) => [
                  `${value}% (capacity ${props.payload.capacity})`,
                  "Fill rate",
                ]}
              />
              <Bar
                dataKey="fill"
                name="Fill %"
                fill="var(--chart-5)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
