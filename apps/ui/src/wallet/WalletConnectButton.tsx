import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui'
import { ConnectIcon } from '@/components/ConnectIcon.tsx'

export const WalletConnectButton = ({connecting} : {connecting: (should: boolean) => void}) => {
  const { publicKey, disconnect, connected } = useWallet()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

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
        {connected && publicKey ? formatAddress(publicKey.toBase58()) : 'CONNECT'}
      </Button>
    </div>
  )
}
