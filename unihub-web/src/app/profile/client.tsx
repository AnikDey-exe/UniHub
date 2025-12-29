"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Settings, List, Calendar as CalendarIcon, Plus } from "lucide-react"
import { useCurrentUser } from "@/context/user-context"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { EventCard } from "@/components/ui/event-card"
import { EventsCalendar } from "@/components/ui/events-calendar"
import { Button } from "@/components/ui/button"
import { EventSummary, Event } from "@/types/responses"
import { PageLoading } from "@/components/ui/loading"
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'

export function ProfileClient() {
  const { user, isLoading } = useCurrentUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("registered")
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <PageLoading text="Loading profile..." />
  }

  if (!user) {
    return null
  }

  const eventsAttended = user.eventsAttended || []
  const eventsCreated = user.eventsCreated || []
  const eventsAttendedCount = eventsAttended.length
  const eventsCreatedCount = eventsCreated.length

  const fullName = `${user.firstName} ${user.lastName}`
  const university = user.college?.name || "University"

  const convertEventSummaryToEvent = (eventSummary: EventSummary): Event => ({
    ...eventSummary,
    creator: undefined,
    attendees: undefined,
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl md:text-3xl font-bold text-muted-foreground">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{fullName}</h1>
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-base md:text-lg text-muted-foreground">{university}</p>
                  {user.college?.thumbnail && (
                    <img 
                      src={user.college.thumbnail} 
                      alt={university}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-border"
                    />
                  )}
                </div>
                {user.about ? (
                  <p className="text-sm md:text-base text-foreground mb-4">{user.about}</p>
                ) : (
                  <p className="text-sm md:text-base text-muted-foreground mb-4">[Bio here]</p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 text-sm md:text-base text-foreground">
                  <span>{eventsAttendedCount} events attended</span>
                  <span>{eventsCreatedCount} events hosted</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => router.push("/create-event")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Event
              </Button>
              <button
                onClick={() => router.push("/settings")}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5 text-foreground" />
              </button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto gap-0">
            <TabsTrigger 
              value="registered" 
              className="px-4 py-3 text-base font-medium text-muted-foreground rounded-none border-b-2 border-transparent data-[state=active]:text-foreground data-[state=active]:border-primary"
            >
              Registered Events
            </TabsTrigger>
            <TabsTrigger 
              value="hosted" 
              className="px-4 py-3 text-base font-medium text-muted-foreground rounded-none border-b-2 border-transparent data-[state=active]:text-foreground data-[state=active]:border-primary"
            >
              Hosted Events
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center justify-between mt-6 mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                List View
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className="flex items-center gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                Calendar View
              </Button>
            </div>
          </div>

          <TabsContent value="registered" className="mt-4">
            {eventsAttended.length > 0 ? (
              viewMode === "list" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {eventsAttended.map((eventSummary: EventSummary) => (
                    <EventCard key={eventSummary.id} event={convertEventSummaryToEvent(eventSummary)} variant="default" />
                  ))}
                </div>
              ) : (
                <EventsCalendar events={eventsAttended} />
              )
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No registered events yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="hosted" className="mt-4">
            {eventsCreated.length > 0 ? (
              viewMode === "list" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {eventsCreated.map((eventSummary: EventSummary) => (
                    <EventCard key={eventSummary.id} event={convertEventSummaryToEvent(eventSummary)} variant="default" />
                  ))}
                </div>
              ) : (
                <EventsCalendar events={eventsCreated} />
              )
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No hosted events yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

