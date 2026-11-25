import { createFileRoute } from "@tanstack/react-router"
import { loadHandbookBundle } from "@/lib/content"
import { ProgressView } from "@/views/ProgressView"

export const Route = createFileRoute("/$hb/progress")({
  loader: ({ params }) => loadHandbookBundle(params.hb),
  component: ProgressRoute,
})

function ProgressRoute() {
  const bundle = Route.useLoaderData()
  return <ProgressView bundle={bundle} />
}
