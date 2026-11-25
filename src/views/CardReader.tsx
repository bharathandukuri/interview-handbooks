import { useEffect } from "react"
import {
  HotkeysProvider,
  useFormatForDisplay,
  useHotkey,
} from "@tanstack/react-hotkeys"
import { Link, useNavigate } from "@tanstack/react-router"
import { ArrowLeft, ArrowRight, FastForward } from "lucide-react"
import { toast } from "sonner"
import { CardRenderer } from "@/components/cards/CardRenderer"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { appHotkeys, formatHotkeyLabel } from "@/lib/keyboard"
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
  const formatForDisplay = useFormatForDisplay()
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
  const chapter = bundle.handbook.chapters.find((c) => c.slug === card.chapter)

  const goToPrev = () => {
    if (!prev) return
    void navigate({
      to: "/$hb/t/$cardId",
      params: { hb: bundle.handbook.id, cardId: prev.id },
    })
  }

  const goToNext = () => {
    if (!next) return
    void navigate({
      to: "/$hb/t/$cardId",
      params: { hb: bundle.handbook.id, cardId: next.id },
    })
  }

  const goBackToChapter = () => {
    void navigate({
      to: "/$hb/c/$chapter",
      params: { hb: bundle.handbook.id, chapter: card.chapter },
    })
  }

  useHotkey(
    appHotkeys["card.prev"],
    (event) => {
      if (isInsideInteractiveWidget(event.target)) return
      goToPrev()
    },
    { enabled: Boolean(prev) }
  )

  useHotkey(
    appHotkeys["card.next"],
    (event) => {
      if (isInsideInteractiveWidget(event.target)) return
      goToNext()
    },
    { enabled: Boolean(next) }
  )

  useHotkey(
    "P",
    () => {
      goToPrev()
    },
    { ignoreInputs: true, enabled: Boolean(prev) }
  )

  useHotkey(
    "N",
    () => {
      goToNext()
    },
    { ignoreInputs: true, enabled: Boolean(next) }
  )

  useHotkey(appHotkeys["card.back"], () => {
    goBackToChapter()
  })

  const handleShare = (sharedCard: Card) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
    toast.success("Card link copied", {
      description: stripInlineCode(sharedCard.title),
    })
  }

  const prevKey = formatHotkeyLabel(
    appHotkeys["card.prev"].hotkey ?? "ArrowLeft",
    formatForDisplay
  )
  const nextKey = formatHotkeyLabel(
    appHotkeys["card.next"].hotkey ?? "ArrowRight",
    formatForDisplay
  )
  const backKey = formatHotkeyLabel(
    appHotkeys["card.back"].hotkey ?? "B",
    formatForDisplay
  )

  return (
    <div
      data-card-reader
      className="mx-auto w-full max-w-(--reading-max-width) space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <Button
          asChild
          variant="ghost"
          size="sm"
          title={`Back to ${chapter?.title ?? "chapter"} (${backKey})`}
          className="-ml-2 h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <Link
            to="/$hb/c/$chapter"
            params={{ hb: bundle.handbook.id, chapter: card.chapter }}
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>{chapter?.title ?? "Back"}</span>
            <Kbd className="hidden sm:inline-flex">{backKey}</Kbd>
          </Link>
        </Button>

        <div className="flex items-center gap-3 font-mono text-xs text-text-faint tabular-nums">
          {nextUnseen && nextUnseen.id !== next?.id && (
            <Link
              to="/$hb/t/$cardId"
              params={{ hb: bundle.handbook.id, cardId: nextUnseen.id }}
              title={`Jump to unseen card: ${stripInlineCode(nextUnseen.title)}`}
              className="inline-flex items-center gap-1 font-sans text-xs font-medium text-brand hover:underline"
            >
              <FastForward className="size-3" aria-hidden="true" />
              <span>Next unseen</span>
            </Link>
          )}
          {index >= 0 && (
            <span>
              {index + 1} / {total}
            </span>
          )}
        </div>
      </div>

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
        {prev ? (
          <Button
            asChild
            variant="outline"
            size="sm"
            title={`Previous card (${prevKey} or P)`}
            className="max-w-56 gap-2 sm:max-w-72"
          >
            <Link
              to="/$hb/t/$cardId"
              params={{ hb: bundle.handbook.id, cardId: prev.id }}
            >
              <Kbd>{prevKey}</Kbd>
              <span className="truncate">{stripInlineCode(prev.title)}</span>
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="gap-2">
            <ArrowLeft className="size-3.5 shrink-0" aria-hidden="true" />
            <span>Previous</span>
          </Button>
        )}

        {next ? (
          <Button
            asChild
            variant="outline"
            size="sm"
            title={`Next card (${nextKey} or N)`}
            className="max-w-56 gap-2 sm:max-w-72"
          >
            <Link
              to="/$hb/t/$cardId"
              params={{ hb: bundle.handbook.id, cardId: next.id }}
            >
              <span className="truncate">{stripInlineCode(next.title)}</span>
              <Kbd>{nextKey}</Kbd>
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="gap-2">
            <span>Next</span>
            <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
          </Button>
        )}
      </nav>
    </div>
  )
}
