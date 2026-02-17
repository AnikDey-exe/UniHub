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
import { MOCK_REGISTRATIONS_BY_WEEK } from "./mock-data"

export function RegistrationsByWeekChart() {
  return (
    <Card className="border border-border/80 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Registrations by week (this month)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_REGISTRATIONS_BY_WEEK}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar dataKey="count" name="Registrations" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
