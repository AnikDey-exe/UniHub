"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Event } from "@/types/responses"
import { useEventRegistrations } from "@/hooks/use-event-registrations"
import { AttendeesList } from "@/components/ui/attendee-card"
import { Loading } from "@/components/ui/loading"

interface EventAttendeesClientProps {
  event: Event
}

export function EventAttendeesClient({ event }: EventAttendeesClientProps) {
  const router = useRouter()
  const { data: registrations, isLoading } = useEventRegistrations(event.id)

  const attendeesCount = registrations?.reduce((sum, registration) => sum + registration.tickets, 0) || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/events/${event.id}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Event
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.name}</h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Attendees ({attendeesCount})</h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loading variant="spinner" size="md" />
          </div>
        ) : registrations && registrations.length > 0 ? (
          <AttendeesList attendees={registrations} canUpdateStatus={true} eventId={event.id} />
        ) : (
          <div className="flex items-center justify-center py-12 border border-dashed border-border rounded-lg bg-muted/30">
            <p className="text-muted-foreground text-lg">No attendees yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
