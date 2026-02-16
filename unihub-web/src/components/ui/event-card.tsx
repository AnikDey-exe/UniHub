import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, CheckCircle2, XCircle, Ban } from "lucide-react"
import { Event, RegistrationStatus } from "@/types/responses"
import { cn } from "@/utils/cn"
import { formatEventDate } from "@/utils/formatEventDate"
import Link from "next/link"

interface EventCardProps {
  event: Event
  variant?: 'default' | 'compact' | 'figma'
  className?: string
  status?: RegistrationStatus
}

export function EventCard({ event, variant = 'default', className, status }: EventCardProps) {
  const getStatusIcon = () => {
    switch (status) {
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

  const getStatusText = () => {
    switch (status) {
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

  const getStatusColor = () => {
    switch (status) {
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
  if (variant === 'figma') {
    return (
      <Link href={`/events/${event.id}`}>
        <Card className={cn("overflow-hidden cursor-pointer hover:shadow-md transition-shadow", className)}>
          <div className="h-48 w-full bg-muted">
            <img 
              src={event.image || "/placeholder.svg"} 
              alt={event.name} 
              className="h-full w-full object-cover" 
            />
          </div>
          
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-bold text-foreground text-lg">{event.name}</h3>
              <p className="text-muted-foreground text-sm">
                {event.creator ? `${event.creator.firstName} ${event.creator.lastName}` : 'UC Berkeley'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Feb 19, 2026 at 7:30pm</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Berkeley, CA Computing Building</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Users className="h-4 w-4" />
                <span className="text-sm">8030 attending</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/events/${event.id}`}>
        <Card className={cn("overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer", className)}>
          <div className="relative h-40 w-full overflow-hidden bg-muted">
            <img 
              src={event.image || "/placeholder.svg"} 
              alt={event.name} 
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200" 
            />
            <Badge className="absolute top-2 right-2 bg-background/90 text-foreground text-xs">
              {event.type}
            </Badge>
          </div>

          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-base line-clamp-1 mb-1">{event.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {event.creator ? `${event.creator.firstName} ${event.creator.lastName}` : 'UniHub'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3 flex-shrink-0" />
                  <span>{event.numAttendees || 0} attending</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  // Default variant (from popular-events.tsx)
  return (
    <Link href={`/events/${event.id}`} className="h-full">
      <Card className={cn("overflow-hidden hover:shadow-lg transition-shadow p-0 cursor-pointer h-full flex flex-col", className)}>
        <div className="relative h-48 w-full overflow-hidden bg-muted flex-shrink-0">
          <img src={event.image || "/placeholder.svg"} alt={event.name} className="h-full w-full object-cover" />
          <Badge className="absolute top-3 right-3 bg-background/90 text-foreground hover:bg-background">
            {event.type}
          </Badge>
        </div>

        <div className="pb-6 pr-6 pl-6 flex flex-col flex-grow">
          <CardHeader className="pb-3 px-0">
            <h3 className="font-semibold text-lg line-clamp-1">{event.name}</h3>
            <p className="text-sm text-muted-foreground">
              {event.creator ? `${event.creator.firstName} ${event.creator.lastName}` : 'Berkeley'}
            </p>
          </CardHeader>

          <CardContent className="space-y-2 pb-3 px-0 flex-grow">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>{formatEventDate(event.eventStartDateUtc, event.eventEndDateUtc, event.eventTimezone)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{event.numAttendees|| 0} attending</span>
            </div>
            {status && (
              <div className={cn("flex items-center gap-2 text-sm font-medium", getStatusColor())}>
                {getStatusIcon()}
                <span>{getStatusText()}</span>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
