import { Suspense } from "react"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { eventsAPI, collegesAPI } from "@/lib/api"
import { SectionLoading } from "@/components/ui/loading"
import { CollegesSection } from "@/app/components/colleges"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Users, TrendingUp, Zap, Music, Gamepad2, GraduationCap, Film, UtensilsCrossed, Palette, PartyPopper } from "lucide-react"
import { EventCard } from "@/components/ui/event-card"
import { Card } from "@/components/ui/card"
import { ScrollOverPanel } from "@/app/components/scroll-over-panel"

export const dynamic = "force-dynamic"

async function EventsList() {
  const events = await eventsAPI.getAllEvents({});
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.events.slice(0, 6).map((event) => (
        <EventCard key={event.id} event={event} variant="default" />
      ))}
    </div>
  );
}

async function CollegesList() {
  const colleges = await collegesAPI.getAllColleges({limit: 6, searchQuery: "uga"});
  return <CollegesSection colleges={colleges.colleges} />;
}

const HeroGraphics = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/[0.08] rounded-full blur-[140px]" />
    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/[0.06] rounded-full blur-[140px]" />

    {/* Hero images - scattered across the hero, spread to avoid clustering */}
    <div className="absolute top-[6%] right-[3%] w-44 h-32 md:w-52 md:h-40 rounded-2xl overflow-hidden shadow-xl border border-border/30 animate-float">
      <Image src="/hero-image-1.webp" alt="" fill className="object-cover" sizes="(max-width: 768px) 176px, 208px" />
    </div>
    <div className="absolute top-[58%] left-[2%] w-36 h-48 md:w-44 md:h-56 rounded-2xl overflow-hidden shadow-xl border border-border/30 animate-float-delayed">
      <Image src="/hero-image-2.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 144px, 176px" />
    </div>
    <div className="absolute bottom-[5%] right-[6%] w-48 h-36 md:w-56 md:h-44 rounded-3xl overflow-hidden shadow-xl border border-border/30 animate-float-slow">
      <Image src="/hero-image-3.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 192px, 224px" />
    </div>
    <div className="absolute top-[28%] left-[6%] w-40 h-52 md:w-48 md:h-64 rounded-xl overflow-hidden shadow-xl border border-border/30 animate-float-delayed-slow">
      <Image src="/hero-image-4.png" alt="" fill className="object-cover" sizes="(max-width: 768px) 160px, 192px" />
    </div>
    <div className="absolute top-[42%] right-[10%] w-32 h-44 md:w-40 md:h-52 rounded-2xl overflow-hidden shadow-xl border border-border/30 animate-float">
      <Image src="/hero-image-5.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 128px, 160px" />
    </div>
    <div className="absolute top-[8%] left-[14%] w-40 h-28 md:w-48 md:h-32 rounded-3xl overflow-hidden shadow-xl border border-border/30 animate-float-delayed">
      <Image src="/hero-image-6.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 160px, 192px" />
    </div>
    <div className="absolute bottom-[22%] left-[22%] w-36 h-40 md:w-44 md:h-48 rounded-xl overflow-hidden shadow-xl border border-border/30 animate-float-slow">
      <Image src="/hero-image-7.jpg" alt="" fill className="object-cover" sizes="(max-width: 768px) 144px, 176px" />
    </div>

    <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-3xl rotate-45 animate-float" />
    <div className="absolute top-40 left-20 w-24 h-24 bg-primary/[0.08] rounded-2xl rotate-12 animate-float-delayed" />
    <div className="absolute bottom-32 right-32 w-40 h-40 bg-primary/10 rounded-full animate-float-slow" />
    <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-primary/[0.08] rounded-3xl -rotate-45 animate-float-delayed-slow" />

    <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
    <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
    <div className="absolute bottom-1/4 left-1/4 w-2.5 h-2.5 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
    <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }} />

    <div className="absolute inset-0 opacity-[0.02]">
      <div className="w-full h-full" style={{
        backgroundImage: 'linear-gradient(rgba(120,119,198,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(120,119,198,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />
    </div>

    {/* Dark overlay over images so the hero feels darker and text pops */}
    <div className="absolute inset-0 bg-black/50 pointer-events-none" />

    {/* Lighter center so text stays readable */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse 75% 65% at 50% 45%, transparent 0%, transparent 40%, hsl(var(--background) / 0.5) 70%, hsl(var(--background) / 0.85) 100%)',
      }}
    />
  </div>
)

