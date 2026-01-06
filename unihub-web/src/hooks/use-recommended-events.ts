import { useQuery } from '@tanstack/react-query'
import { eventsAPI } from '@/lib/api'
import { Event } from '@/types/responses'

export function useRecommendedEvents(eventId: number) {
  return useQuery<Event[], Error>({
    queryKey: ['recommendedEvents', eventId],
    queryFn: () => eventsAPI.recommendedEvents(eventId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

