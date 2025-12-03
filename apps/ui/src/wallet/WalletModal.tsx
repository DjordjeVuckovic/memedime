import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useWallet } from '@solana/wallet-adapter-react'
import type { WalletName } from '@solana/wallet-adapter-base'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { cn } from '@/lib/utils.ts'
import { useEffect, useMemo, useState } from 'react'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { wallets, select, connected, disconnect, signIn, publicKey } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)

  const installedWallets = useMemo(
    () => wallets.filter((wallet) => wallet.readyState === 'Installed'),
    [wallets]
  )
  const notInstalledWallets = useMemo(
    () => wallets.filter((wallet) => wallet.readyState !== 'Installed'),
    [wallets]
  )

  const handleWalletSelect = async (walletName: WalletName, event?: any) => {
    event?.preventDefault()

    select(walletName)

    setIsConnecting(true)

    onClose()
  }

  const handleSignIn = async () => {
    if (!publicKey || !signIn) return

    try {
      const signature = await signIn({
        domain: "memedime.fun",
        address: publicKey.toBase58(),
        statement: "Sign in to MemeDime",
        uri: "https://memedime.fun",
      })

      console.log("Signed:", signature)

    } catch (err) {
      console.error("Signing failed:", err)
      await disconnect()
    }
  }

  useEffect(() => {
    isConnecting && connected && handleSignIn()
  }, [connected])

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        />

        {/* Content */}
        <DialogPrimitive.Content
          className={cn(
            'fixed top-[50%] left-[50%] z-50 w-full max-w-md',
            'translate-x-[-50%] translate-y-[-50%]',
            'glass border-4 border-black rounded-lg brutal-shadow-lg overflow-hidden',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'duration-200'
          )}
        >
          {/* Header */}
          <div className="bg-purple-600 border-b-4 border-black p-6 relative">
            <DialogPrimitive.Title className="text-2xl font-black text-white uppercase tracking-tight">
              Connect Wallet
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm text-white/80 font-mono mt-1">
              Select your Solana wallet
            </DialogPrimitive.Description>
            <DialogPrimitive.Close
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </DialogPrimitive.Close>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {/* Installed Wallets */}
            {installedWallets.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-white/70 uppercase tracking-wide mb-3">
                  Detected Wallets
                </h3>
                <div className="space-y-2">
                  {installedWallets.map((wallet) => (
                    <button
                      key={wallet.adapter.name}
                      onClick={(event) => handleWalletSelect(wallet.adapter.name, event)}
                      className="w-full flex items-center gap-4 p-4 bg-black/40 border-4 border-white/20 rounded-lg
                               hover:border-purple-400 hover:bg-black/60 transition-all group"
                    >
                      <img
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        className="w-10 h-10"
                      />
                      <div className="flex-1 text-left">
                        <p className="font-bold text-white group-hover:text-purple-400 transition-colors">
                          {wallet.adapter.name}
                        </p>
                        <p className="text-xs text-white/50 font-mono">Ready to connect</p>
                      </div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Not Installed Wallets */}
            {notInstalledWallets.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-white/70 uppercase tracking-wide mb-3">
                  Available Wallets
                </h3>
                <div className="space-y-2">
                  {notInstalledWallets.map((wallet) => (
                    <a
                      key={wallet.adapter.name}
                      href={wallet.adapter.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-4 p-4 bg-black/20 border-4 border-white/10 rounded-lg
                               hover:border-white/30 hover:bg-black/30 transition-all group"
                    >
                      <img
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        className="w-10 h-10 opacity-50 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="flex-1 text-left">
                        <p className="font-bold text-white/70 group-hover:text-white transition-colors">
                          {wallet.adapter.name}
                        </p>
                        <p className="text-xs text-white/40 font-mono">Click to install</p>
                      </div>
                      <div className="text-white/40 group-hover:text-white transition-colors">
                        →
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* No wallets detected */}
            {installedWallets.length === 0 && notInstalledWallets.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/70 font-mono">No wallets detected</p>
                <p className="text-sm text-white/50 font-mono mt-2">
                  Please install a Solana wallet extension
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-black/20 border-t-4 border-black p-4">
            <Button variant="secondary" className="w-full" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
