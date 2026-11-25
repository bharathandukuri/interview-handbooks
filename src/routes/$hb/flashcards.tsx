import { createFileRoute } from "@tanstack/react-router"
import { loadHandbookBundle } from "@/lib/content"
import { cardFilterSearchSchema } from "@/lib/search-params"
import { FlashcardsView } from "@/views/FlashcardsView"

export const Route = createFileRoute("/$hb/flashcards")({
  validateSearch: cardFilterSearchSchema,
  loader: ({ params }) => loadHandbookBundle(params.hb),
  component: FlashcardsRoute,
})

function FlashcardsRoute() {
  const bundle = Route.useLoaderData()
  const filters = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <FlashcardsView
      bundle={bundle}
      filters={filters}
      onFiltersChange={(next) => {
        void navigate({ search: next, replace: true })
      }}
    />
  )
}
