import { Header } from "@/components/layout/header"
import { ProfileClient } from "./client"

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ProfileClient />
      </main>
    </div>
  )
}

