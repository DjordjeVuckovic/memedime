import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui'
import { ConnectIcon } from '@/components/ConnectIcon.tsx'
import { formatWalletAddress } from '@/wallet/util.ts'

export const WalletConnectButton = ({connecting} : {connecting: (should: boolean) => void}) => {
  const { publicKey, disconnect, connected } = useWallet()

  const handleWalletClick = () => {
    if (connected) {
      disconnect().then(
        () => connecting(false)
      )
    } else {
      connecting(true)
    }
  }

  return (
    <div className="hidden md:block">
      <Button
        variant={connected ? 'green' : 'gold'}
        glow
        size="md"
        className="hover-shake"
        onClick={handleWalletClick}
      >
        <ConnectIcon connected={connected} />
        {connected && publicKey ? formatWalletAddress(publicKey.toBase58()) : 'CONNECT'}
      </Button>
    </div>
  )
}
