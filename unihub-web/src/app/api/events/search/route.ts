import { NextRequest, NextResponse } from 'next/server'

// Mock events data for testing
const mockEvents = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Event ${i + 1}`,
  type: ['Sport', 'Religious', 'Hackathon', 'Entertainment', 'Club', 'Networking', 'Career', 'General'][i % 8],
  description: `This is a description for event ${i + 1}`,
  location: `Location ${i + 1}`,
  capacity: Math.floor(Math.random() * 100) + 10,
  creator: {
    id: 1,
    email: 'creator@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '123-456-7890'
  },
  attendees: Array.from({ length: Math.floor(Math.random() * 20) }, (_, j) => ({
    id: j + 1,
    email: `user${j + 1}@example.com`,
    firstName: `User${j + 1}`,
    lastName: 'Attendee',
    phoneNumber: '123-456-7890'
  }))
}))

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const limit = parseInt(searchParams.get('limit') || '20')
  const lastStartDate = searchParams.get('lastStartDate')
  const lastNumAttendees = searchParams.get('lastNumAttendees')
  const searchQuery = searchParams.get('searchQuery')
  const types = searchParams.get('types')?.split(',')
  const sortBy = searchParams.get('sortBy') || 'date'
  
  let filteredEvents = [...mockEvents]
  
  // Apply search query filter
  if (searchQuery) {
    filteredEvents = filteredEvents.filter(event => 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
  
  // Apply type filter
  if (types && types.length > 0) {
    filteredEvents = filteredEvents.filter(event => types.includes(event.type))
  }
  
  // Apply sorting
  if (sortBy === 'name') {
    filteredEvents.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy === 'popularity') {
    filteredEvents.sort((a, b) => b.attendees.length - a.attendees.length)
  } else if (sortBy === 'date') {
    // Mock date sorting by ID
    filteredEvents.sort((a, b) => b.id - a.id)
  }
  
  // Apply pagination
  let startIndex = 0
  if (lastStartDate) {
    // Find the index of the last event based on pagination params
    const lastEventIndex = filteredEvents.findIndex(event => 
      event.id.toString() === lastStartDate
    )
    if (lastEventIndex !== -1) {
      startIndex = lastEventIndex + 1
    }
  }
  
  const endIndex = startIndex + limit
  const pageEvents = filteredEvents.slice(startIndex, endIndex)
  const hasNext = endIndex < filteredEvents.length
  
  // Get pagination params for next page
  const lastEvent = pageEvents[pageEvents.length - 1]
  const nextLastStartDate = lastEvent ? lastEvent.id.toString() : null
  
  const response = {
    events: pageEvents,
    hasNext,
    lastStartDate: nextLastStartDate,
    lastNumAttendees: lastEvent ? lastEvent.attendees.length : null
  }
  
  return NextResponse.json(response)
}
