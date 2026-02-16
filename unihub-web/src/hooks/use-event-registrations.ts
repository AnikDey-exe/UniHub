'use client';
import { useQuery } from '@tanstack/react-query';
import { eventsAPI } from '@/lib/api';

export function useEventRegistrations(eventId: number) {
  return useQuery({
    queryKey: ['event-registrations', eventId],
    queryFn: () => eventsAPI.getEventRegistrations(eventId),
    staleTime: 30000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}
