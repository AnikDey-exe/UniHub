import { useMutation } from '@tanstack/react-query'
import { authAPI } from '@/lib/api'
import { LoginRequest } from '@/types/requests'
import { LoginResponse } from '@/types/responses'

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (loginData: LoginRequest) => authAPI.login(loginData),
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token)
      }
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}
