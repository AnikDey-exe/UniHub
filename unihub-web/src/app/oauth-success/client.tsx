'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageLoading } from '@/components/ui/loading'

export default function OAuthSuccessClient() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      localStorage.setItem('token', token)
      // Use window.location.replace to force full reload and avoid adding to history
      window.location.replace('/')
    } else {
      window.location.replace('/login')
    }
  }, [searchParams])

  return <PageLoading />
}

