import { useEffect } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { CardRenderer } from "@/components/cards/CardRenderer"
import { Button } from "@/components/ui/button"
import { getAdjacentCards, getRelatedCardsInfo } from "@/lib/selectors"
import type { Card, HandbookBundle } from "@/lib/types"
import { useProgressStore } from "@/store/useProgressStore"

interface CardReaderProps {
  bundle: HandbookBundle
  card: Card
}

export function CardReader({ bundle, card }: CardReaderProps) {
  const navigate = useNavigate()
  const status = useProgressStore((s) => s.status[card.id])
  const bookmarked = useProgressStore((s) => s.bookmarks.includes(card.id))
  const revealed = useProgressStore((s) => s.revealed[card.id] ?? false)
  const setStatus = useProgressStore((s) => s.setStatus)
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark)
  const setRevealed = useProgressStore((s) => s.setRevealed)
  const setLastVisited = useProgressStore((s) => s.setLastVisited)

  useEffect(() => {
    setLastVisited(bundle.handbook.id, card.id)
  }, [bundle.handbook.id, card.id, setLastVisited])

  const relatedCards = getRelatedCardsInfo(card, bundle.cards)
  const { prev, next } = getAdjacentCards(bundle, card.id)

  const handleShare = (sharedCard: Card) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
    toast.success("Card link copied", { description: sharedCard.title })
  }

  return (
    <div
      data-card-reader
      className="mx-auto w-full max-w-(--reading-max-width) space-y-5"
    >
      <CardRenderer
        card={card}
        headingAs="h1"
        status={status}
        bookmarked={bookmarked}
        revealed={revealed}
        relatedCards={relatedCards}
        enableGlobalHotkeys
        onStatusChange={(nextStatus) => setStatus(card.id, nextStatus)}
        onToggleBookmark={() => toggleBookmark(card.id)}
        onRevealChange={(nextRevealed) => setRevealed(card.id, nextRevealed)}
        onShare={handleShare}
        onSelectRelated={(targetId) => {
          void navigate({
            to: "/$hb/t/$cardId",
            params: { hb: bundle.handbook.id, cardId: targetId },
          })
        }}
      />

      <nav
        aria-label="Card pagination"
        className="flex flex-wrap items-center justify-between gap-3"
      >
        {prev ? (
          <Button asChild variant="outline" size="sm" className="max-w-xs">
            <Link
              to="/$hb/t/$cardId"
              params={{ hb: bundle.handbook.id, cardId: prev.id }}
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{prev.title}</span>
            </Link>
          </Button>
        ) : (
          <div />
        )}

        {next && (
          <Button asChild variant="outline" size="sm" className="max-w-xs">
            <Link
              to="/$hb/t/$cardId"
              params={{ hb: bundle.handbook.id, cardId: next.id }}
            >
              <span className="truncate">{next.title}</span>
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Link>
          </Button>
        )}
      </nav>
    </div>
  )
}
