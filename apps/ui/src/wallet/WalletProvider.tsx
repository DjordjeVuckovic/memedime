import { type ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { TorusWalletAdapter, CoinbaseWalletAdapter} from '@solana/wallet-adapter-wallets'
import { WalletAdapterNetwork, type WalletError } from '@solana/wallet-adapter-base'
import { clusterApiUrl } from '@solana/web3.js'
import { WalletContextProvider } from './WalletContext'

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  // Configure wallets
  const wallets = useMemo(
    () => [
      new TorusWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    []
  )

  const onError = (error: WalletError) => {
    console.error('Wallet error:', error)
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} onError={onError} localStorageKey={'memedime-wallet-name'} autoConnect>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}
