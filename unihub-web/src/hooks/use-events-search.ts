import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { eventsAPI } from '@/lib/api'
import { EventSearchRequest } from '@/types/requests'
import { EventType } from '@/types/event-types'
import { EventSearchResponse } from '@/types/responses'

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
    staleTime: 0,
    refetchOnMount: true,
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
      
      if (pageParam && typeof pageParam === 'object') {
        if (sortBy === 'date' && 'lastStartDate' in pageParam) {
          params.lastStartDate = pageParam.lastStartDate as string
        } else if (sortBy !== 'date' && 'lastNumAttendees' in pageParam) {
          params.lastNumAttendees = pageParam.lastNumAttendees as number
        }
      }
      
      return eventsAPI.getAllEvents(params)
    },
    getNextPageParam: (lastPage: EventSearchResponse) => {
      if (lastPage.hasNext) {
        if (sortBy === 'date') {
          return {
            lastStartDate: lastPage.lastStartDate
          }
        } else {
          return {
            lastNumAttendees: lastPage.lastNumAttendees
          }
        }
      }
      return undefined
    },
    initialPageParam: undefined,
    enabled,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  })
}
