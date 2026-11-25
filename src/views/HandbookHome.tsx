import { Link } from "@tanstack/react-router"
import { ArrowRight, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getCardsForChapter, getProgressCounts } from "@/lib/selectors"
import { stripInlineCode } from "@/lib/text"
import type { HandbookBundle } from "@/lib/types"
import { useProgressStore } from "@/store/useProgressStore"

interface HandbookHomeProps {
  bundle: HandbookBundle
}

export function HandbookHome({ bundle }: HandbookHomeProps) {
  const statusMap = useProgressStore((s) => s.status)
  const lastVisitedCardId = useProgressStore(
    (s) => s.lastVisited[bundle.handbook.id]
  )
  const { handbook } = bundle

  const overall = getProgressCounts(bundle.cards, statusMap)
  const lastCard = lastVisitedCardId
    ? bundle.cards.find((c) => c.id === lastVisitedCardId)
    : undefined

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-card) sm:p-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-text-faint">
            <span className="size-2 rounded-full bg-brand" aria-hidden="true" />
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

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">
              {overall.known} of {overall.total} cards mastered
            </span>
            <span className="font-mono text-text-faint tabular-nums">
              {overall.percent}%
              {overall.revisit > 0 ? ` · ${overall.revisit} to revisit` : ""}
            </span>
          </div>
          <Progress value={overall.percent} className="h-1.5" />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {lastCard ? (
            <Button asChild size="sm">
              <Link
                to="/$hb/t/$cardId"
                params={{ hb: handbook.id, cardId: lastCard.id }}
              >
                <span>Resume: {stripInlineCode(lastCard.title)}</span>
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
                  <span>Start studying</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            )
          )}

          <Button asChild variant="outline" size="sm">
            <Link to="/$hb/flashcards" params={{ hb: handbook.id }}>
              <Layers className="size-4" aria-hidden="true" />
              <span>Practice flashcards</span>
            </Link>
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Chapters
          </h2>
          <span className="font-mono text-xs text-text-faint">
            Pick a topic to browse cards
          </span>
        </div>

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
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg" aria-hidden="true">
                        {chapter.emoji}
                      </span>
                      <h3 className="font-heading text-base font-semibold tracking-tight group-hover:text-brand">
                        {chapter.title}
                      </h3>
                    </div>
                    <ArrowRight
                      className="size-4 text-text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {chapter.description}
                  </p>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between font-mono text-[11px] text-text-faint tabular-nums">
                    <span>
                      {counts.total} {counts.total === 1 ? "card" : "cards"}
                    </span>
                    <span>{counts.known} known</span>
                  </div>
                  <Progress value={counts.percent} className="h-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
