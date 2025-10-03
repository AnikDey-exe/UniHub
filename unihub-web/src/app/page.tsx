import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/layout/hero-section"
import { CollegesSection } from "@/app/components/colleges"
import { PopularEvents } from "@/app/components/popular-events"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <CollegesSection />
        <PopularEvents />
      </main>
    </div>
  )
}
