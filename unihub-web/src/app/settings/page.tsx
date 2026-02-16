import { Header } from "@/components/layout/header"
import SettingsClient from './client'

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 md:pt-24">
        <SettingsClient />
      </main>
    </div>
  )
}

