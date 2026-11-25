import { useEffect } from "react"
import { HotkeysProvider, useHotkey } from "@tanstack/react-hotkeys"
import { Link, useNavigate } from "@tanstack/react-router"
import { ArrowLeft, ArrowRight, FastForward } from "lucide-react"
import { toast } from "sonner"
import { CardRenderer } from "@/components/cards/CardRenderer"
import { Button } from "@/components/ui/button"
import { appHotkeys } from "@/lib/keyboard"
import {
  getAdjacentCards,
  getNextUnseenCard,
  getRelatedCardsInfo,
} from "@/lib/selectors"
import { stripInlineCode } from "@/lib/text"
import type { Card, HandbookBundle } from "@/lib/types"
import { useProgressStore } from "@/store/useProgressStore"

interface CardReaderProps {
  bundle: HandbookBundle
  card: Card
}

function isInsideInteractiveWidget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(
    target.closest(
      '[role="tablist"], [role="radiogroup"], [contenteditable="true"]'
    )
  )
}

export function CardReader({ bundle, card }: CardReaderProps) {
  return (
    <HotkeysProvider scope="card">
      <CardReaderContent bundle={bundle} card={card} />
    </HotkeysProvider>
  )
}

function CardReaderContent({ bundle, card }: CardReaderProps) {
  const navigate = useNavigate()
  const statusMap = useProgressStore((s) => s.status)
  const status = statusMap[card.id]
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
  const { prev, next, index, total } = getAdjacentCards(bundle, card.id)
  const nextUnseen = getNextUnseenCard(bundle, card.id, statusMap)

  useHotkey(
    appHotkeys["card.prev"],
    (event) => {
      if (!prev || isInsideInteractiveWidget(event.target)) return
      void navigate({
        to: "/$hb/t/$cardId",
        params: { hb: bundle.handbook.id, cardId: prev.id },
      })
    },
    { enabled: Boolean(prev) }
  )

  useHotkey(
    appHotkeys["card.next"],
    (event) => {
      if (!next || isInsideInteractiveWidget(event.target)) return
      void navigate({
        to: "/$hb/t/$cardId",
        params: { hb: bundle.handbook.id, cardId: next.id },
      })
    },
    { enabled: Boolean(next) }
  )

  const handleShare = (sharedCard: Card) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
    toast.success("Card link copied", {
      description: stripInlineCode(sharedCard.title),
    })
  }

  return (
    <div
      data-card-reader
      className="mx-auto w-full max-w-(--reading-max-width) space-y-5"
    >
      <CardRenderer
        key={card.id}
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
        <div className="flex items-center gap-2">
          {prev ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              title="Previous card (←)"
              className="max-w-52 sm:max-w-60"
            >
              <Link
                to="/$hb/t/$cardId"
                params={{ hb: bundle.handbook.id, cardId: prev.id }}
              >
                <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{stripInlineCode(prev.title)}</span>
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
              <span>Previous</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {index >= 0 && (
            <span className="hidden font-mono text-xs text-text-faint tabular-nums sm:inline">
              {index + 1} / {total}
            </span>
          )}

          {nextUnseen && (
            <Button
              asChild
              variant="secondary"
              size="sm"
              title={`Jump to unseen card: ${stripInlineCode(nextUnseen.title)}`}
            >
              <Link
                to="/$hb/t/$cardId"
                params={{ hb: bundle.handbook.id, cardId: nextUnseen.id }}
              >
                <FastForward
                  className="size-3.5 text-brand"
                  aria-hidden="true"
                />
                <span>Next unseen</span>
              </Link>
            </Button>
          )}

          {next ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              title="Next card (→)"
              className="max-w-52 sm:max-w-60"
            >
              <Link
                to="/$hb/t/$cardId"
                params={{ hb: bundle.handbook.id, cardId: next.id }}
              >
                <span className="truncate">{stripInlineCode(next.title)}</span>
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <span>Next</span>
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Button>
          )}
        </div>
      </nav>
    </div>
  )
}
