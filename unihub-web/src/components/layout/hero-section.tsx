import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-muted/50 to-background">
      <div className="container px-4 py-20 md:py-32 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Discover Campus Life
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            Find the best events on your campus
          </h1>

          <p className="mb-8 text-lg text-muted-foreground text-pretty md:text-xl leading-relaxed max-w-2xl mx-auto">
            Connect with your college community through concerts, workshops, sports, and social gatherings. Never miss
            out on what&apos;s happening around you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-base px-8">
              Explore Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 -z-10" />
    </section>
  )
}
