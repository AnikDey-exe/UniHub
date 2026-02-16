'use client';

import { useQuery } from '@tanstack/react-query';
import { eventsAPI } from '@/lib/api';
import { IsRegisteredResponse } from '@/types/responses';

export function useIsRegistered(eventId: number, userId: number | undefined) {
  return useQuery<IsRegisteredResponse | null, Error>({
    queryKey: ['is-registered', eventId, userId],
    queryFn: (): Promise<IsRegisteredResponse | null> => {
      if (!userId) {
        return Promise.resolve(null);
      }
      const token = localStorage.getItem('token');
      if (!token) {
        return Promise.resolve(null);
      }
      return eventsAPI.isRegistered(eventId, userId, token);
    },
    enabled: !!userId && typeof window !== 'undefined' && !!localStorage.getItem('token'),
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: false,
  });
}
