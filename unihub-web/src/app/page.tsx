import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/layout/hero-section"
import { CollegesSection } from "@/app/components/colleges"
import { PopularEvents } from "@/app/components/popular-events"
import { eventsAPI } from "@/lib/api"

export default async function HomePage() {
  const events = await eventsAPI.getAllEvents()
  
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <CollegesSection />
        <PopularEvents events={events}/>
      </main>
    </div>
  )
}
