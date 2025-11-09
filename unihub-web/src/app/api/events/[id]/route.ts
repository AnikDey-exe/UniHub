import { NextRequest, NextResponse } from 'next/server'

// Mock events data for testing
const mockEvents = Array.from({ length: 50 }, (_, i) => {
  const eventTypes = ['Sport', 'Religious', 'Hackathon', 'Entertainment', 'Club', 'Networking', 'Career', 'General']
  const attendeesCount = Math.floor(Math.random() * 8000) + 1000
  
  return {
    id: i + 1,
    name: i === 0 ? 'UC Bear Hacks' : `Event ${i + 1}`,
    type: eventTypes[i % 8],
    description: `This is a paragraph-length description for event ${i + 1}. It provides more details about what the event entails, who it's for, and what participants can expect. This description helps users understand the event better before deciding to attend.`,
    location: `Berkeley, CA Computing Building`,
    capacity: Math.floor(Math.random() * 100) + 10,
    startDate: new Date(2026, 1, 19, 19, 30).toISOString(),
    endDate: new Date(2026, 1, 20, 18, 0).toISOString(),
    university: 'UC Berkeley',
    creator: {
      id: 1,
      email: 'creator@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '123-456-7890'
    },
    attendees: Array.from({ length: attendeesCount }, (_, j) => ({
      id: j + 1,
      email: `user${j + 1}@example.com`,
      firstName: `User${j + 1}`,
      lastName: 'Attendee',
      phoneNumber: '123-456-7890'
    }))
  }
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const eventId = parseInt(id)
  
  const event = mockEvents.find(e => e.id === eventId)
  
  if (!event) {
    return NextResponse.json(
      { message: 'Event not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(event)
}

