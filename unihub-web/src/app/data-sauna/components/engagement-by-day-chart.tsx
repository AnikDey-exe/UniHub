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
import { MOCK_ENGAGEMENT_BY_DAY } from "./mock-data"

export function EngagementByDayChart() {
  return (
    <Card className="border border-border/80 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Engagement by day of week</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_ENGAGEMENT_BY_DAY}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value: number) => [`${value}%`, "Engagement"]}
              />
              <Bar dataKey="rate" name="Engagement %" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
