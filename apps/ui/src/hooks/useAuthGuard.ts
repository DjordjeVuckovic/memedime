import { useWalletContext } from '@/wallet/WalletContext'
import { useToast } from '@/components/ui'

/**
 * Auth Guard Hook
 * Provides utilities to check wallet authentication and show appropriate toast messages
 *
 * @returns Object with connection state and checkAuth function
 */
export function useAuthGuard() {
  const { connected } = useWalletContext()
  const { showToast } = useToast()

  /**
   * Check if the user is authenticated (wallet connected)
   * Shows error toast if not connected
   *
   * @returns boolean - true if authenticated, false otherwise
   */
  const checkAuth = (): boolean => {
    if (!connected) {
      showToast('PLEASE CONNECT YOUR WALLET FIRST!', 'error')
      return false
    }
    return true
  }

  return {
    connected,
    checkAuth,
  }
}
