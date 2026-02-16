import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { EventsClient } from "./client"
import { eventsAPI } from "@/lib/api"
import { SectionLoading } from "@/components/ui/loading"

async function EventsList() {
  const events = await eventsAPI.getAllEvents({})
  return <EventsClient initialEvents={events.events} />
}

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 md:pt-24">
        <Suspense fallback={<SectionLoading height="600px" className="py-16" />}>
          <EventsList />
        </Suspense>
      </main>
    </div>
  )
}
