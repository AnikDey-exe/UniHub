import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { EventAttendeesClient } from "./client"
import { eventsAPI } from "@/lib/api"
import { SectionLoading } from "@/components/ui/loading"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'
export const dynamicParams = true

async function EventAttendees({ id }: { id: number }) {
  try {
    const event = await eventsAPI.getEventById(id)
    return <EventAttendeesClient event={event} />
  } catch (error) {
    notFound()
  }
}

export default async function EventAttendeesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const eventId = parseInt(id, 10)
  
  if (isNaN(eventId)) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 md:pt-24">
        <Suspense fallback={<SectionLoading height="600px" className="py-16" />}>
          <EventAttendees id={eventId} />
        </Suspense>
      </main>
    </div>
  )
}
