import { Header } from "@/components/layout/header"
import { CreateEventClient } from "./client"

export default function CreateEventPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 md:pt-24">
        <CreateEventClient />
      </main>
    </div>
  )
}

