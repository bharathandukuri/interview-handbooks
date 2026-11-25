import { createFileRoute, notFound, Outlet } from "@tanstack/react-router"
import { AppShell } from "@/components/layout/AppShell"
import { loadHandbookBundle } from "@/lib/content"
import { NotFound } from "@/views/NotFound"

export const Route = createFileRoute("/$hb")({
  loader: async ({ params }) => {
    try {
      return await loadHandbookBundle(params.hb)
    } catch {
      throw notFound()
    }
  },
  component: HandbookLayout,
  notFoundComponent: () => <NotFound title="Handbook not found" />,
  errorComponent: ({ error }) => (
    <NotFound
      title="Could not load handbook"
      message={
        error instanceof Error ? error.message : "Failed to load handbook."
      }
    />
  ),
})

function HandbookLayout() {
  const bundle = Route.useLoaderData()
  return (
    <AppShell bundle={bundle}>
      <Outlet />
    </AppShell>
  )
}
