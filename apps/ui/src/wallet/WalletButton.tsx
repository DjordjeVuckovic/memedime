import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Button } from '@/components/ui'
import { ConnectIcon } from '@/components/ConnectIcon.tsx'
import { formatWalletAddress } from '@/wallet/util.ts'

interface WalletButtonProps {
  connecting: (should: boolean) => void
}

export function WalletButton({ connecting }: WalletButtonProps) {
  const { publicKey, disconnect, connected } = useWallet()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  // Fetch balance when wallet is connected
  useEffect(() => {
    if (!connected || !publicKey || !connection) {
      setBalance(null)
      return
    }

    let isMounted = true
    setIsLoadingBalance(true)

    const fetchBalance = async () => {
      try {
        const lamports = await connection.getBalance(publicKey)
        if (isMounted) {
          setBalance(lamports / LAMPORTS_PER_SOL)
          setIsLoadingBalance(false)
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error)
        if (isMounted) {
          setBalance(null)
          setIsLoadingBalance(false)
        }
      }
    }

    fetchBalance()

    // Subscribe to balance changes
    const subscriptionId = connection.onAccountChange(
      publicKey,
      (accountInfo) => {
        if (isMounted) {
          setBalance(accountInfo.lamports / LAMPORTS_PER_SOL)
        }
      }
    )

    return () => {
      isMounted = false
      connection.removeAccountChangeListener(subscriptionId).then()
    }
  }, [connected, publicKey, connection])

  const handleWalletClick = () => {
    if (connected) {
      disconnect().then(() => connecting(false))
    } else {
      connecting(true)
    }
  }

  const formatBalance = (bal: number) => {
    if (bal < 0.01) return bal.toFixed(4)
    if (bal < 1) return bal.toFixed(3)
    return bal.toFixed(2)
  }

  return (
    <div className="hidden md:block">
      {connected && publicKey ? (
        <div className="flex items-center gap-2">
          {/* Disconnect Button */}
          <Button variant="green" glow size="md" className="hover-shake" onClick={handleWalletClick}>
            <ConnectIcon connected={true} />
            {formatWalletAddress(publicKey.toBase58())}
          </Button>

          {/* Balance Display */}
          {balance !== null && (
            <div className="glass brutal-shadow px-3 py-2 rounded-lg border-2 border-white/20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-white/60">SOL</span>
                <span className="text-sm font-bold font-mono text-cyan-400">
                  {isLoadingBalance ? '...' : formatBalance(balance)}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button variant="gold" glow size="md" className="hover-shake" onClick={handleWalletClick}>
          <ConnectIcon connected={false} />
          CONNECT
        </Button>
      )}
    </div>
  )
}
