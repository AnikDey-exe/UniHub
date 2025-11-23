import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsAPI } from '@/lib/api'
import { EventCreateRequest } from '@/types/requests'
import { Event } from '@/types/responses'

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation<Event, Error, { eventData: EventCreateRequest; token: string }>({
    mutationFn: ({ eventData, token }) => eventsAPI.createEvent(eventData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events-search'] })
      queryClient.invalidateQueries({ queryKey: ['events-infinite-search'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

