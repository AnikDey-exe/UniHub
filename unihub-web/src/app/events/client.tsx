'use client'

import { useMemo, useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EventCard } from "@/components/ui/event-card"
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select"
import { EVENT_TYPE_OPTIONS, EventType } from "@/types/event-types"
import { Calendar, Search, Filter, Grid, List } from "lucide-react"
import { Event, EventSearchResponse } from "@/types/responses"
import { DateTimePicker } from '@mantine/dates'
import { useEventsInfiniteSearch } from '@/hooks/use-events-search'
import { InfiniteScroll } from '@/components/ui/infinite-scroll'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'

interface EventsClientProps {
  initialEvents: Event[]
}

export function EventsClient({ initialEvents }: EventsClientProps) {
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([])
  const [sortBy, setSortBy] = useState('date')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 600)

    return () => clearTimeout(timer)
  }, [searchInput])

  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useEventsInfiniteSearch({
    searchQuery,
    selectedTypes,
    startDate,
    endDate,
    sortBy
  })


  const events = data?.pages.flatMap((page: EventSearchResponse) => page.events) || initialEvents
  const filteredEvents = events

  const eventTypeOptions = EVENT_TYPE_OPTIONS

  return (
    <div className="min-h-screen bg-background">
      <section>
        <div className="container px-4 md:px-6 py-4 mt-0">
          <div className="flex items-center justify-between mb-6 mt-4">
            <h1 className="text-3xl font-bold text-foreground">Events</h1>
            <div className="flex flex-col gap-1">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">Powered by Butler</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container px-4 md:px-6 py-2">
          <div className="flex flex-wrap gap-8 items-start">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Sort by</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Recent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Recent</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Attending</label>
              <div className="flex items-center gap-2">
                <DateTimePicker
                  placeholder="Start date & time"
                  value={startDate}
                  onChange={(value) => setStartDate(value ? new Date(value) : null)}
                  clearable
                  size="sm"
                  valueFormat="MM/DD/YY HH:mm"
                />
                <span className="text-sm text-muted-foreground">to</span>
                <DateTimePicker
                  placeholder="End date & time"
                  value={endDate}
                  onChange={(value) => setEndDate(value ? new Date(value) : null)}
                  clearable
                  size="sm"
                  valueFormat="MM/DD/YY HH:mm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Within</label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="10"
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">miles</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Type</label>
              <MultiSelect<EventType>
                options={eventTypeOptions}
                selected={selectedTypes}
                onChange={setSelectedTypes}
                placeholder="Select types..."
                className="w-64"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container px-4 md:px-6">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Searching events...</h3>
                <p className="text-sm">Please wait while we find the best events for you.</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-destructive">
                <Calendar className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Search failed</h3>
                <p className="text-sm">There was an error searching for events. Please try again.</p>
              </div>
            </div>
          ) : (
            <InfiniteScroll
              hasNext={hasNextPage || false}
              isLoading={isFetchingNextPage}
              onLoadMore={fetchNextPage}
              loadingComponent={
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm">Loading more events...</span>
                </div>
              }
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} variant="default" />
                ))}
              </div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-muted-foreground">
                    <Calendar className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">No events found</h3>
                    <p className="text-sm">Try adjusting your search or filters to find more events.</p>
                  </div>
                </div>
              )}
            </InfiniteScroll>
          )}
        </div>
      </section>
    </div>
  )
}

