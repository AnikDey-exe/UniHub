import { Header } from "@/components/layout/header"
import { CreateEventClient } from "./client"

export default function CreateEventPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CreateEventClient />
      </main>
    </div>
  )
}

