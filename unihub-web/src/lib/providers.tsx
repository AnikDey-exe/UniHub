'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { MantineProvider, createTheme } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { queryClient } from '@/lib/query-client'
import { useTheme } from '@/context/theme-context'

const theme = createTheme({})

function MantineThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme()
  
  return (
    <MantineProvider theme={theme} forceColorScheme={isDark ? 'dark' : 'light'}>
      {children}
    </MantineProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineThemeProvider>
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
    </MantineThemeProvider>
  )
}
