import { Link } from "@tanstack/react-router"
import { ArrowRight, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CardFilterSearch } from "@/lib/search-params"
import { filterCards } from "@/lib/selectors"
import type { HandbookBundle } from "@/lib/types"
import { useProgressStore } from "@/store/useProgressStore"

interface FlashcardsViewProps {
  bundle: HandbookBundle
  filters: CardFilterSearch
}

export function FlashcardsView({ bundle, filters }: FlashcardsViewProps) {
  const statusMap = useProgressStore((s) => s.status)
  const deckCandidates = filterCards(
    bundle.cards.filter((c) => c.type === "question" || c.type === "predict"),
    filters,
    statusMap
  )

  return (
    <div className="mx-auto max-w-(--reading-max-width) space-y-6">
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card)">
        <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted-foreground">
          <Layers className="size-3.5 text-brand" aria-hidden="true" />
          <span>Flashcards Deck</span>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {bundle.handbook.name} Flashcards
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {deckCandidates.length} interactive question &amp; predict cards ready
          for active recall. Full 3D flip deck and re-queue flow arrive in M7.
        </p>

        {deckCandidates[0] && (
          <Button asChild size="sm" className="mt-5">
            <Link
              to="/$hb/t/$cardId"
              params={{
                hb: bundle.handbook.id,
                cardId: deckCandidates[0].id,
              }}
            >
              <span>Practice first card</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        )}
      </section>
    </div>
  )
}
