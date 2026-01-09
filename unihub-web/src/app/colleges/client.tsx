'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CollegeCard } from "@/components/ui/college-card"
import { Search, Building2 } from "lucide-react"
import { College, CollegeSearchResponse } from "@/types/responses"
import { useCollegesInfiniteSearch } from '@/hooks/use-colleges-search'
import { InfiniteScroll } from '@/components/ui/infinite-scroll'

interface CollegesClientProps {
  initialColleges: College[]
}

export function CollegesClient({ initialColleges }: CollegesClientProps) {
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [sortBy, setSortBy] = useState('A-Z')

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 600)

    return () => clearTimeout(timer)
  }, [searchInput])

  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useCollegesInfiniteSearch({
    searchQuery,
    location,
    sortBy
  })

  const colleges = data?.pages.flatMap((page: CollegeSearchResponse) => page.colleges) || initialColleges

  return (
    <div className="min-h-screen bg-background">
      <section>
        <div className="container px-4 md:px-6 py-4 mt-0">
          <div className="flex items-center justify-between mb-6 mt-4">
            <h1 className="text-3xl font-bold text-foreground">Supported Colleges</h1>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-8 items-start">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Sort by</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="A-Z" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A-Z">A-Z</SelectItem>
                  <SelectItem value="Z-A">Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <Input
                placeholder="Malone, NY"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-48"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container px-4 md:px-6">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Searching colleges...</h3>
                <p className="text-sm">Please wait while we find colleges for you.</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-destructive">
                <Building2 className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Search failed</h3>
                <p className="text-sm">There was an error searching for colleges. Please try again.</p>
              </div>
            </div>
          ) : (
            <InfiniteScroll
              hasNext={hasNextPage || false}
              isLoading={isFetchingNextPage}
              onLoadMore={fetchNextPage}
              loadingComponent={
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm">Loading more colleges...</span>
                </div>
              }
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>

              {colleges.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-muted-foreground">
                    <Building2 className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">No colleges found</h3>
                    <p className="text-sm">Try adjusting your search or filters to find more colleges.</p>
                  </div>
                </div>
              )}
            </InfiniteScroll>
          )}
        </div>
      </section>
    </div>
  )
}

