import { createFileRoute } from "@tanstack/react-router"
import { loadHandbookBundle } from "@/lib/content"
import { BookmarksView } from "@/views/BookmarksView"

export const Route = createFileRoute("/$hb/bookmarks")({
  loader: ({ params }) => loadHandbookBundle(params.hb),
  component: BookmarksRoute,
})

function BookmarksRoute() {
  const bundle = Route.useLoaderData()
  return <BookmarksView bundle={bundle} />
}
