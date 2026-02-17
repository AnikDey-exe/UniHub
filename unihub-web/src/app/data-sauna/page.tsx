import { Header } from "@/components/layout/header"
import { DataSaunaClient } from "./client"

export const metadata = {
  title: "Data Sauna | Analytics & Event Details",
  description: "View analytics and detailed event breakdowns.",
}

export default function DataSaunaPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 md:pt-24">
        <DataSaunaClient />
      </main>
    </div>
  )
}
