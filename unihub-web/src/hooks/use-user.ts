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
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}
