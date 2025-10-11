'use client'

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EventCard } from "@/components/ui/event-card"
import { Calendar, Search, Filter, Grid, List } from "lucide-react"
import { Event } from "@/types/responses"

interface EventsClientProps {
  events: Event[]
}

export function EventsClient({ events }: EventsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Get unique event types
  const eventTypes = useMemo(() => {
    const types = [...new Set(events.map(event => event.type))]
    return ['all', ...types]
  }, [events])

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === 'all' || event.type === selectedType
      return matchesSearch && matchesType
    })

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'type':
          return a.type.localeCompare(b.type)
        case 'location':
          return a.location.localeCompare(b.location)
        case 'capacity':
          return b.capacity - a.capacity
        default:
          return 0
      }
    })

    return filtered
  }, [events, searchQuery, selectedType, sortBy])

  return (
    <div className="min-h-screen">
      <section>
        <div className="container px-4 md:px-6 py-4 mt-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container px-4 md:px-6 py-2">
          <div className="flex flex-wrap gap-8 items-start">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Sort by</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Recent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Attending</label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Start date"
                  className="w-32 bg-gray-50 border-gray-200"
                />
                <span className="text-sm text-gray-500">to</span>
                <Input
                  placeholder="End date"
                  className="w-32 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Within</label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="10"
                  className="w-20 bg-gray-50 border-gray-200"
                />
                <span className="text-sm text-gray-500">miles</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="5 selected" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} variant="default" />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-500">
                <Calendar className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No events found</h3>
                <p className="text-sm">Try adjusting your search or filters to find more events.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

