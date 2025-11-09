import { useQuery } from '@tanstack/react-query'
import { eventsAPI } from '@/lib/api'
import { Event } from '@/types/responses'

export function useEvent(eventId: number, initialData?: Event) {
  return useQuery<Event, Error>({
    queryKey: ['event', eventId],
    queryFn: () => eventsAPI.getEventById(eventId),
    initialData,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

