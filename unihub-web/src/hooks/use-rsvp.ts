import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsAPI } from '@/lib/api'
import { RSVPRequest } from '@/types/requests'
import { Event } from '@/types/responses'

export function useRSVP(eventId: number) {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { rsvpData: RSVPRequest; token: string }>({
    mutationKey: ['rsvp', eventId],
    retry: 0,
    mutationFn: ({ rsvpData, token }) => eventsAPI.rsvp(rsvpData, token),
    onSuccess: async () => {
      queryClient.refetchQueries({ queryKey: ['event', eventId] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['is-registered', eventId] })
      queryClient.invalidateQueries({ queryKey: ['events-search'] })
      queryClient.invalidateQueries({ queryKey: ['events-infinite-search'] })
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] })
    },
  })
}

