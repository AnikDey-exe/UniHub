"use client"

import {
  BarChart3,
  TrendingUp,
  MousePointer,
  Users,
  Clock,
  Repeat,
  Calendar,
  FileCheck,
  Target,
  Zap,
  CalendarDays,
} from "lucide-react"
import { MetricCard } from "./metric-card"
import { RegistrationsChart } from "./registrations-chart"
import { EngagementChart } from "./engagement-chart"
import { PopularEventsChart } from "./popular-events-chart"
import { OverviewTrendChart } from "./overview-trend-chart"
import { RegistrationsByWeekChart } from "./registrations-by-week-chart"
import { RegistrationsByTypeChart } from "./registrations-by-type-chart"
import { EngagementByDayChart } from "./engagement-by-day-chart"
import { CapacityFillChart } from "./capacity-fill-chart"
import {
  MOCK_METRICS,
  MOCK_REGISTRATIONS_METRICS,
  MOCK_ENGAGEMENT_METRICS,
  MOCK_POPULAR_METRICS,
} from "./mock-data"

export type AnalyticsCategory = "overview" | "registrations" | "engagement" | "popular-events"

interface AnalyticsTabProps {
  category: AnalyticsCategory
}

export function AnalyticsTab({ category }: AnalyticsTabProps) {
  if (category === "overview") {
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
        <div className="grid gap-4 sm:grid-cols-2">
          <MetricCard
            title="Avg. session"
            value={8.4}
            change={0.5}
            icon={Clock}
            valueSuffix=" min"
          />
          <MetricCard
            title="Return rate"
            value={67}
            change={4.2}
            icon={Repeat}
            valueSuffix="%"
          />
        </div>
        <OverviewTrendChart />
      </div>
    )
  }

  if (category === "registrations") {
    const m = MOCK_REGISTRATIONS_METRICS
    return (
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total this month"
            value={m.totalThisMonth.value}
            change={m.totalThisMonth.change}
            icon={Calendar}
            valueSuffix=""
          />
          <MetricCard
            title="Pending approvals"
            value={m.pendingApprovals.value}
            change={m.pendingApprovals.change}
            icon={FileCheck}
          />
          <MetricCard
            title="Completed"
            value={m.completed.value}
            change={m.completed.change}
            icon={Target}
          />
          <MetricCard
            title="Avg per event"
            value={m.avgPerEvent.value}
            change={m.avgPerEvent.change}
            icon={Users}
          />
        </div>
        <RegistrationsChart />
        <div className="grid gap-6 lg:grid-cols-2">
          <RegistrationsByWeekChart />
          <RegistrationsByTypeChart />
        </div>
      </div>
    )
  }

  if (category === "engagement") {
    const m = MOCK_ENGAGEMENT_METRICS
    return (
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Avg. engagement rate"
            value={m.avgRate.value}
            change={m.avgRate.change}
            icon={BarChart3}
            valueSuffix="%"
          />
          <MetricCard
            title="Peak day"
            value={m.peakDay.value}
            change={0}
            icon={CalendarDays}
          />
          <MetricCard
            title="Active users"
            value={m.activeUsers.value}
            change={m.activeUsers.change}
            icon={Users}
          />
          <MetricCard
            title="Avg. session"
            value={m.avgSessionMin.value}
            change={m.avgSessionMin.change}
            icon={Clock}
            valueSuffix=" min"
          />
        </div>
        <EngagementChart />
        <EngagementByDayChart />
      </div>
    )
  }

  if (category === "popular-events") {
    const m = MOCK_POPULAR_METRICS
    return (
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total events"
            value={m.totalEvents.value}
            change={m.totalEvents.change}
            icon={Calendar}
          />
          <MetricCard
            title="Avg. registrations"
            value={m.avgRegistrations.value}
            change={m.avgRegistrations.change}
            icon={Users}
          />
          <MetricCard
            title="Top event"
            value={m.topEventRegistrations.value}
            change={m.topEventRegistrations.change}
            icon={Zap}
          />
          <MetricCard
            title="Capacity utilization"
            value={m.capacityUtilization.value}
            change={m.capacityUtilization.change}
            icon={Target}
            valueSuffix="%"
          />
        </div>
        <PopularEventsChart />
        <CapacityFillChart />
      </div>
    )
  }

  return null
}
