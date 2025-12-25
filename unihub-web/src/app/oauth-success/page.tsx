import { Suspense } from 'react'
import OAuthSuccessClient from './client'
import { PageLoading } from '@/components/ui/loading'

export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <OAuthSuccessClient />
    </Suspense>
  )
}

