import ChatProvider from '@/Context/ChatProvider'
import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import theme from "@/config/theme"

const queryClient = new QueryClient() 

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChatProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}> 
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </ChatProvider>
  )
}
