import { useMemo, useState } from "react"
import {
  HotkeysProvider,
  useFormatForDisplay,
  useHotkey,
} from "@tanstack/react-hotkeys"
import { Link } from "@tanstack/react-router"
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Eye,
  Flame,
  HelpCircle,
  Layers,
  RefreshCw,
  RotateCcw,
  SkipForward,
  Sparkles,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { FilterBar } from "@/components/features/FilterBar"
import { ProgressBar } from "@/components/features/ProgressBar"
import { RichContent } from "@/components/features/RichContent"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import { InlineCodeTitle } from "@/components/ui/inline-code-title"
import { Kbd } from "@/components/ui/kbd"
import {
  applyAgain,
  applyGotIt,
  applySkip,
  buildFlashcardDeck,
  createFlashcardSession,
  flipFlashcard,
  getSessionProgressPercent,
  moveFlashcardCursor,
} from "@/lib/flashcards"
import { appHotkeys } from "@/lib/keyboard"
import type { CardFilterSearch } from "@/lib/search-params"
import { getChapterTags } from "@/lib/selectors"
import type { Card, HandbookBundle } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/store/useProgressStore"

interface FlashcardsViewProps {
  bundle: HandbookBundle
  filters: CardFilterSearch
  onFiltersChange: (next: CardFilterSearch) => void
}

