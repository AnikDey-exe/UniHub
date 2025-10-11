'use client';
import { useQuery } from '@tanstack/react-query';
import { authAPI } from '@/lib/api';

export function useUser(token: string | null) {

  return useQuery({
    queryKey: ['user'],
    queryFn: () => {
        return authAPI.getCurrentUser(token || '');
    },
    enabled: !!token,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
