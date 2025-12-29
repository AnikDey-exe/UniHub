import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersAPI } from '@/lib/api'
import { User } from '@/types/responses'

export function useUpdateUser(userId: number) {
  const queryClient = useQueryClient()

  return useMutation<User, Error, { formData: FormData; token: string }>({
    mutationFn: ({ formData, token }) => usersAPI.updateUserProfile(userId, formData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

