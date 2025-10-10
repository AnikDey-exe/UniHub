'use client'

import { Header } from '@/components/layout/header'
import { LoginForm } from './components/login-form'

export default function LoginClient() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
