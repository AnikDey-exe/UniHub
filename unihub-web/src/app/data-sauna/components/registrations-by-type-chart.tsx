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
import { MOCK_REGISTRATIONS_BY_TYPE } from "./mock-data"

export function RegistrationsByTypeChart() {
  return (
    <Card className="border border-border/80 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Registrations by event type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_REGISTRATIONS_BY_TYPE} margin={{ bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" vertical={false} />
              <XAxis
                dataKey="type"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
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
              <Bar dataKey="count" name="Registrations" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
