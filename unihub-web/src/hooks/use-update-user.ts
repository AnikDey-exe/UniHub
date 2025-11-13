import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersAPI } from '@/lib/api'
import { UserUpdateRequest } from '@/types/requests'
import { User } from '@/types/responses'

export function useUpdateUser(userId: number) {
  const queryClient = useQueryClient()

  return useMutation<User, Error, { userData: UserUpdateRequest; token: string }>({
    mutationFn: ({ userData, token }) => usersAPI.updateUserProfile(userId, userData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

