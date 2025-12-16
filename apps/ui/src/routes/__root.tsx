import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import Navbar from '../components/Navbar'
import { Footer } from '@/components/Footer'
import { WalletProvider } from '@/wallet/WalletProvider'
import { ErrorPage } from '@/components/ErrorPage'

function RootComponent() {
  return (
    <WalletProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
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
  notFoundComponent: () => (
    <ErrorPage
      title="PAGE NOT FOUND"
      message="The page you are looking for does not exist. It might have been moved or deleted."
      errorCode="404"
      showBackButton={true}
      showHomeButton={true}
    />
  ),
})
