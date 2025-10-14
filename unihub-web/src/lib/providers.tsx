'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { MantineProvider, createTheme } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { queryClient } from '@/lib/query-client'

const theme = createTheme({})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <DatesProvider settings={{ 
        locale: 'en-US',
        firstDayOfWeek: 0,
        weekendDays: [0, 6]
      }}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </DatesProvider>
    </MantineProvider>
  )
}