const ColoredGradientSection = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative overflow-hidden bg-background ${className}`}>
    <div className="absolute inset-0 bg-primary/[0.03]" />
    <div className="relative z-10">{children}</div>
  </div>
)

export default async function HomePage() {
  try {
    return (
      <>
        <Header />
        {/* No overflow-hidden: content must scroll up over the fixed hero */}
        <div className="min-h-screen bg-background relative overflow-x-hidden">
        <main className="relative">
          {/* 1. FIXED HERO — stays in place; content will scroll up over it */}
          <section className="fixed inset-0 z-0 h-screen w-full overflow-hidden pt-24 pb-16 md:pt-28 md:pb-24">
            <HeroGraphics />
            <div className="container px-4 md:px-6 relative z-20 h-full flex flex-col items-center justify-center">
              <div className="mx-auto max-w-5xl text-center">

                <h1 className="mb-5 text-5xl font-bold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1]">
                  <span className="text-white">Never miss a moment</span>
                  <br />
                  <span className="text-primary">on campus</span>
                </h1>

                <p className="mb-8 text-lg text-white text-pretty md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
                  Connect with your college community through concerts, workshops, sports, and social gatherings. 
                  Discover events that matter to you.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                  <Button size="lg" className="text-base px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <Link href="/events" className="text-white">
                      Explore Events
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base px-8 h-12 border-2 border-white/60 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white shadow-lg">
                    Learn More
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto pt-8 border-t border-white/20">
                  <div className="relative text-center">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                      <GraduationCap className="h-3.5 w-3.5 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="text-4xl font-bold mb-2 text-white mt-7">6000+</div>
                    <div className="text-sm text-white/80">Colleges</div>
                  </div>
                  <div className="relative text-center">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                      <Users className="h-3.5 w-3.5 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="text-4xl font-bold mb-2 text-white mt-7">50K+</div>
                    <div className="text-sm text-white/80">Students</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. SPACER — one viewport height so the page can scroll; hero stays fixed behind */}
          <div className="relative z-0 h-screen w-full pointer-events-none" aria-hidden />

          {/* 3. CONTENT — scrolls UP and overlaps the hero, eventually hiding it (Motion scroll effect) */}
          <ScrollOverPanel className="relative z-10 rounded-t-[40px] overflow-hidden bg-background">
            <ColoredGradientSection className="rounded-t-[40px] py-16 md:py-20">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
                  Everything you need in one platform
                </h2>
                <p className="text-base text-muted-foreground max-w-xl mx-auto">
                  Powerful features designed for modern campus life
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { icon: Calendar, title: "Discover Events", desc: "Browse thousands of events on your campus" },
                  { icon: Zap, title: "Stay Organized", desc: "Easily track the events you care about" },
                  { icon: TrendingUp, title: "Track Trends", desc: "See what's popular and trending on campus" },
                ].map((feature, idx) => (
                  <Card key={idx} className="p-6 border-border/50 bg-card/90 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center mb-4">
                        <feature.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            </ColoredGradientSection>
          </ScrollOverPanel>

          {/* <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/5">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
                  Built for students, by students
                </h2>
                <p className="text-base text-muted-foreground max-w-xl mx-auto">
                  Administrators across campuses rely on UniHub to connect students with events
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {[
                  { icon: Calendar, title: "Event Discovery", desc: "Browse and discover events via search, categories, or recommendations with zero hassle." },
                  { icon: Phone, title: "Real-time Updates", desc: "Get instant notifications about event changes, cancellations, and new opportunities." },
                  { icon: Mail, title: "Smart RSVP", desc: "Automatically manage your event calendar and receive reminders for upcoming events." },
                  { icon: FileText, title: "Event Management", desc: "Create, manage, and promote your own events with powerful tools and analytics." },
                ].map((feature, idx) => (
                  <Card key={idx} className="p-8 border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section> */}

          <section className="relative isolate py-16 md:py-20 bg-background">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 text-balance">
                Find your favorite types of events 
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[
                  { icon: Music, label: "Concerts" },
                  { icon: Gamepad2, label: "Gaming" },
                  { icon: GraduationCap, label: "Workshops" },
                  { icon: Calendar, label: "Sports" },
                  { icon: Film, label: "Film" },
                  { icon: UtensilsCrossed, label: "Food & Dining" },
                  { icon: Palette, label: "Art & Culture" },
                  { icon: PartyPopper, label: "Social" },
                ].map((item, idx) => (
                  <Card key={idx} className="p-6 text-center border border-border/50 bg-card/90 hover:shadow-md transition-shadow duration-200 group">
                    <div className="w-12 h-12 mx-auto mb-0 rounded-full border border-primary/20 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-semibold text-sm">{item.label}</h3>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <Suspense fallback={<SectionLoading />}>
            <CollegesList />
          </Suspense>

          <ColoredGradientSection className="py-16 md:py-20">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
                  Trusted by leading campus communities
                </h2>
                <p className="text-base text-muted-foreground max-w-xl mx-auto">
                  See how students are using UniHub to stay connected
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50">
                  <div className="text-5xl font-bold mb-2 text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground font-medium">Events supported by UniHub</div>
                </div>
                <div className="text-center p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50">
                  <div className="text-5xl font-bold mb-2 text-primary">75%</div>
                  <div className="text-sm text-muted-foreground font-medium">Events discovered by AI</div>
                </div>
                <div className="text-center p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50">
                  <div className="text-5xl font-bold mb-2 text-primary">4.7/5</div>
                  <div className="text-sm text-muted-foreground font-medium">Average user rating</div>
                </div>
              </div>
            </div>
          </ColoredGradientSection>

          <section className="relative py-16 md:py-20 bg-background">
            <div className="container px-4 md:px-6">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-balance">
                    Popular events this week
                  </h2>
                  <p className="text-base text-muted-foreground">
                    Don&apos;t miss out on these trending events happening across campuses
                  </p>
                </div>
              </div>

           <Suspense fallback={
             <SectionLoading 
               height="600px"
               className="py-16 md:py-24"
               spinnerSize={20}
             />
           }>
             <EventsList />
           </Suspense>

              <div className="text-center mt-10">
                <Link href="/events">
                  <Button size="lg" variant="outline" className="border-2 px-8 h-12 shadow-lg hover:scale-105 transition-transform">
                    View All
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <ColoredGradientSection className="py-16 md:py-20">
            <div className="container px-4 md:px-6">
              <Card className="p-10 md:p-14 text-center bg-card/90 backdrop-blur-md border-primary/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
                    Ready to get started?
                  </h2>
                  <p className="text-base text-muted-foreground mb-8 max-w-xl mx-auto">
                    Join thousands of students already discovering amazing events on their campuses
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <Link href="/signup">
                        Create Account
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="px-8 h-12 border-2 shadow-lg hover:scale-105 transition-transform">
                      <Link href="/events">Browse Events</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </ColoredGradientSection>
        </main>
        </div>
      </>
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
