import { Card } from "@/components/ui/card"

const colleges = [
  { name: "Stanford University", students: "15,000+ students", logo: "SU" },
  { name: "MIT", students: "11,000+ students", logo: "MIT" },
  { name: "UC Berkeley", students: "42,000+ students", logo: "UCB" },
  { name: "Harvard University", students: "23,000+ students", logo: "HU" },
  { name: "Yale University", students: "14,000+ students", logo: "YU" },
  { name: "Princeton University", students: "8,000+ students", logo: "PU" },
]

export function CollegesSection() {
  return (
    <section className="py-16 md:py-24 border-b border-border/40">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4 md:text-4xl text-balance">
            Trusted by students at top universities
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Join thousands of students discovering events at their colleges
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {colleges.map((college) => (
            <Card
              key={college.name}
              className="p-4 flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="text-lg font-bold text-primary">{college.logo}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{college.name}</h3>
              <p className="text-xs text-muted-foreground">{college.students}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
