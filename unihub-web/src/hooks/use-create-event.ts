import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsAPI } from '@/lib/api'
import { Event } from '@/types/responses'

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation<Event, Error, { formData: FormData; token: string }>({
    mutationFn: ({ formData, token }) => eventsAPI.createEvent(formData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events-search'] })
      queryClient.invalidateQueries({ queryKey: ['events-infinite-search'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

