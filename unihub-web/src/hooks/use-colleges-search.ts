import { useInfiniteQuery } from '@tanstack/react-query'
import { collegesAPI } from '@/lib/api'
import { CollegeSearchRequest } from '@/types/requests'

interface UseCollegesInfiniteSearchParams {
  searchQuery?: string
  location?: string
  sortBy?: string
  enabled?: boolean
}

export function useCollegesInfiniteSearch({
  searchQuery,
  location,
  sortBy = 'A-Z',
  enabled = true
}: UseCollegesInfiniteSearchParams) {
  const searchParams: CollegeSearchRequest = {
    searchQuery: searchQuery?.trim() || undefined,
    location: location?.trim() || undefined,
    sortBy,
    limit: 12
  }

  return useInfiniteQuery({
    queryKey: ['colleges-infinite-search', searchQuery, location, sortBy],
    queryFn: async ({ pageParam }) => {
      const params = {
        ...searchParams
      }
      
      if (pageParam && (pageParam as any).lastNameASC) {
        params.lastNameASC = (pageParam as any).lastNameASC
      }
      
      return collegesAPI.getAllColleges(params)
    },
    getNextPageParam: (lastPage: any) => {
      if (lastPage.hasNext) {
        return {
          lastNameASC: lastPage.lastNameASC
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

