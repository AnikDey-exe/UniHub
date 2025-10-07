import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/layout/hero-section"
import { CollegesSection } from "@/app/components/colleges"
import { PopularEvents } from "@/app/components/popular-events"
import { eventsAPI, collegesAPI } from "@/lib/api"

export default async function HomePage() {
  const events = await eventsAPI.getAllEvents()
  const colleges = await collegesAPI.getAllColleges()

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
}
