"use client"

import { useState, useMemo } from "react"
import { Search, Clock, CheckCircle2, XCircle, Ban, Ticket } from "lucide-react"
import { Registration, RegistrationStatus } from "@/types/responses"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/utils/cn"
import { useUpdateRegistrationStatus } from "@/hooks/use-update-registration-status"
import { useCurrentUser } from "@/context/user-context"

interface AttendeeCardProps {
  registration: Registration
  canUpdateStatus?: boolean
  eventId?: number
  className?: string
}

export function AttendeeCard({ registration, canUpdateStatus = false, eventId, className }: AttendeeCardProps) {
  const { attendee, displayName, tickets, status, answers = [] } = registration
  const fullName = `${attendee.firstName} ${attendee.lastName}`
  const initials = `${attendee.firstName[0]}${attendee.lastName[0]}`.toUpperCase()
  const nameToDisplay = displayName || fullName
  const { user } = useCurrentUser()
  const updateStatusMutation = useUpdateRegistrationStatus(eventId || 0)

  const handleStatusChange = (newStatus: RegistrationStatus) => {
    if (!user || !eventId) return
    
    const token = localStorage.getItem('token')
    if (!token) return

    updateStatusMutation.mutate({
      registrationId: registration.id,
      newStatus,
      token,
    })
  }

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

  return (
    <Card className={cn("p-4", className)}>
      <div className="space-y-3">
        <div className="flex items-start gap-4">
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
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-semibold text-base text-foreground line-clamp-1">
                {nameToDisplay}
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                #{registration.id}
              </span>
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

        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tickets</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {tickets}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm text-muted-foreground">Status</span>
            </div>
            {canUpdateStatus ? (
              <Select
                value={status}
                onValueChange={(value) => handleStatusChange(value as RegistrationStatus)}
                disabled={updateStatusMutation.isPending}
              >
                <SelectTrigger className={cn("h-8 w-[140px] text-xs", getStatusColor())}>
                  <SelectValue>
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon()}
                      <span className="font-medium">{getStatusText()}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={RegistrationStatus.PENDING}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Pending</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={RegistrationStatus.APPROVED}>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Approved</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={RegistrationStatus.REJECTED}>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-3 w-3" />
                      <span>Rejected</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={RegistrationStatus.CANCELLED}>
                    <div className="flex items-center gap-2">
                      <Ban className="h-3 w-3" />
                      <span>Cancelled</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className={cn("text-sm font-medium", getStatusColor())}>
                {getStatusText()}
              </span>
            )}
          </div>
        </div>

        {answers && answers.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-2">Responses</h4>
            <div className="space-y-2">
              {answers.map((answer) => (
                <div key={answer.id} className="space-y-1">
                  <p className="text-xs font-medium text-foreground">
                    {answer.question.question}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    {answer.singleAnswer ? (
                      <span>{answer.singleAnswer}</span>
                    ) : answer.multiAnswer && answer.multiAnswer.length > 0 ? (
                      <span>{answer.multiAnswer.join(', ')}</span>
                    ) : (
                      <span className="italic">No answer provided</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

interface AttendeesListProps {
  attendees: Registration[]
  canUpdateStatus?: boolean
  eventId?: number
  className?: string
}

export function AttendeesList({ attendees, canUpdateStatus = false, eventId, className }: AttendeesListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAttendees = useMemo(() => {
    if (!searchQuery.trim()) {
      return attendees
    }

    const query = searchQuery.toLowerCase().trim()
    const queryNum = searchQuery.trim()
    return attendees.filter((registration) => {
      const displayName = registration.displayName.toLowerCase()
      const fullName = `${registration.attendee.firstName} ${registration.attendee.lastName}`.toLowerCase()
      const email = registration.attendee.email.toLowerCase()
      const idMatch = String(registration.id) === queryNum || String(registration.id).includes(queryNum)
      return displayName.includes(query) || fullName.includes(query) || email.includes(query) || idMatch
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
          placeholder="Search by name, email, or ID"
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
              registration={registration}
              canUpdateStatus={canUpdateStatus}
              eventId={eventId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

