'use client'

import { Header } from '@/components/layout/header'
import { SignupForm } from './components/signup-form'

export default function SignupClient() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </main>
    </div>
  )
}