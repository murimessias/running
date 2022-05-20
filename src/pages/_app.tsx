import type { AppProps } from 'next/app'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { queryClient } from 'lib/react-query'
import { globalStyles } from 'styles'

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles()

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default MyApp