function FlashcardFaceContent({
  card,
  chapterTitle,
  side,
  hbId,
  flipHotkeyLabel,
  isInactive = false,
  onFlip,
}: {
  card: Card
  chapterTitle: string
  side: "front" | "back"
  hbId: string
  flipHotkeyLabel: string
  isInactive?: boolean
  onFlip: () => void
}) {
  const options = Array.isArray(card.meta.options)
    ? (card.meta.options as string[])
    : undefined
  const correctIndex =
    typeof card.meta.answer === "number" ? card.meta.answer : undefined
  const correctOption =
    options && correctIndex !== undefined ? options[correctIndex] : undefined

  return (
    <div className="flex min-h-[340px] flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card) sm:p-7">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted-foreground uppercase">
              {card.type === "predict" ? (
                <Eye className="size-3 text-brand" aria-hidden="true" />
              ) : (
                <HelpCircle className="size-3 text-brand" aria-hidden="true" />
              )}
              <span>
                {card.type === "predict" ? "Predict output" : "Question"}
              </span>
            </span>
            <DifficultyBadge difficulty={card.difficulty} />
            {card.mostAsked && (
              <Badge
                variant="outline"
                className="gap-1 border-[color-mix(in_srgb,var(--accent-2)_45%,transparent)] bg-[color-mix(in_srgb,var(--accent-2)_14%,transparent)] text-foreground"
              >
                <Flame
                  className="size-3 text-[var(--medium)]"
                  aria-hidden="true"
                />
                <span>Most asked</span>
              </Badge>
            )}
          </div>

          <span className="font-mono text-xs text-text-faint">
            {side === "front" ? `${chapterTitle} · Prompt` : "Answer"}
          </span>
        </div>

        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          <InlineCodeTitle text={card.title} />
        </h2>

        {side === "front" ? (
          <div className="space-y-4">
            {card.type === "predict" ? (
              <>
                {card.sections.intro && (
                  <RichContent html={card.sections.intro} />
                )}
                {card.sections.code && (
                  <RichContent html={card.sections.code} />
                )}
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-surface-2/60 p-5 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  Recall the explanation before flipping.
                </p>
                <p className="mt-1 text-xs">
                  Explain it out loud or mentally outline edge cases, then flip
                  to verify.
                </p>
                {card.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[11px] text-text-faint"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {card.type === "question" ? (
              <RichContent html={card.sections.answer ?? ""} />
            ) : (
              <>
                {correctOption !== undefined && (
                  <div className="rounded-xl border border-[color-mix(in_srgb,var(--easy)_45%,transparent)] bg-[var(--easy-soft)] px-4 py-2.5 text-sm">
                    <span className="font-mono text-xs font-semibold text-[var(--easy)] uppercase">
                      Expected output:{" "}
                    </span>
                    <span className="font-mono font-medium text-foreground">
                      {correctOption}
                    </span>
                  </div>
                )}
                {card.sections.output && (
                  <RichContent html={card.sections.output} />
                )}
                {card.sections.explanation && (
                  <RichContent html={card.sections.explanation} />
                )}
              </>
            )}

            {card.revision.length > 0 && (
              <div className="rounded-xl border border-border bg-surface-2/60 p-3.5">
                <div className="mb-1.5 font-mono text-[11px] font-semibold tracking-wide text-brand uppercase">
                  Key takeaways
                </div>
                <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                  {card.revision.map((line, i) => (
                    <li key={i}>
                      <InlineCodeTitle text={line} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
        <Link
          to="/$hb/t/$cardId"
          params={{ hb: hbId, cardId: card.id }}
          tabIndex={isInactive ? -1 : undefined}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-brand"
        >
          <span>Open full card</span>
          <ExternalLink className="size-3" aria-hidden="true" />
        </Link>

        <Button
          type="button"
          variant={side === "front" ? "secondary" : "ghost"}
          size="sm"
          tabIndex={isInactive ? -1 : undefined}
          onClick={onFlip}
          className="gap-2 text-xs"
        >
          <RefreshCw className="size-3.5" aria-hidden="true" />
          <span>{side === "front" ? "Show answer" : "Show prompt"}</span>
          <Kbd className="hidden sm:inline-flex">{flipHotkeyLabel}</Kbd>
        </Button>
      </div>
    </div>
  )
}

interface FlashcardsDeckProps extends FlashcardsViewProps {
  includeKnown: boolean
  onIncludeKnownChange: (next: boolean) => void
}

function FlashcardsDeck({
  bundle,
  filters,
  includeKnown,
  onIncludeKnownChange,
  onFiltersChange,
}: FlashcardsDeckProps) {
  const statusMap = useProgressStore((s) => s.status)
  const setStatus = useProgressStore((s) => s.setStatus)
  const prefersReducedMotion = useReducedMotion() ?? false
  const formatForDisplay = useFormatForDisplay()

  const [session, setSession] = useState(() =>
    createFlashcardSession(
      buildFlashcardDeck(bundle, filters, statusMap, includeKnown)
    )
  )

  const eligibleCards = useMemo(
    () =>
      bundle.cards.filter((c) => c.type === "question" || c.type === "predict"),
    [bundle.cards]
  )
  const availableTags = useMemo(
    () => getChapterTags(eligibleCards),
    [eligibleCards]
  )
  const cardById = useMemo(
    () => new Map(bundle.cards.map((c) => [c.id, c])),
    [bundle.cards]
  )
  const chapterTitles = useMemo(
    () => new Map(bundle.handbook.chapters.map((c) => [c.slug, c.title])),
    [bundle.handbook.chapters]
  )

  const currentCardId = !session.complete
    ? session.queue[session.cursor]
    : undefined
  const currentCard = currentCardId ? cardById.get(currentCardId) : undefined
  const isActive = Boolean(currentCard && !session.complete)

  const flipKey = formatForDisplay(
    appHotkeys["flashcard.flip"].hotkey ?? "Space"
  )
  const againKey = formatForDisplay(appHotkeys["flashcard.again"].hotkey ?? "1")
  const gotItKey = formatForDisplay(appHotkeys["flashcard.gotIt"].hotkey ?? "2")

  const handleFlip = () => {
    setSession((prev) => flipFlashcard(prev))
  }

  const handleGotIt = () => {
    setSession((prev) => {
      const result = applyGotIt(prev)
      if (result.cardId) {
        setStatus(result.cardId, "known")
      }
      return result.session
    })
  }

  const handleAgain = () => {
    setSession((prev) => {
      const result = applyAgain(prev)
      if (result.cardId) {
        setStatus(result.cardId, "revisit")
      }
      return result.session
    })
  }

  const handleSkip = () => {
    setSession((prev) => applySkip(prev).session)
  }

  const handleRestart = (overrideIncludeKnown?: boolean) => {
    if (
      overrideIncludeKnown !== undefined &&
      overrideIncludeKnown !== includeKnown
    ) {
      onIncludeKnownChange(overrideIncludeKnown)
      return
    }
    const freshDeck = buildFlashcardDeck(
      bundle,
      filters,
      useProgressStore.getState().status,
      overrideIncludeKnown ?? includeKnown
    )
    setSession(createFlashcardSession(freshDeck))
  }

  useHotkey(appHotkeys["flashcard.flip"], handleFlip, { enabled: isActive })
  useHotkey(appHotkeys["flashcard.again"], handleAgain, { enabled: isActive })
  useHotkey(appHotkeys["flashcard.gotIt"], handleGotIt, { enabled: isActive })
  useHotkey(
    appHotkeys["card.prev"],
    () => setSession((prev) => moveFlashcardCursor(prev, -1)),
    { enabled: isActive && session.cursor > 0 }
  )
  useHotkey(
    appHotkeys["card.next"],
    () => setSession((prev) => moveFlashcardCursor(prev, 1)),
    { enabled: isActive && session.cursor < session.queue.length - 1 }
  )

  const progressPercent = getSessionProgressPercent(session)

  return (
    <div className="mx-auto max-w-(--reading-max-width) space-y-5">
      <header className="rounded-2xl border border-border bg-surface p-5 shadow-(--shadow-card) sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted-foreground">
              <Layers className="size-3.5 text-brand" aria-hidden="true" />
              <span>Active Recall Deck</span>
            </div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {bundle.handbook.name} Flashcards
            </h1>
            <p className="text-xs text-muted-foreground">
              Space to flip · 1 Again (re-queue) · 2 Got it (Known) · ←/→ step
            </p>
          </div>

          <div
            role="group"
            aria-label="Deck card filter mode"
            className="inline-flex rounded-lg border border-border bg-surface-2 p-0.5"
          >
            <Button
              type="button"
              variant={!includeKnown ? "secondary" : "ghost"}
              size="xs"
              aria-pressed={!includeKnown}
              onClick={() => onIncludeKnownChange(false)}
            >
              Due (not known)
            </Button>
            <Button
              type="button"
              variant={includeKnown ? "secondary" : "ghost"}
              size="xs"
              aria-pressed={includeKnown}
              onClick={() => onIncludeKnownChange(true)}
            >
              All cards
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <FilterBar
            filters={filters}
            availableTags={availableTags}
            totalCount={eligibleCards.length}
            visibleCount={session.queue.length}
            onChange={onFiltersChange}
          />
        </div>

        {session.queue.length > 0 && (
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs text-text-faint tabular-nums">
              <span>
                {session.complete
                  ? `Reviewed ${session.reviewedCount} steps`
                  : `Card ${session.cursor + 1} of ${session.queue.length}`}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <ProgressBar
              value={progressPercent}
              label="Flashcard session progress"
            />
          </div>
        )}
      </header>

      {session.queue.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
          <Sparkles
            className="mx-auto mb-3 size-6 text-brand"
            aria-hidden="true"
          />
          <p className="text-base font-semibold text-foreground">
            {!includeKnown && eligibleCards.length > 0
              ? "All matching flashcards are already marked Known!"
              : "No flashcards match the active filters."}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {!includeKnown && eligibleCards.length > 0
              ? "Switch to All cards to review everything again or adjust filters above."
              : "Clear one or more filters to reload question and predict cards."}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {!includeKnown && eligibleCards.length > 0 && (
              <Button
                type="button"
                size="sm"
                onClick={() => handleRestart(true)}
              >
                Practice all cards
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onFiltersChange({})}
            >
              Reset filters
            </Button>
          </div>
        </div>
      ) : session.complete ? (
        <section
          data-slot="flashcards-summary"
          className="rounded-2xl border border-border bg-surface p-6 text-center shadow-(--shadow-card) sm:p-8"
        >
          <Sparkles
            className="mx-auto mb-3 size-7 text-[var(--easy)]"
            aria-hidden="true"
          />
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Session complete!
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You finished this flashcard round in {bundle.handbook.name}.
          </p>

          <div className="mx-auto mt-6 grid max-w-lg grid-cols-3 gap-3 text-left">
            <div className="rounded-xl border border-border bg-surface-2/60 px-3.5 py-3">
              <div className="font-mono text-xl font-semibold text-[var(--easy)] tabular-nums">
                {session.gotItIds.length}
              </div>
              <div className="text-xs text-muted-foreground">Marked known</div>
            </div>
            <div className="rounded-xl border border-border bg-surface-2/60 px-3.5 py-3">
              <div className="font-mono text-xl font-semibold text-[var(--medium)] tabular-nums">
                {session.againIds.length}
              </div>
              <div className="text-xs text-muted-foreground">
                Flagged revisit
              </div>
            </div>
            <div className="rounded-xl border border-border bg-surface-2/60 px-3.5 py-3">
              <div className="font-mono text-xl font-semibold text-foreground tabular-nums">
                {session.skippedIds.length}
              </div>
              <div className="text-xs text-muted-foreground">Skipped</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            <Button type="button" onClick={() => handleRestart()}>
              <RotateCcw className="size-4" aria-hidden="true" />
              <span>Restart session</span>
            </Button>
            {!includeKnown && eligibleCards.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleRestart(true)}
              >
                Practice all cards
              </Button>
            )}
            <Button asChild variant="secondary">
              <Link to="/$hb/progress" params={{ hb: bundle.handbook.id }}>
                <BarChart3 className="size-4" aria-hidden="true" />
                <span>View progress</span>
              </Link>
            </Button>
          </div>
        </section>
      ) : (
        currentCard && (
          <div className="space-y-4">
            {prefersReducedMotion ? (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${currentCard.id}-${session.flipped ? "back" : "front"}`}
                  data-slot="flashcard-stage"
                  data-motion="fade"
                  data-flipped={session.flipped ? "true" : "false"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  <FlashcardFaceContent
                    card={currentCard}
                    chapterTitle={
                      chapterTitles.get(currentCard.chapter) ??
                      currentCard.chapter
                    }
                    side={session.flipped ? "back" : "front"}
                    hbId={bundle.handbook.id}
                    flipHotkeyLabel={flipKey}
                    onFlip={handleFlip}
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div
                className="perspective-[1200px]"
                data-slot="flashcard-stage"
                data-motion="3d"
                data-flipped={session.flipped ? "true" : "false"}
              >
                <motion.div
                  animate={{ rotateY: session.flipped ? 180 : 0 }}
                  transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="grid"
                >
                  <div
                    aria-hidden={session.flipped}
                    className={cn(
                      "col-start-1 row-start-1 [backface-visibility:hidden]",
                      session.flipped
                        ? "pointer-events-none select-none"
                        : "z-10"
                    )}
                  >
                    <FlashcardFaceContent
                      card={currentCard}
                      chapterTitle={
                        chapterTitles.get(currentCard.chapter) ??
                        currentCard.chapter
                      }
                      side="front"
                      hbId={bundle.handbook.id}
                      flipHotkeyLabel={flipKey}
                      isInactive={session.flipped}
                      onFlip={handleFlip}
                    />
                  </div>

                  <div
                    aria-hidden={!session.flipped}
                    className={cn(
                      "col-start-1 row-start-1 [transform:rotateY(180deg)] [backface-visibility:hidden]",
                      session.flipped
                        ? "z-10"
                        : "pointer-events-none select-none"
                    )}
                  >
                    <FlashcardFaceContent
                      card={currentCard}
                      chapterTitle={
                        chapterTitles.get(currentCard.chapter) ??
                        currentCard.chapter
                      }
                      side="back"
                      hbId={bundle.handbook.id}
                      flipHotkeyLabel={flipKey}
                      isInactive={!session.flipped}
                      onFlip={handleFlip}
                    />
                  </div>
                </motion.div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3 shadow-(--shadow-card)">
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={session.cursor <= 0}
                  onClick={() =>
                    setSession((prev) => moveFlashcardCursor(prev, -1))
                  }
                  aria-label="Previous flashcard"
                  title="Previous (←)"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={session.cursor >= session.queue.length - 1}
                  onClick={() =>
                    setSession((prev) => moveFlashcardCursor(prev, 1))
                  }
                  aria-label="Next flashcard"
                  title="Next (→)"
                >
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleFlip}
                  className="gap-1.5"
                >
                  <RefreshCw className="size-3.5" aria-hidden="true" />
                  <span>Flip</span>
                  <Kbd className="hidden sm:inline-flex">{flipKey}</Kbd>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAgain}
                  className="gap-1.5 border-[color-mix(in_srgb,var(--medium)_45%,transparent)] text-[var(--medium)] hover:bg-[var(--medium-soft)]"
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  <span>Again</span>
                  <Kbd className="hidden sm:inline-flex">{againKey}</Kbd>
                </Button>

                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleGotIt}
                  className="gap-1.5 bg-[var(--easy)] text-[var(--accent-fg)] hover:bg-[var(--easy)]/90"
                >
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  <span>Got it</span>
                  <Kbd className="hidden bg-black/15 text-inherit sm:inline-flex">
                    {gotItKey}
                  </Kbd>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="gap-1.5 text-muted-foreground"
                >
                  <SkipForward className="size-3.5" aria-hidden="true" />
                  <span>Skip</span>
                </Button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export function FlashcardsView(props: FlashcardsViewProps) {
  const [includeKnown, setIncludeKnown] = useState(false)
  const deckKey = `${props.bundle.handbook.id}|${includeKnown ? "all" : "due"}|${JSON.stringify(props.filters)}`

  return (
    <HotkeysProvider scope="flashcards">
      <FlashcardsDeck
        key={deckKey}
        {...props}
        includeKnown={includeKnown}
        onIncludeKnownChange={setIncludeKnown}
      />
    </HotkeysProvider>
  )
}
