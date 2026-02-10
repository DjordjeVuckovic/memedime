import { createContext, useContext, type ReactNode, useEffect, useState } from 'react'
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { appEnv } from '@/lib/env.ts'

interface WalletContextValue {
  connected: boolean
  connecting: boolean
  disconnecting: boolean
  publicKey: PublicKey | null
  address: string | null
  disconnect: () => Promise<void>
  isAuthenticated: boolean
  connectionTriggered: boolean
  setConnectionTriggered: (value: boolean) => void
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined)

interface WalletContextProviderProps {
  children: ReactNode
}

export function WalletContextProvider({ children }: WalletContextProviderProps) {
  const solanaWallet = useSolanaWallet()
  const { publicKey, connected, disconnect, signIn } = solanaWallet
  const [connectionTriggered, setConnectionTriggered] = useState(false)

  const handleSignIn = async () => {
    if (!publicKey || !signIn) return

    try {
      await signIn({
        domain: appEnv.UI_HOST,
        address: publicKey.toBase58(),
        statement: 'Sign in to MemeDime',
        uri: `https://${appEnv.UI_HOST}`,
      })

    } catch (err) {
      console.error('Signing failed:', err)
      await disconnect()
    }
  }

  useEffect(() => {
    if (connectionTriggered && connected) {
      handleSignIn()
    }
  }, [connectionTriggered, connected])

  const value: WalletContextValue = {
    connected: solanaWallet.connected,
    connecting: solanaWallet.connecting,
    disconnecting: solanaWallet.disconnecting,
    publicKey: solanaWallet.publicKey,
    address: solanaWallet.publicKey?.toBase58() ?? null,
    disconnect: solanaWallet.disconnect,
    isAuthenticated: solanaWallet.connected,
    connectionTriggered,
    setConnectionTriggered,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWalletContext() {
  const context = useContext(WalletContext)

  if (context === undefined) {
    throw new Error('useWalletContext must be used within WalletContextProvider')
  }

  return context
}

export { useSolanaWallet as useWallet }
