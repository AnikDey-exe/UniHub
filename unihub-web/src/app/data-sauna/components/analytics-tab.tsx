"use client"

import { BarChart3, TrendingUp, MousePointer, Users } from "lucide-react"
import { MetricCard } from "./metric-card"
import { RegistrationsChart } from "./registrations-chart"
import { EngagementChart } from "./engagement-chart"
import { PopularEventsChart } from "./popular-events-chart"
import { MOCK_METRICS } from "./mock-data"

export function AnalyticsTab() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total clicks"
          value={MOCK_METRICS.clicks.value}
          change={MOCK_METRICS.clicks.change}
          icon={MousePointer}
        />
        <MetricCard
          title="Registrations"
          value={MOCK_METRICS.registrations.value}
          change={MOCK_METRICS.registrations.change}
          icon={Users}
        />
        <MetricCard
          title="Conversion rate"
          value={MOCK_METRICS.conversionRate.value}
          change={MOCK_METRICS.conversionRate.change}
          icon={TrendingUp}
        />
        <MetricCard
          title="Engagement %"
          value={MOCK_METRICS.engagement.value}
          change={MOCK_METRICS.engagement.change}
          icon={BarChart3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RegistrationsChart />
        <EngagementChart />
      </div>

      <PopularEventsChart />
    </div>
  )
}
