import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { eventsAPI, collegesAPI } from "@/lib/api"
import { SectionLoading } from "@/components/ui/loading"
import { CollegesSection } from "@/app/components/colleges"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Sparkles, TrendingUp, Zap, Music, Gamepad2, GraduationCap, Phone, Mail, FileText, CheckCircle2 } from "lucide-react"
import { EventCard } from "@/components/ui/event-card"
import { Card } from "@/components/ui/card"

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
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/15 to-primary/5 rounded-full blur-[140px] animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-accent/15 to-accent/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }} />
    
    <div className="absolute top-20 right-20 w-32 h-32 opacity-20">
      <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/20 rounded-3xl rotate-45 animate-float" />
    </div>
    <div className="absolute top-40 left-20 w-24 h-24 opacity-15">
      <div className="w-full h-full bg-gradient-to-br from-accent/30 to-primary/20 rounded-2xl rotate-12 animate-float-delayed" />
    </div>
    <div className="absolute bottom-32 right-32 w-40 h-40 opacity-20">
      <div className="w-full h-full bg-gradient-to-br from-primary/25 to-accent/25 rounded-full animate-float-slow" />
    </div>
    <div className="absolute bottom-20 left-1/3 w-28 h-28 opacity-15">
      <div className="w-full h-full bg-gradient-to-br from-accent/30 to-primary/20 rounded-3xl -rotate-45 animate-float-delayed-slow" />
    </div>
    
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
  </div>
)

const ColoredGradientSection = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/8 to-primary/10" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
    <div className="relative z-10">{children}</div>
  </div>
)

export default async function HomePage() {
  try {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <Header />
        <main className="relative">
          <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
            <HeroGraphics />
            
            <div className="container px-4 md:px-6 relative z-10">
              <div className="mx-auto max-w-5xl text-center">

                <h1 className="mb-5 text-5xl font-bold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1]">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    Never miss a moment
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    on campus
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground text-pretty md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
                  Connect with your college community through concerts, workshops, sports, and social gatherings. 
                  Discover events that matter to you.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                  <Button size="lg" className="text-base px-8 h-12 bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105">
                    <Link href="/events">
                      Explore Events
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base px-8 h-12 border-2 bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg">
                    Learn More
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-8 border-t border-border/50">
                  <div className="relative text-center">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-4xl font-bold mb-2 bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mt-5">10K+</div>
                    <div className="text-sm text-muted-foreground">Active Events</div>
                  </div>
                  <div className="relative text-center">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 text-accent" />
                    </div>
                    <div className="text-4xl font-bold mb-2 bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mt-5">500+</div>
                    <div className="text-sm text-muted-foreground">Colleges</div>
                  </div>
                  <div className="relative text-center">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-4xl font-bold mb-2 bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mt-5">50K+</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ColoredGradientSection className="py-16 md:py-20">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
                  Everything you need in one platform
                </h2>
                <p className="text-base text-muted-foreground max-w-xl mx-auto">
                  Powerful features designed for modern campus life
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {[
                  { icon: Calendar, title: "Discover Events", desc: "Browse thousands of events on your campus", color: "from-primary/25 to-primary/10" },
                  { icon: Users, title: "Connect with Peers", desc: "Join communities and meet like-minded students", color: "from-accent/25 to-accent/10" },
                  { icon: Zap, title: "Stay Updated", desc: "Get notified about events you care about", color: "from-primary/25 to-accent/25" },
                  { icon: TrendingUp, title: "Track Trends", desc: "See what's popular and trending on campus", color: "from-accent/25 to-primary/25" },
                ].map((feature, idx) => (
                  <Card key={idx} className="p-6 border-border/50 bg-card/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform`} />
                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <feature.icon className="h-7 w-7 text-primary" />
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

          <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/5">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 text-balance">
                Find your favorite types of events 
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Music, label: "Concerts", gradient: "from-purple-500/30 to-pink-500/30" },
                  { icon: Gamepad2, label: "Gaming", gradient: "from-blue-500/30 to-cyan-500/30" },
                  { icon: GraduationCap, label: "Workshops", gradient: "from-green-500/30 to-emerald-500/30" },
                  { icon: Calendar, label: "Sports", gradient: "from-orange-500/30 to-red-500/30" },
                ].map((item, idx) => (
                  <Card key={idx} className="p-6 text-center border-border/50 bg-card/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <item.icon className="h-8 w-8 text-foreground/90" />
                    </div>
                    <h3 className="font-semibold">{item.label}</h3>
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
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">10K+</div>
                  <div className="text-sm text-muted-foreground font-medium">Events hosted per month</div>
                </div>
                <div className="text-center p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50">
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">95%</div>
                  <div className="text-sm text-muted-foreground font-medium">Events discovered by AI</div>
                </div>
                <div className="text-center p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50">
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">4.9/5</div>
                  <div className="text-sm text-muted-foreground font-medium">Average user rating</div>
                </div>
              </div>
            </div>
          </ColoredGradientSection>

          <section className="relative py-16 md:py-20 bg-gradient-to-b from-background to-muted/5">
            <div className="container px-4 md:px-6">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-balance">
                    Popular events this week
                  </h2>
                  <p className="text-base text-muted-foreground">
                    Don't miss out on these trending events happening across campuses
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                  <TrendingUp className="h-4 w-4" />
                  <span>Trending</span>
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
                    View All Events
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
                    <Button size="lg" className="px-8 h-12 bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105">
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
