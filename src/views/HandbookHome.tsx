import { Link } from "@tanstack/react-router"
import { ArrowRight, Bookmark, Layers, Zap } from "lucide-react"
import { ProgressRing } from "@/components/features/ProgressRing"
import { Button } from "@/components/ui/button"
import { getCardsForChapter, getProgressCounts } from "@/lib/selectors"
import type { HandbookBundle } from "@/lib/types"
import { useProgressStore } from "@/store/useProgressStore"

interface HandbookHomeProps {
  bundle: HandbookBundle
}

export function HandbookHome({ bundle }: HandbookHomeProps) {
  const statusMap = useProgressStore((s) => s.status)
  const bookmarks = useProgressStore((s) => s.bookmarks)
  const lastVisitedCardId = useProgressStore(
    (s) => s.lastVisited[bundle.handbook.id]
  )
  const { handbook } = bundle

  const overall = getProgressCounts(bundle.cards, statusMap)
  const lastCard = lastVisitedCardId
    ? bundle.cards.find((c) => c.id === lastVisitedCardId)
    : undefined
  const hbBookmarkCount = bundle.cards.filter((c) =>
    bookmarks.includes(c.id)
  ).length

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card) sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-xs text-muted-foreground">
              <span
                className="size-2 rounded-full bg-brand"
                aria-hidden="true"
              />
              <span>
                {handbook.chapterCount} chapters · {handbook.cardCount} cards
              </span>
            </div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {handbook.name} Interview Handbook
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {handbook.tagline}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4 rounded-xl border border-border bg-surface-2 px-4 py-3">
            <ProgressRing
              value={overall.percent}
              size={54}
              strokeWidth={4}
              showValue
              label={`${handbook.name} mastery`}
            />
            <div className="space-y-0.5 text-xs">
              <div className="font-medium text-foreground">
                {overall.known} / {overall.total} known
              </div>
              <div className="text-muted-foreground">
                {overall.revisit} revisit · {overall.untouched} untouched
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          {lastCard ? (
            <Button asChild size="sm">
              <Link
                to="/$hb/t/$cardId"
                params={{ hb: handbook.id, cardId: lastCard.id }}
              >
                <span>Resume: {lastCard.title}</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            bundle.cards[0] && (
              <Button asChild size="sm">
                <Link
                  to="/$hb/t/$cardId"
                  params={{ hb: handbook.id, cardId: bundle.cards[0].id }}
                >
                  <span>Start reading</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            )
          )}

          <Button asChild variant="outline" size="sm">
            <Link to="/$hb/flashcards" params={{ hb: handbook.id }}>
              <Layers className="size-4" aria-hidden="true" />
              <span>Flashcards</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm">
            <Link to="/$hb/revision" params={{ hb: handbook.id }}>
              <Zap className="size-4" aria-hidden="true" />
              <span>Quick Revision</span>
            </Link>
          </Button>

          <Button asChild variant="ghost" size="sm">
            <Link to="/$hb/bookmarks" params={{ hb: handbook.id }}>
              <Bookmark className="size-4" aria-hidden="true" />
              <span>Bookmarks ({hbBookmarkCount})</span>
            </Link>
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight">
          Chapters
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {handbook.chapters.map((chapter) => {
            const chapterCards = getCardsForChapter(bundle, chapter.slug)
            const counts = getProgressCounts(chapterCards, statusMap)
            return (
              <Link
                key={chapter.slug}
                to="/$hb/c/$chapter"
                params={{ hb: handbook.id, chapter: chapter.slug }}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-(--shadow-card) transition-all duration-(--duration-base) hover:border-[var(--accent-ring)] hover:shadow-(--shadow-card-hover)"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg" aria-hidden="true">
                        {chapter.emoji}
                      </span>
                      <h3 className="font-heading text-base font-semibold tracking-tight group-hover:text-brand">
                        {chapter.title}
                      </h3>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {chapter.description}
                    </p>
                  </div>
                  <ProgressRing
                    value={counts.percent}
                    size={28}
                    strokeWidth={3}
                    label={`${chapter.title} completion`}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between font-mono text-xs text-text-faint">
                  <span>
                    {counts.known}/{counts.total} known
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground group-hover:text-brand">
                    Open chapter
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
