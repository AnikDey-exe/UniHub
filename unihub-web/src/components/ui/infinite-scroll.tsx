"use client"

import * as React from "react"
import { cn } from "@/utils/cn"

interface InfiniteScrollProps {
  children: React.ReactNode
  hasNext: boolean
  isLoading: boolean
  onLoadMore: () => void
  loadingComponent?: React.ReactNode
  className?: string
}

export function InfiniteScroll({
  children,
  hasNext,
  isLoading,
  onLoadMore,
  loadingComponent,
  className
}: InfiniteScrollProps) {
  const observerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasNext && !isLoading) {
          onLoadMore()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [hasNext, isLoading, onLoadMore])

  return (
    <div className={cn("w-full", className)}>
      {children}
      <div ref={observerRef} className="flex justify-center py-8">
        {hasNext ? (
          isLoading ? (
            loadingComponent || (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Loading more...</span>
              </div>
            )
          ) : (
            <div className="h-4" />
          )
        ) : (
          <div className="text-sm text-muted-foreground"></div>
        )}
      </div>
    </div>
  )
}
