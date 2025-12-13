import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { AnimatePresence, motion } from 'framer-motion'

import Navbar from '../components/Navbar'
import { WalletProvider } from '@/wallet/WalletProvider'

function RootComponent() {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  return (
    <WalletProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.15,
                ease: 'easeInOut',
              }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </div>
    </WalletProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
