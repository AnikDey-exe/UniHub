import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/ui/event-card"
import { Event } from "@/types/responses"
import Link from "next/link"

export function PopularEvents({ events }: { events: Event[] }) {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4 md:text-4xl text-balance">Popular events this week</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Don't miss out on these trending events happening across campuses
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} variant="default" />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/events">
            <Button size="lg" variant="outline">
              View All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
