import { useMutation } from '@tanstack/react-query'
import { authAPI } from '@/lib/api'

export function useSendVerificationEmail() {
  return useMutation<{verificationCode: string}, Error, string>({
    mutationFn: (userEmail: string) => authAPI.sendVerificationEmail(userEmail),
    onError: (error) => {
      console.error('Failed to send verification email:', error)
    },
  })
}

