import { Header } from "@/components/layout/header"
import { ProfileClient } from "./client"

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 md:pt-24">
        <ProfileClient />
      </main>
    </div>
  )
}

