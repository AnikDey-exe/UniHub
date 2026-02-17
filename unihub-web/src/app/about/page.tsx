import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"

export const metadata: Metadata = {
  title: "About | UniHub",
  description:
    "UniHub is a campus events platform that helps students and leaders discover, create, and manage university events.",
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground border-b border-border pb-2">
        {title}
      </h2>
      <div className="text-muted-foreground leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  )
}

function SubSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
      <div className="text-muted-foreground leading-relaxed space-y-2 pl-0 md:pl-2">
        {children}
      </div>
    </div>
  )
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc list-inside space-y-1.5 my-3 text-muted-foreground">
      {children}
    </ul>
  )
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="container max-w-3xl px-4 md:px-6 mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              About UniHub
            </h1>
            <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4">
              A campus events platform that helps students and leaders discover,
              create, and manage university events.
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              UniHub connects your campus community around events — from
              concerts and workshops to sports and socials. Create events,
              discover what’s happening, and stay in the loop.
            </p>
          </header>

          <Section title="What We Offer">
            <p>The platform supports:</p>
            <Ul>
              <li>Event creation and management</li>
              <li>Secure sign-up and sign-in</li>
              <li>Browse events and colleges</li>
              <li>RSVP and manage your registrations</li>
              <li>Custom event forms and questions (via Formiq)</li>
              <li>Smarter event discovery and recommendations (via Butler)</li>
              <li>Automatic link to your university (via Institutor)</li>
            </Ul>
          </Section>

          <Section title="UniHub Formiq">
            <p>
              <strong className="text-foreground">UniHub Formiq</strong> lets
              event creators build custom experiences for each event.
            </p>
            <p>With Formiq you can:</p>
            <Ul>
              <li>Add custom questions and forms to your events</li>
              <li>Use different field types (text, choices, conditional questions)</li>
              <li>Collect and store responses per attendee</li>
              <li>Adapt events to different types — hackathons, workshops, conferences, socials, and more</li>
            </Ul>
            <p>
              Formiq is actively being improved. Stay tuned for updates.
            </p>
          </Section>

          <Section title="UniHub Butler">
            <p>
              <strong className="text-foreground">UniHub Butler</strong> is
              UniHub&apos;s AI-powered discovery and recommendation engine.
            </p>
            <p>Butler helps you:</p>
            <Ul>
              <li>Search and filter events more intelligently</li>
              <li>Get personalized event recommendations</li>
              <li>Discover events that match your interests</li>
            </Ul>
            <p>
              Butler turns UniHub from a simple event list into a discovery
              platform that helps you find what matters. Butler is actively
              being improved. Stay tuned for updates.
            </p>
          </Section>

          <Section title="UniHub Institutor">
            <p>
              <strong className="text-foreground">UniHub Institutor</strong> is
              UniHub&apos;s way of connecting you to your university.
            </p>
            <p>
              It identifies and links users to their school so that events and
              content can be scoped by campus. When you sign up with your
              university email, Institutor recognizes your institution and
              associates your account with it. That means you see events
              relevant to your campus and stay part of your university
              community.
            </p>
            <SubSection title="What Institutor does">
              <Ul>
                <li>Keeps an up-to-date list of universities and their official email domains</li>
                <li>Matches your email to your school when you register</li>
                <li>Scopes your experience to your university</li>
              </Ul>
            </SubSection>
            <SubSection title="Coming later">
              <p>
                Planned improvements include verified institution profiles, admin
                tools for campus representatives, university-specific branding,
                and support for cross-campus collaboration. Institutor is what
                lets UniHub grow from a single campus to many.
              </p>
            </SubSection>
          </Section>

          <Section title="Features for You">
            <SubSection title="Your account">
              <Ul>
                <li>Sign up and log in securely</li>
                <li>Manage your profile</li>
                <li>See your events and registrations</li>
                <li>Automatic link to your university</li>
              </Ul>
            </SubSection>
            <SubSection title="Events">
              <Ul>
                <li>Create events and customize them with Formiq</li>
                <li>Add title, description, location, and date</li>
                <li>Discover events through Butler</li>
                <li>RSVP and manage your registrations</li>
              </Ul>
            </SubSection>
          </Section>

          <Section title="What’s Next">
            <Ul>
              <li>Role-based permissions</li>
              <li>Email notifications</li>
              <li>Real-time updates</li>
              <li>Analytics and insights</li>
              <li>UniHub DataSauna (in planning)</li>
            </Ul>
          </Section>

          <Section title="Built by">
            <p>UniHub was built by Anik Dey.</p>
          </Section>
        </div>
      </div>
    </>
  )
}
