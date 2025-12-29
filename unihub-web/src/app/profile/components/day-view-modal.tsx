"use client"

import { Modal } from "@/components/ui/modal"
import { EventSummary } from "@/types/responses"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import Link from 'next/link'
import { cn } from "@/utils/cn"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

dayjs.extend(utc)
dayjs.extend(timezone)

interface DayViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date | null
  events: EventSummary[]
  timezone?: string
}

export function DayViewModal({ open, onOpenChange, date, events, timezone = 'UTC' }: DayViewModalProps) {
  const [currentDateState, setCurrentDateState] = useState<Date | null>(date)

  useEffect(() => {
    setCurrentDateState(date)
  }, [date])

  if (!currentDateState) return null

  const currentDate = dayjs(currentDateState).format('YYYY-MM-DD')
  const dayName = dayjs(currentDateState).format('ddd').toUpperCase()
  const dayNumber = dayjs(currentDateState).format('D')
  const monthName = dayjs(currentDateState).format('MMMM YYYY')

  const handlePreviousDay = () => {
    setCurrentDateState(prev => prev ? dayjs(prev).subtract(1, 'day').toDate() : null)
  }

  const handleNextDay = () => {
    setCurrentDateState(prev => prev ? dayjs(prev).add(1, 'day').toDate() : null)
  }

  // Filter events that occur on this date (including multi-day events)
  const dayEvents = events.filter(event => {
    const eventStartDate = dayjs(event.eventStartDateUtc).tz(event.eventTimezone || timezone)
    const eventEndDate = dayjs(event.eventEndDateUtc).tz(event.eventTimezone || timezone)
    const startDateStr = eventStartDate.format('YYYY-MM-DD')
    const endDateStr = eventEndDate.format('YYYY-MM-DD')
    
    // Include events that fall on this date
    return currentDate >= startDateStr && currentDate <= endDateStr
  })

  // Generate time slots from 12am to 11pm
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i
    const timeStr = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`
    return { hour, timeStr }
  })

  // Calculate event positions for the current day
  const getEventPosition = (event: EventSummary) => {
    const eventStartDate = dayjs(event.eventStartDateUtc).tz(event.eventTimezone || timezone)
    const eventEndDate = dayjs(event.eventEndDateUtc).tz(event.eventTimezone || timezone)
    const startDateStr = eventStartDate.format('YYYY-MM-DD')
    const endDateStr = eventEndDate.format('YYYY-MM-DD')
    
    const isSingleDay = startDateStr === endDateStr
    const isStartDay = startDateStr === currentDate
    const isEndDay = endDateStr === currentDate
    const isMiddleDay = !isStartDay && !isEndDay
    
    let displayStartTime: dayjs.Dayjs
    let displayEndTime: dayjs.Dayjs
    
    if (isSingleDay) {
      // Single-day event: use actual start and end times
      displayStartTime = eventStartDate
      displayEndTime = eventEndDate
    } else if (isStartDay) {
      // Starting day of multi-day event: from start time to end of day (11:59 PM)
      displayStartTime = eventStartDate
      displayEndTime = dayjs(currentDateState).endOf('day')
    } else if (isEndDay) {
      // Ending day of multi-day event: from beginning of day (12:00 AM) to end time
      displayStartTime = dayjs(currentDateState).startOf('day')
      displayEndTime = eventEndDate
    } else {
      // Middle day of multi-day event: from beginning to end of day (12:00 AM to 11:59 PM)
      displayStartTime = dayjs(currentDateState).startOf('day')
      displayEndTime = dayjs(currentDateState).endOf('day')
    }
    
    const startHour = displayStartTime.hour()
    const startMinute = displayStartTime.minute()
    const endHour = displayEndTime.hour()
    const endMinute = displayEndTime.minute()
    
    // Calculate duration in hours (including partial hours)
    const startTimeInMinutes = startHour * 60 + startMinute
    const endTimeInMinutes = endHour * 60 + endMinute
    const durationInMinutes = endTimeInMinutes - startTimeInMinutes
    const durationInHours = durationInMinutes / 60
    
    // Calculate position from top (each hour is 60px)
    const topOffset = (startMinute / 60) * 60 // Offset within the hour
    const topPosition = startHour * 60 + topOffset
    
    // Format display times
    let displayStartTimeStr: string
    let displayEndTimeStr: string
    
    if (isSingleDay) {
      // Single-day event: show actual times
      displayStartTimeStr = eventStartDate.format('h:mm A')
      displayEndTimeStr = eventEndDate.format('h:mm A')
    } else if (isStartDay) {
      displayStartTimeStr = eventStartDate.format('h:mm A')
      displayEndTimeStr = '11:59 PM'
    } else if (isEndDay) {
      displayStartTimeStr = '12:00 AM'
      displayEndTimeStr = eventEndDate.format('h:mm A')
    } else {
      displayStartTimeStr = '12:00 AM'
      displayEndTimeStr = '11:59 PM'
    }
    
    return {
      startTimeInMinutes,
      endTimeInMinutes,
      durationInHours,
      topPosition,
      startTime: displayStartTimeStr,
      endTime: displayEndTimeStr,
    }
  }

  // Check if two events overlap
  const eventsOverlap = (pos1: ReturnType<typeof getEventPosition>, pos2: ReturnType<typeof getEventPosition>) => {
    // Events overlap if one starts before the other ends
    return pos1.startTimeInMinutes < pos2.endTimeInMinutes && 
           pos2.startTimeInMinutes < pos1.endTimeInMinutes
  }

  // Calculate overlapping groups and positions for each event
  const getEventLayout = () => {
    const eventPositions = dayEvents.map(event => ({
      event,
      position: getEventPosition(event),
    }))

    // Create a map to store layout info for each event
    const layoutMap = new Map<string, { widthPercent: number; leftPercent: number }>()

    // Process each event to find its overlapping group
    eventPositions.forEach(({ event, position }, index) => {
      // Skip if already processed
      const eventIdStr = String(event.id)
      if (layoutMap.has(eventIdStr)) return

      // Find all events that overlap with this event (including transitive overlaps)
      const overlappingGroup: typeof eventPositions = []
      const processed = new Set<string>()
      const toProcess = [index]

      while (toProcess.length > 0) {
        const currentIndex = toProcess.pop()!
        const current = eventPositions[currentIndex]
        const currentIdStr = String(current.event.id)
        if (processed.has(currentIdStr)) continue
        processed.add(currentIdStr)
        overlappingGroup.push(current)

        // Find all events that overlap with the current event
        eventPositions.forEach((other, otherIndex) => {
          if (otherIndex === currentIndex) return
          const otherIdStr = String(other.event.id)
          if (processed.has(otherIdStr)) return
          if (eventsOverlap(current.position, other.position)) {
            toProcess.push(otherIndex)
          }
        })
      }

      // Sort overlapping group by start time
      overlappingGroup.sort((a, b) => a.position.startTimeInMinutes - b.position.startTimeInMinutes)

      // Calculate width and position for each event in the group
      // Add gaps between overlapping events
      const groupSize = overlappingGroup.length
      const gapPercent = groupSize > 1 ? 1.5 : 0 // 1.5% gap between events
      const totalGapPercent = gapPercent * (groupSize - 1)
      const availableWidth = 100 - totalGapPercent
      const widthPercent = availableWidth / groupSize

      overlappingGroup.forEach((item, groupIndex) => {
        layoutMap.set(String(item.event.id), {
          widthPercent,
          leftPercent: groupIndex * (widthPercent + gapPercent),
        })
      })
    })

    // Build final layout array
    return eventPositions.map(({ event, position }) => {
      const layout = layoutMap.get(String(event.id)) || { widthPercent: 100, leftPercent: 0 }
      return {
        event,
        position,
        widthPercent: layout.widthPercent,
        leftPercent: layout.leftPercent,
      }
    })
  }

  return (
    <Modal 
      open={open} 
      onOpenChange={onOpenChange}
      className="max-w-2xl h-[85vh] flex flex-col p-0 overflow-hidden"
    >
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="px-6 py-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousDay}
              className="h-8 w-8"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
            
            <div className="flex flex-col items-center">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {dayName}
              </div>
              <div className="text-4xl font-bold text-foreground mt-1">
                {dayNumber}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {monthName}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextDay}
              className="h-8 w-8"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Time slots */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-6 py-4 relative">
            {/* Events positioned absolutely */}
            <div className="absolute left-28 right-6 top-4 bottom-4">
              {getEventLayout().map(({ event, position, widthPercent, leftPercent }) => {
                const height = position.durationInHours * 60 // Each hour is 60px
                
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="absolute flex items-start p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors group cursor-pointer border-l-2 border-primary"
                    style={{
                      top: `${position.topPosition}px`,
                      height: `${height}px`,
                      width: `${widthPercent}%`,
                      left: `${leftPercent}%`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenChange(false)
                    }}
                  >
                    {/* Event info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {event.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {position.startTime} - {position.endTime}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Time slot lines */}
            {timeSlots.map((slot, index) => {
              const isLast = index === timeSlots.length - 1
              
              return (
                <div key={slot.hour} className="flex gap-6 relative" style={{ minHeight: '60px' }}>
                  {/* Time label */}
                  <div className="w-20 flex-shrink-0 pt-2">
                    <div className="text-xs text-muted-foreground font-medium">
                      {slot.timeStr}
                    </div>
                  </div>
                  
                  {/* Time slot line */}
                  <div className="flex-1 flex flex-col">
                    <div className={cn(
                      "border-t border-border",
                      !isLast && "min-h-[60px]"
                    )} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Modal>
  )
}

