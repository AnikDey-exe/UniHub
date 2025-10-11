import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"
import { Event } from "@/types/responses"
import { cn } from "@/utils/cn"

interface EventCardProps {
  event: Event
  variant?: 'default' | 'compact' | 'figma'
  className?: string
}

export function EventCard({ event, variant = 'default', className }: EventCardProps) {
  if (variant === 'figma') {
    return (
      <Card className={cn("bg-white shadow-sm border border-gray-200 overflow-hidden", className)}>
        <div className="h-48 w-full bg-gray-200">
          <img 
            src="/placeholder.svg" 
            alt={event.name} 
            className="h-full w-full object-cover" 
          />
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{event.name}</h3>
            <p className="text-gray-600 text-sm">
              {event.creator ? `${event.creator.firstName} ${event.creator.lastName}` : 'UC Berkeley'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Feb 19, 2026 at 7:30pm</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Berkeley, CA Computing Building</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="h-4 w-4" />
              <span className="text-sm">8030 attending</span>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (variant === 'compact') {
    return (
      <Card className={cn("overflow-hidden hover:shadow-lg transition-shadow group", className)}>
        <div className="relative h-40 w-full overflow-hidden bg-muted">
          <img 
            src="/placeholder.svg" 
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
                <span>{event.attendees?.length || 0} attending</span>
              </div>
            </div>

            <Button className="w-full" variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant (from popular-events.tsx)
  return (
    <Card className={cn("overflow-hidden hover:shadow-lg transition-shadow p-0", className)}>
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <img src="/placeholder.svg" alt={event.name} className="h-full w-full object-cover" />
        <Badge className="absolute top-3 right-3 bg-background/90 text-foreground hover:bg-background">
          {event.type}
        </Badge>
      </div>

      <div className="pb-6 pr-6 pl-6">
        <CardHeader className="pb-3 px-0">
          <h3 className="font-semibold text-lg line-clamp-1">{event.name}</h3>
          <p className="text-sm text-muted-foreground">
            {event.creator ? `${event.creator.firstName} ${event.creator.lastName}` : 'Berkeley'}
          </p>
        </CardHeader>

        <CardContent className="space-y-2 pb-3 px-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {/* <span>
              {event.date} at {event.time}
            </span> */}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{event.attendees?.length || 0} attending</span>
          </div>
        </CardContent>

        <CardFooter className="px-0 pt-0">
          <Button className="w-full bg-transparent" variant="outline">
            View Details
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}
