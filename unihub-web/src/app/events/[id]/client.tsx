"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Clock, CheckCircle2, XCircle, Ban, Calendar, CalendarClock, UserCheck, Ticket, ShieldCheck } from "lucide-react"
import { Event, Registration, RegistrationStatus } from "@/types/responses"
import { AnswerRequest } from "@/types/requests"
import { formatAttendees } from "@/utils/formatAttendees"
import { formatEventDate } from "@/utils/formatEventDate"
import { useCurrentUser } from "@/context/user-context"
import { useRSVP } from "@/hooks/use-rsvp"
import { useUnRSVP } from "@/hooks/use-unrsvp"
import { useEvent } from "@/hooks/use-event"
import { useRecommendedEvents } from "@/hooks/use-recommended-events"
import { useIsRegistered } from "@/hooks/use-is-registered"
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
  const { data: isRegisteredResponse } = useIsRegistered(event.id, user?.id)
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)

  // Calculate total attendees count from registrations (sum of tickets)
  const attendeesCount = eventData?.numAttendees || 0
  
  const university = eventData?.creator 
    ? `${eventData.creator.firstName} ${eventData.creator.lastName}` 
    : 'University'

  const isRegistered = isRegisteredResponse?.exists === true
  // Backend is-registered endpoint only returns { exists }; full registration details not available here
  const userRegistration: Registration | null = null

  const isCreator = user && eventData?.creator && user.id === eventData.creator.id

  const handleRegister = (displayName: string, tickets: number, answers?: AnswerRequest[]) => {
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
          status: eventData?.requiresApproval ? RegistrationStatus.PENDING : RegistrationStatus.APPROVED,
          answers,
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

  const getStatusIcon = (reg: Registration | null) => {
    if (!reg) return null
    switch (reg.status) {
      case RegistrationStatus.PENDING:
        return <Clock className="h-4 w-4" />
      case RegistrationStatus.APPROVED:
        return <CheckCircle2 className="h-4 w-4" />
      case RegistrationStatus.REJECTED:
        return <XCircle className="h-4 w-4" />
      case RegistrationStatus.CANCELLED:
        return <Ban className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusText = (reg: Registration | null) => {
    if (!reg) return ''
    switch (reg.status) {
      case RegistrationStatus.PENDING:
        return 'Pending'
      case RegistrationStatus.APPROVED:
        return 'Approved'
      case RegistrationStatus.REJECTED:
        return 'Rejected'
      case RegistrationStatus.CANCELLED:
        return 'Cancelled'
      default:
        return ''
    }
  }

  const getStatusColor = (reg: Registration | null) => {
    if (!reg) return 'text-muted-foreground'
    switch (reg.status) {
      case RegistrationStatus.PENDING:
        return 'text-yellow-600'
      case RegistrationStatus.APPROVED:
        return 'text-green-600'
      case RegistrationStatus.REJECTED:
        return 'text-red-600'
      case RegistrationStatus.CANCELLED:
        return 'text-gray-600'
      default:
        return 'text-muted-foreground'
    }
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 md:gap-12 mb-12">
          <div className="flex flex-col justify-center h-full w-full bg-muted rounded-lg overflow-hidden aspect-[4/3]">
            {eventData?.image ? (
              <img 
                src={eventData.image} 
                alt={eventData.name || "Event image"} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
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
              {eventData?.eventStartDateUtc && eventData?.eventEndDateUtc && (
                <div className="flex items-start gap-3 text-foreground">
                  <Calendar className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-base font-medium">Date & Time</span>
                    <span className="text-sm text-muted-foreground">
                      {formatEventDate(eventData.eventStartDateUtc, eventData.eventEndDateUtc, eventData.eventTimezone)}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 text-foreground">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span className="text-base">{eventData?.location}</span>
              </div>
              
              <div className="flex items-center gap-3 text-foreground">
                <Users className="h-5 w-5 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-base">{formatAttendees(attendeesCount)}</span>
                  {eventData && eventData.capacity > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {eventData.capacity - attendeesCount} spots remaining
                    </span>
                  )}
                </div>
              </div>

              {eventData && eventData.capacity > 0 && (
                <div className="flex items-center gap-3 text-foreground">
                  <UserCheck className="h-5 w-5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-base">Capacity</span>
                    <span className="text-sm text-muted-foreground">
                      {eventData.capacity} total spots
                    </span>
                  </div>
                </div>
              )}

              {eventData && eventData.maxTickets > 0 && (
                <div className="flex items-center gap-3 text-foreground">
                  <Ticket className="h-5 w-5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-base">Max Tickets per Registration</span>
                    <span className="text-sm text-muted-foreground">
                      Up to {eventData.maxTickets} ticket{eventData.maxTickets !== 1 ? 's' : ''} per person
                    </span>
                  </div>
                </div>
              )}

              {eventData && (
                <div className="flex items-center gap-3 text-foreground">
                  <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-base">Approval Required</span>
                    <span className="text-sm text-muted-foreground">
                      {eventData.requiresApproval ? 'Yes - Registration requires organizer approval' : 'No - Registration is automatic'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
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
              {isRegistered && userRegistration && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Registered as {(userRegistration as Registration).displayName}
                  </p>
                  <div className={`flex items-center gap-2 text-sm font-medium ${getStatusColor(userRegistration)}`}>
                    {getStatusIcon(userRegistration)}
                    <span>{getStatusText(userRegistration)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Description</h2>
          <p className="text-foreground leading-relaxed text-base">
            {eventData?.description || "No description available for this event."}
          </p>
        </div>

        {isCreator && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">Attendees ({attendeesCount})</h2>
              <Button
                variant="outline"
                onClick={() => router.push(`/events/${event.id}/attendees`)}
              >
                View All
              </Button>
            </div>
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
        questions={eventData?.questions}
        onSubmit={handleRegister}
        isPending={rsvpMutation.isPending}
      />
    </div>
  )
}

