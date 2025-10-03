import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"

const events = [
  {
    id: 1,
    title: "Spring Music Festival",
    college: "Stanford University",
    date: "March 15, 2025",
    time: "6:00 PM",
    location: "Main Quad",
    attendees: 450,
    category: "Music",
    image: "/college-music-festival-outdoor-stage.jpg",
  },
  {
    id: 2,
    title: "Tech Career Fair",
    college: "MIT",
    date: "March 18, 2025",
    time: "10:00 AM",
    location: "Student Center",
    attendees: 320,
    category: "Career",
    image: "/career-fair-tech-companies-booths.jpg",
  },
  {
    id: 3,
    title: "Basketball Championship",
    college: "UC Berkeley",
    date: "March 20, 2025",
    time: "7:30 PM",
    location: "Haas Pavilion",
    attendees: 890,
    category: "Sports",
    image: "/college-basketball-game-arena.jpg",
  },
  {
    id: 4,
    title: "AI & Machine Learning Workshop",
    college: "Stanford University",
    date: "March 22, 2025",
    time: "2:00 PM",
    location: "Gates Building",
    attendees: 180,
    category: "Workshop",
    image: "/tech-workshop-students-laptops.jpg",
  },
  {
    id: 5,
    title: "International Food Festival",
    college: "Harvard University",
    date: "March 25, 2025",
    time: "5:00 PM",
    location: "Harvard Yard",
    attendees: 620,
    category: "Social",
    image: "/food-festival-outdoor-diverse-cuisine.jpg",
  },
  {
    id: 6,
    title: "Startup Pitch Competition",
    college: "MIT",
    date: "March 28, 2025",
    time: "1:00 PM",
    location: "Sloan Building",
    attendees: 250,
    category: "Career",
    image: "/startup-pitch-presentation-audience.jpg",
  },
]

export function PopularEvents() {
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
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="h-full w-full object-cover" />
                <Badge className="absolute top-3 right-3 bg-background/90 text-foreground hover:bg-background">
                  {event.category}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
                <p className="text-sm text-muted-foreground">{event.college}</p>
              </CardHeader>

              <CardContent className="space-y-2 pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {event.date} at {event.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees} attending</span>
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full bg-transparent" variant="outline">
                  View Details
                </Button>
              </CardFooter>
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
