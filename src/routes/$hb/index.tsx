import { createFileRoute } from "@tanstack/react-router"
import { loadHandbookBundle } from "@/lib/content"
import { HandbookHome } from "@/views/HandbookHome"

export const Route = createFileRoute("/$hb/")({
  loader: ({ params }) => loadHandbookBundle(params.hb),
  component: HandbookHomeRoute,
})

function HandbookHomeRoute() {
  const bundle = Route.useLoaderData()
  return <HandbookHome bundle={bundle} />
}
