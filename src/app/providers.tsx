'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, getDefaultConfig, lightTheme } from '@rainbow-me/rainbowkit'
import { baseSepolia } from 'wagmi/chains'
import '@rainbow-me/rainbowkit/styles.css'

const config = getDefaultConfig({
  appName: 'AI Creator Protocol',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo',
  chains: [baseSepolia],
  ssr: true,
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={lightTheme({
            accentColor: '#7b3cf0',
            accentColorForeground: 'white',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}