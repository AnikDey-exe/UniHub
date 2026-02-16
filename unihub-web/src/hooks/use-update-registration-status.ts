'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsAPI } from '@/lib/api';
import { RegistrationStatus } from '@/types/responses';

interface UpdateRegistrationStatusParams {
  registrationId: number;
  newStatus: RegistrationStatus;
  eventId: number;
  token: string;
}

export function useUpdateRegistrationStatus(eventId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ registrationId, newStatus, token }: Omit<UpdateRegistrationStatusParams, 'eventId'>) =>
      eventsAPI.updateRegistrationStatus(registrationId, newStatus, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-registrations', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
  });
}
