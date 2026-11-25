import { createFileRoute } from "@tanstack/react-router"
import { loadHandbookBundle } from "@/lib/content"
import { RevisionView } from "@/views/RevisionView"

export const Route = createFileRoute("/$hb/revision")({
  loader: ({ params }) => loadHandbookBundle(params.hb),
  component: RevisionRoute,
})

function RevisionRoute() {
  const bundle = Route.useLoaderData()
  return <RevisionView bundle={bundle} />
}
