import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/layout/hero-section"
import { CollegesSection } from "@/app/components/colleges"
import { PopularEvents } from "@/app/components/popular-events"
import { eventsAPI, collegesAPI } from "@/lib/api"
import { SectionLoading } from "@/components/ui/loading"

async function EventsList() {
  const events = await eventsAPI.getAllEvents({});
  return <PopularEvents events={events.events} />;
}

async function CollegesList() {
  const colleges = await collegesAPI.getAllColleges({limit: 6, searchQuery: "uga"});
  return <CollegesSection colleges={colleges.colleges} />;
}

export default async function HomePage() {
  try {
    return (
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <Suspense fallback={<SectionLoading />}>
            <CollegesList />
          </Suspense>
           <Suspense fallback={
             <SectionLoading 
               height="600px"
               className="py-16 md:py-24"
               spinnerSize={20}
             />
           }>
             <EventsList />
           </Suspense>
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
