import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { eventsAPI } from '@/lib/api'
import { EventSearchRequest } from '@/types/requests'
import { EventType } from '@/types/event-types'

interface UseEventsSearchParams {
  searchQuery?: string
  selectedTypes?: EventType[]
  startDate?: Date | null
  endDate?: Date | null
  sortBy?: string
  enabled?: boolean
}

export function useEventsSearch({
  searchQuery,
  selectedTypes,
  startDate,
  endDate,
  sortBy = 'date',
  enabled = true
}: UseEventsSearchParams) {
  const searchParams: EventSearchRequest = {
    searchQuery: searchQuery?.trim() || undefined,
    types: selectedTypes && selectedTypes.length > 0 ? selectedTypes : undefined,
    startDate: startDate ? startDate.toISOString() : undefined,
    endDate: endDate ? endDate.toISOString() : undefined,
    sortBy,
    limit: 3
  }

  return useQuery({
    queryKey: ['events-search', searchParams],
    queryFn: () => eventsAPI.getAllEvents(searchParams),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

export function useEventsInfiniteSearch({
  searchQuery,
  selectedTypes,
  startDate,
  endDate,
  sortBy = 'date',
  enabled = true
}: UseEventsSearchParams) {
  const searchParams: EventSearchRequest = {
    searchQuery: searchQuery?.trim() || undefined,
    types: selectedTypes && selectedTypes.length > 0 ? selectedTypes : undefined,
    startDate: startDate ? startDate.toISOString() : undefined,
    endDate: endDate ? endDate.toISOString() : undefined,
    sortBy,
    limit: 3
  }

  return useInfiniteQuery({
    queryKey: ['events-infinite-search', searchQuery, selectedTypes, startDate, endDate, sortBy],
    queryFn: async ({ pageParam }) => {
      const params = {
        ...searchParams
      }
      
      // Only add pagination params if they exist
      if (pageParam && (pageParam as any).lastStartDate) {
        params.lastStartDate = (pageParam as any).lastStartDate
      }
      if (pageParam && (pageParam as any).lastNumAttendees) {
        params.lastNumAttendees = (pageParam as any).lastNumAttendees
      }
      
      return eventsAPI.getAllEvents(params)
    },
    getNextPageParam: (lastPage: any) => {
      if (lastPage.hasNext) {
        return {
          lastStartDate: lastPage.lastStartDate,
          lastNumAttendees: lastPage.lastNumAttendees
        }
      }
      return undefined
    },
    initialPageParam: undefined,
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}
