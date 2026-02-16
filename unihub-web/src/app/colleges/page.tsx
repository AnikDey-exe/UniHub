import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { CollegesClient } from "./client"
import { collegesAPI } from "@/lib/api"
import { SectionLoading } from "@/components/ui/loading"

async function CollegesList() {
  const colleges = await collegesAPI.getAllColleges({ limit: 12 })
  return <CollegesClient initialColleges={colleges.colleges} />
}

export default function CollegesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 md:pt-24">
        <Suspense fallback={<SectionLoading height="600px" className="py-16" />}>
          <CollegesList />
        </Suspense>
      </main>
    </div>
  )
}

