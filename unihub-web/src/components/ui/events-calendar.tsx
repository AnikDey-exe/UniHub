"use client"

import { useState } from 'react'
import { Calendar } from '@mantine/dates'
import { EventSummary } from '@/types/responses'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import { DayViewModal } from '@/app/profile/components/day-view-modal'

dayjs.extend(utc)
dayjs.extend(timezone)

interface EventsCalendarProps {
  events: EventSummary[]
  timezone?: string
}

export function EventsCalendar({ events, timezone = 'UTC' }: EventsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const getEventsForDate = (date: Date) => {
    const currentDate = dayjs(date).format('YYYY-MM-DD')
    
    return events.filter(event => {
      const eventStartDate = dayjs(event.eventStartDateUtc).tz(event.eventTimezone || timezone)
      const eventEndDate = dayjs(event.eventEndDateUtc).tz(event.eventTimezone || timezone)
      const startDateStr = eventStartDate.format('YYYY-MM-DD')
      const endDateStr = eventEndDate.format('YYYY-MM-DD')
      
      return currentDate >= startDateStr && currentDate <= endDateStr
    })
  }

  const getEventPosition = (event: EventSummary, date: Date) => {
    const currentDate = dayjs(date).format('YYYY-MM-DD')
    const eventStartDate = dayjs(event.eventStartDateUtc).tz(event.eventTimezone || timezone)
    const eventEndDate = dayjs(event.eventEndDateUtc).tz(event.eventTimezone || timezone)
    const startDateStr = eventStartDate.format('YYYY-MM-DD')
    const endDateStr = eventEndDate.format('YYYY-MM-DD')
    
    const isMultiDay = startDateStr !== endDateStr
    
    if (!isMultiDay) {
      return null
    }

    // Get the current week boundaries (Sunday to Saturday)
    const weekStart = dayjs(date).startOf('week')
    const weekEnd = dayjs(date).endOf('week')
    const weekStartStr = weekStart.format('YYYY-MM-DD')
    const weekEndStr = weekEnd.format('YYYY-MM-DD')
    
    // Find the intersection of event dates and week dates
    const eventStartDayjs = dayjs(startDateStr)
    const eventEndDayjs = dayjs(endDateStr)
    
    // The portion of the event that falls in this week
    // If event starts before week, use week start; if event starts in week, use event start
    const eventStartInWeek = eventStartDayjs.isAfter(weekStart, 'day') || eventStartDayjs.isSame(weekStart, 'day') 
      ? eventStartDayjs 
      : weekStart
    // If event ends after week, use week end; if event ends in week, use event end
    const eventEndInWeek = eventEndDayjs.isBefore(weekEnd, 'day') || eventEndDayjs.isSame(weekEnd, 'day')
      ? eventEndDayjs
      : weekEnd
    
    // Check if this event has any portion in the current week
    if (eventEndInWeek.isBefore(eventStartInWeek, 'day')) {
      return null
    }
    
    // Only render on the first day of the event segment in this week
    const firstDayInWeek = eventStartInWeek.format('YYYY-MM-DD')
    if (currentDate !== firstDayInWeek) {
      return null
    }
    
    // Calculate how many days the event spans within this week
    const spanDaysInWeek = eventEndInWeek.diff(eventStartInWeek, 'day') + 1
    
    // Determine if this is the actual event start/end or just week boundary
    const isActualEventStart = currentDate === startDateStr
    const isActualEventEnd = currentDate === endDateStr
    const isAtWeekStart = currentDate === weekStartStr
    const isAtWeekEnd = currentDate === weekEndStr
    
    return {
      spanDaysInWeek,
      isActualEventStart,
      isActualEventEnd,
      isAtWeekStart,
      isAtWeekEnd,
    }
  }

  return (
    <div className="w-full" style={{ overflow: 'visible' }}>
      <Calendar
        size="lg"
        renderDay={(date) => {
          const dayEvents = getEventsForDate(date)
          const isToday = dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
          const dayNumber = dayjs(date).format('D')
          
          // Separate single-day and multi-day events
          const singleDayEvents: EventSummary[] = []
          const multiDayEvents: Array<{ event: EventSummary; position: ReturnType<typeof getEventPosition> }> = []
          
          dayEvents.forEach(event => {
            const position = getEventPosition(event, date)
            if (position) {
              multiDayEvents.push({ event, position })
            } else {
              const eventStartDate = dayjs(event.eventStartDateUtc).tz(event.eventTimezone || timezone)
              const eventEndDate = dayjs(event.eventEndDateUtc).tz(event.eventTimezone || timezone)
              const startDateStr = eventStartDate.format('YYYY-MM-DD')
              const endDateStr = eventEndDate.format('YYYY-MM-DD')
              if (startDateStr === endDateStr) {
                singleDayEvents.push(event)
              }
            }
          })
          
          return (
            <div 
              className="w-full h-full min-h-[100px] p-1 flex flex-col relative cursor-pointer" 
              style={{ width: '100%', minWidth: 0 }}
              onClick={() => handleDateClick(date)}
            >
              <div className={cn(
                "text-sm font-medium mb-1 z-10",
                isToday && "text-primary font-bold"
              )}>
                {dayNumber}
              </div>
              <div className="flex-1 space-y-1 overflow-visible w-full relative z-0" style={{ minHeight: '20px' }}>
                {multiDayEvents.slice(0, 2).map(({ event, position }, index) => {
                  if (!position) return null
                  
                  // Since we only render on the first day of the event segment in the week,
                  // the left offset is always 0 (starts from current cell)
                  const leftOffset = 0
                  
                  // Width spans across the days in this week
                  // Each day cell is 100% width, plus 4px margin (2px on each side) between cells
                  const widthPercent = position.spanDaysInWeek * 100
                  const widthMarginOffset = Math.max(0, (position.spanDaysInWeek - 1) * 4) // Margins between cells
                  
                  // Determine border radius
                  // Rounded left if: actual event start OR at week start
                  // Rounded right if: actual event end OR at week end
                  const borderRadiusLeft = (position.isActualEventStart || position.isAtWeekStart) ? '4px' : '0'
                  const borderRadiusRight = (position.isActualEventEnd || position.isAtWeekEnd) ? '4px' : '0'
                  const borderRadius = `${borderRadiusLeft} ${borderRadiusRight} ${borderRadiusRight} ${borderRadiusLeft}`
                  
                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="block text-xs px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors truncate absolute whitespace-nowrap z-10"
                      title={event.name}
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        window.location.href = `/events/${event.id}`
                      }}
                      style={{
                        left: `${leftOffset}%`,
                        width: `calc(${widthPercent}% + ${widthMarginOffset}px)`,
                        top: `${index * 24}px`,
                        borderRadius: borderRadius,
                        zIndex: 10,
                      }}
                    >
                      {event.name}
                    </Link>
                  )
                })}
                
                {singleDayEvents.slice(0, 2 - multiDayEvents.length).map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="block text-xs px-1 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors truncate w-full relative z-10"
                    title={event.name}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      window.location.href = `/events/${event.id}`
                    }}
                    style={{ minWidth: 0 }}
                  >
                    {event.name}
                  </Link>
                ))}
                
                {(dayEvents.length > 2 || (multiDayEvents.length > 0 && singleDayEvents.length > 0)) && (
                  <div className="text-xs text-muted-foreground px-1 relative z-10">
                    +{Math.max(0, dayEvents.length - 2)} more
                  </div>
                )}
              </div>
            </div>
          )
        }}
        styles={{
          calendar: {
            width: '100%',
            overflow: 'visible',
          },
          month: {
            width: '100%',
            overflow: 'visible',
          },
          monthCell: {
            width: '100%',
            overflow: 'visible',
          },
          day: {
            height: 'auto',
            minHeight: '100px',
            padding: '4px',
            border: '1px solid hsl(var(--border))',
            borderRadius: '4px',
            margin: '2px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            cursor: 'default',
            transition: 'all 0.2s',
            width: '100%',
            minWidth: 0,
            flex: '1 1 0%',
            position: 'relative',
            overflow: 'visible',
            isolation: 'isolate',
            '&:hover': {
              backgroundColor: 'hsl(var(--muted))',
            },
          },
          weekday: {
            fontWeight: 600,
            color: 'hsl(var(--muted-foreground))',
          },
        }}
      />
      <DayViewModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        date={selectedDate}
        events={events}
        timezone={timezone}
      />
    </div>
  )
}
