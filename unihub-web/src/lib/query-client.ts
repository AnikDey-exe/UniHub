import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
})

queryClient.getQueryCache().config.onError = (error: any) => {
  if (error?.status === 401 || error?.response?.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
}

queryClient.getMutationCache().config.onError = (error: any) => {
  if (error?.status === 401 || error?.response?.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
}
