import { createRootRoute, Outlet } from "@tanstack/react-router"
import { ErrorBoundary } from "@/app/ErrorBoundary"
import { Providers } from "@/app/providers"

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <ErrorBoundary>
      <Providers>
        <Outlet />
      </Providers>
    </ErrorBoundary>
  )
}
