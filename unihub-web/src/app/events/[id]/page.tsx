import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { EventDetailsClient } from "./client"
import { eventsAPI } from "@/lib/api"
import { SectionLoading } from "@/components/ui/loading"
import { notFound } from "next/navigation"

async function EventDetails({ id }: { id: number }) {
  try {
    const event = await eventsAPI.getEventById(id)
    return <EventDetailsClient event={event} />
  } catch (error) {
    notFound()
  }
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const eventId = parseInt(id)
  
  if (isNaN(eventId)) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Suspense fallback={<SectionLoading height="600px" className="py-16" />}>
          <EventDetails id={eventId} />
        </Suspense>
      </main>
    </div>
  )
}

