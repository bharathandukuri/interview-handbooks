import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { KitView } from "@/views/KitView"

export const Route = createFileRoute("/_kit")({
  component: KitRoute,
})

function KitRoute() {
  if (!import.meta.env.DEV) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background p-6 text-foreground">
        <div className="max-w-md rounded-2xl border border-border bg-surface p-6 text-center shadow-(--shadow-card)">
          <h1 className="text-lg font-semibold">Development Route Only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The design system kit is only available during local development.
          </p>
          <Button asChild className="mt-4" size="sm">
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return <KitView />
}
