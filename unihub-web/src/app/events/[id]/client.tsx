"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users } from "lucide-react"
import { Event, RegistrationStatus } from "@/types/responses"
import { formatAttendees } from "@/utils/formatAttendees"
import { useCurrentUser } from "@/context/user-context"
import { useRSVP } from "@/hooks/use-rsvp"
import { useUnRSVP } from "@/hooks/use-unrsvp"
import { useEvent } from "@/hooks/use-event"
import { useRecommendedEvents } from "@/hooks/use-recommended-events"
import { EventCard } from "@/components/ui/event-card"
import { Loading } from "@/components/ui/loading"
import { AttendeesList } from "@/components/ui/attendee-card"
import { RegistrationModal } from "./components/registration-modal"

interface EventDetailsClientProps {
  event: Event
}

export function EventDetailsClient({ event }: EventDetailsClientProps) {
  const router = useRouter()
  const { user } = useCurrentUser()
  const { data: eventData } = useEvent(event.id, event)
  const rsvpMutation = useRSVP(event.id)
  const unrsvpMutation = useUnRSVP(event.id)
  const { data: recommendedEvents, isLoading: isLoadingRecommended } = useRecommendedEvents(event.id)
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)

  // Calculate total attendees count from registrations (sum of tickets)
  const attendeesCount = eventData?.attendees?.reduce((sum, registration) => sum + registration.tickets, 0) || 0
  
  const university = eventData?.creator 
    ? `${eventData.creator.firstName} ${eventData.creator.lastName}` 
    : 'University'

  // Check if user is registered by looking at attendee.email in Registration objects
  const isRegistered = user && eventData?.attendees?.some(
    registration => registration.attendee.email === user.email
  )

  const isCreator = user && eventData?.creator && user.id === eventData.creator.id

  const handleRegister = (displayName: string, tickets: number) => {
    if (!user) {
      router.push('/login')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Ensure tickets is a valid number
    const ticketsNumber = Number(tickets) || 1
    if (ticketsNumber < 1) {
      return
    }

    rsvpMutation.mutate(
      {
        rsvpData: {
          eventId: event.id,
          userEmail: user.email,
          displayName: displayName.trim(),
          tickets: ticketsNumber,
          status: RegistrationStatus.APPROVED,
        },
        token,
      },
      {
        onSuccess: () => {
          setIsRegistrationModalOpen(false)
        },
      }
    )
  }

  const handleUnregister = () => {
    if (!user) {
      router.push('/login')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    unrsvpMutation.mutate({
      rsvpData: {
        eventId: event.id,
        userEmail: user.email,
      },
      token,
    })
  }

  const handleRSVP = () => {
    if (rsvpMutation.isPending || unrsvpMutation.isPending) {
      return
    }
  
    if (!user) {
      router.push('/login')
      return
    }

    if (isRegistered) {
      handleUnregister()
    } else {
      setIsRegistrationModalOpen(true)
    }
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 md:gap-12 mb-12">
          <div className="w-full bg-muted rounded-lg overflow-hidden">
            {eventData?.image ? (
              <div className="w-full aspect-[4/3] bg-muted overflow-hidden">
                <img 
                  src={eventData.image} 
                  alt={eventData.name || "Event image"} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Event Image</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">{eventData?.name}</h1>
              <p className="text-base md:text-lg text-foreground">{university}</p>
              <Badge variant="outline" className="w-fit mt-1">
                {eventData?.type}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-foreground">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span className="text-base">{eventData?.location}</span>
              </div>
              
              <div className="flex items-center gap-3 text-foreground">
                <Users className="h-5 w-5 flex-shrink-0" />
                <span className="text-base">{formatAttendees(attendeesCount)}</span>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full md:w-auto rounded-md"
              onClick={handleRSVP}
              disabled={rsvpMutation.isPending || unrsvpMutation.isPending}
            >
              {rsvpMutation.isPending 
                ? 'Registering...' 
                : unrsvpMutation.isPending
                  ? 'Unregistering...'
                  : isRegistered 
                    ? 'Unregister' 
                    : 'Register'}
            </Button>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Description</h2>
          <p className="text-foreground leading-relaxed text-base">
            {eventData?.description || "No description available for this event."}
          </p>
        </div>

        {isCreator && eventData?.attendees !== undefined && (
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Attendees ({attendeesCount})</h2>
            <AttendeesList attendees={eventData.attendees} />
          </div>
        )}

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">More Events Like This</h2>
          {isLoadingRecommended ? (
            <div className="flex items-center justify-center py-12">
              <Loading variant="spinner" size="md" />
            </div>
          ) : recommendedEvents && recommendedEvents.length > 0 ? (
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6 min-w-max">
                {recommendedEvents.map((recommendedEvent) => (
                  <div key={recommendedEvent.id} className="w-80 flex-shrink-0">
                    <EventCard event={recommendedEvent} variant="default" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 border border-dashed border-border rounded-lg bg-muted/30">
              <p className="text-muted-foreground text-lg">No recommendations available</p>
            </div>
          )}
        </div>
      </div>

      <RegistrationModal
        open={isRegistrationModalOpen}
        onOpenChange={setIsRegistrationModalOpen}
        user={user}
        onSubmit={handleRegister}
        isPending={rsvpMutation.isPending}
      />
    </div>
  )
}

