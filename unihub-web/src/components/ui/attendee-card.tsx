"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { UserSummary, Registration } from "@/types/responses"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/utils/cn"

interface AttendeeCardProps {
  attendee: UserSummary
  displayName?: string
  tickets?: number
  className?: string
}

export function AttendeeCard({ attendee, displayName, tickets, className }: AttendeeCardProps) {
  const fullName = `${attendee.firstName} ${attendee.lastName}`
  const initials = `${attendee.firstName[0]}${attendee.lastName[0]}`.toUpperCase()
  const nameToDisplay = displayName || fullName

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
          {attendee.profilePicture ? (
            <img 
              src={attendee.profilePicture} 
              alt={nameToDisplay}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-foreground">
              {initials}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-base text-foreground line-clamp-1">
              {nameToDisplay}
            </h3>
            {tickets !== undefined && tickets > 1 && (
              <Badge variant="secondary" className="text-xs">
                {tickets} tickets
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {attendee.email}
          </p>
          {attendee.college && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
              {attendee.college.name}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}

interface AttendeesListProps {
  attendees: Registration[]
  className?: string
}

export function AttendeesList({ attendees, className }: AttendeesListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAttendees = useMemo(() => {
    if (!searchQuery.trim()) {
      return attendees
    }

    const query = searchQuery.toLowerCase().trim()
    return attendees.filter((registration) => {
      const displayName = registration.displayName.toLowerCase()
      const fullName = `${registration.attendee.firstName} ${registration.attendee.lastName}`.toLowerCase()
      const email = registration.attendee.email.toLowerCase()
      return displayName.includes(query) || fullName.includes(query) || email.includes(query)
    })
  }, [attendees, searchQuery])

  if (attendees.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 border border-dashed border-border rounded-lg bg-muted/30">
        <p className="text-muted-foreground text-lg">No attendees yet</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredAttendees.length === 0 ? (
        <div className="flex items-center justify-center py-12 border border-dashed border-border rounded-lg bg-muted/30">
          <p className="text-muted-foreground text-lg">No attendees found matching &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttendees.map((registration) => (
            <AttendeeCard
              key={registration.id}
              attendee={registration.attendee}
              displayName={registration.displayName}
              tickets={registration.tickets}
            />
          ))}
        </div>
      )}
    </div>
  )
}

