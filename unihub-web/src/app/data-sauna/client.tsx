"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/context/user-context"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"
import { ChevronDown, ChevronRight } from "lucide-react"
import { PageLoading } from "@/components/ui/loading"
import { Event } from "@/types/responses"
import { eventsAPI } from "@/lib/api"
import { AnalyticsTab, EventDetailView, type AnalyticsCategory } from "./components"

/**
 * Data Sauna nav/state model:
 * - activeTab: which main section is shown (analytics | events). Drives Tabs + TabsContent.
 * - Dropdown open state (analyticsOpen, eventDetailsOpen): independent of activeTab. Toggling
 *   a dropdown does not change activeTab.
 * - Selecting a child (analytics category or an event) updates that section’s sub-state
 *   (analyticsCategory, selectedEventId) and sets activeTab to that section’s parent so the
 *   main content switches to the chosen child.
 * - Content is rendered via Tabs (value=activeTab) and conditional rendering inside each
 *   TabsContent (e.g. by analyticsCategory or selectedEvent).
 */

export function DataSaunaClient() {
  const { user, isLoading } = useCurrentUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"analytics" | "events">("analytics")
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [analyticsCategory, setAnalyticsCategory] = useState<AnalyticsCategory | null>(null)
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [eventsDetail, setEventsDetail] = useState<Record<number, Event>>({})

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user?.eventsCreated?.length || activeTab !== "events") return
    const ids = user.eventsCreated.map((e) => e.id)
    Promise.all(ids.map((id) => eventsAPI.getEventById(id)))
      .then((events) => {
        const map: Record<number, Event> = {}
        events.forEach((ev) => {
          map[ev.id] = ev
        })
        setEventsDetail(map)
      })
      .catch(() => {})
  }, [user?.eventsCreated, activeTab])

  const handleAnalyticsClick = () => {
    setAnalyticsOpen((open) => !open)
  }

  const handleAnalyticsCategorySelect = (category: AnalyticsCategory) => {
    setAnalyticsCategory(category)
    setActiveTab("analytics")
  }

  const handleEventDetailsClick = () => {
    setEventDetailsOpen((open) => !open)
  }

  const handleEventSelect = (eventId: number) => {
    setSelectedEventId(eventId)
    setActiveTab("events")
  }

  if (isLoading) {
    return <PageLoading text="Loading..." />
  }

  if (!user) {
    return null
  }

  const eventsCreated = user.eventsCreated ?? []
  const selectedEvent = selectedEventId
    ? eventsCreated.find((e) => e.id === selectedEventId)
    : null

  return (
    <div className="min-h-screen bg-muted/30">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "analytics" | "events")}
        className="flex min-h-screen w-full"
      >
        <aside className="flex w-56 shrink-0 flex-col border-r border-border/80 bg-card py-6 md:w-64">
          <div className="px-4 mb-6">
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              Data Sauna
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Analytics & event details
            </p>
          </div>
          <nav className="space-y-1 px-2">
            <button
              type="button"
              onClick={handleAnalyticsClick}
              className={cn(
                "relative flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm rounded-lg transition-colors",
                activeTab === "analytics"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
              aria-expanded={analyticsOpen}
            >
              <span>Analytics</span>
              {analyticsOpen ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-current" aria-hidden />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-current" aria-hidden />
              )}
              {activeTab === "analytics" && (
                <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-primary rounded-l" />
              )}
            </button>
            {analyticsOpen && (
              <div className="mt-2 space-y-0.5 border-l-2 border-border/80 pl-3 ml-2">
                {(
                  [
                    { value: "overview" as const, label: "Overview" },
                    { value: "registrations" as const, label: "Registrations" },
                    { value: "engagement" as const, label: "Engagement" },
                    { value: "popular-events" as const, label: "Popular events" },
                  ]
                ).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleAnalyticsCategorySelect(value)}
                    className={cn(
                      "block w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                      activeTab === "analytics" && analyticsCategory === value
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={handleEventDetailsClick}
              className={cn(
                "relative flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm rounded-lg transition-colors",
                activeTab === "events"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
              aria-expanded={eventDetailsOpen}
            >
              <span>Event details</span>
              {eventDetailsOpen ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-current" aria-hidden />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-current" aria-hidden />
              )}
              {activeTab === "events" && (
                <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-primary rounded-l" />
              )}
            </button>
            {eventDetailsOpen && eventsCreated.length > 0 && (
              <div className="mt-2 space-y-0.5 border-l-2 border-border/80 pl-3 ml-2">
                {eventsCreated.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => handleEventSelect(event.id)}
                    className={cn(
                      "block w-full rounded-md px-3 py-2 text-left text-sm transition-colors truncate",
                      selectedEventId === event.id && activeTab === "events"
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {event.name}
                  </button>
                ))}
              </div>
            )}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-auto text-left">
          <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 text-left">
            <TabsContent value="analytics" className="mt-0">
              {analyticsCategory ? (
                <AnalyticsTab category={analyticsCategory} />
              ) : (
                <p className="text-muted-foreground">Select a category from the list.</p>
              )}
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              {eventsCreated.length === 0 ? (
                <Card className="border border-border/80 bg-card p-12 shadow-sm">
                  <p className="text-muted-foreground">You haven’t created any events yet.</p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push("/create-event")}
                  >
                    Create event
                  </Button>
                </Card>
              ) : selectedEvent ? (
                <EventDetailView
                  event={selectedEvent}
                  fullEvent={eventsDetail[selectedEvent.id] ?? null}
                />
              ) : (
                <p className="text-muted-foreground">Select an event from the list.</p>
              )}
            </TabsContent>
          </div>
        </main>
      </Tabs>
    </div>
  )
}
