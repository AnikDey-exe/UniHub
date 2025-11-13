import { Header } from "@/components/layout/header"
import SettingsClient from './client'

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <SettingsClient />
      </main>
    </div>
  )
}

