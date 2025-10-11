import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authAPI } from '@/lib/api'
import { UserRegisterRequest } from '@/types/requests'
import { User } from '@/types/responses'

export function useSignup() {
  const queryClient = useQueryClient()
  
  return useMutation<User, Error, UserRegisterRequest>({
    mutationFn: (signupData: UserRegisterRequest) => authAPI.register(signupData),
    onSuccess: (data) => {
      // Invalidate user query to refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] })
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    },
    onError: (error) => {
      console.error('Signup failed:', error)
    },
  })
}
