"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MOCK_OVERVIEW_TREND } from "./mock-data"

export function OverviewTrendChart() {
  return (
    <Card className="border border-border/80 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Registrations trend (last 6 months)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_OVERVIEW_TREND}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                name="Registrations"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ fill: "var(--primary)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
