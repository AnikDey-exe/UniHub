import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/layout/hero-section"
import { CollegesSection } from "@/app/components/colleges"
import { PopularEvents } from "@/app/components/popular-events"
import { eventsAPI, collegesAPI } from "@/lib/api"

export default async function HomePage() {
  try {
    const [events, colleges] = await Promise.all([
      eventsAPI.getAllEvents(),
      collegesAPI.getAllColleges()
    ])

    return (
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <CollegesSection colleges={colleges}/>
          <PopularEvents events={events}/>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Failed to load data:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    )
  }
}
