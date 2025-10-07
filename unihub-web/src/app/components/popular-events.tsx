import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"
import { Event } from "@/types/responses"

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
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow p-0">
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                <img src={"/placeholder.svg"} alt={event.name} className="h-full w-full object-cover" />
                <Badge className="absolute top-3 right-3 bg-background/90 text-foreground hover:bg-background">
                  {event.type}
                </Badge>
              </div>

              <div className="pb-6 pr-6 pl-6">
                <CardHeader className="pb-3 px-0">
                  <h3 className="font-semibold text-lg line-clamp-1">{event.name}</h3>
                  <p className="text-sm text-muted-foreground">Berkeley</p>
                </CardHeader>

                <CardContent className="space-y-2 pb-3 px-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {/* <span>
                      {event.date} at {event.time}
                    </span> */}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees?.length} attending</span>
                  </div>
                </CardContent>

                <CardFooter className="px-0 pt-0">
                  <Button className="w-full bg-transparent" variant="outline">
                    View Details
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            View All Events
          </Button>
        </div>
      </div>
    </section>
  )
}
