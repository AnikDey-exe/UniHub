"use client"

import { Calendar } from '@mantine/dates'
import { EventSummary } from '@/types/responses'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import Link from 'next/link'
import { cn } from '@/utils/cn'

dayjs.extend(utc)
dayjs.extend(timezone)

interface EventsCalendarProps {
  events: EventSummary[]
  timezone?: string
}

export function EventsCalendar({ events, timezone = 'UTC' }: EventsCalendarProps) {
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = dayjs(event.eventStartDateUtc).tz(event.eventTimezone || timezone)
      return eventDate.format('YYYY-MM-DD') === dayjs(date).format('YYYY-MM-DD')
    })
  }

  return (
    <div className="w-full">
      <Calendar
        size="lg"
        renderDay={(date) => {
          const dayEvents = getEventsForDate(date)
          const isToday = dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
          const dayNumber = dayjs(date).format('D')
          
          return (
            <div className="w-full h-full min-h-[100px] p-1 flex flex-col" style={{ width: '100%', minWidth: 0 }}>
              <div className={cn(
                "text-sm font-medium mb-1",
                isToday && "text-primary font-bold"
              )}>
                {dayNumber}
              </div>
              <div className="flex-1 space-y-1 overflow-hidden w-full">
                {dayEvents.slice(0, 2).map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="block text-xs px-1 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors truncate w-full"
                    title={event.name}
                    onClick={(e) => e.stopPropagation()}
                    style={{ minWidth: 0 }}
                  >
                    {event.name}
                  </Link>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-muted-foreground px-1">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )
        }}
        styles={{
          calendar: {
            width: '100%',
          },
          month: {
            width: '100%',
          },
          monthCell: {
            width: '100%',
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
    </div>
  )
}

