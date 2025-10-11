import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { EventsClient } from "./client"
import { eventsAPI } from "@/lib/api"
import { SectionLoading } from "@/components/ui/loading"

async function EventsList() {
  const events = await eventsAPI.getAllEvents()
  return <EventsClient events={events} />
}

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Suspense fallback={<SectionLoading height="600px" className="py-16" />}>
          <EventsList />
        </Suspense>
      </main>
    </div>
  )
}
