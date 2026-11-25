import { createFileRoute, notFound } from "@tanstack/react-router"
import { loadHandbookBundle } from "@/lib/content"
import { cardFilterSearchSchema } from "@/lib/search-params"
import { getCardsForChapter } from "@/lib/selectors"
import { ChapterView } from "@/views/ChapterView"
import { NotFound } from "@/views/NotFound"

export const Route = createFileRoute("/$hb/c/$chapter")({
  validateSearch: cardFilterSearchSchema,
  loader: async ({ params }) => {
    const bundle = await loadHandbookBundle(params.hb)
    const chapter = bundle.handbook.chapters.find(
      (c) => c.slug === params.chapter
    )
    if (!chapter) throw notFound()
    const cards = getCardsForChapter(bundle, chapter.slug)
    return { handbook: bundle.handbook, chapter, cards }
  },
  component: ChapterRoute,
  notFoundComponent: () => <NotFound title="Chapter not found" />,
})

function ChapterRoute() {
  const { handbook, chapter, cards } = Route.useLoaderData()
  const filters = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <ChapterView
      handbook={handbook}
      chapter={chapter}
      cards={cards}
      filters={filters}
      onFiltersChange={(next) => {
        void navigate({ search: next, replace: true })
      }}
    />
  )
}
