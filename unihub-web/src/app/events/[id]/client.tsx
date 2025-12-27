"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users } from "lucide-react"
import { Event } from "@/types/responses"
import { formatAttendees } from "@/utils/formatAttendees"
import { useCurrentUser } from "@/context/user-context"
import { useRSVP } from "@/hooks/use-rsvp"
import { useUnRSVP } from "@/hooks/use-unrsvp"
import { useEvent } from "@/hooks/use-event"

interface EventDetailsClientProps {
  event: Event
}

export function EventDetailsClient({ event }: EventDetailsClientProps) {
  const router = useRouter()
  const { user } = useCurrentUser()
  const { data: eventData } = useEvent(event.id, event)
  const rsvpMutation = useRSVP(event.id)
  const unrsvpMutation = useUnRSVP(event.id)

  const attendeesCount = eventData?.attendees?.length || 0
  const university = eventData?.creator 
    ? `${eventData.creator.firstName} ${eventData.creator.lastName}` 
    : 'University'

  const isRegistered = user && eventData?.attendees?.some(
    attendee => attendee.email === user.email
  )

  const handleRSVP = () => {
    if (rsvpMutation.isPending || unrsvpMutation.isPending) {
      return
    }
  
    if (!user) {
      router.push('/login')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    if (isRegistered) {
      unrsvpMutation.mutate({
        rsvpData: {
          eventId: event.id,
          userEmail: user.email,
        },
        token,
      })
    } else {
      rsvpMutation.mutate({
        rsvpData: {
          eventId: event.id,
          userEmail: user.email,
        },
        token,
      })
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

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Based on what you like</h2>
          <div className="flex items-center justify-center py-12 border border-dashed border-border rounded-lg bg-muted/30">
            <p className="text-muted-foreground text-lg">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}

