import { createFileRoute, notFound } from "@tanstack/react-router"
import { loadHandbookBundle } from "@/lib/content"
import { CardReader } from "@/views/CardReader"
import { NotFound } from "@/views/NotFound"

export const Route = createFileRoute("/$hb/t/$cardId")({
  loader: async ({ params }) => {
    const bundle = await loadHandbookBundle(params.hb)
    const card = bundle.cards.find((c) => c.id === params.cardId)
    if (!card) throw notFound()
    return { bundle, card }
  },
  component: CardReaderRoute,
  notFoundComponent: () => <NotFound title="Card not found" />,
})

function CardReaderRoute() {
  const { bundle, card } = Route.useLoaderData()
  return <CardReader bundle={bundle} card={card} />
}
